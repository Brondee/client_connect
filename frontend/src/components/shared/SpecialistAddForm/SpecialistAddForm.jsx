import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useTelegram } from "../../../hooks/useTelegram";
import "../../../assets/styles/global.css";
import FormInput from "../../ui/FormInput/FormInput";
import CategoriesInput from "../../ui/CategoriesInput/CategoriesInput";
import { ReactComponent as AddIcon } from "../../../assets/img/add.svg";
import { ReactComponent as EditIcon } from "../../../assets/img/pencil.svg";
import SubmitBtn from "../SubmitBtn/SubmitBtn";

const SpecialistAddForm = () => {
  const [name, setName] = useState("");
  const [qualification, setQualification] = useState("");
  const [image, setImage] = useState(null);
  const [nameError, setNameError] = useState(false);
  const [qualError, setQualError] = useState(false);
  const [firstTimeTable, setFirstTimeTable] = useState("");
  const [secondTimeTable, setSecondTimeTable] = useState("");
  const [beginDate, setBeginDate] = useState("");
  const [isFirstTimeTableError, setIsFirstTimeTableError] = useState(false);
  const [isSecondTimeTableError, setIsSecondTimeTableError] = useState(false);
  const [isBeginDateError, setIsBeginDateError] = useState(false);

  const { curCategoryIds } = useSelector((state) => state.admin);
  const navigate = useNavigate();
  let specId = null;
  const { colorScheme } = useTelegram();
  const reqUrl = process.env.REACT_APP_REQUEST_URL;

  const onChangeName = (e) => {
    setName(e.target.value);
  };
  const onChangeQual = (e) => {
    setQualification(e.target.value);
  };
  const onChangeUploadImage = (e) => {
    setImage(e.target.files[0]);
  };
  const onChangeFirstTimeTable = (e) => {
    setFirstTimeTable(e.target.value);
  };
  const onChangeSecondTimeTable = (e) => {
    setSecondTimeTable(e.target.value);
  };
  const onChangeBeginDate = (e) => {
    setBeginDate(e.target.value);
  };

  const confirmClick = async () => {
    if (name.length === 0) {
      setNameError(true);
    }
    if (qualification.length === 0) {
      setQualError(true);
    }
    if (firstTimeTable.length === 0) {
      setIsFirstTimeTableError(true);
    }
    if (secondTimeTable.length === 0) {
      setIsSecondTimeTableError(true);
    }
    if (beginDate.length === 0 || beginDate.length < 10) {
      setIsBeginDateError(true);
    }
    if (
      name.length !== 0 &&
      qualification.length !== 0 &&
      firstTimeTable.length !== 0 &&
      secondTimeTable.length !== 0 &&
      beginDate.length !== 0 &&
      beginDate.length >= 10
    ) {
      try {
        const timeTable = firstTimeTable + "/" + secondTimeTable;
        const data = {
          name: name.trim(),
          qualification,
          timeTable,
          beginingDate: beginDate,
          categoryIds: curCategoryIds,
        };
        const response = await axios.post(`${reqUrl}specialist/add`, data);
        console.log(response.data);
        specId = response.data.id;
        navigate("/specialists");
      } catch (err) {
        console.log(err);
      }
      if (image && specId !== null) {
        let formData = new FormData();
        formData.append("image", image);
        console.log(formData, image);
        try {
          const response = await axios.post(
            `${reqUrl}specialist/upload/${specId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(response.data);
          navigate("/specialists");
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  const onKeyDownBeginDate = (e) => {
    if (e.key !== "Backspace") {
      if (beginDate.length === 4 || beginDate.length === 7) {
        setBeginDate(beginDate + "-");
      }
    }
  };

  return (
    <form className="specialist-form">
      <FormInput
        labelTitle="Имя"
        inputValue={name}
        onChangeFunc={onChangeName}
        isError={nameError}
      />
      <FormInput
        labelTitle="Специальность"
        inputValue={qualification}
        onChangeFunc={onChangeQual}
        isError={qualError}
      />
      <div className="file-input-container">
        <label
          htmlFor="photoInput"
          className={`form-label ${
            colorScheme === "light" && "form-label-light"
          }`}
        >
          Фотография
        </label>
        <input
          type="file"
          id="photoInput"
          onChange={(e) => onChangeUploadImage(e)}
          className={`file-input`}
        />
        <label
          className={`file-btn ${image && "file-btn-chosen"} ${
            colorScheme === "light" && "file-input-light"
          }`}
          htmlFor="photoInput"
        >
          {image ? (
            <EditIcon />
          ) : (
            <AddIcon className={`${colorScheme === "light" && "icon-light"}`} />
          )}
        </label>
        {image && (
          <p
            className={`file-title ${
              colorScheme === "light" && "file-title-light"
            }`}
          >
            Выбрано: <span className="pink-text">{image?.name}</span>
          </p>
        )}
      </div>
      <div className="timetable-label-container">
        <label
          htmlFor="firstTimeTable"
          className={`form-label ${
            isFirstTimeTableError && "form-label-error"
          } ${isSecondTimeTableError && "form-label-error"} ${
            colorScheme === "light" && "form-label-light"
          }`}
        >
          Режим работы
        </label>
      </div>
      <div className="timetable-container">
        <input
          type="text"
          id="firstTimeTable"
          onChange={(e) => onChangeFirstTimeTable(e)}
          className={`input-timetable ${
            isFirstTimeTableError && "form-input-error"
          } ${colorScheme === "light" && "form-input-light"}`}
          value={firstTimeTable}
          maxLength={1}
        />
        <p
          className={`timetable-text ${
            colorScheme === "light" && "timetable-light"
          }`}
        >
          через
        </p>
        <input
          type="text"
          id="secondTimeTable"
          onChange={(e) => onChangeSecondTimeTable(e)}
          className={`input-timetable ${
            isSecondTimeTableError && "form-input-error"
          } ${colorScheme === "light" && "form-input-light"}`}
          value={secondTimeTable}
          maxLength={1}
        />
        <p
          className={`timetable-text ${
            colorScheme === "light" && "timetable-light"
          }`}
        >
          дней
        </p>
      </div>
      <div className="begin-date-container">
        <p
          className={`timetable-text ${
            colorScheme === "light" && "timetable-light"
          }`}
        >
          начиная с
        </p>
        <input
          type="text"
          onChange={(e) => onChangeBeginDate(e)}
          className={`input-begin-date input-timetable ${
            isBeginDateError && "form-input-error"
          } ${colorScheme === "light" && "form-input-light"}`}
          maxLength={10}
          value={beginDate}
          placeholder="ГГГГ-ММ-ДД"
          onKeyDown={(e) => onKeyDownBeginDate(e)}
        />
      </div>
      <CategoriesInput />
      <SubmitBtn onClick={confirmClick} />
    </form>
  );
};

export default SpecialistAddForm;
