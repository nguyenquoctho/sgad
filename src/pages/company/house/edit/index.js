import React from "react"
import { Editor } from "@tinymce/tinymce-react"
import Layout from "../../../../components/layout"
import SEO from "../../../../components/seo"
import {
  BASE_URL,
  EDITOR_API,
  houseTypes,
  houseFurnitures,
  typeSale,
  houseAvailable,
} from "../../../../setting"
import Uploader from "../../../../components/company/image/upload"
import Typography from "@material-ui/core/Typography"
import Breadcrumbs from "@material-ui/core/Breadcrumbs"
import Swal from "sweetalert2"
import { Link } from "gatsby"
import Checkbox from "@material-ui/core/Checkbox"
import { connect } from "react-redux"
import { Button } from "@material-ui/core"
import Dialog from "@material-ui/core/Dialog"
import CircularProgress from "@material-ui/core/CircularProgress"
import ImageItem from "../../../../components/company/image/index"
import { Cookies } from "react-cookie"
import cities from "../../../../location/cities.json"
import districts from "../../../../location/districts.json"
import wards from "../../../../location/wards.json"
import slug from "slug"
import shortid from "shortid"
import { navigate } from "gatsby"
import EditorTinymce from "../../../../components/company/editorTinymce/editor"
const cookies = new Cookies()
let companyCode
if (cookies.get("user")) {
  companyCode = {
    companyCode: cookies.get("user").companyCode,
  }
}

class EditHouse extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      description: "",
      sumary: "",
      showHouseNumber: false,
      cityCode: 0,
      districtCode: 0,
      wardCode: 0,
      projectName: "",
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.selectDevices = this.selectDevices.bind(this)
    this.selectServices = this.selectServices.bind(this)
    this.selectProject = this.selectProject.bind(this)
    this.selectLocationHouse = this.selectLocationHouse.bind(this)
    this.selectPriceHouse = this.selectPriceHouse.bind(this)
    this.handleDescription = this.handleDescription.bind(this)
    this.handleSumary = this.handleSumary.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleHouseNumber = this.handleHouseNumber.bind(this)
    this.handleCity = this.handleCity.bind(this)
    this.handleDistrict = this.handleDistrict.bind(this)
    this.handleWard = this.handleWard.bind(this)
    this.setLocation = this.setLocation.bind(this)
    this.change_alias = this.change_alias.bind(this)
    this.generateSlug = this.generateSlug.bind(this)
  }
  change_alias(alias) {
    var str = alias
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i")
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
    str = str.replace(/đ/g, "d")
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A")
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E")
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I")
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O")
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U")
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y")
    str = str.replace(/Đ/g, "D")
    return str
  }
  generateSlug(name) {
    let house = this.props.houseById
    let word = `${house.type} ${this.state.projectName} ${name}`
    let id = shortid.generate()
    this.props.handleInputHouse({
      slug: `${slug(word, { lower: true })}-${id}`,
    })
  }
  handleInputChange(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name
    this.props.handleInputHouse({
      [name]: value,
    })
    if (name === "name") {
      this.generateSlug(value)
    }
  }
  setLocation(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name
    this.props.setLocation({
      [name]: value,
    })
  }
  handleDescription(content, editor) {
    this.setState({ description: content })
  }
  handleSumary(content, editor) {
    this.setState({ sumary: content })
  }
  handleHouseNumber(event) {
    this.props.changeHouseNumberActive(event.target.checked)
  }
  handleCity(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    let city = JSON.parse(value)
    const name = target.name
    this.props.handleInputHouse({
      [name]: city.name,
    })
    this.setState({ cityCode: city.code })
  }
  handleDistrict(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    let district = JSON.parse(value)
    const name = target.name
    this.props.handleInputHouse({
      [name]: district.name,
    })
    this.setState({ districtCode: district.code })
  }
  handleWard(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    let ward = JSON.parse(value)
    const name = target.name
    this.props.handleInputHouse({
      [name]: ward.name,
    })
    this.setState({ wardCode: ward.code })
  }
  selectProject(event, project) {
    if (event.target.checked === true) {
      this.props.selectProject(project._id)
      this.setState({ projectName: project.name })
    }
  }
  selectLocationHouse(event, id) {
    if (event.target.checked === true) {
      this.props.addLocationHouse(id)
    } else {
      this.props.deleteLocationHouse(id)
    }
  }
  selectPriceHouse(event, id) {
    if (event.target.checked === true) {
      this.props.addPriceHouse(id)
    } else {
      this.props.deletePriceHouse(id)
    }
  }
  selectDevices(event, id) {
    if (event.target.checked === true) {
      this.props.addDevices(id)
    } else {
      this.props.deleteDevices(id)
    }
  }
  selectServices(event, id) {
    if (event.target.checked === true) {
      this.props.addServices(id)
    } else {
      this.props.deleteServices(id)
    }
  }

  async handleSubmit() {
    let houseById = this.props.houseById
    let data = {
      id: houseById._id,
      name: houseById.name,
      houseCode: houseById.houseCode,
      companyCode: houseById.companyCode,
      houseNumber: houseById.houseNumber,
      houseNumberActive: this.props.houseNumberActive,
      street: houseById.street,
      ward: houseById.ward,
      district: houseById.district,
      city: houseById.city,
      available: houseById.available,
      type: this.state.type ? this.state.type : houseById.type,
      typeSale: this.state.typeSale ? this.state.typeSale : houseById.typeSale,
      services: this.props.houseServices,
      devices: this.props.houseDevices,
      images: this.props.storageImages,
      carouselImages: this.props.storageImages,
      description: this.state.description
        ? this.state.description
        : houseById.description,
      sumary: this.state.sumary ? this.state.sumary : houseById.sumary,
      keywords: houseById.keywords,
      searchWord:
        houseById.district === "undefined"
          ? this.change_alias(houseById.district)
          : "-",
      price: parseInt(houseById.price),
      longitude: parseFloat(houseById.longitude),
      latitude: parseFloat(houseById.latitude),
      similarListing: {
        list1: this.props.locationHouse || [],
        list2: this.props.priceHouse || [],
      },
      projectId: this.props.projectId,
      furniture: houseById.furniture,
      area: parseFloat(houseById.area),
      bedroom: parseInt(houseById.bedroom),
      bathroom: parseInt(houseById.bedroom),
      accommodate: parseInt(houseById.accommodate),
      date_post: houseById.date_post,
      slug: houseById.slug,
    }
    await this.props.editHouse(data)
  }

  async componentDidMount() {
    let projectId = new URL(window.location.href).searchParams.get("id")
    await this.props.loadProject(companyCode)
    // Select menu
    await this.props.selectMenu({ index: 2 })
    await this.props.loadHouses(companyCode)
    await this.props.loadHouseById(projectId)
    await this.props.loadDevices()
    await this.props.loadServices()
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
          navigate(`/company/house?page=${this.props.query.page}`)
        },
      })
    } else if (this.props.error == true) {
      Swal.fire({
        title: "Failed!",
        text: "",
        type: "error",
        confirmButtonText: "Ok",
        onClose: () => {
          this.props.setBlogState({ error: false })
        },
      })
    } else if (this.props.isExist === "true") {
      Swal.fire({
        title: "Your slug is exist!",
        text: "",
        type: "error",
        confirmButtonText: "Ok",
        onClose: () => {
          this.props.setSlugState({ isExist: "" })
        },
      })
    }
    let codeOfCity
    let codeOfDistrict
    let { houseById } = this.props
    let popularCities = Object.values(cities).filter(item => {
      return (
        item.code == "79" ||
        item.code == "01" ||
        item.code == "48" ||
        item.code == "56" ||
        item.code == "91"
      )
    })
    let otherCities = Object.values(cities).filter(item => {
      return (
        item.code != "79" &&
        item.code != "01" &&
        item.code != "48" &&
        item.code != "56" &&
        item.code != "91"
      )
    })
    let listCities = [...popularCities, ...otherCities.sort()].map(city => {
      if (city.name == houseById.city) {
        codeOfCity = city.code
      }
      return (
        <option
          selected={city.name == houseById.city}
          value={JSON.stringify(city)}
        >
          {city.name}
        </option>
      )
    })
    let listDistrict = Object.values(districts)
      .filter(item => {
        let checkCode =
          this.state.cityCode != 0 ? this.state.cityCode : codeOfCity
        return item.parent_code == checkCode
      })
      .sort(function(a, b) {
        if (a.name < b.name) {
          return -1
        }
      })
      .map(district => {
        if (district.name == houseById.district) {
          codeOfDistrict = district.code
        }
        return (
          <option
            selected={district.name == houseById.district}
            value={JSON.stringify(district)}
          >
            {district.name}
          </option>
        )
      })
    let listWards = Object.values(wards)
      .filter(item => {
        let checkCode =
          this.state.districtCode != 0
            ? this.state.districtCode
            : codeOfDistrict
        return item.parent_code == checkCode
      })
      .sort(function(a, b) {
        if (a.name < b.name) {
          return -1
        }
      })
      .map(ward => {
        return (
          <option
            selected={ward.name == houseById.ward}
            value={JSON.stringify(ward)}
          >
            {ward.name}
          </option>
        )
      })
    let services = this.props.services
    .map(item => {
      return (
        <div className="col-md-3 amenities d-flex align-items-center">
          <Checkbox
            onChange={event => this.selectServices(event, item._id)}
            checked={this.props.houseServices.indexOf(item._id) != -1}
            color="primary"
            inputProps={{
              "aria-label": "secondary checkbox",
            }}
          />
          <img
            style={{ margin: "0 5px 0 0", width: "24px", height: "24px" }}
            src={BASE_URL + item.icon}
          />
          {item.name}
        </div>
      )
    })
    let devices = this.props.devices.map(item => {
      return (
        <div className="col-md-3 amenities d-flex align-items-center">
          <Checkbox
            onChange={event => this.selectDevices(event, item._id)}
            checked={this.props.houseDevices.indexOf(item._id) != -1}
            color="primary"
            inputProps={{
              "aria-label": "secondary checkbox",
            }}
          />
          <img
            style={{ margin: "0 5px 0 0", width: "24px", height: "24px" }}
            src={BASE_URL + item.icon}
          />
          {item.name}
        </div>
      )
    })

    let housePreview = this.props.storageImages.map((item, index) => {
      return (
        <ImageItem
          url={item}
          type={"house"}
          deleteHouseImage={this.props.deleteHouseImage}
        />
      )
    })
    return (
      <Layout role="company">
        <SEO title={houseById.houseCode} />
        <div
          class={
            "main-content-wrap d-flex flex-column " + this.props.contentStatus
          }
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/company/house">House</Link>
            <Typography color="textPrimary">Edit</Typography>
          </Breadcrumbs>
          <div class="breadcrumb d-flex justify-content-between">
            <h1>Edit house</h1>
          </div>
          <div class="separator-breadcrumb border-top"></div>
          <div className="flex-grow-1">
            <div class="card text-left">
              <div className="card-body">
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">House name</label>
                  <input
                    type="text"
                    onChange={this.handleInputChange}
                    name="name"
                    value={houseById.name}
                    class="form-control"
                    placeholder={houseById.name}
                  />
                </div>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">Apartment code</label>
                  <input
                    type="text"
                    onChange={this.handleInputChange}
                    name="houseCode"
                    class="form-control"
                    value={houseById.houseCode}
                  />
                </div>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">Company code</label>
                  <input
                    type="text"
                    onChange={this.handleInputChange}
                    name="companyCode"
                    class="form-control"
                    disabled
                    value={houseById.companyCode}
                  />
                </div>

                <div class="col-md-4 form-group mb-3">
                  <label className="input-label">House number</label>
                  <div className="d-flex align-items-center">
                    <input
                      type="text"
                      onChange={this.handleInputChange}
                      name="houseNumber"
                      class="form-control"
                      value={houseById.houseNumber}
                    />
                    <label
                      style={{ marginLeft: "10px" }}
                      className="input-label"
                    >
                      Show:
                    </label>
                    <Checkbox
                      color="primary"
                      onChange={event =>
                        this.props.changeHouseNumberActive(
                          !this.props.houseNumberActive
                        )
                      }
                      checked={this.props.houseNumberActive}
                      inputProps={{
                        "aria-label": "secondary checkbox",
                      }}
                    />
                  </div>
                </div>
                <div class="col-md-12 row">
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">City</label>
                    <select
                      type="text"
                      onChange={this.handleCity}
                      name="city"
                      class="custom-select"
                    >
                      <option value="" selected>
                        City/Province
                      </option>
                      {listCities}
                    </select>
                  </div>
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">District</label>
                    <select
                      type="text"
                      onChange={this.handleDistrict}
                      name="district"
                      class="custom-select"
                    >
                      <option value="" selected>
                        Districts
                      </option>
                      {listDistrict}
                    </select>
                  </div>
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">Ward</label>
                    <select
                      type="text"
                      onChange={this.handleWard}
                      name="ward"
                      class="custom-select"
                    >
                      <option value="" selected>
                        Ward
                      </option>
                      {listWards}
                    </select>
                  </div>
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">Street</label>
                    <input
                      type="text"
                      onChange={this.handleInputChange}
                      name="street"
                      class="form-control"
                      value={houseById.street}
                    />
                  </div>
                </div>
                <div class="col-md-12 row">
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">Available</label>
                    <select
                      type="text"
                      onChange={this.handleInputChange}
                      name="available"
                      class="custom-select"
                    >
                      {houseAvailable.map(item => {
                        return (
                          <option
                            selected={houseById.available == item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">Type</label>
                    <select
                      id="theme_selector"
                      name="type"
                      class="custom-select"
                      onChange={this.handleInputChange}
                    >
                      {houseTypes.map(type => {
                        return (
                          <option
                            selected={houseById.type == type}
                            value={type}
                          >
                            {type}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">Type Sale</label>
                    <select
                      id="theme_selector"
                      name="typeSale"
                      class="custom-select"
                      onChange={this.handleInputChange}
                    >
                      {typeSale.map(type => {
                        return (
                          <option
                            selected={type == houseById.typeSale}
                            value={type}
                          >
                            {type}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">Furniture</label>
                    <select
                      id="theme_selector"
                      name="furniture"
                      class="custom-select"
                      onChange={this.handleInputChange}
                    >
                      {houseFurnitures.map(item => {
                        return (
                          <option
                            selected={item == houseById.furniture}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </div>
                <div class="col-md-12 row">
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">Area</label>
                    <input
                      type="number"
                      onChange={this.handleInputChange}
                      name="area"
                      class="form-control"
                      value={houseById.area}
                    />
                  </div>
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">Bathrooms</label>
                    <input
                      type="number"
                      onChange={this.handleInputChange}
                      name="bathroom"
                      class="form-control"
                      value={houseById.bathroom}
                    />
                  </div>
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">Bedrooms</label>
                    <input
                      type="number"
                      onChange={this.handleInputChange}
                      name="bedroom"
                      class="form-control"
                      value={houseById.bedroom}
                    />
                  </div>
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">Accommodate(s)</label>
                    <input
                      type="number"
                      onChange={this.handleInputChange}
                      name="accommodate"
                      class="form-control"
                      value={houseById.accommodate}
                    />
                  </div>
                </div>

                <div class="col-md-12 form-group mb-3 d-flex flex-column">
                  <label style={{ marginLeft: "10px" }} className="input-label">
                    Devices and Uitilities
                  </label>
                  <div className="row d-flex"> {devices}</div>
                </div>
                <div class="col-md-12 form-group mb-3 d-flex flex-column">
                  <label style={{ marginLeft: "10px" }} className="input-label">
                  Building Amenities {" "}
                  </label>
                  <div className="row d-flex">{services}</div>
                </div>

                <div class="col-md-12 form-group mb-3 d-flex flex-column">
                  <label className="input-label">House's images</label>
                  <Uploader type={"house"} />

                  <div className="house-preview d-flex flex-wrap">
                    {housePreview}
                  </div>
                </div>

                <div class="col-md-12 form-group mb-3 d-flex flex-column">
                  <label className="input-label">Desciption</label>
                  <EditorTinymce value={this.props.houseById.description} handleAction={this.handleDescription} />
                </div>
                <div class="col-md-12 form-group mb-3 d-flex flex-column">
                  <label className="input-label">Sumary</label>
                  <EditorTinymce value={this.props.houseById.sumary} handleAction={this.handleSumary} />
                </div>
                <div class="col-md-12 form-group mb-3 d-flex flex-column">
                  <label className="input-label">Key words</label>
                  <div className="d-flex ">
                    <input
                      type="text"
                      onChange={this.handleInputChange}
                      name="keywords"
                      class="col-md-3 form-control"
                      value={houseById.keywords}
                    />
                  </div>
                </div>
                <div class="col-md-6 form-group mb-3 ">
                  <label className="input-label">Location</label>
                  <div className="d-flex align-items-center">
                    <div style={{ margin: "5px" }}>Longitude</div>
                    <input
                      type="text"
                      onChange={this.handleInputChange}
                      name="longitude"
                      class="form-control"
                      value={houseById.longitude}
                    />
                    <div style={{ margin: "5px" }}>Latitude</div>
                    <input
                      type="text"
                      onChange={this.handleInputChange}
                      name="latitude"
                      class="form-control"
                      value={houseById.latitude}
                    />
                  </div>
                </div>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">Price</label>
                  <input
                    type="text"
                    onChange={this.handleInputChange}
                    name="price"
                    class="form-control"
                    value={houseById.price}
                  />
                </div>
                <div class="col-md-12 form-group mb-3 d-flex flex-column">
                  <label className="input-label">Project</label>
                  <div className="d-flex flex-wrap">
                    {this.props.projects.map(project => (
                      <div className="col-md-3 d-flex align-items-center">
                        <Checkbox
                          onChange={event => this.selectProject(event, project)}
                          checked={this.props.projectId === project._id}
                          color="primary"
                          inputProps={{
                            "aria-label": "secondary checkbox",
                          }}
                        />
                        {project.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div class="col-md-12 form-group mb-3 d-flex flex-column"></div>
                <Button
                  onClick={this.handleSubmit}
                  variant="contained"
                  color="primary"
                >
                  Save
                </Button>
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
  projectId: state.houses.houseProject,
  projects: state.projects.projects,
  houseById: state.houses.houseById,
  currentSlug: state.houses.currentSlug,
  houseNumberActive: state.houses.houseNumberActive,
  devices: state.devices.devices,
  services: state.services.services,
  houseServices: state.houses.services,
  houseDevices: state.houses.devices,
  storageImages: state.houses.storageImages,
  locationHouse: state.houses.locationHouse,
  priceHouse: state.houses.priceHouse,
  loading: state.dialog.loading,
  contentStatus: state.menu.contentStatus,
  success: state.houses.success,
  error: state.houses.error,
  isExist: state.slug.isExist,
  query: state.houses.query,
})
const mapDispatch = dispatch => ({
  loadProject: dispatch.projects.loadProject,
  loadHouses: dispatch.houses.loadHouses,
  loadHouseById: dispatch.houses.loadHouseById,
  loadServices: dispatch.services.loadServices,
  loadDevices: dispatch.devices.loadDevices,
  editHouse: dispatch.houses.editHouse,
  deleteHouseImage: dispatch.houses.deleteHouseImage,
  addServices: dispatch.houses.addServices,
  deleteServices: dispatch.houses.deleteServices,
  addDevices: dispatch.houses.addDevices,
  deleteDevices: dispatch.houses.deleteDevices,
  selectProject: dispatch.houses.selectProject,
  addLocationHouse: dispatch.houses.addLocationHouse,
  deleteLocationHouse: dispatch.houses.deleteLocationHouse,
  addPriceHouse: dispatch.houses.addPriceHouse,
  deletePriceHouse: dispatch.houses.deletePriceHouse,
  handleInputHouse: dispatch.houses.handleInputHouse,
  changeHouseNumberActive: dispatch.houses.changeHouseNumberActive,
  setLocation: dispatch.houses.setLocation,
  selectMenu: dispatch.menu.setState,
  setHouseState: dispatch.houses.setState,
  checkSlug: dispatch.slug.checkSlug,
  addSlug: dispatch.slug.addSlug,
  updateSlug: dispatch.slug.updateSlug,
  setSlugState: dispatch.slug.setState,
})
export default connect(mapState, mapDispatch)(EditHouse)
