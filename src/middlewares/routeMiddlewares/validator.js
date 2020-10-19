const { body } = require('express-validator');
const path = require('path');

module.exports = {
    product: [
        body('name').notEmpty()
            .withMessage('El nombre del producto es un campo obligatorio'),
        body('price').notEmpty()
            .withMessage('El precio del producto es un campo obligatorio')
            .isInt()
            .withMessage('El precio del producto debe contener un número'),
        body('imagen')
            .custom((value, { req }) => {
                if (req.file) {
                    return true;
                }
                return false;
            })
            .withMessage('La imagen del producto es un campo obligatorio')
            .bail()
            .custom((value, { req }) => {
                const acceptedExt = [".jpg", ".jpeg", ".png"];
                const ext = path.extname(req.file.originalname);
                return acceptedExt.includes(ext);
            })
            .withMessage('El archivo de la imagen no es válido')
    ]
}