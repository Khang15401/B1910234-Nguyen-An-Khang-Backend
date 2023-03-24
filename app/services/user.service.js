const { ObjectId } = require("mongodb");
class UserService {
  constructor(client) {
    this.User = client.db().collection("users");
  }
  // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API

  extractUserData(payload) {
    const user = {
      userName: payload.userName,
      email: payload.email,
      password: payload.password,
      phone:payload.phone,
      isAdmin: payload.isAdmin
    };
    // Remove undefined fields
    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key]
    );
    return user;
  }

  async create(payload) {
    const user = this.extractUserData(payload);
    const result = await this.User.findOneAndUpdate(
      user,
      { $set: { isAdmin: user.isAdmin === true } },
      { returnDocument: "after", upsert: true }
      );
    return result.value;
  }

    async find(filter) {
      const cursor = await this.User.find(filter);
      return await cursor.toArray();
    }

    async findByName(name) {
      return await this.find({
        name: { $regex: new RegExp(name), $options: "i" },
      });
    }

    // async isAdmin() {
    //   return await this.find({ isAdmin: true });
    // }

    async findById(id) {
      return await this.User.findOne({
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
      });
    }

    async update(id, payload) {
      const filter = {
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
      };
      const update = this.extractUserData(payload);
      const result = await this.User.findOneAndUpdate(
        filter,
        { $set: update },
        { returnDocument: "after" }
      );
      return result.value;
    }

    async delete(id) {
      const result = await this.User.findOneAndDelete({
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
      });
      return result.value;
    }

    async login(payload) {
      const user = this.extractUserData(payload);
      return await this.User.findOne({
        userName: user.userName,
        password: user.password
      });
    }
}
module.exports = UserService;
