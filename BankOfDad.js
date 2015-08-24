dad = {name: 'dad', id: "cKM3ENqak9wenR75W"}

usersmap = {"cKM3ENqak9wenR75W" : {name: 'dad', admin: true}}

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
    },
    isAdmin: function () {
      return this.owner === dad.id;
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

    console.log(Meteor.userId() + Meteor.user().username)
      Changes.insert({
        amount: amount,
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: user
      });
    }
  },
  deleteChange: function (changeId) {
    var change = Changes.findOne(changeId);
    
    if (Meteor.user().username !== dad.name ) {
      console.log(Meteor.user().username + " cannot delete")
      throw new Meteor.Error("not-authorized");
    }

    Changes.remove(changeId);
  }
});