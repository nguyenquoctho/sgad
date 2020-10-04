import { BASE_URL, API_URL_PUBLIC } from "../setting"
import axios from "axios"
import { Cookies } from "react-cookie"
const tokenExpires = 12 * 3600 * 1000 //12 hours
const cookies = new Cookies()
const login = {
  state: {
    result: {},
    isLogin: false,
  },
  reducers: {
    setState(state, payload) {
      state = { ...state, ...payload }
      return { ...state }
    },
  },
  effects: dispatch => ({
    forgotPasswordOfCompany(payload = {}, rootState) {
      dispatch.dialog.setState({ loading: true })
      return axios({
        method: "post",
        url: API_URL_PUBLIC + "/company/forgot",
        headers: {
          "content-type": "application/json"
        },
        data: {
          companyCode: payload.companyCode
        },
      })
        .then(res => res.data)

        .then(function (response) {
          debugger
          dispatch.dialog.setState({ loading: false })
          return response
        })
        .catch(err => {
          dispatch.dialog.setState({ loading: false })
          console.log(err);
          return {
            code: 0,
            err: err,
            mess: err.message
          }

        })
    },
    updatePasswordOfCompany(payload = {}, rootState) {
      dispatch.dialog.setState({ loading: true })
      return axios({
        method: "post",
        url: API_URL_PUBLIC + "/company/updatePassword",
        data: {
          password: payload.password,
          confirmPassword: payload.confirmPassword,
          token: payload.token
        },
      })
        .then(res => res.data)
        .then(function (response) {
          dispatch.dialog.setState({ loading: false })
          return response
        })
        .catch(err => {
          dispatch.dialog.setState({ loading: false })
          console.log(err);
          return {
            code: 0,
            err: err,
            mess: err.message
          }

        })
    },
    loginCompany(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      axios({
        method: "post",
        url: API_URL_PUBLIC + "/login/users",
        data: payload,
      })
        .then(function (response) {
          if (response.data.code === 1) {
            dispatch.dialog.setState({ loading: false })
            window.location.replace(BASE_URL + "/company/dashboard")
            cookies.set("token", response.data.data.token, {
              path: "/",
              expires: new Date(Date.now() + tokenExpires),
            })
            cookies.set("user", response.data.data.user, {
              path: "/",
              expires: new Date(Date.now() + tokenExpires),
            })
          } else {
            dispatch.dialog.setState({ loading: false })
            current.setState({ isLogin: true })
          }
        })
        .catch(error => console.log(error))
    },
    loginUser(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      axios({
        method: "post",
        url: API_URL_PUBLIC + "/login/admin",
        data: payload,
      })
        .then(function (response) {
          dispatch.dialog.setState({ loading: false })
          current.setState({ result: response.data.data.admin })
          if (response.data.code === 1) {
            window.location.replace(BASE_URL + "/admin/dashboard")
            cookies.set("token", response.data.data.token, {
              path: "/",
              expires: new Date(Date.now() + tokenExpires),
            })
            cookies.set("admin", response.data.data.admin, {
              path: "/",
              expires: new Date(Date.now() + tokenExpires),
            })
          }
        })
        .catch(error => {
          console.log(error)
          current.setState({ isLogin: true })
        })
    },
  }),
}

export default login
