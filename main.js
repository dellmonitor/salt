var Game = {
	fps: 50,
	width: 640,
	height: 480,
	objects: [],
	qt: new Quadtree(new Rectangle(640 / 2, 480 / 2, 640 / 2, 480 / 2), 4)
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
	Game.qt =  new Quadtree(new Rectangle(Game.player.x, Game.player.y, Game.width / 2, Game.height / 2), 4);
	for (object of Game.objects) {
		Game.qt.insert(new Point(object.x, object.y, object));
	}
	for (object of Game.objects) {
		object.update();
	}
};

Game.draw = function() {
	Game.context.clearRect(0, 0, Game.width, Game.height);
	Game.qt.draw(Game.context);
};

Game.start = function() {
	Game.canvas = document.createElement('canvas');
	Game.canvas.width = Game.width;
	Game.canvas.height = Game.height;

	Game.context = Game.canvas.getContext('2d');

	Game.player = new Player(this.width / 2, this.height / 2);
	Game.objects.push(Game.player);
	Game.qt.insert(new Point(Game.player.x, Game.player.y, Game.player));

	for (let i = 1; i < 60; i++) {
		let x = Math.random() * Game.width;
		let y = Math.random() * Game.height;
		Game.objects.push(new Enemy(x, y, new Circle(x, y, 16), 'red', 1));
		Game.qt.insert(new Point(x, y, Game.objects[i]));
	}

	document.body.appendChild(Game.canvas);

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
