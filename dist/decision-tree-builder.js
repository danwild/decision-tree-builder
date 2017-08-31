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

		/**
   * @summary Prunes the target decision node and all of its children.
   * If target node is not a decision node, no action taken.
   * @param node
   */
		this.pruneNode = function (node) {
			if (node.children && node.children.length > 0) {
				delete node.children;
				delete node.data.children;
				this.update(node);
			}
		};

		/**
   * @summary Experimental (use `pruneNode` instead). The tree should only be *pruned* at
   * decision nodes to remain valid (so we don’t end up with single children).
   * @param node
   */
		this.deleteNode = function (node) {

			var self = this;

			_visit(this.treeData, function (d) {
				if (d.children) {
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = d.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var child = _step.value;

							if (child == node) {
								//d.children = _.without(d.children, child);
								d.children = _filterChildren(d.children, [child]);
								self.update(self.root);
								break;
							}
						}
					} catch (err) {
						_didIteratorError = true;
						_iteratorError = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}
						} finally {
							if (_didIteratorError) {
								throw _iteratorError;
							}
						}
					}
				}
			}, function (d) {
				return d.children && d.children.length > 0 ? d.children : null;
			});
		};

		/**
   * @summary Update an existing nodes data
   * @param node
   * @param newData
   */
		this.updateNodeData = function (node, newData) {
			node.data = newData;
			this.update(node);
		};

		/**
   * Add newChildren to the original leaf node, which becomes a decision node.
   * @param originalNode
   * @param newChildren
   */
		this.addChildNodes = function (originalNode, newChildren) {

			// you can only add child nodes to a leaf
			if (originalNode.children && originalNode.children.length == 2) return;

			newChildren.forEach(function (d) {

				// Creates a Node from newNode object, see https://github.com/d3/d3-hierarchy
				var newNode = d3.hierarchy(d);

				// setup the nodes properties
				// depth zero for the root node, and increasing by one for each descendant generation.
				newNode.depth = originalNode.depth + 1;
				// zero for leaf nodes, and the greatest distance from any descendant leaf for internal nodes
				// TODO this is not working?
				newNode.height = originalNode.height - 1;
				//the parent node, or null for the root node.
				newNode.parent = originalNode;
				// uid
				newNode.id = new Date() + parseInt(Math.random() * 10000);

				// If no child array, create an empty array
				if (!originalNode.children) {
					originalNode.children = [];
					originalNode.data.children = [];
				}

				// Push it to parent.children array
				originalNode.children.push(newNode);
				originalNode.data.children.push(newNode.data);
			});

			this.update(originalNode);
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

			console.log('update');

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
			}).attr("x", -(nodeWidth / 4)).attr("y", function (d) {
				return !d._children && !d.children ? -(nodeHeight / 5.5) : -(nodeHeight / 4);
			}).attr("stroke", "black").attr("stroke-width", 2).style("fill", function (d) {
				return !d._children && !d.children ? "#CCC" : "#FFF";
			});

			// edit node labels if exist
			var rectLabel = node.selectAll("text.node-label");
			if (!rectLabel.empty()) {
				rectLabel.text(function (d) {
					return d.data.label;
				});
			} else {
				// init node labels
				console.log('Add labels for the nodes');
				nodeEnter.append('text').attr("dy", ".35em").attr("class", "node-label").attr("text-anchor", "middle").text(function (d) {
					return d.data.label;
				});
			}

			// update link label if exists
			var linkLabel = node.selectAll("text.link-label");
			if (!linkLabel.empty()) {
				linkLabel.text(function (d) {
					if (d.parent) return d.data.operator + " " + d.data.value;
				});
			}

			// init link labels
			else {
					nodeEnter.append('text').attr("dy", ".65em").attr("class", "link-label").attr("x", function (d) {
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
				}

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
			}
		};

		/* -------------------------- Private methods --------------------------------*/

		var _previousNode = void 0;
		function _setHighlighted(node) {

			// clear highlighting
			d3.selectAll(".node").select('rect').style("fill", function (d) {
				return !d._children && !d.children ? "#CCC" : "#FFF";
			});

			// highlight target node
			if (node && node.id != _previousNode) {
				d3.select("#node-" + node.id).select('rect').style("fill", "#10B0F0");
				_previousNode = node.id;
				return;
			}

			_previousNode = null;
		}

		/**
   * @summary A recursive helper function for performing some setup by walking through all nodes
   * @param parent
   * @param visitFn
   * @param childrenFn
   */
		function _visit(parent, visitFn, childrenFn) {
			if (!parent) return;

			visitFn(parent);

			var children = childrenFn(parent);
			if (children) {
				var count = children.length;
				for (var i = 0; i < count; i++) {
					_visit(children[i], visitFn, childrenFn);
				}
			}
		}

		/**
   * Return an array of children, without those to toRemove (similar to underscores _.without)
   * @param children
   * @param toRemove
   * @returns {*}
   * @private
   */
		function _filterChildren(children, toRemove) {

			for (var i = children.length - 1; i >= 0; i--) {
				for (var j = 0; j < toRemove.length; j++) {
					if (children[i] && children[i].id === toRemove[j].id) {
						children.splice(i, 1);
					}
				}
			}

			return children;
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