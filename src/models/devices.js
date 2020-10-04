import { API_URL_COMPANY, BASE_URL } from "../setting"
import axios from "axios"
import { Cookies } from "react-cookie"
const cookies = new Cookies()
const devices = {
  state: {
    devices: [],
  },
  reducers: {
    setState(state, payload) {
      state = { ...state, ...payload }
      return { ...state }
    },
  },
  effects: {
    loadDevices(payload, rootState) {
      let current = this
      axios
        .get(API_URL_COMPANY + "/devices", {
          headers: {
            Authorization: cookies.get("token"),
          },
        })
        .then(response => {
          current.setState({ devices: response.data })
        })
        .catch(error => console.log(error))
    },
  },
}
export default devices
