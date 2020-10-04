import React from "react"
import Modal from "react-bootstrap/Modal"
import { API_URL } from "../../../setting"
import { connect } from "react-redux"
import axios from "axios"
class AddUserForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { demo: "asda" }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleInputChange(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value,
    })
  }
  async handleSubmit() {
    let data = {
      username: this.state.username,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      phone: this.state.phone,
      active: this.state.active,
      companyCode: this.state.companyCode.toLowerCase(),
    }
    await this.props.addUser(data)
    await this.props.handleCloseAddForm()
  }
  render() {
    return (
      <Modal
        show={this.props.showAddForm}
        onHide={this.props.handleCloseAddForm}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create new user</Modal.Title>
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
                  onChange={this.handleInputChange}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label for="Name" class="col-form-label">
                  Password
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="password"
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
                  <option value={""}>Active</option>
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
            onClick={this.props.handleCloseAddForm}
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
  addUser: dispatch.users.addUser,
})
export default connect(
  mapState,
  mapDispatch
)(AddUserForm)
