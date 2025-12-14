const express = require('express');
const authRoutes = require('./modules/auth/auth.routes');
const shoppingListRoutes = require('./modules/shoppingList/shoppingList.routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/shoppingList', shoppingListRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
