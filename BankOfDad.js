usersmap = {
  "cKM3ENqak9wenR75W" : {name: 'dad', admin: true},
  "gYzdjntuyqWHtGihL" : {name: 'Jet', admin: false},
  "hhy3c45Wei94pQ3iu" : {name: 'Elias', admin: false},
  "AJdvgWqhvGpwc4vri" : {name: 'Lorien', admin: false},
  "cdAq6ZMEfnB3H8TXS" : {name: 'Galadriel', admin: false}
}

Transactions = new Mongo.Collection("transactions");

function isAdmin(userId) {
  ///usersmap = JSON.parse(Assets.getText("usersmap.json"));
  return usersmap[userId].admin;
}

Accounts.config({
  forbidClientAccountCreation: true
});

if (Meteor.isServer) {
      
  Meteor.publish("transactions", function () {
    
    if (isAdmin(this.userId)) {
        return Transactions.find();
    } else {
        return Transactions.find({
          $or: [
            { owner: this.userId }
          ]
        });
    }

  });
}

if (Meteor.isClient) {
  // This code only runs on the client
  Meteor.subscribe("transactions");
  
  Template.body.helpers({
    transactions: function () {
      return Transactions.find({}, {sort: {createdAt: -1}});
    },
    sumTransactions: function () {
      var cursor = Transactions.find({});
      sum = 0;
      cursor.forEach(function(transaction){
        sum += transaction.amount;
      });
      return sum.toFixed(2);
    },
    sumTransactionsEachUser: function (sumUser) {
      var cursor = Transactions.find({});
      var totalSum = {};
      cursor.forEach(function(transaction){
        if (totalSum[transaction.username]) {
          totalSum[transaction.username] += transaction.amount;
        } else {
          totalSum[transaction.username] = transaction.amount;
        }      
      });
      console.log(totalSum);
      var totalSumArray = [];
      
      for (var u in totalSum) {
        totalSumArray.push({name:u, total:totalSum[u]})
      }
      return totalSumArray;
    },
    isAdmin: function () {
      return isAdmin(Meteor.userId());
    }
  });

  Template.body.events({
    "submit .new-transaction": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var amount = event.target.amount.value;
      var user = event.target.user.value;

      // Insert a transaction into the collection
      Meteor.call("addTransaction", amount, user);

      // Clear form
      event.target.amount.value = "";
    }
  });

  Template.transaction.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    },
    isAdmin: function () {
      return isAdmin(Meteor.userId());
    }
  });

  Template.transaction.events({
    "click .delete": function () {
      Meteor.call("deleteTransaction", this._id);
    }
  });
  
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
  
}

Meteor.methods({
  addTransaction: function (amount, user) {
    
  usersmapRev = JSON.parse(Assets.getText("usersmapRev.json"));

    console.log("User: " + user + ", Amount: " + amount);
    
    // Make sure the user is logged in before inserting a transaction
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    
    if (isNaN(amount)){
      throw new Meteor.Error(amount + " is not a number");
    } else {

      Transactions.insert({
        amount: Number(amount),
        createdAt: new Date(),
        owner: usersmapRev[user].id,
        username: user,
        type: "std"
      });
    }
  },
  deleteTransaction: function (transactionId) {
    var transaction = Transactions.findOne(transactionId);
    
    if (!isAdmin(Meteor.userId())) {
      console.log(Meteor.user().username + " cannot delete")
      throw new Meteor.Error("not-authorized");
    }

    Transactions.remove(transactionId);
  }
});