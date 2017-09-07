var treeData =
{
	"label": "Public",
	"property": "public",

	"children": [

		{
			"label": "Windows",
			"property": "windows",

			"children": [
				{
					"label": "Horse",
					"property": "horse",
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
