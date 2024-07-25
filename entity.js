function Entity(x, y, hitbox, color, speed) {
	this.x = x;
	this.y = y;
	this.hitbox = hitbox;
	this.color = color;
	Object.defineProperty(this, "isColliding", {
		get() {
			let range = new Rectangle(this.x, this.y, this.hitbox.width * 2, this.hitbox.height * 2);
			let points = Game.qt.query(range);
			for (let point of points) {
				if (this != point.userData && this.hitbox.intersects(point)) {
					return true;
				}
			}
			return false;
		}
	});
	this.speed = {
		x: 0,
		y: 0,
		base: speed
	};
	Object.defineProperty(this, "velocity", {
		get() {
			let length = Math.sqrt(Math.pow(this.speed.x, 2) + Math.pow(this.speed.y, 2));
			if (length != 0) {
				return {
					x: this.speed.x * this.speed.base / length,
					y: this.speed.y * this.speed.base / length
				}
			}
			return {
				x: 0,
				y: 0
			}
		},
		set() {
		}
	});
}

Entity.prototype.update = function() {
};

Entity.prototype.draw = function(context) {
	context.fillStyle = this.color;
	context.fillRect(this.x, this.y, this.hitbox.width * 2, this.hitbox.height * 2);
};
