import "./style.css";
import {
  createSeatingMatrix,
  findAdjacentAvailableSeats,
  getSeatCounts,
  reserveSeat,
  type SeatPosition,
} from "./seating";

/** Returns a required page element or explains which element is missing. */
function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Cinema page is missing ${selector}.`);
  }
  return element;
}

const seatGrid = requireElement<HTMLDivElement>("#seat-grid");
const availableCount = requireElement<HTMLElement>("#available-count");
const occupiedCount = requireElement<HTMLElement>("#occupied-count");
const statusMessage = requireElement<HTMLElement>("#status-message");
const findPairButton = requireElement<HTMLButtonElement>("#find-pair");
const seats = createSeatingMatrix();
let highlightedPair: [SeatPosition, SeatPosition] | null = null;

/** Updates the visible occupied and available totals. */
function updateCounts(): void {
  const [occupied, available] = getSeatCounts(seats);
  occupiedCount.textContent = String(occupied);
  availableCount.textContent = String(available);
}

/** Rebuilds the seat grid to reflect occupancy and any suggested pair. */
function renderSeatMap(): void {
  seatGrid.replaceChildren();

  const corner = document.createElement("span");
  corner.className = "grid-corner";
  corner.setAttribute("aria-hidden", "true");
  seatGrid.append(corner);

  for (let columnIndex = 0; columnIndex < 10; columnIndex += 1) {
    const columnLabel = document.createElement("span");
    columnLabel.className = "column-label";
    columnLabel.setAttribute("role", "columnheader");
    columnLabel.textContent = String(columnIndex + 1);
    seatGrid.append(columnLabel);
  }

  for (let rowIndex = 0; rowIndex < 8; rowIndex += 1) {
    const rowLabel = document.createElement("span");
    rowLabel.className = "row-label";
    rowLabel.setAttribute("role", "rowheader");
    rowLabel.textContent = String(rowIndex + 1);
    seatGrid.append(rowLabel);

    for (let columnIndex = 0; columnIndex < 10; columnIndex += 1) {
      const isOccupied = seats[rowIndex][columnIndex] === 1;
      const isHighlighted = highlightedPair?.some(
        ([row, column]) => row === rowIndex + 1 && column === columnIndex + 1,
      );
      const seatButton = document.createElement("button");
      seatButton.type = "button";
      seatButton.className = `seat ${isOccupied ? "seat-occupied" : "seat-available"}${isHighlighted ? " pair-seat" : ""}`;
      seatButton.textContent = String(columnIndex + 1);
      seatButton.disabled = isOccupied;
      seatButton.setAttribute("role", "gridcell");
      seatButton.setAttribute(
        "aria-label",
        `Row ${rowIndex + 1}, seat ${columnIndex + 1}, ${isOccupied ? "occupied" : "available"}`,
      );

      // Reserve the selected seat, refresh the counts, and redraw the map.
      seatButton.addEventListener("click", () => {
        statusMessage.textContent = reserveSeat(seats, rowIndex + 1, columnIndex + 1);
        highlightedPair = null;
        updateCounts();
        renderSeatMap();
      });

      seatGrid.append(seatButton);
    }
  }
}

// Find and highlight the first available adjacent pair, or report that none exists.
findPairButton.addEventListener("click", () => {
  highlightedPair = findAdjacentAvailableSeats(seats);

  if (highlightedPair === null) {
    statusMessage.textContent = "No adjacent available seats found.";
  } else {
    const [firstSeat, secondSeat] = highlightedPair;
    statusMessage.textContent = `First pair: row ${firstSeat[0]}, seats ${firstSeat[1]} and ${secondSeat[1]}.`;
  }

  renderSeatMap();
});

updateCounts();
renderSeatMap();