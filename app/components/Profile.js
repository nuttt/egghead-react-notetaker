var React = require('react');
var Router = require('react-router');
var Firebase = require('firebase');
var ReactFireMixin = require('reactfire');
var helpers = require('../utils/helpers')

var UserProfile = require('./Github/UserProfile');
var Repos = require('./Github/Repos');
var Notes = require('./Notes/Notes');

var Profile = React.createClass({

  mixins: [Router.State, ReactFireMixin],

  getInitialState: function() {
    return {
      notes: [],
      bio: {},
      repos: []
    }
  },

  handleAddNote: function(newNote) {
    var newNotes = this.state.notes.concat([newNote]);
    this.ref.child(this.getParams().username).set(newNotes);
  },

  init: function() {
    var childRef = this.ref.child(this.getParams().username);
    this.bindAsArray(childRef, 'notes');

    helpers.getGithubInfo(this.getParams().username)
      .then(function(dataObj){
        this.setState({
          bio: dataObj.bio,
          repos: dataObj.repos
        });
      }.bind(this));
  },

  componentDidMount: function() {
    this.ref = new Firebase("https://nuttt-notetaker.firebaseio.com/");
    this.init();
  },

  componentWillUnmount: function() {
    this.unbind('notes');
  },

  componentWillReceiveProps: function() {
    this.unbind('notes');
    this.init();
  },

  render: function() {

    var username = this.getParams().username;

    return (
      <div className="row">
        <div className="col-md-4">
          <UserProfile username={username} bio={this.state.bio}/>
        </div>
        <div className="col-md-4">
          <Repos username={username} repos={this.state.repos}/>
        </div>
        <div className="col-md-4">
          <Notes username={username} notes={this.state.notes} addNote={this.handleAddNote}/>
        </div>
      </div>
    );
  }
});

module.exports = Profile;
