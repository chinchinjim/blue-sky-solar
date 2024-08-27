import { initializeApp } from 'firebase/app';
//import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAegBd_qulAcOvbIbjOeQtyzQw5dygKEX4",
  authDomain: "solartest-7875a.firebaseapp.com",
  databaseURL: "https://solartest-7875a-default-rtdb.firebaseio.com",
  projectId: "solartest-7875a",
  storageBucket: "solartest-7875a.appspot.com",
  messagingSenderId: "510830787909",
  appId: "1:510830787909:web:05406f7adb94f069ded22c"
};

initializeApp(firebaseConfig);

//const database = getDatabase();

var clickedTile = document.getElementById("p1");

Coloris({
  alpha: false
});


function tileClicked(event) {
	//clickedTile = document.getElementById("p1");
	//console.log(clickedTile);
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