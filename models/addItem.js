var Item = require("./itemModel.js");

function addItem(req, res, next){
	var newItem = new Item();
	newItem.name = req.body.name;
	newItem.index = req.body.index;
	newItem.count = 0;
	newItem.goal = 0;
	newItem.save(function(err){
		if(err) res.json({"error": err});
		res.json({status: 201});
	})
}

module.exports = addItem;
