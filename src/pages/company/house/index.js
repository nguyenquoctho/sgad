import React from "react"
import { Link } from "gatsby"
import "./style.css"
import Layout from "../../../components/layout"
import SEO from "../../../components/seo"
import { houseAvailable, limitPerRequest } from "../../../setting"

import Swal from "sweetalert2"
import LoadingContainer from "../../../components/loading/loading.js"
import { connect } from "react-redux"
import { Cookies } from "react-cookie"
const cookies = new Cookies()
let companyCode
if (cookies.get("user")) {
  companyCode = {
    companyCode: cookies.get("user").companyCode,
  }
}
class HousePage extends React.Component {
  constructor(props) {
    super(props)
    this.deleteHouse = this.deleteHouse.bind(this)
    this.changePage = this.changePage.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.showAll = this.showAll.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }
  async componentDidMount() {
    // Select menu
    this.props.selectMenu({ index: 2 })
    this.props.loadHouses(companyCode)
    let page = await new URL(window.location.href).searchParams.get("page")
    await this.props.loadHousesByQuery({ page: page || 1 })
    await this.props.loadSettings(companyCode)
  }
  async deleteHouse(id, images) {
    const { query } = this.props
    let data = {
      id: id,
    }
    await this.props.deleteHouse(data)
    if (images.length > 0) {
      images.map(image => {
        let data = {
          imageUrl: image,
          type: "house",
        }
        this.props.deleteImage(data)
      })
    }

    this.props.loadHousesByQuery(query)
    await this.props.updateTotalHouse({
      id: this.props.settings._id,
      totalHouse: parseInt(this.props.settings.totalHouse) - 1,
    })
  }
  changePage(page) {
    const { query } = this.props
    this.props.loadHousesByQuery({ ...query, page: page })
    window.history.pushState({}, "", `?page=${page}`)
  }
  handleSearch(event) {
    window.history.pushState({}, "", `?page=1`)
    if (event.keyCode === 13) {
      const { query } = this.props.query
      this.props.loadHousesByQuery({
        ...query,
        page: 1,
        query: {
          $text: {
            $search: event.target.value,
          },
        },
      })
    }
  }
  showAll() {
    window.history.pushState({}, "", `?page=1`)
    this.props.loadHousesByQuery({ page: 1 })
  }
  handleInputChange(event, house) {
    let data = {
      id: house._id,
      name: house.name,
      houseCode: house.houseCode,
      companyCode: house.companyCode,
      houseNumber: house.houseNumber,
      houseNumberActive: house.houseNumberActive,
      street: house.street,
      ward: house.ward,
      district: house.district,
      city: house.city,
      available: event.target.value,
      type: house.type,
      typeSale: house.typeSale,
      services: house.houseServices,
      devices: house.houseDevices,
      images: house.storageImages,
      carouselImages: house.storageImages,
      description: house.description,
      sumary: house.sumary,
      keywords: house.keywords,
      searchWord: house.searchWord,
      price: parseInt(house.price),
      longitude: parseFloat(house.longitude),
      latitude: parseFloat(house.latitude),
      similarListing: house.similarListing,
      projectId: house.projectId,
      furniture: house.furniture,
      area: parseFloat(house.area),
      bedroom: parseInt(house.bedroom),
      bathroom: parseInt(house.bedroom),
      accommodate: parseInt(house.accommodate),
      date_post: house.date_post,
    }
    this.props.editHouse(data)
  }
  render() {
    if (this.props.success == true) {
      Swal.fire({
        title: "Success!",
        text: "",
        type: "success",
        confirmButtonText: "Ok",
        onClose: async () => {
          await this.props.setHouseState({ success: false })
        },
      })
    }
    let numberOfPage = []
    for (
      var i = 0;
      i < Math.ceil(this.props.numberOfHouses / limitPerRequest);
      i++
    ) {
      numberOfPage.push(i)
    }
    let pagination = numberOfPage.map(item => {
      let active
      if (item == this.props.query.page - 1) {
        active = "active"
      } else {
        active = ""
      }
      return (
        <>
          <li class={"page-item " + active}>
            <a class="page-link" onClick={() => this.changePage(item + 1)}>
              {item + 1}
            </a>
          </li>
        </>
      )
    })
    let listHouse = this.props.housesByQuery.map((house, index) => {
      return (
        <>
          <tr>
            <td>{limitPerRequest * (this.props.query.page - 1) + index + 1}</td>
            <td>{house.houseCode}</td>
            <td>{house.houseNumber}</td>
            <td>
              <select
                type="text"
                onChange={event => this.handleInputChange(event, house)}
                name="available"
                class="custom-select"
              >
                {houseAvailable.map(item => {
                  return (
                    <option selected={house.available === item} value={item}>
                      {item}
                    </option>
                  )
                })}
              </select>
            </td>
            <td>
              <div class="d-flex">
                <Link
                  to={`/company/house/edit?id=${house._id}`}
                  type="button"
                  class="action-btn btn btn-outline-primary btn-sm custom m-1"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  class="action-btn btn btn-outline-danger btn-sm custom m-1"
                  onClick={() => this.deleteHouse(house._id, house.images)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </>
      )
    })
    return (
      <Layout role="company">
        <SEO title="House" />
        <div
          class={
            "main-content-wrap d-flex flex-column " + this.props.contentStatus
          }
        >
          <div class="breadcrumb d-flex justify-content-between">
            <h1>Houses</h1>
            <Link
              to="/company/house/add"
              type="button"
              class="btn btn-outline-primary m-1"
            >
              New
            </Link>
          </div>
          <div class="separator-breadcrumb border-top"></div>
          <div className="flex-grow-1">
            <div class="card text-left">
              <div className="card-body">
                <div class="table-responsive">
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      onClick={this.showAll}
                      className="btn btn-raised btn-raised-primary btn-sm btn-rounded m-1"
                    >
                      Show all
                    </button>
                    <div>
                      <label>
                        Search:
                        <input
                          name="search"
                          class="form-control form-control-sm"
                          onKeyDown={this.handleSearch}
                          aria-controls="zero_configuration_table"
                        />
                      </label>
                    </div>
                  </div>
                  <table
                    id="zero_configuration_table"
                    class="display table table-striped table-bordered"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th></th>
                        <th>Apartment Code</th>
                        <th>House Number</th>
                        <th>Available</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>{listHouse}</tbody>
                  </table>
                  <div class="col-md-12 mt-5 text-center">
                    <ul class="pagination d-inline-flex">{pagination}</ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}
const mapState = state => ({
  houses: state.houses.houses,
  loading: state.dialog.loading,
  contentStatus: state.menu.contentStatus,
  housesByQuery: state.houses.housesByQuery,
  numberOfHouses: state.houses.numberOfHouses,
  settings: state.settings.settings,
  query: state.houses.query,
  success: state.houses.success,
  error: state.houses.error,
})
const mapDispatch = dispatch => ({
  loadHouses: dispatch.houses.loadHouses,
  loadSettings: dispatch.settings.loadSettings,
  deleteHouse: dispatch.houses.deleteHouse,
  deleteImage: dispatch.upload.deleteImage,
  editHouse: dispatch.houses.editHouse,
  selectMenu: dispatch.menu.setState,
  setQuery: dispatch.houses.setQuery,
  loadHousesByQuery: dispatch.houses.loadHousesByQuery,
  updateTotalHouse: dispatch.settings.updateTotalHouse,
  setHouseState: dispatch.houses.setState,
})
export default connect(mapState, mapDispatch)(HousePage)
