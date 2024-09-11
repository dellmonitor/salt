var Game = {
	fps: 50,
	width: 1920,
	height: 1080,
	objects: [],
	qt: new Quadtree(new Rectangle(1920 / 2, 1080 / 2, 1920 / 2, 1080 / 2), 4),
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
	Game.tilemap = [];
	for (let i = -1; i <= 1; i++) {
		let row = [];
		let screenrow = [];
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
			let perlin = new Perlin(16, 9, x, y, getRand);
			for (let m = 0; m < (j != -1 ? 9 : 0); m++) {
				perlin.grid[m][0] = row[j].grid[m][perlin.width];
			}
			for (let n = 0; n < (i != -1 ? 16 : 0); n++) {
				perlin.grid[0][n] = Game.perlin[i][j + 1].grid[perlin.height][n];
			}
			row.push(perlin);
			let screen = [];
			for (let y = 0; y < perlin.height; y += perlin.height / (Game.height / Game.tilesize))  {
				let tilerow = [];
				for (let x = 0; x < perlin.width; x += perlin.width / (Game.width / Game.tilesize))  {
					var v = (perlin.noise(x, y) / 2 + 0.5) * 255;
					tilerow.push(v);
				}
				screen.push(tilerow);
			}
			screenrow.push(screen);
		}
		Game.tilemap.push(screenrow);
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

Game.startdrawing = [0.4, 0, 0];
Game.enddrawing = [1, 1, 0.6];

Game.draw = function() {
	Game.context.clearRect(0, 0, Game.width, Game.height);
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			for (let y = Math.floor(Game.startdrawing[i] * Math.floor(Game.height / Game.tilesize)); y <= Game.enddrawing[i] * Game.height / Game.tilesize; y++) {
				for (let x = Math.floor(Game.startdrawing[j] * Math.floor(Game.width / Game.tilesize)); x <= Game.enddrawing[j]  * Game.width / Game.tilesize; x++) {
					var v = Game.tilemap[i][j][y][x];
					Game.context.fillStyle = 'hsl(' + v + ', 50% ,50%)';
					Game.context.fillRect(Game.perlin[i][j].x + x * Game.tilesize - Game.player.x + Game.width / 2 ,
										  Game.perlin[i][j].y + y * Game.tilesize - Game.player.y + Game.height / 2 ,
										  Game.tilesize + 1,
										  Game.tilesize + 1);
				}
			}
		}
	}
	Game.qt.draw(Game.context);
};

Game.start = function() {
	Game.canvas = document.getElementById('game');
	Game.canvas.width = Game.width;
	Game.canvas.height = Game.height;

	Game.context = Game.canvas.getContext('2d');

	Game.player = new Player(this.width / 2, this.height / 2);
	Game.objects.push(Game.player);
	Game.qt.insert(new Point(Game.player.x, Game.player.y, Game.player));

	Game.seed = (Math.random() * 2 ** 32) >>> 0;

	Game.generatemap();

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
