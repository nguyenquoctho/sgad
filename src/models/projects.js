import { API_URL_COMPANY, BASE_URL, limitPerRequest } from "../setting"
import axios from "axios"
import { Cookies } from "react-cookie"
const cookies = new Cookies()
const projects = {
  state: {
    projects: [],
    projectById: {
      overview: [],
    },
    projectImage: "",
    amenities: [],
    facilities: [],
    similarProjects: [],
    projectsByQuery: [],
    numberOfProjects: 0,
    query: {
      limit: limitPerRequest,
      page: 0,
      filter: [],
      sort: {},
      price: {},
      search: "",
    },
    success: "",
    error: "",
    newProject:{
      overview: []
    },
    currentSlug:""
  },
  reducers: {
    setState(state, payload) {
      state = { ...state, ...payload }
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
        filter: [],
        sort: {},
        price: {},
        search: "",
      }
      return { ...state }
    },
    addProjectImage(state, payload) {
      state.projectImage = payload
      return { ...state }
    },
    deleteProjectImage(state, payload) {
      state.projectImage = ""
      return { ...state }
    },
    handleInputProject(state, payload) {
      state.projectById = { ...state.projectById, ...payload }
      return { ...state }
    },
    setProjectLocation(state, payload) {
      state.projectById.location = { ...state.projectById.location, ...payload }
      return { ...state }
    },

    addAmenities(state, payload) {
      state.amenities = [...state.amenities, payload]
      return { ...state }
    },
    deleteAmenities(state, payload) {
      state.amenities = state.amenities.filter(item => {
        return item != payload
      })
      return { ...state }
    },
    addFacilities(state, payload) {
      state.facilities = [...state.facilities, payload]
      return { ...state }
    },
    deleteFacilities(state, payload) {
      state.facilities = state.facilities.filter(item => {
        return item != payload
      })
      return { ...state }
    },
    addSimilarProjects(state, payload) {
      state.similarProjects = [...state.similarProjects, payload]
      return { ...state }
    },
    deleteSimilarProjects(state, payload) {
      state.similarProjects = state.similarProjects.filter(item => {
        return item != payload
      })
      return { ...state }
    },
  },
  effects: dispatch => ({
    loadProject(payload, rootState) {
      let current = this
      dispatch.dialog.setState({ loading: true })
      axios
        .get(API_URL_COMPANY + "/projects", {
          params: payload,
          headers: {
            Authorization: cookies.get("token"),
          },
        })
        .then(response => {
          current.setState({ projects: response.data })
          dispatch.settings.setTotalProjects(response.data.length)
          dispatch.dialog.setState({ loading: false })
        })
        .catch(error => {
          console.log(error)
        })
    },
    loadProjectById(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      axios
        .get(API_URL_COMPANY + "/projects/get", {
          params: {
            id: payload,
          },
          headers: {
            Authorization: cookies.get("token"),
          },
        })
        .then(response => {
          dispatch.dialog.setState({ loading: false })
          current.setState({ projectById: response.data })
          current.setState({
            projectImage: response.data.image,
            amenities: response.data.amenities,
            facilities: response.data.facilities,
            similarProjects: response.data.similarProjects,
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    loadProjectByQuery(payload, rootState) {
      let current = this
      dispatch.dialog.setState({ loading: true })
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/projects/getByQuery",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          current.setState({ projectsByQuery: response.data })
          dispatch.dialog.setState({ loading: false })
        })
        .catch(error => {
          console.log(error)
        })
    },
    loadProjectByQueryNoLimit(payload, rootState) {
      let current = this

      axios({
        method: "POST",
        url: API_URL_COMPANY + "/projects/getByQuery",
        data: { ...payload, limit: 0 },
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          current.setState({ numberOfProjects: response.data.length })
        })
        .catch(error => {
          console.log(error)
        })
    },
    addProject(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/projects/add",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(async response => {
          await dispatch.dialog.setState({ loading: false })
          await current.setState({newProject:response.data.project})
          if (response.data.code == 1) {
            await current.setState({ success: true, error: false })
          } else if (response.data.code === 0) {
            await current.setState({ success: false, error: true })
          }
          // window.location.replace(BASE_URL + "/company/project")
        })
        .catch(error => {
          console.log(error)
        })
    },
    editProject(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/projects/update",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(async response => {
          await dispatch.dialog.setState({ loading: false })
          if (response.data.code === 1) {
            await current.setState({ success: true, error: false })
          } else if (response.data.code === 0) {
            await current.setState({ success: false, error: true })
          }
          // window.location.replace(BASE_URL + "/company/project")
        })
        .catch(error => {
          console.log(error)
        })
    },
    deleteProject(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      dispatch.slug.deleteSlug(payload)
      let current = this
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/projects/delete",
        data: {
          id: payload,
        },
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          dispatch.dialog.setState({ loading: false })
          console.log("delete success")
          current.setState({ success: true, error: false })
        })
        .catch(error => {
          console.log(error)
        })
    },
  }),
}
export default projects
