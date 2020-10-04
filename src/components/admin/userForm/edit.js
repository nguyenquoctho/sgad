import React from "react"
import Modal from "react-bootstrap/Modal"
import { API_URL } from "../../../setting"
import { connect } from "react-redux"
class EditUserForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { user: [] }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleInputChange(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name

    // this.setState({
    //   [name]: value,
    // })
    this.props.setUserEdit({
      [name]: value,
    })
  }
  async handleSubmit() {
    let current = this
    let data = {
      id: this.props.user._id,
      username: current.props.user.username,
      firstName: current.props.user.firstName,
      lastName: current.props.user.lastName,
      email: current.props.user.email,
      phone: current.props.user.phone,
      active: current.props.user.active,
      companyCode: current.props.user.companyCode,
    }
    await this.props.editUser(data)
    await current.props.handleCloseEditForm()
  }
  componentDidMount() {}
  render() {
    const { user } = this.props
    return (
      <Modal
        show={this.props.showEditForm}
        onHide={this.props.handleCloseEditForm}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit the user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div class="row">
              <div class="col-md-12 form-group mb-3">
                <label for="Name" class="col-form-label">
                  Username
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="username"
                  value={user.username}
                  onChange={this.handleInputChange}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label for="Name" class="col-form-label">
                  First name
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="firstName"
                  value={user.firstName}
                  onChange={this.handleInputChange}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label for="Name" class="col-form-label">
                  Last name
                </label>
                <input
                  type="email"
                  class="form-control"
                  name="lastName"
                  value={user.lastName}
                  onChange={this.handleInputChange}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label for="Name" class="col-form-label">
                  Email
                </label>
                <input
                  type="email"
                  class="form-control"
                  name="email"
                  value={user.email}
                  onChange={this.handleInputChange}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label for="Name" class="col-form-label">
                  Phone
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="phone"
                  value={user.phone}
                  onChange={this.handleInputChange}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label for="Name" class="col-form-label">
                  Active
                </label>
                <select
                  id="theme_selector"
                  name="active"
                  class="custom-select"
                  onChange={this.handleInputChange}
                >
                  <option value={user.active}>Active</option>
                  <option value={true}>True</option>
                  <option value={false}>False</option>
                </select>
              </div>
              <div class="col-md-12 form-group mb-3">
                <label for="Name" class="col-form-label">
                  Company code (*)
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="companyCode"
                  value={user.companyCode}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            class="btn btn-secondary m-1"
            onClick={this.handleSubmit}
          >
            Save
          </button>
          <button
            type="button"
            class="btn btn-danger m-1"
            onClick={this.props.handleCloseEditForm}
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    )
  }
}
const mapState = state => ({})
const mapDispatch = dispatch => ({
  editUser: dispatch.users.editUser,
  setUserEdit: dispatch.users.setUserEdit,
})
export default connect(
  mapState,
  mapDispatch
)(EditUserForm)
