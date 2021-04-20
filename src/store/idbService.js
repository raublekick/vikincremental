import { openDB } from "idb";

const dbPromise = async () => {
  if (!("indexedDB" in window)) {
    throw new Error("Browser does not support IndexedDB");
  }

  const stores = ["vikings"];
  return await openDB("vikincrement", 1, {
    upgrade(db) {
      stores.forEach((table) => {
        console.log("Creating " + table);
        const store = db.createObjectStore(table, {
          // The 'id' property of the object will be the key.
          keyPath: "id",
          // If it isn't explicitly set, create a value by auto incrementing.
          autoIncrement: true,
        });
        // Create an index on the 'date' property of the objects.
        store.createIndex("name", "name");
      });
    },
  });
};

const getAll = async (storeName) => {
  try {
    const db = await dbPromise();
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);

    return store.getAll();
  } catch (error) {
    return error;
  }
};
const clear = async (storeName) => {
  try {
    const db = await dbPromise();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    store.clear();
    return tx.complete;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const save = async (storeName, items) => {
  try {
    const db = await dbPromise();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    return Promise.all(
      items.map((item) => {
        return store.put(item);
      })
    ).then(function () {
      return tx.complete;
    });

    //return tx.done.then(() => console.log("Completed"));
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default {
  getAll,
  clear,
  save,
};
