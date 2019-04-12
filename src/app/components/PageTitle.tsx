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
      <Row type="flex" justify="space-around" style={{ borderBottom: '1px #ccc solid', fontSize: '1.5em' }}>
        <h2>{this.props.title}</h2>
      </Row>
    </div>
  }
}

export default PageTitle;
