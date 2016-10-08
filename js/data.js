// Options used to draw the graph.
var options = {
	"produce" : 0,
	"planted": 1,
	"days": 28,
	"fertilizer": 2,
	"level": 0,
	"season": 3,
	"buySeed": true,
	"buyFert": true,
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
var levels = [
	{
		"ratioN": 0.97,
		"ratioS": 0.02,
		"ratioG": 0.02
	},
	{
		"ratioN": 0.91,
		"ratioS": 0.06,
		"ratioG": 0.03
	},
	{
		"ratioN": 0.85,
		"ratioS": 0.10,
		"ratioG": 0.05
	},
	{
		"ratioN": 0.79,
		"ratioS": 0.14,
		"ratioG": 0.07
	},
	{
		"ratioN": 0.73,
		"ratioS": 0.18,
		"ratioG": 0.09
	},
	{
		"ratioN": 0.67,
		"ratioS": 0.22,
		"ratioG": 0.11
	},
	{
		"ratioN": 0.61,
		"ratioS": 0.26,
		"ratioG": 0.13
	},
	{
		"ratioN": 0.55,
		"ratioS": 0.30,
		"ratioG": 0.15
	},
	{
		"ratioN": 0.49,
		"ratioS": 0.34,
		"ratioG": 0.17
	},
	{
		"ratioN": 0.43,
		"ratioS": 0.38,
		"ratioG": 0.19
	},
	{
		"ratioN": 0.37,
		"ratioS": 0.42,
		"ratioG": 0.21
	}
];

// Different fertilizers with their stats.
var fertilizers = [
	{
		"name": "None",
		"ratioN": 0,
		"ratioS": 0,
		"ratioG": 0,	
		"growth": 1,
		"cost": 0
	},	
	{	
		"name": "Basic Fertilizer",	
		"ratioN": 0.33,	
		"ratioS": 0.33,
		"ratioG": 0.33,
		"growth": 1,
		"cost": 100
	},
	{
		"name": "Quality Fertilizer",
		"ratioN": 0.10,
		"ratioS": 0.30,
		"ratioG": 0.60,
		"growth": 1,
		"cost": 150
	},
	{
		"name": "Speed-Gro",
		"ratioN": 0,
		"ratioS": 0,
		"ratioG": 0,
		"growth": 0.9,
		"cost": 100
	},
	{
		"name": "Deluxe Speed-Gro",
		"ratioN": 0,
		"ratioS": 0,
		"ratioG": 0,
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
			crops.tulip
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
			crops.corn
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
			crops.corn
		]
	},
	{
		"name": "Greenhouse",
		"duration": 112,
		"crops": [
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