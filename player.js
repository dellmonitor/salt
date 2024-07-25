function Player() {
	Entity.call(this, 0, 0, new Rectangle(0, 0, 16, 16), 'black', 2);
}

Player.prototype = Object.create(Entity.prototype);

Player.prototype.moveLeft = function() {
	this.speed.x -= 1;
};

Player.prototype.moveRight = function() {
	this.speed.x += 1;
};

Player.prototype.moveUp = function() {
	this.speed.y -= 1;
};

Player.prototype.moveDown = function() {
	this.speed.y += 1;
};

Player.prototype.move = function() {
	if (Key.isDown(Key.UP)) this.moveUp();
	if (Key.isDown(Key.LEFT)) this.moveLeft();
	if (Key.isDown(Key.DOWN)) this.moveDown();
	if (Key.isDown(Key.RIGHT)) this.moveRight();
	let velocity = this.velocity;
	this.x += velocity.x;
	this.y += velocity.y;
}

Player.prototype.update = function() {
	this.speed.x = 0;
	this.speed.y = 0;
	this.move();
	this.color = 'black';
	this.hitbox = new Rectangle(this.x, this.x, 16, 16);
	if (this.isColliding) {
		this.color = 'blue';
	}

};
