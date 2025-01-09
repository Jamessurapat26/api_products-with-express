const { body } = require("express-validator");

const createUser = [
    body('username').notEmpty().isLength({ min: 5 }).withMessage('Username not in condition'),
    body('password').notEmpty().isLength({ min: 6 }),
    body('full_name').notEmpty(),
    body('role').notEmpty(),
]

const updateUser = [
    body('username').notEmpty().isLength({ min: 5 }).withMessage('Username not in condition'),
    body('password').notEmpty().isLength({ min: 6 }),
    body('full_name').notEmpty(),
    body('role').notEmpty(),
]
module.exports = {
    createUser, updateUser
}