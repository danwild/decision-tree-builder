var treeData =
{
	"label": "Public",
	"property": "Public",
	
	"children": [

		{
			"label": "Travels On",
			"property": "Travels On",
			"operator": "equal",        // operators are relative to parent!
			"value": true,              // values are relative to parent!

			"children": [
				{
					"label": "Train",
					"property": "Train",
					"operator": "equal",
					"value": "track"
				},
				{
					"label": "Bus",
					"property": "Bus",
					"operator": "equal",
					"value": "road"
				}
			]
		},

		{
			"label": "Windows",
			"property": "Windows",
			"operator": "equals",
			"value": false,

			"children": [
				{
					"label": "Car",
					"property": "Car",
					"operator": "equal",
					"value": true
				},
				{
					"label": "Horse",
					"property": "Horse",
					"operator": "equal",
					"value": false
				}
			]
		}
	]
};
