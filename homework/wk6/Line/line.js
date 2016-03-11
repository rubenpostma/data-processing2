// Ruben Postma
// 11075708

// zet de marges rondom de grafiek
var margin = {left : 45, right : 120, top : 25, bottom : 40}

// zet hoogte en breedte van svg
var width = 1000 - margin.left - margin.right;
var height = 350 - margin.top - margin.bottom;

// maak svg in body 
var svg = d3.select("body").append("svg")
	// zet id="chart"
	.attr("id", "chart")
	// bepaal hoogte en breedte met variabelen
	.attr("height", height + margin.top + margin.bottom)
	.attr("width", width + margin.left + margin.right)
  // maak g in svg
  .append("g")
    // verplaats naar de marges waar de assen komen
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");	

// maak grafiek uit data
// voorbeeld gebruikt uit http://bl.ocks.org/mikehadlow/93b471e569e31af07cd3
d3.json("tempjuni2015.json", function(data) {
	
	// zet de domeinen van data 
  var xdomain = d3.extent(data, function(d) { return reformat(d.date) });
  var	ydomain = [0, d3.max(data, function(d) { return (Number(d.gmld) / 10) + 2;})];

	//  bepaal schaal, range en domain van y
	var yscale = d3.scale.linear()
		.range([height, 0])
		.domain(ydomain);

	// bepaal schaal range en domein van x
  var xscale = d3.time.scale()
	    .range([0, width])
	    .domain(xdomain);
	
	// zet y as links
	var yas = d3.svg.axis()
		.scale(yscale)
		.orient("left")
	// zet xas beneden	en maak ticks elke twee dagen
	var xas = d3.svg.axis()
		.scale(xscale)
		.ticks(d3.time.day, 2)
		.orient("bottom");

	// bepaal x en y doordinaten van lijn
  var line = d3.svg.line()
	    .x(function(d) { return xscale(reformat(d.date)); })
	    .y(function(d) { return yscale(Number(d.gmld) / 10); });

  
  // zet y as in svg
  svg.append("g")
		.attr("class", "y as")
		.call(yas)
	  .append("text")
	  	// zet tekst op juiste plek
      	.attr("transform", "rotate(-90)")
      	.attr("y", 6)
      	.attr("dy", ".50em")
      	.style("text-anchor", "end")
      	// maak tekst "Celcius"
      	.text("Celsius");

  // zet x as in svg
  svg.append("g")
		.attr("class", "x as")
		.attr("transform", "translate(0," + height + ")")
		.call(xas);

	// zet lijn in svg
  svg.append("path")
      .datum(data)
      .attr("class", "gmld")
      // haal coordinaten van line
      .attr("d", line);

  // maak selec in svg om data te selecteren
  var selec = svg.append("g").style("display", "none")

    // maak horizontale lijn om data van y as te selecteren
    selec.append('line')
    	.attr("id", "xselec")
    	.attr("class", "selec")
    // maak verticale lijn om data van y as te selecteren
    selec.append("line")
    	.attr("id", "yselec")
    	.attr("class", "selec")
    
    // voeg tekst langs horizontale lijn
    selec.append("text")
    	.attr("id", "xtext")
    	.style("font-family", "Verdana")
    	.style("font-weight", "bold")
	  // voeg tekst labgs verticale lijn
    selec.append("text")
    	.attr("id", "ytext")
    	.attr("transform", "rotate(-90)")
    	.style("font-family", "Verdana")
    	.style("font-weight", "bold")

  // maak bisector om dichtsbizijnde datapunt op xas aan te wijzen 
 	var bisectDate = d3.bisector(function(d) { return reformat(d.date); }).left;

 	// zet overlay over grafiek
  svg.append('rect')
 		.attr("class", "overlay")
 		.attr('width', width)
    .attr('height', height)	
		// laat elementen van layover zien als muis over grafiek heengaat
    .on('mouseover', function() { selec.style('display', null); })
    // en verberg elementen zoniet
    .on('mouseout', function() { selec.style('display', 'none'); })
		// bij muisbeweging
    .on('mousemove', function() { 
            // haal coordinaten van muis in overlay
            var mouse = d3.mouse(this);
            // zet xcoordinaten van muis om in xdata van json file
            var mouseDate = xscale.invert(mouse[0]);
            // haalt index van x data
            var i = bisectDate(data, mouseDate); 
            // bepaal index naast huidige index
            var d0 = data[i - 1]
            var d1 = data[i];
            // bepaal welke data dichter bij de muis is
            var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;

            // bepaal coordinate van selec lijnen
            var x = xscale(reformat(d.date));
            var y = yscale(Number(d.gmld) / 10);
           
            // geef selec lijnen juiste coordinaten
            selec.select('#xselec')
                .attr('x1', x).attr('y1', yscale(ydomain[0]))
                .attr('x2', x).attr('y2', yscale(ydomain[1]))
            selec.select('#yselec')
                .attr('x1', xscale(xdomain[0])).attr('y1', y)
                .attr('x2', xscale(xdomain[1])).attr('y2', y)
            
            // en de juiste tekst langs de lijne
            selec.select('#xtext')
            	.text(Number(d.gmld) /10 + " Graden")
            	.attr('x', x + 30)
            	.attr('y', y)
            selec.select('#ytext')
            	.text(setdate(d.date))
            	.attr('x', -260)
            	.attr('y', x + 11)
            	

        });

});

// functie om datum van knmi in milliseconden om te zetten
function reformat (d) {
	
 	d = d3.time.format('%Y%m%d').parse(d);
 	d = new Date(d);
 	return d.getTime();
};

// functie om datum van knmi in dag maand jaar format te zetten
function setdate(d){
	return d3.time.format('%d %b %Y')(d3.time.format('%Y%m%d').parse(d));
};

