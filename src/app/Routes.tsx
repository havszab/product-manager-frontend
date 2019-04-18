import * as React from "react"
import * as ReactDOM from "react-dom"
import { Route, BrowserRouter as Router, Link, Redirect, Switch } from 'react-router-dom'

import LoginPage from './pages/LoginPage'
import AcquisitionPage from './pages/AcquisitionPage'
import './App.css'
import MainFrame from './MainFrame'
import IndexPage from './pages/IndexPage'
import StockPage from "./pages/StockPage";
import SalesPage from "./pages/SalesPage";
import DashboardPage from "./pages/DashboardPage";

class Routes extends React.Component<{}, {}> {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={IndexPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route path="/">
            <MainFrame>
              <Switch>
                <Route exact path="/acquisition" component={AcquisitionPage} />
              </Switch>
              <Switch>
                <Route exact path="/stock" component={StockPage} />
              </Switch>
              <Switch>
                <Route exact path="/sales" component={SalesPage} />
              </Switch>
              <Switch>
                <Route exact path="/dashboard" component={DashboardPage} />
              </Switch>
            </MainFrame>
          </Route>
        </Switch>
      </Router>
    )
  }
}

ReactDOM.render(
  <Routes />,
  document.getElementById("root")
);
