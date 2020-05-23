const express = require('express');
const router = express.Router();

router.post('/', (req, res, next) => {
	if (req.body.key === 'royalsuhail') {
		req.session.isLoggedIn = true;
		req.session.user = 'royalsuhail';
		return req.session.save(err => {
			//console.log(err);
			res.redirect('/');
		});
	}
	return res.status(422).render('shop/index', {
		pageTitle: 'Error',
		path: 'home',
		error: 'Wrong key',
		oldKey: req.body.key,
	});
});
router.post('/logout', (req, res, next) => {
	req.session.destroy(err => {
		// console.log(err);
		res.redirect('/');
	});
});

module.exports = router;
