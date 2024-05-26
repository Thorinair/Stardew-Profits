/**
 * Set up the i18n language when the page loads.
 */
function setLanguage(){
	//Get the current selected language.
	var language = document.getElementById('select_language').value;

	//Define the i18n file.
	var filePath = language + '.json';

	fetch('i18n/' + filePath)
		.then(response => response.json())
		.then(data => {
			for (var key in data) {
				var element = document.getElementById(key);
				if (element) {
					element.innerHTML = data[key];
				}
			}
		});
}

//TODO Move to the top of the code.
(function init() {
  fetch('i18n/language-list.json')
  .then(response => response.json())
  .then(data => {
	//TODO This function get the current language file and fill all the fields.
	//TODO This should be usefull if we intend to add the langue to URL.
	 var select = document.getElementById('select_language');

    select.innerHTML = '';

    for (var i = 0; i < data.length; i++) {
      var option = document.createElement('option');
      option.value = data[i].language;
      option.text = data[i].text;
      option.id = 'language_' + i;
      select.appendChild(option);
    }

	//TODO document.body.style.display = "block";
	setLanguage();
  })
})()