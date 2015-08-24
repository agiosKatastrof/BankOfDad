Tasks = new Mongo.Collection("changes");

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish changes that are public or belong to the current user
  Meteor.publish("changes", function () {
    return Tasks.find({
      $or: [
        { private: {$ne: true} },
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
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
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
    },
    "click .toggle-private": function () {
      Meteor.call("setPrivate", this._id, ! this.private);
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
    if (change.private && change.owner !== Meteor.userId()) {
      // If the change is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }

    Tasks.remove(changeId);
  },
  setPrivate: function (changeId, setToPrivate) {
    var change = Tasks.findOne(changeId);

    // Make sure only the change owner can make a change private
    if (change.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(changeId, { $set: { private: setToPrivate } });
  }
});