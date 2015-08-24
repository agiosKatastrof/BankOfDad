dad = {name: 'dad', id: "cKM3ENqak9wenR75W"}
Changes = new Mongo.Collection("changes");

if (Meteor.isServer) {
  Meteor.publish("changes", function () {
    //console.log("userid: " + this.userId)
    if (this.userId == dad.id) {
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
      return Meteor.userId() === dad.id;
    }
  });

  Template.body.events({
    "submit .new-change": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var amount = event.target.amount.value;

      // Insert a change into the collection
      Meteor.call("addTask", amount);

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
      Meteor.call("deleteTask", this._id);
    }
  });
  
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  addTask: function (amount) {
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
        owner: Meteor.userId(),
        username: Meteor.user().username
      });
    }
  },
  deleteTask: function (changeId) {
    var change = Changes.findOne(changeId);
    
    if (Meteor.user().username !== dad.name ) {
      console.log(Meteor.user().username + " cannot delete")
      throw new Meteor.Error("not-authorized");
    }

    Changes.remove(changeId);
  }
});