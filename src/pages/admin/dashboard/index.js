import React from "react"
import { Link } from "gatsby"

import Layout from "../../../components/layout"
import SEO from "../../../components/seo"
import {connect} from 'react-redux'
class IndexPage extends React.Component {
  constructor(props) {
    super(props)
  }
  componentWillMount(){
    // Select menu
    this.props.selectMenu({index:0})
  }
  render() {
    return (
      <Layout currentPage="dashboard" role="admin">
        <SEO title="Dashboard" />
        <div class={"main-content-wrap d-flex flex-column "+this.props.contentStatus}>
          <div class="breadcrumb d-flex justify-content-between">
            <h1>Dashboard</h1>
          </div>
          <div class="separator-breadcrumb border-top"></div>
        </div>
      </Layout>
    )
  }
}
const mapState=state=>({
  contentStatus:state.menu.contentStatus
})
const mapDispatch=dispatch=>({
  selectMenu:dispatch.menu.setState
})
export default connect(mapState,mapDispatch)(IndexPage)
