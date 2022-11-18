class userClass {
  uId;
  fName;
  lName;
  email;
  password;
  address;
  gender;
  age;
  country;

  constructor(
    uId,
    fName,
    lName,
    email,
    password,
    address,
    gender,
    age,
    country
  ) {
    this.uId = uId;
    this.fName = fName;
    this.lName = lName;
    this.email = email;
    this.password = password;
    this.address = address;
    this.gender = gender;
    this.age = age;
    this.country = country;
  }
}

export default userClass;