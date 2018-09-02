import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';
import RepoDisp from './components/RepoDisp.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: []
    };
  }
  componentDidMount() {
    GetFromServer(response => {
      this.setState({ repos: response });
    });
  }

  search(term) {
    console.log(`${term} was searched`);
    postToServer({ id: term }, response => {
      this.setState({ repos: response });
    });
  }

  render() {
    // NOTE: if the state reads that the current repo is empty, it will make get request to the server - which then talks to MongoDB.
    return (
      <div>
        <h1>Github Fetcher</h1>
        <RepoList repos={this.state.repos} />
        <Search onSearch={this.search.bind(this)} />
        <div>
          {this.state.repos.map((repo, idx) => {
            if (idx < 25) {
              return <RepoDisp repo={repo} />;
            }
          })}
        </div>
      </div>
    );
  }
}

let postToServer = (obj, callback) => {
  console.log(JSON.stringify(obj));
  $.ajax({
    url: `http://127.0.0.1:1128/repos`,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(obj),
    success: function(data) {
      callback(data);
    },
    error: function(error) {
      console.log('Post not Working');
      console.error(error);
    }
  });
};

let GetFromServer = callback => {
  $.ajax({
    url: `http://127.0.0.1:1128/repos`,
    type: 'GET',
    success: function(data) {
      callback(data);
    },
    error: function(error) {
      console.log(error);
    }
  });
};

ReactDOM.render(<App />, document.getElementById('app'));
