import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { setSpecialistId } from "../../../store/orderInfoSlice";
import {
  setIsEdit,
  setCurBeginDate,
  setCurTimeTable,
} from "../../../store/adminSlice";
import "./Specialist.css";
import { useTelegram } from "../../../hooks/useTelegram";
import CircleBtn from "../../ui/CircleBtn/CircleBtn";
import { ReactComponent as DeleteIcon } from "../../../assets/img/delete.svg";

const Specialist = ({
  id,
  name,
  qualification,
  photo,
  beginDate,
  timeTable,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [imgPath, setImgPath] = useState("");

  const { isAdminActions, isEdit, curEditType } = useSelector(
    (state) => state.admin
  );

  const { activateHaptic } = useTelegram();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reqUrl = process.env.REACT_APP_REQUEST_URL;

  const onClick = () => {
    activateHaptic("medium");
    setIsActive(!isActive);
    dispatch(setSpecialistId(id));
    dispatch(setCurBeginDate(beginDate));
    dispatch(setCurTimeTable(timeTable));
    if (isAdminActions && curEditType !== "datetime") {
      dispatch(setIsEdit(true));
      navigate("/edit");
    } else {
      navigate("/date");
    }
    if (isEdit) {
      deleteClick();
    }
  };

  const deleteClick = async () => {
    activateHaptic("medium");
    try {
      await axios.delete(`${reqUrl}specialist/del/${id}`);
      dispatch(setIsEdit(false));
      navigate("/specialists");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getImage = async () => {
      if (photo) {
        try {
          const response = await axios(`${reqUrl}specialist/img/${photo}`, {
            responseType: "blob",
          });
          const data = response.data;
          setImgPath(URL.createObjectURL(data));
        } catch (err) {
          console.log("err");
        }
      }
    };
    getImage();
  }, [photo, reqUrl]);

  return (
    <div
      className={`spec-container ${isActive && "spec-container-active"} ${
        isEdit && "spec-container-active"
      }`}
      onClick={onClick}
    >
      <div className="img-name-container">
        <img src={imgPath} alt="person img" className="photo" />
        <div className="name-qual-container">
          <h3 className="name">{name}</h3>
          <p className="qualification">{qualification}</p>
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

export default Specialist;
