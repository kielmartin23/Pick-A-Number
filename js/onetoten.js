//Game Variables
var gamesPlayed = 0;
var randomNumberGenerated = false;
var guessResult = '';
var guessCount = 0;
var randomNumber;
var guessesThisRound = [];
var roundOver = false;
var roundsGuessCount = [];
var roundsNumber = [];
var randomNumberHistory = [0,0,0,0,0,0,0,0,0,0];

//DOM variables for listeners
var elButtonIndicator = document.getElementById('indicator');
var elkeypadContainer = document.getElementById('keypadContainer');
var d = document;
var w = window;


// Event Listeners

//Button Clicks
elButtonIndicator.addEventListener('click', startNextRound, false);

if(elkeypadContainer.addEventListener){
	elkeypadContainer.addEventListener('click', function(e){
		makeGuess(getTargetText(e));
	}, false);
} else {
	elkeypadContainer.attachEvent('onclick', function(e){
		makeGuess(getTargetText(e));
	});
}
//Key Presses
/*if(d.addEventListener){
	 d.addEventListener('keydown', function(e){
		 getKeyPressed(e);
	 }, false);
} else { 
		d = (d.documentElement.clientHeight) ? d.documentElement: d.body;		
		d.attachEvent('onkeydown', function(e){
			getKeyPressed(e);
		});
} 
*/
if(w.addEventListener){
	 w.addEventListener('keydown', function(e){
		 getKeyPressed(e);
	 }, false);
} else { 
		w = (w.innerHeight) ? w.window: w.window;		
		w.attachEvent('onkeydown', function(e){
			getKeyPressed(e);
		});
}

//Event Functions
function getTarget(e){
	if(!e){
		e = window.event;
	}
	return e.target || e.srcElement;
}

function getTargetText(e) {
	var target = getTarget(e);
	var targetText = target.textContent;
	return targetText;
}

function getKeyCode(e){
	e= window.event || e;
	e= e.charCode || e.keyCode;
	return e;
}


function getKeyPressed(e) {
	
	if(getKeyCode(e) === 13){
		startNextRound();
	}
	else{
		
		var keyString = String.fromCharCode(getKeyCode(e));
			
	switch(keyString) {
		case '0':
			makeGuess('10');
			break;
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
			makeGuess(keyString);
			break;
		default:
			break;
		}
	}
}

//Game Functions
function startNextRound() {
	if(roundOver) { 
		gamesPlayed++;
		guessCount = 0;
		guessesThisRound = [];
		randomNumberGenerated = false;
		roundOver = false;
		var buttons = document.getElementsByTagName('button');
	
		for(var i = 0; i < buttons.length; i++) {
			if(buttons[i].id != 'indicator') {
				buttons[i].className = 'gameButton';	
			}
		}
	
		var el2 = document.getElementById('info');
		el2.innerHTML = 'Pick a number from 1 to 10';
	
		var elindicator = document.getElementById('indicator');
		elindicator.innerHTML = '?';
		elindicator.className = 'indicatorButton';
	    
		
		updateKeypadHeader();
	}
}
	
function generateRandomNumber() {
	var randomNum = Math.floor((Math.random() * 10)+ 1);
	randomNumberGenerated = true;
	randomNumber = randomNum;
	randomNumberHistory[randomNumber-1]++;
}

function makeGuess(x){
	
	if(!randomNumberGenerated){
		generateRandomNumber();
		guessCount++;
		guessesThisRound.push(x);
		compareGuess(x);	
	}
	else if(validateGuess(x, guessesThisRound) || roundOver){
	
	}
	else {
		guessCount++;
		guessesThisRound.push(x);
		compareGuess(x);
	}
}



function validateGuess(value, array) {
	return array.indexOf(value) > -1;
}

function recordRound(gcount, randnum) {
	roundsGuessCount[gamesPlayed] = gcount;
	roundsNumber[gamesPlayed] = randnum;
}

function compareGuess(guess){
	if(randomNumber == guess) {
		updateButton(guess, 'correct');
		recordRound(guessCount, randomNumber);
		updateScoreboard();
		updateHistogram(guess);
		updateKeypadHeader();
		roundOver = true;
	}
	else {
		updateButton(guess, 'wrong');
		updateKeypadHeader();
	}
  
}

function updateButton(buttonValue, result) {
	var elid = 'b' + buttonValue;
	var buttonToUpdate = document.getElementById(elid);
	
	if(result == 'correct') {
		buttonToUpdate.className = "gameButtonIsNumber";
		updateIndicator();
	}
	else {
		buttonToUpdate.className = "gameButtonVisited";
	}
}

function updateIndicator() {
	var el = document.getElementById('indicator');
	el.innerHTML = randomNumber;
	el.className = "indicatorButtonWin";
	
	var el2 = document.getElementById('info');
	el2.innerHTML = 'Click on the big ' + randomNumber + ' to play again.';
}

function updateKeypadHeader() {
		var table = document.getElementById('roundStats');	
		
		table.deleteRow(1);
		var row = table.insertRow();
		
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		
		cell1.innerHTML = (gamesPlayed+1);
		cell2.innerHTML = guessCount;
		
}

function updateScoreboard() {
	var scoreboard = document.getElementById('scoreboard');
	
	var newRow = scoreboard.insertRow(gamesPlayed+1);
	
	var cell1 = newRow.insertCell(0);
	var cell2 = newRow.insertCell(1);
	var cell3 = newRow.insertCell(2);
	
	cell1.innerHTML = (gamesPlayed+1);
	cell2.innerHTML = randomNumber;
	cell3.innerHTML = guessCount;
	
	var totalGuesses = 0;
	for(var i=0; i<roundsGuessCount.length; i++) {
		totalGuesses += roundsGuessCount[i];
	}
	
	var avgGuesses = (totalGuesses / (gamesPlayed+1));
	var footer = document.getElementById('avgGuesses');
	footer.innerHTML = avgGuesses.toPrecision(2); 
	
	if(gamesPlayed<1){
		document.getElementById('avgGuessesLabel').innerHTML = 'Avg.';
	}
}

function updateHistogram(randnum) {
	
	var elHistogram = document.getElementById('r'+ randnum);
	
	for(var i = 0; i<10; i++){
		var elPercent = document.getElementById('rp' + (i + 1));
		var percentage = (randomNumberHistory[i]/(gamesPlayed+1)*100);
		try{
		elPercent.innerHTML = percentage.toFixed(0) + '%';
		}
		catch(error){
			alert.error;
		}
	}
	
	
	elHistogram.innerHTML = randomNumberHistory[randnum-1].toString();
	
	
}