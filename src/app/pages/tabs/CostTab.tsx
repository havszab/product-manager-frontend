import React from "react";
import {Modal, Row} from "antd";
import CostForm from "../../components/forms/CostForm";
import {get} from "../../libs/utils/request";
import {user} from "../../libs/utils/user";
import CostCard from "../../components/cards/CostCard";
import UtilButton from "../../components/utils/UtilButton";
import CostWidgets from "../../components/utils/CostWidgets";

type props = {}
type state = {
  costs: Array<Cost>
  sums: Array<[number, string]>
  isModalVisible: boolean
}

interface Cost {
  id: number
  name: string
  cost: number
  payedLastDate: Date
  type: string
}

class CostTab extends React.Component<props, state> {
  state = {
    costs: Array<Cost>(),
    isModalVisible: false,
    sums: Array<[number, string]>()
  }

  componentDidMount(): void {
    this.fetchAll()
  }

  isModalVisibleSwitchHandler = (isVisible: boolean, reFetch?: boolean) => {
    this.setState({
      isModalVisible: isVisible
    })
    if (reFetch) this.fetchAll()
  }

  fetchAll = () => {
    this.fetchCosts()
    this.fetchStatistics()
  }

  fetchCosts = async () => {
    await get('get-costs', {email: user().email})
      .then((response: { costs: Array<Cost> }) => {
        this.setState({
          costs: response.costs
        })
      })
  }

  fetchStatistics = async () => {
    await get('get-cost-sums-by-type', {email: user().email})
      .then((response: { sums: Array<[number, string]> }) => {
        this.setState({
          sums: response.sums
        })
      })
  }

  renderCosts = (): React.ReactNode => {
    let costs = []
    for (let cost of this.state.costs) {
      costs.push(<CostCard onSuccess={this.fetchCosts} cost={cost} key={cost.id}/>)
    }
    return costs
  }


  render() {

    const modalForm =
      <Modal visible={this.state.isModalVisible}
             closable={false}
             footer={null}
             centered={true}
             onCancel={() => this.isModalVisibleSwitchHandler(false)}
             style={{maxWidth: 300}}>
        <Row type={"flex"} justify={"space-around"}>
          <CostForm onSuccess={() => this.isModalVisibleSwitchHandler(false, true)}
                    onCancel={() => this.isModalVisibleSwitchHandler(false)}/>
        </Row>
      </Modal>

    return (
      <div>
        {modalForm}
        <UtilButton tooltip={'New cost'} onClick={() => this.isModalVisibleSwitchHandler(true)}/>
        <CostWidgets sums={this.state.sums}/>
        <Row type={"flex"} justify={"space-around"}>
          {this.renderCosts()}
        </Row>
      </div>
    )
  }

}

export default CostTab;
