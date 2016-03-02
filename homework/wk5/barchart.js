// Ruben Postma
// 11075708

var margin = {left : 45, right : 30, top : 25, bottom : 40}

var width = 1000 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

var y = d3.scale.linear()
	.range([height, 0]);

var x = d3.scale.linear()
	.range(0, width);

var yas = d3.svg.axis()
	.scale(y)
	.orient("left");

var xas = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.ticks(2.5, "C");

var chart = d3.select("body").append("svg")
	.attr("height", height + margin.top + margin.bottom)
	.attr("width", width + margin.left + margin.right)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("knmi.json", function(data) {
	console.log(data);
	y.domain([0, d3.max(data, function(d) { return Number(d[1]); })]);
	x.domain([0, data.length]);
	

	svg.append("g")
		.attr("class", "y as")
		.call(yas)
	  .append("text")
      	.attr("transform", "rotate(-90)")
      	.attr("y", 6)
      	.attr("dy", ".71em")
      	.style("text-anchor", "end")
      	.text("Max temp juli");

	svg.append("g")
		.attr("class", "x as")
		.attr("transform", "translate(" + height + ")")
		.call(xas);

	svg.selectAll(".staaf")
		.data(data)
	  .enter().append("rect")
	  	.attr("class", "staaf")
	  	.attr("x", function(d) { return x(d[0]); })
	  	.attr("width", x.rangeBand)
	  	.attr("y", function(d) { return y(d[1]); })
	  	.attr("height", function(d) { return height - y(d[1]); })


});

/*  dit zou mijn data in json format (ik zet de json file ook op github) moeten laden
	en dit gebeurt ook (ik krrijg geen error cannot find file).
	Echter wordt telkens null gereturnd, dit heeft volgens google
	te maken met domain restrictions, maar de oplossing hiervoor
	ging mij een beetje de pet boven. Ik hoop dat ik dit probleem volgende
	week kan oplossen, zodat ik zonder problemen de opdracht kan maken

*/


