import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { useTelegram } from "../../hooks/useTelegram";
import ArrowBack from "../../components/ui/ArrowBack/ArrowBack";
import SpecialistAddForm from "../../components/shared/SpecialistAddForm/SpecialistAddForm";
import ServiceAddForm from "../../components/shared/ServiceAddForm/ServiceAddForm";
import CategoryForm from "../../components/shared/CategoryForm/CategoryForm";
import AnimationPage from "../../components/shared/AnimationPage/AnimationPage";

const Add = () => {
  const [arrowScreenTitle, setArrowScreenTitle] = useState("");
  const { curEditType } = useSelector((state) => state.admin);
  const { colorScheme } = useTelegram();

  useEffect(() => {
    if (curEditType === "specialists") {
      setArrowScreenTitle("/specialists");
    } else if (curEditType === "services") {
      setArrowScreenTitle("/");
    } else if (curEditType === "categories") {
      setArrowScreenTitle("/categories");
    }
  }, [curEditType]);

  return (
    <AnimationPage>
      <div className="main-container">
        <div className="wrap">
          <div className="arrow-title-container">
            <ArrowBack screenTitle={arrowScreenTitle} />
            <h1
              className={`main-title ${
                colorScheme === "light" && "main-title-light"
              }`}
            >
              Добавить
            </h1>
          </div>
          {curEditType === "specialists" && <SpecialistAddForm />}
          {curEditType === "services" && <ServiceAddForm />}
          {curEditType === "categories" && <CategoryForm />}
        </div>
      </div>
    </AnimationPage>
  );
};

export default Add;
