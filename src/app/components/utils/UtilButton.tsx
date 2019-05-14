import React from "react";
import {Button, Row, Tooltip} from "antd";

type props = {
  tooltip: string
  onClick: () => void
}
type state = {}

class UtilButton extends React.Component<props, state> {
  state = {}

  render() {
    return (
      <div>
        <Row type={"flex"} justify={"space-between"}>
          <Tooltip placement="topLeft" title={this.props.tooltip}>
            <Button onClick={this.props.onClick} shape={'circle'} type={'primary'}>{this.props.children ? this.props.children : '+'}</Button>
          </Tooltip>
        </Row>
      </div>
    )
  }

}

export default UtilButton;
