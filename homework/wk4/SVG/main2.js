// als pagina laadt
window.onload = function() {
	// haal lijst uit data tag (opgehaal met jsonconverter.py)
	var lijst = document.getElementById("data").innerHTML
	// split de lijst string op nieuwe regel
	lijst = lijst.split('\n');
	// ga elk element van de lijst af
	for(var i = 0; i < lijst.length - 1; i++) {
		// maak van string een array
		lijst[i] = JSON.parse( lijst[i]);
		// maak van tweede element (percentage) een cijfer
		lijst[i][1] = Number(lijst[i][1]);
		// ga elke onderdeel van landen code element
		for (var j = 0; j < country_codes.length; j++){
           	// wanneer de landen namen in beide arrays overkomen
           	if (lijst[i][0] == country_codes[j][2]){
           		// maak countrycode id voor changeColor
           		var countryCode = country_codes[j][0];
           		// roep pickColor op
           		pickColor(countryCode, lijst[i][1]);
            	
            }
        }
    }
		
}

function changeColor(id, color) {
     // haal path van land op
     var land = document.getElementById(id);
     // staat land op europa kaart
     if (land != null) {
     	// kleur land
     	return land.style.fill = color;
     }
     // zo niet
     else {
     	// return false
     	return false;
     }
}

function pickColor(id, value) {
	// kies op basis van value kleur
	if (value < 20) {
       	// en roep changeColor op
       	return changeColor(id, "#edf8e9");               	
    }
    else if (20 <= value && value < 30) {
      	return changeColor(id, "#bae4b3");
    }
    else if (30 <= value && value < 35) {
    	return changeColor(id, "#74c476");
    }
    else if (35 <= value && value < 45) {
      	return changeColor(id, "#31a354");
    }
    else if (value > 45) {
        return changeColor(id, "#006d2c");
    }
}