

function Clamp(value, min, max){
	if (max < min)
	{
		let num = min;
		min = max;
		max = num;
	}
	if (value < min)
	{
		value = min;
	}
	if (value > max)
	{
		value = max;
	}
	return value;
}

function PredictExtraHarvest(crop,num_planted,byHarvest){
	let r2 = Math.random();
	let total = 0;
	let extraByHarvest = [];

	/*actual game code v1.6.3
	Random r2 = Utility.CreateRandom((double)xTile * 7.0, (double)yTile * 11.0, Game1.stats.DaysPlayed, Game1.uniqueIDForThisGame);
	while (r2.NextDouble() < Math.Min(0.9, data.ExtraHarvestChance)){
		numToHarvest++;
	}
	*/

	if(crop.produce.extraPerc != 0 ){		
		if(crop.produce.extraPerc != 1){
			//Per Harvest
			for (var h = 0; h < crop.harvests; h++){
				var hExtra = 0
				//Per Plant Picked
				for (var i = 0; i < num_planted; i++){
					r2 = Math.random();
					if (r2 < Math.min(0.9,Number(crop.produce.extraPerc))){
						total++;
						hExtra++;
					}
				}
				extraByHarvest[h] = hExtra;
			}
		} else {
			total = num_planted * crop.harvests;
		}
	}
	return {total, extraByHarvest};
}

/*
 * Calculates the chance of crop quality based on foraging level and foraging skill botanist.
 * Math is from decompiled 1.6 game data
 *
 * @param foragingLevel The level of the Players foraging skill (0-15)
 * @param botanist If botanist skill option is checked (True|False)
 * @return Object returning predicted crop quality and probability of potential qualities.
 */
function PredictForaging(foragingLevel,botanist){
	let chance = {};

	// All wild crops are iridium if botanist is selected
	let forIridiumQuality = (botanist) ? 1 : 0;
	let forGoldQuality = foragingLevel / 30;
	let forSilverQuality = (1 - forGoldQuality) * (foragingLevel / 15);
	let forRegularQuality = (1 - forGoldQuality) * (1 - (foragingLevel / 15));

	const r = Math.random(); //whats the max number usable here

	//Regular
	let cropQuality = 0;
	if (botanist){
		//iridium
		cropQuality = 4;
	} else if (r < (foragingLevel / 30)){
		//gold
		cropQuality = 2;
	} else if (r < (foragingLevel / 15)){
		//silver
		cropQuality = 1;
	}

	chance.iridium 		= forIridiumQuality;
	chance.gold 		= forGoldQuality;
	chance.silver 		= forSilverQuality;
	chance.regular 		= forRegularQuality;
	chance.cropQuality 	= cropQuality;

	return chance;
}

/*
 * Calculates the chance of crop quality based on farmingLevel level and grade of fertilizer.
 * Math is from decompiled 1.6 game data
 *
 * @param farmingLevel The level of the Players farming skill (0-14)
 * @param fertilizerQualityLevel Quality of Fertilizer (0:Normal, 1:Silver, 2:Gold, 3:Iridium)
 * @return Object returning predicted crop quality and part of probability of potential qualities.
 */
function Predict(farmingLevel, fertilizerQualityLevel,isTea){
	let chance = {};
	if(isTea){
		chance.forRegularQuality 	= 1;
		chance.forSilverQuality 	= 0;
		chance.forGoldQuality 		= 0;
		chance.forIridiumQuality 	= 0;
		chance.cropQuality 			= 0;
	} else {
		var r2 = Math.random();

		let forRegularQuality	= 0;
		let forGoldQuality      = 0.2 * (farmingLevel / 10.0) + 0.2 * fertilizerQualityLevel * ((farmingLevel + 2.0) / 12.0) + 0.01;
		let forSilverQuality 	= Math.min(0.75, forGoldQuality * 2.0);
		let forIridiumQuality 	= 0;
		
		if(fertilizerQualityLevel < 3){
			forRegularQuality = 1 - (forSilverQuality + forGoldQuality);
		}
		if(fertilizerQualityLevel >= 3){
			forIridiumQuality = forGoldQuality / 2.0;
		}
	
		  //Regular
		let cropQuality = 0;
		if (fertilizerQualityLevel >= 3 && r2 < forGoldQuality / 2.0)
		{
			//iridium
			cropQuality = 4;
		}
		else if (r2 < forGoldQuality)
		{
			//Gold
			cropQuality = 2;
		}
		else if (r2 < forSilverQuality || fertilizerQualityLevel >= 3)
		{
			//Silver
			cropQuality = 1;
		}
		/* Code by ConcernedApe END */
		
		let minQuailty = 0;
		let maxQuailty = 3;
		if (fertilizerQualityLevel >= 3){
			minQuailty = 1;
			 maxQuailty = 4;
		}
		cropQuality = Clamp(cropQuality, minQuailty, maxQuailty);
	
	  chance.forRegularQuality 	= forRegularQuality;
	  chance.forSilverQuality 	= forSilverQuality;
	  chance.forGoldQuality 	= forGoldQuality;
	  chance.forIridiumQuality 	= forIridiumQuality;
	  chance.cropQuality 		= cropQuality;
	}

  return chance;
}

/*
 * Calculates the conditional probability of crop quality based event chance.
 * Math is from decompiled 1.6 game data
 *
 * @param farmingLevel The level of the Players farming skill (0-14)
 * @param fertilizerQualityLevel Quality of Fertilizer (0:Normal, 1:Silver, 2:Gold, 3:Iridium)
 * @return probability Object of crop qualities probability of occuring.
 */
function Probability( farmingLevel,  fertilizerQualityLevel,isTea){
    let probability = {};
	if(isTea){
		probability.iridium = 0;
		probability.gold = 0;
		probability.silver = 0;
		probability.regular = 1;

	} else {
		const chance = Predict(farmingLevel,fertilizerQualityLevel,false);
		
		let probabilityIridiumWillOccur = chance.forIridiumQuality;
		let probabilityIridiumWillNot	= 1 - probabilityIridiumWillOccur;
		
		let probabilityGoldWillOccur 	= (fertilizerQualityLevel >= 3) ? chance.forGoldQuality * probabilityIridiumWillNot : chance.forGoldQuality;
		let probabilityGoldWillNot 		= 1 - chance.forGoldQuality;
		
		let probabilitySilverWillOccur 	= probabilityGoldWillNot * chance.forSilverQuality;
		let probabilitySilverWillNot	= 1 - chance.forSilverQuality;
		if(fertilizerQualityLevel >= 3){
			probabilitySilverWillOccur = (probabilityGoldWillNot * probabilityIridiumWillNot < 0) ? 0.00 : probabilityGoldWillNot * probabilityIridiumWillNot;
		}
		
		let probabilityRegularWillOccur = (fertilizerQualityLevel < 3) ? probabilityGoldWillNot * probabilitySilverWillNot : 0.00;
	
		probability.iridium = probabilityIridiumWillOccur;
		probability.gold = probabilityGoldWillOccur;
		probability.silver = probabilitySilverWillOccur;
		probability.regular = probabilityRegularWillOccur;
	}
		
	return probability;
		
}

/*
 * Calculates number of crops that will be of a specific quality based on predictions.
 *
 * @param crop Crop Data
 * @param totalHarvest Total Produce picked on a harvest.
 * @param useLevel Players skill level
 * @param fertilizer Fertilizer quality used.
 * @param extra Extra Crops produced
 * @return [countRegular, countSilver, countGold, countIridium] Number of produce for each quality.
 */
function CountCropQuality(crop,totalHarvest,useLevel,fertilizer,extra){
	var countRegular = 0
	var countSilver = 0
	var countGold = 0
	var countIridium = 0

	totalCrops = totalHarvest * crop.harvests;

	if (extra > 0 ){
		countRegular += (extra * crop.produce.extra);
	}

	for (let i = 0; i < totalCrops; i++ ){
		const predicted = (crop.isWildseed) ? PredictForaging(options.foragingLevel,options.skills.botanist) : Predict(useLevel+options.foodLevel,fertilizer.ratio,crop.name == "Tea Leaves");
		
		switch(predicted.cropQuality){
			case 4:
				countIridium++
				break;
			case 2:
				countGold++
				break;
			case 1:
				countSilver++
				break;
			default:
				countRegular++
				break;
		}
	}

	return [countRegular, countSilver, countGold, countIridium];
}

/*
 * Calculates number of crops that will be of a specific quality based on predictions per harvest.
 *
 * @param crop Crop Data
 * @param totalHarvest Total Produce picked on a harvest.
 * @param useLevel Players skill level
 * @param fertilizer Fertilizer quality used.
 * @param extra Extra Crops produced
 * @return [countRegular, countSilver, countGold, countIridium] Number of produce for each quality.
 */
function CountCropQualityByHarvest(crop,totalHarvest,useLevel,fertilizer,extra){
	var countRegular = 0
	var countSilver = 0
	var countGold = 0
	var countIridium = 0
	var harvest = []

	if (extra > 0 ){
		countRegular += extra;
	}

	for (let h = 0; h < crop.harvests; h++){
		for (let i = 0; i < totalHarvest; i++ ){
			const predicted = (crop.isWildseed) ? PredictForaging(options.foragingLevel,options.skills.botanist) : Predict(useLevel+options.foodLevel,fertilizer.ratio);
			
			switch(predicted.cropQuality){
				case 4:
					countIridium++
					break;
				case 2:
					countGold++
					break;
				case 1:
					countSilver++
					break;
				default:
					countRegular++
					break;
			}
		}
		harvest[h] = [countRegular, countSilver, countGold, countIridium]
		countRegular = 0
		countSilver = 0
		countGold = 0
		countIridium = 0
	}

	return harvest;
	
}