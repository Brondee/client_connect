import React from "react";

import "./OrderInfoBlock.css";

const OrderInfoBlock = ({
  clientTelegram,
  clientTelephone,
  clientComment,
  masterName,
  dateTime,
  servicesInfo,
  totalPrice,
}) => {
  return (
    <div className="order-info-block">
      <ul className="orderInfo-list">
        <li>
          <p className="client-label">
            Телеграм клиента:{" "}
            <span className="client-info">{clientTelegram}</span>
          </p>
        </li>
        <li>
          <p className="client-label">
            Телефон клиента:{" "}
            <span className="client-info">{clientTelephone}</span>
          </p>
        </li>
        <li>
          <p className="client-label">
            Комментарий: <span className="client-info">{clientComment}</span>
          </p>
        </li>
        <li className="master-li">
          <p className="client-label">
            Мастер: <span className="client-info">{masterName}</span>
          </p>
        </li>
        <li>
          <p className="client-label">
            Дата и время: <span className="client-info">{dateTime}</span>
          </p>
        </li>
        <li>
          <p className="client-label">
            Услуга(и): <span className="client-info">{servicesInfo}</span>
          </p>
        </li>
        <li>
          <p className="client-label">
            Стоимость услуг: <span className="client-info">{totalPrice}</span>
          </p>
        </li>
      </ul>
    </div>
  );
};

export default OrderInfoBlock;
