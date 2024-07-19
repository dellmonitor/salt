var Game = {
	fps: 50,
	width: 640,
	height: 480
};

function Player() {
	this.x = 0;
	this.y = 0;
}

var Key = {
	_pressed: {},

	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,

	isDown: function(keyCode) {
		return this._pressed[keyCode];
	},

	onKeydown: function(event) {
		this._pressed[event.keyCode] = true;
	},

	onKeyup: function(event) {
		delete this._pressed[event.keyCode];
	}
};

Player.prototype.draw = function(context) {
	context.fillRect(this.x, this.y, 32, 32);
};

Player.prototype.moveLeft = function() {
	this.x -= 1;
};

Player.prototype.moveRight = function() {
	this.x += 1;
};

Player.prototype.moveUp = function() {
	this.y -= 1;
};

Player.prototype.moveDown = function() {
	this.y += 1;
};

Player.prototype.update = function() {
	if (Key.isDown(Key.UP)) this.moveUp();
	if (Key.isDown(Key.LEFT)) this.moveLeft();
	if (Key.isDown(Key.DOWN)) this.moveDown();
	if (Key.isDown(Key.RIGHT)) this.moveRight();
};

Game.update = function() {
	Game.player.update();
};

Game.draw = function() {
	Game.context.clearRect(0, 0, Game.width, Game.height);
	Game.player.draw(Game.context);
};

Game.start = function() {
	Game.canvas = document.createElement("canvas");
	Game.canvas.width = Game.width;
	Game.canvas.height = Game.height;

	Game.context = Game.canvas.getContext("2d");

	document.body.appendChild(Game.canvas);

	Game.player = new Player();

	window.onEachFrame(Game.run);
};

Game.run = (function() {
	var loops = 0, skipTicks = 1000 / Game.fps,
		maxFrameSkip = 10,
		nextGameTick = (new Date).getTime();

	return function() {
		loops = 0;

		while ((new Date).getTime() > nextGameTick) {
			Game.update();
			nextGameTick += skipTicks;
			loops++;
		}

		if (loops) Game.draw();
	};
})();

(function() {
	var onEachFrame;
	if (window.requestAnimationFrame) {
		onEachFrame = function(cb) {
			var _cb = function() { cb(); requestAnimationFrame(_cb); }
			_cb();
		};
	} else {
		onEachFrame = function(cb) {
			setInterval(cb, 1000 / Game.fps);
		}
	}

	window.onEachFrame = onEachFrame;
})();

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
