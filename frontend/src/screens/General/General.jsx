import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import AnimationPage from "../../components/shared/AnimationPage/AnimationPage";
import FormInput from "../../components/ui/FormInput/FormInput";
import { useTelegram } from "../../hooks/useTelegram";
import ArrowBack from "../../components/ui/ArrowBack/ArrowBack";
import SubmitBtn from "../../components/shared/SubmitBtn/SubmitBtn";
import "./General.css";

const General = () => {
  const [telephone, setTelephone] = useState("");
  const [address, setAddress] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [telephoneError, setTelephoneError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [companyDescriptionError, setCompanyDescriptionError] = useState(false);

  const { colorScheme } = useTelegram();
  const navigate = useNavigate();
  const reqUrl = process.env.REACT_APP_REQUEST_URL;

  const onChangeTelephone = (e) => {
    setTelephone(e.target.value);
  };
  const onChangeAdress = (e) => {
    setAddress(e.target.value);
  };
  const onChangeCompanyDesc = (e) => {
    setCompanyDescription(e.target.value);
  };

  const confirmClick = async () => {
    if (
      telephone.length === 0 &&
      address.length === 0 &&
      companyDescription.length === 0
    ) {
      setTelephoneError(true);
      setAddressError(true);
      setCompanyDescriptionError(true);
    } else if (telephone.length === 0) {
      setCompanyDescriptionError(false);
      setAddressError(false);
      setTelephoneError(true);
    } else if (address.length === 0) {
      setCompanyDescriptionError(false);
      setTelephoneError(false);
      setAddressError(true);
    } else if (companyDescription.length === 0) {
      setTelephoneError(false);
      setAddressError(false);
      setCompanyDescriptionError(true);
    } else {
      const data = {
        companyTelephone: telephone,
        companyAddress: address,
        companyDescription: companyDescription,
      };
      try {
        await axios.patch(`${reqUrl}general/edit`, data);
        navigate("/admin");
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    const getGeneralInfo = async () => {
      try {
        const response = await axios.get(`${reqUrl}general/info`);
        const { companyAddress, companyTelephone, companyDescription } =
          response.data;
        setTelephone(companyTelephone);
        setAddress(companyAddress);
        setCompanyDescription(companyDescription);
      } catch (err) {
        console.log(err);
      }
    };
    getGeneralInfo();
  }, [reqUrl]);

  return (
    <AnimationPage>
      <div className="main-container">
        <div className="wrap">
          <div className="arrow-title-container">
            <ArrowBack screenTitle={"/admin"} />
            <h1
              className={`main-title ${
                colorScheme === "light" && "main-title-light"
              }`}
            >
              Редактирование
            </h1>
          </div>
          <form>
            <FormInput
              labelTitle="Телефон салона"
              inputValue={telephone}
              onChangeFunc={onChangeTelephone}
              placeholder="введите номер телефона"
              isError={telephoneError}
            />
            <FormInput
              labelTitle="Адрес салона"
              inputValue={address}
              onChangeFunc={onChangeAdress}
              placeholder="введите адрес салона"
              isError={addressError}
            />
            <label
              htmlFor="description"
              className={`form-label ${
                companyDescriptionError && "form-label-error"
              } ${colorScheme === "light" && "form-label-light"}`}
            >
              Краткое описание
            </label>
            <textarea
              name="description"
              id="description"
              defaultValue={companyDescription}
              placeholder="Введите описание компании"
              onChange={onChangeCompanyDesc}
              className={`form-input form-area ${
                companyDescriptionError && "form-input-error"
              } ${colorScheme === "light" && "form-input-light"}`}
            ></textarea>
            <SubmitBtn onClick={confirmClick} />
          </form>
        </div>
      </div>
    </AnimationPage>
  );
};

export default General;
