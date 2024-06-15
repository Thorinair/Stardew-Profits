// Prepare variables.
var cropList;

var svgWidth = 1080;
var svgMinWidth = 300;
var svgHeight = 480;

var width = svgWidth - 48;
var height = (svgHeight - 56) / 2;
var barPadding = 4;
var paddingLeft = 8;
var barWidth = width / seasons[options.season].crops.length - barPadding;
var miniBar = 8;
var barOffsetX = 29;
var barOffsetY = 40;
var graphDescription = "Profit";

// Prepare web elements.
var svg = d3.select("div.graph")
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight)
	.style("background-color", "#333333")
	.style("border-radius", "8px");

var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", 10)
	.style("visibility", "hidden")
	.style("background", "rgb(0, 0, 0)")
	.style("background", "rgba(0, 0, 0, 0.75)")
	.style("padding", "8px")
	.style("border-radius", "8px")
	.style("border", "2px solid black");

var gAxis = svg.append("g");
var gTitle = svg.append("g");
var gProfit = svg.append("g");
var gSeedLoss = svg.append("g");
var gFertLoss = svg.append("g");
var gIcons = svg.append("g");
var gTooltips = svg.append("g");

var axisY;
var barsProfit;
var barsSeed;
var barsFert;
var imgIcons;
var barsTooltips;
var options;
var MAX_INT = Number.MAX_SAFE_INTEGER || Number.MAX_VALUE;

/*
 * Formats a specified number, adding separators for thousands.
 * @param num The number to format.
 * @return Formatted string.
 */
function formatNumber(num) {
    num = num.toFixed(2) + '';
    x = num.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

/*
 * Calculates the maximum number of harvests for a crop, specified days, season, etc.
 * @param cropID The ID of the crop to calculate. This corresponds to the crop number of the selected season.
 * @return Number of harvests for the specified crop.
 */
function harvests(cropID) {
	var crop = seasons[options.season].crops[cropID];
	var fertilizer = fertilizers[options.fertilizer];
	// Tea blooms every day for the last 7 days of a season
	var isTea = crop.name == "Tea Leaves";

	// if the crop is NOT cross season, remove 28 extra days for each extra season
	var remainingDays = options.days - 28;
	if (options.crossSeason && options.season != 4) {
        var i = options.season + 1;
        if (i >= 4)
            i = 0;
		for (var j = 0; j < seasons[i].crops.length; j++) {
			var seasonCrop = seasons[i].crops[j];
			if (crop.name == seasonCrop.name) {
				remainingDays += 28;
				break;
			}
		}
	}
    else {
        remainingDays = options.days;
    }

	// console.log("=== " + crop.name + " ===");

	var harvests = 0;
	var day = 1;

	if (options.skills.agri)
		day += Math.floor(crop.growth.initial * (fertilizer.growth - 0.1));
	else
		day += Math.floor(crop.growth.initial * fertilizer.growth);

	if (day <= remainingDays && (!isTea || ((day-1) % 28 + 1) > 21))
		harvests++;

	while (day <= remainingDays) {
		if (crop.growth.regrow > 0) {
			// console.log("Harvest on day: " + day);
			day += crop.growth.regrow;
		}
		else {
			// console.log("Harvest on day: " + day);
			if (options.skills.agri)
				day += Math.floor(crop.growth.initial * (fertilizer.growth - 0.1));
			else
				day += Math.floor(crop.growth.initial * fertilizer.growth);
		}

		if (day <= remainingDays && (!isTea || ((day-1) % 28 + 1) > 21))
			harvests++;
	}

	// console.log("Harvests: " + harvests);
	return harvests;
}

/*
 * Calculates the minimum cost of a single packet of seeds.
 * @param crop The crop object, containing all the crop data.
 * @return The minimum cost of a packet of seeds, taking options into account.
 */
function minSeedCost(crop) {
	var minSeedCost = Infinity;

	if (crop.seeds.pierre != 0 && options.seeds.pierre && crop.seeds.pierre < minSeedCost)
		minSeedCost = crop.seeds.pierre;
	if (crop.seeds.joja != 0 && options.seeds.joja && crop.seeds.joja < minSeedCost)
		minSeedCost = crop.seeds.joja;
	if (crop.seeds.special != 0 && options.seeds.special && crop.seeds.special < minSeedCost)
		minSeedCost = crop.seeds.special;
    if (minSeedCost == Infinity)
        minSeedCost = 0;
	
	return minSeedCost;
}

/*
 * Calculates the number of crops planted.
 * @param crop The crop object, containing all the crop data.
 * @return The number of crops planted, taking the desired number planted and the max seed money into account.
 */
function planted(crop) {
	if (options.buySeed && options.maxSeedMoney !== 0) {
		return Math.min(options.planted, Math.floor(options.maxSeedMoney / minSeedCost(crop)));
	} else {
		return options.planted;
	}
}

/*
 * Calculates the ratios of different crop ratings based on fertilizer level and player farming level
 * Math is from Crop.harvest(...) game logic
 *
 * @param fertilizer The level of the fertilizer (none:0, basic:1, quality:2, deluxe:3)
 * @param level The total farming skill level of the player
 * @return Object containing ratios of iridium, gold, silver, and unrated crops liklihood
 */
function levelRatio(fertilizer, level, isWildseed) {
	var ratio = {};

    if (isWildseed) {
		// All wild crops are iridium if botanist is selected
		if  (options.skills.botanist)
        	ratio.ratioI = 1;
		else
			ratio.ratioI = 0;
		// Gold foraging is at a rate of foraging level/30 (and not iridium)
		ratio.ratioG = level/30.0*(1-ratio.ratioI);
		// Silver is at a rate of foraging level/15 (and not gold or iridium)
		ratio.ratioS = level/15.0*(1-ratio.ratioG-ratio.ratioI);
		// Normal is the remaining rate
		ratio.ratioN = 1-ratio.ratioS-ratio.ratioG-ratio.ratioI;
	}
    else
	{
		// Iridium is available on deluxe fertilizer at 1/2 gold ratio
    	ratio.ratioI = fertilizer >= 3 ? (0.2*(level/10.0)+0.2*fertilizer*((level+2)/12.0)+0.01)/2 : 0;
		// Calculate gold times probability of not iridium
		ratio.ratioG = (0.2*(level/10.0)+0.2*fertilizer*((level+2)/12.0)+0.01)*(1.0-ratio.ratioI);
		// Probability of silver capped at .75, times probability of not gold/iridium
		ratio.ratioS = Math.max(0,Math.min(0.75,ratio.ratioG*2.0)*(1.0-ratio.ratioG-ratio.ratioI));
		// Probability of not the other ratings
		ratio.ratioN = Math.max(0, 1.0 - ratio.ratioS - ratio.ratioG - ratio.ratioI);
	}
	return ratio;
}

/*
 * Calculates the keg modifier for the crop.
 * @param crop The crop object, containing all the crop data.
 * @return The keg modifier.
 */
function getKegModifier(crop) {
	if (options.skills.arti) {
		result = crop.produce.kegType == "Wine" ? 4.2 : 3.15;
	}
	else {
		result = crop.produce.kegType == "Wine" ? 3 : 2.25;
	}
	
    return result;
}

/*
 * Calculates the cask modifier for the crop.
 * @param crop The crop object, containing all the crop data.
 * @return The cask modifier.
 */
function getCaskModifier() {
    switch (options.aging) {
        case 1: return options.skills.arti ? 1.75 : 1.25;
        case 2: return options.skills.arti ? 2.145 : 1.5;
        case 3: return options.skills.arti ? 2.8 : 2;
        default: return options.skills.arti ? 1.4 : 1;
    }
}

/*
 * Calculates the dehydrator modifier for 5 crops.
 * @param crop The crop object, containing all the crop data.
 * @return The dehydrator modifier.
 */
function getDehydratorModifier(crop) {
	var modifier = 7.5 * crop.produce.price + 25;
	switch(crop.produce.dehydratorType){
		case "Dried Fruit":
			modifier = options.skills.arti ?  10.5 * crop.produce.price + 35 : modifier;
			break;
		default: //We aren't calculating Mushrooms thus all else would be Grapes/Rasins
			modifier = options.skills.arti ? 840 : 600;
	}
    return modifier;
}

/*
 * Calculates the profit for a specified crop.
 * @param crop The crop object, containing all the crop data.
 * @return The total profit.
 */
function profit(crop) {
    profitData = {}
	var num_planted = planted(crop);
	//var total_harvests = crop.harvests * num_planted;
	var fertilizer = fertilizers[options.fertilizer];
	var produce = options.produce;
	var isTea = crop.name == "Tea Leaves";
	var isCoffee = crop.name == "Coffee Bean";

    var useLevel = options.level;
    if (crop.isWildseed)
        useLevel = options.foragingLevel;

	var {ratioN, ratioS, ratioG, ratioI} = levelRatio(fertilizer.ratio, useLevel+options.foodLevel, crop.isWildseed);
        
	if (isTea) ratioN = 1, ratioS = ratioG = ratioI = 0;
	var netIncome = 0;
	var netExpenses = 0;
	var totalProfit = 0;
	var totalReturnOnInvestment = 0;
	var averageReturnOnInvestment = 0;
	
	//Skip keg/jar calculations for ineligible crops (where corp.produce.jar or crop.produce.keg = 0)
	
	var userawproduce = false;

	switch(produce) {
		case 1: 
			if(crop.produce.jarType == null) userawproduce = true;
			break;
		case 2:
			if(crop.produce.kegType == null) userawproduce = true;
			break;	
		case 4:
			if(crop.produce.dehydratorType == null) userawproduce = true;
			break;
	}
	
    var total_harvest = num_planted * 1.0 + num_planted * crop.produce.extraPerc * crop.produce.extra;
	var forSeeds = 0;
	if (options.replant && !isTea) {
		if (isCoffee && options.nextyear) {
			forSeeds = num_planted;
		} 
		else if (crop.growth.regrow > 0 && options.nextyear) {
			forSeeds = num_planted * 0.5;
		} 
		else if (crop.growth.regrow == 0) {
			forSeeds = num_planted * crop.harvests * 0.5;
			if(!options.nextyear && forSeeds >= 1) 
				forSeeds -= num_planted * 0.5;
		}
	}
	
	var total_crops = total_harvest * crop.harvests;
	
	// console.log("Calculating raw produce value for: " + crop.name);
	// Determine income
	if (produce != 3 || userawproduce) {
        if (userawproduce && !options.sellRaw) {
            netIncome = 0;
        }
        else {
            var countN = total_crops * ratioN;
            var countS = total_crops * ratioS;
            var countG = total_crops * ratioG;
            var countI = total_crops * ratioI;
            var tempSeeds = forSeeds;
            if (options.replant) {
                if (countN - tempSeeds < 0) {
                    tempSeeds -= countN;
                    countN = 0;
                }
                else {
                    countN -= tempSeeds;
                    tempSeeds = 0;
                }
                if (countS - tempSeeds < 0) {
                    tempSeeds -= countS;
                    countS = 0;
                }
                else {
                    countS -= tempSeeds;
                    tempSeeds = 0;
                }
                if (countG - tempSeeds < 0) {
                    tempSeeds -= countG;
                    countG = 0;
                }
                else {
                    countG -= tempSeeds;
                    tempSeeds = 0;
                }
                if (countI - tempSeeds < 0) {
                    tempSeeds -= countI;
                    countI = 0;
                }
                else {
                    countI -= tempSeeds;
                    tempSeeds = 0;
                }
            }

            if (produce == 0 || userawproduce) {
                netIncome += crop.produce.price * countN;
                netIncome += Math.trunc(crop.produce.price * 1.25) * countS;
                netIncome += Math.trunc(crop.produce.price * 1.5) * countG;
                netIncome += crop.produce.price * 2 * countI;

                if (options.skills.till) {
                    netIncome *= 1.1;
                    // console.log("Profit (After skills): " + profit);
                }

                profitData.quantitySold  = Math.floor(total_crops - forSeeds);
            }
            else if (produce == 1 || produce == 2 || produce == 4) {

                var usableCrops = 0;
                if (produce != 4 || options.byHarvest) {
                    usableCrops = Math.floor(total_harvest);
                    if (options.replant && !isTea && crop.growth.regrow == 0)
                        usableCrops -= num_planted * 0.5;
                    usableCrops = Math.max(0, usableCrops);
                }
                else {
                    usableCrops = Math.floor(total_crops - forSeeds);
                    usableCrops = Math.max(0, usableCrops);
                }

                var itemsMade = 0;
                var cropsLeft = 0;
                if (produce == 1 || produce == 2) {
                    itemsMade = usableCrops;
                }
                else if (produce == 4) {
                    cropsLeft = Math.floor(usableCrops % 5);
                    itemsMade = Math.floor(usableCrops / 5);
                }

                if (produce == 4 && options.equipment > 0 && options.byHarvest) {
                    cropsLeft += Math.max(0, itemsMade - options.equipment) * 5;
                    itemsMade = Math.min(options.equipment, itemsMade);
                }

                if (produce == 4 && options.byHarvest) {
                    cropsLeft *= crop.harvests;
                    itemsMade *= crop.harvests;
                }
                if (options.nextyear && options.byHarvest) {
                    if (produce == 4) {
                        var itemsMadeNew = Math.max(0, Math.round((itemsMade * 5 - num_planted * 0.5) / 5));
                        cropsLeft += (itemsMade - itemsMadeNew) * 5;
                        itemsMade = itemsMadeNew;
                    }
                }

                if (options.equipment > 0) {
                    if (produce == 1 || produce == 2) {
                        cropsLeft += Math.max(0, itemsMade - options.equipment) * crop.harvests;
                        itemsMade = Math.min(options.equipment, itemsMade) * crop.harvests;
                    }
                    if (produce == 4 && !options.byHarvest) {
                        cropsLeft += Math.max(0, itemsMade - options.equipment) * 5;
                        itemsMade = Math.min(options.equipment, itemsMade);
                    }
                }
                else {
                    if (produce == 1 || produce == 2) {
                        itemsMade *= crop.harvests;
                    }
                }

                if (options.nextyear) {
                    if (produce == 1 || produce == 2) {
                        cropsLeft += num_planted * 0.5;
                        itemsMade = Math.max(0, itemsMade - num_planted * 0.5);
                    }
                }

                var cropPrice = 0;
                if (options.sellExcess)
                    cropPrice = options.skills.till ? crop.produce.price * 1.1 : crop.produce.price;
                netIncome += cropsLeft * cropPrice;

                var kegModifier = getKegModifier(crop);
                var caskModifier = getCaskModifier();
                var dehydratorModifier = getDehydratorModifier(crop);
                if (options.produce == 1) {
                    netIncome += itemsMade * (crop.produce.jar != null ? crop.produce.jar : options.skills.arti ? (crop.produce.price * 2 + 50) * 1.4 : crop.produce.price * 2 + 50);
                }
                else if (options.produce == 2) {
                    netIncome += itemsMade * (crop.produce.keg != null ? crop.produce.keg * caskModifier : crop.produce.price * kegModifier);
                }
                else if (options.produce == 4) {
                    netIncome += crop.produce.dehydratorType != null ? itemsMade * dehydratorModifier : 0;
                }
        
                profitData.quantitySold = itemsMade;
                profitData.excessProduce = cropsLeft;
            }
        }
		
	}
    else if (produce == 3) {
        var items = total_crops - forSeeds;
        netIncome += 2 * items * crop.seeds.sell;
		profitData.quantitySold = Math.floor(2 * items);
    }

	// Determine expenses
	if (options.buySeed) {
		netExpenses += crop.seedLoss;
		// console.log("Profit (After seeds): " + profit);
	}

	if (options.buyFert) {
		netExpenses += crop.fertLoss;
		// console.log("Profit (After fertilizer): " + profit);
	}

	// Determine total profit
	totalProfit = netIncome + netExpenses;
	if (netExpenses != 0) {
		totalReturnOnInvestment = 100 * ((totalProfit) / -netExpenses); // Calculate the return on investment and scale it to a % increase
		if (crop.growth.regrow == 0) {
			averageReturnOnInvestment = (totalReturnOnInvestment / crop.growth.initial);
		}
		else {
			averageReturnOnInvestment = (totalReturnOnInvestment / options.days);
		}
	}
	else {
		totalReturnOnInvestment = 0;
		averageReturnOnInvestment = 0;
	}

	profitData.totalReturnOnInvestment = totalReturnOnInvestment;
	profitData.averageReturnOnInvestment = averageReturnOnInvestment;
	profitData.netExpenses = netExpenses;
    profitData.profit = totalProfit;
    profitData.ratioN = ratioN;
    profitData.ratioS = ratioS;
    profitData.ratioG = ratioG;
    profitData.ratioI = ratioI;

	// console.log("Profit: " + profit);
	return profitData;
}

/*
 * Calculates the loss to profit when seeds are bought.
 * @param crop The crop object, containing all the crop data.
 * @return The total loss.
 */
function seedLoss(crop) {
	var harvests = crop.harvests;

    var loss = -minSeedCost(crop);

	if (crop.growth.regrow == 0 && harvests > 0 && !options.replant)
		loss = loss * harvests;

	return loss * planted(crop);
}

/*
 * Calculates the loss to profit when fertilizer is bought.
 *
 * Note that harvesting does not destroy fertilizer, so this is
 * independent of the number of harvests.
 *
 * @param crop The crop object, containing all the crop data.
 * @return The total loss.
 */
function fertLoss(crop) {
	var loss;
	if(options.fertilizer == 4 && options.fertilizerSource == 1)
		loss = -fertilizers[options.fertilizer].alternate_cost;
	else
		loss = -fertilizers[options.fertilizer].cost;
	return loss * planted(crop);
}

/*
 * Converts any value to the average per day value.
 * @param value The value to convert.
 * @return Value per day.
 */
function perDay(value) {
	return value / options.days;
}

/*
 * Performs filtering on a season's crop list, saving the new list to the cropList array.
 */
function fetchCrops() {
	cropList = [];

	var season = seasons[options.season];

	for (var i = 0; i < season.crops.length; i++) {
	    if ((options.seeds.pierre && season.crops[i].seeds.pierre != 0) ||
	    	(options.seeds.joja && season.crops[i].seeds.joja != 0) ||
    	    (options.seeds.special && season.crops[i].seeds.specialLoc != "")) {
	    	cropList.push(JSON.parse(JSON.stringify(season.crops[i])));
	    	cropList[cropList.length - 1].id = i;
		}
	}
}

/*
 * Calculates all profits and losses for all crops in the cropList array.
 */
function valueCrops() {
	for (var i = 0; i < cropList.length; i++) {
        if (cropList[i].isWildseed && options.skills.gatherer) {
            cropList[i].produce.extra += 1;
            cropList[i].produce.extraPerc += 0.2;
        }
		cropList[i].planted = planted(cropList[i]);
		cropList[i].harvests = harvests(cropList[i].id);
		cropList[i].seedLoss = seedLoss(cropList[i]);
		cropList[i].fertLoss = fertLoss(cropList[i]);
		cropList[i].profitData = profit(cropList[i]);
        cropList[i].profit = cropList[i].profitData.profit;
		cropList[i].totalReturnOnInvestment = cropList[i].profitData.totalReturnOnInvestment;
		cropList[i].averageReturnOnInvestment = cropList[i].profitData.averageReturnOnInvestment;
		cropList[i].netExpenses = cropList[i].profitData.netExpenses;
		cropList[i].averageProfit = perDay(cropList[i].profit);
		cropList[i].averageSeedLoss = perDay(cropList[i].seedLoss);
		cropList[i].averageFertLoss = perDay(cropList[i].fertLoss);

		if (options.average == 1) {
			cropList[i].drawProfit = cropList[i].averageProfit;
			cropList[i].drawSeedLoss = cropList[i].averageSeedLoss;
			cropList[i].drawFertLoss = cropList[i].averageFertLoss;
			graphDescription = "Daily Profit"
		}
		else if ((options.average == 2) ){
			if (options.buySeed || (options.buyFert && fertilizers[options.fertilizer].cost > 0)) {
				cropList[i].drawProfit = cropList[i].totalReturnOnInvestment;
				graphDescription = "Total Return On Investment";
			}
			else {
				cropList[i].drawProfit = 0;
				graphDescription = "Total Profit (Choose an expense for ROI)";
			}
			cropList[i].drawSeedLoss = cropList[i].seedLoss;
			cropList[i].drawFertLoss = cropList[i].fertLoss;
		}
		else if (options.average == 3) {
			cropList[i].drawSeedLoss = cropList[i].averageSeedLoss;
			cropList[i].drawFertLoss = cropList[i].averageFertLoss;
			if (options.buySeed || (options.buyFert && fertilizers[options.fertilizer].cost > 0)) {
				cropList[i].drawProfit = cropList[i].averageReturnOnInvestment;
				graphDescription = "Daily Return On Investment";
			}
			else {
				cropList[i].drawProfit = 0;
				graphDescription = "Daily Profit (Choose an expense for ROI)";
			}
		}
		else {
			cropList[i].drawProfit = cropList[i].profit;
			cropList[i].drawSeedLoss = cropList[i].seedLoss;
			cropList[i].drawFertLoss = cropList[i].fertLoss;
			graphDescription = "Total Profit";
		}
	}
}

/*
 * Sorts the cropList array, so that the most profitable crop is the first one.
 */
function sortCrops() {
	var swapped;
    do {
        swapped = false;
        for (var i = 0; i < cropList.length - 1; i++) {
            if (cropList[i].drawProfit < cropList[i + 1].drawProfit) {
                var temp = cropList[i];
                cropList[i] = cropList[i + 1];
                cropList[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);


	// console.log("==== SORTED ====");
	for (var i = 0; i < cropList.length; i++) {
		// console.log(cropList[i].drawProfit.toFixed(2) + "  " + cropList[i].name);
	}
}

/*
 * Updates the X D3 scale.
 * @return The new scale.
 */
function updateScaleX() {
	return d3.scale.ordinal()
		.domain(d3.range(seasons[4].crops.length))
		.rangeRoundBands([0, width]);
}

/*
 * Updates the Y D3 scale.
 * @return The new scale.
 */
function updateScaleY() {
	return d3.scale.linear()
		.domain([0, d3.max(cropList, function(d) {
			if (d.drawProfit >= 0) {
				return (~~((d.drawProfit + 99) / 100) * 100);
			}
			else {
				var profit = d.drawProfit;
				if (options.buySeed) {
					if (d.seedLoss < profit)
						profit = d.drawSeedLoss;
				}
				if (options.buyFert) {
					if (d.fertLoss < profit)
						profit = d.drawFertLoss;
				}
				return (~~((-profit + 99) / 100) * 100);
			}
		})])
		.range([height, 0]);
}

/*
 * Updates the axis D3 scale.
 * @return The new scale.
 */
function updateScaleAxis() {
	return d3.scale.linear()
		.domain([
			-d3.max(cropList, function(d) {
				if (d.drawProfit >= 0) {
					return (~~((d.drawProfit + 99) / 100) * 100);
				}
				else {
					var profit = d.drawProfit;
					if (options.buySeed) {
						if (d.seedLoss < profit)
							profit = d.drawSeedLoss;
					}
					if (options.buyFert) {
						if (d.fertLoss < profit)
							profit = d.drawFertLoss;
					}
					return (~~((-profit + 99) / 100) * 100);
				}
			}),
			d3.max(cropList, function(d) {
				if (d.drawProfit >= 0) {
					return (~~((d.drawProfit + 99) / 100) * 100);
				}
				else {
					var profit = d.drawProfit;
					if (options.buySeed) {
						if (d.seedLoss < profit)
							profit = d.drawSeedLoss;
					}
					if (options.buyFert) {
						if (d.fertLoss < profit)
							profit = d.drawFertLoss;
					}
					return (~~((-profit + 99) / 100) * 100);
				}
			})])
		.range([height*2, 0]);
}

/*
 * Renders the graph.
 * This is called only when opening for the first time or when changing seasons/seeds.
 */
function renderGraph() {

	var x = updateScaleX();
	var y = updateScaleY();
	var ax = updateScaleAxis();

    var width = barOffsetX + barPadding * 2 + (barWidth + barPadding) * cropList.length + paddingLeft;
    if (width < svgMinWidth)
        width = svgMinWidth;
	svg.attr("width", width).style("padding-top", "12px");
	d3.select(".graph").attr("width", width);

	var yAxis = d3.svg.axis()
		.scale(ax)
		.orient("left")
		.tickFormat(d3.format(",s"))
		.ticks(16);

	axisY = gAxis.attr("class", "axis")
		.call(yAxis)
		.attr("transform", "translate(48, " + barOffsetY + ")");

	title = gTitle.attr("class", "Title")
		.append("text")
		.attr("class", "axis")
		.attr("x", 24)
		.attr("y", 12)
	 	.style("text-anchor", "start")
		.text(graphDescription);

	barsProfit = gProfit.selectAll("rect")
		.data(cropList)
		.enter()
		.append("rect")
			.attr("x", function(d, i) {
				if (d.drawProfit < 0 && options.buySeed && options.buyFert)
					return x(i) + barOffsetX + (barWidth / miniBar) * 2;
				else if (d.drawProfit < 0 && !options.buySeed && options.buyFert)
					return x(i) + barOffsetX + barWidth / miniBar;
				else if (d.drawProfit < 0 && options.buySeed && !options.buyFert)
					return x(i) + barOffsetX + barWidth / miniBar;
				else
					return x(i) + barOffsetX;
			})
			.attr("y", function(d) {
				if (d.drawProfit >= 0)
					return y(d.drawProfit) + barOffsetY;
				else
					return height + barOffsetY;
			})
			.attr("height", function(d) {
				if (d.drawProfit >= 0)
					return height - y(d.drawProfit);
				else
					return height - y(-d.drawProfit);
			})
			.attr("width", function(d) {
				if (d.drawProfit < 0 && options.buySeed && options.buyFert)
					return barWidth - (barWidth / miniBar) * 2;
				else if (d.drawProfit < 0 && !options.buySeed && options.buyFert)
					return barWidth - barWidth / miniBar;
				else if (d.drawProfit < 0 && options.buySeed && !options.buyFert)
					return barWidth - barWidth / miniBar;
				else
					return barWidth;
			})
 			.attr("fill", function (d) {
 				if (d.drawProfit >= 0)
 					return "lime";
 				else
 					return "red";
 			});

	barsSeed = gSeedLoss.selectAll("rect")
		.data(cropList)
		.enter()
		.append("rect")
			.attr("x", function(d, i) { return x(i) + barOffsetX; })
			.attr("y", height + barOffsetY)
			.attr("height", function(d) {
				if (options.buySeed)
					return height - y(-d.drawSeedLoss);
				else
					return 0;
			})
			.attr("width", barWidth / miniBar)
 			.attr("fill", "orange");

	barsFert = gFertLoss.selectAll("rect")
		.data(cropList)
		.enter()
		.append("rect")
			.attr("x", function(d, i) {
				if (options.buySeed)
					return x(i) + barOffsetX + barWidth / miniBar;
				else
					return x(i) + barOffsetX;
			})
			.attr("y", height + barOffsetY)
			.attr("height", function(d) {
				if (options.buyFert)
					return height - y(-d.drawFertLoss);
				else
					return 0;
			})
			.attr("width", barWidth / miniBar)
 			.attr("fill", "brown");

 	imgIcons = gIcons.selectAll("image")
		.data(cropList)
		.enter()
		.append("svg:image")
			.attr("x", function(d, i) { return x(i) + barOffsetX; })
			.attr("y", function(d) {
				if (d.drawProfit >= 0)
					return y(d.drawProfit) + barOffsetY - barWidth - barPadding;
				else
					return height + barOffsetY - barWidth - barPadding;
			})
		    .attr('width', barWidth)
		    .attr('height', barWidth)
		    .attr("xlink:href", function(d) { return "img/" + d.img; });

	barsTooltips = gTooltips.selectAll("rect")
		.data(cropList)
		.enter()
		.append("rect")
			.attr("x", function(d, i) { return x(i) + barOffsetX - barPadding/2; })
			.attr("y", function(d) {
				if (d.drawProfit >= 0)
					return y(d.drawProfit) + barOffsetY - barWidth - barPadding;
				else
					return height + barOffsetY - barWidth - barPadding;
			})
			.attr("height", function(d) {
				var topHeight = 0;

				if (d.drawProfit >= 0)
					topHeight = height + barWidth + barPadding - y(d.drawProfit);
				else
					topHeight = barWidth + barPadding;

				var lossArray = [0];

				if (options.buySeed)
					lossArray.push(d.drawSeedLoss);
				if (options.buyFert)
					lossArray.push(d.drawFertLoss);
				if (d.drawProfit < 0)
					lossArray.push(d.drawProfit);

				var swapped;
			    do {
			        swapped = false;
			        for (var i = 0; i < lossArray.length - 1; i++) {
			            if (lossArray[i] > lossArray[i + 1]) {
			                var temp = lossArray[i];
			                lossArray[i] = lossArray[i + 1];
			                lossArray[i + 1] = temp;
			                swapped = true;
			            }
			        }
			    } while (swapped);

			    return topHeight + (height - y(-lossArray[0]));
			})
			.attr("width", barWidth + barPadding)
 			.attr("opacity", "0")
 			.attr("cursor", "pointer")
			.on("mouseover", function(d) {
				tooltip.selectAll("*").remove();
				tooltip.style("visibility", "visible");

				tooltip.append("h3").attr("class", "tooltipTitle").text(d.name);

				var tooltipTable = tooltip.append("table")
					.attr("class", "tooltipTable")
					.attr("cellspacing", 0);
				var tooltipTr;


				tooltipTr = tooltipTable.append("tr");
				tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Total profit:");
				if (d.profit > 0)
					tooltipTr.append("td").attr("class", "tooltipTdRightPos").text("+" + formatNumber(d.profit))
						.append("div").attr("class", "gold");
				else
					tooltipTr.append("td").attr("class", "tooltipTdRightNeg").text(formatNumber(d.profit))
						.append("div").attr("class", "gold");

				tooltipTr = tooltipTable.append("tr");
				tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Profit per day:");
				if (d.averageProfit > 0)
					tooltipTr.append("td").attr("class", "tooltipTdRightPos").text("+" + formatNumber(d.averageProfit))
						.append("div").attr("class", "gold");
				else
					tooltipTr.append("td").attr("class", "tooltipTdRightNeg").text(formatNumber(d.averageProfit))
						.append("div").attr("class", "gold");

				if (options.buySeed || options.buyFert) {
				tooltipTr = tooltipTable.append("tr");
				tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Return on investment:");
				if (d.totalReturnOnInvestment > 0)
					tooltipTr.append("td").attr("class", "tooltipTdRightPos").text("+" + formatNumber(d.totalReturnOnInvestment) + "%");
				else
					tooltipTr.append("td").attr("class", "tooltipTdRightNeg").text(formatNumber(d.totalReturnOnInvestment) + "%");

				tooltipTr = tooltipTable.append("tr");
				tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Return on investment per day:");
				if (d.averageReturnOnInvestment > 0)
					tooltipTr.append("td").attr("class", "tooltipTdRightPos").text("+" + formatNumber(d.averageReturnOnInvestment) + "%");
				else
					tooltipTr.append("td").attr("class", "tooltipTdRightNeg").text(formatNumber(d.averageReturnOnInvestment) + "%");
				}

				if (options.buySeed) {
					tooltipTr = tooltipTable.append("tr");
					tooltipTr.append("td").attr("class", "tooltipTdLeftSpace").text("Total seed loss:");
					tooltipTr.append("td").attr("class", "tooltipTdRightNeg").text(formatNumber(d.seedLoss))
						.append("div").attr("class", "gold");

					tooltipTr = tooltipTable.append("tr");
					tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Seed loss per day:");
					tooltipTr.append("td").attr("class", "tooltipTdRightNeg").text(formatNumber(d.averageSeedLoss))
						.append("div").attr("class", "gold");
				}

				if (options.buyFert) {
					tooltipTr = tooltipTable.append("tr");
					tooltipTr.append("td").attr("class", "tooltipTdLeftSpace").text("Total fertilizer loss:");
					tooltipTr.append("td").attr("class", "tooltipTdRightNeg").text(formatNumber(d.fertLoss))
						.append("div").attr("class", "gold");

					tooltipTr = tooltipTable.append("tr");
					tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Fertilizer loss per day:");
					tooltipTr.append("td").attr("class", "tooltipTdRightNeg").text(formatNumber(d.averageFertLoss))
						.append("div").attr("class", "gold");
				}


				//Ineligible crops are sold raw.
				tooltipTr = tooltipTable.append("tr");
				tooltipTr.append("td").attr("class", "tooltipTdLeftSpace").text("Produce sold:");
				switch (options.produce) {
					case 0: 
						tooltipTr.append("td").attr("class", "tooltipTdRight").text("Raw crops"); 
						
						tooltipTr = tooltipTable.append("tr");
						tooltipTr.append("td").attr("class", "tooltipTdRight").text("Quantity sold:");

						if(d.profitData.quantitySold > 0 ){
							tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.profitData.quantitySold);
						}
						else
							tooltipTr.append("td").attr("class", "tooltipTdRightNeg").text(d.profitData.quantitySold);
						break;
					case 1:
						if (d.produce.jarType != null){
							tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.produce.jarType);
							tooltipTr = tooltipTable.append("tr");
							tooltipTr.append("td").attr("class", "tooltipTdRight").text("Quantity sold:");

                            if(d.profitData.quantitySold > 0 ){
                                tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.profitData.quantitySold);
                                tooltipTr = tooltipTable.append("tr");
                                tooltipTr.append("td").attr("class", "tooltipTdRight").text("Excess Produce:");
                                tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.profitData.excessProduce);
                            }
                            else
                                tooltipTr.append("td").attr("class", "tooltipTdRightNeg").text(d.profitData.quantitySold);
						}
						else if (options.sellRaw) {
                            tooltipTr.append("td").attr("class", "tooltipTdRightNeg").text("Raw crops");
							tooltipTr = tooltipTable.append("tr");
							tooltipTr.append("td").attr("class", "tooltipTdRight").text("Quantity sold:");
							tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.profitData.quantitySold);
						}
                        else
							tooltipTr.append("td").attr("class", "tooltipTdRightNeg").text("None");
						break;
					case 2:
						if (d.produce.kegType != null){
							tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.produce.kegType);
							tooltipTr = tooltipTable.append("tr");
							tooltipTr.append("td").attr("class", "tooltipTdRight").text("Quantity sold:");

                            if(d.profitData.quantitySold > 0 ){
                                tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.profitData.quantitySold);
                                tooltipTr = tooltipTable.append("tr");
                                tooltipTr.append("td").attr("class", "tooltipTdRight").text("Excess Produce:");
                                tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.profitData.excessProduce);
                            }
                            else
                                tooltipTr.append("td").attr("class", "tooltipTdRightNeg").text(d.profitData.quantitySold);
						}
                        else if (options.sellRaw) {
                            tooltipTr.append("td").attr("class", "tooltipTdRightNeg").text("Raw crops");
							tooltipTr = tooltipTable.append("tr");
							tooltipTr.append("td").attr("class", "tooltipTdRight").text("Quantity sold:");
							tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.profitData.quantitySold);
						}
						else
							tooltipTr.append("td").attr("class", "tooltipTdRightNeg").text("None");
						break;
					case 3: 
						tooltipTr.append("td").attr("class", "tooltipTdRight").text("Seeds"); 
						tooltipTr = tooltipTable.append("tr");
						tooltipTr.append("td").attr("class", "tooltipTdRight").text("Quantity sold:");

						if(d.profitData.quantitySold > 0 ){
							tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.profitData.quantitySold);
						}
						else
							tooltipTr.append("td").attr("class", "tooltipTdRightNeg").text(d.profitData.quantitySold);
						break;
					case 4:
						if (d.produce.dehydratorType != null){
							tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.produce.dehydratorType);
							tooltipTr = tooltipTable.append("tr");
							tooltipTr.append("td").attr("class", "tooltipTdRight").text("Quantity sold:");

							if(d.profitData.quantitySold > 0 ){
								tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.profitData.quantitySold);
								tooltipTr = tooltipTable.append("tr");
								tooltipTr.append("td").attr("class", "tooltipTdRight").text("Excess Produce:");
								tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.profitData.excessProduce);
							}
							else
								tooltipTr.append("td").attr("class", "tooltipTdRightNeg").text(d.profitData.quantitySold);
							
						}
						else if (options.sellRaw){
							tooltipTr.append("td").attr("class", "tooltipTdRightNeg").text("Raw crops");
							tooltipTr = tooltipTable.append("tr");
							tooltipTr.append("td").attr("class", "tooltipTdRight").text("Quantity sold:");
							tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.profitData.quantitySold);
						}
						else
							tooltipTr.append("td").attr("class", "tooltipTdRightNeg").text("None");
						break;
				}
				tooltipTr = tooltipTable.append("tr");
				tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Duration:");
				tooltipTr.append("td").attr("class", "tooltipTdRight").text(options.days + " days");
				tooltipTr = tooltipTable.append("tr");
				tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Planted:");
				tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.planted);
				tooltipTr = tooltipTable.append("tr");
				tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Harvests:");
				tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.harvests);

				if (options.extra) {
                    var fertilizer = fertilizers[options.fertilizer];
                    var kegModifier = getKegModifier(d);
                    var caskModifier = getCaskModifier();
					var kegPrice = d.produce.keg != null ? d.produce.keg * caskModifier : d.produce.price * kegModifier * caskModifier;
                    var dehydratorModifierByCrop = d.produce.dehydratorType != null ? getDehydratorModifier(d): 0;
                    var seedPrice = d.seeds.sell;
                    var initialGrow = 0;
                    if (options.skills.agri)
                        initialGrow += Math.floor(d.growth.initial * (fertilizer.growth - 0.1));
                    else
                        initialGrow += Math.floor(d.growth.initial * fertilizer.growth);

					tooltip.append("h3").attr("class", "tooltipTitleExtra").text("Crop info");
					tooltipTable = tooltip.append("table")
						.attr("class", "tooltipTable")
						.attr("cellspacing", 0);

                    if (!(d.isWildseed && options.skills.botanist)) {
    					tooltipTr = tooltipTable.append("tr");
    					tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Value (Normal):");
    					tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.produce.price)
    						.append("div").attr("class", "gold");
                        tooltipTr.append("td").attr("class", "tooltipTdRight").text("(" + (d.profitData.ratioN*100).toFixed(0) + "%)");
                    }
					if (d.name != "Tea Leaves") {
                        if (!(d.isWildseed && options.skills.botanist)) {
    						tooltipTr = tooltipTable.append("tr");
    						tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Value (Silver):");
    						tooltipTr.append("td").attr("class", "tooltipTdRight").text(Math.trunc(d.produce.price * 1.25))
    							.append("div").attr("class", "gold");
                            tooltipTr.append("td").attr("class", "tooltipTdRight").text("(" + (d.profitData.ratioS*100).toFixed(0) + "%)");
    						tooltipTr = tooltipTable.append("tr");
    						tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Value (Gold):");
    						tooltipTr.append("td").attr("class", "tooltipTdRight").text(Math.trunc(d.produce.price * 1.5))
    							.append("div").attr("class", "gold");
                            tooltipTr.append("td").attr("class", "tooltipTdRight").text("(" + (d.profitData.ratioG*100).toFixed(0) + "%)");
                        }
                        if ((!d.isWildseed && fertilizers[options.fertilizer].ratio >= 3) || (d.isWildseed && options.skills.botanist)) {
    						tooltipTr = tooltipTable.append("tr");
    						tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Value (Iridium):");
    						tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.produce.price * 2)
    							.append("div").attr("class", "gold");
                            tooltipTr.append("td").attr("class", "tooltipTdRight").text("(" + (d.profitData.ratioI*100).toFixed(0) + "%)");
                        }
					}
					tooltipTr = tooltipTable.append("tr");
					if (d.produce.jarType) {
						tooltipTr.append("td").attr("class", "tooltipTdLeftSpace").text("Value (" + d.produce.jarType + "):");
						tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.produce.price * 2 + 50)
						.append("div").attr("class", "gold");
					}
					else {
						tooltipTr.append("td").attr("class", "tooltipTdLeftSpace").text("Value (Jar):");
						tooltipTr.append("td").attr("class", "tooltipTdRight").text("None");
					}
					tooltipTr = tooltipTable.append("tr");
					if (d.produce.kegType) {
						tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Value (" + d.produce.kegType + "):");
						tooltipTr.append("td").attr("class", "tooltipTdRight").text(Math.round(kegPrice))
						.append("div").attr("class", "gold");
					}
					else {
						tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Value (Keg):");
						tooltipTr.append("td").attr("class", "tooltipTdRight").text("None");
					}
					tooltipTr = tooltipTable.append("tr");
					if (d.produce.dehydratorType) {
						tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Value (" + d.produce.dehydratorType + "):");
						tooltipTr.append("td").attr("class", "tooltipTdRight").text(dehydratorModifierByCrop)
						.append("div").attr("class", "gold");
					}
					else {
						tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Value (Dehydrator):");
						tooltipTr.append("td").attr("class", "tooltipTdRight").text("None");
					}
                    tooltipTr = tooltipTable.append("tr");
                    tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Value (Seeds):");
                    tooltipTr.append("td").attr("class", "tooltipTdRight").text(seedPrice)
                    .append("div").attr("class", "gold");


					var first = true;
					if (d.seeds.pierre > 0) {
						tooltipTr = tooltipTable.append("tr");
						tooltipTr.append("td").attr("class", "tooltipTdLeftSpace").text("Seeds (Pierre):");
						first = false;
						tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.seeds.pierre)
						.append("div").attr("class", "gold");
					}
					if (d.seeds.joja > 0) {
						tooltipTr = tooltipTable.append("tr");
						if (first) {
							tooltipTr.append("td").attr("class", "tooltipTdLeftSpace").text("Seeds (Joja):");
							first = false;
						}
						else
							tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Seeds (Joja):");
						tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.seeds.joja)
						.append("div").attr("class", "gold");
					}
					if (d.seeds.special > 0) {
						tooltipTr = tooltipTable.append("tr");
						if (first) {
							tooltipTr.append("td").attr("class", "tooltipTdLeftSpace").text("Seeds (Special):");
							first = false;
						}
						else
							tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Seeds (Special):");
						tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.seeds.special)
						.append("div").attr("class", "gold");
						tooltipTr = tooltipTable.append("tr");
						tooltipTr.append("td").attr("class", "tooltipTdLeft").text("");
						tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.seeds.specialLoc);
					}

					tooltipTr = tooltipTable.append("tr");
					tooltipTr.append("td").attr("class", "tooltipTdLeftSpace").text("Time to grow:");
					tooltipTr.append("td").attr("class", "tooltipTdRight").text(initialGrow + " days");
					tooltipTr = tooltipTable.append("tr");
					tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Time to regrow:");
					if (d.growth.regrow > 0)
						tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.growth.regrow + " days");
					else
						tooltipTr.append("td").attr("class", "tooltipTdRight").text("N/A");
					if (d.produce.extra > 0) {
						tooltipTr = tooltipTable.append("tr");
						tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Extra produce:");
						tooltipTr.append("td").attr("class", "tooltipTdRight").text(d.produce.extra);
						tooltipTr = tooltipTable.append("tr");
						tooltipTr.append("td").attr("class", "tooltipTdLeft").text("Extra chance:");
						tooltipTr.append("td").attr("class", "tooltipTdRight").text((d.produce.extraPerc * 100) + "%");
					}



				}
			})
			.on("mousemove", function() {
				tooltip.style("top", (d3.event.pageY - 16) + "px").style("left",(d3.event.pageX + 20) + "px");
			})
			.on("mouseout", function() { tooltip.style("visibility", "hidden"); })
			.on("click", function(d) { 
				if(!options.disableLinks)
					window.open(d.url, "_blank"); 
			});

}

/*
 * Updates the already rendered graph, showing animations.
 */
function updateGraph() {
	var x = updateScaleX();
	var y = updateScaleY();
	var ax = updateScaleAxis();

	var yAxis = d3.svg.axis()
		.scale(ax)
		.orient("left")
		.tickFormat(d3.format(",s"))
		.ticks(16);

	axisY.transition()
		.call(yAxis);

	title = gTitle.attr("class", "Title")
	.append("text")
	.attr("class", "axis")
	.attr("x", 24)
    .attr("y", 12)
	.style("text-anchor", "start")
	.text(graphDescription);

	barsProfit.data(cropList)
		.transition()
			.attr("x", function(d, i) {
				if (d.drawProfit < 0 && options.buySeed && options.buyFert)
					return x(i) + barOffsetX + (barWidth / miniBar) * 2;
				else if (d.drawProfit < 0 && !options.buySeed && options.buyFert)
					return x(i) + barOffsetX + barWidth / miniBar;
				else if (d.drawProfit < 0 && options.buySeed && !options.buyFert)
					return x(i) + barOffsetX + barWidth / miniBar;
				else
					return x(i) + barOffsetX;
			})
			.attr("y", function(d) {
				if (d.drawProfit >= 0)
					return y(d.drawProfit) + barOffsetY;
				else
					return height + barOffsetY;
			})
			.attr("height", function(d) {
				if (d.drawProfit >= 0)
					return height - y(d.drawProfit);
				else
					return height - y(-d.drawProfit);
			})
			.attr("width", function(d) {
				if (d.drawProfit < 0 && options.buySeed && options.buyFert)
					return barWidth - (barWidth / miniBar) * 2;
				else if (d.drawProfit < 0 && !options.buySeed && options.buyFert)
					return barWidth - barWidth / miniBar;
				else if (d.drawProfit < 0 && options.buySeed && !options.buyFert)
					return barWidth - barWidth / miniBar;
				else
					return barWidth;
			})
 			.attr("fill", function (d) {
 				if (d.drawProfit >= 0)
 					return "lime";
 				else
 					return "red";
 			});

	barsSeed.data(cropList)
		.transition()
			.attr("x", function(d, i) { return x(i) + barOffsetX; })
			.attr("y", height + barOffsetY)
			.attr("height", function(d) {
				if (options.buySeed)
					return height - y(-d.drawSeedLoss);
				else
					return 0;
			})
			.attr("width", barWidth / miniBar)
 			.attr("fill", "orange");

	barsFert.data(cropList)
		.transition()
			.attr("x", function(d, i) {
				if (options.buySeed)
					return x(i) + barOffsetX + barWidth / miniBar;
				else
					return x(i) + barOffsetX;
			})
			.attr("y", height + barOffsetY)
			.attr("height", function(d) {
				if (options.buyFert)
					return height - y(-d.drawFertLoss);
				else
					return 0;
			})
			.attr("width", barWidth / miniBar)
 			.attr("fill", "brown");

 	imgIcons.data(cropList)
		.transition()
			.attr("x", function(d, i) { return x(i) + barOffsetX; })
			.attr("y", function(d) {
				if (d.drawProfit >= 0)
					return y(d.drawProfit) + barOffsetY - barWidth - barPadding;
				else
					return height + barOffsetY - barWidth - barPadding;
			})
		    .attr('width', barWidth)
		    .attr('height', barWidth)
		    .attr("xlink:href", function(d) { return "img/" + d.img; });

	barsTooltips.data(cropList)
		.transition()
			.attr("x", function(d, i) { return x(i) + barOffsetX - barPadding/2; })
			.attr("y", function(d) {
				if (d.drawProfit >= 0)
					return y(d.drawProfit) + barOffsetY - barWidth - barPadding;
				else
					return height + barOffsetY - barWidth - barPadding;
			})
			.attr("height", function(d) {
				var topHeight = 0;

				if (d.drawProfit >= 0)
					topHeight = height + barWidth + barPadding - y(d.drawProfit);
				else
					topHeight = barWidth + barPadding;

				var lossArray = [0];

				if (options.buySeed)
					lossArray.push(d.drawSeedLoss);
				if (options.buyFert)
					lossArray.push(d.drawFertLoss);
				if (d.drawProfit < 0)
					lossArray.push(d.drawProfit);

				var swapped;
			    do {
			        swapped = false;
			        for (var i = 0; i < lossArray.length - 1; i++) {
			            if (lossArray[i] > lossArray[i + 1]) {
			                var temp = lossArray[i];
			                lossArray[i] = lossArray[i + 1];
			                lossArray[i + 1] = temp;
			                swapped = true;
			            }
			        }
			    } while (swapped);

			    return topHeight + (height - y(-lossArray[0]));
			})
			.attr("width", barWidth + barPadding);
}

function updateSeasonNames() {
    if (options.crossSeason) {
        document.getElementById('season_0').innerHTML = "Spring & Summer";
        document.getElementById('season_1').innerHTML = "Summer & Fall";
        document.getElementById('season_2').innerHTML = "Fall & Winter";
        document.getElementById('season_3').innerHTML = "Winter & Spring";
    }
    else {
        document.getElementById('season_0').innerHTML = "Spring";
        document.getElementById('season_1').innerHTML = "Summer";
        document.getElementById('season_2').innerHTML = "Fall";
        document.getElementById('season_3').innerHTML = "Winter";
    }
}

/*
 * Updates all options and data, based on the options set in the HTML.
 * After that, filters, values and sorts all the crops again.
 */
function updateData() {

    options.season = parseInt(document.getElementById('select_season').value);
    const isGreenhouse = options.season == 4;

	options.produce = parseInt(document.getElementById('select_produce').value);

	var tr_equipmentID = document.getElementById('tr_equipment');
	var tr_check_sellRawID = document.getElementById('tr_check_sellRaw');
	var tr_check_sellExcessID = document.getElementById('tr_check_sellExcess');
	var tr_check_byHarvestID = document.getElementById('tr_check_byHarvest');
	var tr_select_agingID = document.getElementById('tr_select_aging');

    if (options.produce == 0 || options.produce == 3) {
		tr_equipmentID.classList.add('hidden');
		tr_check_sellRawID.classList.add('hidden');
		tr_check_sellExcessID.classList.add('hidden');
		tr_check_byHarvestID.classList.add('hidden');
		tr_select_agingID.classList.add('hidden');
    }
	else if (options.produce == 1 || options.produce == 2) {
		tr_equipmentID.classList.remove('hidden');
		tr_check_sellRawID.classList.remove('hidden');
		tr_check_sellExcessID.classList.remove('hidden');
		tr_check_byHarvestID.classList.add('hidden');
		if(options.produce == 2){
			tr_select_agingID.classList.remove('hidden');
		} else {
			tr_select_agingID.classList.add('hidden');
		}
	}
    else {		
		tr_equipmentID.classList.remove('hidden');
		tr_check_sellRawID.classList.remove('hidden');
		tr_check_sellExcessID.classList.remove('hidden');
		tr_check_byHarvestID.classList.remove('hidden');
		tr_select_agingID.classList.add('hidden');
    }
    options.sellRaw 	= document.getElementById('check_sellRaw').checked;	
    options.sellExcess 	= document.getElementById('check_sellExcess').checked;
    options.byHarvest 	= document.getElementById('check_byHarvest').checked;

    if (options.produce == 0 || options.produce == 3) {
        document.getElementById('equipment').disabled = true;
        document.getElementById('equipment').style.cursor = "default";
    }
    else {
        document.getElementById('equipment').disabled = false;
        document.getElementById('equipment').style.cursor = "text";
    }
    if (document.getElementById('equipment').value < 0)
        document.getElementById('equipment').value = 0;
    options.equipment = parseInt(document.getElementById('equipment').value);

    if (options.produce == 2) {
        document.getElementById('select_aging').disabled = false;
        document.getElementById('select_aging').style.cursor = "pointer";
    }
    else {
        document.getElementById('select_aging').disabled = true;
        document.getElementById('select_aging').style.cursor = "default";
        document.getElementById('select_aging').value = 0;
    }
    options.aging = parseInt(document.getElementById('select_aging').value);

	if (document.getElementById('max_seed_money').value < 0)
		document.getElementById('max_seed_money').value = '0';
	options.maxSeedMoney = parseInt(document.getElementById('max_seed_money').value);
	if (isNaN(options.maxSeedMoney)) {
		options.maxSeedMoney = 0;
	}

	options.average = parseInt(document.getElementById('select_profit_display').value);
    
    options.crossSeason = document.getElementById('cross_season').checked;

    if (!isGreenhouse) {
        document.getElementById('number_days').disabled = true;
        document.getElementById('cross_season').disabled = false;
        document.getElementById('cross_season').style.cursor = "pointer";
        document.getElementById('current_day').disabled = false;
        document.getElementById('current_day').style.cursor = "text";

        if (document.getElementById('current_day').value <= 0)
            document.getElementById('current_day').value = 1;
        if (options.crossSeason) {
            document.getElementById('number_days').value = 56;
            if (document.getElementById('current_day').value > 56)
                document.getElementById('current_day').value = 56;
            options.days = 57 - document.getElementById('current_day').value;
        }
        else {
            document.getElementById('number_days').value = 28;
            if (document.getElementById('current_day').value > 28)
                  document.getElementById('current_day').value = 28;
            options.days = 29 - document.getElementById('current_day').value;
        }
    } else {
        document.getElementById('number_days').disabled = false;
        document.getElementById('cross_season').disabled = true;
        document.getElementById('cross_season').style.cursor = "default";
        document.getElementById('current_day').disabled = true;
        document.getElementById('current_day').style.cursor = "default";
        
        document.getElementById('current_day').value = 1;

        if (document.getElementById('number_days').value > 100000)
            document.getElementById('number_days').value = 100000;
        options.days = document.getElementById('number_days').value;
    }

	options.seeds.pierre = document.getElementById('check_seedsPierre').checked;
	options.seeds.joja = document.getElementById('check_seedsJoja').checked;
	options.seeds.special = document.getElementById('check_seedsSpecial').checked;

	options.buySeed = document.getElementById('check_buySeed').checked;

    options.replant = document.getElementById('check_replant').checked;

    if (!options.replant || isGreenhouse) {
        document.getElementById('check_nextyear').disabled = true;
        document.getElementById('check_nextyear').style.cursor = "default";
        document.getElementById('check_nextyear').checked = false;
    }
    else {
        document.getElementById('check_nextyear').disabled = false;
        document.getElementById('check_nextyear').style.cursor = "pointer";
    }
    options.nextyear = document.getElementById('check_nextyear').checked;

    if (document.getElementById('number_planted').value <= 0)
        document.getElementById('number_planted').value = 1;
    if (options.replant && parseInt(document.getElementById('number_planted').value) % 2 == 1)
        document.getElementById('number_planted').value = parseInt(document.getElementById('number_planted').value) + 1;

    options.planted = document.getElementById('number_planted').value;

	options.fertilizer = parseInt(document.getElementById('select_fertilizer').value);

	options.buyFert = document.getElementById('check_buyFert').checked;
	
	options.fertilizerSource = parseInt(document.getElementById('speed_gro_source').value);

	if (document.getElementById('farming_level').value <= 0)
		document.getElementById('farming_level').value = 0;
	if (document.getElementById('farming_level').value > 13)
		document.getElementById('farming_level').value = 13;
	options.level = parseInt(document.getElementById('farming_level').value);

	if (options.level >= 5) {
		document.getElementById('check_skillsTill').disabled = false;
		document.getElementById('check_skillsTill').style.cursor = "pointer";
		options.skills.till = document.getElementById('check_skillsTill').checked;
	}
	else {
		document.getElementById('check_skillsTill').disabled = true;
		document.getElementById('check_skillsTill').style.cursor = "default";
		document.getElementById('check_skillsTill').checked = false;
	}

	if (options.level >= 10 && options.skills.till) {
		document.getElementById('select_skills').disabled = false;
		document.getElementById('select_skills').style.cursor = "pointer";
	}
	else {
		document.getElementById('select_skills').disabled = true;
		document.getElementById('select_skills').style.cursor = "default";
		document.getElementById('select_skills').value = 0;
	}
	if (document.getElementById('select_skills').value == 1) {
		options.skills.agri = true;
		options.skills.arti = false;
	}
	else if (document.getElementById('select_skills').value == 2) {
		options.skills.agri = false;
		options.skills.arti = true;
	}
	else {
		options.skills.agri = false;
		options.skills.arti = false;
	}

    if (document.getElementById('foraging_level').value <= 0)
        document.getElementById('foraging_level').value = 0;
    if (document.getElementById('foraging_level').value > 13)
        document.getElementById('foraging_level').value = 13;
    options.foragingLevel = parseInt(document.getElementById('foraging_level').value);

    if (options.foragingLevel >= 5) {
        document.getElementById('check_skillsGatherer').disabled = false;
        document.getElementById('check_skillsGatherer').style.cursor = "pointer";
    }
    else {
        document.getElementById('check_skillsGatherer').disabled = true;
        document.getElementById('check_skillsGatherer').style.cursor = "default";
        document.getElementById('check_skillsGatherer').checked = false;
    }
    options.skills.gatherer = document.getElementById('check_skillsGatherer').checked;

    if (options.foragingLevel >= 10 && options.skills.gatherer) {
        document.getElementById('check_skillsBotanist').disabled = false;
        document.getElementById('check_skillsBotanist').style.cursor = "pointer";
    }
    else {
        document.getElementById('check_skillsBotanist').disabled = true;
        document.getElementById('check_skillsBotanist').style.cursor = "default";
        document.getElementById('check_skillsBotanist').checked = false;
    }
    options.skills.botanist = document.getElementById('check_skillsBotanist').checked;

	options.foodIndex = document.getElementById('select_food').value;
	options.foodLevel = parseInt(document.getElementById('select_food').options[options.foodIndex].value);
	if (options.buyFert && options.fertilizer == 4)
		document.getElementById('speed_gro_source').disabled = false;
	else
		document.getElementById('speed_gro_source').disabled = true;

	options.extra = document.getElementById('check_extra').checked;
	options.disableLinks = document.getElementById('disable_links').checked;

    updateSeasonNames();

	// Persist the options object into the URL hash.
	window.location.hash = encodeURIComponent(serialize(options));

	fetchCrops();
	valueCrops();
	sortCrops();
}

/*
 * Called once on startup to draw the UI.
 */
function initial() {
	optionsLoad();
	updateData();
	renderGraph();
}

/*
 * Called on every option change to animate the graph.
 */
function refresh() {
	updateData();
	gTitle.selectAll("*").remove();
	updateGraph();
}

/*
 * Parse out and validate the options from the URL hash.
 */
function optionsLoad() {
	if (!window.location.hash) return;

	options = deserialize(window.location.hash.slice(1));

	function validBoolean(q) {
		return q == 1;
	}

	function validIntRange(min, max, num) {
		return num < min ? min : num > max ? max : parseInt(num, 10);
	}

	options.season = validIntRange(0, 4, options.season);
	document.getElementById('select_season').value = options.season;

	options.produce = validIntRange(0, 4, options.produce);
	document.getElementById('select_produce').value = options.produce;

    options.equipment = validIntRange(0, MAX_INT, options.equipment);
    document.getElementById('equipment').value = options.equipment;

    options.sellRaw = validBoolean(options.sellRaw);
    document.getElementById('check_sellRaw').checked = options.sellRaw;

    options.sellExcess = validBoolean(options.sellExcess);
    document.getElementById('check_sellExcess').checked = options.sellExcess;

    options.byHarvest = validBoolean(options.byHarvest);
    document.getElementById('check_byHarvest').checked = options.byHarvest;

    options.aging = validIntRange(0, 3, options.aging);
    document.getElementById('select_aging').value = options.aging;

	options.planted = validIntRange(1, MAX_INT, options.planted);
	document.getElementById('number_planted').value = options.planted;

    options.maxSeedMoney = validIntRange(0, MAX_INT, options.maxSeedMoney);
    document.getElementById('max_seed_money').value = options.maxSeedMoney;

	options.average = validIntRange(0,3,options.average);
	document.getElementById('select_profit_display').checked = options.average;

    options.crossSeason = validBoolean(options.crossSeason);
    document.getElementById('cross_season').checked = options.crossSeason;

    var daysMax = 0;
    if (options.crossSeason)
        daysMax = options.season === 4 ? MAX_INT : 56;
    else
        daysMax = options.season === 4 ? MAX_INT : 28;

    options.days = validIntRange(1, daysMax, options.days);
    if (options.season === 4) {
        document.getElementById('number_days').value = options.days;
    } 
    else {
        if (options.crossSeason) {
            document.getElementById('number_days').value = 56;
            document.getElementById('current_day').value = 57 - options.days;
        }
        else {
            document.getElementById('number_days').value = 28;
            document.getElementById('current_day').value = 29 - options.days;
        }
    }

	options.seeds.pierre = validBoolean(options.seeds.pierre);
	document.getElementById('check_seedsPierre').checked = options.seeds.pierre;

	options.seeds.joja = validBoolean(options.seeds.joja);
	document.getElementById('check_seedsJoja').checked = options.seeds.joja;

	options.seeds.special = validBoolean(options.seeds.special);
	document.getElementById('check_seedsSpecial').checked = options.seeds.special;

	options.buySeed = validBoolean(options.buySeed);
	document.getElementById('check_buySeed').checked = options.buySeed;

    options.replant = validBoolean(options.replant);
    document.getElementById('check_replant').checked = options.replant;

    options.nextyear = validBoolean(options.nextyear);
    document.getElementById('check_nextyear').checked = options.nextyear;

	options.fertilizer = validIntRange(0, 6, options.fertilizer);
	document.getElementById('select_fertilizer').value = options.fertilizer;

    options.fertilizerSource = validIntRange(0, 1, options.fertilizerSource);
    document.getElementById('speed_gro_source').value = options.fertilizerSource;

	options.buyFert = validBoolean(options.buyFert);
	document.getElementById('check_buyFert').checked = options.buyFert;

	options.level = validIntRange(0, 13, options.level);
	document.getElementById('farming_level').value = options.level;

	options.skills.till = validBoolean(options.skills.till);
	document.getElementById('check_skillsTill').checked = options.skills.till;

	options.skills.agri = validBoolean(options.skills.agri);
	options.skills.arti = validBoolean(options.skills.arti);
	const binaryFlags = options.skills.agri + options.skills.arti * 2;
	document.getElementById('select_skills').value = binaryFlags;

    options.foragingLevel = validIntRange(0, 13, options.foragingLevel);
    document.getElementById('foraging_level').value = options.foragingLevel;

    options.skills.gatherer = validBoolean(options.skills.gatherer);
    document.getElementById('check_skillsGatherer').checked = options.skills.gatherer;

    options.skills.botanist = validBoolean(options.skills.botanist);
    document.getElementById('check_skillsBotanist').checked = options.skills.botanist;

	options.foodIndex = validIntRange(0, 6, options.foodIndex);
	document.getElementById('select_food').value = options.foodIndex;

	options.extra = validBoolean(options.extra);
	document.getElementById('check_extra').checked = options.extra;

	options.disableLinks = validBoolean(options.disableLinks);
	document.getElementById('disable_links').checked = options.disableLinks;

    updateSeasonNames();
}

function deserialize(str) {
    var json = `(${str})`
        .replace(/_/g, ' ')
        .replace(/-/g, ',')
        .replace(/\(/g, '{')
        .replace(/\)/g, '}')
        .replace(/([a-z]+)/gi, '"$1":')
        .replace(/"(true|false)":/gi, '$1');

    //console.log(json);

	return JSON.parse(json);
}

function serialize(obj) {

	return Object.keys(obj)
		.reduce((acc, key) => {
			return /^(?:true|false|\d+)$/i.test('' + obj[key])
				? `${acc}-${key}_${obj[key]}`
				: `${acc}-${key}_(${serialize(obj[key])})`;
		}, '')
		.slice(1);
}

/*
 * Called when changing season/seeds, to redraw the graph.
 */
function rebuild() {
	gAxis.selectAll("*").remove();
	gProfit.selectAll("*").remove();
	gSeedLoss.selectAll("*").remove();
	gFertLoss.selectAll("*").remove();
	gIcons.selectAll("*").remove();
	gTooltips.selectAll("*").remove();
	gTitle.selectAll("*").remove();

	updateData();
	renderGraph();
}

document.addEventListener('DOMContentLoaded', initial);
document.addEventListener('click', function (event) {
	if (event.target.id === 'reset') window.location = 'index.html';
});
