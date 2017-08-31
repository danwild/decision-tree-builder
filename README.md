# decision-tree-builder [![NPM version][npm-image]][npm-url] [![NPM Downloads][npm-downloads-image]][npm-url]

A tool to build data classification rules using visual flowchart-style decision tree.
Uses [d3.js v4](https://d3js.org/) for SVG drawing.

## terminology
* **Property:** a (data) attribute being evaluated as part a decision (e.g. Property: "animal")
* **Value:** a value being used in a conditional statement to evaluate a property 
(e.g. does Property "animal" equal the Value "cat")
* **Operator:** the logical operator used to evaluate a properties value (e.g. "equals", "less than" etc.) 
* **Decision:** a conditional operation determining which of two paths the program will take
* **Result Node:** aka a leaf node, represents the final result when an input is evaluated by the decision tree
* **TreeSchema:** the JSON serialised representation of a decision tree
* **DataSchema:** the actual things/options that may be used to define a tree
(the Properties, Values, and Operators that are available)

## notes
* We do not provide any validation of decision tree conditional logic 
(it is distinct from the tree data structure... well more accurately the decision logic is simply stored as tree node metadata).
	* for example; you could make a change to a parent node which renders its children completely redundant, 
	and it will still be valid (children won't be auto pruned, do it yourself man).

## core methods
We basically have CRUD:
* `addChildNodes(node, newNodesData)`
* `updateNodeData(node, newData)`
* `pruneNode(node)`


## shout outs
* [Mike Bostock](https://d3js.org/)
* [Adam Feuer's d3js Tree Editor](https://bl.ocks.org/adamfeuer/042bfa0dde0059e2b288) found it too late to use it, but looks relevant.
* [d3noob](https://bl.ocks.org/d3noob)
		       	  	   
## license
The MIT License (MIT)	
	          	  	   
[npm-image]: https://badge.fury.io/js/decision-tree-builder.svg
[npm-url]: https://www.npmjs.com/package/decision-tree-builder
[npm-downloads-image]: https://img.shields.io/npm/dt/decision-tree-builder.svg	   