var item = Vue.component("list-item", {
	props: ["name", "count", "goal", "renameitem", "updategoal", "reduce", "increment", "index", "deleteitem", "whichmenu", "showthismenu"],
	computed:{
		showorhidemenu: function(){
			if(this.whichmenu == this.index) return "";
			else {
				this.renameOn = false;
				return "d-none";
			}
		},
		arrowupordown: function(){
			if(this.whichmenu == this.index) return "fa-caret-up"
			else return "fa-caret-down"
		},
		showgoalprogress: function(){
			if(this.goal == false) return "d-none"; // goal == 0 doesn't show to allow delete goal feature
			else return "";			// add === to show 0
		},
		goalprogress: function(){
			var percentage = Math.round( (this.count / this.goal) *100 ) + "%";
			return {width: percentage};
		}
	},
	data: function(){
		return {
			workingGoal: this.goal,
			renameOn: false,
			workingName: this.name
		}
	},
	watch: {
		workingGoal: function(event){
			this.updategoal(event, this.index);
		},
		goal: function(){
			this.workingGoal = this.goal;
		},
		name: function() {
			this.workingName = this.name;
		},
		workingName: function(event){
			this.renameitem(this.workingName, this.index)
		}
	},
	methods: {
		showrename: function(){
			this.renameOn = !this.renameOn;
		}
	},
	template: `
		<li class="mx-auto my-2 w-100 itemElement border border-secondary px-3 py-1" :itemIndex="index">
			<div class="flex-row flex-baseline flex-split">
				<h3 class="dragger" v-if="!renameOn">{{name}}</h3>
				<input v-model="workingName" @keyup.enter="showrename" v-else>
				<div class="progress w-25 ml-auto mr-1" :class="showgoalprogress">
					<div class="progress-bar" :style="goalprogress">{{goalprogress.width}}</div>
				</div>
				<div class="flex-row flex-bottom" :itemIndex="index">
					<button @click="reduce" class="btn btn-secondary pointer">-</button>
					<h5 class="width-50 text-center">{{count}}</h5>
					<button @click="increment" class="btn btn-secondary pointer">+</button>
					<i @click="showthismenu" class="ml-3 pointer fa fa-2x" :class="arrowupordown"></i>
				</div>
			</div>
			<div :class="showorhidemenu" class="flex-row flex-bottom flex-spread w-50 mx-auto">
				<i @click="deleteitem" class="fa fa-trash-o fa-2x pointer"></i>
				<div class="flex-row flex-bottom" title="Set a Goal">
					<i class="fa fa-crosshairs fa-2x mr-2"></i>
					<input type="number" class="width-50" v-model="workingGoal">
				</div>
				<i @click="showrename" class="fa fa-pencil-square-o fa-2x pointer"></i>
			</div>
		</li>`
});

var vm = new Vue({
	el: "#app",
	data: {
		itemArray: [],
		newItem: "",
		whichmenu: -1
	},
	computed: {
		yearProgress: function(){
			var daysInYear = moment().year() % 4 == 0? 366: 365;
			var currentDay = moment().dayOfYear();
			return {width: Math.round(((currentDay / daysInYear) * 100)) + "%"}
			"width:" +  + "%;"
		},
		items: function(){
			return this.itemArray.map(function(el, i){
				return {name: el.name, count: el.count, goal: el.goal, index: i}
			});
		}
	},
	created: function(){
		this.getItems();
	},
	methods: {
		getItems: function(){
			$.ajax({
				method: "get",
				url: "/api",
				dataType: "JSON",
				success: function(res){
					vm.itemArray = res;
				}
			})
		},
		deleteitem: function(event){
			if(confirm("You are about to delete an item.")){
				let index = event.target.parentNode.parentNode.attributes.itemIndex.value;
				var itemToDelete = this.itemArray[index];
				this.itemArray.splice(index, 1);
				this.whichmenu = -1;
				deleteItemFromDatabase(itemToDelete.name);
			}
		},
		reduce: function(event){
			let index = event.target.parentNode.attributes.itemindex.value;
			this.itemArray[index].count--;
			updateItemInDatabase(this.itemArray[index]);
		},
		increment: function(event){
			let index = event.target.parentNode.attributes.itemindex.value;
			this.itemArray[index].count++;
			updateItemInDatabase(this.itemArray[index]);
		},
		addAnItem: function(){
			if(this.newItem != "" && !this.itemArray.some(el => el.name == this.newItem)){
				this.itemArray.push({name: this.newItem, count: 0, goal: 0});
				addItemToDatabase(this.newItem, this.itemArray.length);
				this.newItem = "";
			} else if(this.newItem != "") {
				alert("Already exists.");
			}
		},
		showthismenu: function(event){
			if(this.whichmenu == event.target.parentNode.attributes.itemindex.value) this.whichmenu = -1;
			else this.whichmenu = event.target.parentNode.attributes.itemindex.value;
		},
		updategoal: function(val, index){
			this.itemArray[index].goal = val;
			updateItemInDatabase(this.itemArray[index]);
		},
		closeMenu: function(){
			this.whichmenu = -1;
		},
		updateDatabaseOrder: function(){
			for(let i=0; i<this.itemArray.length; i++){
				updateItemInDatabase({name: this.itemArray[i].name, index: i});
			}
		},
		renameitem: function(newname, i){
			this.itemArray[i].name = newname;
			updateNameInDatabase({name: newname, index: i});
		}
	}
});

function addItemToDatabase(name, index){
	$.ajax({
		method: "put",
		url: "/api",
		dataType: "JSON",
		data: {name: name, index: index},
		success: function(res){
			console.log(res.status);
		}
	})
}

function deleteItemFromDatabase(name){
	$.ajax({
		method: "delete",
		url: "/api",
		dataType: "JSON",
		data: {"name": name},
		success: function(res){
			console.log(res.status);
		}
	})
}

function updateItemInDatabase(itemObject){
	$.ajax({
		method: "post",
		url: "/api",
		dataType: "JSON",
		data: {
			"name": itemObject.name,
			"count": itemObject.count,
			"goal": itemObject.goal,
			"index": itemObject.index
		},
		success: function(res){
			console.log(res.status);
		}
	})
}

function updateNameInDatabase(itemObject){
	$.ajax({
		method: "post",
		url: "/apibyid", //because can't search by name as name has changed
		dataType: "JSON",
		data: itemObject,
		success: function(res){
			console.log(res.status);
		}
	})
}




// TODO: bugs - sometimes when you sort quickly, they duplicate and replace others
// this then leads to issues because we search by name
// when there are 2 with same name, there are ISSUES