var cropList;

var svgWidth = 1080;
var svgHeight = 512;

var width = svgWidth - 64;
var height = (svgHeight - 128) / 2;
var barPadding = 4;
var barWidth = width / seasons[options.season].crops.length - barPadding;
var miniBar = 8;
var barOffsetX = 56;
var barOffsetY = 64;

var svg = d3.select("body")
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight)
	.style("background-color", "gray");

svg.append("g")
	.append("text")
		.attr("class", "axis")
		.attr("x", 48)
		.attr("y", 48)
 		.style("text-anchor", "end")
		.text("Profit");

var gAxis = svg.append("g");
var gProfit = svg.append("g");
var gSeedLoss = svg.append("g");
var gFertLoss = svg.append("g");
var gIcons = svg.append("g");

var axisY;
var barsProfit;
var barsSeed;
var barsFert;
var imgIcons;

function harvests(cropID) {
	var crop = seasons[options.season].crops[cropID];
	var season = seasons[options.season];
	var fertilizer = fertilizers[options.fertilizer];

	console.log("=== " + crop.name + " ===");

	var harvests = 1;
	var day = 1;

	if (options.skills.agri)
		day += Math.floor(crop.growth.initial * (fertilizer.growth - 0.1));
	else
		day += Math.floor(crop.growth.initial * fertilizer.growth);

	while (day <= season.duration) {
		if (crop.growth.regrow > 0) {
			console.log("Harvest on day: " + day);
			day += crop.growth.regrow;
		}
		else {
			console.log("Harvest on day: " + day);
			day += Math.floor(crop.growth.initial * fertilizer.growth);
		}

		if (day <= season.duration)
			harvests++;
	} 

	console.log("Harvests: " + harvests);
	return harvests;
}

function profit(crop) {
	var harvests = crop.harvests;
	var season = seasons[options.season];
	var fertilizer = fertilizers[options.fertilizer];
	var seeds = options.seeds;
	var produce = options.produce;

	var ratioN = levels[options.level].ratioN;
	var ratioS = levels[options.level].ratioS;
	var ratioG = levels[options.level].ratioG;

	if (fertilizer.ratioN != 0) {
		ratioN = fertilizer.ratioN;
		ratioS = fertilizer.ratioS;
		ratioG = fertilizer.ratioG;
	}

	var profit = 0;

	if (options.buySeed) {
		profit += crop.seedLoss;
		console.log("Profit (After seeds): " + profit);
	}

	if (options.buyFert) {
		profit += crop.fertLoss;
		console.log("Profit (After fertilizer): " + profit);
	}

	if (produce == 0) {
		profit += crop.produce.rawN * ratioN * harvests * options.planted;
		profit += crop.produce.rawS * ratioS * harvests * options.planted;
		profit += crop.produce.rawG * ratioG * harvests * options.planted;
		console.log("Profit (After normal produce): " + profit);

		if (crop.produce.extra > 0) {
			profit += crop.produce.rawN * crop.produce.extraPerc * crop.produce.extra * harvests * options.planted;
			console.log("Profit (After extra produce): " + profit);
		}

		if (options.skills.till) {
			profit += crop.produce.rawN * ratioN * harvests * options.planted * 0.1;
			profit += crop.produce.rawS * ratioS * harvests * options.planted * 0.1;
			profit += crop.produce.rawG * ratioG * harvests * options.planted * 0.1;

			if (crop.produce.extra > 0)
				profit += crop.produce.rawN * crop.produce.extraPerc * crop.produce.extra * harvests * options.planted * 0.1;

			console.log("Profit (After skills): " + profit);
		}
	}
	else {
		var items = harvests;
		items += crop.produce.extraPerc * crop.produce.extra * harvests;

		switch (produce) {
			case 1: profit += items * crop.produce.jar * options.planted; break;
			case 2: profit += items * crop.produce.keg * options.planted; break;
		}
		
		if (options.skills.arti) {
			switch (produce) {
				case 1: profit += items * crop.produce.jar * options.planted * 0.5; break;
				case 2: profit += items * crop.produce.keg * options.planted * 0.5; break;
			}
		}
	}
	

	console.log("Profit: " + profit);
	return profit;
}

function seedLoss(crop) {
	var harvests = crop.harvests;

	var lossArray = [];

	if (crop.seeds.pierre != 0 && options.seeds.pierre)
		lossArray.push(crop.seeds.pierre);
	if (crop.seeds.joja != 0 && options.seeds.joja)
		lossArray.push(crop.seeds.joja);
	if (crop.seeds.special != 0 && options.seeds.special)
		lossArray.push(crop.seeds.special);

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

    var loss = -lossArray[0];

	if (crop.growth.regrow == 0)
		loss = loss * harvests;

	return loss * options.planted;
}

function fertLoss(crop) {
	var harvests = crop.harvests;
	var loss = 0;
	if (crop.growth.regrow > 0)
		loss -= fertilizers[options.fertilizer].cost;
	else
		loss -= fertilizers[options.fertilizer].cost * harvests;
	return loss * options.planted;
}

function perDay(value) {
	return value / seasons[options.season].duration;
}

function fetchCrops() {
	cropList = [];

	var season = seasons[options.season];

	for (var i = 0; i < season.crops.length; i++) {
	    if ((options.seeds.pierre && season.crops[i].seeds.pierre != 0) ||
	    	(options.seeds.joja && season.crops[i].seeds.joja != 0) ||
	    	(options.seeds.special && season.crops[i].seeds.special != 0)) {
	    	cropList.push(season.crops[i]);
	    	cropList[cropList.length - 1].id = i;
		}
	}
}

function valueCrops() {
	for (var i = 0; i < cropList.length; i++) {
		cropList[i].harvests = harvests(cropList[i].id);
		cropList[i].seedLoss = seedLoss(cropList[i]);
		cropList[i].fertLoss = fertLoss(cropList[i]);
		cropList[i].profit = profit(cropList[i]);
		cropList[i].averageProfit = perDay(cropList[i].profit);
		cropList[i].averageSeedLoss = perDay(cropList[i].seedLoss);
		cropList[i].averageFertLoss = perDay(cropList[i].fertLoss);
		if (options.average) {
			cropList[i].drawProfit = cropList[i].averageProfit;
			cropList[i].drawSeedLoss = cropList[i].averageSeedLoss;
			cropList[i].drawFertLoss = cropList[i].averageFertLoss;
		}
		else {
			cropList[i].drawProfit = cropList[i].profit;
			cropList[i].drawSeedLoss = cropList[i].seedLoss;
			cropList[i].drawFertLoss = cropList[i].fertLoss;
		}
	}
}

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


	console.log("==== SORTED ====");
	for (var i = 0; i < cropList.length; i++) {
		console.log(cropList[i].drawProfit.toFixed(2) + "  " + cropList[i].name);
	}
}

function updateScaleX() {
	return d3.scale.ordinal()
		.domain(d3.range(seasons[3].crops.length))
		.rangeRoundBands([0, width]);
}

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

function renderGraph() {

	var x = updateScaleX();
	var y = updateScaleY();
	var ax = updateScaleAxis();

	var yAxis = d3.svg.axis()
		.scale(ax)
		.orient("left")
		.tickFormat(d3.format(",s"))
		.ticks(16);

	axisY = gAxis.attr("class", "axis")
		.call(yAxis)
		.attr("transform", "translate(48, " + (height - barOffsetY*2) + ")");

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
}

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
}

function updateData() {
	options.produce = parseInt(document.getElementById('select_produce').value);

	if (document.getElementById('number_planted').value <= 0)
		document.getElementById('number_planted').value = 1;
	options.planted = document.getElementById('number_planted').value;

	options.fertilizer = parseInt(document.getElementById('select_fertilizer').value);

	if (document.getElementById('number_level').value < 0)
		document.getElementById('number_level').value = 0;
	if (document.getElementById('number_level').value > 10)
		document.getElementById('number_level').value = 10;
	options.level = document.getElementById('number_level').value;

	options.season = parseInt(document.getElementById('select_season').value);

	options.buySeed = document.getElementById('check_buySeed').checked;

	options.buyFert = document.getElementById('check_buyFert').checked;

	options.average = document.getElementById('check_average').checked;

	options.seeds.pierre = document.getElementById('check_seedsPierre').checked;
	options.seeds.joja = document.getElementById('check_seedsJoja').checked;
	options.seeds.special = document.getElementById('check_seedsSpecial').checked;

	options.skills.till = document.getElementById('check_skillsTill').checked;
	options.skills.agri = document.getElementById('check_skillsAgri').checked;
	options.skills.arti = document.getElementById('check_skillsArti').checked;

	fetchCrops();
	valueCrops();
	sortCrops();
}

function initial() {
	updateData();
	renderGraph();
}

function refresh() {
	updateData();
	updateGraph();
}

function rebuild() {
	gAxis.selectAll("*").remove();
	gProfit.selectAll("*").remove();
	gSeedLoss.selectAll("*").remove();
	gFertLoss.selectAll("*").remove();
	gIcons.selectAll("*").remove();

	updateData();
	renderGraph();
}