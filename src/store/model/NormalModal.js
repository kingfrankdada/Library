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
  isDeleteModalVisible: false,
  // 公告展示模态框
  isNoticeModalVisible: false,
  // 用户编辑模态框
  isEditUserModalVisible: false,
  // 用户注销模态框
  isDelUserModalVisible: false,
  // 公告编辑模态框
  isEditNoticeModalVisible: false
};

const mutations = {
  // 登录模态框方法
  setLoginModalVisible(state, payload) {
    state.isLoginModalVisible = payload;
  },
  // 退出模态框方法
  setLogoutModalVisible(state, payload) {
    state.isLogoutModalVisible = payload;
  },
  // 注册模态框方法
  setRegModalVisible(state, payload) {
    state.isRegModalVisible = payload;
  },
  // 搜索模态框方法
  setSearchModalVisible(state, payload) {
    state.isSearchModalVisible = payload;
  },
  // 查看模态框方法
  setSelectModalVisible(state, payload) {
    state.isSelectModalVisible = payload;
  },
  // 添加模态框方法
  setAddModalVisible(state, payload) {
    state.isAddModalVisible = payload;
  },
  // 修改模态框方法
  setUpdateModalVisible(state, payload) {
    state.isUpdateModalVisible = payload;
  },
  // 删除模态框方法
  setkDeleteModalVisible(state, payload) {
    state.isDeleteModalVisible = payload;
  },
  // 公告展示模态框方法
  setNoticeModalVisible(state, payload) {
    state.isNoticeModalVisible = payload;
  },
  // 用户编辑模态框
  setEditUserModalVisible(state, payload) {
    state.isEditUserModalVisible = payload;
  },
  // 用户注销模态框
  setDelUserModalVisible(state, payload) {
    state.isDelUserModalVisible = payload;
  },
  // 公告编辑模态框
  setEditNoticeModalVisible(state, payload) {
    state.isEditNoticeModalVisible = payload;
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