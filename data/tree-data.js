var treeData =
{
	"label": "Public label",
	"property": "Public",
	
	"children": [

		{
			"label": "Travels On",
			"property": "Travels On",
			"operator": "equal",        // operators are relative to parent!
			"value": true,              // values are relative to parent!

			"children": [
				{
					"label": "Intercity Range",
					"property": "Intercity Range",
					"operator": "equal",
					"value": "track",
					"children": [
						{
							"label": "Train",
							"property": "Train",
							"operator": "equal",
							"value": true
						},
						{
							"label": "Tram",
							"property": "Tram",
							"operator": "equal",
							"value": false
						}
					]
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
					"label": "Alive",
					"property": "Alive",
					"operator": "equal",
					"value": false,
					"children": [
						{
							"label": "Horse",
							"property": "Horse",
							"operator": "equal",
							"value": true
						},
						{
							"label": "Wheels",
							"property": "Wheels",
							"operator": "equal",
							"value": false,
							"children": [
								{
									"label": "Motor",
									"property": "Motor",
									"operator": "equal",
									"value": 2,
									"children": [
										{
											"label": "Motorbike",
											"property": "Motorbike",
											"operator": "equal",
											"value": true
										},
										{
											"label": "Bicycle",
											"property": "Bicycle",
											"operator": "equal",
											"value": false
										}
									]
								},
								{
									"label": "Skateboard",
									"property": "Wheels",
									"operator": "equal",
									"value": 4
								}
							]
						}
					]
				}
			]
		}
	]
};
