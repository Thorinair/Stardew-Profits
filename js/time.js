var current = "";

/*
 * Changes the website design based on local time.
 */
function styleByTime() {
	var t = new Date();
	var h = t.getHours();
	var temp;
	if (h >= 7 && h < 18)
		temp = "day";
	else
		temp = "night";

	if (temp != current) {
		// console.log("Switching time to " + temp + "!");
		if (temp == "day") {
			d3.select("body").style("background-image", "url(\"img/bg_day.png\")");
			current = "day";
		}
		else if (temp == "night") {
			d3.select("body").style("background-image", "url(\"img/bg_night.png\")");
			current = "night";
		}
	}

	setTimeout(styleByTime, 1000);
}

styleByTime();