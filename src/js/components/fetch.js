
export default function fetchResults(keyword) {


  let mapsUrl = "https://accesscontrolalloworiginall.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json"
  let apiKey = "AIzaSyCpBHSOQ4xgrIIDV20k64DYb87adZ5VpSA"
  let url = `${mapsUrl}?query=${keyword}&key=${apiKey}`
  // let parse = x => x

  let parse = data => data.results
  console.log('fetched from google api');

  return fetch(url)
  .then(res => res.json())
  .then(parse)
}
