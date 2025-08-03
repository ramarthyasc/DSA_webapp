class UserbaseData {
  constructor() {
    this.id = 0;
    this.userbaseData = {};
  }

  userList() {
    return this.userbaseData;
  }

  userCreate({ firstName, lastName, emailId }) {
    this.userbaseData[this.id] = {
      id: this.id,
      firstName,
      lastName,
      emailId
    }
    this.id++;
  }

  userUpdate(id, { firstName, lastName, emailId }) {
    this.userbaseData[id] = {
      id,
      firstName,
      lastName,
      emailId
    }
  }

  userDelete(id) {
    delete this.userbaseData[id];
  }

}


module.exports = new UserbaseData();
