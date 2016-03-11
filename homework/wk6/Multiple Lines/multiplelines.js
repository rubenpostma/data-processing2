// Ruben Postma
// 11075708


// zet de marges rondom de grafiek
var margin = {left : 90, right : 120, top : 25, bottom : 40}

// zet hoogte en breedte van svg
var width = 1200 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

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

// laat bij laden site eerst 2013 zien
showData("temp2013.json")

// functie om data te laten zien
function showData(dataset){
  // maak eerst svg leeg om nieuwe data te tonen
  svg.selectAll("*").remove();

  // maak grafiek uit data
  // voorbeeld gebruikt uit http://bl.ocks.org/mikehadlow/93b471e569e31af07cd3
  d3.json(dataset, function(data) {


      // zet de domeinen van data 
    var xdomain = d3.extent(data, function(d) { return reformat(d.date); });
    var ydomain = [d3.min(data, function(d) { return (Number(d.min) / 10) - 2;}), d3.max(data, function(d) { return (Number(d.max) / 10) + 2;})];

    
    //  bepaal schaal, range en domain van y
    var yscale = d3.scale.linear()
      .range([height, 0])
      .domain(ydomain);

    // bepaal schaal range en domein van x
    var xscale = d3.time.scale()
        .range([0, width])
        .domain(xdomain) ;
        
    
    // zet y as links
    var yas = d3.svg.axis()
      .scale(yscale)
      .orient("left");
    // zet xas beneden  en maak ticks elke twee dagen
    var xas = d3.svg.axis()
      .scale(xscale)
      .ticks(d3.time.month, 1)
      .orient("bottom");

    // bepaal coordinaten van gemiddelde, maximale en minimale lijnen
    var gmldline = d3.svg.line()
        .x(function(d) { return xscale(reformat(d.date)); })
        .y(function(d) { return yscale(Number(d.gmld) / 10); })
    var minline = d3.svg.line()
        .x(function(d) { return xscale(reformat(d.date)); })
        .y(function(d) { return yscale(Number(d.min) / 10); });
    var maxline = d3.svg.line()
        .x(function(d) { return xscale(reformat(d.date)); })
        .y(function(d) { return yscale(Number(d.max) / 10); });
       
      // zet jaar in svg
      svg.append("text")
        .attr("id", "jaar")
        .text( d3.time.format('%Y')(d3.time.format('%Y%m%d').parse(data[0].date)))
        .attr("x", 30)
        .attr("y", 100)
        .style("font-size", 60)
        .style("fill", "#dddddd")

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
        .call(xas)
        

      // zet gemiddelde, max en min lijn in svh
      svg.append("path")
        .datum(data)
        .attr("class", "gmld")
        .attr("d", gmldline);

      svg.append("path")
        .datum(data)
        .attr("class", "min")
        .attr("d", minline);

    svg.append("path")
        .datum(data)
        .attr("class", "max")
        .attr("d", maxline);

    // maak selec in svg om data te selecteren
    var selec = svg.append("g").style("display", "none")

      // maak horizontale lijn om data van y as te selecteren
      selec.append('line')
        .attr("id", "xselec")
        .attr("class", "selec")
      
      // maak verticale lijnen om data van y as te selecteren
      selec.append("line")
        .attr("id", "yMinselec")
        .attr("class", "selec")
        .style("display", "none")
      selec.append("line")
        .attr("id", "yGmldselec")
        .attr("class", "selec")
        .style("display", "none")
      selec.append("line")
        .attr("id", "yMaxselec")
        .attr("class", "selec")
        .style("display", "none")

      // voeg tekst langs horizontale lijn
      selec.append("text")
        .attr("id", "gmldtext")
        .style("font-weight", "bold")
        .style("fill", "green")
      selec.append("text")
        .attr("id", "mintext")
        .style("font-weight", "bold")
        .style("fill", "blue")
      selec.append("text")
        .attr("id", "maxtext")
        .style("font-weight", "bold")
        .style("fill", "red")
      // voeg tekst labgs verticale lijn
      selec.append("text")
        .attr("id", "ytext")
        

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

              // bepaal data naast huidige index
              var d0 = data[i - 1]
              var d1 = data[i];
              
              // bepaal welke data dichter bij de muis is
              var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;

              // bepaal coordinate van selec lijnen
              var x = xscale(reformat(d.date));
              var ygmld = yscale(Number(d.gmld) / 10);
              var ymax = yscale(Number(d.max) / 10);
              var ymin = yscale(Number(d.min) / 10);
             
              // geef selec lijnen juiste coordinaten
              selec.select('#xselec')
                  .attr('x1', x).attr('y1', yscale(ydomain[0]))
                  .attr('x2', x).attr('y2', yscale(ydomain[1]))
              selec.select('#yGmldselec')
                  .attr('x1', xscale(xdomain[0])).attr('y1', ygmld)
                  .attr('x2', xscale(xdomain[1])).attr('y2', ygmld)
              selec.select('#yMinselec')
                  .attr('x1', xscale(xdomain[0])).attr('y1', ymin)
                  .attr('x2', xscale(xdomain[1])).attr('y2', ymin)
              selec.select('#yMaxselec')
                  .attr('x1', xscale(xdomain[0])).attr('y1', ymax)
                  .attr('x2', xscale(xdomain[1])).attr('y2', ymax)
              
              
              // tekst langs lijnen
              selec.select('#gmldtext')
                .text("Gmld:" + Number(d.gmld) /10 + " Graden")
                .attr('x', x)
                .attr('y', ygmld)
              selec.select('#mintext')
                .text("Min:" + Number(d.min) /10 + " Graden")
                .attr('x', x )
                .attr('y', ymin)
              selec.select('#maxtext')
                .text("Max:" + Number(d.max) /10 + " Graden")
                .attr('x', x)
                .attr('y', ymax)
              selec.select('#ytext')
                .text(setdate(d.date))
                .attr('x', x - 80)
                .attr('y', 20)
                .attr('font', "bold")
                  
  			

          });

  });
};

// zet knmi data om in milliseconden
function reformat (d) {
 	d = d3.time.format('%Y%m%d').parse(d);
 	d = new Date(d);
 	return d.getTime();
};
// zet knmi data naar dag maand jaar format
function setdate(d){
  return d3.time.format('%d %b %Y')(d3.time.format('%Y%m%d').parse(d));
};

