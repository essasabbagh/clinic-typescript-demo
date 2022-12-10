const isPhoneNum = (inputtxt: String): Boolean => {
  var phoneNoRegex = /^\d{10}$/;

  return inputtxt.match(phoneNoRegex) ? true : false;
};

export default isPhoneNum;
