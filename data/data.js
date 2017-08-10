var treeData =
{
	"name": "Animal Classification",
	"children": [

		// 2-1
		{
			"name": "Has Legs",
			"property": "Has Legs",
			"operator": "equals",
			"value": "TRUE",

			"children": [

				// # 3-1
				{
					"name": "Has Fur",
					"property": "Has Fur",
					"operator": "equals",
					"value": "TRUE",
					"children": [
						{
							"name": "Might be a DOG",
							"property": "Might be a DOG",
							"operator": "equals",
							"value": "TRUE",
							"children": [

								// 2-1
								{
									"name": "Might be a FISH",
									"property": "Might be a FISH",
									"operator": "equals",
									"value": "TRUE"
								},

								// 2-2
								{
									"name": "Might be a SNAKE",
									"property": "Might be a SNAKE",
									"operator": "equals",
									"value": "TRUE"
								}
							]
						}
					]
				},

				// 3-2
				{
					"name": "Has fur",
					"property": "Has fur",
					"operator": "equals",
					"value": "FALSE",
					"children": [
						{
							"name": "Might be a BIRD",
							"property": "Might be a BIRD",
							"operator": "equals",
							"value": "TRUE",
							"children": [

								// 2-1
								{
									"name": "Might be a FISH",
									"property": "Might be a FISH",
									"operator": "equals",
									"value": "TRUE"
								},

								// 2-2
								{
									"name": "Might be a SNAKE",
									"property": "Might be a SNAKE",
									"operator": "equals",
									"value": "TRUE"
								}
							]
						}
					]
				}
			]
		},

		// 2-2
		{
			"name": "No Legs",
			"property": "Has Legs",
			"operator": "equals",
			"value": "FALSE",

			"children": [

				// 2-1
				{
					"name": "Might be a FISH",
					"property": "Might be a FISH",
					"operator": "equals",
					"value": "TRUE",
					"children": [

						// 2-1
						{
							"name": "Might be a FISH",
							"property": "Might be a FISH",
							"operator": "equals",
							"value": "TRUE"
						},

						// 2-2
						{
							"name": "Might be a SNAKE",
							"property": "Might be a SNAKE",
							"operator": "equals",
							"value": "TRUE",
							"children": [

								// 2-1
								{
									"name": "Might be a FISH",
									"property": "Might be a FISH",
									"operator": "equals",
									"value": "TRUE"
								},

								// 2-2
								{
									"name": "Might be a SNAKE",
									"property": "Might be a SNAKE",
									"operator": "equals",
									"value": "TRUE"
								}
							]
						}
					]
				},

				// 2-2
				{
					"name": "Might be a SNAKE",
					"property": "Might be a SNAKE",
					"operator": "equals",
					"value": "TRUE",
					"children": [

						// 2-1
						{
							"name": "Might be a FISH",
							"property": "Might be a FISH",
							"operator": "equals",
							"value": "TRUE"
						},

						// 2-2
						{
							"name": "Might be a SNAKE",
							"property": "Might be a SNAKE",
							"operator": "equals",
							"value": "TRUE"
						}
					]
				}
			]
		}
	]
};