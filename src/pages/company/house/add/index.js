import React from "react"
import { Editor } from "@tinymce/tinymce-react"
import Layout from "../../../../components/layout"
import SEO from "../../../../components/seo"
import { Link } from "gatsby"
import {
  BASE_URL,
  EDITOR_API,
  houseTypes,
  houseFurnitures,
  typeSale,
  houseAvailable,
  limitPerRequest,
} from "../../../../setting"
import Uploader from "../../../../components/company/image/upload"
import Swal from "sweetalert2"
import Typography from "@material-ui/core/Typography"
import Breadcrumbs from "@material-ui/core/Breadcrumbs"
import Dialog from "@material-ui/core/Dialog"
import CircularProgress from "@material-ui/core/CircularProgress"
import Checkbox from "@material-ui/core/Checkbox"
import { connect } from "react-redux"
import { Button } from "@material-ui/core"
import ImageItem from "../../../../components/company/image/index"
import { Cookies } from "react-cookie"
import Autocomplete from "react-autocomplete"
import cities from "../../../../location/cities.json"
import districts from "../../../../location/districts.json"
import wards from "../../../../location/wards.json"
import slug from "slug"
import shortid from "shortid"
import { navigate } from "gatsby"
import EditorTinymce from "../../../../components/company/editorTinymce/editor"
const cookies = new Cookies();
const inter = "Inter"
let companyCode
if (cookies.get("user")) {
  companyCode = {
    companyCode: cookies.get("user").companyCode,
  }
}
class AddHouse extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      description: "",
      sumary: "",
      servicesArray: [],
      devicesArray: [],
      locationHouse: [],
      priceHouse: [],
      projectId: "",
      projectName: "",
      showHouseNumber: false,
      cityCode: 1,
      districtCode: 1,
      wardCode: 1,
      houseCode: "",
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.selectServices = this.selectServices.bind(this)
    this.selectDevices = this.selectDevices.bind(this)
    this.selectProject = this.selectProject.bind(this)
    this.selectLocationHouse = this.selectLocationHouse.bind(this)
    this.selectPriceHouse = this.selectPriceHouse.bind(this)
    this.handleHouseNumber = this.handleHouseNumber.bind(this)
    this.handleCity = this.handleCity.bind(this)
    this.handleDistrict = this.handleDistrict.bind(this)
    this.handleWard = this.handleWard.bind(this)
    this.handleDescription = this.handleDescription.bind(this)
    this.handleSumary = this.handleSumary.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
  handleInputChange(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value,
    })
  }
  generateSlug() {
    let word = `${this.state.type} ${this.state.projectName} ${this.state.name} `
    let id = shortid.generate()
    return `${slug(word, { lower: true })}-${id}`
  }
  handleDescription(content, editor) {
    this.setState({ description: content })
  }
  handleSumary(content, editor) {
    this.setState({ sumary: content })
  }
  handleHouseNumber(event) {
    if (event.target.checked === true) {
      this.setState({ showHouseNumber: true })
    } else {
      this.setState({ showHouseNumber: false })
    }
  }
  handleCity(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    let city = JSON.parse(value)
    const name = target.name
    this.setState({
      [name]: city.name,
    })
    this.setState({ cityCode: city.code })
  }
  handleDistrict(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    let district = JSON.parse(value)
    const name = target.name
    this.setState({
      [name]: district.name,
    })
    this.setState({ districtCode: district.code })
  }
  handleWard(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    let ward = JSON.parse(value)
    const name = target.name
    this.setState({
      [name]: ward.name,
    })
    this.setState({ wardCode: ward.code })
  }
  selectProject(event, project) {
    if (event.target.checked === true) {
      this.setState({ projectId: project._id, projectName: project.name })
    } else {
      this.setState({ projectId: "" })
    }
  }
  selectLocationHouse(event, id) {
    if (event.target.checked === true) {
      this.setState({ locationHouse: [...this.state.locationHouse, id] })
    } else {
      this.setState({
        locationHouse: this.state.locationHouse.filter(item => {
          return item !== id
        }),
      })
    }
  }
  selectPriceHouse(event, id) {
    if (event.target.checked === true) {
      this.setState({ priceHouse: [...this.state.priceHouse, id] })
    } else {
      this.setState({
        priceHouse: this.state.priceHouse.filter(item => {
          return item !== id
        }),
      })
    }
  }
  selectServices(event, id) {
    if (event.target.checked === true) {
      this.setState({ servicesArray: [...this.state.servicesArray, id] })
    } else {
      this.setState({
        servicesArray: this.state.servicesArray.filter(item => {
          return item !== id
        }),
      })
    }
  }
  selectDevices(event, id) {
    if (event.target.checked === true) {
      this.setState({ devicesArray: [...this.state.devicesArray, id] })
    } else {
      this.setState({
        devicesArray: this.state.devicesArray.filter(item => {
          return item !== id
        }),
      })
    }
  }
  async handleSubmit() {
    let data = {
      name: this.state.name,
      houseCode: this.state.houseCode,
      companyCode: this.state.companyCode,
      houseNumber: this.state.houseNumber,
      houseNumberActive: this.state.showHouseNumber,
      street: this.state.street,
      ward: this.state.ward,
      district: this.state.district,
      city: this.state.city,
      available: this.state.available,
      type: this.state.type,
      typeSale: this.state.typeSale,
      services: this.state.servicesArray,
      devices: this.state.devicesArray,
      images: this.props.storageImages,
      carouselImages: this.props.storageImages,
      description: this.state.description,
      sumary: this.state.sumary,
      keywords: this.state.keywords,
      searchWord:
        this.state.district == "undefined"
          ? this.change_alias(this.state.district)
          : "-",
      price: parseInt(this.state.price),
      longitude: parseFloat(this.state.longitude),
      latitude: parseFloat(this.state.latitude),
      similarListing: {
        list1: this.state.locationHouse || [],
        list2: this.state.priceHouse || [],
      },
      projectId: this.state.projectId,
      furniture: this.state.furniture,
      area: parseFloat(this.state.area),
      bedroom: parseInt(this.state.bedroom),
      bathroom: parseInt(this.state.bedroom),
      accommodate: parseInt(this.state.accommodate),
      date_post: new Date().getTime(),
      slug: this.generateSlug(),
    }
    await this.props.addHouse(data)
    await this.props.updateTotalHouse({
      id: this.props.settings._id,
      totalHouse: parseInt(this.props.settings.totalHouse) + 1,
    })
  }

  async componentDidMount() {
    this.props.loadProject(companyCode)
    this.props.loadHouses(companyCode)
    await this.props.loadSettings(companyCode)
    let defaultCode = `${
      this.props.settings.preFixHouse == undefined
        ? "SGR-HOUSE"
        : this.props.settings.preFixHouse
    }-${parseInt(this.props.settings.totalHouse) + 1}`
    this.setState({ houseCode: defaultCode })
    // Select menu
    this.props.selectMenu({ index: 2 })
    this.props.resetStorageImages()
    this.props.loadServices()
    this.props.loadDevices()
    if (cookies.get("user")) {
      this.setState({ companyCode: cookies.get("user").companyCode })
    }
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
          navigate(`/company/house?page=1`)
        },
      })
    } else if (this.props.error == true) {
      Swal.fire({
        title: "Failed!",
        text: "",
        type: "error",
        confirmButtonText: "Ok",
        onClose: () => {
          this.props.setHouseState({ error: false })
        },
      })
    }
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
      return <option value={JSON.stringify(city)}>{city.name}</option>
    })
    let listDistrict = Object.values(districts)
      .filter(item => {
        return item.parent_code == this.state.cityCode
      })
      .sort(function(a, b) {
        if (a.name < b.name) {
          return -1
        }
      })
      .map(district => {
        return <option value={JSON.stringify(district)}>{district.name}</option>
      })
    let listWards = Object.values(wards)
      .filter(item => {
        return item.parent_code == this.state.districtCode
      })
      .sort(function(a, b) {
        if (a.name < b.name) {
          return -1
        }
      })
      .map(ward => {
        return <option value={JSON.stringify(ward)}>{ward.name}</option>
      })
    let services = this.props.services
    
    .map(item => {
      return (
        <div className="col-md-3 amenities d-flex align-items-center">
          <Checkbox
            onChange={event => this.selectServices(event, item._id)}
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
        <SEO title={"Add new house"} />
        <div
          class={
            "main-content-wrap d-flex flex-column " + this.props.contentStatus
          }
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/company/house">House</Link>
            <Typography color="textPrimary">Add</Typography>
          </Breadcrumbs>
          <div class="breadcrumb d-flex justify-content-between">
            <h1>Add a new house</h1>
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
                    class="form-control"
                  />
                </div>
                <div class="col-md-12 form-group mb-3 d-flex flex-column">
                  <label className="input-label">Apartment code</label>
                  <input
                    type="text"
                    onChange={this.handleInputChange}
                    name="houseCode"
                    class="form-control"
                    value={this.state.houseCode}
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
                    value={this.state.companyCode}
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
                    />
                    <label
                      style={{ marginLeft: "10px", marginBottom: "0" }}
                      className="input-label"
                    >
                      Show:
                    </label>
                    <Checkbox
                      onChange={this.handleHouseNumber}
                      checked={this.state.showHouseNumber}
                      color="primary"
                      inputProps={{
                        "aria-label": "secondary checkbox",
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-12 row">
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
                    />
                  </div>
                </div>
                <div className="col-md-12 row">
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">Available</label>
                    <select
                      type="text"
                      onChange={this.handleInputChange}
                      name="available"
                      class="custom-select"
                    >
                      <option value="">Select one</option>
                      {houseAvailable.map(item => {
                        return <option value={item}>{item}</option>
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
                      <option value={""}>Type</option>
                      {houseTypes.map(type => {
                        return <option value={type}>{type}</option>
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
                      <option value={""}>Type Sale</option>
                      {typeSale.map(type => {
                        return <option value={type}>{type}</option>
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
                      <option value={""}>Furniture</option>
                      {houseFurnitures.map(furniture => {
                        return <option value={furniture}>{furniture}</option>
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-md-12 row">
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">Area</label>
                    <input
                      type="number"
                      onChange={this.handleInputChange}
                      name="area"
                      class="form-control"
                    />
                  </div>
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">Bathrooms</label>
                    <input
                      type="number"
                      onChange={this.handleInputChange}
                      name="bathroom"
                      class="form-control"
                    />
                  </div>
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">Bedrooms</label>
                    <input
                      type="number"
                      onChange={this.handleInputChange}
                      name="bedroom"
                      class="form-control"
                    />
                  </div>
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">Accommodate(s)</label>
                    <input
                      type="number"
                      onChange={this.handleInputChange}
                      name="accommodate"
                      class="form-control"
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
                  <EditorTinymce handleAction={this.handleDescription}/>
                </div>
                <div class="col-md-12 form-group mb-3 d-flex flex-column">
                  <label className="input-label">Sumary</label>
                   <EditorTinymce handleAction={this.handleSumary}/>
                </div>
                <div class="col-md-12 form-group mb-3 d-flex flex-column">
                  <label className="input-label">Key words</label>
                  <div className="d-flex ">
                    <input
                      type="text"
                      onChange={this.handleInputChange}
                      name="keywords"
                      class="col-md-3 form-control"
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
                    />
                    <div style={{ margin: "5px" }}>Latitude</div>
                    <input
                      type="text"
                      onChange={this.handleInputChange}
                      name="latitude"
                      class="form-control"
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
                  />
                </div>
                <div class="col-md-12 form-group mb-3 d-flex flex-column">
                  <label className="input-label">Project</label>
                  <div className="d-flex flex-wrap">
                    {this.props.projects.map(project => (
                      <div className="col-md-3 d-flex align-items-center">
                        <Checkbox
                          onChange={event => this.selectProject(event, project)}
                          checked={project._id === this.state.projectId}
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
                {/* <div class="col-md-12 form-group mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="input-label">Slug</label>
                    <Button onClick={this.generateSlug} color="primary">
                      Generate
                    </Button>
                  </div>
                  <input
                    type="text"
                    onChange={this.handleInputChange}
                    name="slug"
                    value={this.state.slug}
                    class="form-control"
                  />
                </div> */}
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
  projects: state.projects.projects,
  services: state.services.services,
  devices: state.devices.devices,
  storageImages: state.houses.storageImages,
  loading: state.dialog.loading,
  settings: state.settings.settings,
  contentStatus: state.menu.contentStatus,
  success: state.houses.success,
  error: state.houses.error,
  newHouse: state.houses.newHouse,
  isExist: state.slug.isExist,
  numberOfHouses: state.houses.numberOfHouses,
})
const mapDispatch = dispatch => ({
  loadProject: dispatch.projects.loadProject,
  loadHouses: dispatch.houses.loadHouses,
  loadSettings: dispatch.settings.loadSettings,
  loadServices: dispatch.services.loadServices,
  loadDevices: dispatch.devices.loadDevices,
  resetStorageImages: dispatch.houses.resetStorageImages,
  deleteHouseImage: dispatch.houses.deleteHouseImage,
  addHouse: dispatch.houses.addHouse,
  selectMenu: dispatch.menu.setState,
  updateTotalHouse: dispatch.settings.updateTotalHouse,
  setHouseState: dispatch.houses.setState,
  checkSlug: dispatch.slug.checkSlug,
  addSlug: dispatch.slug.addSlug,
  setSlugState: dispatch.slug.setState,
})
export default connect(mapState, mapDispatch)(AddHouse)
