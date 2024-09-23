import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from "firebase/functions";
import { getDatabase, ref, onChildAdded } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCKhoQUDrOtTKLqBG_M0djp8PaD-PIWR3A",
  authDomain: "blueskysolar-bb44f.firebaseapp.com",
  projectId: "blueskysolar-bb44f",
  storageBucket: "blueskysolar-bb44f.appspot.com",
  messagingSenderId: "686381594188",
  appId: "1:686381594188:web:2be6c76dc1bb300175e6e9"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const database = getDatabase();

// Database reference
const cellRef = ref(database, "/cells");

var cachedCells = {};

// Holds currently selected tile
var clickedTile = document.getElementsByClassName("outer")[0];

// Event listener - Listens to added cells and updates realtime
onChildAdded(cellRef, (cellData) => {
	// Data of adopted cell
	let val = cellData.val();
	// Cache the cell
	cachedCells[val["cell"]] = {"name": val["name"], "message": val["message"], "color": val["color"]}
	//Update color of the cell
	document.getElementById(val.cell).style.backgroundColor = val["color"];
	if(clickedTile.id == val.cell) {
		document.getElementById("cell-name").innerHTML = val["name"];
		document.getElementById("cell-message").innerHTML = val["message"];
	}
});

// Tile selector
document.getElementsByClassName("outer")[0].onclick = (event) => {

	//Check cache to see if cell is adopted
	let adopted = clickedTile.id in cachedCells;

	// Previously selected tile is set back to normal
	clickedTile.style.backgroundColor = adopted? clickedTile.style.backgroundColor : "";
	clickedTile.style.transform = 'scale(1)';

	// Selects a new tile if the target element clicked is a tile
	clickedTile = event.target.className == "cell" ? event.target : clickedTile;

	adopted = clickedTile.id in cachedCells;
	
	// Modifies the selected cell to show user it is selected
	clickedTile.style.backgroundColor = adopted? clickedTile.style.backgroundColor : "white";
	clickedTile.style.transform = 'scale(1.2)';

	// Updates text fields with cell information 
	document.getElementById("cell-id").innerHTML = "Cell #" + clickedTile.id.substring(1);
	
	if(adopted) {
		document.getElementById("cell-name").innerHTML = cachedCells[clickedTile.id]["name"];
		document.getElementById("cell-message").innerHTML = cachedCells[clickedTile.id]["message"];
	} else {
		document.getElementById("cell-name").innerHTML = "";
		document.getElementById("cell-message").innerHTML = "";
	}
}

// Adoption form
// TODO - Integrate payment stuff 
document.getElementById("adopt-form-submit").onclick = () => {
	// Takes user input and cell id to make JSON object
	var cellData = {"cell": clickedTile.id};
	for (const input of document.getElementById("adopt-form").querySelectorAll('input')) {
		cellData[input.name] = input.value;
		input.value = "";
	}

	// Post info over to backend to write to database
	const adoptCell = httpsCallable(functions, 'adopt_cell');
	adoptCell(cellData).catch((error) => { alert(error.message) });

};

