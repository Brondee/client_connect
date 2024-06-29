import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./ServiceAddForm.css";
import FormInput from "../../ui/FormInput/FormInput";
import CategoriesInput from "../../ui/CategoriesInput/CategoriesInput";
import { setCurCategoryIds } from "../../../store/adminSlice";
import SubmitBtn from "../SubmitBtn/SubmitBtn";
import { useTelegram } from "../../../hooks/useTelegram";

const ServiceAddForm = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [priceSec, setPriceSec] = useState("");
  const [time, setTime] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [timeError, setTimeError] = useState(false);

  const { curCategoryIds } = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reqUrl = process.env.REACT_APP_REQUEST_URL;

  const { colorScheme } = useTelegram();

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const onChangePrice = (e) => {
    setPrice(e.target.value);
  };
  const onChangePriceSec = (e) => {
    setPriceSec(e.target.value);
  };
  const onChangeTime = (e) => {
    setTime(e.target.value);
  };

  const onKeyDownTime = (e) => {
    if (e.key !== "Backspace") {
      if (time.length === 2 && time[1] === "ч") {
        setTime(time + " ");
      }
    }
  };

  const confirmClick = async () => {
    if (title.length === 0 && price.length === 0 && time.length === 0) {
      setTitleError(true);
      setPriceError(true);
      setTimeError(true);
    } else if (title.length === 0) {
      setTitleError(true);
    } else if (price.length === 0 || priceSec.length === 0) {
      priceError(true);
    } else if (time.length === 0) {
      setTimeError(true);
    } else {
      try {
        const data = {
          title: title.trim(),
          price: Number(price),
          priceSecond: Number(priceSec),
          time,
          categoryId: curCategoryIds[0],
        };
        await axios.post(`${reqUrl}services/add`, data);
        dispatch(setCurCategoryIds([]));
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <form className="specialist-form">
      <FormInput
        labelTitle="Название"
        inputValue={title}
        onChangeFunc={onChangeTitle}
        isError={titleError}
      />
      <label
        htmlFor="price-fir"
        className={`form-label ${priceError && "form-label-error"} ${
          colorScheme === "light" && "form-label-light"
        }`}
      >
        Ценовой диапазон <br />
        <span className="sub-label">
          Введите число без знаков. Чтобы цена выводилась без диапазона, просто
          введите одно и то же число дважды.
        </span>
      </label>
      <div className="price-diapason">
        <input
          type="text"
          id="price-fir"
          value={price}
          onChange={(e) => onChangePrice(e)}
          className={`form-input price-input ${
            priceError && "form-input-error"
          } ${colorScheme === "light" && "form-input-light"}`}
        />
        <p class="price-separator">-</p>
        <input
          type="text"
          id="price-sec"
          value={priceSec}
          onChange={(e) => onChangePriceSec(e)}
          className={`form-input price-input ${
            priceError && "form-input-error"
          } ${colorScheme === "light" && "form-input-light"}`}
        />
      </div>
      <FormInput
        labelTitle="Время выполнения"
        inputValue={time}
        onChangeFunc={onChangeTime}
        isError={timeError}
        placeholder="1ч 30м"
        onKeyDown={onKeyDownTime}
      />
      <CategoriesInput />
      <SubmitBtn onClick={confirmClick} />
    </form>
  );
};

export default ServiceAddForm;
