const isPhoneNum = (inputtxt: String): Boolean => {
  const phoneNoRegex = /^\d{10}$/;

  return Boolean(inputtxt.match(phoneNoRegex));
};

export default isPhoneNum;
