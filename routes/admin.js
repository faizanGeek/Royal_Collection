const generateUniqueId = require('generate-unique-id');
const express = require('express');
const { body, validationResult } = require('express-validator/check');
const router = express.Router();
const Product = require('../models/shop');
const sharp = require('sharp');
const fileHelper = require('../util/file');
const isAuth = require('../middleware/isAuth');

router.get('/addProducts', isAuth, (req, res) => {
	res.render('shop/addProducts', {
		pageTitle: 'Add Product',
		imgError: false,
		errorMessage: '',
		validationErrors: [],
		hasError: false,
	});
});
//addProducts
router.post(
	'/addProducts',
	[body('title').isString().isLength({ min: 3 }).trim(), body('price').isInt()],
	isAuth,
	async (req, res) => {
		const id = generateUniqueId({
			length: 5,
			useLetters: false,
		});
		title = req.body.title;
		price = req.body.price;
		if (req.file) {
			imageUrl = req.file.filename;
		}

		if (!req.file) {
			//console.log('df');
			return res.status(422).render('shop/addProducts', {
				pageTitle: 'Add Product',
				imgError: true,
				errorMessage: 'Attached file is not an image.',
				validationErrors: [],
				hasError: true,
			});
		}
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log(errors.array());
			return res.status(422).render('shop/addProducts', {
				pageTitle: 'Add Product',
				imgError: false,
				errorMessage: errors.array()[0].msg,
				validationErrors: errors.array(),
				hasError: true,
			});
		}

		sharp(req.file.path)
			.resize(370, 200)
			.toFile('images/rImage/' + req.file.filename)
			.then(data => {
				console.log('done');
			})
			.catch(err => {
				res.status(500).render('500', {
					pageTitle: 'Error!',
					path: '/500',
					isAuthenticated: req.session.isLoggedIn,
				});
			});

		const product = new Product({
			title: title,
			price: price,
			imageUrl: imageUrl,
			id: id,
		});
		console.log(product);
		try {
			await product.save();
			res.redirect('/products');
		} catch (err) {
			res.status(500).render('500', {
				pageTitle: 'Error!',
				path: '/500',
				isAuthenticated: req.session.isLoggedIn,
			});
		}
	}
);
//delete products
router.post('/delete', isAuth, async (req, res) => {
	const id = req.body.deleteId;
	try {
		let product = await Product.findById(id);
		fileHelper.deleteFile('images/' + product.imageUrl);
		fileHelper.deleteFile('images/rImage/' + product.imageUrl);
		await Product.deleteOne({ _id: id });
		res.redirect('/products');
	} catch (err) {
		res.status(500).render('500', {
			pageTitle: 'Error!',
			path: '/500',
			isAuthenticated: req.session.isLoggedIn,
		});
	}
});
module.exports = router;
