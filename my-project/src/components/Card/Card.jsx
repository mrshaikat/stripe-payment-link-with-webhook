import React from "react";
import "./Card.css";

const Card = ({ header, content, onSelect }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>{header}</h2>
      </div>
      <div className="card-content">
        <p>{content}</p>
      </div>
      <div className="card-btn-content">
        <button onClick={onSelect}>Make Request</button>
      </div>
    </div>
  );
};

export default Card;
