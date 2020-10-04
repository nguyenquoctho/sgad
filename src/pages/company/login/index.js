import React from "react"
import SEO from "../../../components/seo"
import { connect } from "react-redux"
import { API_URL, BASE_URL } from "../../../setting"
import { Cookies } from "react-cookie"
import Snackbar from "@material-ui/core/Snackbar"
import Dialog from "@material-ui/core/Dialog"
import CircularProgress from "@material-ui/core/CircularProgress"
import ErrorIcon from "@material-ui/icons/Error"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Link } from "gatsby";

import "./style.css"
import LoadingContainer from "../../../components/loading/loading"
const tokenExpires = 3600 * 1000
const cookies = new Cookies()

class LoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { result: {}, companyCode: "", showPassword: false }
    this.handleChangeInput = this.handleChangeInput.bind(this)
    this.handleShowPassword = this.handleShowPassword.bind(this)
    this.handlePress = this.handlePress.bind(this)
    this.login = this.login.bind(this)
  }
  handleChangeInput(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value,
    })
  }
  handleShowPassword() {
    this.setState({ showPassword: !this.state.showPassword })
  }
  login() {
    let current = this
    let data = {
      username: current.state.username,
      password: current.state.password,
      companyCode: current.state.companyCode.toLowerCase(),
    }
    console.log(current.state.companyCode.toLowerCase())

    this.props.loginCompany(data)
  }
  handlePress(event) {
    if (event.keyCode == 13) {
      this.login()
    }
  }
  componentDidMount() {
    if (cookies.get("token")) {
      this.props.checkToken(cookies.get("token"))
    }
  }
  render() {
    return (
      <>
        <SEO title="Login" />
        <div
          class="auth-layout-wrap"
          style={{
            backgroundImage: `url(${BASE_URL}/images/login-background.jpg)`,
          }}
        >
          <div class="auth-content">
            <div class="card o-hidden">
              <div class="row justify-content-center">
                <div class="col-md-12">
                  <div class="p-4">
                    <div class="auth-logo text-center mb-4">
                      <img src={BASE_URL + "/images/logo.png"} alt="" />
                    </div>
                    <h1 class="mb-3 text-18">Sign In</h1>
                    <div class="form-group">
                      <label for="password">Company code</label>
                      <input
                        name="companyCode"
                        class="form-control form-control-rounded"
                        type="text"
                        onChange={this.handleChangeInput}
                        onKeyDown={this.handlePress}
                      />
                    </div>
                    <div class="form-group">
                      <label for="email">User name</label>
                      <input
                        type="text"
                        class="form-control form-control-rounded"
                        name="username"
                        onChange={this.handleChangeInput}
                        onKeyDown={this.handlePress}
                      />
                    </div>
                    <div class="form-group">
                      <label for="password">Password</label>
                      <div className="d-flex align-items-center justify-content-end" style={{ position: "relative" }} >
                        <input
                          name="password"
                          class="form-control form-control-rounded"
                          type={this.state.showPassword ? 'text' : 'password'}
                          onChange={this.handleChangeInput}
                          onKeyDown={this.handlePress}
                        />
                        {this.state.showPassword ? <Visibility onClick={this.handleShowPassword} style={{ position: "absolute", paddingRight: '5px', zIndex: "10" }} /> : <VisibilityOff onClick={this.handleShowPassword} style={{ position: "absolute", paddingRight: '5px', zIndex: "10" }} />}


                      </div>
                    </div>

                    <button
                      onClick={() => this.login()}
                      class="btn btn-rounded btn-primary btn-block mt-2"
                    >
                      Sign In
                    </button>

                    <div class="mt-3 text-center">
                      <Link to='/company/forgot'>
                        <a class="text-muted">
                          <u>Forgot Password?</u>
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <LoadingContainer isOpen={this.props.loading} />
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          variant="error"
          open={this.props.isLogin}
          className={"login-alert"}
          onClose={() => this.props.setLogin({ isLogin: false })}
          autoHideDuration={2000}
          ContentProps={{
            "aria-describedby": "message-id",
          }}
          message={
            <div id="message-id" className="d-flex align-items-center">
              {" "}
              <ErrorIcon style={{ marginRight: "5px" }} />
              Login failed
            </div>
          }
        />
      </>
    )
  }
}

const mapState = state => ({
  result: state.login.result,
  loading: state.dialog.loading,
  isLogin: state.login.isLogin,
})
const mapDispatch = dispatch => ({
  loginCompany: dispatch.login.loginCompany,
  checkToken: dispatch.token.checkToken,
  setLogin: dispatch.login.setState,
})
export default connect(
  mapState,
  mapDispatch
)(LoginPage)
