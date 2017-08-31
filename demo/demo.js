
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
	}
};

var myBuilder = new DecisionTreeBuilder(treeData, options);

function addNodes(node){

	let newNodesData = [
		{
			"label": "Dynamic #1",
			"property": "Dynamic #1",
			"operator": "operator",
			"value": "value"
		},
		{
			"label": "Dynamic #2",
			"property": "Dynamic #2",
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

window.addEventListener('nodeClick', function (e) {

	console.log('nodeClick');
	console.log(e.detail);

	var node = e.detail;

	// method examples
	//addNodes(node);
	//editNode(node);
	//pruneNode(node);
});
