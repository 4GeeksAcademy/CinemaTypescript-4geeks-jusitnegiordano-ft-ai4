import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import {
  createSeatingMatrix,
  displaySeatMap,
  findAdjacentAvailableSeats,
  getSeatCounts,
  reserveSeat,
} from "./seating";

const seats = createSeatingMatrix();
const terminal = createInterface({ input: stdin, output: stdout });

try {
  let running = true;

  while (running) {
    console.log("\nCinema Seat Reservations");
    console.log("1. View seat availability");
    console.log("2. Reserve a seat");
    console.log("3. View seat counts");
    console.log("4. Find two adjacent available seats");
    console.log("5. Exit");

    const choice = (await terminal.question("Choose an option: ")).trim();

    switch (choice) {
      case "1":
        displaySeatMap(seats);
        break;
      case "2": {
        const row = Number(await terminal.question("Row (1-8): "));
        const column = Number(await terminal.question("Column (1-10): "));
        console.log(reserveSeat(seats, row, column));
        break;
      }
      case "3": {
        const [occupied, available] = getSeatCounts(seats);
        console.log(`Occupied: ${occupied}; available: ${available}.`);
        break;
      }
      case "4": {
        const pair = findAdjacentAvailableSeats(seats);
        if (pair === null) {
          console.log("No adjacent available seats found.");
        } else {
          console.log(
            `First adjacent pair: row ${pair[0][0]}, column ${pair[0][1]} and row ${pair[1][0]}, column ${pair[1][1]}.`,
          );
        }
        break;
      }
      case "5":
        running = false;
        console.log("Goodbye.");
        break;
      default:
        console.log("Invalid option. Choose a number from 1 to 5.");
    }
  }
} finally {
  terminal.close();
}
