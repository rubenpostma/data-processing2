// Ruben Postma
// 1338935

// maak dictionary voor data set
var dataset = {}
// haal data uit JSON file
d3.json("map.json", function(data) {
  // ga elk element van data af
  for (var i = 0; i < data.length; i++) {
    // maak country code variabele
    var country = data[i][0];
    // geef country keys percetage en type fill afgeleid van data uit json file en voeg die toe aan dataset   
    dataset[country] = {percentage : Number(data[i][1]).toFixed(2), fillKey : pickType(Number(data[i][1]))};
  }

  // selecteer data map in  container1
  $("#container1").datamap({
    scope: 'world',
    // geef grenzen kleur
    geography_config: {
      borderColor: '#00446A',
      // geef grenzen aan bij hover
      highlightBorderColor: 'rgba(0,0,0,0.5)',
      // voeg label toe met data van datamap en JSON fil
      popupTemplate: _.template([
        '<div class="hoverinfo">',
        '<strong><%= geography.properties.name %>:</strong></br>',
         '<% if (data.percentage) { %> <%= data.percentage %>% of forest area<br/><% } %>',
        '</div>'
        ].join('') )
    },
    // defineer kleur bepaalde fillKeys
    fills: {
      typeone: "#edf8e9",
      typetwo: "#bae4b3",
      typethree: "#74c476",
      typefour: "#31a354",
      typefive: "#006d2c",
      // wanneer geen data er is, donkerblauw
      defaultFill: '#00446A'
    },
    // koppel data aan dataset
    data: dataset
  });

});


function pickType(value) {
	// kies op basis van value kleur getallen zijn in procent
	if (value < 20) {
       	// en return fillkey
       	return "typeone";               	
    }
    else if (20 <= value && value < 40) {
      	return "typetwo";
    }
    else if (40 <= value && value < 60) {
    	return "typethree";
    }
    else if (60 <= value && value < 80) {
      	return "typefour";
    }
    else if (value => 80) {
        return "typefive" ;
    }
}