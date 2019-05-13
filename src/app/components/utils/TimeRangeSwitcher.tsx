import React from "react"
import {Icon, Button, Row} from "antd"
import moment = require("moment")
import Draggable from "react-draggable";
import i18n from '../../libs/i18n'

type props = {
  returnRange: (from: Date, to: Date) => void
}
type state = {
  selectedDate: Date
  dateFrom?: Date
  dateTo?: Date
}

const monthNames = [
  i18n('months.jan'), i18n('months.feb'), i18n('months.march'),
  i18n('months.apr'), i18n('months.may'), i18n('months.jun'),
  i18n('months.jul'), i18n('months.aug'), i18n('months.sept'),
  i18n('months.oct'), i18n('months.nov'), i18n('months.dec')
]

class TimeRangeSwitcher extends React.Component<props, state> {
  state = {
    selectedDate: new Date(),
    dateFrom: moment().month(new Date().getMonth()).startOf("month").toDate(),
    dateTo: moment().month(new Date().getMonth()).endOf("month").toDate()
  }

  componentDidMount(): void {
    this.getRangeFromSelected()
  }

  getRangeFromSelected = async () => {
    const prevState = {...this.state}

    let startDate = moment().month(prevState.selectedDate.getMonth()).startOf("month").toDate()
    let endDate = moment().month(prevState.selectedDate.getMonth()).endOf("month").toDate()

    startDate.setFullYear(this.state.selectedDate.getFullYear())
    endDate.setFullYear(this.state.selectedDate.getFullYear())

    await this.setState({
      dateFrom: startDate,
      dateTo: endDate
    })

    this.props.returnRange(startDate, endDate)
  }

  handleMonthChange = (num: number) => {
    const prevState = {...this.state}
    let date: Date = prevState.selectedDate

    date.setMonth(this.state.selectedDate.getMonth() + num)
    this.setState({
      selectedDate: date
    })
    this.getRangeFromSelected()
  }

  render() {

    const currentMonthWidgetStyle = {
      height: 32,
      padding: '5px 10px 0px 10px',
      border: '1px solid #1890ff',
      borderRadius: 4,
      textAlign: 'center' as 'center',
      backgroundColor: '#fff'
    }

    const wrapperRowStyle = {maxWidth: 250, marginBottom: 20, position: 'fixed' as 'fixed', border: '1px solid #1890ff',
      borderRadius: 4, backgroundColor: '#fff', padding: '10px 8px 5px 8px', top: '0.5%', left: '60%', cursor: 'pointer', zIndex: 100}

    return (
      <div>
        <Draggable>
        <Row type={"flex"} justify={"space-around"} style={wrapperRowStyle} >

          <Button type={'primary'} onClick={() => this.handleMonthChange(-1)}>
            <Icon type="left"/>
          </Button>

          <div style={currentMonthWidgetStyle}>
            {`${this.state.selectedDate.getFullYear()}. ${monthNames[this.state.selectedDate.getMonth()]}`}
          </div>

          <Button type={'primary'} onClick={() => this.handleMonthChange(1)}
                  disabled={this.state.selectedDate.getMonth() >= new Date().getMonth() && this.state.selectedDate.getFullYear() === new Date().getFullYear()}>
            <Icon type="right"/>
          </Button>

          <div>{this.state.dateFrom.toLocaleDateString()} - {this.state.dateTo.toLocaleDateString()}</div>
        </Row>
        </Draggable>
      </div>
    )
  }

}

export default TimeRangeSwitcher;
