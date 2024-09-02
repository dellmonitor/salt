class Player extends Entity {
	constructor() {
		super(0, 0, new Circle(0, 0, 16), 'black', 2);
	}

	moveLeft() 	{ this.speed.x -= 1; }
	moveRight() { this.speed.x += 1; }
	moveUp() 	{ this.speed.y -= 1; }
	moveDown() 	{ this.speed.y += 1; }

	move() {
		if (Key.isDown(Key.UP)) this.moveUp();
		if (Key.isDown(Key.LEFT)) this.moveLeft();
		if (Key.isDown(Key.DOWN)) this.moveDown();
		if (Key.isDown(Key.RIGHT)) this.moveRight();
		let velocity = this.velocity;
		this.x += velocity.x;
		this.y += velocity.y;
	}

	update() {
		this.speed.x = 0;
		this.speed.y = 0;
		this.move();
		this.color = 'black';
		this.hitbox = new Circle(this.x, this.y, 16);
		if (this.isColliding) this.color = 'blue';
	}
}
