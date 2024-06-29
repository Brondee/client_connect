import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { setCurCategoryIds, setIsEdit } from "../../../store/adminSlice";
import "./Category.css";
import CircleBtn from "../../ui/CircleBtn/CircleBtn";
import { ReactComponent as DeleteIcon } from "../../../assets/img/delete.svg";

const Category = ({ id, title, isChosen, isFromEditPage }) => {
  const [isActive, setIsActive] = useState(false);

  const { curCategoryIds, isEdit, curEditType } = useSelector(
    (state) => state.admin
  );
  const reqUrl = process.env.REACT_APP_REQUEST_URL;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onClick = async () => {
    if (isEdit && isFromEditPage) {
      try {
        await axios.delete(`${reqUrl}category/del/${id}`);
        dispatch(setIsEdit(false));
        navigate("/categories");
      } catch (error) {
        console.log(error);
      }
    } else if (isFromEditPage) {
      dispatch(setCurCategoryIds([id]));
      dispatch(setIsEdit(true));
      navigate("/edit");
    } else if (curEditType === "services") {
      dispatch(setCurCategoryIds([id]));
    } else if (!isActive) {
      if (curCategoryIds.includes(id)) {
        dispatch(setCurCategoryIds(curCategoryIds));
      } else {
        dispatch(setCurCategoryIds([...curCategoryIds, id]));
      }
    } else {
      const newIds = curCategoryIds.filter((categoryId) => categoryId !== id);
      dispatch(setCurCategoryIds(newIds));
    }
    setIsActive(!isActive);
  };

  useEffect(() => {
    setIsActive(isChosen);
  }, [isChosen]);
  useEffect(() => {
    if (curEditType === "services") {
      if (!curCategoryIds.includes(id)) {
        setIsActive(false);
      }
    }
  }, [curCategoryIds, curEditType, id]);

  return (
    <div
      className={`category-container ${isActive && "category-active"} ${
        isFromEditPage && "category-edit-page"
      }`}
      onClick={onClick}
    >
      <p className="category-title">{title}</p>
      {isEdit && isFromEditPage ? (
        <DeleteIcon width="26" height="32" className="deleteIcon" />
      ) : (
        <CircleBtn isActive={isActive} />
      )}
    </div>
  );
};

export default Category;
