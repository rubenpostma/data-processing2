// Ruben Postma
// 1338935

$("#container1").datamap({
   scope: 'world',
   geography_config: {
     borderColor: 'rgba(255,255,255,0.3)',
     highlightBorderColor: 'rgba(0,0,0,0.5)',
     popupTemplate: _.template([
       '<div class="hoverinfo">',
       '<%= geography.properties.name %>',
       '</div>'
      ].join('') )
   },
   fills: {
	   typeone: "#edf8e9",
	   typetwo: "#bae4b3",
	   typethree: "#74c476",
	   typefour: "#31a354",
	   typefive: "#006d2c",
	   defaultFill: '#70db70' 
  },
  data: {
  	"AUS": {
  		fillKey: "typefive"
  	}
  }

});

d3.json("map.json", function(data) {
	console.log(data);
  console.log('hoi')
  
  for (var i = 0; i < data.length; i++) {
    data[i].fillKey = pickType(Number(data[i].percentage));
    console.log(data[i].fillKey);
  }
  console.log(data);
});






function pickType(value) {
	// kies op basis van value kleur
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