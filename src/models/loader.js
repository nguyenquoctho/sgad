const loader = {
  state: {
    isShow: false,
  },
  reducers: {
    setState(state, payload) {
      state = { ...state, ...payload }
      return { ...state }
    },
    show(state, payload) {
      state.isShow = true
      return { ...state }
    },
    hide(state, payload) {
      state.isShow = false
      return { ...state }
    },
  },
  effects: {},
}

export default loader
