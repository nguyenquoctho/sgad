import { API_URL_PUBLIC, BASE_URL } from "../setting"
import axios from "axios"
import { Cookies } from "react-cookie"
const tokenExpires = 12 * 3600 * 1000 //12 hours
const cookies = new Cookies()
const token = {
  state: {},
  reducers: {
    setState(state, payload) {
      state = { ...state, ...payload }
      return { ...state }
    },
  },
  effects: dispatch => ({
    checkToken(payload, rootState) {
      let current = this
      dispatch.dialog.setState({ loading: true })
      axios({
        method: "POST",
        url: API_URL_PUBLIC + "/token/check",
        data: payload,
      }).then(response => {
        dispatch.dialog.setState({ loading: false })
        if (response.data.code === 1 && response.data.role === "company") {
          window.location.replace(BASE_URL + "/company/dashboard")
        } else if (response.data.code === 1 && response.data.role === "admin") {
          window.location.replace(BASE_URL + "/admin/dashboard")
        }
      })
    },
  }),
}

export default token
