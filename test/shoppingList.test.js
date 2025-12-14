process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const ShoppingList = require('../src/models/shoppingList');

let mongoServer;

function createToken(userId, role = 'Users') {
  return jwt.sign({ sub: userId, role }, process.env.JWT_SECRET);
}

function authHeader(userId, role) {
  return `Bearer ${createToken(userId, role)}`;
}

async function seedShoppingList(owner, overrides = {}) {
  const doc = await ShoppingList.create({
    name: overrides.name || `${owner} list`,
    items: overrides.items || [],
    owner,
  });

  return doc.toObject({ versionKey: false });
}

describe('Shopping List uuCmds', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        ip: '127.0.0.1',
        port: 27017,
      },
    });
    await mongoose.connect(mongoServer.getUri(), {});
  });

  afterEach(async () => {
    if (mongoose.connection.readyState) {
      await mongoose.connection.db.dropDatabase();
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  describe('POST /shoppingList/create', () => {
    it('creates shopping list owned by the authenticated user', async () => {
      const response = await request(app)
        .post('/shoppingList/create')
        .set('Authorization', authHeader('user-1', 'Users'))
        .send({ name: 'Groceries', items: ['item-1'] });

      expect(response.status).toBe(201);
      expect(response.body.data.owner).toBe('user-1');
      expect(response.body.data.items).toEqual(['item-1']);
    });

    it('returns invalidDtoIn when items is not an array', async () => {
      const response = await request(app)
        .post('/shoppingList/create')
        .set('Authorization', authHeader('user-1', 'Users'))
        .send({ name: 'Bad payload', items: 'nope' });

      expect(response.status).toBe(400);
      expect(response.body.uuAppErrorMap.invalidDtoIn).toBeDefined();
    });
  });

  describe('POST /shoppingList/list', () => {
    it('returns only shopping lists owned by the user', async () => {
      await seedShoppingList('user-1', { name: 'First' });
      await seedShoppingList('user-2', { name: 'Second' });

      const response = await request(app)
        .post('/shoppingList/list')
        .set('Authorization', authHeader('user-1', 'Users'))
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.data.total).toBe(1);
      expect(response.body.data.itemList[0].owner).toBe('user-1');
    });

    it('fails with notAuthenticated when token is missing', async () => {
      const response = await request(app).post('/shoppingList/list').send({});

      expect(response.status).toBe(401);
      expect(response.body.uuAppErrorMap.notAuthenticated).toBeDefined();
    });
  });

  describe('POST /shoppingList/get', () => {
    it('returns the shopping list for its owner', async () => {
      const list = await seedShoppingList('user-1', { name: 'Owner list' });

      const response = await request(app)
        .post('/shoppingList/get')
        .set('Authorization', authHeader('user-1', 'Users'))
        .send({ id: list._id.toString() });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Owner list');
    });

    it('denies access to non-owners', async () => {
      const list = await seedShoppingList('user-1');

      const response = await request(app)
        .post('/shoppingList/get')
        .set('Authorization', authHeader('user-2', 'Users'))
        .send({ id: list._id.toString() });

      expect(response.status).toBe(403);
      expect(response.body.uuAppErrorMap.forbiddenNotOwner).toBeDefined();
    });
  });

  describe('POST /shoppingList/update', () => {
    it('allows owner to update items', async () => {
      const list = await seedShoppingList('user-1', { items: ['item-1'] });

      const response = await request(app)
        .post('/shoppingList/update')
        .set('Authorization', authHeader('user-1', 'Users'))
        .send({ id: list._id.toString(), items: ['item-2'] });

      expect(response.status).toBe(200);
      expect(response.body.data.items).toEqual(['item-2']);
    });

    it('denies updates from non-owners', async () => {
      const list = await seedShoppingList('user-1');

      const response = await request(app)
        .post('/shoppingList/update')
        .set('Authorization', authHeader('user-2', 'Users'))
        .send({ id: list._id.toString(), items: ['item-3'] });

      expect(response.status).toBe(403);
      expect(response.body.uuAppErrorMap.forbiddenNotOwner).toBeDefined();
    });
  });

  describe('POST /shoppingList/delete', () => {
    it('allows owner to delete and prevents future access', async () => {
      const list = await seedShoppingList('user-1');

      const deleteResponse = await request(app)
        .post('/shoppingList/delete')
        .set('Authorization', authHeader('user-1', 'Users'))
        .send({ id: list._id.toString() });

      expect(deleteResponse.status).toBe(200);

      const getResponse = await request(app)
        .post('/shoppingList/get')
        .set('Authorization', authHeader('user-1', 'Users'))
        .send({ id: list._id.toString() });

      expect(getResponse.status).toBe(404);
      expect(getResponse.body.uuAppErrorMap.shoppingListNotFound).toBeDefined();
    });

    it('denies deletion by non-owners', async () => {
      const list = await seedShoppingList('user-1');

      const response = await request(app)
        .post('/shoppingList/delete')
        .set('Authorization', authHeader('user-2', 'Users'))
        .send({ id: list._id.toString() });

      expect(response.status).toBe(403);
      expect(response.body.uuAppErrorMap.forbiddenNotOwner).toBeDefined();
    });
  });
});
