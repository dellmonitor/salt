function Entity(x, y, hitbox, color) {
	this.x = x;
	this.y = y;
	this.hitbox = hitbox;
	this.color = color;
	this.isColliding = false;
}

Entity.prototype.update = function() {
};

Entity.prototype.draw = function(context) {
	context.fillStyle = this.color;
	context.fillRect(this.x, this.y, this.hitbox.width * 2, this.hitbox.height * 2);
};
