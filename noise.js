class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	static randomUnit(getRand) {
		let radians = getRand() * 2 * Math.PI;
		return new Vector(Math.sin(radians), Math.cos(radians));
	}

	dot(v) {
		return this.x * v.x + this.y * v.y;
	}
}

// Линейная интерполяция
function lerp(a, b, t) {
	return a + (b - a) * fade(t);
}

function fade(t) {
	return t * t * t * (t * (t * 6 - 15) + 10);
}

class Perlin {
	constructor(width, height, x, y, getRand) {
		// Сетка градиентных векторов
		let grid = [];
		for (let x = 0; x <= height; x++) {
			let row = [];
			for (let y = 0; y <= width; y++) {
				row.push(Vector.randomUnit(getRand));
			}
			grid.push(row);
		}
		this.grid = grid;
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
	}

	// x < width
	// y < height
	// Возвращает значение от -1 до 1
	noise(x, y) {
		// Координаты левого верхнего узла
		let left = Math.floor(x);
		let top = Math.floor(y);

		// Локальные координаты точки внутри клетки
		let local = { x: x - left, y : y - top }; 

		// Градиентные векторы и векторы от узлов до точки
		let gradient = [];
		let distance = [];
		for (let i = 0; i < 2; i++) {
			let gradientRow = [];
			let distanceRow = [];
			for (let j = 0; j < 2; j++) {
				gradientRow.push(this.grid[top + i][left + j]);
				distanceRow.push(new Vector(local.x - j, local.y - i));
			}
			gradient.push(gradientRow);
			distance.push(distanceRow);
		}

		let dotProducts = [];
		for (let i = 0; i < 2; i++) {
			let row = [];
			for (let j = 0; j < 2; j++) {
				row.push(distance[i][j].dot(gradient[i][j]));
			}
			dotProducts.push(row);
		}

		let x1 = lerp(dotProducts[0][0], dotProducts[0][1], local.x);
		let x2 = lerp(dotProducts[1][0], dotProducts[1][1], local.x);

		let value = lerp(x1, x2, local.y);
		return value;
	}
}
