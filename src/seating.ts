export const ROW_COUNT = 8;
export const COLUMN_COUNT = 10;

export type SeatMatrix = number[][];
export type SeatPosition = [row: number, column: number];

export function createSeatingMatrix(): SeatMatrix {
  const seats: SeatMatrix = [];

  for (let rowIndex = 0; rowIndex < ROW_COUNT; rowIndex += 1) {
    const row: number[] = [];
    for (let columnIndex = 0; columnIndex < COLUMN_COUNT; columnIndex += 1) {
      row.push(0);
    }
    seats.push(row);
  }

  return seats;
}

export function displaySeatMap(seats: SeatMatrix): void {
  let columnLabels = "   ";
  for (let columnIndex = 0; columnIndex < COLUMN_COUNT; columnIndex += 1) {
    columnLabels += `${String(columnIndex + 1).padStart(2)} `;
  }
  console.log(columnLabels);

  for (let rowIndex = 0; rowIndex < ROW_COUNT; rowIndex += 1) {
    let seatLabels = "";
    for (let columnIndex = 0; columnIndex < COLUMN_COUNT; columnIndex += 1) {
      const seatLabel = seats[rowIndex][columnIndex] === 1 ? "X" : "L";
      seatLabels += `${seatLabel.padStart(2)} `;
    }
    console.log(`${String(rowIndex + 1).padStart(2)} ${seatLabels}`);
  }
}

export function reserveSeat(seats: SeatMatrix, row: number, column: number): string {
  if (!Number.isInteger(row) || !Number.isInteger(column)) {
    return "Reservation failed: row and column must be whole numbers.";
  }

  if (row < 1 || row > ROW_COUNT || column < 1 || column > COLUMN_COUNT) {
    return `Reservation failed: choose a row from 1 to ${ROW_COUNT} and a column from 1 to ${COLUMN_COUNT}.`;
  }

  if (seats[row - 1][column - 1] === 1) {
    return `Reservation failed: row ${row}, column ${column} is already occupied.`;
  } else {
    seats[row - 1][column - 1] = 1;
    return `Reservation successful: row ${row}, column ${column} is now occupied.`;
  }
}

export function getSeatCounts(seats: SeatMatrix): [occupied: number, available: number] {
  let occupied = 0;
  let available = 0;

  for (let rowIndex = 0; rowIndex < ROW_COUNT; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < COLUMN_COUNT; columnIndex += 1) {
      if (seats[rowIndex][columnIndex] === 1) {
        occupied += 1;
      } else {
        available += 1;
      }
    }
  }

  return [occupied, available];
}

export function findAdjacentAvailableSeats(seats: SeatMatrix): [SeatPosition, SeatPosition] | null {
  for (let rowIndex = 0; rowIndex < ROW_COUNT; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < COLUMN_COUNT - 1; columnIndex += 1) {
      if (seats[rowIndex][columnIndex] === 0 && seats[rowIndex][columnIndex + 1] === 0) {
        return [
          [rowIndex + 1, columnIndex + 1],
          [rowIndex + 1, columnIndex + 2],
        ];
      }
    }
  }

  return null;
}