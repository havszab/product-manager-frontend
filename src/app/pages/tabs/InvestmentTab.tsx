import React from "react";
import InvestmentCard from "../../components/cards/InvestmentCard";
import {message, Row, Button, Icon, Modal, Tooltip} from "antd";
import {get} from "../../libs/utils/request";
import {user} from "../../libs/utils/user";
import InvestmentForm from "../../components/forms/InvestmentForm";
import CostForm from "../AdminPage";

type props = {}
type state = {
  investments: Array<Investment>
  isCreating: boolean
}

interface Investment {
  id: number
  title: string
  value: number
  description: string
  acquisitionDate: Date
}

class InvestmentTab extends React.Component<props, state> {
  state = {
    investments: Array<Investment>(),
    isCreating: false
  }

  componentDidMount(): void {
    this.fetchAll()
  }

  fetchAll = () => {
    this.fetchInvestments()
  }

  setIsCreating = (isCreating: boolean) => {
    this.setState({
      isCreating: isCreating
    })
  }

  fetchInvestments = async () => {
    await get('get-all-investments', {email: user().email})
      .then((response: {success: boolean, investments: Array<Investment>, message: string}) => {
        if (response.success) this.setState({investments: response.investments})
        else message.error(response.message)
      })
      .catch(err => {message.error(err)})
  }

  renderInvestments = (): React.ReactNode => {
    let invCards = []
    if (this.state.investments) {
      for (let inv of this.state.investments) {
        invCards.push(<InvestmentCard investment={inv} key={inv.id}/>)
      }
    }
    return invCards;
  }

  render() {


    const createInvForm = this.state.isCreating ? (
      <Modal visible={this.state.isCreating}
             closable={false}
             footer={null}
             centered={true}
             onCancel={() => this.setIsCreating(false)}
             style={{maxWidth: 560}}>
        <Row type={"flex"} justify={"space-around"}>
          <InvestmentForm/>
        </Row>
      </Modal>) : null

    return (
      <div>
        {createInvForm}
        <Row type={"flex"} justify={"space-between"}>
          <Tooltip placement="topLeft" title="New cost">
            <Button onClick={() => this.setIsCreating(true)} shape={'circle'} type={'primary'}>+</Button>
          </Tooltip>
        </Row>
        <Row type={"flex"} justify={"space-around"}>
          {this.renderInvestments()}
        </Row>
      </div>
    )
  }

}

export default InvestmentTab;
