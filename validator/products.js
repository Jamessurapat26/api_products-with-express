const { body } = require("express-validator");

const createProduct = [
    body('name').notEmpty(),
    body('price').notEmpty(),
    body('category').notEmpty(),
]

const updateProduct = [
    body('name').notEmpty(),
    body('price').notEmpty(),
    body('category').notEmpty(),
]

module.exports = {
    createProduct, updateProduct
}