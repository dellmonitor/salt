function Enemy(x, y, hitbox, color, speed) {
	Entity.call(this, x, y, hitbox, color, speed);
}

Enemy.prototype = Object.create(Entity.prototype);

Enemy.prototype.move = function() {
	let velocity = this.velocity;
	this.x += velocity.x;
	this.y += velocity.y;
}

Enemy.prototype.update = function() {
	this.speed.x = Game.player.x - this.x;
	this.speed.y = Game.player.y - this.y;
	this.move();
	this.color = 'red';
	this.hitbox = new Rectangle(this.x, this.x, 16, 16);
	if (this.isColliding) {
		this.color = 'pink';
	}
}
