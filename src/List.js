import React, { Component } from 'react';
import Geocode from 'react-geocode';
import escapeRegExp from 'escape-string-regexp';

Geocode.setApiKey('AIzaSyDZjWgYbpJt5dvhPJ8EdtQLLo79gMqfc98');

class List extends Component {
  state = {
    places: [],
    query: ''
  }
  getFilteredPlaces() {
    const { query, places } = this.state;
    if (!query) {
      return places;
    }
    const match = new RegExp(escapeRegExp(query), 'i');
    return places.filter(p => match.test(p.name));
  }
  componentDidMount() {
    Geocode.fromAddress("Seattle").then(
      geoResponse => {
        const { lat, lng } = geoResponse.results[0].geometry.location;
        this.props.foursquare.venues.getVenues({
          'll': `${lat},${lng}`,
          'categoryId': '4d4b7104d754a06370d81259'
        }).then(fsResponse => {
          const venues = fsResponse.response.venues;
          this.props.setMarkers(venues);
          this.setState({ places: venues });
        });
      }
    );
  }
  getPlaceList = () => {
    let filteredPlaces = this.getFilteredPlaces();
    return (
      <ol className='places' role='listbox' aria-label='List of places'>
        {filteredPlaces.map((p, index) =>
          <li
            tabIndex={index + 2}
            role='option'
            key={index}
            className='place'
            onClick={() => {this.props.onPlaceClick(index)}}
            onKeyUp={event => {
              if (event.keyCode === 13) {
                this.props.onPlaceClick(index);
              }
            }}>
              {p.name}
          </li>
        )}
      </ol>
    )
  }
  getInputField = () => {
    const { query } = this.state;
    return <input
      tabIndex={1}
      className='filterPlaces'
      type='text'
      value={query}
      onChange={event => this.handleQueryUpdate(event.target.value)}
      placeholder='Filter places' />
  }
  handleHamburgerClick = () => {
    const map = document.querySelector('.mapContainer');
    map.style.marginLeft = map.style.marginLeft === '250px' ? '0' : '250px';

    const hamburger = document.querySelector('.hamburger');
    hamburger.style.left = hamburger.style.left === '250px' ? '0' : '250px';
  }
  handleQueryUpdate = (query) => {
    this.setState({ query }, () => {
      const filtered = this.getFilteredPlaces();
      this.props.setMarkers(filtered);
    });
  }
  render() {
    return (
      <div>
        <div className='sidebar'>
          <div className='heading' role='heading'>
            <h1 className='title'>
              Seattle Sites
            </h1>
            {this.getInputField()}
          </div>
          <div className='placeList' role='region'>
            {this.getPlaceList()}
          </div>
        </div>
        <div
          tabIndex='-1'
          style={{left: '250px'}}
          className='hamburger'
          onClick={this.handleHamburgerClick}>
          <img
            src='menu.png'
            alt='Toggle menu' />
        </div>
      </div>
    );
  }
}
export default List;