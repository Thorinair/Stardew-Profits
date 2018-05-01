// Options used to draw the graph.
var options = {
	"produce" : 0,
	"planted": 1,
	"days": 28,
	"fertilizer": 2,
	"level": 0,
	"season": 3,
	"buySeed": false,
	"buyFert": false,
	"average": false,
	"seeds": {
		"pierre": true,
		"joja": true,
		"special": true
	},
	"skills": {
		"till": false,
		"agri": false,
		"arti": false
	},
	"extra": false
};

// Different player levels with respective ratios.
var ratios = {
	"none": [
		{
			"ratioN": 0.97,
			"ratioS": 0.02,
			"ratioG": 0.01
		},
		{
			"ratioN": 0.91,
			"ratioS": 0.06,
			"ratioG": 0.03
		},
		{
			"ratioN": 0.86,
			"ratioS": 0.10,
			"ratioG": 0.05
		},
		{
			"ratioN": 0.80,
			"ratioS": 0.13,
			"ratioG": 0.07
		},
		{
			"ratioN": 0.75,
			"ratioS": 0.16,
			"ratioG": 0.09
		},
		{
			"ratioN": 0.69,
			"ratioS": 0.20,
			"ratioG": 0.11
		},
		{
			"ratioN": 0.64,
			"ratioS": 0.23,
			"ratioG": 0.13
		},
		{
			"ratioN": 0.60,
			"ratioS": 0.26,
			"ratioG": 0.15
		},
		{
			"ratioN": 0.55,
			"ratioS": 0.28,
			"ratioG": 0.17
		},
		{
			"ratioN": 0.50,
			"ratioS": 0.31,
			"ratioG": 0.19
		},
		{
			"ratioN": 0.46,
			"ratioS": 0.33,
			"ratioG": 0.21
		}
	],
	"basic": [
		{
			"ratioN": 0.87,
			"ratioS": 0.09,
			"ratioG": 0.04
		},
		{
			"ratioN": 0.77,
			"ratioS": 0.15,
			"ratioG": 0.08
		},
		{
			"ratioN": 0.68,
			"ratioS": 0.20,
			"ratioG": 0.12
		},
		{
			"ratioN": 0.59,
			"ratioS": 0.26,
			"ratioG": 0.15
		},
		{
			"ratioN": 0.50,
			"ratioS": 0.31,
			"ratioG": 0.19
		},
		{
			"ratioN": 0.42,
			"ratioS": 0.35,
			"ratioG": 0.23
		},
		{
			"ratioN": 0.35,
			"ratioS": 0.39,
			"ratioG": 0.26
		},
		{
			"ratioN": 0.28,
			"ratioS": 0.42,
			"ratioG": 0.30
		},
		{
			"ratioN": 0.22,
			"ratioS": 0.44,
			"ratioG": 0.34
		},
		{
			"ratioN": 0.16,
			"ratioS": 0.47,
			"ratioG": 0.37
		},
		{
			"ratioN": 0.15,
			"ratioS": 0.44,
			"ratioG": 0.41
		}
	],
	"quality": [
		{
			"ratioN": 0.78,
			"ratioS": 0.14,
			"ratioG": 0.08
		},
		{
			"ratioN": 0.64,
			"ratioS": 0.23,
			"ratioG": 0.13
		},
		{
			"ratioN": 0.52,
			"ratioS": 0.30,
			"ratioG": 0.18
		},
		{
			"ratioN": 0.40,
			"ratioS": 0.36,
			"ratioG": 0.24
		},
		{
			"ratioN": 0.30,
			"ratioS": 0.41,
			"ratioG": 0.29
		},
		{
			"ratioN": 0.20,
			"ratioS": 0.46,
			"ratioG": 0.34
		},
		{
			"ratioN": 0.15,
			"ratioS": 0.45,
			"ratioG": 0.40
		},
		{
			"ratioN": 0.14,
			"ratioS": 0.41,
			"ratioG": 0.45
		},
		{
			"ratioN": 0.12,
			"ratioS": 0.38,
			"ratioG": 0.50
		},
		{
			"ratioN": 0.11,
			"ratioS": 0.33,
			"ratioG": 0.56
		},
		{
			"ratioN": 0.10,
			"ratioS": 0.29,
			"ratioG": 0.61
		}
	]
};

// Different fertilizers with their stats.
var fertilizers = [
	{
		"name": "None",
		"ratio": "none",
		"growth": 1,
		"cost": 0
	},	
	{	
		"name": "Basic Fertilizer",	
		"ratio": "basic",
		"growth": 1,
		"cost": 100
	},
	{
		"name": "Quality Fertilizer",
		"ratio": "quality",
		"growth": 1,
		"cost": 150
	},
	{
		"name": "Speed-Gro",
		"ratio": "none",
		"growth": 0.9,
		"cost": 100
	},
	{
		"name": "Deluxe Speed-Gro",
		"ratio": "none",
		"growth": 0.75,
		"cost": 150
	}
];

// Different seasons with predefined crops.
var seasons = [
	{
		"name": "Spring",
		"duration": 28,
		"crops": [
			crops.coffeebean,
			crops.strawberry,
			crops.rhubarb,
			crops.potato,
			crops.cauliflower,
			crops.greenbean,
			crops.kale,
			crops.garlic,
			crops.parsnip,
			crops.bluejazz,
			crops.tulip,
			crops.ancientfruit
		]
	},
	{
		"name": "Summer",
		"duration": 28,
		"crops": [
			crops.blueberry,
			crops.starfruit,
			crops.redcabbage,
			crops.hops,
			crops.melon,
			crops.hotpepper,
			crops.tomato,
			crops.radish,
			crops.summerspangle,
			crops.poppy,
			crops.wheat,
			crops.corn,
			crops.coffeebean,
			crops.sunflower,
			crops.ancientfruit
		]
	},
	{
		"name": "Fall",
		"duration": 28,
		"crops": [
			crops.sweetgemberry,
			crops.cranberries,
			crops.pumpkin,
			crops.grape,
			crops.artichoke,
			crops.beet,
			crops.eggplant,
			crops.amaranth,
			crops.yam,
			crops.fairyrose,
			crops.bokchoy,
			crops.sunflower,
			crops.wheat,
			crops.corn,
			crops.ancientfruit
		]
	},
	{
		"name": "Greenhouse",
		"duration": 112,
		"crops": [
			crops.coffeebean,
			crops.strawberry,
			crops.rhubarb,
			crops.potato,
			crops.cauliflower,
			crops.greenbean,
			crops.kale,
			crops.garlic,
			crops.parsnip,
			crops.bluejazz,
			crops.tulip,
			crops.blueberry,
			crops.starfruit,
			crops.redcabbage,
			crops.hops,
			crops.melon,
			crops.hotpepper,
			crops.tomato,
			crops.radish,
			crops.summerspangle,
			crops.poppy,
			crops.wheat,
			crops.corn,
			crops.sweetgemberry,
			crops.cranberries,
			crops.pumpkin,
			crops.grape,
			crops.artichoke,
			crops.beet,
			crops.eggplant,
			crops.amaranth,
			crops.yam,
			crops.fairyrose,
			crops.bokchoy,
			crops.sunflower,
			crops.ancientfruit
		]
	}
];