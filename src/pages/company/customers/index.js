import React from "react"
import { Link } from "gatsby"
import Layout from "../../../components/layout"
import SEO from "../../../components/seo"
import TextField from "@material-ui/core/TextField"
import { limitPerRequest } from "../../../setting"
import { connect } from "react-redux"
import { Cookies } from "react-cookie"
const cookies = new Cookies()
let companyCode = { companyCode: "" }
if (cookies.get("user")) {
  companyCode = {
    companyCode: cookies.get("user").companyCode,
  }
}

class CustomersPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { disabled: -1, new_name: "", new_parent_id: "" }
  }

  async componentWillMount() {
    // Select menu
    this.props.selectMenu({ index: 4 })
    await this.props.clearQuery()
    await this.props.getByQuery(this.props.query)
  }
  render() {
    let listCustomers = this.props.customers.map((customer, index) => {
      return (
        <tr>
          <td>{limitPerRequest * this.props.query.page + index + 1}</td>
          <td>{customer.username}</td>
          <td>{customer.phone}</td>
          <td>{customer.email}</td>
          <td>
            <div class="d-flex">
              <Link
                to={`/company/customers/edit?id=${customer._id}`}
                type="button"
                class="action-btn btn btn-outline-primary btn-sm custom m-1"
              >
                Edit
              </Link>
              <button
                type="button"
                class="action-btn btn btn-outline-danger btn-sm custom m-1"
                onClick={""}
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      )
    })
    return (
      <Layout currentPage="dashboard" role="company">
        <SEO title="Customers" />
        <div
          class={
            "main-content-wrap d-flex flex-column " + this.props.contentStatus
          }
        >
          <div class="breadcrumb d-flex justify-content-between">
            <h1>Customers</h1>
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
                          onKeyDown={this.search}
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
                        <th>No.</th>
                        <th>Username</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>{listCustomers}</tbody>
                  </table>
                  <div class="col-md-12 mt-5 text-center">
                    <ul class="pagination d-inline-flex"></ul>
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
  contentStatus: state.menu.contentStatus,
  loading: state.dialog.loading,
  customers: state.customers.customers,
  query: state.customers.query,
})
const mapDispatch = dispatch => ({
  selectMenu: dispatch.menu.setState,
  getByQuery: dispatch.customers.getByQuery,
  clearQuery: dispatch.customers.clearQuery,
})
export default connect(
  mapState,
  mapDispatch
)(CustomersPage)
