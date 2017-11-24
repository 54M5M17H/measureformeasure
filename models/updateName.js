var Item = require("./itemModel.js");
module.exports = function(req, res){
	Item.findOneAndUpdate({"index": req.body.index},
		req.body,
		{new: true},
		function(err, item){
			if(err) res.json({"error": err});
			res.json({status: 200});
		}
	);
}
