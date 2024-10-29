<template>
  <div class="user-user">
    <!-- 用户设置容器 -->
    <div class="user-body">
      <div class="dashboard">
        <!-- 实时数据卡片 -->
        <div class="card user-info">
          <div class="card-title">账户信息</div>
          <div class="card-body"></div>
        </div>
        <!-- 内存数据卡片 -->
        <div class="card user-credit">
          <div class="card-title">用户信誉分</div>
          <div class="card-body"></div>
        </div>
        <!-- 公告卡片 -->
        <div class="card notice-ratio">
          <div class="card-title">站内公告</div>
          <div class="card-body">
            <div class="notice-chart-container">
              <ul class="notice-list">
                <li
                  v-for="notice in pinnedNotices"
                  :key="notice.id"
                  class="notice-item"
                  @click="openNotice(notice)"
                >
                  <span class="top-notice">[置顶]</span>
                  {{ notice.title }} - {{ notice.adddate }}
                </li>
              </ul>
              <!-- 普通公告列表 -->
              <ul class="notice-list">
                <li
                  v-for="notice in regularNotices"
                  :key="notice.id"
                  class="notice-item"
                  @click="openNotice(notice)"
                >
                  {{ notice.title }} - {{ notice.adddate }}
                </li>
              </ul>
            </div>
            <!-- 公告详情展示区域 -->
            <NoticeBox
              class="notice-box"
              v-if="selectedNotice"
              :notice="selectedNotice"
              @close="selectedNotice = null"
            ></NoticeBox>
          </div>
        </div>
      </div>
    </div>
    <router-view class="user-body"></router-view>
    <UserLeftGuide class="left-guide-model"></UserLeftGuide>
    <!-- 自定义弹窗捕获 -->
    <AlertBox
      v-if="alertMsg"
      :message="alertMsg"
      @close="alertMsg = ''"
    ></AlertBox>
    <MessageBox
      v-if="message"
      :message="message"
      @close="message = ''"
    ></MessageBox>
  </div>
</template>

<script>
import axios from "axios";
import AlertBox from "@/components/AlertBox.vue";
import NoticeBox from "@/components/NoticeBox.vue";
import MessageBox from "@/components/MessageBox.vue";
import { mapState } from "vuex";
import UserLeftGuide from "@/components/user/UserLeftGuide.vue";

export default {
  name: "UserSetting",
  data() {
    return {
      users: [],
      notices: [], // 存储公告数据
      selectedNotice: null, // 存储当前选中的公告
      alertMsg: "",
      message: "",
    };
  },

  components: {
    UserLeftGuide,
    AlertBox,
    MessageBox,
    NoticeBox,
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),

    // 置顶公告
    pinnedNotices() {
      return this.notices.filter((notice) => notice.top);
    },

    // 普通公告
    regularNotices() {
      return this.notices.filter((notice) => !notice.top);
    },
  },

  mounted() {
    this.selectUsersByUserName();
    this.selectNotice();
  },

  methods: {
    async selectUsersByUserName() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/selectUser/${this.userInfo.username}`
        );
        console.log("response", response);
        const users = response.data.users;
        this.users =
          users.map((user) => ({
            ...user,
            creditCount: user.credit_count,
          })) || [];

        if (this.users.length === 0) {
          this.boxMsg = "未找到任何用户记录";
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = "获取用户数据失败";
      }
    },

    // 选择公告时，传递数据给 NoticeBox 组件
    openNotice(notice) {
      this.selectedNotice = notice;
    },

    // 获取公告数据
    async selectNotice() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/selectNotice"
        );
        this.notices = response.data.notice || [];

        if (this.notices.length === 0) {
          this.selectedNotice = { info: "未找到任何公告记录" };
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.selectedNotice = { info: "获取公告数据失败" };
      }
    },
  },
};
</script>

<style scoped>
.user-user {
  height: 100%;
  width: 100%;
  z-index: 0;
  background: var(--background-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-body {
  position: fixed;
  height: 100%;
  width: 85%;
  left: 15%;
  transition: left 0.3s ease;
}

.user-body {
  position: fixed;
  height: 100%;
  width: 85%;
  left: 15%;
  transition: left 0.3s ease;
}

.card {
  background-color: var(--body-color);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.card-title {
  display: flex;
  font-weight: var(--font-semi-bold);
  font-size: 20px;
  padding: 0 0 5px 0;
}

.card-body {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  padding: 0 5px 5px 0;
  width: 100%;
}

.card-body > * {
  margin-right: auto;
}

.card-form-item {
  width: 100%;
}

.card-form-count {
  font-weight: var(--font-semi-bold);
  position: sticky;
  font-size: 20px;
  color: var(--text-color);
  padding: 0 5px 5px 0;
}

.notice-chart-container {
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.notice-box {
  margin-left: 7.5%;
}

.notice-chart-container::-webkit-scrollbar {
  display: none;
}

.dashboard {
  display: grid;
  grid-template-columns: 70% 30%; /* 左70%，右30% */
  grid-template-rows: 70% 30%; /* 上70%，下30% */
  gap: 20px;
  padding: 20px; 
  width: calc(100% - 20px);
  height: 90%;
  box-sizing: border-box;
}

.user-info {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  height: 100%;
}

.user-credit {
  grid-column: 2 / 3; 
  grid-row: 1 / 2;
  height: 100%;
}

.notice-ratio {
  grid-column: 1 / 3; 
  grid-row: 2 / 3;
  width: 100%;
  height: 100%;
}

.notice-form {
  position: absolute;
  display: flex;
  width: 100%;
  justify-content: center;
  font-size: 30px;
  color: var(--first-color);
  font-weight: var(--font-medium);
  top: 20px;
  z-index: 0;
}

.notice-list {
  list-style: none;
  padding: 0;
}

.notice-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  z-index: 1;
}

.notice-item:hover {
  background-color: #f0f0f0;
}

.top-notice {
  color: red;
  font-weight: bold;
  margin-right: 5px;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>