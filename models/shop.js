const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const prodSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
	id: {
		type: Number,
	},
	date: {
		type: Date,
		default: () => Date.now(),
	},
});
module.exports = mongoose.model('Product', prodSchema);
