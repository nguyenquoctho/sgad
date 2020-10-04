import { API_URL_COMPANY, BASE_URL, limitPerRequest } from "../setting"
import axios from "axios"
import { Cookies } from "react-cookie"

const tokenExpires = 12 * 3600 * 1000 //12 hours
const cookies = new Cookies()
let companyCode
if (cookies.get("user")) {
  companyCode = {
    companyCode: cookies.get("user").companyCode,
  }
}
const blogs = {
  state: {
    blogs: [],
    blogsByQuery: [],
    query: {
      query: {},
      page: 1,
      pageSize: limitPerRequest,
      limit: 200,
    },
    blogById: {},
    contentImages: "",
    numberOfBlogs: "",
    blogImage: "",
    success: "",
    error: "",
  },
  reducers: {
    setState(state, payload) {
      state = { ...state, ...payload }
      return state
    },
    addContentImage(state, payload) {
      state.contentImages = payload
      return { ...state }
    },
    addBlogImage(state, payload) {
      state.blogImage = payload
      return { ...state }
    },
    deleteBlogImage(state, payload) {
      state.blogImage = ""
      return { ...state }
    },
    setBlogById(state, payload) {
      state.blogById = { ...state.blogById, ...payload }
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
  effects: dispatch => ({
    loadAllBlogs(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      axios
        .get(API_URL_COMPANY + "/blogs", {
          params: payload,
          headers: {
            Authorization: cookies.get("token"),
          },
        })
        .then(response => {
          dispatch.dialog.setState({ loading: false })
          current.setState({ blogs: response.data })
        })
        .catch(error => console.log(error))
    },
    addBlog(payload, rootState) {
      let current = this
      dispatch.dialog.setState({ loading: true })
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/blogs/add",
        headers: {
          Authorization: cookies.get("token"),
        },
        data: payload,
      })
        .then(async response => {
          await dispatch.dialog.setState({ loading: false })
          if (response.data.code === 1) {
            await current.setState({ success: true, error: false })
          } else if (response.data.code === 0) {
            await current.setState({ success: false, error: true })
          }
          console.log(response.data)
        })
        .catch(error => console.log(error))
    },
    loadBlogById(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      axios
        .get(API_URL_COMPANY + "/blogs/get", {
          params: { id: payload },
          headers: {
            Authorization: cookies.get("token"),
          },
        })
        .then(response => {
          dispatch.dialog.setState({ loading: false })
          current.setState({ blogById: response.data })
          current.setState({ blogImage: response.data.image })
        })
        .catch(error => console.log(error))
    },
    loadBlogByQuery(payload, rootState) {
      console.log(payload)
      dispatch.dialog.setState({ loading: true })
      let current = this
      axios
        .get(API_URL_COMPANY + "/blogs/getByQuery", {
          params: payload,
          headers: {
            Authorization: cookies.get("token"),
          },
        })
        .then(response => {
          dispatch.dialog.setState({ loading: false })
          if (!response.data.code) {
            return
          }
          const { data } = response.data
          current.setState({
            blogsByQuery: data.rows,
            numberOfBlogs: data.total,
          })
        })
        .catch(error => console.log(error))
    },
    loadBlogByQueryNoLimit(payload, rootState) {
      let current = this
      // axios
      //   .get(API_URL_COMPANY + "/blogs/getByQuery", {
      //     params: { ...payload, limit: 0 },
      //     headers: {
      //       Authorization: cookies.get("token"),
      //     },
      //   })
      //   .then(response => {
      //     dispatch.dialog.setState({ loading: false })
      //     current.setState({ numberOfBlogs: response.data.length })
      //   })
      //   .catch(error => console.log(error))
    },
    updateBlog(payload, rootState) {
      let current = this
      dispatch.dialog.setState({ loading: true })
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/blogs/update",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(async response => {
          console.log(response.data)
          await dispatch.dialog.setState({ loading: false })
          if (response.data.code === 1) {
            await current.setState({ success: true, error: false })
          } else if (response.data.code === 0) {
            await current.setState({ success: false, error: true })
          }
        })
        .catch(error => console.log(error))
    },
    deleteBlog(payload, rootState) {
      let current = this
      dispatch.dialog.setState({ loading: true })
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/blogs/delete",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          console.log(response.data)
          dispatch.dialog.setState({ loading: true })
        })
        .catch(error => console.log(error))
    },
  }),
}
export default blogs
