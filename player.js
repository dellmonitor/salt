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

Player.prototype.update = function() {
	if (Key.isDown(Key.UP)) this.moveUp();
	if (Key.isDown(Key.LEFT)) this.moveLeft();
	if (Key.isDown(Key.DOWN)) this.moveDown();
	if (Key.isDown(Key.RIGHT)) this.moveRight();
	this.isColliding = false;
	this.color = 'black';
	this.hitbox = new Rectangle(this.x, this.x, 16, 16);
	let range = new Rectangle(this.x, this.y, this.hitbox.width * 2, this.hitbox.height * 2);
	let others = Game.objects.query(range);
	for (let other of others) {
		if (this.hitbox.intersects(other)) {
			this.isColliding = true;
		}
	}
	if (this.isColliding) {
		this.color = 'blue';
	}

};
