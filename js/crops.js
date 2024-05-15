/*
 * All data gathered from a modified version of polarstoat/stardew-crop-data
 */

// Crop List
var crops = {
  "carrot": {
    "name": "Carrot",
    "url": "https://stardewvalleywiki.com/Carrot",
    "img": "carrot.png",
    "seeds": {
      "sell": 15,
      "pierre": 0,
      "joja": 0,
      "special": 0,
      "specialLoc": "Unpurchasable",
      "specialUrl": "https://stardewvalleywiki.com/Carrot_Seeds"
    },
    "growth": {
      "initial": 3,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 35,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "summersquash": {
    "name": "Summer Squash",
    "url": "https://stardewvalleywiki.com/Summer_Squash",
    "img": "summersquash.png",
    "seeds": {
      "sell": 20,
      "pierre": 0,
      "joja": 0,
      "special": 0,
      "specialLoc": "Unpurchasable",
      "specialUrl": "https://stardewvalleywiki.com/Summer_Squash_Seeds"
    },
    "growth": {
      "initial": 6,
      "regrow": 3
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 45,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "broccoli": {
    "name": "Broccoli",
    "url": "https://stardewvalleywiki.com/Broccoli",
    "img": "broccoli.png",
    "seeds": {
      "sell": 40,
      "pierre": 0,
      "joja": 0,
      "special": 0,
      "specialLoc": "Unpurchasable",
      "specialUrl": "https://stardewvalleywiki.com/Broccoli_Seeds"
    },
    "growth": {
      "initial": 8,
      "regrow": 4
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 70,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "powdermelon": {
    "name": "Powdermelon",
    "url": "https://stardewvalleywiki.com/Powdermelon",
    "img": "powdermelon.png",
    "seeds": {
      "sell": 20,
      "pierre": 0,
      "joja": 0,
      "special": 0,
      "specialLoc": "Unpurchasable",
      "specialUrl": "https://stardewvalleywiki.com/Powdermelon_Seeds"
    },
    "growth": {
      "initial": 7,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 70,
      "jarType": "Jelly",
      "kegType": "Wine",
      "dehydratorType": "Dried Fruit"
    }
  },
  "amaranth": {
    "name": "Amaranth",
    "url": "http://stardewvalleywiki.com/Amaranth",
    "img": "amaranth.png",
    "seeds": {
      "sell": 35,
      "pierre": 70,
      "joja": 87,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 7,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 150,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "grape": {
    "name": "Grape",
    "url": "http://stardewvalleywiki.com/Grape",
    "img": "grape.png",
    "seeds": {
      "sell": 30,
      "pierre": 60,
      "joja": 75,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 10,
      "regrow": 3
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 80,
      "jarType": "Jelly",
      "kegType": "Wine",
      "dehydratorType": "Raisins"
    }
  },
  "hops": {
    "name": "Hops",
    "url": "http://stardewvalleywiki.com/Hops",
    "img": "hops.png",
    "seeds": {
      "sell": 30,
      "pierre": 60,
      "joja": 75,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 11,
      "regrow": 1
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 25,
      "keg": 300,
      "jarType": "Pickles",
      "kegType": "Pale Ale"
    }
  },
  "pineapple": {
    "name": "Pineapple",
    "url": "http://stardewvalleywiki.com/Pineapple",
    "img": "pineapple.png",
    "seeds": {
      "sell": 240,
      "pierre": 0,
      "joja": 0,
      "special": 400,
      "specialLoc": "Island Trader",
      "specialUrl": "http://stardewvalleywiki.com/Island_Trader"
    },
    "growth": {
      "initial": 14,
      "regrow": 7
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 300,
      "jarType": "Jelly",
      "kegType": "Wine",
      "dehydratorType": "Dried Fruit"
    }
  },
  "sweetgemberry": {
    "name": "Sweet Gem Berry",
    "url": "http://stardewvalleywiki.com/Sweet_Gem_Berry",
    "img": "sweetgemberry.png",
    "seeds": {
      "sell": 200,
      "pierre": 0,
      "joja": 0,
      "special": 1000,
      "specialLoc": "Travelling Cart",
      "specialUrl": "http://stardewvalleywiki.com/Travelling_Cart"
    },
    "growth": {
      "initial": 24,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 3000
    }
  },
  "tealeaves": {
    "name": "Tea Leaves",
    "url": "http://stardewvalleywiki.com/Tea_Leaves",
    "img": "tealeaves.png",
    "seeds": {
      "sell": 0,
      "pierre": 0,
      "joja": 0,
      "special": 2500,
      "specialLoc": "Travelling Cart",
      "specialUrl": "http://stardewvalleywiki.com/Travelling_Cart"
    },
    "growth": {
      "initial": 20,
      "regrow": 1
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 50,
      "keg": 100,
      "jarType": "Pickles",
      "kegType": "Tea"
    }
  },
  "fairyrose": {
    "name": "Fairy Rose",
    "url": "http://stardewvalleywiki.com/Fairy_Rose",
    "img": "fairyrose.png",
    "seeds": {
      "sell": 100,
      "pierre": 200,
      "joja": 250,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 12,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 290
    }
  },
  "tulip": {
    "name": "Tulip",
    "url": "http://stardewvalleywiki.com/Tulip",
    "img": "tulip.png",
    "seeds": {
      "sell": 10,
      "pierre": 20,
      "joja": 25,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 6,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 30
    }
  },
  "bluejazz": {
    "name": "Blue Jazz",
    "url": "http://stardewvalleywiki.com/Blue_Jazz",
    "img": "bluejazz.png",
    "seeds": {
      "sell": 15,
      "pierre": 30,
      "joja": 37,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 7,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 50
    }
  },
  "sunflower": {
    "name": "Sunflower",
    "url": "http://stardewvalleywiki.com/Sunflower",
    "img": "sunflower.png",
    "seeds": {
      "sell": 20,
      "pierre": 200,
      "joja": 125,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 8,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 80
    }
  },
  "coffeebean": {
    "name": "Coffee Bean",
    "url": "http://stardewvalleywiki.com/Coffee_Bean",
    "img": "coffeebean.png",
    "seeds": {
      "sell": 0,
      "pierre": 0,
      "joja": 0,
      "special": 2500,
      "specialLoc": "Travelling Cart",
      "specialUrl": "http://stardewvalleywiki.com/Travelling_Cart"
    },
    "growth": {
      "initial": 10,
      "regrow": 2
    },
    "produce": {
      "extra": 3,
      "extraPerc": 1,
      "price": 15,
      "keg": 150 / 5,
      "kegType": "Coffee"
    }
  },
  "poppy": {
    "name": "Poppy",
    "url": "http://stardewvalleywiki.com/Poppy",
    "img": "poppy.png",
    "seeds": {
      "sell": 50,
      "pierre": 100,
      "joja": 125,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 7,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 140
    }
  },
  "summerspangle": {
    "name": "Summer Spangle",
    "url": "http://stardewvalleywiki.com/Summer_Spangle",
    "img": "summerspangle.png",
    "seeds": {
      "sell": 25,
      "pierre": 50,
      "joja": 62,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 8,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 90
    }
  },
  "parsnip": {
    "name": "Parsnip",
    "url": "http://stardewvalleywiki.com/Parsnip",
    "img": "parsnip.png",
    "seeds": {
      "sell": 10,
      "pierre": 20,
      "joja": 25,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 4,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 35,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "greenbean": {
    "name": "Green Bean",
    "url": "http://stardewvalleywiki.com/Green_Bean",
    "img": "greenbean.png",
    "seeds": {
      "sell": 30,
      "pierre": 60,
      "joja": 75,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 10,
      "regrow": 3
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 40,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "cauliflower": {
    "name": "Cauliflower",
    "url": "http://stardewvalleywiki.com/Cauliflower",
    "img": "cauliflower.png",
    "seeds": {
      "sell": 40,
      "pierre": 80,
      "joja": 100,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 12,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 175,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "potato": {
    "name": "Potato",
    "url": "http://stardewvalleywiki.com/Potato",
    "img": "potato.png",
    "seeds": {
      "sell": 25,
      "pierre": 50,
      "joja": 62,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 6,
      "regrow": 0
    },
    "produce": {
      "extra": 1,
      "extraPerc": 0.25, // technically (0.2^1) + (0.2^2) + (0.2^3) ...
      "price": 80,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "garlic": {
    "name": "Garlic",
    "url": "http://stardewvalleywiki.com/Garlic",
    "img": "garlic.png",
    "seeds": {
      "sell": 20,
      "pierre": 40,
      "joja": 0,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 4,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 60,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "taroroot": {
    "name": "Taro Root",
    "url": "http://stardewvalleywiki.com/Taro_Root",
    "img": "taroroot.png",
    "seeds": {
      "sell": 20,
      "pierre": 0,
      "joja": 0,
      "special": 24,
      "specialLoc": "Island Trader",
      "specialUrl": "http://stardewvalleywiki.com/Island_Trader"
    },
    "growth": {
      "initial": 10,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 100,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "kale": {
    "name": "Kale",
    "url": "http://stardewvalleywiki.com/Kale",
    "img": "kale.png",
    "seeds": {
      "sell": 35,
      "pierre": 70,
      "joja": 87,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 6,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 110,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "unmilledrice": {
    "name": "Unmilled Rice",
    "url": "http://stardewvalleywiki.com/Unmilled_Rice",
    "img": "unmilledrice.png",
    "seeds": {
      "sell": 20,
      "pierre": 40,
      "joja": 0,
      "special": 1000,
      "specialLoc": "Travelling Cart",
      "specialUrl": "http://stardewvalleywiki.com/Travelling_Cart"
    },
    "growth": {
      "initial": 8,
      "regrow": 0
    },
    "produce": {
      "extra": 1,
      "extraPerc": 0.11,
      "price": 30,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "rhubarb": {
    "name": "Rhubarb",
    "url": "http://stardewvalleywiki.com/Rhubarb",
    "img": "rhubarb.png",
    "seeds": {
      "sell": 50,
      "pierre": 0,
      "joja": 0,
      "special": 100,
      "specialLoc": "Oasis",
      "specialUrl": "http://stardewvalleywiki.com/Oasis"
    },
    "growth": {
      "initial": 13,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 220,
      "jarType": "Jelly",
      "kegType": "Wine",
      "dehydratorType": "Dried Fruit"
    }
  },
  "melon": {
    "name": "Melon",
    "url": "http://stardewvalleywiki.com/Melon",
    "img": "melon.png",
    "seeds": {
      "sell": 40,
      "pierre": 80,
      "joja": 100,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 12,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 250,
      "jarType": "Jelly",
      "kegType": "Wine",
      "dehydratorType": "Dried Fruit"
    }
  },
  "tomato": {
    "name": "Tomato",
    "url": "http://stardewvalleywiki.com/Tomato",
    "img": "tomato.png",
    "seeds": {
      "sell": 25,
      "pierre": 50,
      "joja": 62,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 11,
      "regrow": 4
    },
    "produce": {
      "extra": 1,
      "extraPerc": 0.05,
      "price": 60,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "blueberry": {
    "name": "Blueberry",
    "url": "http://stardewvalleywiki.com/Blueberry",
    "img": "blueberry.png",
    "seeds": {
      "sell": 40,
      "pierre": 80,
      "joja": 0,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 13,
      "regrow": 4
    },
    "produce": {
      "extra": 2,
      "extraPerc": 1,
      "price": 50,
      "jarType": "Jelly",
      "kegType": "Wine",
      "dehydratorType": "Dried Fruit"
    }
  },
  "hotpepper": {
    "name": "Hot Pepper",
    "url": "http://stardewvalleywiki.com/Hot_Pepper",
    "img": "hotpepper.png",
    "seeds": {
      "sell": 20,
      "pierre": 40,
      "joja": 50,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 5,
      "regrow": 3
    },
    "produce": {
      "extra": 1,
      "extraPerc": 0.03,
      "price": 40,
      "jarType": "Jelly",
      "kegType": "Wine",
      "dehydratorType": "Dried Fruit"
    }
  },
  "wheat": {
    "name": "Wheat",
    "url": "http://stardewvalleywiki.com/Wheat",
    "img": "wheat.png",
    "seeds": {
      "sell": 5,
      "pierre": 10,
      "joja": 12,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 4,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 25,
      "keg": 200,
      "jarType": "Pickles",
      "kegType": "Beer"
    }
  },
  "radish": {
    "name": "Radish",
    "url": "http://stardewvalleywiki.com/Radish",
    "img": "radish.png",
    "seeds": {
      "sell": 20,
      "pierre": 40,
      "joja": 50,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 6,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 90,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "redcabbage": {
    "name": "Red Cabbage",
    "url": "http://stardewvalleywiki.com/Red_Cabbage",
    "img": "redcabbage.png",
    "seeds": {
      "sell": 50,
      "pierre": 100,
      "joja": 0,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 9,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 260,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "starfruit": {
    "name": "Starfruit",
    "url": "http://stardewvalleywiki.com/Starfruit",
    "img": "starfruit.png",
    "seeds": {
      "sell": 200,
      "pierre": 0,
      "joja": 0,
      "special": 400,
      "specialLoc": "Oasis",
      "specialUrl": "http://stardewvalleywiki.com/Oasis"
    },
    "growth": {
      "initial": 13,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 750,
      "jarType": "Jelly",
      "kegType": "Wine",
      "dehydratorType": "Dried Fruit"
    }
  },
  "corn": {
    "name": "Corn",
    "url": "http://stardewvalleywiki.com/Corn",
    "img": "corn.png",
    "seeds": {
      "sell": 75,
      "pierre": 150,
      "joja": 187,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 14,
      "regrow": 4
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 50,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "eggplant": {
    "name": "Eggplant",
    "url": "http://stardewvalleywiki.com/Eggplant",
    "img": "eggplant.png",
    "seeds": {
      "sell": 10,
      "pierre": 20,
      "joja": 25,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 5,
      "regrow": 5
    },
    "produce": {
      "extra": 1,
      "extraPerc": 0.002,
      "price": 60,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "artichoke": {
    "name": "Artichoke",
    "url": "http://stardewvalleywiki.com/Artichoke",
    "img": "artichoke.png",
    "seeds": {
      "sell": 15,
      "pierre": 30,
      "joja": 0,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 8,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 160,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "pumpkin": {
    "name": "Pumpkin",
    "url": "http://stardewvalleywiki.com/Pumpkin",
    "img": "pumpkin.png",
    "seeds": {
      "sell": 50,
      "pierre": 100,
      "joja": 125,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 13,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 320,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "bokchoy": {
    "name": "Bok Choy",
    "url": "http://stardewvalleywiki.com/Bok_Choy",
    "img": "bokchoy.png",
    "seeds": {
      "sell": 25,
      "pierre": 50,
      "joja": 62,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 4,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 80,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "yam": {
    "name": "Yam",
    "url": "http://stardewvalleywiki.com/Yam",
    "img": "yam.png",
    "seeds": {
      "sell": 30,
      "pierre": 60,
      "joja": 75,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 10,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 160,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "cranberries": {
    "name": "Cranberries",
    "url": "http://stardewvalleywiki.com/Cranberries",
    "img": "cranberries.png",
    "seeds": {
      "sell": 60,
      "pierre": 240,
      "joja": 300,
      "special": 0,
      "specialLoc": "",
      "specialUrl": ""
    },
    "growth": {
      "initial": 7,
      "regrow": 5
    },
    "produce": {
      "extra": 1,
      "extraPerc": 1,
      "price": 75,
      "jarType": "Jelly",
      "kegType": "Wine",
      "dehydratorType": "Dried Fruit"
    }
  },
  "beet": {
    "name": "Beet",
    "url": "http://stardewvalleywiki.com/Beet",
    "img": "beet.png",
    "seeds": {
      "sell": 10,
      "pierre": 0,
      "joja": 0,
      "special": 20,
      "specialLoc": "Oasis",
      "specialUrl": "http://stardewvalleywiki.com/Oasis"
    },
    "growth": {
      "initial": 6,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 100,
      "jarType": "Pickles",
      "kegType": "Juice"
    }
  },
  "ancientfruit": {
    "name": "Ancient Fruit",
    "url": "http://stardewvalleywiki.com/Ancient_Fruit",
    "img": "ancientfruit.png",
    "seeds": {
      "sell": 30,
      "pierre": 0,
      "joja": 0,
      "special": 0,
      "specialLoc": "Unpurchasable",
      "specialUrl": "https://stardewvalleywiki.com/Ancient_Seeds"
    },
    "growth": {
      "initial": 28,
      "regrow": 7
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 550,
      "jarType": "Jelly",
      "kegType": "Wine",
      "dehydratorType": "Dried Fruit"
    }
  },
  "cactusfruit": {
    "name": "Cactus Fruit",
    "url": "http://stardewvalleywiki.com/Cactus_Fruit",
    "img": "cactusfruit.png",
    "seeds": {
      "sell": 0,
      "pierre": 0,
      "joja": 0,
      "special": 150,
      "specialLoc": "Oasis",
      "specialUrl": "http://stardewvalleywiki.com/Oasis"
    },
    "growth": {
      "initial": 12,
      "regrow": 3
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      "price": 75,
      "jarType": "Jelly",
      "kegType": "Wine",
      "dehydratorType": "Dried Fruit"
    }
  },
  "strawberry": {
    "name": "Strawberry",
    "url": "http://stardewvalleywiki.com/Strawberry",
    "img": "strawberry.png",
    "seeds": {
      "sell": 0,
      "pierre": 0,
      "joja": 0,
      "special": 100,
      "specialLoc": "Egg Festival",
      "specialUrl": "http://stardewvalleywiki.com/Egg_Festival"
    },
    "growth": {
      "initial": 8,
      "regrow": 4
    },
    "produce": {
      "extra": 1,
      "extraPerc": 0.02,
      "price": 120,
      "jarType": "Jelly",
      "kegType": "Wine",
      "dehydratorType": "Dried Fruit"
    }
  },
  "springseeds": {
    "name": "Spring Seeds",
    "url": "http://stardewvalleywiki.com/Spring_Seeds",
    "img": "springseeds.png",
    "seeds": {
      "sell": 0,
      "pierre": 0,
      "joja": 0,
      "special": 1000,
      "specialLoc": "Travelling Cart",
      "specialUrl": "http://stardewvalleywiki.com/Travelling_Cart"
    },
    "growth": {
      "initial": 7,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      // (Wild Horseradish + Daffodil + Leek + Dandelion) / 4
      "price": (50 + 30 + 60 + 40) / 4
    },
    "isWildseed": true
  },
  "summerseeds": {
    "name": "Summer Seeds",
    "url": "http://stardewvalleywiki.com/Summer_Seeds",
    "img": "summerseeds.png",
    "seeds": {
      "sell": 0,
      "pierre": 0,
      "joja": 0,
      "special": 1000,
      "specialLoc": "Travelling Cart",
      "specialUrl": "http://stardewvalleywiki.com/Travelling_Cart"
    },
    "growth": {
      "initial": 7,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      // (Spice Berry + Grape + Sweet Pea) / 3
      "price": (80 + 80 + 50) / 3,
      "jarType": "Jelly",
      "kegType": "Wine"
    },
    "isWildseed": true
  },
  "fallseeds": {
    "name": "Fall Seeds",
    "url": "http://stardewvalleywiki.com/Fall_Seeds",
    "img": "fallseeds.png",
    "seeds": {
      "sell": 0,
      "pierre": 0,
      "joja": 0,
      "special": 1000,
      "specialLoc": "Travelling Cart",
      "specialUrl": "http://stardewvalleywiki.com/Travelling_Cart"
    },
    "growth": {
      "initial": 7,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      // (Blackberry + Common Mushroom + Hazelnut + Wild Plum) / 4
      "price": (20 + 40 + 90 + 80) / 4,
      "jarType": "Jelly",
      "kegType": "Wine"
    },
    "isWildseed": true
  },
  "winterseeds": {
    "name": "Winter Seeds",
    "url": "http://stardewvalleywiki.com/Winter_Seeds",
    "img": "winterseeds.png",
    "seeds": {
      "sell": 0,
      "pierre": 0,
      "joja": 0,
      "special": 1000,
      "specialLoc": "Travelling Cart",
      "specialUrl": "http://stardewvalleywiki.com/Travelling_Cart"
    },
    "growth": {
      "initial": 7,
      "regrow": 0
    },
    "produce": {
      "extra": 0,
      "extraPerc": 0,
      // (Crocus + Crystal Fruit + Snow Yam + Winter Root) / 4
      "price": (60 + 150 + 100 + 70) / 4,
      "jarType": "Jelly",
      "kegType": "Wine"
    },
    "isWildseed": true
  }
};
