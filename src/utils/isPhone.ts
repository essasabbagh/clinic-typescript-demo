const isPhoneNum = (inputtxt: String): Boolean => {
  var phoneNoRegex = /^\d{10}$/;

  return Boolean(inputtxt.match(phoneNoRegex));
};

export default isPhoneNum;
