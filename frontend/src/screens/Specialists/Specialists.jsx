import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import Specialist from "../../components/shared/Specialist/Specialist";
import ArrowBack from "../../components/ui/ArrowBack/ArrowBack";
import { useTelegram } from "../../hooks/useTelegram";

import "../../assets/styles/global.css";
import "./Specialists.css";
import AddBtn from "../../components/ui/AddBtn/AddBtn";
import AnimationPage from "../../components/shared/AnimationPage/AnimationPage";
import Loader from "../../components/ui/Loader/Loader";

const Specialists = () => {
  const [specialists, setSpecialists] = useState([]);
  const [isAddBtnShown, setIsAddBtnShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isAdminActions, curEditType, curCategoryIds } = useSelector(
    (state) => state.admin
  );
  const reqUrl = process.env.REACT_APP_REQUEST_URL;

  const { tg, colorScheme } = useTelegram();
  tg.MainButton.hide();

  useEffect(() => {
    setIsLoading(true);
  }, []);
  useEffect(() => {
    const getSpecialists = async (categoryIds) => {
      try {
        if (isAdminActions) {
          const response = await axios.get(`${reqUrl}specialist/all`);
          const data = response.data;
          setSpecialists(data);
        } else {
          const response = await axios.get(
            `${reqUrl}specialist/all/${categoryIds}`
          );
          let data = response.data;
          data = data.filter((specialist) => specialist !== null);
          setSpecialists(data);
        }
      } catch (error) {
        console.log(error.response);
      }
    };
    setTimeout(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
      getSpecialists(curCategoryIds);
    }, 200);
    if (curEditType === "datetime") {
      setIsAddBtnShown(false);
    } else if (isAdminActions) {
      setIsAddBtnShown(true);
    }
  }, [curCategoryIds, curEditType, isAdminActions, reqUrl]);

  return (
    <AnimationPage>
      <div className="main-container">
        <div className="wrap">
          <div className="arrow-title-container">
            <ArrowBack screenTitle={isAdminActions ? "/admin" : "/"} />
            <h1
              className={`main-title ${
                colorScheme === "light" && "main-title-light"
              }`}
            >
              Выберите специалиста
            </h1>
          </div>
          <div className="components-container">
            {isAddBtnShown && <AddBtn screenTitle={"/add"} />}
            {isLoading ? (
              <Loader />
            ) : (
              <div>
                {specialists.length > 0 ? (
                  specialists?.map((person) => {
                    const {
                      id,
                      name,
                      qualification,
                      photoUrl,
                      timeTable,
                      beginingDate,
                    } = person;
                    return (
                      <Specialist
                        key={id}
                        id={id}
                        name={name}
                        qualification={qualification}
                        photo={photoUrl}
                        beginDate={beginingDate}
                        timeTable={timeTable}
                      />
                    );
                  })
                ) : (
                  <div>
                    <h3 className="error-message">
                      Выбранные услуги не может выполнить ни один специалист
                    </h3>
                    <h3 className="error-message error-smaller">
                      попробуйте изменить выбранные вами услуги
                    </h3>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimationPage>
  );
};

export default Specialists;
