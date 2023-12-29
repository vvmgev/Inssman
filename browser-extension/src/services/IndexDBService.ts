import { openDB } from "idb";

class IndexDBService {
  private dbPromise;
  private dbName = "record";
  constructor() {
    this.openConnection();
  }

  async openConnection() {
    this.dbPromise = await openDB("Record", 1, {
      upgrade: (db) => {
        db.createObjectStore("record", {
          keyPath: "id",
          autoIncrement: true,
        });
      },
    });
  }

  async getLastItem() {
    const db = await this.dbPromise;
    const transaction = db.transaction("record", "readonly");
    const objectStore = transaction.objectStore("record");
    const cursorRequest = objectStore.openCursor(null, "prev");
    const result = await cursorRequest;
    return result.value;
  }

  async get(id) {
    return (await this.dbPromise).get(this.dbName, Number(id));
  }

  async add(data) {
    return (await this.dbPromise).add(this.dbName, data);
  }

  async put(data) {
    return (await this.dbPromise).put(this.dbName, data);
  }

  async remove(id) {
    return (await this.dbPromise).delete(this.dbName, id);
  }

  async clear() {
    return (await this.dbPromise).clear(this.dbName);
  }

  async getAll() {
    return (await this.dbPromise).getAll(this.dbName);
  }
}

export default new IndexDBService();
