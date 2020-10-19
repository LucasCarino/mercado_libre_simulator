const fs = require('fs');
const path = require('path');
const multer = require('multer');

const { validationResult } = require('express-validator');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', { products, toThousand });
	},
	// Detail - Detail from one product
	detail: (req, res) => {
		idProducto = req.params.id;
		let producto = products.find((producto) => producto.id == req.params.id);
		res.render('detail', { producto, toThousand })
	},
	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form');
	},
	// Create -  Method to store
	store: (req, res) => {

		const errors = validationResult(req);

		if (errors.isEmpty()) {
			newProduct = {
				id: products[products.length - 1].id + 1,
				...req.body,
				image: req.file.filename
			}
			let newDB = JSON.stringify([...products, newProduct], null, 2);
			fs.writeFileSync(productsFilePath, newDB);
			res.redirect('/');
		} else {
			res.render("product-create-form", { errors: errors.errors });
		}
	},

	// Update - Form to edit
	edit: (req, res) => {
		let producto = products.find((producto) => producto.id == req.params.id);
		res.render('product-edit-form', { producto })
	},
	// Update - Method to update
	update: (req, res) => {
		let producto = products.find((producto) => producto.id == req.params.id);
		let updatedProduct = {
			id: req.params.id,
			category: req.body.category,
			name: req.body.name,
			price: req.body.price,
			discount: req.body.discount,
			description: req.body.description,
			image: producto.image
		}
		let indice = products.indexOf(producto);
		products[indice] = updatedProduct;
		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
		res.redirect('/')
	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		let newDB = products.filter(producto => producto.id != req.params.id);
		fs.writeFileSync(productsFilePath, JSON.stringify(newDB));
		res.redirect('/');
	}
};

module.exports = controller;