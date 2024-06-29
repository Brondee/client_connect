import axios from "axios";

import { days, months } from "./calendarArrays";

export const sendOrder = async (
  name,
  telegram,
  telephone,
  comment,
  companyAddress,
  masterId,
  masterName,
  curSpecialistId,
  curTime,
  curDate,
  curWeekDay,
  curServiceIds,
  morningTime,
  afternoonTime,
  eveningTime,
  reqUrl
) => {
  let services = [];
  let servicesInfo = "";
  let totalPrice = 0;
  let totalSecondPrice = 0;
  let totalTime = 0;
  let orderId = null;

  let newMorningTime = [...morningTime];
  let newAfternoonTime = [...afternoonTime];
  let newEveningTime = [...eveningTime];

  const getServiceInfo = async () => {
    try {
      const response = await axios.get(`${reqUrl}services/${curServiceIds}`);
      services = response.data;
    } catch (error) {
      console.log(error.response);
    }
    services.map((service, index) => {
      const { title, price, time, secondPrice } = service;
      let hours = 0;
      let minutes = 0;
      const timeFirst = time.split(" ")[0];
      if (timeFirst.includes("ч")) {
        hours = Number(timeFirst.replace("ч", ""));
      } else if (timeFirst.includes("м")) {
        minutes = Number(timeFirst.replace("м", ""));
      }
      if (time.split(" ")[1]) {
        minutes = Number(time.split(" ")[1].replace("м", ""));
      }
      totalTime += hours * 60 + minutes;
      totalPrice += price;
      totalSecondPrice += secondPrice;
      if (services.length - 1 === index) {
        servicesInfo += title;
      } else {
        servicesInfo += title + ", ";
      }
      return service;
    });
  };

  const sendOrderToDb = async () => {
    await getServiceInfo();
    telegram = telegram.replace("@", "").trim();
    const orderData = {
      clientName: name,
      clientTelegram: telegram,
      clientTelephone: telephone,
      clientComment: comment,
      masterId,
      masterName,
      dateTime: `${curDate}, ${curTime}`,
      totalTime,
      servicesInfo,
      totalPrice: totalPrice,
      servicesCount: services.length,
    };
    try {
      const response = await axios.post(`${reqUrl}order/add`, orderData);
      const data = response.data;
      orderId = data.id;
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  await sendOrderToDb();

  const sendClientInfoToDb = async () => {
    const clientData = {
      name,
      telephoneNumber: telephone,
      telegramName: telegram,
    };
    try {
      const response = await axios.post(`${reqUrl}client/add`, clientData);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  await sendClientInfoToDb();

  const updateTimeDb = async () => {
    const repeatDisableTime = Math.ceil(totalTime / 30);
    if (morningTime.indexOf(curTime) !== -1) {
      for (let i = 0; i < repeatDisableTime; i++) {
        let index = morningTime.indexOf(curTime) + i;
        if (newMorningTime[index]) {
          if (!newMorningTime[index].includes("disabled")) {
            newMorningTime[index] = `disabled ${newMorningTime[index]}`;
          }
        }
        if (!newMorningTime[index]) {
          let newI = repeatDisableTime - i;
          for (let i = 0; i < newI; i++) {
            if (!newAfternoonTime[index].includes("disabled")) {
              newAfternoonTime[i] = `disabled ${newAfternoonTime[i]}`;
            }
          }
          break;
        }
      }
    } else if (afternoonTime.indexOf(curTime) !== -1) {
      for (let i = 0; i < repeatDisableTime; i++) {
        let index = afternoonTime.indexOf(curTime) + i;
        if (newAfternoonTime[index]) {
          if (!newAfternoonTime[index].includes("disabled")) {
            newAfternoonTime[index] = `disabled ${newAfternoonTime[index]}`;
          }
        }
        if (!newAfternoonTime[index]) {
          let newI = repeatDisableTime - i;
          for (let i = 0; i < newI; i++) {
            if (!newEveningTime[index].includes("disabled")) {
              newEveningTime[i] = `disabled ${newEveningTime[i]}`;
            }
          }
          break;
        }
      }
    } else if (eveningTime.indexOf(curTime) !== -1) {
      for (let i = 0; i < repeatDisableTime; i++) {
        let index = eveningTime.indexOf(curTime) + i;
        if (newEveningTime[index])
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
      await axios.patch(`${reqUrl}dates/editTime`, timeData);
    } catch (error) {
      console.log(error);
    }
  };
  await updateTimeDb();

  let totalPriceText = "";
  if (totalPrice === totalSecondPrice) {
    totalPriceText = String(totalPrice);
  } else {
    totalPriceText = String(totalPrice) + " - " + String(totalSecondPrice);
  }

  let message = `✅ Ваша заявка принята!\n
Дополнительного подтверджения по телефону не требуется!\n
📘 Мы ожидаем Вас:
🔹 Дата и время: ${curDate.slice(-2)} ${
    months[Number(curDate.slice(5, -3)) - 1]
  }, ${days[curWeekDay]}, в ${curTime}
🔹 Мастер: ${masterName}
🔹 Услуга(и): ${servicesInfo}
🔹 Адрес: ${companyAddress}\n
⭐️ Вы будете уведомлены о записи предварительно за 24 часа до визита!`;

  let adminMessage = `❇️ Новая заявка\n
🧍‍♂️ От: ${name}\n
✉️ Телеграм клиента: ${telegram}
📞 Телефон клиента: ${telephone}
💬 Комментарий: ${comment}\n
👨‍⚕️ Специалист: ${masterName}
🗓 Дата и время: ${curDate.slice(-2)} ${
    months[Number(curDate.slice(5, -3)) - 1]
  }, ${days[curWeekDay]}, в ${curTime}
🛠 Услуга(и): ${servicesInfo}
💵 Стоимость услуг: ${totalPriceText} ₽
`;
  return { message, adminMessage, orderId, totalTime };
};
