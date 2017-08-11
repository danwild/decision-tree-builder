var treeData =
{
	"name": "Public",
	"property": "Public",
	
	"children": [

		{
			"name": "Travels On",
			"property": "Travels On",
			"operator": "equal",        // operators are relative to parent!
			"value": true,              // values are relative to parent!

			"children": [
				{
					"name": "Intercity Range",
					"property": "Intercity Range",
					"operator": "equal",
					"value": "track",
					"children": [
						{
							"name": "Train",
							"property": "Train",
							"operator": "equal",
							"value": true
						},
						{
							"name": "Tram",
							"property": "Tram",
							"operator": "equal",
							"value": false
						}
					]
				},
				{
					"name": "Bus",
					"property": "Bus",
					"operator": "equal",
					"value": "road"
				}
			]
		},

		{
			"name": "Windows",
			"property": "Windows",
			"operator": "equals",
			"value": false,

			"children": [
				{
					"name": "Car",
					"property": "Car",
					"operator": "equal",
					"value": true
				},
				{
					"name": "Alive",
					"property": "Alive",
					"operator": "equal",
					"value": false,
					"children": [
						{
							"name": "Horse",
							"property": "Horse",
							"operator": "equal",
							"value": true
						},
						{
							"name": "Wheels",
							"property": "Wheels",
							"operator": "equal",
							"value": false,
							"children": [
								{
									"name": "Motor",
									"property": "Motor",
									"operator": "equal",
									"value": 2,
									"children": [
										{
											"name": "Motorbike",
											"property": "Motorbike",
											"operator": "equal",
											"value": true
										},
										{
											"name": "Bicycle",
											"property": "Bicycle",
											"operator": "equal",
											"value": false
										}
									]
								},
								{
									"name": "Skateboard",
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
