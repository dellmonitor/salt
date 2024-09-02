class Circle {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.rSquared = r * r;
	}

	contains(point) {
		let dSquared = Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2);
		return dSquared <= this.rSquared;
	}

	intersects(range) {
		if (range instanceof Circle) {
			let d = Math.pow(this.x - range.x, 2) + Math.pow(this.y - range.y, 2);
			return d <= Math.pow(this.r + range.r, 2);
		} else if (range instanceof Rectangle) {
			let testX = this.x;
			let testY = this.y;

			if 		(this.x < range.left) 	testX = range.left;
			else if (this.x > range.right) 	testX = range.right;

			if 		(this.y < range.top)	testY = range.top;
			else if (this.y > range.bottom)	testY = range.bottom;
			
			let dSquared = Math.pow(this.x - testX, 2) + Math.pow(this.y - testY, 2)
			return dSquared <= this.rSquared;
		}
	}
}
