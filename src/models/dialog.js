const dialog = {
  state: {
    loading: false,
  },
  reducers: {
    setState(state, payload) {
      state = { ...state, ...payload }
      return { ...state }
    },
  },
  effects: {},
}
export default dialog
