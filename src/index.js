import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from "firebase/functions";
import { getDatabase, ref, get, onChildAdded } from 'firebase/database';

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

// Database reference
const cellRef = ref(database, "/cells");

var cachedCells = {};

// Event listener - Listens to added cells and updates realtime
// TODO: 1. Remove cache, implement uses of cache with firebase's once() function
onChildAdded(cellRef, (cellData) => {
	// Data of adopted cell
	let val = cellData.val();
	// Cache the cell (Should be removed and use firebase once() or get())
	cachedCells[val["cell"]] = {"name": val["name"], "message": val["message"], "color": val["color"]}
	//Update color of the cell
	document.getElementById(val.cell).style.backgroundColor = val.color;
});

// Holds currently selected tile
var clickedTile = document.getElementById("p1");

// Tile selector
// TODO: 1. Unadopted cells need a default color and a selected color
// 	 2. Check database for if the cell is adopted instead of checking if there is a color
document.getElementsByClassName("outer")[0].onclick = (event) => {

	// Previously selected tile is set back to normal
	clickedTile.style.backgroundColor = clickedTile.style.backgroundColor == "white" ? "" : clickedTile.style.backgroundColor;
	clickedTile.style.transform = 'scale(1)';

	// Selects a new tile if the target element clicked is a tile
	clickedTile = event.target.className == "cell" ? event.target : clickedTile;
	
	// Modifies the selected cell to show user it is selected
	clickedTile.style.backgroundColor = clickedTile.style.backgroundColor == "" ? "white": clickedTile.style.backgroundColor;
	clickedTile.style.transform = 'scale(1.2)';

	// Updates text fields with cell information 
	document.getElementById("cell-id").innerHTML = "Cell #" + clickedTile.id.substring(1);
	if(clickedTile.id in cachedCells) {
		document.getElementById("cell-name").innerHTML = cachedCells[clickedTile.id]["name"];
		document.getElementById("cell-message").innerHTML = cachedCells[clickedTile.id]["message"];
	} else {
		document.getElementById("cell-name").innerHTML = "";
		document.getElementById("cell-message").innerHTML = "";
	}
}

// Adoption form
// TODO: 1. Prevent adoption of adopted cells
// 	 2. Integrate payment stuff
document.getElementById("adopt-form-submit").onclick = async () => {
	
	// Takes user input and cell id to make JSON object
	var cellData = {"cell": clickedTile.id};
	for (const input of document.getElementById("adopt-form").querySelectorAll('input')) {
		cellData[input.name] = input.value;
		input.value = "";
	}
	//once()
	
	// Calls backend to store the JSON object in the database
	const adoptCell = httpsCallable(functions, 'adopt_cell');
	adoptCell(cellData);
};

