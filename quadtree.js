Point = function(x, y, data) {
	this.x = x;
	this.y = y;
	this.userData = data;
};

Quadtree = function(boundary, n) {
	this.boundary = boundary;
	this.capacity = n;
	this.isDivided = false;
	this.points =[];
};

Quadtree.prototype.insert = function(point) {
	if (! this.boundary.contains(point)) {
		return false;
	}

	if (this.points.length < this.capacity) {
		this.points.push(point);
		return true;
	} else {
		if (! this.isDivided) {
			this.subdivide();
		}
		this.northeast.insert(point) ||
		this.southeast.insert(point) ||
		this.southwest.insert(point) ||
		this.northwest.insert(point);
	}
};

Quadtree.prototype.subdivide = function() {
	const x = this.boundary.x
	const y = this.boundary.y
	const width = this.boundary.width / 2;
	const height = this.boundary.height / 2;

	let ne = new Rectangle(x + width, y - height, width, height);
	this.northeast = new Quadtree(ne, this.capacity);

	let se = new Rectangle(x + width, y + height, width, height);
	this.southeast = new Quadtree(se, this.capacity);

	let sw = new Rectangle(x - width, y + height, width, height);
	this.southwest = new Quadtree(sw, this.capacity);

	let nw = new Rectangle(x - width, y - height, width, height);
	this.northwest = new Quadtree(nw, this.capacity);

	this.isDivided = true;
};

Quadtree.prototype.query = function(range, found) {
	if (! found) {
		found = [];
	}

	if (! range.intersects(this.boundary)) {
		return found;
	}

	if (this.isDivided) {
		this.northeast.query(range, found);
		this.southeast.query(range, found);
		this.southwest.query(range, found);
		this.northwest.query(range, found);
		return found;
	}

	for (const p of this.points) {
		if (range.contains(p)) {
			found.push(p);
		}
	}

	return found;
};
