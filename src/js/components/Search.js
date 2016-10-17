import React, { Component } from 'react'

export default class Search extends Component {

  let fetchData = function(keyword) {
    let mapsUrl = "https://accesscontrolalloworiginall.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json"
    let apiKey = "AIzaSyCpBHSOQ4xgrIIDV20k64DYb87adZ5VpSA"

    let url = `${mapsUrl}?query=${keyword}&key=${apiKey}`
    console.log(url);
    let parse = x => x

    fetch(url)
    .then(response => response.json())
    .then(parse)
    .then(data => {
      console.log(data)
      let restaurant = data.results[0].name
      console.log(restaurant);
    })
    .then((data) => {
      let resultList = []
      state.searchResults.forEach(stuff => {
        resultList.push(stuff.results.name)
        console.log(resultList)
        console.log('1111');
      })
      console.log('2222');

    })
    .catch(err => console.log(err))
  }

  search() {
    let searchTerm = this.refs.searchKeyword
    console.log('in search function ' + searchTerm.value);
    fetchData(searchTerm.value)
  }

  render() {
    return (
      <div className="input-group">
        <input ref="searchKeyword" type="text" className="form-control" placeholder="Search for..." />
        <span className="input-group-btn">
          <button onClick={() => this.search()} className="btn btn-default" type="button">Go!</button>
        </span>
      </div>
    )
  }
}

export default Search;
