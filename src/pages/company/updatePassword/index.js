import React from "react"
import SEO from "../../../components/seo"
import { connect } from "react-redux"
import { BASE_URL } from "../../../setting"

import Snackbar from "@material-ui/core/Snackbar"
import Dialog from "@material-ui/core/Dialog"
import CircularProgress from "@material-ui/core/CircularProgress"
import ErrorIcon from "@material-ui/icons/Error"
import { Link, navigate } from "gatsby";
import queryString from 'query-string';


class LoginPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                password: '',
                confirmPassword: '',
                token: "",
            },
            sended: false,
            message: "",
            code: null,
        }
    }
    handleChangeInput = (event) => {
        const target = event.target
        const value = target.type === "checkbox" ? target.checked : target.value
        const name = target.name;
        this.setState({
            [name]: value,
        })
    }

    handleSubmit = async () => {
        let data = { ...this.state.data, password: this.state.password, confirmPassword: this.state.confirmPassword }
        const check = await this.props.updatePassword(data)
        let message = "";
        if (check.code === 1) {
            return navigate('/company/login')
        }
        else {
            message = check.mess;
            this.setState({
                sended: true,
                message: message,
                code: check.code
            })
        }
    }
    handlePress = (event) => {
        if (event.keyCode == 13) {
            this.handleSubmit()
        }
    }
    componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let params = queryString.parse(this.props.location.search);
            if (params && params.token) {
                let { data = {} } = this.state
                data.token = params.token
                this.setState({
                    data: data
                })
            } else {
                return navigate('/company/login')
            }
        } else {
            return navigate('/company/login')
        }
    }
    render() {
        const { data = {}, sended, message, code } = this.state;
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
                                        <h1 class="mb-3 text-18">Update Password</h1>
                                        <div class="form-group">
                                            <label for="password">Password</label>
                                            <input
                                                value={this.state.password}
                                                name="password"
                                                class="form-control form-control-rounded"
                                                type="password"
                                                onChange={this.handleChangeInput}
                                                onKeyDown={this.handlePress}
                                            />
                                        </div>
                                        <div class="form-group">
                                            <label for="password">Confirm Password</label>
                                            <input
                                                value={this.state.confirmPassword}
                                                name="confirmPassword"
                                                class="form-control form-control-rounded"
                                                type="password"
                                                onChange={this.handleChangeInput}
                                                onKeyDown={this.handlePress}
                                            />
                                        </div>
                                        <button
                                            onClick={this.handleSubmit}
                                            class="btn btn-rounded btn-primary btn-block mt-2"
                                        >
                                            Submit
                                        </button>
                                        {sended && message ? <div className={`messsage messsage-${code ? 'success' : 'fail'}`}>
                                            {message}
                                        </div> : ""}
                                        <div class="mt-3 text-center">
                                            <Link to='/company/login'>
                                                <a class="text-muted">
                                                    <u>Sign in</u>
                                                </a>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Dialog open={this.props.loading}>
                    <div>
                        <CircularProgress color="secondary" />
                    </div>
                </Dialog>

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
    updatePassword: dispatch.login.updatePasswordOfCompany,
    checkToken: dispatch.token.checkToken,
    setLogin: dispatch.login.setState,
})
export default connect(
    mapState,
    mapDispatch
)(LoginPage)
