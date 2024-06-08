# Stardew Profits
Stardew Profits is a calculation and graphing tool designed to help the players of the popular game "Stardew Valley" to easily calculate and compare their profits from planting different crops under different conditions.

# Usage
The tool is split up to two sections: graph box and options box. The options box lets the user quickly change the parameters which are then reflected on the graph.

### Graph Box
The graph box displays a live rendered graph based on the options that the user has set. The number of bars changes based on the set conditions (like different seasons). The profit in gold can be viewed on the side as a scale. The graph shows both profit and loss. Additionally, if the seed buying loss is selected, the loss will be shown in orange, and if fertilizer buying loss is selected, the loss will be shown in brown. Hovering the mouse over a crop will show a tooltip with information about profits, loss and more. Pressing on a crop will open the official Wiki page for that crop, or you can disable this feature selecting the "Disable Links" option.

### Options Box
The following table describes all the options and how they affect the graph.

Option | Description
--- | ---
Season | Changes the season of the crops. This will affect list of the crops shown in the graph, as only some crops grow at certain seasons. Additionally, all seasons have a limit of 28 maximum days for calculation. The *Greenhouse* season doesn't have such limitations, shows all crops and allows for a duration of up to 100 thousand days.
Cross-Season | If this is checked, the calculations will take into account the crops that don't die when there's a season change.
Current Day | The current date within the selected season. This is almost the same as "Number of days", but instead of specifying how many days are left, as a convenience you can just input the current in-game date.
Number of Days | Designates the number of days to be used in the calculation. The shorter the duration, the less crops will have time to grow. Some crops might not have time to grow even once if a too low value is set.
Number of Crops | This controls the number of crops that the player has planted.
Produce Type | Designates the type of produce to be sold after harvesting. By default, all crops are harvested and sold as raw. This option accounts for Normal/Silver/Gold ratios, *Farming* skill level, and some additional skills. Other options let you select one of the three different artisan goods. *Please take note that the Dehydrator may not use all produced crops, or not have enough crops to create dried goods.
Equipment | Specifies how many Jars, Kegs, or Dehydrators you plan to use. This acts as a hard limit to the number of harvested crops on each harvest and ignores the time duration. Value is ignored when set to 0.
No Artisan Good | In case there is no available artisan good of the selected type, use the Raw crop sell price.
Excess | If there is unused produce when 5 are required for Dehydrators, or if not enough equipemnt is specified, the excess produce will be sold at normal value and added to the profit.
Dehydrator By Harvest | Dried goods will only be created that can be per harvest. If there are excess crops unused, they will not be crafted into a dry good. Deselecting this will accumulate unused excess per harvest to see if a dried good can be created.
Aging | Specifies the level of aging in a Cask for the final produce. Does not take in account how long it takes to age. This means that Hops might not necessarily be the best option as they would require a new additional Cask each day.
Profit Display | Changes how the graph is organized. ROI is calculated by dividing the profit by the expenses. Daily is calculated through the number of days set earlier.
Max Seed Money | The maximum amount of money available in player's savings. This will limit how many crops can be planted when buying seeds.
Seed Sources | Seeds can be obtained at different locations and different locations always have different costs too. This option lets you check which sources the graph should be looking for. Note that the cheapest option will always be shown on the graph. Unselecting certain locations might hide no longer obtainable crops.
Pay For Seeds | Selecting this means that the player is buying the seeds from one of the sources, instead of producing the seeds themselves (like using the *Seed Maker*). An orange bar will be shown for every crop, showing the seed loss if selected.
Process & Replant | Whether half of the harvest should be processed in a Seed Maker and replanted. Only affects crops which don't have a regrow time. Enabling this option also forces even number of planted crops. In case of Raw crops, ones with lower value will be reused for seeds first.
Use Next Year | Whether harvest should be processed for use next year. This will lower the profit of regrowing plants, as one harvest should be used to reserve seeds for next year. Can only be enabled if Process & Replant is enabled, and if Season is not set to Greenhouse.
Fertilizer | Different fertilizers can either speed up growth or increase the Normal/Silver/Gold ratios. The type of fertilizer can be selected here.
Pay For Fertilizer | Selecting this means that the player is buying the fertilizer from one of the sources, instead of producing the fertilizer themselves (like crafting). A brown bar will be shown for every crop, showing the fertilizer loss if selected.
Speed-Gro Source | Sandy sells Deluxe Speed-Gro in the Oasis cheaper than Pierre. This option allows selecting the price used. This option is disabled unless the Pay for Fertilizer is selected and Deluxe Speed-Gro is selected.
Farming Level | The level of the player's *Farming* skill. This has direct impact to the Normal/Silver/Gold ratios, but does not affect artisan goods.
Farming Level 5 Skill | The *Tilling* skill is available once the player reaches level 5 in *Farming*. This option is disabled unless the correct level is set.
Farming Level 10 Skill | Specific skills available once the player reaches level 10 in *Farming*. This option is disabled unless the correct level is set and unless *Tilling* is enabled under Level 5 skills.
Foraging Level | The level of the player's *Foraging* skill. This has direct impact to the Normal/Silver/Gold ratios, but does not affect artisan goods.
Foraging Level 5 Skill | The *Gatherer* skill is available once the player reaches level 5 in *Foraging*. This option is disabled unless the correct level is set.
Foraging Level 10 Skill | The *Botanist* skill is available once the player reaches level 10 in *Foraging*. This option is disabled unless the correct level is set and unless *Gatherer* is enabled under Level 5 skills.
Farming Food Buff | The consumable buff active on the player.
Show Extra Info | Selecting this will show additional detailed info about every crop on the tooltip.
Disable Links | Selecting this will disable opening the Official Wiki when the bar graph is clicked.

# Contact
You may contact me on the following locations: [Twitter](https://twitter.com/thorinair_music) | [Reddit](https://www.reddit.com/user/Thorinair/) | [YouTube](https://www.youtube.com/user/Thorinair) | [deviantArt](http://thorinair.deviantart.com/)