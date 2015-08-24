Tasks = new Mongo.Collection("changes");

if (Meteor.isServer) {
  // Only publish changes that belong to the current user
  Meteor.publish("changes", function () {
    return Tasks.find({
      $or: [
        { owner: this.userId }
      ]
    });
  });
}

if (Meteor.isClient) {
  // This code only runs on the client
  Meteor.subscribe("changes");

  Template.body.helpers({
    changes: function () {
      return Tasks.find({}, {sort: {createdAt: -1}});
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

    Tasks.insert({
      amount: amount,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTask: function (changeId) {
    var change = Tasks.findOne(changeId);
    
    if (Meteor.user().username !== 'dad' ) {
      console.log(Meteor.user().username + " cannot delete")
      throw new Meteor.Error("not-authorized");
    }

    Tasks.remove(changeId);
  }
});