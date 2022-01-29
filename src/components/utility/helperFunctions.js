export const getCurrentDateString = function () {
  const dateObject = new Date();
  const dateString = `${dateObject.getDate()}-${
    dateObject.getMonth() + 1
  }-${dateObject.getFullYear()}`;

  return dateString;
};

export const getCurrentTimeString = function () {
  const dateObject = new Date();

  const timeString = `${
    dateObject.getHours() % 12 === 0 ? 12 : dateObject.getHours() % 12
  } : ${dateObject.getMinutes()} ${dateObject.getHours() >= 12 ? "PM" : "AM"}`;

  return timeString;
};
