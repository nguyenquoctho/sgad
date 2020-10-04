import React from "react"
import Layout from "../../../components/layout"
import SEO from "../../../components/seo"
import "./style.css"
import { connect } from "react-redux"
import Dialog from "@material-ui/core/Dialog"
import CircularProgress from "@material-ui/core/CircularProgress"
import Snackbar from "@material-ui/core/Snackbar"
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AddUserForm from "../../../components/admin/userForm/add"
import EditUserForm from "../../../components/admin/userForm/edit"

class CompanyPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showAddForm: false,
      showEditForm: false,
      userEdit: [],
      sideNav: "sidenav-open",
      users: [],
      count: 0,
    }
    this.handleShowAddForm = this.handleShowAddForm.bind(this)
    this.handleCloseAddForm = this.handleCloseAddForm.bind(this)
    this.handleShowEditForm = this.handleShowEditForm.bind(this)
    this.handleCloseEditForm = this.handleCloseEditForm.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleResetPassword = this.handleResetPassword.bind(this)
    this.fetchUser = this.fetchUser.bind(this)
   
  }
  handleCloseAddForm() {
    this.setState({ showAddForm: false })
  }

  handleShowAddForm() {
    this.setState({ showAddForm: true })
  }
  handleCloseEditForm() {
    this.setState({ showEditForm: false })
  }

  handleShowEditForm(id) {
    this.setState({ showEditForm: true })
    this.props.loadUserById(id)
  }
  handleDelete(userId) {
    this.props.deleteUser(userId)
  }
  handleResetPassword(resetId) {
    this.props.resetPassword(resetId)
  }
  fetchUser() {
    this.props.loadUsers()
  }
  componentDidMount() {
    // Fetch users
    this.fetchUser()
    this.props.selectMenu({index:1})
  }
  render() {
    let usersTable = this.props.users.map((item, index) => {
      return (
        <>
          <tr>
            <td>{item.companyCode}</td>
            <td>{item.username}</td>
            <td>{item.firstName}</td>
            <td>{item.lastName}</td>
            <td>{item.email}</td>
            <td>{item.phone}</td>
            <td>{item.active}</td>
            <td>
              <div className="d-flex">
                <button
                  type="button"
                  class="action-btn btn btn-outline-danger btn-sm custom m-1"
                  onClick={() => this.handleResetPassword(item._id)}
                >
                  Reset Password
                </button>
                <button
                  type="button"
                  class="action-btn btn btn-outline-primary btn-sm custom m-1"
                  onClick={() => this.handleShowEditForm(item._id)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="action-btn btn btn-outline-primary btn-sm custom m-1"
                  onClick={() => this.handleDelete(item._id)}
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
      <Layout currentPage="company" role="admin">
        <SEO title="Company" />
        <div class={"main-content-wrap d-flex flex-column "+this.props.contentStatus}>
          <div class="breadcrumb d-flex justify-content-between">
            <h1>Company</h1>
            <button
              onClick={this.handleShowAddForm}
              type="button"
              class="btn btn-outline-primary m-1"
            >
              New
            </button>
          </div>

          <div class="separator-breadcrumb border-top"></div>

          <div class="flex-grow-1">
            <div class="card text-left">
              <div class="card-body">
                <h4 class="card-title mb-3">Users</h4>

                <div class="table-responsive">
                  <div className="row">
                    <div className="col-sm-12 col-md-6 d-flex align-items-center">
                      <div class=" dataTables_length d-flex justify-content-start">
                        <label>
                          Show
                          <select
                            name="zero_configuration_table_length"
                            aria-controls="zero_configuration_table"
                            class="form-control-sm"
                          >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select>
                          entries
                        </label>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6 d-flex align-items-center justify-content-end">
                      <div id="" class="dataTables_filter">
                        <label className="d-flex align-items-center">
                          Search:
                          <input
                            type="search"
                            class="form-control form-control-sm"
                            placeholder=""
                            aria-controls="zero_configuration_table"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <table
                    id="zero_configuration_table"
                    class="display table table-striped table-bordered dataTable"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th>
                          <div className="d-flex align-items-center">
                            Company Code
                          </div>
                        </th>
                        <th>Username</th>
                        <th className="d-flex align-items-center">
                          First name{" "}
                        </th>
                        <th>
                          <div className="d-flex align-items-center">
                            Last name{" "}
                          </div>
                        </th>
                        <th>Email</th>
                        <th>
                          <div className="d-flex align-items-center">Phone</div>
                        </th>
                        <th>Active</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>{usersTable}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AddUserForm
          showAddForm={this.state.showAddForm}
          handleCloseAddForm={this.handleCloseAddForm}
          handleShowAddForm={this.handleShowAddForm}
          fetchUser={this.fetchUser}
        />
        <EditUserForm
          showEditForm={this.state.showEditForm}
          handleCloseEditForm={this.handleCloseEditForm}
          handleShowEditForm={this.handleShowEditForm}
          fetchUser={this.fetchUser}
          user={this.props.userEdit}
        />
          <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          variant="error"
          open={this.props.alert}
          className={"company-alert"}
          onClose={()=>this.props.userSetState({alert:false})}
          autoHideDuration={2000}
          ContentProps={{
            "aria-describedby": "message-id",
          }}
          message={<span id="message-id" className="d-flex align-items-center"> <CheckCircleIcon style={{marginRight:"5px"}}/>{this.props.alertMessage}</span>}
        />
      </Layout>
    )
  }
}
const mapState = state => ({
  users: state.users.users,
  userEdit: state.users.userEdit,
  contentStatus:state.menu.contentStatus,
  loading: state.dialog.loading,
  alert:state.users.alert,
  alertMessage:state.users.alertMessage
})
const mapDispatch = dispatch => ({
  loadUsers: dispatch.users.loadUsers,
  deleteUser: dispatch.users.deleteUser,
  resetPassword: dispatch.users.resetPassword,
  loadUserById: dispatch.users.loadUserById,
  selectMenu:dispatch.menu.setState,
  userSetState:dispatch.users.setState
})
export default connect(
  mapState,
  mapDispatch
)(CompanyPage)
