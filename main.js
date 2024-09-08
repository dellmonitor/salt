var Game = {
	fps: 50,
	width: 640,
	height: 480,
	objects: [],
	qt: new Quadtree(new Rectangle(640 / 2, 480 / 2, 640 / 2, 480 / 2), 4),
	tilesize: 32,
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

Game.generatemap = function() {
	Game.perlin = [];
	for (let i = -1; i <= 1; i++) {
		let row = [];
		for (let j = -1; j <= 1; j++) {
			let x = j * Game.width + Math.floor(Game.player.x / Game.width) * Game.width;
			let y = i * Game.height + Math.floor(Game.player.y / Game.height) * Game.height;
			let paired = pair(x, y);
			let getRand = NaN;
			if (x >= 0) {
				if (y >= 0) {
					getRand = xoshiro128ss(paired, Game.seed, Game.seed, Game.seed);
				} else {
					getRand = xoshiro128ss(Game.seed, paired, Game.seed, Game.seed);
				}
			} else {
				if (y >= 0) {
					getRand = xoshiro128ss(Game.seed, Game.seed, paired, Game.seed);
				} else {
					getRand = xoshiro128ss(Game.seed, Game.seed, Game.seed, paired);
				}
			}
			let perlin = new Perlin(4, 3, x, y, getRand);
			for (let m = 0; m < (j != -1 ? 3 : 0); m++) {
				perlin.grid[m][0] = row[j].grid[m][perlin.width];
			}
			for (let n = 0; n < (i != -1 ? 4 : 0); n++) {
				perlin.grid[0][n] = Game.perlin[i][j + 1].grid[perlin.height][n];
			}
			row.push(perlin);
		}
		Game.perlin.push(row);
	}
}

Game.update = function() {
	Game.qt =  new Quadtree(new Rectangle(Game.player.x, Game.player.y, Game.width / 2, Game.height / 2), 4);
	for (object of Game.objects) {
		Game.qt.insert(new Point(object.x, object.y, object));
	}
	for (object of Game.objects) {
		object.update();
	}
	if ((Math.abs((Game.player.x - Game.width / 2) - Game.perlin[1][1].x) > Game.width / 2 + Game.tilesize)
	|| ((Math.abs((Game.player.y - Game.height / 2) - Game.perlin[1][1].y) > Game.height / 2 + Game.tilesize)))  {
		Game.generatemap();
	}
};

Game.draw = function() {


	Game.context.clearRect(0, 0, Game.width, Game.height);
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			for (let y = 0; y < Game.perlin[i][j].height; y += Game.perlin[i][j].height / (Game.height / Game.tilesize))  {
				for (let x = 0; x < Game.perlin[i][j].width; x += Game.perlin[i][j].width / (Game.width / Game.tilesize))  {
					var v = (Game.perlin[i][j].noise(x, y) / 2 + 0.5) * 255;
					Game.context.fillStyle = 'hsl(' + v + ', 50% ,50%)';
					Game.context.fillRect(Game.perlin[i][j].x + x * (Game.width / Game.perlin[i][j].width) - Game.player.x + Game.width / 2 ,
										  Game.perlin[i][j].y + y * (Game.height / Game.perlin[i][j].height) - Game.player.y + Game.height / 2 ,
										  Game.tilesize,
										  Game.tilesize);
				}
			}
		}
	}
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

	Game.seed = (Math.random() * 2 ** 32) >>> 0;

	Game.generatemap();

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
