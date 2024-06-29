import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsAdminActions, setCurEditType } from "../../store/adminSlice";
import axios from "axios";

import "./Admin.css";
import "../../assets/styles/global.css";
import AnimationPage from "../../components/shared/AnimationPage/AnimationPage";
import { useTelegram } from "../../hooks/useTelegram";

const Admin = () => {
  const [isBotPaid, setIsBotPaid] = useState("true");

  const reqUrl = process.env.REACT_APP_REQUEST_URL;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { colorScheme, activateHaptic } = useTelegram();
  const onClick = (screenTitle, editType) => {
    activateHaptic("medium");
    dispatch(setIsAdminActions(true));
    dispatch(setCurEditType(editType));
    navigate(screenTitle);
  };

  useEffect(() => {
    const getBotPaidInfo = async () => {
      try {
        const response = await axios.get(`${reqUrl}admin/info`);
        const data = response.data;
        setIsBotPaid(data.BotPaid);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getBotPaidInfo();
  }, [reqUrl]);

  return (
    <AnimationPage>
      <div className="main-container">
        <div className="wrap">
          {isBotPaid === "true" ? (
            <div>
              <div className="arrow-title-container">
                <h1
                  className={`main-title ${
                    colorScheme === "light" && "main-title-light"
                  }`}
                >
                  Выберите раздел
                </h1>
              </div>
              <div className="sections-container">
                <div
                  className="section section-spec"
                  onClick={() => {
                    onClick("/specialists", "specialists");
                  }}
                >
                  <h3 className="section-title">Специалисты</h3>
                </div>
                <div
                  className="section section-services"
                  onClick={() => {
                    onClick("/", "services");
                  }}
                >
                  <h3 className="section-title">Услуги</h3>
                </div>
                <div
                  className="section section-categories"
                  onClick={() => {
                    onClick("/categories", "categories");
                  }}
                >
                  <h3 className="section-title">Категории</h3>
                </div>
                <div
                  className="section section-time"
                  onClick={() => {
                    onClick("/specialists", "datetime");
                  }}
                >
                  <h3 className="section-title">Время</h3>
                </div>
                <div
                  className="section section-orders"
                  onClick={() => {
                    onClick("/orders", "orders");
                  }}
                >
                  <h3 className="section-title">Записи</h3>
                </div>
                <div
                  className="section section-general"
                  onClick={() => {
                    onClick("/general", "general");
                  }}
                >
                  <h3 className="section-title">Общие</h3>
                </div>
              </div>
            </div>
          ) : (
            <div className="warning-container warning-admin">
              <h3
                className={`warning-title ${
                  colorScheme === "light" && "warning-title-light"
                }`}
              >
                Подписка на бота не оплачена
              </h3>
              <p
                className={`warning-text ${
                  colorScheme === "light" && "warning-text-light"
                }`}
              >
                можете оплатить подписку через телеграм
              </p>
            </div>
          )}
        </div>
      </div>
    </AnimationPage>
  );
};

export default Admin;
