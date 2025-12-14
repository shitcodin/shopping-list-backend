const express = require('express');
const requireAuth = require('../../middlewares/auth.middleware');
const { authorizeProfiles } = require('../../middlewares/authorize.middleware');
const controller = require('./shoppingList.controller');

const router = express.Router();
const allowedRoles = ['Authorities', 'Users'];

router.use(requireAuth);
router.use(authorizeProfiles(allowedRoles));

router.post('/create', controller.create);
router.post('/list', controller.list);
router.post('/get', controller.get);
router.post('/update', controller.update);
router.post('/delete', controller.remove);

module.exports = router;
