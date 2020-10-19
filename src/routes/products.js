// ************ Require's ************
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');


// ************ Controller Require ************
const productsController = require('../controllers/productsController');
const validator = require('../middlewares/routeMiddlewares/validator');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images/products'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const acceptedExt = [".jpg", ".jpeg", ".png"];
        const ext = path.extname(file.originalname);
        if (!acceptedExt.includes(ext)) {
            req.file = file;
        }
        cb(null, acceptedExt.includes(ext));
    },
});

/*** GET ALL PRODUCTS ***/
router.get('/', productsController.index);

/*** CREATE ONE PRODUCT ***/
router.get('/create', productsController.create);
router.post('/store', upload.single('imagen'), validator.product, productsController.store);

/*** GET ONE PRODUCT ***/
router.get('/:id', productsController.detail);

/*** EDIT ONE PRODUCT ***/
router.get('/edit/:id', productsController.edit);
router.put('/edit/:id', productsController.update);


/*** DELETE ONE PRODUCT***/
router.delete('/:id', productsController.destroy);

module.exports = router;
