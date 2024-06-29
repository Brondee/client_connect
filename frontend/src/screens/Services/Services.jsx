import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import AddBtn from "../../components/ui/AddBtn/AddBtn";
import { useTelegram } from "../../hooks/useTelegram";
import Service from "../../components/shared/Service/Service";
import ArrowBack from "../../components/ui/ArrowBack/ArrowBack";

import "../../assets/styles/global.css";
import "./Services.css";
import AnimationPage from "../../components/shared/AnimationPage/AnimationPage";
import Loader from "../../components/ui/Loader/Loader";

const Services = () => {
  const [categories, setCategories] = useState(null);
  const [services, setServices] = useState(null);
  const [isBotPaid, setIsBotPaid] = useState("true");
  const [isLoading, setIsLoading] = useState(false);

  const reqUrl = process.env.REACT_APP_REQUEST_URL;

  const { isAdminActions } = useSelector((state) => state.admin);

  const navigate = useNavigate();

  const { tg, colorScheme } = useTelegram();
  if (isAdminActions) {
    tg.MainButton.hide();
  } else {
    tg.MainButton.onClick(() => {
      navigate("/specialists");
      tg.MainButton.hide();
    });
  }

  const getServices = useCallback(async () => {
    try {
      const response = await axios.get(`${reqUrl}services/all`);
      const data = response.data;
      const activeServices = data?.filter(
        (service) => service.isActive !== false
      );
      setServices(activeServices);
    } catch (error) {
      console.log(error.response);
    }
  }, [reqUrl]);
  const getCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${reqUrl}category/all`);
      const data = response.data;
      setCategories(data);
    } catch (error) {
      console.log(error.response);
    }
  }, [reqUrl]);

  const moveNext = () => {
    navigate("/specialists");
  };
  useEffect(() => {
    if (isAdminActions) setIsLoading(true);
  }, [isAdminActions]);
  useEffect(() => {
    setTimeout(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
      getCategories();
      getServices();
    }, 200);
    const getBotPaidInfo = async () => {
      try {
        const response = await axios.get(`${reqUrl}admin/info`);
        const data = response.data;
        setIsBotPaid(data.BotPaid);
      } catch (error) {
        console.log(error);
      }
    };
    getBotPaidInfo();
  }, [reqUrl, getCategories, getServices]);

  return (
    <AnimationPage>
      <div className="main-container">
        <div className="wrap">
          {isBotPaid === "true" ? (
            <div>
              <div className="arrow-title-container">
                {isAdminActions && <ArrowBack screenTitle="/admin" />}
                <h1
                  className={`main-title ${
                    colorScheme === "light" && "main-title-light"
                  }`}
                >
                  Выберите услугу
                </h1>
              </div>
              <div className="components-container">
                {isAdminActions && <AddBtn screenTitle={"/add"} />}
                {isLoading ? (
                  <Loader />
                ) : (
                  <div>
                    {categories?.map((category) => {
                      const { id, title } = category;
                      const curServices = services?.filter(
                        (service) => service.categoryId === id
                      );
                      return (
                        <div key={id}>
                          <h3
                            className={`category ${
                              colorScheme === "light" && "category-light"
                            }`}
                          >
                            {curServices?.length !== 0 && title}
                          </h3>
                          {curServices?.map((service) => {
                            const {
                              id,
                              title,
                              price,
                              time,
                              categoryId,
                              priceSecond,
                            } = service;
                            return (
                              <Service
                                key={id}
                                id={id}
                                title={title}
                                price={price}
                                priceSec={priceSecond}
                                time={time}
                                categoryId={categoryId}
                              />
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="move" onClick={moveNext}>
                <p>Continue</p>
              </div>
            </div>
          ) : (
            <div className="warning-container">
              <h3
                className={`warning-title ${
                  colorScheme === "light" && "warning-title-light"
                }`}
              >
                Бот временно недоступен
              </h3>
              <p
                className={`warning-text ${
                  colorScheme === "light" && "warning-text-light"
                }`}
              >
                скоро всё починим
              </p>
            </div>
          )}
        </div>
      </div>
    </AnimationPage>
  );
};

export default Services;
