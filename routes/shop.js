const express = require('express');
const router = express.Router();
const Product = require('../models/shop');
let itemsPerPage = 6;

router.get('/', (req, res) => {
	// console.log(id);
	res.render('shop/index', {
		path: 'home',
		yes: 'no',
	});
});
router.get('/about', (req, res) => {
	res.render('shop/about', {
		path: 'about',
	});
});
router.get('/products', async (req, res) => {
	try {
		const page = +req.query.page || 1;
		let totalItems;
		totalItems = await Product.countDocuments();
		let products = await Product.find({}, null, { sort: { date: -1 } })
			.skip((page - 1) * itemsPerPage)
			.limit(itemsPerPage);

		res.render('shop/products', {
			path: 'products',
			products: products,
			currentPage: page,
			hasNextPage: itemsPerPage * page < totalItems,
			hasPreviousPage: page > 1,
			nextPage: page + 1,
			previousPage: page - 1,
			lastPage: Math.ceil(totalItems / itemsPerPage),
			firstPage: 1,
		});
	} catch (err) {
		res.status(500).render('500', {
			pageTitle: 'Error!',
			path: '/500',
			isAuthenticated: req.session.isLoggedIn,
		});
	}
});
router.get('/contact', (req, res) => {
	res.render('shop/contact', {
		path: 'contact',
	});
});
module.exports = router;
