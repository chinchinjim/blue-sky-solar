import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from "firebase/functions";
import { getDatabase, ref, onChildAdded } from 'firebase/database';

//Coloris.init();
//Coloris({el: "#coloris",
//	alpha: false});

const firebaseConfig = {
  apiKey: "AIzaSyAegBd_qulAcOvbIbjOeQtyzQw5dygKEX4",
  authDomain: "solartest-7875a.firebaseapp.com",
  databaseURL: "https://solartest-7875a-default-rtdb.firebaseio.com",
  projectId: "solartest-7875a",
  storageBucket: "solartest-7875a.appspot.com",
  messagingSenderId: "510830787909",
  appId: "1:510830787909:web:05406f7adb94f069ded22c"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const database = getDatabase();

const cellRef = ref(database, "/cells");

onChildAdded(cellRef, (cellData) => {
	const d = cellData.val();
	document.getElementById(d.cell).style.backgroundColor = d.color;
	console.log(d.cell + ", " + d.color);
});

var clickedTile = document.getElementById("p1");

document.getElementsByClassName("outer")[0].onclick = (event) => {
	//clickedTile = document.getElementById("p1");
	//console.log(clickedTile);
	clickedTile.style.backgroundColor = null;
	clickedTile.style.transform = 'scale(1)';

	clickedTile = event.target.className == "cell" ? event.target : clickedTile;
	
	clickedTile.style.backgroundColor = "white";
	clickedTile.style.transform = 'scale(1.2)';
	document.getElementById("cell-name").innerHTML = "Cell #" + clickedTile.id.substring(1);
};

document.getElementById("adopt-form-submit").onclick = async () => {
	var cellData = {"cell": clickedTile.id};
	for (const input of document.getElementById("adopt-form").querySelectorAll('input')) {
		cellData[input.name] = input.value;
		input.value = "";
	}
	const adoptCell = httpsCallable(functions, 'adopt_cell');
	adoptCell(cellData);
};

/*
function lightenTile(style) {
	var color = style.getPropertyValue("background-color")
	color = color.replace(/[a-z()]/g, '')
	color = color.split(", ")
	
	return "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", 70%)"
}
*/