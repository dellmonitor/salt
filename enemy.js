Enemy = function(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.hitbox = new Rectangle(x, y, width, height);
}

Enemy.prototype.update = function() {
}

Enemy.prototype.draw = function(context) {
	context.fillStyle = 'red';
	context.fillRect(this.x, this.y, this.hitbox.width * 2, this.hitbox.height * 2);
}
