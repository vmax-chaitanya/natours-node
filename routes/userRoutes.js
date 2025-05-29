const express = require('express');

const {
  allUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getMe,
} = require('./../controllers/userController');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  restrictTo
} = require('./../controllers/authController');

const routes = express.Router();

routes.route('/signup').post(signup);
routes.route('/login').post(login);
routes.route('/forgotPassword').post(forgotPassword);
routes.route('/resetPassword/:token').patch(resetPassword);

//protected the routes below routes using middlewere
routes.use(protect);

///this route middlewere will protect the below routes access for admin and lead guide
routes.use(restrictTo('admin', 'lead-guide'));

routes.get('/me', getMe, getUser)
routes.route('/').get(allUsers).post(createUser);
routes.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = routes;
