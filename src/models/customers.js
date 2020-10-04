import { API_URL_COMPANY, BASE_URL, limitPerRequest } from "../setting"
import axios from "axios"
import { Cookies } from "react-cookie"
const cookies = new Cookies()
const customer = {
  state: {
    customers: [],
    customer: {},
    query: {
      limit: limitPerRequest,
      page: 0,
      search: "",
      sort: "",
    },
    isLogin: false,
    loading: false,
  },
  reducers: {
    setState(state, payload) {
      state = { ...state, ...payload }
      return { ...state }
    },
    setCustomer(state, payload) {
      state.customer = { ...state.customer, ...payload }
      return { ...state }
    },
    setQuery(state, payload) {
      state.query = { ...state.query, ...payload }
      return { ...state }
    },
    clearQuery(state, payload) {
      state.query = {
        limit: limitPerRequest,
        page: 0,
        search: "",
        sort: "",
      }
      return { ...state }
    },
  },
  effects: {
    add(payload, rootState) {
      let current = this
      current.setState({ loading: true })
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/customer/register",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          console.log(response.data)
          current.setState({ loading: false })
        })
        .catch(error => {
          console.log(error)
        })
    },
    getById(payload, rootState) {
      let current = this
      current.setState({ loading: true })
      axios
        .get(API_URL_COMPANY + "/customer/get", {
          params: payload,
          headers: {
            Authorization: cookies.get("token"),
          },
        })
        .then(response => {
          current.setState({ customer: response.data })
          current.setState({ loading: false })
        })
        .catch(error => console.log(error))
    },
    getByQuery(payload, rootState) {
      let current = this
      current.setState({ loading: true })
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/customer/getByQuery",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          current.setState({ customers: response.data })
          current.setState({ loading: false })
        })
        .catch(error => console.log(error))
    },
    update(payload, rootState) {
      let current = this
      current.setState({ loading: true })
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/customer/update",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          current.setState({ loading: false })
          console.log(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
  },
}

export default customer
