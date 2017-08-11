(function () {

	'use strict';

	// constructor
	let RuleBuilder = function(data, options){

		// init layout from options
		let margin = options.layout.svgMargin;
		let	width = options.layout.svgWidth - options.layout.svgMargin.left - options.layout.svgMargin.right;
		let height = options.layout.svgHeight - options.layout.svgMargin.top - options.layout.svgMargin.bottom;
		let nodeWidth = options.layout.nodeWidth;
		let nodeHeight = options.layout.nodeHeight;
		let nodeMargin = options.layout.nodeMargin;
		let zoom = d3.zoom().scaleExtent(options.layout.zoomScale).on('zoom', _zoomFn);
		let duration = options.layout.transitionDuration;
		let divId = '#' + options.layout.divId;

		/* -------------------------- Public properties --------------------------------*/
		// note that for flexibility; we are exposing some key components of the tree, use at your own risk!

		let self = this;
		let nodeIndex = 0;

		this.root = null;
		this.treeData = data;
		this.nodes = null;
		this.links = null;

		this.treemap = d3.tree()
			.nodeSize([nodeWidth + nodeMargin.x, nodeHeight + nodeMargin.y])
			.separation(function(a, b) {
				return a.parent == b.parent ? 1 : 1.25;
			});

		// Assigns parent, children, height, depth
		this.root = d3.hierarchy(this.treeData, function (d) {
			return d.children;
		});
		
		// create our SVG and groups (an extra group nesting helps zooming behaviour)
		let svg = d3.select(divId).append("svg")
			.attr("width", width + margin.right + margin.left)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.append("g")
			.attr("transform", "translate(" + ((width / 2)) + "," + (margin.top + nodeHeight) + ")");

		d3.select(divId).select('svg').call(zoom);

		/* -------------------------- Public methods --------------------------------*/

		this.resetZoom = function(){
			svg.transition().call(zoom.transform, d3.zoomIdentity);
		};

		// Collapse the node and all it's children
		this.collapse = function(d) {
			if (d.children) {
				d._children = d.children;
				d._children.forEach(collapse);
				d.children = null
			}
		};

		this.expand = function(d) {
			if (d._children) {
				d.children = d._children;
				d.children.forEach(expand);
				d._children = null
			}
		};

		this.colapseAll = function(){
			root.children.forEach(collapse);
			update(root);
		};

		this.expandAll = function(){
			root.children.forEach(expand);
			update(root);
		};

		this.update = function(source) {

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
			let node = svg.selectAll('g.node')
				.data(self.nodes, function (d) {
					return d.id || (d.id = ++nodeIndex);
				});

			// Enter any new modes at the parent's previous position.
			let nodeEnter = node.enter().append('g')
				.attr('class', 'node')
				.attr("transform", function (d) {
					if(source.x0) return "translate(" + source.x0 + "," + source.y0 + ")";
				})
				.on('click', _click);

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
					if(d.parent){
						return (d.parent.y - d.y) / 2;
					}
				})
				.attr("text-anchor", "middle")
				.text(function (d) {
					if(d.parent) return d.data.operator + " "+ d.data.value;
				});

			// UPDATE
			let nodeUpdate = nodeEnter.merge(node);

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
			let nodeExit = node.exit().transition()
				.duration(duration)
				.attr("transform", function (d) {
					return "translate(" + source.x + "," + source.y + ")";
				})
				.remove();

			// On exit reduce the node rect size to 0
			nodeExit.select('rect')
				.attr("width", 0)
				.attr("height", 0);

			// On exit reduce the opacity of text labels
			nodeExit.select('text')
				.style('fill-opacity', 1e-6);

			// ****************** links section ***************************

			// Update the links...
			let link = svg.selectAll('path.link')
				.data(self.links, function (d) {
					return d.id;
				});

			// Enter any new links at the parent's previous position.
			let linkEnter = link.enter().insert('path', "g")
				.attr("class", "link")
				.attr('d', function (d) {
					// if no previous pos, just use zero
					if(!source.x0) return  _diagonal({x: 0, y: 0}, {x: 0, y: 0});
					let o = {x: source.x0, y: source.y0};
					return _diagonal(o, o)
				});

			// UPDATE
			let linkUpdate = linkEnter.merge(link);

			// Transition back to the parent element position
			linkUpdate.transition()
				.duration(duration)
				.attr('d', function (d) {
					return _diagonal(d, d.parent)
				});

			// Remove any exiting links
			let linkExit = link.exit().transition()
				.duration(duration)
				.attr('d', function (d) {
					let o = {x: source.x, y: source.y};
					return _diagonal(o, o)
				})
				.remove();

			// Store the old positions for transition.
			self.nodes.forEach(function (d) {
				d.x0 = d.x;
				d.y0 = d.y;
			});

			function _diagonal(s, d) {

				let path = `M ${s.x} ${s.y}
				            C ${(s.x + d.x) / 2} ${s.y},
				              ${(s.x + d.x) / 2} ${d.y},
				              ${d.x} ${d.y}`;

				return path
			}

			// Toggle children on click.
			function _click(d) {
				if (d.children) {
					d._children = d.children;
					d.children = null;
				} else {
					d.children = d._children;
					d._children = null;
				}
				self.update(d);
			}
		};


		/* -------------------------- Private methods --------------------------------*/

		function _zoomFn() {
			d3.select(divId).select('svg').select('g')
				.attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
		}

		// Collapse after the second level
		//root.children.forEach(collapse);

		this.update(this.root);

	};





	/*------------------------------ behold the state of js modules.. -------------------------------*/

	// AMD support
	if (typeof define === 'function' && define.amd) {
		define(function () { return RuleBuilder; });
	}

	// CommonJS and Node.js module support.
	else if (typeof exports !== 'undefined') {

		// Support Node.js specific `module.exports` (which can be a function)
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = RuleBuilder;
		}
		// But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
		exports.RuleBuilder = RuleBuilder;
	}

	// stick it in the window
	else {
		window.RuleBuilder = RuleBuilder;
	}

})(this);