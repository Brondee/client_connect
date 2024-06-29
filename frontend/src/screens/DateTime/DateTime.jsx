import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../../assets/styles/global.css";
import "./DateTime.css";

import { useTelegram } from "../../hooks/useTelegram";
import { getDateArray } from "../../utils/getDateArray";
import ArrowBack from "../../components/ui/ArrowBack/ArrowBack";
import Date from "../../components/shared/Date/Date";
import Time from "../../components/shared/Time/Time";
import AnimationPage from "../../components/shared/AnimationPage/AnimationPage";
import { ReactComponent as TickIcon } from "../../assets/img/tick.svg";
import SubmitBtn from "../../components/shared/SubmitBtn/SubmitBtn";
import { setCurDate } from "../../store/orderInfoSlice";
import Loader from "../../components/ui/Loader/Loader";

const DateTime = () => {
  const [isEmptyTime, setIsEmptyTime] = useState(false);
  const [isTickActive, setIsTickActive] = useState(false);
  const [dateArray, setDateArray] = useState([]);
  const [isTickChange, setIsTickChange] = useState(false);
  const [morningTimeState, setMorningTimeState] = useState([]);
  const [afternoonTimeState, setAfternoonTimeState] = useState([]);
  const [eveningTimeState, setEveningTimeState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { morningTime, afternoonTime, eveningTime, curDate, curSpecialistId } =
    useSelector((state) => state.orderInfo);
  const { isAdminActions, curTimeArray, curBeginDate, curTimeTable } =
    useSelector((state) => state.admin);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { colorScheme } = useTelegram();
  const reqUrl = process.env.REACT_APP_REQUEST_URL;

  const tickClick = () => {
    setIsTickActive(!isTickActive);
    setIsTickChange(true);
  };

  const confirmClick = () => {
    if (isTickChange) {
      updateDateDb();
    } else {
      updateTimeDb();
    }
  };

  const updateTimeDb = async () => {
    let newMorningTime = [...morningTime];
    let newAfternoonTime = [...afternoonTime];
    let newEveningTime = [...eveningTime];
    for (let i = 0; i < curTimeArray.length; i++) {
      if (newMorningTime.indexOf(curTimeArray[i]) !== -1) {
        let index = newMorningTime.indexOf(curTimeArray[i]);
        if (!newMorningTime[index].includes("disabled")) {
          newMorningTime[index] = `disabled ${newMorningTime[index]}`;
        }
      } else if (newAfternoonTime.indexOf(curTimeArray[i]) !== -1) {
        let index = newAfternoonTime.indexOf(curTimeArray[i]);
        if (!newAfternoonTime[index].includes("disabled")) {
          newAfternoonTime[index] = `disabled ${newAfternoonTime[index]}`;
        }
      } else if (newEveningTime.indexOf(curTimeArray[i]) !== -1) {
        let index = newEveningTime.indexOf(curTimeArray[i]);
        if (!newEveningTime[index].includes("disabled")) {
          newEveningTime[index] = `disabled ${newEveningTime[index]}`;
        }
      }
    }
    const timeData = {
      date: curDate,
      specialistId: curSpecialistId,
      morningTime: newMorningTime,
      afternoonTime: newAfternoonTime,
      eveningTime: newEveningTime,
    };
    try {
      const response = await axios.patch(`${reqUrl}dates/editTime`, timeData);
      console.log(response.data);
      dispatch(setCurDate(""));
      navigate("/admin");
    } catch (error) {
      console.log(error);
    }
  };

  const updateDateDb = async () => {
    try {
      const dto = {
        date: curDate,
        specialistId: curSpecialistId,
        isWorkingDate: String(isTickActive),
        isWorkingDateChanged: true,
      };
      await axios.patch(`${reqUrl}dates/editDate`, dto);
      dispatch(setCurDate(""));
      navigate("/admin");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
  }, []);
  useEffect(() => {
    let filteredMorningTime = morningTime.filter(
      (time) => !time.startsWith("disabled")
    );
    setMorningTimeState(filteredMorningTime);
    let filteredAfternoonTime = afternoonTime.filter(
      (time) => !time.startsWith("disabled")
    );
    setAfternoonTimeState(filteredAfternoonTime);
    let filteredEveningTime = eveningTime.filter(
      (time) => !time.startsWith("disabled")
    );
    setEveningTimeState(filteredEveningTime);

    if (
      filteredMorningTime.length === 0 &&
      filteredAfternoonTime.length === 0 &&
      filteredEveningTime.length === 0
    ) {
      setIsEmptyTime(true);
      setIsTickActive(false);
    } else {
      setIsEmptyTime(false);
      setIsTickActive(true);
    }
  }, [morningTime, afternoonTime, eveningTime]);
  useEffect(() => {
    setTimeout(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
      const dateFuncArray = getDateArray(curBeginDate, curTimeTable);
      setDateArray(dateFuncArray);
    }, 200);
  }, [curBeginDate, curTimeTable]);

  return (
    <AnimationPage>
      <div
        className={`main-container ${
          colorScheme === "light" && "main-container-light"
        }`}
      >
        <div className="wrap">
          <div className="arrow-title-container">
            <ArrowBack screenTitle={"/specialists"} />
            <h1
              className={`main-title ${
                colorScheme === "light" && "main-title-light"
              }`}
            >
              Выберите дату и время
            </h1>
          </div>

          {isLoading ? (
            <Loader />
          ) : (
            <div>
              <div className="dates-container">
                {dateArray?.map((dateOnly) => {
                  const { id, date, isWorking, weekDay, fullDate } = dateOnly;
                  return (
                    <Date
                      key={id}
                      date={date}
                      fullDate={fullDate}
                      weekDay={weekDay}
                      isWorkingProp={isWorking}
                    />
                  );
                })}
              </div>
              {isAdminActions && (
                <div className="working-date-container">
                  <div className={`tick-container`} onClick={tickClick}>
                    <TickIcon
                      className={`tick-img ${
                        isTickActive && "tick-img-active"
                      }`}
                    />
                  </div>
                  <p className="isworking-text">на дату можно записаться</p>
                </div>
              )}
              {isEmptyTime ? (
                <p className="empty-date-text">На данную дату не записаться</p>
              ) : (
                <div className="time-all-container">
                  <h3 className="time-title">
                    {morningTimeState.length !== 0 && "Утро"}
                  </h3>
                  <div className="time-container">
                    {morningTimeState?.map((time) => {
                      return <Time key={time} time={time} />;
                    })}
                  </div>
                  <h3 className="time-title">
                    {afternoonTimeState.length !== 0 && "День"}
                  </h3>
                  <div className="time-container">
                    {afternoonTimeState?.map((time) => {
                      return <Time key={time} time={time} />;
                    })}
                  </div>
                  <h3 className="time-title">
                    {eveningTimeState.length !== 0 && "Вечер"}
                  </h3>
                  <div className="time-container">
                    {eveningTimeState?.map((time) => {
                      return <Time key={time} time={time} />;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          {isAdminActions && <SubmitBtn onClick={confirmClick} />}
        </div>
      </div>
    </AnimationPage>
  );
};

export default DateTime;
