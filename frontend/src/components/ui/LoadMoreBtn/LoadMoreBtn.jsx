import React from "react";
import "./LoadMoreBtn.css";

const LoadMoreBtn = ({ isShown, onClick }) => {
  return (
    <div
      className={`load-more-btn-container ${!isShown && "load-more-hidden"}`}
    >
      <div onClick={onClick} className="load-more-btn">
        <p className="load-more-text">Загрузить еще</p>
      </div>
    </div>
  );
};

export default LoadMoreBtn;
