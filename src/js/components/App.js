import React, { Component } from 'react'
import _ from 'lodash'
import qs from 'query-string'
import createHistory from 'history/createBrowserHistory'
import db from '../../db'
import fetchResults from './fetch'
import SearchResultRow from './SearchResultRow'
import '../../App.css';

let Wishlist = db.ref('wishlists')
let history = createHistory()

class App extends Component {
  state = {
    searchResults: [],
    wishlist: {},
    selectedList:null
  }

  constructor(props) {
    super(props)
    this.state = {
      searchResults: null,
      wishlist: {}
    };
    this.addToList = this.addToList.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  componentDidMount() {
    Wishlist.on('value', snapshot => {
        this.setState({ wishlist: snapshot.val() ? snapshot.val() : {} })
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
    let wishlistEntry = {
      name:result.name,
      data:result
    }

    Wishlist.push(wishlistEntry)
  }

  goToList() {
    history.push({ search: `?list=wishlist` })
  }

  goToHome(e) {
    e.preventDefault()
    history.push({ search: '' })
  }

  search() {
    let searchTerm = this.refs.searchKeyword
    console.log('in search ' + searchTerm.value);
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

  removeItem(id,item) {
    Wishlist.child(id).remove();
  }

  renderHome() {

    return (
      <div className="App py-1">
        <div className="row">
          <div className="col-sm-8 offset-sm-2">
            <div className="mb-1"><a href="#" onClick={() => this.goToList()}>Wishlist</a> ({Object.keys(this.state.wishlist).length}) </div>
            <h1>Search</h1>
            <div className="input-group mb-3">
              <input ref="searchKeyword" type="text" className="form-control" placeholder="Search for..." defaultValue="cafes in sydney"/>
              <span className="input-group-btn">
                <button onClick={() => this.search()} className="btn btn-default" type="button">Go!</button>
              </span>
            </div>
            {
              _.map(this.state.searchResults, (result, i) => {
                return <SearchResultRow key={result.id} result={result} onClick={this.addToList} />
              })
            }
          </div>
        </div>
      </div>
    )
  }

  renderList() {
    let list = this.state.wishlist;
    return (
      <div className="App py-1">
        <div className="row">
          <div className="col-sm-8 offset-sm-2">
            <p><a href="/" onClick={(e) => this.goToHome(e)}>Go Home</a></p>
            <h1>Wishlist</h1>
            <ul>
              {
                _.map(list, (item, id) => {
                  console.log('renderList map id:'+id+":item:"+item)
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
