import React from "react"
import {Tabs,Icon} from "antd"
import PageTitle from "../components/utils/PageTitle"
import AdministrationTab from "./tabs/AdministrationTab";
import InvestmentTab from "./tabs/InvestmentTab";
import EmployeeTab from "./tabs/EmployeeTab";
import CostTab from "./tabs/CostTab";

const TabPane = Tabs.TabPane;

type props = {}
type state = {}

class AdminPage extends React.Component<props, state> {
  state = {}

  render() {

    return <div>
      <Tabs type="card">

        <TabPane tab={<div><Icon type="idcard"/>Manage Employees</div>} key="1">
          <PageTitle title={'Registered employees'}/>
          <EmployeeTab/>
        </TabPane>

        <TabPane tab={<div><Icon type="schedule"/> Manage Costs</div>}  key="2">
          <PageTitle title={'Registered costs'}/>
          <CostTab/>
        </TabPane>

        <TabPane tab={<div><Icon type="car"/>Investments</div>} key="3">
          <PageTitle title={'Investments'}/>
          <InvestmentTab/>
        </TabPane>

        <TabPane tab={<div><Icon type="setting"/>Settings</div>} key="4">
          <PageTitle title={'Settings'}/>
          <AdministrationTab/>
        </TabPane>

      </Tabs>
    </div>
  }
}

export default AdminPage;
