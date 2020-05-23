require('dotenv').config();
const express = require('express');
const { body, validationResult } = require('express-validator/check');
var unirest = require('unirest');
const router = express.Router();
const rq = unirest('GET', process.env.fast2smsApi);

router.post('/feedback', (req, res) => {
	rq.query({
		authorization: process.env.authorization,
		sender_id: 'FSTSMS',
		message:
			'[Name: ' +
			req.body.name +
			'] [mobile no : ' +
			req.body.number +
			'] ' +
			req.body.message,
		language: 'english',
		route: 'p',
		numbers: process.env.mobileNo,
	});

	rq.headers({
		'cache-control': 'no-cache',
	});

	rq.end(function (rs) {
		if (rs.error) throw new Error(rs.error);

		// (rs.body)console.log;
	});

	res.redirect('/contact');
});

router.post('/enquiry', (req, res) => {
	rq.query({
		authorization: process.env.authorization,
		sender_id: 'FSTSMS',
		message:
			'[name: ' +
			req.body.name +
			']   [mobile no.: ' +
			req.body.number +
			']   [ProductID: ' +
			req.body.ProductID +
			']   [' +
			req.body.Ask +
			']',
		language: 'english',
		route: 'p',
		numbers: process.env.mobileNo,
	});

	rq.headers({
		'cache-control': 'no-cache',
	});

	rq.end(function (rs) {
		if (rs.error) {
			res.status(500).render('500', {
				pageTitle: 'Error!',
				path: '/500',
				isAuthenticated: req.session.isLoggedIn,
			});
		}
		// console.log(rs.body);
	});
	res.redirect('/products');
});

module.exports = router;
