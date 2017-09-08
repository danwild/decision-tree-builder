
var options = {
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
		}
	}
};

var myBuilder = new DecisionTreeBuilder(treeData, options);

function addNodes(node, index){

	let newNodesData = [
		{
			"label": "Dynamic #"+index,
			"property": "Dynamic #"+index,
			"operator": "operator",
			"value": "value"
		},
		{
			"label": "Dynamic #other"+index,
			"property": "Dynamic #other"+index,
			"operator": "operator",
			"value": "value"
		}
	];

	myBuilder.addChildNodes(node, newNodesData);
}

function pruneNode(node){
	myBuilder.pruneNode(node);
}

function updateDecisionNodeData(node){

	var newData = {
		"label": "newData #1",
		"property": "newData #1",
		"children": [
			{
				"label": "Dynamic #",
				"property": "Dynamic #"
			},
			{
				"label": "Dynamic true",
				"property": "Dynamic true",
				"operator": "operator",
				"value": "value"
			}
		]
	};

	myBuilder.updateDecisionNodeData(node, newData);
}

function queryTree(){

	var target = {
		"public": true,
		"travels_on": "track"
	};

	myBuilder.queryDecisionTree(target).then((result) => {
		alert(JSON.stringify(result));
	});

}

window.addEventListener('nodeClick', function (e) {

	var node = e.detail;
	var action = $("input:radio[name ='nodeAction']:checked").val();

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



