var clickedTile = document.getElementById("p1");

function tileClicked(event) {
	//clickedTile = document.getElementById("p1");
	console.log(clickedTile);
	clickedTile.style.backgroundColor = null;
	clickedTile.style.transform = 'scale(1)';

	clickedTile = event.target.className == "cell" ? event.target : clickedTile;
	
	clickedTile.style.backgroundColor = "white";
	clickedTile.style.transform = 'scale(1.2)';
	document.getElementById("cell-name").innerHTML = "Cell #" + clickedTile.id.substring(1);
}
/*
function lightenTile(style) {
	var color = style.getPropertyValue("background-color")
	color = color.replace(/[a-z()]/g, '')
	color = color.split(", ")
	
	return "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", 70%)"
}
*/