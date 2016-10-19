import React, { Component } from 'react'
import config from './config'

export default class SearchResultRow extends Component {
  addToWishlist(e){
    e.preventDefault()
    this.props.onClick(this.props.result)
  }

  render() {
    let photoRef = this.props.result.photos && this.props.result.photos[0].photo_reference
    let urlString = `${config.PHOTOS_URL}&photoreference=${photoRef}&key=${config.GOOGLE_PLACES_API_KEY}`

    return (
      <div>
        { photoRef ? <img src={urlString} /> : null }
        <h3>{this.props.result.name}</h3>
        <p>{this.props.result.formatted_address}</p>
        <p>
          <a href="#" onClick={(e) => this.addToWishlist(e)}>
          <i className="glyphicon glyphicon-heart"></i></a>
        </p>
      </div>
    )
  }
}
