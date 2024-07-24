var Game = {
	fps: 50,
	width: 640,
	height: 480,
	objects: new Quadtree(new Rectangle(640 / 2, 480 / 2, 640 / 2, 480 / 2), 4)
};

Quadtree.prototype.update = function() {
	this.points.forEach((point) => point.userData.update());
	if (this.isDivided) {
		this.northeast.update();
		this.southeast.update();
		this.southwest.update();
		this.northwest.update();
	}
}

Quadtree.prototype.draw = function(context) {
	this.points.forEach((point) => point.userData.draw(context));
	if (this.isDivided) {
		this.northeast.draw(context);
		this.southeast.draw(context);
		this.southwest.draw(context);
		this.northwest.draw(context);
	}
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

Game.update = function() {
	Game.player.update();
	Game.objects.update();
};

Game.draw = function() {
	Game.context.clearRect(0, 0, Game.width, Game.height);
	Game.player.draw(Game.context);
	Game.objects.draw(Game.context);
};

Game.start = function() {
	Game.canvas = document.createElement("canvas");
	Game.canvas.width = Game.width;
	Game.canvas.height = Game.height;

	Game.context = Game.canvas.getContext("2d");

	for (let i = 0; i < 10; i++) {
		let x = Math.random() * Game.width;
		let y = Math.random() * Game.height;
		Game.objects.insert(new Point(x, y, new Enemy(x, y, new Rectangle(x, y, 16, 16), 'red')));
	}

	document.body.appendChild(Game.canvas);

	Game.player = new Player();

	Game._onEachFrame(Game.run);
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

Game._onEachFrame = (function() {
	var requestAnimationFrame = window.webkitRequestAnimationFrame ||
								window.mozRequestAnimationFrame;
	if (requestAnimationFrame) {
		return function(cb) {
			var _cb = function() { cb(); requestAnimationFrame(_cb); }
			_cb();
		};
	} else {
		return function(cb) {
			setInterval(cb, 1000 / Game.fps);
		}
	}
})();

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
