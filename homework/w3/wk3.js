// Ruben Postma (11075708)
// wk3

// haal inhoud out rawadata id tag en stop in lijst
var lijst= document.getElementById("rawdata").innerHTML;
// maak array van elke lijn in lijst
lijst = lijst.split("\n");
// maak arrays voor dagen en temperatuur
var dagen = [];
var temperaturen =[]
// ga elke lijn af 
for (var j = 0; j < lijst.length - 1; j++) {
  // maak van onderdeel lijst string
  p = String(lijst[j]);
  // dag is gedeelte voo komma
  var dag = p.split(",")[0];
  // maak van dag srting YYYY-MM-DD
  dag = [dag.slice(6, 10), dag.slice(10,12), dag.slice(12)].join('-');
  // maak van dag string een datum 
  dag = new Date(dag);
  // zet date om in milliseconden
  dag = dag.getTime()
  // tempertuur is gedeelte achter komma
  var temperatuur = p.split(",")[1];
  // maak van temperatuur nummer
  temperatuur = Number(temperatuur/10.0);
  // voeg 
  dagen.push(dag);
  temperaturen.push(temperatuur);
}   


function naardag() {
  // berekenmilliseconden tot 1-1-2015
  var milsec = dagen[0]
  // bij elke dag in dagen array..
  for (var i = 0; i < dagen.length; i++) {
    // ..milliseconden van 2015..
    dagen[i] -= milsec;
    // .. een deel door milliseconden per dag om hoeveelste dag te berkenen
    dagen[i] = dagen[i] / 86400000;
  }
  // return nieuwe dagen array
  return dagen
};
naardag();

function getMaxY() {
  // zet max op 0 
  var ymax = 0;
  // ga elke temperatuur in array af
  for (var j = 0; j < temperaturen.length; j++) {
    // als temperatuur is dan max..
    if (temperaturen[j] > ymax) {
      // ..maak die temperatuur als max
      ymax = temperaturen[j];
    }
  }
    return ymax;  
};

function getMinY() { 
  // zet min op 0
  var ymin = 0;
  // ga elke temperatuur in array af
  for (var j = 0; j < temperaturen.length; j++) {
    // als tempertuur kleiner is dan min..
    if (temperaturen[j] < ymin) {
      // ..maak die temperatuut min
      ymin = temperaturen[j];
    }
  }
  return ymin;  
};

function createTransform(domain, range){
  // alpha is rangemax-rangemin/domainmax-domainmin  
  var alpha = (range[1] - range[0]) / (domain[1] - domain[0]);
  // beta is verschil tussen range en domain maal alpha
  var beta = range[1] - domain[1] * alpha;
  
  // return y waarde van lineaire vergelijking
  return function(x){
    return alpha * x + beta;
  };
};

function draw(){
  // haal canvas op uit id tag
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  // bepaal padding om grafiek op te tekenen
  var xPadding = 30;
  var yPadding = 30;

  // bepaal kleur en dikte lijnen
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'black';
  // bepaal lettertype, en locatie tekst
  ctx.font = 'italic 16pt sans-serif';
  ctx.textAlign = "left";
  ctx.fillText("Gemiddlde Temperatuur, De Bilt (2015)", xPadding + 20, yPadding + 20)

  // teken x en y as
  ctx.beginPath();
  ctx.moveTo(xPadding, 0);
  ctx.lineTo(xPadding, canvas.height - (yPadding));
  ctx.lineTo(canvas.width, canvas.height - (yPadding));
  ctx.stroke();

  // initieer de range en domain van x en y as
  var rangex = [xPadding + 20, canvas.width];
  var rangey = [canvas.height - (yPadding + 20), 20];
  var domainx = [0, dagen.length];
  var domainy = [getMinY(), getMaxY()];
  // maak transformfunctie voor x en y as
  var transx = createTransform(domainx, rangex);
  var transy = createTransform(domainy, rangey);

  // maak array voor coorinaten canvas
  coordx = [];
  coordy = [];
  // ga alle data af
  for (var i = 0; i < dagen.length; i++){
    // zet locatie x en y as grafiek om in coordinaten canvas
    coordx[i] = transx(dagen[i]);
    coordy[i] = transy(temperaturen[i]);
  }

  // maak kleur grafiek
  ctx.strokeStyle = "blue";
  // begin path
  ctx.beginPath();
  // zet op eerste cooridinaten canvas
  ctx.moveTo(coordx[0], coordy[0]);
  // teken lijnen naar de volgende coordinaten
  for (var i = 1; i < coordx.length; i++){
    ctx.lineTo(coordx[i], coordy[i]);
    ctx.stroke();
  }

  // bepaal letter type en alignemetn assen
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.font = 'italic 8pt sans-serif';

  // ga elke  halve graad tot max af op y as
  for (var i = -3; i < getMaxY(); i += 0.5){
    // wanneer halve graad deelbaar is door 2.5
    if (i % 2.5 == 0) {
      // bepaal y coordinaat
      y = transy(i);
      // en plaats tekst langs ass
      ctx.fillText(i, xPadding - 10, y);
     }
  }

  // ga elke dag af
  for (var i = 0; i < dagen.length; i++) {
    // zet y coordinaat langs x as 
    y = canvas.height - yPadding + 10;
    // obv hoeveelste dag
    if (i == 0) {
      // bepaal x coordinaat
      x = transx(i);
      // en welke maand het is 
      ctx.fillText("jan", x, y);
     }
     // doe dit bij alle maanden werkt niet op schrikkeljaren
     else if (i == 31) {
      x = transx(i);
      ctx.fillText("feb", x, y);
     }
     else if (i == 59) {
      x = transx(i);
      ctx.fillText("mar", x, y);
     }
     else if (i == 90) {
      x = transx(i);
      ctx.fillText("apr", x, y);
     }
     else if (i == 120) {
      x = transx(i);
      ctx.fillText("mei", x, y);
     }
     else if (i == 151) {
      x = transx(i);
      ctx.fillText("juni", x, y);
     }
     else if (i == 182) {
      x = transx(i);
      ctx.fillText("juli", x, y);
     }
     else if (i == 212) {
      x = transx(i);
      ctx.fillText("aug", x, y);
     }
     else if (i == 243) {
      x = transx(i);
      ctx.fillText("sep", x, y);
     }
     else if (i == 273) {
      x = transx(i);
      ctx.fillText("okt", x, y);
     }
     else if (i == 304) {
      x = transx(i);
      ctx.fillText("nov", x, y);
     }
     else if (i == 335) {
      x = transx(i);
      ctx.fillText("dec", x, y);
     }
  }
}
draw()