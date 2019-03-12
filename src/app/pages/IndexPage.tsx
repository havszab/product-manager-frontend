import * as React from "react"
import { user } from '../libs/utils/user'
import { Redirect } from "react-router-dom";

export default class IndexPage extends React.Component<{}, {}> {

  render() {
    if (user()) {
      return <Redirect to="/dashboard"/>
    } else {
      return <Redirect to="/login"/>
    }
  }
}