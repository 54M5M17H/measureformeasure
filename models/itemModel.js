var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Item = new Schema({
	name: String,
	count: Number,
	goal: Number,
	index: Number
});

module.exports = mongoose.model("Item", Item, "items");
