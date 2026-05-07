export default class User {
  constructor(data) {
    this._id = data._id;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
  }
}

