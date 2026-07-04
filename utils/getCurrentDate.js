const getCurrentDate = () => {
  // const today = new Date();
  // const day = today.getDate().toString().length < 2 ? "0" + today.getDate() : today.getDate();
  // var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + day;
  // const minutes =
  //   today.getMinutes().toString().length < 2 ? "0" + today.getMinutes() : today.getMinutes();
  // const seconds =
  //   today.getSeconds().toString().length < 2 ? "0" + today.getSeconds() : today.getSeconds();
  // date = date + "T" + today.getHours() + ":" + minutes + ":" + seconds + "+01:00";
  // return date;
  return new Date().toISOString();
};

export default getCurrentDate;
