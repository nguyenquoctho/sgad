import React from "react"
import { Link } from "gatsby"
import Layout from "../../../../components/layout"
import SEO from "../../../../components/seo"
import TextField from "@material-ui/core/TextField"
import { connect } from "react-redux"
import Dialog from "@material-ui/core/Dialog"
import CircularProgress from "@material-ui/core/CircularProgress"
import { Cookies } from "react-cookie"
const cookies = new Cookies()
let companyCode = { companyCode: "" }
if (cookies.get("user")) {
  companyCode = {
    companyCode: cookies.get("user").companyCode,
  }
}

class CategoriesPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { disabled: -1,new_name:"", new_parent_id:""}
    this.edit = this.edit.bind(this)
    this.save = this.save.bind(this)
    this.change = this.change.bind(this)
    this.add=this.add.bind(this)
    this.delete=this.delete.bind(this)
  }
  edit(index) {
    this.setState({ disabled: index })
  }
  async save(category) {
    let data = {
      id: category._id,
      companyCode:category.companyCode,
      name: this.state.name ? this.state.name : category.name,
      parent_id: this.state.parent_id
        ? this.state.parent_id
        : category.parent_id,
    }
    await this.props.updateCategories(data)
    await this.setState({ disabled: -1 })
    await this.props.loadAllCategories()
  }
  change(event) {
    this.setState({ [event.target.name]: event.target.value })
  }
  async add(){
      let data={
          name:this.state.new_name,
          companyCode:companyCode.companyCode,
          parent_id:this.state.new_parent_id
      }
   await this.props.addCategories(data)
   await this.props.loadAllCategories()
   await this.setState({new_name:"",new_parent_id:""})
  }
  async delete(id){
      await this.props.deleteCategories({id:id})
      await this.props.loadAllCategories()
  }
  componentWillMount() {
    // Select menu
    this.props.selectMenu({ index: 6 })
    this.props.loadAllCategories()
  }
  render() {
    let listCategories = this.props.blogCategories.map((category, index) => {
      return (
        <>
          <tr>
            <td>{index + 1}</td>
            <td>
              <TextField
                name="name"
                disabled={index != this.state.disabled}
                defaultValue={category.name}
                onChange={this.change}
              />
            </td>
            <td>
              <select
                className="form-control"
                name="parent_id"
                disabled={index != this.state.disabled}
                onChange={this.change}
              >
                {this.props.blogCategories.map(item => {
                  return (
                    <option
                      selected={item.name === category.parent_id}
                      value={item.name}
                    >
                      {item.name}
                    </option>
                  )
                })}
              </select>
            </td>
            <td>
              <div class="d-flex">
                <button
                  type="button"
                  class="action-btn btn btn-outline-primary btn-sm custom m-1"
                  onClick={() => this.edit(index)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="action-btn btn btn-outline-primary btn-sm custom m-1"
                  onClick={() => this.save(category)}
                >
                  Save
                </button>
                <button
                  type="button"
                  class="action-btn btn btn-outline-danger btn-sm custom m-1"
                  onClick={()=>this.delete(category._id)}
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
      <Layout currentPage="dashboard" role="company">
        <SEO title="Dashboard" />
        <div
          class={
            "main-content-wrap d-flex flex-column " + this.props.contentStatus
          }
        >
          <div class="breadcrumb d-flex justify-content-between">
            <h1>Blog Categories</h1>
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
                        <th></th>
                        <th>Categories</th>
                        <th>Parent ID</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listCategories}
                      <tr>
                        <td>New category</td>
                        <td>
                          <TextField
                            placeholder="Category name"
                            name="new_name"
                            onChange={this.change}
                            value={this.state.new_name}
                          />
                        </td>
                        <td>
                          <select
                            className="form-control"
                            name="new_parent_id"
                            onChange={this.change}
                          >
                            <option selected value={""}>Parent id</option>
                            {this.props.blogCategories.map(item => {
                              return (
                                <option value={item.name}>{item.name}</option>
                              )
                            })}
                          </select>
                        </td>
                        <td>
                          <div class="d-flex">
                            <button
                              type="button"
                              class="action-btn btn btn-outline-primary btn-sm custom m-1"
                                onClick={() => this.add()}
                            >
                              Add
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
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
  blogCategories: state.blogCategories.blogCategories,
  loading:state.dialog.loading,
})
const mapDispatch = dispatch => ({
  loadAllCategories: dispatch.blogCategories.loadAllCategories,
  updateCategories: dispatch.blogCategories.updateCategories,
  addCategories:dispatch.blogCategories.addCategories,
  deleteCategories:dispatch.blogCategories.deleteCategories,
  selectMenu: dispatch.menu.setState,
})
export default connect(
  mapState,
  mapDispatch
)(CategoriesPage)
