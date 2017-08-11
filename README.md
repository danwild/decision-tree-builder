# decision-tree-builder [![NPM version][npm-image]][npm-url] [![NPM Downloads][npm-downloads-image]][npm-url]

A tool to build data classification rules using visual flowchart-style decision tree.
Uses [d3.js v4](https://d3js.org/) for SVG drawing.

## terminology
* **Property:** a (data) attribute being evaluated as part a decision (e.g. Property: "animal")
* **Value:** a value being used in a conditional statement to evaluate a property (e.g. does Property "animal" equal the Value "cat")
* **Operator:** the logical operator used to evaluate a properties value (e.g. "equals", "less than" etc.) 
* **Decision:** a conditional operation determining which of two paths the program will take
* **Result Node:** aka a leaf node, represents the final result when an input is evaluated by the decision tree

## todo
* start drafting API..
	* Interaction flow, somewhere to start:
	    * User click node to add/edit
	    * Select a property
	    * Select an operator
	    * Select a value
	    * Cancel / Add / Update
	    
	    
	    
	    
	   
	   
[npm-image]: https://badge.fury.io/js/decision-tree-builder.svg
[npm-url]: https://www.npmjs.com/package/decision-tree-builder
[npm-downloads-image]: https://img.shields.io/npm/dt/decision-tree-builder.svg	   