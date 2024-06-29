import React from "react";
import "./CircleBtn.css";

const CircleBtn = ({ isActive }) => {
  return (
    <div className={`circle-plus closed ${isActive && "opened"}`}>
      <div className="circle">
        <div className="horizontal"></div>
        <div className="vertical"></div>
      </div>
    </div>
  );
};

export default CircleBtn;
