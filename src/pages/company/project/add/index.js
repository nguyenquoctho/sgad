import React from "react"
import { Editor } from "@tinymce/tinymce-react"
import Layout from "../../../../components/layout"
import SEO from "../../../../components/seo"
import {
  BASE_URL,
  API_URL,
  EDITOR_API,
  limitPerRequest,
} from "../../../../setting"
import Uploader from "../../../../components/company/image/upload"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import Typography from "@material-ui/core/Typography"
import Breadcrumbs from "@material-ui/core/Breadcrumbs"
import { Link } from "gatsby"
import Swal from "sweetalert2"
import CircularProgress from "@material-ui/core/CircularProgress"
import Dropzone from "react-dropzone"
import Checkbox from "@material-ui/core/Checkbox"
import ImageItem from "../../../../components/company/image"
import cities from "../../../../location/cities.json"
import districts from "../../../../location/districts.json"
import wards from "../../../../location/wards.json"
import { Cookies } from "react-cookie"
import { connect } from "react-redux"
import slug from "slug"
import { navigate } from "gatsby"
const cookies = new Cookies()
let companyCode
if (cookies.get("user")) {
  companyCode = {
    companyCode: cookies.get("user").companyCode,
  }
}
class AddProject extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      description: "",
      openDialog: false,
      similarProjects: [],
      hotProject: false,
      amenitiesArray: [],
      similarProjectsArray: [],
      image: "",
      companyCode: "",
      activeLoading: false,
      cityCode: 1,
      districtCode: 1,
      wardCode: 1,
      projectCode: "",
    }
    this.handleHotProject = this.handleHotProject.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleDescription = this.handleDescription.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.selectAmenities = this.selectAmenities.bind(this)
    this.selectSimilarProject = this.selectSimilarProject.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCity = this.handleCity.bind(this)
    this.handleDistrict = this.handleDistrict.bind(this)
    this.handleWard = this.handleWard.bind(this)
    this.generateSlug = this.generateSlug.bind(this)
  }
  generateSlug() {
    let word = `${this.state.city} ${this.state.name}`
    this.setState({ slug: slug(word, { lower: true }) })
  }
  handleInputChange(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value,
    })
  }
  selectAmenities(event, id) {
    if (event.target.checked === true) {
      this.setState({ amenitiesArray: [...this.state.amenitiesArray, id] })
    } else {
      this.setState({
        amenitiesArray: this.state.amenitiesArray.filter(item => {
          return item !== id
        }),
      })
    }
  }
  selectSimilarProject(event, id) {
    if (event.target.checked === true) {
      this.setState({
        similarProjectsArray: [...this.state.similarProjectsArray, id],
      })
    } else {
      this.setState({
        similarProjectsArray: this.state.similarProjectsArray.filter(item => {
          return item !== id
        }),
      })
    }
  }
  handleDescription(content, editor) {
    this.setState({ description: content })
  }
  handleHotProject(event) {
    this.setState({ hotProject: event.target.checked })
  }
  handleImage(url) {
    this.setState({ image: url })
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
  async handleSubmit() {
    this.setState({ activeLoading: true })
    let data = {
      name: this.state.name,
      street: this.state.street,
      ward: this.state.ward,
      district: this.state.district,
      city: this.state.city,
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice,
      description: this.state.description,
      status: this.state.status,
      type: this.state.type,
      floor: this.state.floor,
      units: this.state.units,
      bedrooms: this.state.bedrooms,
      aparmentAreaRange: this.state.aparmentAreaRange,
      builder: this.state.builder,
      landSize: this.state.landSize,
      locationRating: this.state.locationRating,
      longitude: this.state.longitude,
      latitude: this.state.latitude,
      similarProjects: this.state.similarProjectsArray,
      amenities: this.state.amenitiesArray,
      projectCode: this.state.projectCode,
      companyCode: this.state.companyCode,
      hot: this.state.hot,
      image: this.props.storageUrl,
      slug: this.state.slug,
    }
    await this.props.checkSlug({ slug: this.state.slug })
    if (this.props.isExist === "false") {
      await this.props.addSlug({
        key: this.state.slug,
        objectId: this.props.newProject._id,
        objectType: "project",
      })
      await this.props.addProject(data)
      await this.props.updateTotalProject({
        id: this.props.settings._id,
        totalProject: parseInt(this.props.settings.updateTotalProject) + 1,
      })
    }
  }
  async componentDidMount() {
    let current = this
    this.props.loadAmenities()
    this.props.loadProject()
    this.props.selectMenu({ index: 1 })
    if (cookies.get("user")) {
      this.setState({ companyCode: cookies.get("user").companyCode })
    }
    await this.props.loadSettings(companyCode)
    let defaultCode = `${
      this.props.settings.preFixProject == undefined
        ? "SGR-PROJECT"
        : this.props.settings.preFixProject
    }-${parseInt(this.props.settings.totalProject) + 1}`
    this.setState({ projectCode: defaultCode })
  }
  render() {
    if (this.props.success == true) {
      Swal.fire({
        title: "Success!",
        text: "",
        type: "success",
        confirmButtonText: "Ok",
        onClose: async () => {
          await this.props.setProjectState({ success: false })
          let page = await Math.ceil(
            (this.props.numberOfProjects + 1) / limitPerRequest
          )
          navigate(`/company/project?page=${page - 1}`)
        },
      })
    } else if (this.props.error == true) {
      Swal.fire({
        title: "Failed!",
        text: "",
        type: "error",
        confirmButtonText: "Ok",
        onClose: () => {
          this.props.setProjectState({ error: false })
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
    let amenities = this.props.amenities.map(item => {
      return (
        <div className="col-md-3 amenities d-flex align-items-center">
          <Checkbox
            onChange={event => this.selectAmenities(event, item._id)}
            value=""
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

    return (
      <Layout role="company">
        <SEO title="Edit Project" />
        <div
          class={
            "main-content-wrap d-flex flex-column " + this.props.contentStatus
          }
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/company/project">Project</Link>
            <Typography color="textPrimary">Add</Typography>
          </Breadcrumbs>
          <div class="breadcrumb d-flex justify-content-between">
            <h1>Add new Project</h1>
          </div>
          <div class="separator-breadcrumb border-top"></div>
          <div className="flex-grow-1">
            <div class="card text-left">
              <div className="card-body">
                <form>
                  <div class="col-md-12 form-group mb-3">
                    <label className="input-label">Project name</label>
                    <input
                      type="text"
                      onChange={this.handleInputChange}
                      name="name"
                      class="form-control"
                      placeholder="Enter project name"
                    />
                  </div>
                  <div class="col-md-12 form-group mb-3">
                    <label className="input-label">Project code</label>
                    <input
                      type="text"
                      onChange={this.handleInputChange}
                      name="projectCode"
                      class="form-control"
                      value={this.state.projectCode}
                    />
                  </div>
                  <div class="col-md-12 form-group mb-3">
                    <label className="input-label">Company code</label>
                    <input
                      type="text"
                      value={this.state.companyCode}
                      name="companyCode"
                      disabled
                      class="form-control"
                      placeholder="Enter project code"
                    />
                  </div>
                  <div class="col-md-12 form-group mb-3">
                    <label className="input-label">City</label>
                    <select
                      type="text"
                      onChange={this.handleCity}
                      name="city"
                      class="form-control"
                      placeholder="Enter project city"
                    >
                      <option value="">City</option>
                      {listCities}
                    </select>
                  </div>
                  <div class="col-md-12 form-group mb-3">
                    <label className="input-label">District</label>
                    <select
                      type="text"
                      onChange={this.handleDistrict}
                      name="district"
                      class="form-control"
                      placeholder="Enter project district"
                    >
                      <option value="">District</option>
                      {listDistrict}
                    </select>
                  </div>
                  <div class="col-md-12 form-group mb-3">
                    <label className="input-label">Ward</label>
                    <select
                      type="text"
                      onChange={this.handleInputChange}
                      name="ward"
                      class="form-control"
                      placeholder="Enter project ward"
                    >
                      <option value="">Ward</option>
                      {listWards}
                    </select>
                  </div>
                  <div class="col-md-12 form-group mb-3">
                    <label className="input-label">Street</label>
                    <input
                      type="text"
                      onChange={this.handleInputChange}
                      name="street"
                      class="form-control"
                      placeholder="Enter project street"
                    />
                  </div>
                  <div class="col-md-12 form-group mb-3">
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
                      class="form-control"
                      value={this.state.slug}
                    />
                  </div>
                  <div class="col-md-6 form-group mb-3 ">
                    <label className="input-label">Price</label>
                    <div className="d-flex align-items-center">
                      <div style={{ margin: "5px" }}>from</div>
                      <input
                        type="text"
                        onChange={this.handleInputChange}
                        name="minPrice"
                        class="form-control"
                        placeholder="Minimun price"
                      />
                      <div style={{ margin: "5px" }}>to</div>
                      <input
                        type="text"
                        onChange={this.handleInputChange}
                        name="maxPrice"
                        class="form-control"
                        placeholder="Maximum price"
                      />
                    </div>
                  </div>
                  <div class="col-md-12 form-group mb-3">
                    <label className="input-label">Description</label>
                    <Editor
                      apiKey={EDITOR_API}
                      init={{
                        plugins: [
                          "advlist autolink lists link image charmap print preview anchor",
                          "searchreplace visualblocks code fullscreen",
                          "insertdatetime media table paste code help wordcount",
                        ],
                        toolbar:
                          "undo redo | formatselect | bold italic backcolor | \
                          alignleft aligncenter alignright alignjustify | \
                          bullist numlist outdent indent | removeformat | help",
                      }}
                      value={this.state.description}
                      onEditorChange={this.handleDescription}
                    />
                  </div>
                  <div class="col-md-12 form-group mb-3">
                    <label className="input-label">Overview</label>
                    <div className="row">
                      <div className="col-md-3">
                        <label>Project Status</label>
                        <input
                          type="text"
                          onChange={this.handleInputChange}
                          name="status"
                          class="form-control"
                        />
                      </div>
                      <div className="col-md-3">
                        <label>Project Type</label>
                        <input
                          type="text"
                          onChange={this.handleInputChange}
                          name="type"
                          class="form-control"
                        />
                      </div>

                      <div className="col-md-3">
                        <label>Floors</label>
                        <input
                          type="text"
                          onChange={this.handleInputChange}
                          name="floor"
                          class="form-control"
                        />
                      </div>
                      <div className="col-md-3">
                        <label>Units</label>
                        <input
                          type="text"
                          onChange={this.handleInputChange}
                          name="units"
                          class="form-control"
                        />
                      </div>
                      <div className="col-md-3">
                        <label>Bedrooms</label>
                        <input
                          type="text"
                          onChange={this.handleInputChange}
                          name="bedrooms"
                          class="form-control"
                        />
                      </div>
                      <div className="col-md-3">
                        <label>Apartment Area Range</label>
                        <input
                          type="text"
                          onChange={this.handleInputChange}
                          name="aparmentAreaRange"
                          class="form-control"
                        />
                      </div>

                      <div className="col-md-3">
                        <label>Builder</label>
                        <input
                          type="text"
                          onChange={this.handleInputChange}
                          name="builder"
                          class="form-control"
                        />
                      </div>
                      <div className="col-md-3">
                        <label>Land Size</label>
                        <input
                          type="text"
                          onChange={this.handleInputChange}
                          name="landSize"
                          class="form-control"
                        />
                      </div>
                      <div className="col-md-3">
                        <label>Location Rating</label>
                        <input
                          type="text"
                          onChange={this.handleInputChange}
                          name="locationRating"
                          class="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12 form-group mb-3">
                    <label className="input-label">Building Amenities</label>
                    <div className="row d-flex">{amenities}</div>
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
                        placeholder="Longitude"
                      />
                      <div style={{ margin: "5px" }}>Latitude</div>
                      <input
                        type="text"
                        onChange={this.handleInputChange}
                        name="latitude"
                        class="form-control"
                        placeholder="Latitude"
                      />
                    </div>
                  </div>
                  <div class="col-md-12 form-group mb-3 d-flex flex-column">
                    <label className="input-label">Similar projects</label>
                    <div className="d-flex flex-wrap">
                      {this.props.projects.map(project => (
                        <div className="col-md-3 d-flex align-items-center">
                          <Checkbox
                            onChange={event =>
                              this.selectSimilarProject(event, project._id)
                            }
                            value=""
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
                  <div class="col-md-12 form-group mb-3 ">
                    <div className="d-flex align-items-center">
                      <label className="input-label">Hot project</label>
                      <Checkbox
                        checked={this.state.hotProject}
                        onChange={this.handleHotProject}
                        value=""
                        color="primary"
                        inputProps={{
                          "aria-label": "secondary checkbox",
                        }}
                      />
                    </div>
                  </div>
                  <div class="col-md-12 form-group mb-3 ">
                    <label className="input-label">Project image</label>
                    <Uploader type={"project"} />
                    <ImageItem
                      url={this.props.storageUrl}
                      type={"project"}
                      deleteHouseImage={this.props.deleteHouseImage}
                    />
                  </div>

                  <div class="col-md-12 form-group mb-3 d-flex justify-content-end">
                    <Button
                      onClick={() => this.handleSubmit()}
                      variant="contained"
                      color="primary"
                    >
                      Save
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

const mapState = state => ({
  projects: state.projects.projects,
  success: state.projects.success,
  error: state.projects.error,
  amenities: state.amenities.amenities,
  storageUrl: state.upload.storageUrl,
  loading: state.dialog.loading,
  contentStatus: state.menu.contentStatus,
  newProject: state.projects.newProject,
  isExist: state.slug.isExist,
  settings: state.settings.settings,
  numberOfProjects: state.projects.numberOfProjects,
})
const mapDispatch = dispatch => ({
  loadProject: dispatch.projects.loadProject,
  addProject: dispatch.projects.addProject,
  setProjectState: dispatch.projects.setState,
  loadAmenities: dispatch.amenities.loadAmenities,
  uploadImage: dispatch.upload.uploadImage,
  deleteImage: dispatch.upload.deleteImage,
  selectMenu: dispatch.menu.setState,
  checkSlug: dispatch.slug.checkSlug,
  addSlug: dispatch.slug.addSlug,
  setSlugState: dispatch.slug.setState,
  updateTotalProject: dispatch.settings.updateTotalProject,
  loadSettings: dispatch.settings.loadSettings,
})
export default connect(mapState, mapDispatch)(AddProject)
