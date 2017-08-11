var schema = {

	properties: [

		{
			"animal": {
				"label": "Animal",
				"operators": [
					"equal",
					"not-equal"
				],
				"inputType": "select",
				"values": [
					"prawn",
					"chicken",
					"puppy",
					"snake",
					"spider"
				]
			},

			"legs": {
				"label": "Number of legs",
				"operators": [
					"greater-than",
					"less-than",
					"equal",
					"not-equal"
				],
				"inputType": "number",
				"values": null
			},

			"eyes": {
				"label": "Number of eyes",
				"operators": [
					"greater-than",
					"less-than",
					"equal",
					"not-equal"
				],
				"inputType": "number",
				"values": null
			},

			"venomous": {
				"label": "Can be venomous",
				"operators": [
					"greater-than",
					"less-than",
					"equal",
					"not-equal"
				],
				"inputType": "boolean",
				"values": null
			},

			"bodyCovering": {
				"label": "Body covered in?",
				"operators": [
					"equal",
					"not-equal"
				],
				"inputType": "select",
				"values": [
					"scales",
					"fur",
					"feathers",
					"skin"
				]
			}
		}

	]

};