struct Cell {
    int x, y;
};

struct NeighborCell : Cell {
    int value;
};

struct NeighborCell* neighbors;
int neighbor_count;

void push(int x, int y) {
    for (int n = 0;n < neighbor_count;n++) {
        if (neighbors[n].x == x && neighbors[n].y == y) {
            neighbors[n].value++;
            return;
        }
    }

    neighbors[neighbor_count].x = x;
    neighbors[neighbor_count].y = y;
    neighbors[neighbor_count].value = 1;
    neighbor_count++;
}

int gol(struct Cell* cells, struct NeighborCell* neighbor_cells, int len) {
    neighbor_count = 0;
    neighbors = neighbor_cells;

    int newLen = 0;

    for (int i = 0;i < len;i++) {
        for (int x = -1;x < 2;x++) {
            for (int y = -1;y < 2;y++) {
                if (x == 0 && y == 0)continue;
                push(cells[i].x + x, cells[i].y + y);
            }
        }
    }

    for (int i = 0;i < len;i++) {
        for (int n = 0;n < neighbor_count;n++) {

        }
    }
}