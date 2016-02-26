// Ruben Postma 
// 11075708
// met laden van pagina
window.onload = function() {
	// kleur landen met changeColor
 	changeColor("pl", "#00ff50");
 	changeColor("no", "#1e7f91");
 	changeColor("ro", "#ffa500");
 	changeColor("nl", "ff00e7")
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {
	// haal path dmv id en zet die naar kleur
     document.getElementById(id).style.fill = color;

}
