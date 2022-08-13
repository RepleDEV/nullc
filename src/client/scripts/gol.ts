interface Cell {
	x: number;
	y: number;
}

interface NeighborCell extends Cell {
	value: number;
}

class NeighboringCells {
	cells: NeighborCell[] = [];

	push(x: number, y: number): void {
		for (let i = 0; i < this.cells.length; i++) {
			const c = this.cells[i];
			if (x == c.x && y == c.y) {
				this.cells[i].value++;
				return;
			}
		}

		this.cells.push({ x, y, value: 1 });
	}
}

class GOL {
	cells: Cell[];
	constructor(cells: Cell[]) {
		this.cells = cells;
	}

	getNeighboringCells(): NeighboringCells {
		const neighboringCells = new NeighboringCells();

		for (const c of this.cells) {
			for (let x = -1; x < 2; x++) {
				for (let y = -1; y < 2; y++) {
					if (x == 0 && y == 0) continue;
					neighboringCells.push(c.x + x, c.y + y);
				}
			}
		}

		return neighboringCells;
	}

	next(): void {
		const neighboringCells = this.getNeighboringCells();

		const newCells: Cell[] = [];

		for (const { x, y, value } of neighboringCells.cells) {
			const newCell: Cell = { x, y };

			if (value == 3) {
				newCells.push(newCell);
			} else if (value == 2) {
				for (const c of this.cells) {
					if (c.x == x && c.y == y) {
						newCells.push(newCell);
						break;
					}
				}
			}
		}

		this.cells = newCells;
	}
}

export default GOL;
export { Cell, NeighborCell };
