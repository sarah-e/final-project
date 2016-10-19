import React, { Component } from 'react'
import _ from 'lodash'
import qs from 'query-string'
import createHistory from 'history/createBrowserHistory'
import db from '../../db'
import List from './List'
import fetchResults from './fetch'
// import Search from './Search'
import SearchResultRow from './SearchResultRow'
import renderResults from './render'
import '../../App.css';

let Lists = db.ref('lists')
let history = createHistory()

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

  addToList (result) {
    console.log(result);
    // this.setState({
    //   favouritePlace: id
    // })
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
    history.push({ search: `?list=${id}` })
  }

  goToHome(e) {
    e.preventDefault()
    history.push({ search: '' })
  }

  search() {
    let searchTerm = this.refs.searchKeyword
    console.log('in search function app.js ' + searchTerm.value);
    this.fetchData(searchTerm.value)
    console.log(this.state.sarchResults);
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

  removeItem(id,item) {
    console.log('Remove this ' + item);

  }

  renderHome() {

    return (
      <div className="App">
        <div className="row">
          <div className="col-sm-6 col-sm-offset-3">
            <h1>Search</h1>
            {/* <Search /> */}
            <div className="input-group">
              <input ref="searchKeyword" type="text" className="form-control" placeholder="Search for..." defaultValue="cafes in sydney"/>
              <span className="input-group-btn">
                <button onClick={() => this.search()} className="btn btn-default" type="button">Go!</button>
              </span>
            </div>

            <ul>
              {
                _.map(this.state.searchResults, (result, i) => {
                  return <SearchResultRow key={result.id} result={result} onClick={this.addToList} />
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
    )
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
                <button className="btn btn-default" onClick={() => this.addNewItem(id)} key={id} type="button">Add New Item</button>
              </span>
            </div>
            <ul>
              {
                _.map(list.items, item => {
                  return <li key={id}>{item.name} <a href="#" onClick={() => this.removeItem(id)} ><i className="fa fa-trash delete"></i></a></li>
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
