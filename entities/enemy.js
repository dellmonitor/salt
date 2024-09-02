class Enemy extends Entity {
	constructor(x, y, hitbox, color, speed) {
		super(x, y, hitbox, color, speed);
	}

	move() {
		let velocity = this.velocity;
		this.x += velocity.x;
		this.y += velocity.y;
	}

	update() {
		this.speed.x = Game.player.x - this.x;
		this.speed.y = Game.player.y - this.y;
		this.move();
		this.color = 'red';
		this.hitbox = new Circle(this.x, this.y, 16);
		if (this.isColliding) {
			this.color = 'pink';
		}
	}
}
