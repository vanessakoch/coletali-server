const express = require('express');
const routes = express.Router();
const multer = require('multer');
const uploadConfig = require('./config/upload');

const upload = multer(uploadConfig);

const ItemsController = require('./controllers/ItemsController');
const UsersController = require('./controllers/UsersController');
const AddressesController = require('./controllers/AddressesController');
const CollectController = require('./controllers/CollectController');
const DonateController = require('./controllers/DonateController');

const AddressValidation = require('./validations/AddressValidation');
const UserValidation = require('./validations/UserValidation');
const CollectionPointValidation = require('./validations/CollectionPointValidation');
const DonationPointValidation = require('./validations/DonationPointValidation');

const itemsController = new ItemsController();
const usersController = new UsersController();
const addressesController = new AddressesController();
const collectController = new CollectController();
const donateController = new DonateController();

routes.get('/items', itemsController.index);

routes.get('/user', usersController.index);
routes.get('/user/:id', usersController.show);
routes.delete('/user/:id', usersController.delete);
routes.put('/user/edit/:id', usersController.update);

routes.get('/user/list/:id', usersController.collectList);

routes.post('/user', UserValidation, usersController.create);

routes.get('/address', addressesController.index);
routes.get('/address/:id', addressesController.show);
routes.delete('/address/:id', addressesController.delete);
routes.put('/address/edit/:id', addressesController.update);

routes.post('/address', AddressValidation, addressesController.create);

routes.get('/collect', collectController.index);
routes.get('/collect/all', collectController.all);
routes.get('/collect/:id', collectController.show);
routes.delete('/collect/:id', collectController.delete);
routes.put('/collect/edit/:id', upload.single('image'), collectController.update);

routes.post('/collect', upload.single('image'), CollectionPointValidation, collectController.create);

routes.get('/donate', donateController.index);
routes.get('/donate/all', donateController.all);
routes.get('/donate/:id', donateController.show);
routes.delete('/donate/:id', donateController.delete);
routes.put('/donate/edit/:id', upload.single('image'), donateController.update);

routes.post('/donate', upload.single('image'), DonationPointValidation, donateController.create);

routes.post('/signup', usersController.create);
routes.get('/login', usersController.login);

routes.get('/me', usersController.auth, (request, response) => {
  response.send(request.auth);
});

module.exports = routes;