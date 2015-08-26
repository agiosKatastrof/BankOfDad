Transactions = new Mongo.Collection("transactions");

function checkAdmin(userId) {
  usersmap = JSON.parse(Assets.getText("usersmap.json"));
  return usersmap[userId].admin;
}

Accounts.config({
  forbidClientAccountCreation: true
});

if (Meteor.isServer) {
  
  Meteor.startup(function () {
    Meteor.methods({
      isAdmin: function (userId) {
        usersmap = JSON.parse(Assets.getText("usersmap.json"));
        val =  usersmap[userId].admin;
        console.log("UserId: " + userId + " val: " + val);
        return val;
      }
    });      
  });
      
  Meteor.publish("transactions", function () {       
    if (checkAdmin(this.userId)) {
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
        totalSumArray.push({name:u, total:totalSum[u].toFixed(2)})
      }
      return totalSumArray;
    },
    'showSumsForAdmin': function () {
		Meteor.call('isAdmin', Meteor.userId(), function(err,response) {
			if(err) {
				Session.set('serverDataResponse', "Error:" + err.reason);
				return;
			}
            console.log(Meteor.userId() + " admin?: " + response);
			Session.set('serverDataResponse', response);
		});
        return Session.get('serverDataResponse') || "";
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
    'showTransForAdmin': function () {
		Meteor.call('isAdmin', Meteor.userId(), function(err,response) {
			if(err) {
				Session.set('serverDataResponse', "Error:" + err.reason);
				return;
			}
            console.log(Meteor.userId() + " admin?: " + response);
			Session.set('serverDataResponse', response);
		});
        return Session.get('serverDataResponse') || "";
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
    Transactions.remove(transactionId);
  }
});