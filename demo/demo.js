
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

let added = 0;

window.addEventListener('nodeClick', function (e) {

	console.log('nodeClick');
	console.log(e.detail);

	var node = e.detail;

	if(added < 20){
		addNodes(node, added);
		added++;
	}
	else {
		let serialTree = myBuilder.getSerialisedTree();
		console.log(serialTree);
	}

	// method examples
	//addNodes(node);
	//editNode(node);
	//pruneNode(node);


});
