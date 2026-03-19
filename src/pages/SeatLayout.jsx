import React, { useState } from "react";
import "../styles/SeatLayout.css";

const SeatLayout = ({ busSeats, selectedSeats, toggleSeatSelection }) => {
  const [activeDeck, setActiveDeck] = useState("Lower"); // Upper/Lower टॉगलसाठी

  const lowerDeck = busSeats.filter(s => !s.seat_number.startsWith('U'));
  const upperDeck = busSeats.filter(s => s.seat_number.startsWith('U'));

  const renderGrid = (seats) => (
    <div className="bus-visual-container">
      <div className="grid-header">
        <span>{activeDeck === "Lower" ? "Lower Deck" : "Upper Deck"}</span>
        <div className="steering-icon">⭕</div>
      </div>
      <div className="seat-grid">
        {seats.map((seat, index) => {
          const isSelected = selectedSeats.includes(seat.seat_number);
          const isBooked = seat.is_booked || seat.is_locked;
          const isFemale = seat.reserved_for === "Female";
          const isSleeper = seat.seat_type.toLowerCase() === "sleeper";

          let seatClass = `seat-box ${isSleeper ? "sleeper" : "seater"}`;
          if (isSelected) seatClass += " selected-blue";
          else if (isBooked) seatClass += " booked-gray";
          else if (isFemale) seatClass += " female-pink";
          else seatClass += " available-green";

          return (
            <React.Fragment key={seat.seat_id}>
              {/* २-१ लेआउटसाठी रस्ता (Aisle Gap) सोडणे */}
              {/* जर तिसरा कॉलम रिकामा ठेवायचा असेल तर इथे रिकामा div येईल */}
              <div
                className={seatClass}
                onClick={() => !isBooked && toggleSeatSelection(seat.seat_number)}
              >
                <div className="seat-inner-pillow"></div>
                <span className="seat-id-text">{seat.seat_number}</span>
                {seat.is_locked && <span className="lock-icon">🔒</span>}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="redbus-layout-wrapper">
      <h3 className="layout-title">Select Your Seats</h3>
      
      {/* Legend: जशी इमेजमध्ये आहे तशी */}
      <div className="legend-row">
        <div className="leg-item"><span className="dot green"></span> Available</div>
        <div className="leg-item"><span className="dot pink"></span> Female</div>
        <div className="leg-item"><span className="dot blue"></span> Selected</div>
        <div className="leg-item"><span className="dot gray"></span> Booked</div>
      </div>

      {/* Deck Toggle Buttons */}
      <div className="deck-selector">
        <button 
          className={activeDeck === "Upper" ? "active" : ""} 
          onClick={() => setActiveDeck("Upper")}
        >Upper</button>
        <button 
          className={activeDeck === "Lower" ? "active" : ""} 
          onClick={() => setActiveDeck("Lower")}
        >Lower</button>
      </div>

      <div className="main-bus-area">
        {activeDeck === "Lower" ? renderGrid(lowerDeck) : renderGrid(upperDeck)}
      </div>

      <div className="bus-bottom-graphic">
        <img src="https://cdn-icons-png.flaticon.com/512/3448/3448339.png" alt="bus-front" />
      </div>
    </div>
  );
};

export default SeatLayout;