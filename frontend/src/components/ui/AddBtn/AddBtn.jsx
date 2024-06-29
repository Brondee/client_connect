import React from "react";
import { useNavigate } from "react-router-dom";

import CircleBtn from "../CircleBtn/CircleBtn";
import "./AddBtn.css";

const AddBtn = ({ screenTitle }) => {
  const navigate = useNavigate();
  return (
    <div className="add-btn-container" onClick={() => navigate(screenTitle)}>
      <CircleBtn isActive={false} />
      <p>Добавить</p>
    </div>
  );
};

export default AddBtn;
