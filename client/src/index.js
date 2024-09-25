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

// Holds currently selected cell
var clickedCell = document.getElementsByClassName("outer")[0];
var selectedCells = [];

// Event listener - Listens to added cells and updates realtime
onChildAdded(cellRef, (cellData) => {
	// Data of adopted cell
	let val = cellData.val();
	// Cache the cell
	cachedCells[val["cell"]] = {"name": val["name"], "message": val["message"], "color": val["color"]}
	//Update color of the cell
	document.getElementById(val.cell).style.backgroundColor = val["color"];
	if(clickedCell.id == val.cell) {
		document.getElementById("cell-name").innerHTML = val["name"];
		document.getElementById("cell-message").innerHTML = val["message"];
	}
});

// Tile selector
document.getElementsByClassName("outer")[0].onclick = (event) => {

	//Check cache to see if cells are adopted
	let clickedAdopted;
	let adopted = selectedCells.map((cell) => cell.id in cachedCells);

	// Only clear old selection when not multi select
	if (!event.ctrlKey) {
		// Previously selected cell is set back to normal
		for (let i = 0; i < selectedCells.length; i++) {
			selectedCells[i].style.backgroundColor = adopted[i] ? selectedCells[i].style.backgroundColor : "";
			selectedCells[i].style.transform = 'scale(1)';
		}
		selectedCells = [];
	}

	// Selects a new cell if the target element clicked is a cell
	clickedCell = event.target.className == "cell" ? event.target : clickedCell;

	// Check for if clicked cell is adopted
	clickedAdopted = clickedCell.id in cachedCells;

	// Show cell info when selecting one cell
	if(!event.ctrlKey) {
		
		// Modifies the selected cell to show user it is selected
		clickedCell.style.backgroundColor = clickedAdopted ? clickedCell.style.backgroundColor : "white";
		clickedCell.style.transform = 'scale(1.2)';

		selectedCells.push(clickedCell);

		// Updates text fields with cell info 
		document.getElementById("cell-name").innerHTML = clickedAdopted ? cachedCells[clickedCell.id]["name"] : "";
		document.getElementById("cell-message").innerHTML = clickedAdopted ? cachedCells[clickedCell.id]["message"] : "";
		document.getElementById("cell-id").innerHTML = "Cell #" + clickedCell.id.substring(1);
		
		return;
 	}

	// Multiselect - adopted cells and already selected can't be selected
	if (!adopted.every((cell) => !cell) || clickedAdopted) return;

	// Find if any cell that has been selected is the same as the clicked cell
	let deselected = selectedCells.filter((cell) => cell.id === clickedCell.id);

	if (deselected.length > 0) {
		// Set to normal
		deselected[0].style.backgroundColor = "";
		deselected[0].style.transform = 'scale(1)';
		// Remove from selection
		selectedCells = selectedCells.filter((cell) => cell.id !== clickedCell.id)
	} else {
		// Modifies the selected cell to show user it is selected
		clickedCell.style.backgroundColor = "white";
		clickedCell.style.transform = 'scale(1.2)';
		// Add to selection
		selectedCells.push(clickedCell);
	}
	document.getElementById("cell-id").innerHTML = (selectedCells.length) + " cells selected";
}

// Adoption form
// TODO - Integrate payment stuff 
document.getElementById("adopt-form-submit").onclick = () => {

	let userInput = {};
	// Takes user input and cell id to make JSON object
	for (const input of document.getElementById("adopt-form").querySelectorAll('input')) {
		userInput[input.name] = input.value;
		input.value = "";
	}

	let cellList = selectedCells.map((cell) => Object.assign({"cell": cell.id}, userInput));

	// Post info over to backend to write to database
	const adoptCell = httpsCallable(functions, 'adopt_cell');
	adoptCell(cellList).catch((error) => { alert(error.message) });

};

