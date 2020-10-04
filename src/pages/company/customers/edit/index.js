import React from "react"
import { connect } from "react-redux"
import Layout from "../../../../components/layout"
import SEO from "../../../../components/seo"
import "date-fns"
import DateFnsUtils from "@date-io/date-fns"
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers"
import Dialog from "@material-ui/core/Dialog"
import CircularProgress from "@material-ui/core/CircularProgress"
class EditCustomer extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selectedDate: new Date().getTime() }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
  }
  handleInputChange(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name
    this.props.setCustomer({ [name]: value })
  }
  handleDateChange(date) {
    this.setState({ selectedDate: date.getTime() })
  }
  render() {
    return (
      <Layout role="company">
        <SEO title="Customers" />
        <div
          class={
            "main-content-wrap d-flex flex-column " + this.props.contentStatus
          }
        >
          <div class="breadcrumb d-flex justify-content-between">
            <h1>Edit customer</h1>
          </div>
          <div class="separator-breadcrumb border-top"></div>
          <div className="flex-grow-1">
            <div class="card text-left">
              <div className="card-body">
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">Username</label>
                  <input
                    type="text"
                    onChange={this.handleInputChange}
                    name="blogCode"
                    class="form-control"
                  />
                </div>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">First name</label>
                  <input
                    type="text"
                    onChange={this.handleInputChange}
                    name="blogCode"
                    class="form-control"
                  />
                </div>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">Last name</label>
                  <input
                    type="text"
                    onChange={this.handleInputChange}
                    name="blogCode"
                    class="form-control"
                  />
                </div>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">Age</label>
                  <input
                    type="number"
                    onChange={this.handleInputChange}
                    name="blogCode"
                    class="form-control"
                  />
                </div>
                <div class="col-md-12 form-group mb-3 d-flex flex-column">
                  <label className="input-label">Date of birth</label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      value={this.state.selectedDate}
                      onChange={this.handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>

                </div>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">Email</label>
                  <input
                    type="email"
                    onChange={this.handleInputChange}
                    name="blogCode"
                    class="form-control"
                  />
                </div>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">City</label>
                  <input
                    type="email"
                    onChange={this.handleInputChange}
                    name="blogCode"
                    class="form-control"
                  />
                </div>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">Ward</label>
                  <input
                    type="email"
                    onChange={this.handleInputChange}
                    name="blogCode"
                    class="form-control"
                  />
                </div>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">District</label>
                  <input
                    type="email"
                    onChange={this.handleInputChange}
                    name="blogCode"
                    class="form-control"
                  />
                </div>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">Address</label>
                  <input
                    type="email"
                    onChange={this.handleInputChange}
                    name="blogCode"
                    class="form-control"
                  />
                </div>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">Identify Card</label>
                  <input
                    type="email"
                    onChange={this.handleInputChange}
                    name="blogCode"
                    class="form-control"
                  />
                </div>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">Identify Card Issue</label>
                  <input
                    type="number"
                    onChange={this.handleInputChange}
                    name="blogCode"
                    class="form-control"
                  />
                </div>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">Identify Card Place</label>
                  <input
                    type="email"
                    onChange={this.handleInputChange}
                    name="blogCode"
                    class="form-control"
                  />
                </div>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">Identity Card Expired</label>
                  <input
                    type="number"
                    onChange={this.handleInputChange}
                    name="blogCode"
                    class="form-control"
                  />
                </div>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">Company Code</label>
                  <input
                    type="text"
                    onChange={this.handleInputChange}
                    name="blogCode"
                    class="form-control"
                  />
                </div>
              </div>
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
  contentStatus: state.menu.contentStatus,
  customer: state.customers.setCustomer,
})
const mapDispatch = dispatch => ({
  setCustomer: dispatch.customers.setCustomer,
})
export default connect(
  mapState,
  mapDispatch
)(EditCustomer)
