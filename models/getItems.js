var Item = require("./itemModel.js");
function getItems(req, res){
	Item.find({}, "name goal count index").lean().exec(function(err, items){
		res.json(items.sort(function(a, b){
			return a.index - b.index;
		}));
	});
}

module.exports = getItems;
