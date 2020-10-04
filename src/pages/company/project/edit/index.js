import React from "react"
import { Editor } from "@tinymce/tinymce-react"
import "./style.css"
import Layout from "../../../../components/layout"
import SEO from "../../../../components/seo"
import { BASE_URL, API_URL, EDITOR_API } from "../../../../setting"
import Button from "@material-ui/core/Button"
import ImageItem from "../../../../components/company/image"
import Typography from "@material-ui/core/Typography"
import Breadcrumbs from "@material-ui/core/Breadcrumbs"
import { Link } from "gatsby"
import Dropzone from "react-dropzone"
import Swal from "sweetalert2"
import Checkbox from "@material-ui/core/Checkbox"
import Dialog from "@material-ui/core/Dialog"
import CircularProgress from "@material-ui/core/CircularProgress"
import Uploader from "../../../../components/company/image/upload"
import cities from "../../../../location/cities.json"
import districts from "../../../../location/districts.json"
import wards from "../../../../location/wards.json"
import { connect } from "react-redux"
import { Cookies } from "react-cookie"
import slug from "slug"
import { navigate } from "gatsby"
const cookies = new Cookies()
let companyCode
if (cookies.get("user")) {
  companyCode = {
    companyCode: cookies.get("user").companyCode,
  }
}

class EditProject extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      project: {
        price: {
          max: "",
          min: "",
        },
        location: {
          long: "",
          lat: "",
        },
      },
      amenities: [],
      description: "",
      openDialog: false,
      similarProjects: [],
      hotProject: false,
      amenitiesArray: [],
      facilitiesArray: [],
      similarProjectsArray: [],
      image: "",
      companyCode: "",
      activeLoading: false,
      cityCode: 0,
      districtCode: 0,
      wardCode: 0,
    }
    this.handleHotProject = this.handleHotProject.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleDescription = this.handleDescription.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.selectAmenities = this.selectAmenities.bind(this)
    this.selectSimilarProject = this.selectSimilarProject.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setLocation = this.setLocation.bind(this)
    this.handleCity = this.handleCity.bind(this)
    this.handleDistrict = this.handleDistrict.bind(this)
    this.handleWard = this.handleWard.bind(this)
    this.generateSlug = this.generateSlug.bind(this)
  }
  generateSlug() {
    let word = `${this.props.projectById.city} ${this.props.projectById.name}`
    this.props.handleInputProject({ slug: slug(word, { lower: true }) })
    // console.log(slug(word, { lower: true }))
  }
  handleInputChange(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value,
    })
    this.props.handleInputProject({
      [name]: value,
    })
  }
  handleCity(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    let city = JSON.parse(value)
    const name = target.name
    this.props.handleInputProject({
      [name]: city.name,
    })
    this.setState({ cityCode: city.code })
  }
  handleDistrict(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    let district = JSON.parse(value)
    const name = target.name
    this.props.handleInputProject({
      [name]: district.name,
    })
    this.setState({ districtCode: district.code })
  }
  handleWard(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    let ward = JSON.parse(value)
    const name = target.name
    this.props.handleInputProject({
      [name]: ward.name,
    })
    this.setState({ wardCode: ward.code })
  }
  selectAmenities(event, id) {
    if (event.target.checked === true) {
      this.props.addAmenities(id)
    } else {
      this.props.deleteAmenities(id)
    }
  }
  selectSimilarProject(event, id) {
    if (event.target.checked === true) {
      this.props.addSimilarProjects(id)
    } else {
      this.props.deleteSimilarProjects(id)
    }
  }
  handleDescription(content, editor) {
    this.setState({ description: content })
  }
  handleHotProject(event) {
    this.setState({ hotProject: event.target.checked })
  }
  handleImage(url) {
    console.log(url)
    this.setState({ image: url })
  }
  setLocation(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name
    this.props.setLocation({
      [name]: value,
    })
  }
  async handleSubmit() {
    let current = this
    current.setState({ activeLoading: true })
    let project = this.props.projectById
    let data = {
      id: project._id,
      name: project.name,
      street: project.street,
      ward: project.ward,
      district: project.district,
      city: project.city,
      minPrice: project.minPrice,
      maxPrice: project.maxPrice,
      description: this.state.description
        ? this.state.description
        : project.description,
      status: project.status,
      type: project.type,
      floor: project.floor,
      units: project.units,
      bedrooms: project.bedrooms,
      aparmentAreaRange: project.aparmentAreaRange,
      builder: project.builder,
      landSize: project.landSize,
      locationRating: project.locationRating,
      longitude: project.longitude,
      latitude: project.latitude,
      similarProjects: this.props.similarProjects,
      amenities: this.props.projectAmenities,
      projectCode: project.projectCode,
      companyCode: project.companyCode,
      hot: project.hot,
      image: this.props.projectImage,
      slug: project.slug,
    }
    if (this.props.currentSlug != project.slug) {
      await this.props.checkSlug({ slug: this.state.slug })
      if (this.props.isExist === "false") {
        await this.props.updateSlug({
          key: project.slug,
          id: project._id,
        })
        await this.props.editProject(data)
      }
    } else {
      await this.props.editProject(data)
    }
  }

  componentDidMount() {
    // Get all amenities
    this.props.loadAmenities()

    // Get all facilities

    // Get similar projects
    this.props.loadProject(companyCode)

    // Get prject by Id
    let projectId = new URL(window.location.href).searchParams.get("id")
    this.props.loadProjectById(projectId)

    // Select menu
    this.props.selectMenu({ index: 1 })
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
          await this.props.setProjectState({ success: false })
          navigate(`/company/project?page=${this.props.query.page}`)
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
    }
    let codeOfCity
    let codeOfDistrict
    const project = this.props.projectById
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
      if (city.name == project.city) {
        codeOfCity = city.code
      }
      return (
        <option
          selected={city.name == project.city}
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
        if (district.name == project.district) {
          codeOfDistrict = district.code
        }
        return (
          <option
            selected={district.name == project.district}
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
            selected={ward.name == project.ward}
            value={JSON.stringify(ward)}
          >
            {ward.name}
          </option>
        )
      })

    let amenities = this.props.amenities.map(item => {
      return (
        <div className="col-md-3 amenities d-flex align-items-center">
          <Checkbox
            onChange={event => this.selectAmenities(event, item._id)}
            checked={this.props.projectAmenities.indexOf(item._id) != -1}
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
            <Typography color="textPrimary">Edit</Typography>
          </Breadcrumbs>
          <div class="breadcrumb d-flex justify-content-between">
            <h1>Edit Project</h1>
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
                      value={project.name}
                    />
                  </div>
                  <div class="col-md-12 form-group mb-3">
                    <label className="input-label">Project code</label>
                    <input
                      type="text"
                      onChange={this.handleInputChange}
                      name="projectCode"
                      class="form-control"
                      value={project.projectCode}
                    />
                  </div>
                  <div class="col-md-12 form-group mb-3">
                    <label className="input-label">Company code</label>
                    <input
                      type="text"
                      value={project.companyCode}
                      name="companyCode"
                      disabled
                      class="form-control"
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
                      value={project.street}
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
                      value={project.slug}
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
                        value={project.minPrice}
                      />
                      <div style={{ margin: "5px" }}>to</div>
                      <input
                        type="text"
                        onChange={this.handleInputChange}
                        name="maxPrice"
                        class="form-control"
                        value={project.maxPrice}
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
                      value={project.description}
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
                          value={project.status}
                        />
                      </div>
                      <div className="col-md-3">
                        <label>Project Type</label>
                        <input
                          type="text"
                          onChange={this.handleInputChange}
                          name="type"
                          class="form-control"
                          value={project.type}
                        />
                      </div>

                      <div className="col-md-3">
                        <label>Floors</label>
                        <input
                          type="text"
                          onChange={this.handleInputChange}
                          name="floor"
                          class="form-control"
                          value={project.floor}
                        />
                      </div>
                      <div className="col-md-3">
                        <label>Units</label>
                        <input
                          type="text"
                          onChange={this.handleInputChange}
                          name="units"
                          class="form-control"
                          value={project.units}
                        />
                      </div>
                      <div className="col-md-3">
                        <label>Bedrooms</label>
                        <input
                          type="text"
                          onChange={this.handleInputChange}
                          name="bedrooms"
                          class="form-control"
                          value={project.bedrooms}
                        />
                      </div>
                      <div className="col-md-3">
                        <label>Apartment Area Range</label>
                        <input
                          type="text"
                          onChange={this.handleInputChange}
                          name="aparmentAreaRange"
                          class="form-control"
                          value={project.aparmentAreaRange}
                        />
                      </div>

                      <div className="col-md-3">
                        <label>Builder</label>
                        <input
                          type="text"
                          onChange={this.handleInputChange}
                          name="builder"
                          class="form-control"
                          value={project.builder}
                        />
                      </div>
                      <div className="col-md-3">
                        <label>Land Size</label>
                        <input
                          type="text"
                          onChange={this.handleInputChange}
                          name="landSize"
                          class="form-control"
                          value={project.landSize}
                        />
                      </div>
                      <div className="col-md-3">
                        <label>Location Rating</label>
                        <input
                          type="text"
                          onChange={this.handleInputChange}
                          name="locationRating"
                          class="form-control"
                          value={project.locationRating}
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
                        value={project.longitude}
                      />
                      <div style={{ margin: "5px" }}>Latitude</div>
                      <input
                        type="text"
                        onChange={this.handleInputChange}
                        name="latitude"
                        class="form-control"
                        value={project.latitude}
                      />
                    </div>
                  </div>
                  <div class="col-md-12 form-group mb-3 d-flex flex-column">
                    <label className="input-label">Similar projects</label>
                    <div className="d-flex flex-wrap">
                      {this.props.projects
                        .filter(item => {
                          return item._id != this.props.projectById._id
                        })
                        .map(project => (
                          <div className="col-md-3 d-flex align-items-center">
                            <Checkbox
                              onChange={event =>
                                this.selectSimilarProject(event, project._id)
                              }
                              checked={
                                this.props.similarProjects.indexOf(
                                  project._id
                                ) != -1
                              }
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
                        checked={project.hot === true}
                        onChange={this.handleInputChange}
                        name="hot"
                        color="primary"
                        inputProps={{
                          "aria-label": "secondary checkbox",
                        }}
                      />
                    </div>
                  </div>
                  <div class="col-md-12 form-group mb-3 ">
                    <label className="input-label">Project Images</label>

                    <Uploader type={"project"} />
                    <ImageItem
                      url={this.props.projectImage}
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
  projectById: state.projects.projectById,
  projectImage: state.projects.projectImage,
  success: state.projects.success,
  error: state.projects.error,
  amenities: state.amenities.amenities,
  facilities: state.facilities.facilities,
  storageUrl: state.upload.storageUrl,
  imageLoading: state.upload.imageLoading,
  projectAmenities: state.projects.amenities,
  similarProjects: state.projects.similarProjects,
  loading: state.dialog.loading,
  contentStatus: state.menu.contentStatus,
  isExist: state.slug.isExist,
  query: state.projects.query,
})
const mapDispatch = dispatch => ({
  loadProject: dispatch.projects.loadProject,
  editProject: dispatch.projects.editProject,
  loadProjectById: dispatch.projects.loadProjectById,
  setProjectState: dispatch.projects.setState,
  loadAmenities: dispatch.amenities.loadAmenities,
  uploadImage: dispatch.upload.uploadImage,
  deleteImage: dispatch.upload.deleteImage,
  deleteHouseImage: dispatch.houses.deleteHouseImage,
  handleInputProject: dispatch.projects.handleInputProject,
  setLocation: dispatch.projects.setProjectLocation,
  addAmenities: dispatch.projects.addAmenities,
  deleteAmenities: dispatch.projects.deleteAmenities,
  addSimilarProjects: dispatch.projects.addSimilarProjects,
  deleteSimilarProjects: dispatch.projects.deleteSimilarProjects,
  selectMenu: dispatch.menu.setState,
  checkSlug: dispatch.slug.checkSlug,
  updateSlug: dispatch.slug.updateSlug,
  setSlugState: dispatch.slug.setState,
})
export default connect(mapState, mapDispatch)(EditProject)
