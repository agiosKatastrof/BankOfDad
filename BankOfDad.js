usersmap = {
  "cKM3ENqak9wenR75W" : {name: 'dad', admin: true},
  "gYzdjntuyqWHtGihL" : {name: 'Jet', admin: false},
  "hhy3c45Wei94pQ3iu" : {name: 'Elias', admin: false},
  "AJdvgWqhvGpwc4vri" : {name: 'Lorien', admin: false},
  "cdAq6ZMEfnB3H8TXS" : {name: 'Galadriel', admin: false}
}

usersmapRev = {
  'dad' : {id: "cKM3ENqak9wenR75W", admin: true},
  'Jet' : {id: "gYzdjntuyqWHtGihL", admin: false},
  'Elias' : {id: "hhy3c45Wei94pQ3iu", admin: false},
  'Lorien' : {id: "AJdvgWqhvGpwc4vri", admin: false},
  'Galadriel' : {id: "cdAq6ZMEfnB3H8TXS", admin: false}
}

Changes = new Mongo.Collection("changes");

function isAdmin(userId) {
  return usersmap[userId].admin;
}

Accounts.config({
  forbidClientAccountCreation: true
});

if (Meteor.isServer) {
  Meteor.publish("changes", function () {
    //console.log("userid: " + this.userId)
    isAdmin(this.userId);
    
    if (isAdmin(this.userId)) {
        return Changes.find();
    } else {
        return Changes.find({
          $or: [
            { owner: this.userId }
          ]
        });
    }

  });
}

if (Meteor.isClient) {
  // This code only runs on the client
  Meteor.subscribe("changes");
  

  Template.body.helpers({
    changes: function () {
      return Changes.find({}, {sort: {createdAt: -1}});
    },
    isAdmin: function () {
      return isAdmin(Meteor.userId());
    }
  });

  Template.body.events({
    "submit .new-change": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var amount = event.target.amount.value;
      var user = event.target.user.value;

      // Insert a change into the collection
      Meteor.call("addChange", amount, user);

      // Clear form
      event.target.amount.value = "";
    }
  });

  Template.change.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  });

  Template.change.events({
    "click .delete": function () {
      Meteor.call("deleteChange", this._id);
    }
  });
  
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
  
}

Meteor.methods({
  addChange: function (amount, user) {
    
    console.log("User: " + user + ", Amount: " + amount);
    
    // Make sure the user is logged in before inserting a change
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    
    if (isNaN(amount)){
      console.log(amount + " is not a number");
    } else {

      Changes.insert({
        amount: amount,
        createdAt: new Date(),
        owner: usersmapRev[user].id,
        username: user
      });
    }
  },
  deleteChange: function (changeId) {
    var change = Changes.findOne(changeId);
    
    if (!isAdmin(Meteor.userId())) {
      console.log(Meteor.user().username + " cannot delete")
      throw new Meteor.Error("not-authorized");
    }

    Changes.remove(changeId);
  }
});