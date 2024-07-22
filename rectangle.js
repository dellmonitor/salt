Rectangle = function(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.left = x - width;
	this.right = x + width;
	this.top = y - height;
	this.bottom = y + height;
};

Rectangle.prototype.contains = function(point) {
	return (point.x >= this.x - this.width 	&&
			point.x <= this.x + this.width 	&&
			point.y >= this.y - this.height &&
			point.y <= this.y + this.height);
};

Rectangle.prototype.intersects = function(range) {
	return (this.right >= range.left &&
			this.left <= range.rigth &&
			this.bottom >= range.top &&
			this.top <= range.bottom);
}

