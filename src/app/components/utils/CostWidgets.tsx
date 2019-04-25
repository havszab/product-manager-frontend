import React from "react";
import Row from "antd/lib/grid/row";
import {Card, Statistic} from "antd";

type props = {
  sums: Array<[number, string]>
}
type state = {
}


class CostWidgets extends React.Component<props, state> {
  state = {
    sums: Array<[number, string]>()
  }

  async componentDidMount(): Promise<void> {

  }

  renderStatisticWidgets = ():React.ReactNode => {
    let stats = []
    let sum = 0
    let {sums} = this.props
    const style = {width: 220, height: 100, margin: 5}
    let other: React.ReactNode;
    for (let stat of sums) {
      if (stat[1] === 'ANNUAL') {
        stats.push(
            <Card style={style} key={1}>
              <Statistic
                title={'Annual costs / year:'}
                value={stat[0]}
                valueStyle={{color: "#36A2EB"}}
                suffix="HUF"
              />
            </Card>
        )
        sum += stat[0]
      } else if (stat[1] === 'MONTHLY') {
        stats.push(
            <Card style={style} key={2}>
              <Statistic
                title={'Monthly costs / year:'}
                value={stat[0] * 12}
                valueStyle={{color: "#36A2EB"}}
                suffix="HUF"
              />
            </Card>
        )
        sum += stat[0] * 12
      } else if (stat[1] === 'WEEKLY') {
        stats.push(
            <Card style={style} key={3}>
              <Statistic
                title={'Weekly costs / year:'}
                value={stat[0] * 52}
                valueStyle={{color: "#36A2EB"}}
                suffix="HUF"
              />
            </Card>
        )
        sum += stat[0] * 52
      } else if (stat[1] === 'OTHER') {
        other =
          <Card style={style} key={4}>
            <Statistic
              title={'Other costs'}
              value={stat[0]}
              valueStyle={{color: '#ccc'}}
              suffix="HUF"
            />
          </Card>
      }
    }
    stats.push(
        <Card style={style} key={5}>
          <Statistic
            title={'Registered costs / year:'}
            value={sum}
            valueStyle={{ color: '#cf1322' }}
            suffix="HUF"
          />
        </Card>
    )
    stats.push(other)
    return stats
  }

  render() {
    return (
      <div style={{marginTop: 20, border: '1px solid #ccc'}}>
        <Row type={"flex"} justify={"space-around"} >
          {this.renderStatisticWidgets()}
        </Row>
      </div>
    )
  }
}

export default CostWidgets;
