import React from "react"
import Layout from "../../../components/layout"
import SEO from "../../../components/seo"
import { BASE_URL, API_URL } from "../../../setting"
import { Button } from "@material-ui/core"
import Checkbox from "@material-ui/core/Checkbox"
import ImageItem from "../../../components/company/image/index"
import Uploader from "../../../components/company/image/upload"
import Dialog from "@material-ui/core/Dialog"
import Divider from "@material-ui/core/Divider"
import CircularProgress from "@material-ui/core/CircularProgress"
import { connect } from "react-redux"
import { Cookies } from "react-cookie"
const cookies = new Cookies()
let companyCode = { companyCode: "" }
if (cookies.get("user")) {
  companyCode = {
    companyCode: cookies.get("user").companyCode,
  }
}

class SettingPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { apiKey: "" }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.selectHotProject = this.selectHotProject.bind(this)
    this.handleApikey = this.handleApikey.bind(this)
  }
  handleInputChange(event) {
    let name = event.target.name
    let value = event.target.value
    this.props.handleInputChange({
      [name]: value,
    })
  }
  handleSave() {
    let { settings } = this.props
    let data = {
      id: settings._id,
      companyCode: companyCode.companyCode,
      companyLogo: this.props.companyLogo,
      slideImages: this.props.slideImages,
      hotProject: this.props.hotProject,
      companyName: settings.companyName,
      companyAddress: settings.companyAddress,
      companyEmail: settings.companyEmail,
      companyPhone: settings.companyPhone,
      companyWebsite: settings.companyWebsite,
      companyCopyright: settings.companyCopyright,
      totalProperties: parseInt(settings.totalProperties),
      totalUser: parseInt(settings.totalUser),
      apiKey: this.props.apiKey,
      preFixHouse: settings.preFixHouse,
      preFixProject: settings.preFixProject,
      totalHouse: settings.totalHouse,
      totalProject: settings.totalProject,
      facebook: settings.facebook,
      instagram: settings.instagram,
      twitter: settings.twitter,
      facebookPageId: settings.facebookPageId,
    }
    this.props.updateSettings(data)
  }
  selectHotProject(event, project) {
    if (event.target.checked == true) {
      this.props.addHotProject(project)
    } else {
      this.props.deleteHotProject(project)
    }
  }
  handleApikey(event) {
    this.setState({ apiKey: event.target.value })
  }
  componentDidMount() {
    this.props.selectMenu({ index: 3 })
    this.props.loadSettings(companyCode)
    this.props.loadProject(companyCode)
    this.props.loadHouses(companyCode)
  }
  render() {
    let { settings } = this.props
    let slideImages

    slideImages = this.props.slideImages.map((item, index) => {
      return <ImageItem url={item} type={"setting"} />
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
            <h1>Setting</h1>
          </div>
          <div class="separator-breadcrumb border-top"></div>
          <div class="card text-left">
            <div className="card-body">
              {/* <div class="col-md-12 form-group mb-3">
                <label className="input-label">Enter key</label>
                <input
                  type="text"
                  onChange={this.handleApikey}
                  name="apiKey"
                  class="form-control"
                />
                <Button
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                  onClick={() =>
                    this.props.generateApiKey({
                      apiKey: this.state.apiKey,
                      companyCode: settings.companyCode,
                    })
                  }
                  variant="contained"
                  color="primary"
                >
                  Generate API key
                </Button>

                <textarea
                  type="text"
                  disabled
                  value={this.props.apiKey}
                  class="form-control"
                />
              </div>
              <Divider /> */}
              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Company name</label>
                <input
                  type="text"
                  onChange={this.handleInputChange}
                  name="companyName"
                  class="form-control"
                  value={settings.companyName}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Company code</label>
                <input
                  type="text"
                  disabled
                  class="form-control"
                  value={companyCode.companyCode}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Company address</label>
                <input
                  type="text"
                  onChange={this.handleInputChange}
                  name="companyAddress"
                  class="form-control"
                  value={settings.companyAddress}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Company email</label>
                <input
                  type="text"
                  onChange={this.handleInputChange}
                  name="companyEmail"
                  class="form-control"
                  value={settings.companyEmail}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Company phone</label>
                <input
                  type="text"
                  onChange={this.handleInputChange}
                  name="companyPhone"
                  class="form-control"
                  value={settings.companyPhone}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Company website</label>
                <input
                  type="text"
                  onChange={this.handleInputChange}
                  name="companyWebsite"
                  class="form-control"
                  value={settings.companyWebsite}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Company copyright</label>
                <input
                  type="text"
                  onChange={this.handleInputChange}
                  name="companyCopyright"
                  class="form-control"
                  value={settings.companyCopyright}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Company Facebook</label>
                <input
                  type="text"
                  onChange={this.handleInputChange}
                  name="facebook"
                  class="form-control"
                  value={settings.facebook}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Facebook Page Id</label>
                <input
                  type="text"
                  onChange={this.handleInputChange}
                  name="facebookPageId"
                  class="form-control"
                  value={settings.facebookPageId}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Company Instagram</label>
                <input
                  type="text"
                  onChange={this.handleInputChange}
                  name="instagram"
                  class="form-control"
                  value={settings.instagram}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Company Twitter</label>
                <input
                  type="text"
                  onChange={this.handleInputChange}
                  name="twitter"
                  class="form-control"
                  value={settings.twitter}
                />
              </div>
              <div class="col-md-12 form-group mb-3 d-flex flex-column">
                <label className="input-label">Company's logo</label>
                <Uploader type={"setting"} logo={true} />
                <div className="d-flex flex-wrap">
                  <ImageItem
                    url={this.props.companyLogo}
                    type={"setting"}
                    logo={true}
                  />
                </div>
              </div>
              <div class="col-md-12 form-group mb-3 d-flex flex-column">
                <label className="input-label">Select slide images</label>
                <Uploader type={"setting"} />
                <div className="d-flex flex-wrap">{slideImages}</div>
              </div>
              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Total users</label>
                <input
                  type="number"
                  onChange={this.handleInputChange}
                  name="totalUser"
                  class="form-control"
                  value={settings.totalUser}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Total properties</label>
                <input
                  type="number"
                  onChange={this.handleInputChange}
                  name="totalProperties"
                  class="form-control"
                  value={settings.totalProperties}
                />
              </div>
              <div class="col-md-3 form-group mb-3">
                <label className="input-label">House code's prefix</label>
                <input
                  type="text"
                  onChange={this.handleInputChange}
                  name="preFixHouse"
                  class="form-control"
                  value={settings.preFixHouse || ""}
                />
              </div>
              <div class="col-md-3 form-group mb-3">
                <label className="input-label">Total houses</label>
                <input
                  type="number"
                  name="totalHouse"
                  onChange={this.handleInputChange}
                  class="form-control"
                  value={settings.totalHouse}
                />
              </div>
              <div class="col-md-3 form-group mb-3">
                <label className="input-label">Project code's prefix</label>
                <input
                  type="text"
                  onChange={this.handleInputChange}
                  name="preFixProject"
                  class="form-control"
                  value={settings.preFixProject || ""}
                />
              </div>
              <div class="col-md-3 form-group mb-3">
                <label className="input-label">Total projects</label>
                <input
                  type="number"
                  name="totalProject"
                  onChange={this.handleInputChange}
                  class="form-control"
                  value={settings.totalProject}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Hot projects</label>
                {this.props.projects.map(project => {
                  let hotArray = []
                  this.props.hotProject.map(item => {
                    hotArray.push(item._id)
                  })
                  return (
                    <div className="col-md-3 d-flex align-items-center">
                      <Checkbox
                        onChange={event =>
                          this.selectHotProject(event, project)
                        }
                        checked={hotArray.indexOf(project._id) != -1}
                        color="primary"
                        inputProps={{
                          "aria-label": "secondary checkbox",
                        }}
                      />
                      {project.name}
                    </div>
                  )
                })}
              </div>
              <Button
                onClick={this.handleSave}
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
        <Dialog open={this.props.loading}>
          <div>
            <CircularProgress color="secondary" />
          </div>
        </Dialog>
      </Layout>
    )
  }
}
const mapState = state => ({
  projects: state.projects.projects,
  houses: state.houses.houses,
  contentStatus: state.menu.contentStatus,
  slideImages: state.settings.slideImages,
  companyLogo: state.settings.companyLogo,
  settings: state.settings.settings,
  apiKey: state.settings.apiKey,
  hotProject: state.settings.hotProject,
  loading: state.dialog.loading,
})
const mapDispatch = dispatch => ({
  selectMenu: dispatch.menu.setState,
  deleteSlideImages: dispatch.menu.deleteSlideImages,
  loadProject: dispatch.projects.loadProject,
  loadHouses: dispatch.houses.loadHouses,
  loadSettings: dispatch.settings.loadSettings,
  handleInputChange: dispatch.settings.handleInputChange,
  updateSettings: dispatch.settings.updateSettings,
  addHotProject: dispatch.settings.addHotProject,
  deleteHotProject: dispatch.settings.deleteHotProject,
  generateApiKey: dispatch.settings.generateApiKey,
})
export default connect(mapState, mapDispatch)(SettingPage)
