const state = {
  // 登录模态框
  isLoginModalVisible: false,
  // 退出模态框
  isLogoutModalVisible: false,
  // 注册模态框
  isRegModalVisible: false,
  // 搜索模态框
  isSearchModalVisible: false,
  // 书籍查看模态框
  isSelectModalVisible: false,
  // 书籍添加模态框
  isAddModalVisible: false,
  // 书籍修改模态框
  isUpdateModalVisible: false,
  // 书籍删除模态框
  isDeleteModalVisible: false
};

const mutations = {
  // 登录模态框方法
  setLoginModalVisible(state, visible) {
    state.isLoginModalVisible = visible;
  },
  // 退出模态框方法
  setLogoutModalVisible(state, visible) {
    state.isLogoutModalVisible = visible;
  },
  // 注册模态框方法
  setRegModalVisible(state, visible) {
    state.isRegModalVisible = visible;
  },
  // 搜索模态框方法
  setSearchModalVisible(state, visible) {
    state.isSearchModalVisible = visible;
  },
  // 查看模态框方法
  setSelectModalVisible(state, visible) {
    state.isSelectModalVisible = visible;
  },
  // 添加模态框方法
  setAddModalVisible(state, visible) {
    state.isAddModalVisible = visible;
  },
  // 修改模态框方法
  setUpdateModalVisible(state, visible) {
    state.isUpdateModalVisible = visible;
  },
  // 删除模态框方法
  setkDeleteModalVisible(state, visible) {
    state.isDeleteModalVisible = visible;
  }
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