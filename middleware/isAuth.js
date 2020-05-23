module.exports = (req, res, next) => {
	if (!req.session.isLoggedIn) {
		return res.render('isAuth', {
			pageTitle: 'Page Not Found',
			path: '/404',
			isAuthenticated: req.session.isLoggedIn,
		});
	}
	next();
};
