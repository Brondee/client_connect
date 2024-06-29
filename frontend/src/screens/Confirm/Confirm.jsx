import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import ArrowBack from "../../components/ui/ArrowBack/ArrowBack";
import SubmitBtn from "../../components/shared/SubmitBtn/SubmitBtn";
import { setCurServiceIds } from "../../store/orderInfoSlice";
import { sendOrder } from "../../utils/sendOrder";
import { useTelegram } from "../../hooks/useTelegram";

import "../../assets/styles/global.css";
import "./Confirm.css";
import { ReactComponent as EditIcon } from "../../assets/img/pencil.svg";
import { ReactComponent as DeleteIcon } from "../../assets/img/delete.svg";
// import { ReactComponent as MarkIcon } from "../../assets/img/mark.svg";
import { months, days } from "../../utils/calendarArrays";
import AnimationPage from "../../components/shared/AnimationPage/AnimationPage";

const Confirm = () => {
  const [name, setName] = useState("");
  const [telegram, setTelegram] = useState("");
  const [telephone, setTelephone] = useState("");
  const [comment, setComment] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [services, setServices] = useState([]);
  const [nameError, setNameError] = useState(false);
  const [telephoneError, setTelephoneError] = useState(false);
  const [telegramError, setTelegramError] = useState(false);
  const [imgPath, setImgPath] = useState("");

  let servicesPrice = 0;
  let servicesSecondPrice = 0;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tg, activateHaptic } = useTelegram();
  const colorScheme = window.Telegram.WebApp.colorScheme;
  const reqUrl = process.env.REACT_APP_REQUEST_URL;

  const {
    curTime,
    curDate,
    curWeekDay,
    curSpecialistId,
    curServiceIds,
    morningTime,
    afternoonTime,
    eveningTime,
  } = useSelector((state) => state.orderInfo);

  const onKeyDownTelephone = (e) => {
    if (e.key !== "Backspace") {
      if (telephone.startsWith("+7")) {
        if (
          telephone.length === 2 ||
          telephone.length === 6 ||
          telephone.length === 10 ||
          telephone.length === 13
        ) {
          setTelephone(telephone + " ");
        }
      }
    }
  };

  const onChangeName = (e) => {
    setName(e.target.value);
    if (telephone.length > 5 && name.length > 2 && telegram.length > 2) {
      tg.MainButton.setText("Подтвердить");
      tg.MainButton.show();
    } else {
      tg.MainButton.hide();
    }
  };

  const onChangeTelephone = (e) => {
    setTelephone(e.target.value);
  };

  const onChangeTelegram = (e) => {
    setTelegram(e.target.value);
  };

  const editSpecialistClick = () => {
    activateHaptic("medium");
    navigate("/specialists");
  };

  const editDateTimeClick = () => {
    activateHaptic("medium");
    navigate("/date");
  };

  const deleteServiceClick = (id) => {
    activateHaptic("medium");
    if (services.length > 1) {
      const newServiceIds = curServiceIds.filter(
        (serviceId) => serviceId !== id
      );
      dispatch(setCurServiceIds(newServiceIds));
      const newServices = services.filter((service) => service.id !== id);
      setServices(newServices);
    }
  };

  const confirmPageClick = async () => {
    if (name !== "" && telephone !== "" && telegram !== "") {
      const orderData = await sendOrder(
        name,
        telegram,
        telephone,
        comment,
        companyAddress,
        specialist.id,
        specialist.name,
        curSpecialistId,
        curTime,
        curDate,
        curWeekDay,
        curServiceIds,
        morningTime,
        afternoonTime,
        eveningTime,
        reqUrl
      );
      setNameError(false);
      setTelephoneError(false);
      setTelegramError(false);
      const dataToSend = JSON.stringify(orderData);
      tg.sendData(dataToSend);
      navigate("/");
    } else if (name === "" && telephone === "") {
      setNameError(true);
      setTelephoneError(true);
      setTelegramError(true);
    } else if (name === "") {
      setTelegramError(false);
      setTelephoneError(false);
      setNameError(true);
    } else if (telephone === "") {
      setTelegramError(false);
      setNameError(false);
      setTelephoneError(true);
    } else if (telegram === "") {
      setNameError(false);
      setTelegramError(false);
      setTelephoneError(true);
    }
  };

  useEffect(() => {
    const getSpecialistInfo = async () => {
      try {
        const response = await axios.get(
          `${reqUrl}specialist/${curSpecialistId}`
        );
        setSpecialist(response.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    getSpecialistInfo();
    const getServicesInfo = async () => {
      try {
        const response = await axios.get(`${reqUrl}services/${curServiceIds}`);
        setServices(response.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    getServicesInfo();
    const getGeneralInfo = async () => {
      try {
        const response = await axios(`${reqUrl}general/info`);
        const data = response.data;
        setCompanyAddress(data.companyAddress);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getGeneralInfo();
  }, [curServiceIds, curSpecialistId, reqUrl]);
  useEffect(() => {
    const getImage = async () => {
      if (specialist?.photoUrl) {
        try {
          const response = await axios(
            `${reqUrl}specialist/img/${specialist.photoUrl}`,
            { responseType: "blob" }
          );
          const data = response.data;
          setImgPath(URL.createObjectURL(data));
        } catch (err) {
          console.log("err");
        }
      }
    };
    getImage();
  }, [specialist, reqUrl]);

  return (
    <AnimationPage>
      <div
        className={`main-container ${
          colorScheme === "light" && "main-container-light"
        }`}
      >
        <div className="wrap">
          <div className="arrow-title-container">
            <ArrowBack screenTitle={"/date"} />
            <h1
              className={`main-title ${
                colorScheme === "light" && "main-title-light"
              }`}
            >
              Ваши данные
            </h1>
          </div>
          <form className="form">
            <label
              htmlFor="name"
              className={`label ${nameError && "label-error"}`}
            >
              Имя*
            </label>
            <input
              type="text"
              id="name"
              placeholder="ваше имя"
              value={name}
              onChange={(e) => onChangeName(e)}
              className={`input ${nameError && "input-error"}`}
            />
            <label
              htmlFor="telegram"
              className={`label ${nameError && "label-error"}`}
            >
              Телеграм*
            </label>
            <input
              type="text"
              id="telegram"
              placeholder="ник в телеграме"
              value={telegram}
              onChange={(e) => onChangeTelegram(e)}
              className={`input ${telegramError && "input-error"}`}
            />
            {/* <div className="tg-warning-container">
              <MarkIcon width="30" />
              <p className="tg-warning-text">
                Введя свой ник в поле телеграм неправильно, вы не сможете
                просматривать свои записи.
              </p>
            </div> */}
            <label
              htmlFor="telephone"
              className={`label ${telephoneError && "label-error"}`}
            >
              Телефон*
            </label>
            <input
              type="text"
              id="telephone"
              placeholder="+7 000 000 00 00"
              value={telephone}
              onChange={(e) => onChangeTelephone(e)}
              onKeyDown={(e) => onKeyDownTelephone(e)}
              className={`input ${telephoneError && "input-error"}`}
              maxLength={16}
            />
            <label htmlFor="comment" className="label">
              Комментарий к записи
            </label>
            <input
              type="text"
              id="comment"
              placeholder="комментарий"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input"
            />
          </form>
          <h3 className="details-title">Детали заказа</h3>
          <div className="spec-container container-animation">
            <div className="img-name-container">
              <img src={imgPath} alt="person img" className="photo" />
              <div className="name-qual-container">
                <h3 className="name">{specialist.name}</h3>
                <p className="qualification">{specialist.qualification}</p>
              </div>
            </div>
            <EditIcon onClick={editSpecialistClick} />
          </div>
          <div className="spec-container date-time-container container-animation">
            <div className="day-info-container">
              <h4 className="day-title">
                {curDate.slice(-2)} {months[Number(curDate.slice(5, -3)) - 1]},{" "}
                {days[curWeekDay]}
              </h4>
              <p className="detail-time">{curTime}</p>
            </div>
            <EditIcon onClick={editDateTimeClick} />
          </div>
          {services?.map((service, index) => {
            const { id, title, price, time, priceSecond } = service;
            servicesPrice += price;
            servicesSecondPrice += priceSecond;
            return (
              <div
                key={id}
                className={`container container-animation ${
                  services.length > 1 && "container-multiple"
                } ${
                  index === 0 &&
                  services.length > 1 &&
                  "container-service-first"
                } ${
                  index === services.length - 1 &&
                  services.length > 1 &&
                  "container-service-last"
                }`}
                onClick={() => deleteServiceClick(id)}
              >
                <div className="info-container">
                  <h3 className="title">{title}</h3>
                  <div className="price-time-container">
                    {price === priceSecond && priceSecond ? (
                      <p className="price">{price} ₽</p>
                    ) : (
                      <p className="price">
                        {price} - {priceSecond} ₽
                      </p>
                    )}
                    <p className="time">{time}</p>
                  </div>
                </div>
                {services.length > 1 && <DeleteIcon />}
              </div>
            );
          })}
          <div className="line"></div>
          <div className="service-counter-container">
            <p className="service-counter">
              {curServiceIds.length} {curServiceIds.length === 1 && "услуга"}{" "}
              {curServiceIds.length > 1 && curServiceIds.length < 5 && "услуги"}
              {curServiceIds.length >= 5 && "услуг"}
            </p>
            {servicesPrice === servicesSecondPrice ? (
              <p className="services-price">{servicesPrice} ₽</p>
            ) : (
              <p className="price">
                <p className="services-price">
                  {servicesPrice} - {servicesSecondPrice} ₽
                </p>
              </p>
            )}
          </div>
          <SubmitBtn onClick={confirmPageClick} />
        </div>
      </div>
    </AnimationPage>
  );
};

export default Confirm;
