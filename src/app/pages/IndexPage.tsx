import * as React from "react"
import { Carousel } from 'antd';

export default class IndexPage extends React.Component<{}, {}> {

  render() {
        //<div><img src={require("../assets/carousel-bgs/vegetables_mix.jpg")} alt="veg"/></div>
    return(
      <Carousel>
        <div><h3>2</h3></div>
        <div><h3>3</h3></div>
        <div><h3>4</h3></div>
      </Carousel>
    )
  }
}
