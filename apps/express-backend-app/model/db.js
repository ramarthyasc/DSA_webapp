// Contains all the queries.
class UserStorage {
  constructor() {
    this.id = 0;
    this.userDb = {};
  }
  listUser() {
    return this.userDb;
  }
  addUser({ emailId, password }) {
    const id = this.id;
    this.userDb[id] = { id, emailId, password };
    this.id++;
  }
}

// singleton design pattern
module.exports = new UserStorage();
