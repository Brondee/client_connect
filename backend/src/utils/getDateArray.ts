export const getDateArray = (start: string, timetable: string) => {
  let today = new Date();
  let endDate = new Date();
  endDate.setDate(endDate.getDate() + 29);

  const workingDays = Number(timetable.split('/')[0]);
  const notWorkingDays = Number(timetable.split('/')[1]);

  let arr = [];
  let dt = new Date();
  let startDate = new Date(start);
  let idx = 0;
  let workingCounter = 0;
  let notWorkingCounter = 0;

  while (dt <= endDate) {
    let isWorking = false;

    if (Date.parse(String(dt)) < Date.parse(String(startDate))) {
      isWorking = false;
    } else if (workingCounter < workingDays) {
      isWorking = true;
      workingCounter += 1;
    } else if (notWorkingCounter < notWorkingDays) {
      notWorkingCounter += 1;
    } else if (notWorkingCounter >= notWorkingDays) {
      isWorking = true;
      workingCounter = 1;
      notWorkingCounter = 0;
    }

    if (Date.parse(String(dt)) < Date.parse(String(today))) {
      arr.push(null);
      dt.setDate(dt.getDate() + 1);
      idx += 1;
    } else {
      const year = dt.getFullYear();
      const month = String(dt.getMonth() + 1).padStart(2, '0');
      const day = String(dt.getDate()).padStart(2, '0');
      const fullDate = year + '-' + month + '-' + day;
      const weekDay = dt.getDay();

      // console.log(isWorking, fullDate);

      let date = {
        id: idx,
        date: dt.getDate(),
        fullDate,
        weekDay,
        isWorking,
      };
      arr.push(date);
      dt.setDate(dt.getDate() + 1);
      idx += 1;
    }
  }
  const filteredArray = arr.filter((date) => date !== null);
  return filteredArray;
};
