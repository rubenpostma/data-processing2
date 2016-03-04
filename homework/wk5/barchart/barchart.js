// Ruben Postma
// 11075708

// zet de marges rondom de grafiek
var margin = {left : 45, right : 30, top : 25, bottom : 40}

// zet hoogte en breedte van svg
var width = 1000 - margin.left - margin.right;
var height = 350 - margin.top - margin.bottom;

// maak y as linear
var y = d3.scale.linear()
	.range([height, 0]);
// maak x as oridinaal en bepaal ruimte tussen staven
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);
// zet y as links
var yas = d3.svg.axis()
	.scale(y)
	.orient("left")
// zet xas beneden	
var xas = d3.svg.axis()
	.scale(x)
	.orient("bottom");
// maak label die data values toont
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>" + d.date.slice(-2) + " juli: </strong> <span style='color:red'>" + Number(d.temp) / 10 + " Graden</span>";
  })
	
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

// roep label op in svg
svg.call(tip);

// haal data uit json file
d3.json("knmi.json", function(data) {
	// bepaal domein op x en y as
	y.domain([0, d3.max(data, function(d) { return Number(d.temp / 10) + 2; })]);
	x.domain(data.map(function(d) { return d.date.slice(-2); }));
	
	// maak y as in svg
	svg.append("g")
		.attr("class", "y as")
		.call(yas)
	  // voeg tekst aan yas
	  .append("text")
	  	// zet tekst op juiste plek
      	.attr("transform", "rotate(-90)")
      	.attr("y", 6)
      	.attr("dy", ".40em")
      	.style("text-anchor", "end")
      	// maak tekst "Celcius"
      	.text("Celsius");

	// maak x as in svg 
	svg.append("g")
		.attr("class", "x as")
		// verplaats op juiste hoogte
		.attr("transform", "translate(0," + height + ")")
		.call(xas);

	// maak bar class voor elke data
	svg.selectAll(".bar")
		.data(data)
	  // bar class zijn rectangles
	  .enter().append("rect")
	  	// voeg bar toe aan svg
	  	.attr("class", "bar")
	  	.attr("x", function(d) { return x(d.date.slice(-2)); })
	  	// bepaal breedte bar
	  	.attr("width", x.rangeBand)
	  	.attr("y", function(d) { return y(Number(d.temp / 10)); })
	  	// bepaal hoogte bar
	  	.attr("height", function(d) { return height - y(Number(d.temp / 10)); })
	  	// laat label zien als muis op bar is
	  	.on('mouseover', tip.show)
	  	// verberg label als muis van bar gaat
      	.on('mouseout', tip.hide)


});

