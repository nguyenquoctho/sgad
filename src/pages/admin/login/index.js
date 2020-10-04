import React from "react"
import SEO from "../../../components/seo"
import axios from "axios"
import { BASE_URL, API_URL_PUBLIC } from "../../../setting"
import { Cookies } from "react-cookie"
import Dialog from "@material-ui/core/Dialog"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import CircularProgress from "@material-ui/core/CircularProgress"
import Snackbar from "@material-ui/core/Snackbar"
import ErrorIcon from "@material-ui/icons/Error"
import { connect } from "react-redux"
import "./style.css"
const cookies = new Cookies()
class LoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { username: " ", password: " ", showPassword: false }
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
    }
    this.props.loginUser(data)
  }
  handlePress(event) {
    if (event.keyCode === 13) {
      this.login()
    }
  }
  componentDidMount() {
    if (cookies.get("token")) {
      axios({
        method: "POST",
        url: API_URL_PUBLIC + "/token/check",
        data: {
          token: cookies.get("token"),
        },
      }).then(response => {
        if (response.data.code === 1 && response.data.role === "admin") {
          window.location.replace(BASE_URL + "/admin/dashboard")
        }
      })
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
                      <label for="email">Username</label>
                      <input
                        onChange={this.handleChangeInput}
                        onKeyDown={this.handlePress}
                        id="email"
                        class="form-control form-control-rounded"
                        type="text"
                        name="username"
                      />
                    </div>
                    <div class="form-group">
                      <label for="password">Password</label>
                      <div className="d-flex align-items-center justify-content-end">
                        <input
                          onChange={this.handleChangeInput}
                          onKeyDown={this.handlePress}
                          id="password"
                          class="form-control form-control-rounded"
                          type={this.state.showPassword ? 'text' : 'password'}
                          name="password"
                        />
                        {this.state.showPassword ? (
                          <Visibility
                            onClick={this.handleShowPassword}
                            style={{
                              position: "absolute",
                              paddingRight: "5px",
                            }}
                          />
                        ) : (
                            <VisibilityOff
                              onClick={this.handleShowPassword}
                              style={{
                                position: "absolute",
                                paddingRight: "5px",
                              }}
                            />
                          )}
                      </div>
                    </div>
                    <button
                      onClick={this.login}
                      class="btn btn-rounded btn-primary btn-block mt-2"
                    >
                      Sign In
                    </button>

                    <div class="mt-3 text-center">
                      <a href="forgot.html" class="text-muted">
                        <u>Forgot Password?</u>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
  loginUser: dispatch.login.loginUser,
  setLogin: dispatch.login.setState,
})
export default connect(
  mapState,
  mapDispatch
)(LoginPage)
