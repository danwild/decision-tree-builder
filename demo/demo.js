
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

function editNode(node){

	let newData = {
		"label": "newData #1",
		"property": "newData #1",
		"operator": "operator",
		"value": "value"
	};

	myBuilder.updateNodeData(node, newData);
}

function queryTree(){

	let target = {
		"public": true,
		"travels_on": "track"
	};

	myBuilder.queryDecisionTree(target).then((result) => {

		console.log('result');
		console.log(result);

	});

}

window.addEventListener('nodeClick', function (e) {

	//console.log('nodeClick');
	//console.log(e.detail);

	var node = e.detail;

	// method examples
	//addNodes(node);
	//editNode(node);
	//pruneNode(node);
	console.log(myBuilder.serialiseTreeToJSON());
	//queryTree();

	//myBuilder.fitBounds(0.70, 500);
	//myBuilder.centerNode(node);

	//myBuilder.adjustBounds({
	//	x: 0,
	//	y: -200,
	//	duration: 1000
	//});
});
