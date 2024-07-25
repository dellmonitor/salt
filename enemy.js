function Enemy(x, y, hitbox, color) {
	Entity.call(this, x, y, hitbox, color);
}

Enemy.prototype = Object.create(Entity.prototype);

Enemy.prototype.move = function() {
	this.x += (Math.round(Math.random()) * 2 - 1);
	this.y += (Math.round(Math.random()) * 2 - 1);
}

Enemy.prototype.update = function() {
	this.move();
	this.color = 'red';
	this.hitbox = new Rectangle(this.x, this.x, 16, 16);
	if (this.isColliding) {
		this.color = 'pink';
	}
}
