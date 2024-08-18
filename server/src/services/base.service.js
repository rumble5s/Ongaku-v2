const connectToDatabase = require("../server");

class BaseServiceClass {
  constructor(name) {
    this.name = name;
  }

  async Create(newObject) {
    const database = await connectToDatabase();
    const Object = await database.db.collection(this.name).insertOne(newObject);
    return Object;
  }

  async Get(query, proj) {
    const database = await connectToDatabase();
    const listObject = await database.db
      .collection(this.name)
      .find(query)
      .project(proj)
      .toArray();
    return listObject;
  }

  async GetOne(ObjectId) {
    const database = await connectToDatabase();
    const Object = await database.db
      .collection(this.name)
      .findOne({ _id: new database.ObjectId(ObjectId) });
    return Object;
  }

  async Update(ObjectId, newState) {
    const database = await connectToDatabase();
    database.db
      .collection(this.name)
      .updateOne({ _id: new database.ObjectId(ObjectId) }, { $set: newState });
  }

  async Delete(ObjectId) {
    const database = await connectToDatabase();
    database.db
      .collection(this.name)
      .deleteOne({ _id: new database.ObjectId(ObjectId) });
  }
}

module.exports = BaseServiceClass;
