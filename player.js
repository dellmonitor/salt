function Player() {
	Entity.call(this, 0, 0, new Rectangle(0, 0, 16, 16), 'black');
}

Player.prototype = Object.create(Entity.prototype);

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

Player.prototype.move = function() {
	if (Key.isDown(Key.UP)) this.moveUp();
	if (Key.isDown(Key.LEFT)) this.moveLeft();
	if (Key.isDown(Key.DOWN)) this.moveDown();
	if (Key.isDown(Key.RIGHT)) this.moveRight();
}

Player.prototype.update = function() {
	this.move();
	this.color = 'black';
	this.hitbox = new Rectangle(this.x, this.x, 16, 16);
	if (this.isColliding) {
		this.color = 'blue';
	}

};
