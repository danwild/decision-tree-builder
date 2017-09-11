/*

Decision nodes have:
- name
- rules[]
- children[]

rules[] have:
 - { property, operator, value, condition? }


Leaf nodes have:
 - name
 - classification

 */

var treeData =
{
	"name": "Is Public?",
	"rules": [
		{
			"property": "isPublic",
			"operator": "equal",
			"value": true
		}
	],

	"children": [

		// falsey
		{
			"name": "Windows and doors, or Wheels?",
			"rules": [
				{
					"property": "hasWindows",
					"operator": "equal",
					"value": true
				},
				{
					"property": "accessMethod",
					"operator": "equal",
					"value": "DOORS",
					"condition": "AND"
				},
				{
					"property": "hasWheels",
					"operator": "equal",
					"value": true,
					"condition": "OR"
				}
			],

			"children": [
				// falsey
				{
					"name": "Horse?",
					"classification": "HORSE"
				},
				// truthy
				{
					"name": "Car?",
					"classification": "CAR"
				}
			]
		},

		// truthy
		{
			"name": "On Road with >10 seats?",
			"rules": [
				{
					"property": "travelsOn",
					"operator": "equal",
					"value": "ROAD"
				},
				{
					"property": "seatCount",
					"operator": "greater_than",
					"value": 10,
					"condition": "AND"
				}
			],

			"children": [
				// falsey
				{
					"name": "Train?",
					"classification": "TRAIN"
				},
				// truthy
				{
					"name": "Bus?",
					"classification": "BUS"
				}
			]
		}


	]
};
