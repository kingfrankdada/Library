const state = {
  userInfo: {
    isAdmin: false,
    username: '',
    usertoken: '',
  }
};

const mutations = {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
};

const actions = {};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};