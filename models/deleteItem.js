var Item = require("./itemModel.js");
function deleteItem(req, res){
	Item.findOneAndRemove({"name": req.body.name}, function(err){
		if(err) res.json({"error": err});
		res.json({"status": 202});
	})
}

module.exports = deleteItem;
