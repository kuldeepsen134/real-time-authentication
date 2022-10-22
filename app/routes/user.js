var router = require('express').Router();
const { users } = require('../controllers/index');

module.exports = app => {
	router.post('/register', users.create);
	router.put('/users/:id', users.update);
	router.get('/users', users.findAll);
	router.get('/users/:id', users.findOne);
	router.delete('/users/:id', users.delete);

	app.use('/', router);
};