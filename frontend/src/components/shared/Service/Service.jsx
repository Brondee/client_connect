import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useTelegram } from "../../../hooks/useTelegram";
import { setCurServiceIds } from "../../../store/orderInfoSlice";
import { setIsEdit, setCurCategoryIds } from "../../../store/adminSlice";
import "./Service.css";
import CircleBtn from "../../ui/CircleBtn/CircleBtn";
import { ReactComponent as DeleteIcon } from "../../../assets/img/delete.svg";

const Service = ({ id, title, price, time, categoryId, priceSec }) => {
  const [isActive, setIsActive] = useState(false);
  const { tg, activateHaptic } = useTelegram();

  const { curServiceIds } = useSelector((state) => state.orderInfo);
  const { curCategoryIds } = useSelector((state) => state.admin);
  const { isAdminActions, isEdit } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reqUrl = process.env.REACT_APP_REQUEST_URL;

  const onClick = async () => {
    activateHaptic("medium");
    if (isEdit) {
      deleteClick();
    } else if (isAdminActions) {
      navigate("/edit");
      dispatch(setCurServiceIds([id]));
      dispatch(setIsEdit(true));
    } else {
      setIsActive(!isActive);
      if (!isActive) {
        dispatch(setCurServiceIds([...curServiceIds, id]));
        dispatch(setCurCategoryIds([...curCategoryIds, categoryId]));
      } else {
        const newCurServiceIds = curServiceIds.filter(
          (dataId) => dataId !== id
        );
        const newCurCategoryIds = curCategoryIds.filter(
          (dataId) => dataId !== categoryId
        );
        dispatch(setCurServiceIds(newCurServiceIds));
        dispatch(setCurCategoryIds(newCurCategoryIds));
      }
      if (curServiceIds.length > 1 || !isActive) {
        tg.MainButton.setText("Далее");
        tg.MainButton.show();
      } else if (curServiceIds.length <= 1 || isActive) {
        console.log("hide");
        tg.MainButton.hide();
      }
    }
  };

  const deleteClick = async () => {
    activateHaptic("medium");
    try {
      await axios.delete(`${reqUrl}services/del/${id}`);
      dispatch(setIsEdit(false));
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`container ${isActive && "container-active"} ${
        isEdit && "container-active"
      }`}
      onClick={onClick}
    >
      <div className="info-container">
        <h3 className="title">{title}</h3>
        <div className="price-time-container">
          {price === priceSec && priceSec ? (
            <p className="price">{price} ₽</p>
          ) : (
            <p className="price">
              {price} - {priceSec} ₽
            </p>
          )}
          <p className="time">{time}</p>
        </div>
      </div>
      {isEdit ? (
        <DeleteIcon width="26" height="26" className="deleteIcon" />
      ) : (
        <CircleBtn isActive={isActive} />
      )}
    </div>
  );
};

export default Service;
