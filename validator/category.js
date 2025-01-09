const { body } = require("express-validator");

const createCategory = [
    body('id').notEmpty().isInt(),
    body('category').notEmpty().isLength({ min: 5 }).withMessage('Category not in condition'),
]

const updateCategory = [
    body('category').notEmpty().isLength({ min: 5 }).withMessage('Category not in condition'),

]

module.exports = {
    createCategory, updateCategory
}