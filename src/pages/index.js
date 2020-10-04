import React from "react"
import axios from "axios"
import { BASE_URL, API_URL } from "../setting"
import LoadingContainer from "../components/loading/loading.js"
import { Cookies } from "react-cookie"
import { connect } from "react-redux";
const cookies = new Cookies()
class IndexPage extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    let data = {
      token: cookies.get("token"),
    }
    if (cookies.get("token")) {
      this.props.checkToken(data)
    } else {
      window.location.replace(BASE_URL + "/company/login")
    }
  }
  render() {
    return (
      <LoadingContainer isOpen={this.props.loading} />

    )
  }
}
const mapState = state => ({
  loading: state.dialog.loading
})
const mapDispatch = dispatch => ({
  checkToken: dispatch.token.checkToken
})
export default connect(mapState, mapDispatch)(IndexPage)