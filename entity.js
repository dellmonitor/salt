function Entity(x, y, hitbox, color) {
	this.x = x;
	this.y = y;
	this.hitbox = hitbox;
	this.color = color;
	Object.defineProperty(this, "isColliding", {
		get() {
			let range = new Rectangle(this.x, this.y, this.hitbox.width * 2, this.hitbox.height * 2);
			let points = Game.objects.query(range);
			for (let point of points) {
				if (this != point.userData && this.hitbox.intersects(point)) {
					return true;
				}
			}
			return false;
		}
	});
}

Entity.prototype.update = function() {
};

Entity.prototype.draw = function(context) {
	context.fillStyle = this.color;
	context.fillRect(this.x, this.y, this.hitbox.width * 2, this.hitbox.height * 2);
};
