import React from "react";
import "./FormInput.css";

import { useTelegram } from "../../../hooks/useTelegram";

const FormInput = ({
  labelTitle,
  inputValue,
  onChangeFunc,
  placeholder,
  isError,
  onKeyDown,
}) => {
  const { tg } = useTelegram();
  const colorScheme = tg.colorScheme;

  const onKeyDownFunc = (e) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
  };
  return (
    <div>
      <label
        htmlFor={labelTitle}
        className={`form-label ${isError && "form-label-error"} ${
          colorScheme === "light" && "form-label-light"
        }`}
      >
        {labelTitle}
      </label>
      <input
        type="text"
        id={labelTitle}
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => onChangeFunc(e)}
        onKeyDown={onKeyDownFunc}
        className={`form-input ${isError && "form-input-error"} ${
          colorScheme === "light" && "form-input-light"
        }`}
      />
    </div>
  );
};

export default FormInput;
