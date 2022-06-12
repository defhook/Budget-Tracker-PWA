//this will variable will hold the db connection
let db;

//open the database and set it to version 1
const request = indexedb.open("budget-tracker", 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function (e) {
  // save a reference to the database
  const db = e.target.result;
  // create an object store (table) called `new_transaction`, set it to have an auto incrementing primary key of sorts
  db.createObjectStore("new-budget-tracker", { autoIncrement: true });
};

// upon a successful request
request.onsuccess = function (e) {
  // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
  db = e.target.result;

  // check if app is online, if yes run uploadTransaction() function to send all local db data to api
  if (navigator.onLine) {
    uploadTransaction();
  }
};

// if there is an error this will print
request.onerror = function (e) {
  console.log(e.target.errorCode);
};

// This function will be executed if we attempt to submit a new transaction and there's no internet connection
function saveRecord(record) {
  // open a new transaction with the database with read and write permissions
  const transaction = db.transaction(["new-budget-tracker"], "readwrite");
  // access the object store for new_transaction
  const trackerObjectStore = transaction.objectStore("new-budget-tracker");
  // add record to your store with add method
  trackerObjectStore.add(record);
}

function uploadTransaction() {
  console.log("Upload Transaction Started");
  // open a transaction on your db
  const transaction = db.transaction(["new-budget-tracker"], "readwrite");
  // access your object store
  const trackerObjectStore = transaction.objectStore("new-budget-tracker");
  // get all records from store and set to a variable
  const getAll = trackerObjectStore.getAll();
  console.log("Get All pending records", getAll);
  // upon a successful .getAll() execution, run this function
  getAll.onsuccess = function () {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          console.log("server response", serverResponse);
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(
            ["new-budget-tracker"],
            "readwrite"
          );
          // access the new_transaction object store
          const trackerObjectStore =
            transaction.objectStore("new-budget-tracker");
          // clear all items in your store
          trackerObjectStore.clear();

          alert("All transactions has been submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

window.addEventListener('online', uploadTransaction);