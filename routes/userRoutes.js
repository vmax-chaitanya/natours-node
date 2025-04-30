const express = require("express");

const { allUsers, createUser, getUser, updateUser, deleteUser } = require('./../controllers/userController')

const routes = express.Router();

routes.route('/').get(allUsers).post(createUser);
routes.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = routes;
