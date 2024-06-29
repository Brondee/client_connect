import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setCurServiceIds, setCurDate } from "../../../store/orderInfoSlice";
import { setIsEdit, setCurCategoryIds } from "../../../store/adminSlice";
import "./ArrowBack.css";
import { ReactComponent as ArrowBackIcon } from "../../../assets/img/arrow.svg";
import { useTelegram } from "../../../hooks/useTelegram";

const ArrowBack = ({ screenTitle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { colorScheme, activateHaptic } = useTelegram();

  const { isAdminActions } = useSelector((state) => state.admin);

  const onClick = () => {
    activateHaptic("light");
    if (screenTitle === "/") {
      dispatch(setCurCategoryIds([]));
      dispatch(setCurServiceIds([]));
    }
    if (isAdminActions) {
      dispatch(setCurDate(""));
      dispatch(setCurCategoryIds([]));
    }
    dispatch(setIsEdit(false));
    navigate(screenTitle);
  };

  return (
    <div
      className={`arrow-back-container ${
        colorScheme === "light" && "arrow-back-container-light"
      }`}
      onClick={onClick}
    >
      <ArrowBackIcon className="arrow-back-img" />
    </div>
  );
};

export default ArrowBack;
