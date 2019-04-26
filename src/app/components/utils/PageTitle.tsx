import * as React from "react";
import {Row} from "antd";

type props = {
  title: string
}
type state = {}

class PageTitle extends React.Component<props, state> {
  constructor(props: props) {
    super(props)

    this.state = {}
  }


  render() {
    return <div>
      <Row type="flex" justify="space-around" style={{borderBottom: '1px #ccc solid', marginBottom: 15}}>
        <h1 style={{
          fontFamily: 'Arial Black',
          color: '#1890ff',
          fontSize: '3em',
          textShadow: '-1px 0 black, 0 1px black'
        }}>
          {this.props.title.toUpperCase()}
        </h1>
      </Row>
    </div>
  }
}

export default PageTitle;
