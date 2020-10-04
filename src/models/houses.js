import { API_URL_COMPANY, limitPerRequest } from "../setting"
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
const houses = {
  state: {
    houses: [],
    storageImages: [],
    services: [],
    devices: [],
    houseProject: "",
    locationHouse: [],
    priceHouse: [],
    housesByQuery: [],
    numberOfHouses: "",
    houseNumberActive: true,
    query: {
      limit: limitPerRequest,
      page: 1,
      query: {},
      sort: "",
    },
    houseById: {
      images: [],
      carouselImages: [],
      amenities: [],
      facilities: [],
    },
    newHouse: {},
    success: false,
    error: "",
    currentSlug: "",
  },
  reducers: {
    setState(state, payload) {
      state = { ...state, ...payload }
      return { ...state }
    },
    handleInputHouse(state, payload) {
      state.houseById = { ...state.houseById, ...payload }
      return { ...state }
    },
    setLocation(state, payload) {
      state.houseById.location = { ...state.houseById.location, ...payload }
      return { ...state }
    },
    addImages(state, payload) {
      state.storageImages = [...state.storageImages, payload]
      return { ...state }
    },
    deleteImages(state, payload) {
      state.storageImages = state.storageImages.filter(item => {
        return item != payload
      })
      return { ...state }
    },
    addDevices(state, payload) {
      state.devices = [...state.devices, payload]
      return { ...state }
    },
    deleteDevices(state, payload) {
      state.devices = state.devices.filter(item => {
        return item != payload
      })
      return { ...state }
    },
    addServices(state, payload) {
      state.services = [...state.services, payload]
      return { ...state }
    },
    deleteServices(state, payload) {
      state.services = state.services.filter(item => {
        return item != payload
      })
      return { ...state }
    },
    selectProject(state, payload) {
      state.houseProject = payload
      return { ...state }
    },
    addLocationHouse(state, payload) {
      state.locationHouse = [...state.locationHouse, payload]
      return { ...state }
    },
    deleteLocationHouse(state, payload) {
      state.locationHouse = state.locationHouse.filter(item => {
        return item != payload
      })
      return { ...state }
    },
    addPriceHouse(state, payload) {
      state.priceHouse = [...state.priceHouse, payload]
      return { ...state }
    },
    deletePriceHouse(state, payload) {
      state.priceHouse = state.priceHouse.filter(item => {
        return item != payload
      })
      return { ...state }
    },
    changeHouseNumberActive(state, payload) {
      state.houseNumberActive = payload
      return { ...state }
    },

    resetStorageImages(state, payload) {
      state.storageImages = []
      return { ...state }
    },
    setQueryPage(state, payload) {
      state.query.page = payload
      return { ...state }
    },
    setQuery(state, payload) {
      state.query = payload
      return { ...state }
    },
  },
  effects: dispatch => ({
    loadHouses(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      axios
        .get(API_URL_COMPANY + "/houses", {
          params: payload,
          headers: {
            Authorization: cookies.get("token"),
          },
        })
        .then(response => {
          dispatch.dialog.setState({ loading: false })
          dispatch.settings.setTotalHouses(response.data.length)
          current.setState({ houses: response.data })
        })
        .catch(error => console.log(error))
    },
    loadHouseById(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      axios
        .get(API_URL_COMPANY + "/houses/get?id=" + payload, {
          headers: {
            Authorization: cookies.get("token"),
          },
        })
        .then(response => {
          dispatch.dialog.setState({ loading: false })
          current.setState({
            houseById: response.data,
            storageImages: response.data.images,
            services: response.data.services,
            devices: response.data.devices,
            houseProject: response.data.projectId,
            locationHouse: response.data.similarListing.list1,
            priceHouse: response.data.similarListing.list2,
            houseNumberActive: response.data.houseNumberActive,
            currentSlug: response.data.slug,
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    addHouse(payload, rootState) {
      let current = this
      dispatch.dialog.setState({ loading: true })
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/houses/add",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(async response => {
          await current.setState({ newHouse: response.data.house })
          await dispatch.dialog.setState({ loading: false })
          if (response.data.code === 1) {
            await current.setState({ success: true, error: false })
          } else if (response.data.code === 0) {
            await current.setState({ success: false, error: true })
          }
        })
        .catch(error => console.log(error))
    },
    editHouse(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/houses/update",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          dispatch.dialog.setState({ loading: false })
          console.log(response.data)
          if (response.data.code === 1) {
            current.setState({ success: true, error: false })
          } else if (response.data.code === 0) {
            current.setState({ success: false, error: true })
          }
        })
        .catch(error => console.log(error))
    },
    deleteHouse(payload, rootState) {
      let current = this
      dispatch.dialog.setState({ loading: true })
      dispatch.slug.deleteSlug(payload)
      axios({
        method: "POST",
        url: API_URL_COMPANY + "houses/delete",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          dispatch.dialog.setState({ loading: false })
          current.setState({ success: true, error: false })
        })
        .catch(error => {
          current.setState({ success: false, error: true })
          console.log(error)
        })
    },
    deleteHouseImage(payload, rootState) {
      this.deleteImages(payload)
    },
    addHouseImage(payload, rootState) {
      this.addImages(payload)
    },
    loadHousesByQuery(payload, rootState) {
      let current = this
      dispatch.dialog.setState({ loading: true })
      this.setQuery(payload)
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/houses/listCompanyHouses",
        data: { ...payload, pageSize: 15, sort: "-date_post" },
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          dispatch.dialog.setState({ loading: false })
          current.setState({
            housesByQuery: response.data.rows,
            numberOfHouses: response.data.total,
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    loadHousesByQueryNoLimit(payload, rootState) {
      let current = this
      let noLimit = {
        ...payload,
        limit: 0,
        page: 0,
      }
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/houses/loadHouses",
        data: noLimit,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          current.setState({ numberOfHouses: response.data.length })
        })
        .catch(error => {
          console.log(error)
        })
    },
  }),
}
export default houses
