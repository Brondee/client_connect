import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./Order.css";
import { setCurOrderId, setIsEdit } from "../../../store/adminSlice";
import filePng from "../../../assets/img/file.png";
import CircleBtn from "../../ui/CircleBtn/CircleBtn";
import { useTelegram } from "../../../hooks/useTelegram";

const Order = ({ id, clientName, date, totalTime }) => {
  const { isEdit } = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const { activateHaptic } = useTelegram();
  const dispatch = useDispatch();

  const onClick = async () => {
    activateHaptic("medium");
    dispatch(setCurOrderId(id));
    dispatch(setIsEdit(true));
    navigate("/edit");
  };

  return (
    <div
      className={`spec-container ${isEdit && "spec-container-active"}`}
      onClick={onClick}
    >
      <div className="img-info-container">
        <div className="img-container">
          <img src={filePng} alt="order img" className="file-img" />
        </div>
        <div className="name-date-container">
          <h3 className="client-name">
            <span className="small-text">от</span> {clientName}
          </h3>
          <p className="order-date">{date}</p>
        </div>
      </div>
      {!isEdit && <CircleBtn />}
    </div>
  );
};

export default Order;
