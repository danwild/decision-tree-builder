var treeData =
{
	"label": "Public",
	"property": "public",

	"children": [

		{
			"label": "Windows",
			"property": "windows",
			"operator": "equal",
			"value": false,

			"children": [
				{
					"label": "Horse",
					"property": "horse",
					"operator": "equal",
					"value": false,
					"classification": "HORSE"
				},
				{
					"label": "Car",
					"property": "car",
					"operator": "equal",
					"value": true,
					"classification": "CAR"
				}
			]
		},

		{
			"label": "Travels On",
			"property": "travels_on",
			"operator": "equal",        // operators are relative to parent!
			"value": true,              // values are relative to parent!

			"children": [
				{
					"label": "Train",
					"property": "train",
					"operator": "equal",
					"value": "track",
					"classification": "TRAIN"
				},
				{
					"label": "Bus",
					"property": "bus",
					"operator": "equal",
					"value": "road",
					"classification": "ROAD"
				}
			]
		}

	]
};
