

var margin = {top: 20, right: 90, bottom: 30, left: 90},
	width = 1200 - margin.left - margin.right,
	height = 1000 - margin.top - margin.bottom;

var nodeWidth = 280;
var nodeHeight = 120;
var nodeMargin = {
	x: 10,
	y: 220
};

var zoom = d3.zoom()
	.scaleExtent([-1, 100])
	.on('zoom', zoomFn);

function resetZoom() {
	svg.transition().call(zoom.transform, d3.zoomIdentity);
}

function zoomFn() {
	d3.select('#tree-panel').select('svg').select('g')
		.attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
}

// create our SVG and groups (an extra group nesting helps zooming behaviour)
var svg = d3.select("#tree-panel").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.append("g")
	.attr("transform", "translate(" + ((width / 2)) + "," + (margin.top + nodeHeight) + ")");

d3.select('#tree-panel').select('svg').call(zoom);

var i = 0,
	duration = 750,
	root;

var treemap = d3.tree()
	.nodeSize([nodeWidth + nodeMargin.x, nodeHeight + nodeMargin.y])
	.separation(function(a, b) {
		return a.parent == b.parent ? 1 : 1.25;
	});

// Assigns parent, children, height, depth
root = d3.hierarchy(treeData, function (d) {
	return d.children;
});


// Collapse after the second level
root.children.forEach(collapse);

update(root);

// Collapse the node and all it's children
function collapse(d) {
	if (d.children) {
		d._children = d.children;
		d._children.forEach(collapse);
		d.children = null
	}
}
function update(source) {

	console.log('source');
	console.log(source);

	// Assigns the x and y position for the nodes
	var treeData = treemap(root);

	// Compute the new tree layout.
	var nodes = treeData.descendants(),
		links = treeData.descendants().slice(1);

	// Normalize for fixed-depth.
	nodes.forEach(function (d) {
		d.y = d.depth * nodeMargin.y;
		console.log(nodes);
	});

	// ****************** Nodes section ***************************

	// Update the nodes...
	var node = svg.selectAll('g.node')
		.data(nodes, function (d) {
			return d.id || (d.id = ++i);
		});

	// Enter any new modes at the parent's previous position.
	var nodeEnter = node.enter().append('g')
		.attr('class', 'node')
		.attr("transform", function (d) {
			if(source.x0) return "translate(" + source.x0 + "," + source.y0 + ")";
		})
		.on('click', click);

	// RECT NODES
	nodeEnter.append("rect")
		.attr("width", nodeWidth / 2)
		.attr("height", nodeHeight / 2)
		.attr("transform", function (d) {
			return "translate(" + -(nodeWidth / 4) + "," + -(nodeHeight / 4) + ")";
		})
		.attr("stroke", "black")
		.style("fill", function (d) {
			return d._children ? "lightsteelblue" : "#fff";
		});

	// Add labels for the nodes
	nodeEnter.append('text')
		.attr("dy", ".35em")
		.attr("text-anchor", "middle")
		.text(function (d) {
			return d.data.name;
		});

	// add labels for LINKS
	nodeEnter.append('text')
		.attr("dy", ".65em")
		.attr("x", function (d) {
			if(d.parent){
				return (d.parent.x - d.x) / 2;
			}
		})
		.attr("y", function (d) {
			console.log(d);
			if(d.parent){
				return (d.parent.y - d.y) / 2;
			}
		})
		.attr("text-anchor", "middle")
		.text(function (d) {
			if(d.parent) return d.data.operator + " "+ d.data.value;
		});

	// UPDATE
	var nodeUpdate = nodeEnter.merge(node);

	// Transition to the proper position for the node
	nodeUpdate.transition()
		.duration(duration)
		.attr("transform", function (d) {
			return "translate(" + d.x + "," + d.y + ")";
		});

	// RECT
	// Update the node attributes and style
	nodeUpdate.select('rect.node')
		.attr("width", nodeWidth)
		.attr("height", nodeHeight)
		.style("fill", function (d) {
			return d._children ? "lightsteelblue" : "#fff";
		})
		.attr('cursor', 'pointer');

	// Remove any exiting nodes
	var nodeExit = node.exit().transition()
		.duration(duration)
		.attr("transform", function (d) {
			return "translate(" + source.x + "," + source.y + ")";
		})
		.remove();

	// On exit reduce the node circles size to 0
	nodeExit.select('cicle')
		.attr('r', 1e-6);

	nodeExit.select('rect')
		.attr("width", 0)
		.attr("height", 0);

	// On exit reduce the opacity of text labels
	nodeExit.select('text')
		.style('fill-opacity', 1e-6);

	// ****************** links section ***************************

	// Update the links...
	var link = svg.selectAll('path.link')
		.data(links, function (d) {
			return d.id;
		});

	// Enter any new links at the parent's previous position.
	var linkEnter = link.enter().insert('path', "g")
		.attr("class", "link")
		.attr('d', function (d) {
			var o = {x: source.x0, y: source.y0};
			return diagonal(o, o)
		});

	// UPDATE
	var linkUpdate = linkEnter.merge(link);

	// Transition back to the parent element position
	linkUpdate.transition()
		.duration(duration)
		.attr('d', function (d) {
			return diagonal(d, d.parent)
		});

	 //Remove any exiting links
	var linkExit = link.exit().transition()
		.duration(duration)
		.attr('d', function (d) {
			var o = {x: source.x, y: source.y};
			return diagonal(o, o)
		})
		.remove();

	// Store the old positions for transition.
	nodes.forEach(function (d) {
		d.x0 = d.x;
		d.y0 = d.y;
	});

	function diagonal(s, d) {

		var path = `M ${s.x} ${s.y}
            C ${(s.x + d.x) / 2} ${s.y},
              ${(s.x + d.x) / 2} ${d.y},
              ${d.x} ${d.y}`;

		return path
	}

	// Toggle children on click.
	function click(d) {
		if (d.children) {
			d._children = d.children;
			d.children = null;
		} else {
			d.children = d._children;
			d._children = null;
		}
		update(d);
	}
}