'use strict';

(function () {

	'use strict';

	var DecisionTreeBuilder = function DecisionTreeBuilder(data, options) {

		// init layout from options
		var margin = options.layout.svgMargin;
		var width = options.layout.svgWidth - options.layout.svgMargin.left - options.layout.svgMargin.right;
		var height = options.layout.svgHeight - options.layout.svgMargin.top - options.layout.svgMargin.bottom;
		var nodeWidth = options.layout.nodeWidth;
		var nodeHeight = options.layout.nodeHeight;
		var nodeMargin = options.layout.nodeMargin;
		var zoom = d3.zoom().scaleExtent(options.layout.zoomScale).on('zoom', _zoomFn);
		var duration = options.layout.transitionDuration;
		var divId = '#' + options.layout.divId;

		/* -------------------------- Public properties --------------------------------*/
		// note that for flexibility; we are exposing some key components of the tree, use at your own risk!

		var self = this;
		var nodeIndex = 0;

		this.root = null;
		this.treeData = data;
		this.nodes = null;
		this.links = null;

		this.treemap = d3.tree().nodeSize([nodeWidth + nodeMargin.x, nodeHeight + nodeMargin.y]).separation(function (a, b) {
			return a.parent == b.parent ? 1 : 1.25;
		});

		// Assigns parent, children, height, depth
		this.root = d3.hierarchy(this.treeData, function (d) {
			return d.children;
		});

		// create our SVG and groups (an extra group nesting helps zooming behaviour)
		var svg = d3.select(divId).append("svg")
		//.attr("width", width + margin.right + margin.left)
		.attr("width", "100%").attr("height", height + margin.top + margin.bottom).append("g").append("g").attr("transform", "translate(" + width / 2 + "," + (margin.top + nodeHeight) + ")");

		d3.select(divId).select('svg').call(zoom);

		/* -------------------------- Public methods --------------------------------*/

		/*
  	Example of adding nodes dynamically:
   https://stackoverflow.com/questions/43140325/add-node-to-d3-tree-v4
      https://github.com/fhightower/d3-dynamic-tree/blob/master/js/dynamicTree.js
   */
		this.addChildNodes = function (originalNode, newChildren) {

			//return;

			console.log('unmodified originalNode');
			console.log(originalNode.toString());

			newChildren.forEach(function (d) {

				// Creates a Node from newNode object using d3.hierarchy(.)
				// https://github.com/d3/d3-hierarchy
				var newNode = d3.hierarchy(d);

				// add some properties to Node like child,parent,depth

				// zero for the root node, and increasing by one for each descendant generation.
				newNode.depth = originalNode.depth + 1;

				// zero for leaf nodes
				newNode.height = 0;

				//the parent node, or null for the root node.
				newNode.parent = originalNode;

				// uid
				newNode.id = parseInt(Math.random() * 1000000000);

				// If no child array, create an empty array
				if (!originalNode.children) {
					originalNode.children = [];
					originalNode.data.children = [];
				}

				// Push it to parent.children array
				originalNode.children.push(newNode);
				originalNode.data.children.push(newNode.data);
			});

			console.log('originalNode');
			console.log(originalNode);

			this.update(originalNode);

			// ADDING invisible nodes to invisible nodes..!?
			// if the child has children that are not currently visible, add children to each of the currently invisible nodes
			//if(node._children) {
			//	console.log('1');
			//	node._children.forEach(function(childNode) {
			//		let associatedItems = data;
			//		childNode._children = associatedItems;
			//	});
			//}
			//
			//// if the node has visible children, make them invisible
			//if (node.children) {
			//	console.log('2');
			//	node._children = node.children;
			//	node.children = null;
			//}
			//// if the node has invisible children, make them visible
			//else {
			//	console.log('3');
			//	node.children = node._children;
			//	node._children = null;
			//}

		};

		this.resetZoom = function () {
			svg.transition().call(zoom.transform, d3.zoomIdentity);
		};

		// Collapse the node and all it's children
		this.collapse = function (d) {
			if (d.children) {
				d._children = d.children;
				d._children.forEach(self.collapse);
				d.children = null;
			}
		};

		this.expand = function (d) {
			if (d._children) {
				d.children = d._children;
				d.children.forEach(self.expand);
				d._children = null;
			}
		};

		this.colapseAll = function () {
			this.root.children.forEach(self.collapse);
			this.update(root);
		};

		this.expandAll = function () {
			this.root.children.forEach(self.expand);
			this.update(root);
		};

		this.update = function (source) {

			// Assigns the x and y position for the nodes
			this.treeData = this.treemap(this.root);

			// Compute the new tree layout.
			this.nodes = this.treeData.descendants();
			this.links = this.treeData.descendants().slice(1);

			// Normalize for fixed-depth.
			this.nodes.forEach(function (d) {
				d.y = d.depth * nodeMargin.y;
			});

			// ****************** Nodes section ***************************

			// Update the nodes...
			var node = svg.selectAll('g.node').data(self.nodes, function (d) {
				return d.id || (d.id = ++nodeIndex);
			});

			// Enter any new nodes at the parent's previous position.
			var nodeEnter = node.enter().append('g').attr('class', 'node').attr("id", function (d) {
				return "node-" + d.id;
			}).attr("transform", function (d) {
				if (source.x0) return "translate(" + source.x0 + "," + source.y0 + ")";
			}).on('click', _click);

			// RECT NODES
			nodeEnter.append("rect").attr("width", nodeWidth / 2).attr("height", function (d) {
				return !d._children && !d.children ? nodeHeight / 3 : nodeHeight / 2;
			}).attr("transform", function (d) {
				return !d._children && !d.children ? "" : "rotate(45)";
			}).attr("x", -(nodeWidth / 4))
			//.attr("y", -(nodeWidth / 4))
			.attr("y", function (d) {
				return !d._children && !d.children ? -(nodeHeight / 5.5) : -(nodeHeight / 4);
			}).attr("stroke", "black").style("fill", function (d) {
				return !d._children && !d.children ? "#CCC" : "#FFF";
			});

			// Add labels for the nodes
			nodeEnter.append('text').attr("dy", ".35em").attr("text-anchor", "middle").text(function (d) {
				return d.data.name;
			});

			// add labels for LINKS
			nodeEnter.append('text').attr("dy", ".65em").attr("x", function (d) {
				if (d.parent) {
					return (d.parent.x - d.x) / 2;
				}
			}).attr("y", function (d) {
				if (d.parent) {
					return (d.parent.y - d.y) / 2;
				}
			}).attr("text-anchor", "middle").text(function (d) {
				if (d.parent) return d.data.operator + " " + d.data.value;
			});

			// UPDATE
			var nodeUpdate = nodeEnter.merge(node);

			// Transition to the proper position for the node
			nodeUpdate.transition().duration(duration).attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			});

			// RECT
			// Update the node attributes and style
			nodeUpdate.select('rect.node').attr("width", nodeWidth).attr("height", nodeHeight).style("fill", function (d) {
				return d._children ? "lightsteelblue" : "#fff";
			}).attr('cursor', 'pointer');

			// Remove any exiting nodes
			var nodeExit = node.exit().transition().duration(duration).attr("transform", function (d) {
				return "translate(" + source.x + "," + source.y + ")";
			}).remove();

			// On exit reduce the node rect size to 0
			nodeExit.select('rect').attr("width", 0).attr("height", 0);

			// On exit reduce the opacity of text labels
			nodeExit.select('text').style('fill-opacity', 1e-6);

			// ****************** links section ***************************

			// Update the links...
			var link = svg.selectAll('path.link').data(self.links, function (d) {
				return d.id;
			});

			// Enter any new links at the parent's previous position.
			var linkEnter = link.enter().insert('path', "g").attr("class", "link").attr('d', function (d) {
				// if no previous pos, just use zero
				if (!source.x0) return _diagonal({ x: 0, y: 0 }, { x: 0, y: 0 });
				var o = { x: source.x0, y: source.y0 };
				return _diagonal(o, o);
			});

			// UPDATE
			var linkUpdate = linkEnter.merge(link);

			// Transition back to the parent element position
			linkUpdate.transition().duration(duration).attr('d', function (d) {
				return _diagonal(d, d.parent);
			});

			// Remove any exiting links
			var linkExit = link.exit().transition().duration(duration).attr('d', function (d) {
				var o = { x: source.x, y: source.y };
				return _diagonal(o, o);
			}).remove();

			// Store the old positions for transition.
			self.nodes.forEach(function (d) {
				d.x0 = d.x;
				d.y0 = d.y;
			});

			function _diagonal(s, d) {

				var path = 'M ' + s.x + ' ' + s.y + '\n\t\t\t\t            C ' + (s.x + d.x) / 2 + ' ' + s.y + ',\n\t\t\t\t              ' + (s.x + d.x) / 2 + ' ' + d.y + ',\n\t\t\t\t              ' + d.x + ' ' + d.y;

				return path;
			}

			function _click(d) {

				_setHighlighted(d);

				var evt = new CustomEvent('nodeClick', { detail: d });
				window.dispatchEvent(evt);

				// Toggle children on click.
				//if (d.children) {
				//	d._children = d.children;
				//	d.children = null;
				//} else {
				//	d.children = d._children;
				//	d._children = null;
				//}
				//self.update(d);
			}
		};

		/* -------------------------- Private methods --------------------------------*/

		function _setHighlighted(node) {

			//console.log(node);

			// clear highlighting
			d3.selectAll(".node").select('rect').style("fill", function (d) {
				return !d._children && !d.children ? "#CCC" : "#FFF";
			});

			// highlight target node
			if (node) {
				d3.select("#node-" + node.id).select('rect').style("fill", "#10B0F0");
			}
		}

		function _zoomFn() {
			d3.select(divId).select('svg').select('g').attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
		}

		// Collapse after the second level
		//root.children.forEach(collapse);

		this.update(this.root);
	};

	/*------------------------------ behold the state of js modules.. -------------------------------*/

	// AMD support
	if (typeof define === 'function' && define.amd) {
		define(function () {
			return DecisionTreeBuilder;
		});
	}

	// CommonJS and Node.js module support.
	else if (typeof exports !== 'undefined') {

			// Support Node.js specific `module.exports` (which can be a function)
			if (typeof module !== 'undefined' && module.exports) {
				exports = module.exports = DecisionTreeBuilder;
			}
			// But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
			exports.DecisionTreeBuilder = DecisionTreeBuilder;
		}

		// stick it in the window
		else {
				window.DecisionTreeBuilder = DecisionTreeBuilder;
			}
})(undefined);