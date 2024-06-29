import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

import { setCurCategoryIds } from "../../../store/adminSlice";
import "./CategoriesInput.css";
import Category from "../../shared/Category/Category";
import { useTelegram } from "../../../hooks/useTelegram";
import { ReactComponent as ArrowDown } from "../../../assets/img/arrow-bold.svg";

const CategoriesInput = ({ specialistId, categoryId }) => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isCategoriesActive, setIsCategoriesActive] = useState(false);
  const [categoriesCounter, setCategoriesCounter] = useState(0);

  const { isEdit, curEditType } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  let chosenCounter = 0;
  const { colorScheme } = useTelegram();
  const reqUrl = process.env.REACT_APP_REQUEST_URL;

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios(`${reqUrl}category/all`);
        const data = response.data;
        setCategories(data);
        if (!isEdit) {
          setIsCategoriesActive(true);
          setFilteredCategories(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCategories();
  }, [isEdit, reqUrl]);
  useEffect(() => {
    const filterCategories = () => {
      if (isEdit) {
        if (curEditType === "specialists") {
          const newData = categories.map((category) => {
            const { specialists } = category;
            const specialistIds = specialists.map((specialist) => {
              return specialist.specialistId;
            });
            if (specialistIds.includes(specialistId)) {
              return { ...category, isChosen: true };
            } else {
              return { ...category, isChosen: false };
            }
          });
          setFilteredCategories(newData);
          const curCategoriesIds = newData
            .map((category) => {
              if (category.isChosen === true) {
                return category.id;
              } else {
                return null;
              }
            })
            .filter((category) => category !== null);
          dispatch(setCurCategoryIds(curCategoriesIds));
          setCategoriesCounter(curCategoriesIds);
        } else if (curEditType === "services") {
          dispatch(setCurCategoryIds([categoryId]));
          const newData = categories.map((category) => {
            if (category.id === categoryId) {
              return { ...category, isChosen: true };
            } else {
              return { ...category, isChosen: false };
            }
          });
          setFilteredCategories(newData);
        }
      }
    };
    filterCategories();
  }, [categories, categoryId, curEditType, isEdit, specialistId, dispatch]);

  return (
    <div className="categories-input-container">
      <p
        className={`form-label ${
          colorScheme === "light" && "form-label-light"
        }`}
      >
        Категории
      </p>
      {isEdit && (
        <div
          className={`categories-titles-container ${
            colorScheme === "light" && "categories-titles-container-light"
          }`}
          onClick={() => setIsCategoriesActive(!isCategoriesActive)}
        >
          <p
            className={`categories-titles ${
              colorScheme === "light" && "categories-titles-light"
            }`}
          >
            {filteredCategories.map((category) => {
              const { title, isChosen } = category;
              if (isChosen) {
                if (curEditType === "specialists") {
                  chosenCounter += 1;
                  if (chosenCounter === categoriesCounter.length) {
                    return title;
                  } else {
                    return title + ", ";
                  }
                } else {
                  return title;
                }
              }
              return null;
            })}
          </p>
          <ArrowDown
            className={`arrow-down ${
              isCategoriesActive && "arrow-down-active"
            } ${colorScheme === "light" && "arrow-down-light"}`}
          />
        </div>
      )}
      <div
        className={`categories-container ${
          isCategoriesActive && "categories-container-active"
        } ${colorScheme === "light" && "categories-container-light"}`}
      >
        {filteredCategories.map((category) => {
          const { id, title, isChosen } = category;
          return (
            <Category key={id} id={id} title={title} isChosen={isChosen} />
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesInput;
