let currencyDiv;
let keys;
let currency1;
let currency2;
let requestUrl;
let valueUrl;
let amount;
let dateDiv;
let date2Div;
let outputDiv;
let symbol;
let names = ["" , "" , "" , ""];
let question = [ 
		{
			"question": "1",
			"a": "1",
			"b": "1",
			"c": "1",
			"d": "1",
			"answer": "1"
		}
	];;
let answerOptions = ["a", "b", "c", "d"];
let answer;
let marked;
let highest;
let highestSymbol;
let highestDiv;
let lowest;
let lowestSymbol;
let lowestDiv;
let compareDate;
let randomQuizType;
let quizLowestValue;
let quizHighestValue;

window.onload = function(){
	currency1 = document.getElementById("currency1");
	currency2 = document.getElementById("currency2");
	outputDiv = document.getElementById("output");
	dateDiv = document.getElementById("date");
	date2Div = document.getElementById("date2");
	highestDiv = document.getElementById("highest");
	lowestDiv = document.getElementById("lowest");
	
	document.getElementById("getRateBtn").onclick = function () {
		getRate();
	};
	
	fetch("https://api.exchangerate.host/symbols")
		.then(resp => resp.json())
		.then(data => displayCurrencies(data));
	
	document.getElementById("CreateQuizBtn").onclick = function () {
		
		fetchQuiz();
		
	};
	
	document.getElementById("getHALBtn").onclick = function () {
		
		fetchValue();
		
	};
	
}

function fetchQuiz() {
	
	marked = false;
	document.getElementById("checkanswer").innerHTML = "";
	
	randomQuizType = Math.floor(Math.random() * 3 + 1);
	console.log(randomQuizType);
	
	switch (randomQuizType) {
		
		case 1:
			fetch("https://api.exchangerate.host/symbols")
				.then(resp => resp.json())
				.then(data => quizSymbols(data));
			break;
			
		case 2:
			fetch("https://api.exchangerate.host/latest?base=USD")
				.then(resp => resp.json())
				.then(data => quizLowestOrHighest(data, 1));
			break;
			
		default :
			fetch("https://api.exchangerate.host/latest?base=USD")
				.then(resp => resp.json())
				.then(data => quizLowestOrHighest(data, 0));
	}
	
}

function fetchValue() {
	
	console.log(date2Div.value);
	
	if (date2Div.value.length == 0) {
		valueUrl = "https://api.exchangerate.host/latest?base=USD";
	}
	
	else {
		valueUrl = "https://api.exchangerate.host/" + date2Div.value + "?base=USD";
	}
	fetch(valueUrl)
		.then(resp => resp.json())
		.then(data => compareCurrency(data));
	
}

function displayCurrencies(data){
	keys = Object.keys(data.symbols);

	for(let i of keys){
		currency1.innerHTML += "<option value=" + i + ">" + data.symbols[i].description + "</option>";
		currency2.innerHTML += "<option value=" + i + ">" + data.symbols[i].description + "</option>";
		console.log(data.symbols[i]);
	}
	
	console.log(data);
	console.log(currency1.value);
}

function getRate(){
	try {
		if (document.getElementById("amount").value != null) {
		amount = "&amount=" + Number(document.getElementById("amount").value);
		console.log(amount);
		}
		
		else {
			amount = "&amount=1";
		}
	}
	
	catch {
		amount = "&amount=1";
	}
	
	if (amount == "&amount=NaN") {
		amount = "&amount=1";
	}
	
	console.log(dateDiv.value);
	console.log(currency1.value);
	console.log(currency2.value);
	
	requestUrl = "https://api.exchangerate.host/convert?from=" + currency1.value + "&to=" + currency2.value + amount + "&date=" + dateDiv.value;
	
	try {
		fetch(requestUrl)
			.then(resp => resp.json())
			.then(data => showValue(data))
	}
	
	catch {}
}

// match name to symbol
// when was x currency most valuable
// what's the least valuable currency compared to a random currency

function showValue(data) {
	
	try {
		console.log(data);
		if (data.result != null) {
			outputDiv.innerHTML = data.query.amount + " " + data.query.from + " Equals " + data.result + " " + data.query.to + " at " + data.date;
		}
	
		else outputDiv.innerHTML = data.query.amount + " " + data.query.from + " Equals 0 " + data.query.to + " at " + data.date;
	}
	
	catch {
		outputDiv.innerHTML = "Error! Please don't select the date after today or the date too date before 02/01/1999";
	}
	
}

function quizSymbols(data){
	symbol = Math.floor(Math.random() * (keys.length - 1));
	console.log(symbol);
	answer = answerOptions[Math.floor(Math.random() * (answerOptions.length - 1))];
	console.log(answer);
	question[0].a = data.symbols[keys[Math.floor(Math.random() * (keys.length - 1))]].description;
	question[0].b = data.symbols[keys[Math.floor(Math.random() * (keys.length - 1))]].description;
	question[0].c = data.symbols[keys[Math.floor(Math.random() * (keys.length - 1))]].description;
	question[0].d = data.symbols[keys[Math.floor(Math.random() * (keys.length - 1))]].description;
	
	
	question[0][answer] = data.symbols[keys[symbol]].description;
	question[0].answer = answer;
	question[0].question = "Match the name to the symbol: " + keys[symbol];
	
	while (question[0].answer != "a" && question[0].a.description == question[0][answer]) {
		question[0].a = data.symbols[keys[Math.floor(Math.random() * (keys.length - 1))]].description;
	}
	
	while (question[0].answer != "b" && question[0].b.description == question[0][answer]) {
		question[0].b = data.symbols[keys[Math.floor(Math.random() * (keys.length - 1))]].description;
	}
	while (question[0].answer != "c" && question[0].c.description == question[0][answer]) {
		question[0].c = data.symbols[keys[Math.floor(Math.random() * (keys.length - 1))]].description;
	}
	
	while (question[0].answer != "d" && question[0].d.description == question[0][answer]) {
		question[0].d = data.symbols[keys[Math.floor(Math.random() * (keys.length - 1))]].description;
	}
	
	console.log(question);
	console.log(data.symbols[keys[symbol]]);
	
	document.getElementById("question").innerHTML = question[0].question;
	document.getElementById("a").innerHTML = "A." + question[0].a;
	document.getElementById("b").innerHTML = "B." + question[0].b;
	document.getElementById("c").innerHTML = "C." + question[0].c;
	document.getElementById("d").innerHTML = "D." + question[0].d;
	
	document.getElementById("a").onclick = function () {
		markIt("a");
	};
	
	document.getElementById("b").onclick = function () {
		markIt("b");
	};
	
	document.getElementById("c").onclick = function () {
		markIt("c");
	};
	
	document.getElementById("d").onclick = function () {
		markIt("d");
	};
	
}

function quizLowestOrHighest(data, type) {
	
	if (type == 1) {
		quizLowestValue = 0;
		question[0].question = "Find least valuable currency in these 4 options: ";
	}
	
	else {
		quizHighestValue = 1000000000;
		question[0].question = "Find most valuable currency in these 4 options: ";
	}
	question[0].a = keys[Math.floor(Math.random() * (keys.length - 1))];
	question[0].b = keys[Math.floor(Math.random() * (keys.length - 1))];
	question[0].c = keys[Math.floor(Math.random() * (keys.length - 1))];
	question[0].d = keys[Math.floor(Math.random() * (keys.length - 1))];
	
	for (let i = 0 ; i < answerOptions.length ; i++) {

		console.log(answerOptions[i]);
		if (type == 1) {
			if (data.rates[question[0][answerOptions[i]]] > quizLowestValue) {
				question[0].answer = answerOptions[i];
				quizLowestValue = data.rates[question[0][answerOptions[i]]];
			}	
		}
		
		else {
			if (data.rates[question[0][answerOptions[i]]] <	quizHighestValue) {
				question[0].answer = answerOptions[i];
				quizHighestValue = data.rates[question[0][answerOptions[i]]];
			}
		}
		
		getName(question[0][answerOptions[i]], i);
		
	}
	
	document.getElementById("question").innerHTML = question[0].question;
	
	document.getElementById("a").onclick = function () {
		markIt("a");
	};
	
	document.getElementById("b").onclick = function () {
		markIt("b");
	};
	
	document.getElementById("c").onclick = function () {
		markIt("c");
	};
	
	document.getElementById("d").onclick = function () {
		markIt("d");
	};
	console.log(question);
	
}

function getName(symbol, number) {
	
	fetch("https://api.exchangerate.host/symbols")
		.then(resp => resp.json())
		.then(data => assignName(data, symbol, number));
	
}

function assignName(data, symbol, number) {
	
	names[number] = data.symbols[symbol].description;
	console.log(names[number]);
	document.getElementById(answerOptions[number]).innerHTML = answerOptions[number].toUpperCase() + "." + names[number];
	
	
}

function markIt(answer) {
	
	if (marked == false) {
		
		if (answer == question[0].answer) {
			document.getElementById("checkanswer").innerHTML = "Correct";
		}
		
		else {
			document.getElementById("checkanswer").innerHTML = "Incorrect, the correct answer is: " + question[0].answer.toUpperCase();
		}
		
		marked = true;
		console.log("Answered: " + answer);
		console.log(question[0].answer);
		console.log("Answer: " + document.getElementById(question[0].answer).innerHTML);
	}
	
}

function compareCurrency(data) {
	
	highest = 1000000000000;
	lowest = 0;
	compareDate = data.date;
	console.log(data);
	
	try {
		
		for(let i = 0; i < keys.length ; i++){
			
			if (data.rates[keys[i]] < highest) {
				highest = data.rates[keys[i]];
				highestSymbol = keys[i];
			}
		
		}	
		
		for(let i = 0; i < keys.length ; i++){
			
			if (data.rates[keys[i]] > lowest) {
				lowest = data.rates[keys[i]];
				lowestSymbol = keys[i];
			}
		
		}	
	
		console.log(data.rates[highestSymbol]);
		console.log(highestSymbol);
		console.log(data.rates[lowestSymbol]);
		console.log(lowestSymbol);
		
		fetch("https://api.exchangerate.host/symbols")
			.then(resp => resp.json())
			.then(data => displayHighestAndLowest(data,compareDate));
			
	}
	
	catch {
		highestDiv.innerHTML = "Error! Please don't select the date after today or the date too date before 02/01/1999";
	}
	
}

function displayHighestAndLowest(data,compareDate) {
	
	highestDiv.innerHTML = "The most valuable currency at " + compareDate + " is: " + data.symbols[highestSymbol].description;
	lowestDiv.innerHTML = "The least valuable currency at " + compareDate + " is: " + data.symbols[lowestSymbol].description;
	
}

if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/sw.js');
}
