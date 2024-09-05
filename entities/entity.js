class Entity {
	constructor(x, y, hitbox, color, speed) {
		this.x = x;
		this.y = y;
		this.hitbox = hitbox;
		this.color = color;
		this.speed = {
			x: 0,
			y: 0,
			base: speed
		};
	}

	get isColliding() {
		let range = new Circle(this.x, this.y, this.hitbox.r * 2);
		let points = Game.qt.query(range);
		for (let point of points) {
			if (point.userData != this && this.hitbox.intersects(point.userData.hitbox)) {
				return true;
			}
		}
		return false;
	}

	get velocity() {
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
	}

	draw(context) {
		context.fillStyle = this.color;
		context.strokeStyle = this.color;
		context.beginPath();
		context.arc(this.x - Game.player.x + Game.width / 2,
					this.y - Game.player.y + Game.height / 2,
					this.hitbox.r,
					0,
					2 * Math.PI);
		context.fill();
		context.stroke();
	}
}
