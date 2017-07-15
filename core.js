var field = document.getElementsByClassName('field_box')[0];
var loseBox = document.getElementsByClassName('lose_box')[0];
var scoreCounterBox = document.getElementsByClassName('info_score_counter')[0];
var reloadBtn = document.getElementsByClassName('lose_repeatgame_btn')[0];


reloadBtn.onclick = function() {window.location.reload();};

var reloadBtn = document.getElementsByClassName('lose_repeatgame_btn')[0];

//time counter
var timeCounterBox = document.getElementsByClassName('info_time_counter')[0];

var timeCounter = 0;

var timeCounterInterval = setInterval(function(){
	timeCounterBox.innerHTML = String(timeCounter);
	timeCounter++;
},1000);


function randint(min, max) {
	return Math.round(min + Math.random()*(max-min));
};

// initialization function
function init(cells_amount) {
	// cells initialization
	for (var i=0; i<cells_amount; i++) {
		var newCell = document.createElement('div');
	 	newCell.className = 'cell';
		field.appendChild(newCell);
	};
};

init(1750);

function transformCoordinates(x,y) {
	var result = 50*(y-1)+x; 
	return result-1;
};

// init cells coordinates
function initCells(snake) {
	if (snake.direction==1) {
		for (var i=1; i<snake.length; i++) {
			snake.cells.push(new Cell(25,18+i));
		};
	};
	if (snake.direction==2) {
		for (var i=1; i<snake.length; i++) {
			snake.cells.push(new Cell(25-i,18));
		};
	};
	if (snake.direction==3) {
		for (var i=1; i<snake.length; i++) {
			snake.cells.push(new Cell(25,18-i));
		};
	};
	if (snake.direction==4) {
		for (var i=1; i<snake.length; i++) {
			snake.cells.push(new Cell(25+i,18));
		};
	};
};

function checkLose(snake) {
	for(var i=1; i<snake.length; i++) {
		if ((snake.cells[0].x == snake.cells[i].x) && (snake.cells[0].y == snake.cells[i].y)) {
			snake.motor.stop();
		};
	};
};

function Apple(snake) {
	this.x = randint(1,50);
	this.y = randint(1,35);

	var check = 0;

	for (var i=0; i < snake.length; i++) {

		if ( (this.x == snake.cells[i].x) && (this.y == snake.cells[i].y) ) {

			if ( (this.x > 2) && (this.x < 49) && (this.y > 2) && (this.y < 34) ) {
				var ways = [0,0,0,0,0,0,0,0];
				for (var x=0; x < snake.length; x++) {
					if ( (this.x+1 == snake.cells[x].x) ) {ways[0]++;};
					if ( (this.x-1 == snake.cells[x].x) ) {ways[1]--;};
					if ( (this.y+1 == snake.cells[x].y) ) {ways[2]++;};
					if ( (this.y-1 == snake.cells[x].y) ) {ways[3]--;};

					if ( (this.x+2) == snake.cells[x].x ) {ways[4]++;};
					if ( (this.x-2) == snake.cells[x].x ) {ways[5]--;};
					if ( (this.y+2) == snake.cells[x].y ) {ways[6]++;};
					if ( (this.y-2) == snake.cells[x].y ) {ways[7]--;};
				};
				if (ways[0] == 0) this.x++;
				if (ways[1] == 0) this.x--;
				if (ways[2] == 0) this.y++;
				if (ways[3] == 0) this.y--;

				if (ways[4] == 0) {this.x += 2};
				if (ways[5] == 0) {this.x -= 2};
				if (ways[6] == 0) {this.y += 2};
				if (ways[7] == 0) {this.y -= 2};
			} else {
				if (this.x <= 2) {this.x = randint(5,50);};
				if (this.x >= 49) {this.x = randint(1,45);};
				if (this.y <= 2) {this.y = randint(5,35);};
				if (this.y >= 34) {this.x = randint(1,30);};
			};

		};

	};
	


	var cell = document.getElementsByClassName('cell')[transformCoordinates(this.x, this.y)];
	cell.className = 'cell apple_cell';

	this.hide = function() {
		cell.className = 'cell';
	};

};

function eat(apple, snake) {
	apple.hide();
	snake.extend();
};

//cell class
function Cell(x, y) {
	this.x = x;
	this.y = y;

	var cell = document.getElementsByClassName('cell')[transformCoordinates(x, y)];
	cell.className = 'cell snake_cell';

	this.moveTo = function(x, y) {
		if ( (transformCoordinates(x, y) > 1749) || ( (x < 1) || (y<1) ) ) {
			return;
		}

		var oldcell = document.getElementsByClassName('cell')[transformCoordinates(this.x, this.y)];
		oldcell.className = 'cell';

		this.x = x;
		this.y = y;

		var cell = document.getElementsByClassName('cell')[transformCoordinates(this.x, this.y)];
		cell.className = 'cell snake_cell';
	};
};

// snake class
function Snake(x, y, direction, length=3) {
	this.length = length;
	scoreCounterBox.innerHTML = String(length);
	this.direction = direction;
	this.cells = [new Cell(x, y)];
	this.colorHead = "#24292e";

	this.moveTop = function() {
		if (this.cells[1].y < this.cells[0].y) return;

		var oldcells = [];
		for (var i=0; i<this.length; i++) {
			oldcells.push([this.cells[i].x, this.cells[i].y]);
		};

		this.cells[0].moveTo(this.cells[0].x, this.cells[0].y-1);
		for(var i=1; i<this.length; i++) {
			this.cells[i].moveTo(oldcells[i-1][0], oldcells[i-1][1]);
		};
	};

	this.moveRight = function() {
		if (this.cells[1].x > this.cells[0].x) return;

		var oldcells = [];
		for (var i=0; i<this.length; i++) {
			oldcells.push([this.cells[i].x, this.cells[i].y]);
		};

		this.cells[0].moveTo(this.cells[0].x+1, this.cells[0].y);
		for(var i=1; i<this.length; i++) {
			this.cells[i].moveTo(oldcells[i-1][0], oldcells[i-1][1]);
		};
	};

	this.moveBottom = function() {
		if (this.cells[1].y > this.cells[0].y) return;

		var oldcells = [];
		for (var i=0; i<this.length; i++) {
			oldcells.push([this.cells[i].x, this.cells[i].y]);
		};

		this.cells[0].moveTo(this.cells[0].x, this.cells[0].y+1);
		for(var i=1; i<this.length; i++) {
			this.cells[i].moveTo(oldcells[i-1][0], oldcells[i-1][1]);
		};
	};

	this.moveLeft = function() {
		if (this.cells[1].x < this.cells[0].x) return;

		var oldcells = [];
		for (var i=0; i<this.length; i++) {
			oldcells.push([this.cells[i].x, this.cells[i].y]);
		};

		this.cells[0].moveTo(this.cells[0].x-1, this.cells[0].y);
		for(var i=1; i<this.length; i++) {
			this.cells[i].moveTo(oldcells[i-1][0], oldcells[i-1][1]);
		};

	};

	this.motor = new Motor(this);

	this.extend = function() {
		if (this.direction == 1) {
			this.cells.push(new Cell(this.cells[this.length-1].x, this.cells[this.length-1].y+1));
			this.length++;
		};
		if (this.direction == 2) {
			this.cells.push(new Cell(this.cells[this.length-1].x-1, this.cells[this.length-1].y));
			this.length++;
		};
		if (this.direction == 3) {
			this.cells.push(new Cell(this.cells[this.length-1].x, this.cells[this.length-1].y-1));
			this.length++;
		};
		if (this.direction == 4) {
			this.cells.push(new Cell(this.cells[this.length-1].x+1, this.cells[this.length-1].y));
			this.length++;
		};
		scoreCounterBox.innerHTML = String(this.length);
	};

	this.getHeadСoordinates = function() {
		return this.cells[0];
	};
	this.getCellsCoordinates = function() {
		return this.cells;
	};

	initCells(this);
};

function lose(snake) {
	clearInterval(timeCounterInterval);
	snake.motor.stop();
	loseBox.style.display = "block";
	field.style.opacity = "0";
	setTimeout(function(){
		loseBox.style.opacity = "1";
		loseBox.style.transform = "perspective(360px) rotateY(0deg)";
	}, 100);
};

function checkLose(snake, direction) {
	if (direction==1) {
		if (snake.cells[0].y==1) {
			lose(snake);
			return 1;
		};
		for (var i=2; i < snake.length; i++) {
			if ( (snake.cells[0].y-1==snake.cells[i].y) && (snake.cells[0].x == snake.cells[i].x) ) {
				lose(snake);
			};
		};
	};
	if (direction==2) {
		if (snake.cells[0].x==50) {
			lose(snake);
			return 1;
		};
		for (var i=2; i < snake.length; i++) {
			if ( (snake.cells[0].y==snake.cells[i].y) && (snake.cells[0].x+1 == snake.cells[i].x) ) {
				lose(snake);
			};
		};
	};
	if (direction==3) {
		if (snake.cells[0].y==35) {
			lose(snake);
			return 1;
		};
		for (var i=2; i < snake.length; i++) {
			if ( (snake.cells[0].y+1==snake.cells[i].y) && (snake.cells[0].x == snake.cells[i].x) ) {
				lose(snake);
			};
		};
	};
	if (direction==4) {
		if (snake.cells[0].x==1) {
			lose(snake);
			return 1;
		};
		for (var i=2; i < snake.length; i++) {
			if ( (snake.cells[0].y==snake.cells[i].y) && (snake.cells[0].x-1 == snake.cells[i].x) ) {
				lose(snake);
			};
		};
	};
	return 0;
};

function Motor(snake) {

	window.onkeydown = function(event) {						// check BUG, for example, bottom, left, top - BUG
		if ((event.keyCode == 38) && (snake.direction != 3) && !( (snake.cells[0].x == snake.cells[1].x) && (snake.cells[0].y == snake.cells[1].y+1) ) ) { snake.direction = 1 };
		if ((event.keyCode == 39) && (snake.direction != 4) && !( (snake.cells[0].x+1 == snake.cells[1].x) && (snake.cells[0].y == snake.cells[1].y) )) { snake.direction = 2 };
		if ((event.keyCode == 40) && (snake.direction != 1) && !( (snake.cells[0].x == snake.cells[1].x) && (snake.cells[0].y+1 == snake.cells[1].y) )) { snake.direction = 3 };
		if ((event.keyCode == 37) && (snake.direction != 2) && !( (snake.cells[0].x == snake.cells[1].x+1) && (snake.cells[0].y == snake.cells[1].y) )) { snake.direction = 4 };
	};

	var interval = setInterval(function() {
		//check food
		if ( (snake.cells[0].x==food[0].x) && (snake.cells[0].y==food[0].y) ) {
			eat(food[0], snake);
			food[0] = new Apple(snake);
		};

		if (snake.direction==1) {
			//check lose
			if (checkLose(snake, 1) == 1) return;
			snake.moveTop();
		};
		if (snake.direction==2) { 
			if (checkLose(snake, 2) == 1) return;
			snake.moveRight();
		};
		if (snake.direction==3) { 
			if (checkLose(snake, 3) == 1) return;
			snake.moveBottom();
		};
		if (snake.direction==4) { 
			if (checkLose(snake, 4) == 1) return;
			snake.moveLeft(); 
		};
	}, 100);

	this.stop = function() { clearInterval(interval); };

};


var s1 = new Snake(x=25,y=18,direction=2, length=2);
var food = [new Apple(s1)];
