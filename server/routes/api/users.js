const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/user.controller');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(usersController.getAllUsers)
    .delete(usersController.deleteUser);

router.route('/:id')
    .get(usersController.getUser);

module.exports = router;