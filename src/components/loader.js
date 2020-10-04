import React from "react"
import CircularProgress from "@material-ui/core/CircularProgress"
import { connect } from "react-redux"
import "./loading/style.css"
class Loader extends React.Component {
  render() {
    return (
      <div className={`overlay rounded  ${this.props.isShow ? "show" : ""}`}>
        <CircularProgress color="secondary" />
      </div>
    )
  }
}
const mapState = state => ({ isShow: state.loader.isShow })
const mapDispatch = dispatch => ({})
export default connect(mapState, mapDispatch)(Loader)
