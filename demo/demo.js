//import rBuilder from 'rule-builder';

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
		nodeWidth: 280,
		nodeHeight: 120,
		nodeMargin: {
			x: 10,
			y: 200
		},
		zoomScale: [-1, 100],
		transitionDuration: 750
	}
};

var myBuilder = new RuleBuilder(treeData, options);
console.log('myBuilder');
console.log(myBuilder);

//alert(RuleBuilder.foo());