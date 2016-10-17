import React, { Component } from 'react'

export default class renderResults extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div key="{this.id}">
        <div className="panel panel-default">
          <div className="panel-body">
          {this.props.result.name}
            {/* ${item.name}<br />
            ${item.formatted_address} */}
            <p><a href="#"><i className="glyphicon glyphicon-heart"></i></a></p>
          </div>
        </div>
      </div>
    )
  }
}

//
// export function renderResults(item){
//   let render = x => ``
//
//   render = item => `
//     <div key="${item.id}">
//       <div class="panel panel-default">
//         <div class="panel-body">
//           ${item.name}<br>
//           ${item.formatted_address}
//           <p><a href="#"><i class="glyphicon glyphicon-heart"></i></a>
//         </div>
//       </div>
//     </div>
//   `
//   return render(item)
//
// }
