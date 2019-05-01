import React from "react";
import {Avatar, Card, Icon, Row, Tooltip, Button} from "antd";
import InvestmentForm from "../forms/InvestmentForm";

type props = {
  investment: Investment
  onSuccess?: () => void
}


interface Investment {
  id: number
  title: string
  value: number
  description: string
  acquisitionDate: Date
}

type state = {
  isEditing: boolean
}

class InvestmentCard extends React.Component<props, state> {
  state = {
    isEditing: false
  }

  setIsEditing = (isEditing: boolean, isSuccess?: boolean) => {
    this.setState({
      isEditing: isEditing
    })
    if (isSuccess) this.props.onSuccess()
  }

  render() {

    let {investment} = this.props

    const keyStyle = {width: 180, margin: 10}
    const valueStyle = {width: '100%', margin: 10, border: '1px solid #ccc', borderRadius: 4, padding: 8}
    const iconPrefixStyle = {paddingRight: 4}
    const buttonStyle ={fontWeight: 'bold' as 'bold', padding: '0px 7px', margin: 3, fontSize: '1.2em'}

    const investmentCard = !this.state.isEditing ? (
      <Card style={{width: 500, minHeight: 550, marginTop: 16}}>
        <Row type={"flex"} justify={"space-between"} style={{borderBottom: '1px solid #ccc'}}>
          <Avatar size={64} shape={'square'} icon="car"/>
          <div style={{width: 250, marginTop: 20, marginBottom: 20, fontSize: '1.4em', fontWeight: 'bold'}}>
            {investment.title}
          </div>
          <div>
            <Tooltip title={'Edit investment details'}>
              <Button type={"primary"} shape={'round'} style={buttonStyle} onClick={() => this.setIsEditing(true)}><Icon type="edit"/></Button>
            </Tooltip>
            <Tooltip title={'Sell investment'}>
              <Button type={"primary"} shape={'round'} style={buttonStyle}><Icon type="dollar"/></Button>
            </Tooltip>
          </div>
        </Row>
        <Row type={"flex"} justify={"space-between"} style={{marginTop: 20}}>
          <div style={keyStyle}>Value:</div>
          <div style={valueStyle}><Icon type="dollar" style={iconPrefixStyle}/>{investment.value.toLocaleString()} HUF
          </div>
        </Row>
        <Row type={"flex"} justify={"space-between"}>
          <div style={keyStyle}>Description:</div>
        </Row>
        <Row type={"flex"} justify={"space-between"}>
          <div style={valueStyle}><Icon type="edit" style={iconPrefixStyle}/>
            {investment.description}
          </div>
        </Row>
        <Row type={"flex"} justify={"space-between"}>
          <div style={keyStyle}>Date of acquisition:</div>
          <div style={valueStyle}><Icon type="calendar" style={iconPrefixStyle}/>
            {new Date(investment.acquisitionDate).toLocaleDateString()}
          </div>
        </Row>
      </Card>
    ) : <InvestmentForm investment={investment} onSuccess={() => this.setIsEditing(false, true)} onCancel={() => this.setIsEditing(false)}/>


    return <div>
      {investmentCard}
    </div>

  }
}

export default InvestmentCard;
