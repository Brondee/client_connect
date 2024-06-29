import React from "react";

import { useTelegram } from "../../../hooks/useTelegram";
import "./SubmitBtn.css";

const SubmitBtn = ({ onClick }) => {
  const { activateHaptic } = useTelegram();
  const newOnClick = () => {
    activateHaptic("heavy");
    onClick();
  };
  return (
    <div className="submit-btn-container">
      <div onClick={newOnClick} className="submit-btn">
        <p className="submit-text">Подтвердить</p>
      </div>
    </div>
  );
};

export default SubmitBtn;
