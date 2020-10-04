/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import HeaderAdmin from "./admin/header/header"
import HeaderCompany from "./company/header/header"
import "./layout.css"
import LoadingContainer from "../components/loading/loading.js"
import Loader from "./loader"
import { connect } from "react-redux"
class Layout extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    let header
    if (this.props.role === "admin") {
      header = <HeaderAdmin activePage={this.props.currentPage} />
    }
    if (this.props.role === "company") {
      header = <HeaderCompany activePage={this.props.currentPage} />
    }
    return (
      <>
        {header}
        <div>
          <LoadingContainer isOpen={this.props.loading} />
          <main>{this.props.children}</main>
          <Loader />
        </div>
      </>
    )
  }
}
const mapState = state => ({
  loading: state.dialog.loading,
})
const mapDispatch = dispatch => ({})
export default connect(mapState, mapDispatch)(Layout)
