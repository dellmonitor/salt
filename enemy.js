function Enemy(x, y, hitbox, color) {
	Entity.call(this, x, y, hitbox, color);
}

Enemy.prototype = Object.create(Entity.prototype);

Enemy.prototype.update = function() {
}
