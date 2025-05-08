const express = require("express");

const { allUsers, createUser, getUser, updateUser, deleteUser } = require('./../controllers/userController');
const { signup, login } = require("./../controllers/authController");

const routes = express.Router();


routes.route('/signup').post(signup);
routes.route('/login').post(login);
routes.route('/').get(allUsers).post(createUser);
routes.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = routes;
