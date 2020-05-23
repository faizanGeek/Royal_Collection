require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const multer = require('multer');
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();

//store session to the DB
const store = new MongoDBStore({
	uri: process.env.url,
	collection: 'sessions',
});
//multer
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images');
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString() + '-' + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

// EJS SETTING UP
app.set('view engine', 'ejs');
app.set('views', 'views');

const shop = require('./routes/shop');
const admin = require('./routes/admin');
const auth = require('./routes/auth');
const SMS = require('./routes/SMS');

//USE

app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('img'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());

app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	next();
});
app.use(flash());

//ROUTES
app.use(shop);
app.use(admin);
app.use(auth);
app.use(SMS);

//error
app.use((req, res) => {
	res.status(404).render('404', {
		pageTitle: 'Page Not Found',
		path: '/404',
		isAuthenticated: req.session.isLoggedIn,
	});
});

//mongoose connection
(async () => {
	try {
		mongoose.connect(process.env.url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('mongoose is connected');
	} catch (err) {
		console.log(err);
	}
})();

// SERVER STARTED
PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log('server is started');
});
