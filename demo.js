
var options = {

	colors: {
		nodeHighlight: "#2199e8"
	},
	layout: {
		divId: "tree-panel",
		svgWidth: 1200,
		svgHeight: 1000,
		svgMargin: {
			top: 20,
			right: 90,
			bottom: 30,
			left: 90
		},
		nodeWidth: 250,
		nodeHeight: 250,
		nodeMargin: {
			x: 100,
			y: 250
		},
		zoomScale: [-1, 100],
		transitionDuration: 750
	},

	operatorFunctions: {
		equal: function(a, b){
			return new Promise((resolve, reject) => {
				resolve(a == b);
			});
		},
		greater_than: function(a, b){
			return new Promise((resolve, reject) => {
				resolve(a > b);
			});
		}
	}
};

var myBuilder = new DecisionTreeBuilder(treeData, options);

function addNodes(node){

	var newNodesData = [
		{
			"name": "So negative :("
		},
		{
			"name": "So positive :)"
		}
	];

	myBuilder.addChildNodes(node, newNodesData);
}

function pruneNode(node){
	myBuilder.pruneNode(node);
}

function serialise(){
	var tree = myBuilder.serialiseTreeToJSON();
	console.log(tree);
	alert(tree);
}

function updateDecisionNodeData(node){

	var newData = {
		"name": "newData #1",
		"rules": [
			{
				"property": "isPublic",
				"operator": "equal",
				"value": true
			}
		],
		"children": [
			{
				"name": "Falsey child"
			},
			{
				"name": "Truthy child"
			}
		]
	};

	myBuilder.updateDecisionNodeData(node, newData);
}

function queryTree(){

	var trainExample = {
		"isPublic": true,
		"travelsOn": "TRACK",
		"seatCount": 500
	};

	var busExample = {
		"isPublic": true,
		"travelsOn": "ROAD",
		"seatCount": 500
	};

	var carExample = {
		"isPublic": false,
		"hasWheels": true
	};

	var carExample2 = {
		"isPublic": false,
		"accessMethod": "DOORS",
		"hasWindows": true
	};

	myBuilder.queryDecisionTree(carExample2).then((result) => {
		alert(JSON.stringify(result));
		console.log(JSON.stringify(result));
	});

}

window.addEventListener('nodeClick', function (e) {

	var node = e.detail;
	var action = $("input:radio[name ='nodeAction']:checked").val();
	$('.nodeAction').prop('checked', false);

	console.log('nodeClick');
	console.log(e.detail);
	console.log('action '+action);

	switch(action){

		case "addChildNodes":
			addNodes(node);
			break;

		case "pruneNode":
			pruneNode(node);
			break;

		case "updateDecisionNodeData":
			updateDecisionNodeData(node);
			break;

	}
});



