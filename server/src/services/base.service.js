const server = require("../initServer");

class BaseServiceClass {
  constructor(name) {
    this.name = name;
  }

  async Create(newObject) {
    const Object = await server.mongo.db
      .collection(this.name)
      .insertOne(newObject);
    return Object;
  }

  async Get(opt) {
    const listObject = await server.mongo.db
      .collection(this.name)
      .find(opt)
      .toArray();
    return listObject;
  }

  async GetOne(ObjectId) {
    const Object = await server.mongo.db
      .collection(this.name)
      .findOne({ _id: new server.mongo.ObjectId(ObjectId) });
    return Object;
  }

  async Update(ObjectId, newState) {
    server.mongo.db
      .collection(this.name)
      .updateOne(
        { _id: new server.mongo.ObjectId(ObjectId) },
        { $set: newState },
      );
  }

  async Delete(ObjectId) {
    server.mongo.db
      .collection(this.name)
      .deleteOne({ _id: new server.mongo.ObjectId(ObjectId) });
  }
}

module.exports = BaseServiceClass;
