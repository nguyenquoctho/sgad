const menu={
    state:{
        index:0,
        sideBarStatus:"open",
        contentStatus:"sidenav-open"
    },
    reducers:{
        setState(state,payload){
            state={...state,...payload}
            return state
        }
    },
    effects:{}
}
export default menu