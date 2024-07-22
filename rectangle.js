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
	return (point.x >= this.left 	&&
			point.x <= this.right	&&
			point.y >= this.top		&&
			point.y <= this.bottom);
};

Rectangle.prototype.intersects = function(range) {
	return ! (range.x - range.width > this.x + this.width 	||
			  range.x + range.width < this.x - this.width 	||
			  range.y - range.height > this.y + this.height ||
			  range.y + range.height < this.y - this.height);
}

