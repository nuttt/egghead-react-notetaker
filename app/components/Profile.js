import React from 'react';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';
import helpers from '../utils/helpers')

import UserProfile from './Github/UserProfile';
import Repos from './Github/Repos';
import Notes from './Notes/Notes';

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      bio: {},
      repos: []
    };
  }

  init() {

    helpers.getGithubInfo(this.getParams().username)
      .then(function(dataObj){
        this.setState({
          bio: dataObj.bio,
          repos: dataObj.repos
        });
      }.bind(this));
  }

   handleAddNote(newNote) {
    var newNotes = this.state.notes.concat([newNote]);
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps() {
    this.init();
  }

  render() {

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
}

Profile.contextTypes = {
  router: React.PropTypes.func.isRequired;
}

export default profile;
