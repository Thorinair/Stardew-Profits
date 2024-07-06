

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

function PredictExtraHarvest(crop,num_planted){
	let r2 = Math.random();
	// let chance = {};
	let extra = 0;

	/*actual game code v1.6.3
	Random r2 = Utility.CreateRandom((double)xTile * 7.0, (double)yTile * 11.0, Game1.stats.DaysPlayed, Game1.uniqueIDForThisGame);
	while (r2.NextDouble() < Math.Min(0.9, data.ExtraHarvestChance)){
		numToHarvest++;
	}
	*/

	//modified, we're just going to roll the dice once.
	// extraHarvest = (r2 < Math.min(0.9,Number(crop.extraPerc))) ? true : false;

	//Per Harvest
	if(crop.produce.extraPerc != 1){
		for (var k = 0; k < crop.harvests; k++){
			//Per Plant Picked
			for (var i = 0; i < num_planted; i++){
				r2 = Math.random();
				if (r2 < Math.min(0.9,Number(crop.produce.extraPerc))){
					extra++;
				}
		
			}
		}
	} else {
		extra = num_planted * crop.harvests;
	}
	// chance.harvest = extraHarvest;
	return extra;
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
function Predict(farmingLevel, fertilizerQualityLevel){
  var r2 = Math.random();
  let chance = {};

	let forRegularQuality	  = 0;
	let forGoldQuality      = 0.2 * (farmingLevel / 10.0) + 0.2 * fertilizerQualityLevel * ((farmingLevel + 2.0) / 12.0) + 0.01;
	let forSilverQuality 	  = Math.min(0.75, forGoldQuality * 2.0);
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

  chance.forRegularQuality = forRegularQuality;
  chance.forSilverQuality = forSilverQuality;
  chance.forGoldQuality = forGoldQuality;
  chance.forIridiumQuality = forIridiumQuality;
  chance.cropQuality = cropQuality;

  return chance;
}

/*
 * Calculates the probability of crop quality based on farmingLevel level and grade of fertilizer.
 * Math is from decompiled 1.6 game data
 *
 * @param farmingLevel The level of the Players farming skill (0-14)
 * @param fertilizerQualityLevel Quality of Fertilizer (0:Normal, 1:Silver, 2:Gold, 3:Iridium)
 * @return Object returning predicted crop quality and part of probability of potential qualities.
 */
function Probability( farmingLevel,  fertilizerQualityLevel){
	const chance = Predict(farmingLevel,fertilizerQualityLevel);
    let probability = {};
		
	let probabilityIridiumWillOccur 	= chance.forIridiumQuality;
	let probabilityIridiumWillNot	= 1 - probabilityIridiumWillOccur;
	
	let probabilityGoldWillOccur = (fertilizerQualityLevel >= 3) ? chance.forGoldQuality * probabilityIridiumWillNot : chance.forGoldQuality;
	let probabilityGoldWillNot 	= 1 - chance.forGoldQuality;
	
	let probabilitySilverWillOccur 	= probabilityGoldWillNot * chance.forSilverQuality;
	let probabilitySilverWillNot	 	= 1 - chance.forSilverQuality;
	if(fertilizerQualityLevel >= 3){
		probabilitySilverWillOccur = (probabilityGoldWillNot * probabilityIridiumWillNot < 0) ? 0.00 : probabilityGoldWillNot * probabilityIridiumWillNot;
	}
	
	let probabilityRegularWillOccur = (fertilizerQualityLevel < 3) ? probabilityGoldWillNot * probabilitySilverWillNot : 0.00;

    probability.iridium = probabilityIridiumWillOccur;
    probability.gold = probabilityGoldWillOccur;
    probability.silver = probabilitySilverWillOccur;
    probability.regular = probabilityRegularWillOccur;
		
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
		countRegular += extra;
	}

	for (let i = 0; i < totalCrops; i++ ){
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

	// totalCrops = totalHarvest * crop.harvests;

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

/*
 * Removes number of crops that will be of a specific quality based on predictions.
 *
 * @param crop Crop Data
 * @param cropsLeft Crops left unused if not selling raw.
 * @param extra Extra Crops produced
 * @return [countRegular, countSilver, countGold, countIridium] Number of produce for each quality.
 */
function RemoveCropQuality(crop,cropsLeft,extra,countRegular, countSilver, countGold, countIridium){
	if(cropsLeft != 0){
		used = (totalCrops + (extra * crop.produce.extra)) - cropsLeft //something wrong with selling excess here
		if (countRegular - used < 0){
			used -= countRegular;
			countRegular = 0;
			if (countSilver - used < 0 ){
				used -= countSilver;
				countSilver = 0;
				if (countGold - used < 0){
					used -= countGold;
					countSilver = 0;
					if (countIridium - used < 0 ){
						used -= countIridium;
						countIridium = 0;
					} else {
						countIridium -= used;
					}
				} else {
					countGold -= used;
				}
			} else {
				countSilver -= used;
			}
		} else {
			countRegular -= used;
		}
	}

	return [countRegular, countSilver, countGold, countIridium];
}

/*
 * Calculates netIncome based on Quality of Raw produce.
 *
 * @param crop Crop Data
 * @param countRegular Number of crops at regular quality.
 * @param countSilver Number of crops at silver quality.
 * @param countGold Number of crops at gold quality.
 * @param countIridium Number of crops at iridium quality.
 * @return netIncome Total Net Income based only on raw produce by quality including till skill.
 */
function PredictiveNetIncome(crop, countRegular, countSilver, countGold, countIridium){
	netIncome = 0;
	
	netIncome += crop.produce.price * countRegular;
	netIncome += Math.trunc(crop.produce.price * 1.25) * countSilver;
	netIncome += Math.trunc(crop.produce.price * 1.5) * countGold;
	netIncome += crop.produce.price * 2 * countIridium;
	
	if (options.skills.till) {
		netIncome *= 1.1;
	}

	return netIncome;
}