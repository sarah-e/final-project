import React, { Component } from 'react'
import _ from 'lodash'
import qs from 'query-string'
import createHistory from 'history/createBrowserHistory'
import db from '../../db'
import List from './List'
import fetchResults from './fetch'
import {renderResults} from './render'
import '../../App.css';

let Lists = db.ref('lists')
let history = createHistory()

let state = {
  searchResults: []
}

const searchResultsTest = [
  { name: 'Cafe name 1', address: '1 Station Street'},
  { name: 'Cafe 2', address: '2 Station Street'},
  { name: 'Cafe 3', address: '3 Station Street'},
  { name: 'Cafe 4', address: '4 Station Street'},
]




class SearchResultRow extends Component {
  render() {
    return (
      <div>
        <h3>{this.props.result.name}</h3>
        <p>{this.props.result.formatted_address}</p>
      </div>
    )
  }
}

class App extends Component {
  state = {
    searchResults: [],
    lists: {},
    selectedList: null
  }

  constructor(props) {
    super(props)
    this.state = {
      searchResults: null,
    };
  }

  componentDidMount() {
    Lists.on('value', snapshot => {
      this.setState({
        lists: snapshot.val()
      })
    })

    history.listen(location => {
      let query = qs.parse(location.search)
      this.setState({
        selectedList: query.list
      })
    })

    let query = qs.parse(window.location.search)
    this.setState({
      selectedList: query.list
    })
  }

  addNewList() {
    let newListName = this.refs.newListName

    Lists.push({
      name: newListName.value,
      items: []
    })

    newListName.value = ''
  }

  addNewItem(id) {
    let newItemName = this.refs.newItemName

    Lists.child(id).child('items').push({
      name: newItemName.value
    })

    newItemName.value = ''
  }

  goToList(id) {
    history.push(`/?list=${id}`)
  }

  goToHome(e) {
    e.preventDefault()
    history.push('/')
  }

  search() {
    let searchTerm = this.refs.searchKeyword
    console.log('in search function ' + searchTerm.value);
    this.fetchData(searchTerm.value)
  }

  fetchData(keyword) {
    fetchResults(keyword)
    .then(data => {
      this.setState({
        searchResults: data
      })
    })
    .catch(err => {
      alert('Cannot load')
      console.log('Something went wrong', err)
    })
  }

  renderHome() {

    return (
      <div className="App">
        <div className="row">
          <div className="col-sm-6 col-sm-offset-3">
            <h1>Search</h1>
            <div className="input-group">
              <input ref="searchKeyword" type="text" className="form-control" placeholder="Search for..." />
              <span className="input-group-btn">
                <button onClick={() => this.search()} className="btn btn-default" type="button">Go!</button>
              </span>
            </div>

            <ul>
              {
                _.map(this.state.searchResults, (result, i) => {
                  return <SearchResultRow key={result.id} result={result} />
                })
              }
            </ul>

            <List />

          </div>
        </div>


        <div className="row">
          <div className="col-sm-6 col-sm-offset-3">
            <h3>List Name</h3>
            <div className="input-group">
              <input ref="newListName" type="text" className="form-control" />
              <span className="input-group-btn">
                <button className="btn btn-default" onClick={() => this.addNewList()} type="button">Add New List</button>
              </span>
            </div>
            <ul className="">
              {
                _.map(this.state.lists, (list, id) => {
                  return <li onClick={() => this.goToList(id)} key={id}><a href="#">{list.name}</a></li>
                })
              }
            </ul>
          </div>
        </div>

      </div>
    );
  }

  removeItem(item) {
    console.log('Remove this ' + this.item);
  }

  renderList() {
    let id = this.state.selectedList
    let list = this.state.lists[id]

    return (
      <div className="App">

        <div className="row">
          <div className="col-sm-6 col-sm-offset-3">
            <a href="/" onClick={(e) => this.goToHome(e)}>Go Home</a>
            <h1>{list.name}</h1>
            <h3>New Item:</h3>
            <div className="input-group">
              <input ref="newItemName" type="text" className="form-control" />
              <span className="input-group-btn">
                <button className="btn btn-default" onClick={() => this.addNewItem(id)} type="button">Add New Item</button>
              </span>
            </div>
            <ul>
              {
                _.map(list.items, item => {
                  return <li>{item.name} <a href="#" onClick={() => this.removeItem(id)}><i className="fa fa-trash delete"></i></a></li>
                })
              }
            </ul>
          </div>
        </div>

      </div>
    )
  }

  render() {
    if (this.state.selectedList) {
      return this.renderList()
    }
    return this.renderHome()
  }


}

export default App;
