<template>
  <div class="user">
    <div v-show="this.$route.path === '/user'" class="user-body">
      <!-- <div class="user-title">
        <p>用户中心</p>
      </div> -->
      <div class="user-container">
        <div class="user-info">
          <p class="user-info-title">
            {{ $t("userSetting.personalInfo")
            }}<i
              class="ri-question-line"
              :title="$t('userSetting.personalInfoTip')"
            ></i>
          </p>
          <p class="user-info-content">
            {{ $t("userSetting.username") }} {{ userInfo.username }}
            <span v-if="userInfo.role == 0" style="color: red">{{
              $t("userSetting.superAdmin")
            }}</span>
            <span v-else-if="userInfo.role == 1" style="color: red">{{
              $t("userSetting.admin")
            }}</span>
            <span v-else style="color: green">{{
              $t("userSetting.user")
            }}</span>
          </p>
          <p class="user-info-content">
            {{ $t("userSetting.email") }} {{ users[0].email }}
          </p>
          <p class="user-info-content">
            {{ $t("userSetting.registerDate") }}
            {{ formatDate(users[0].adddate) }}
          </p>
          <button class="user-info-button" @click="editUser">
            {{ $t("userSetting.edit") }}
          </button>
          <div class="line"></div>
          <div class="account-security">
            <p class="account-security-title">
              {{ $t("userSetting.security") }}
            </p>
            <p class="account-security-description">
              {{ $t("userSetting.securityTip") }}
            </p>
            <button class="user-info-button" @click="changePassword">
              {{ $t("userSetting.changePassword") }}
            </button>
            <button class="user-info-button red-button" @click="delAccount">
              {{ $t("userSetting.delAccount") }}
            </button>
          </div>
        </div>
        <!-- 用户信誉分 -->
        <div class="user-credit">
          <p class="user-credit-title">
            {{ $t("userSetting.credit")
            }}<i
              class="ri-question-line"
              :title="$t('userSetting.creditTip')"
            ></i>
          </p>
          <!-- echarts -->
          <div
            v-if="users[0].credit_count >= 0"
            class="user-credit-echarts"
            ref="creditChartRef"
          ></div>
          <div class="user-credit-neg" v-else>
            <i class="ri-alert-line"></i>
            <!-- <i class="ri-error-warning-fill"></i> -->
            {{ users[0].credit_count }}
            <i class="ri-alert-line"></i>
          </div>
          <p>
            <strong
              >{{ $t("userSetting.currentCredit") }}
              <span :style="{ color: creditCountColor }">
                {{ users[0].credit_count }}
              </span></strong
            >
          </p>
          <div class="user-credit-content">
            <p>
              {{ $t("userSetting.creditContent") }}
            </p>
            <button class="user-info-button" @click="goCredit">
              {{ $t("userSetting.goCredit") }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 路由 -->
    <router-view class="user-body"></router-view>
    <!-- 左侧导航 -->
    <UserLeftGuide
      class="left-guide-model"
      :guideTitle="$t('userSetting.guideTitle')"
      :guideList="guideList"
      @handleTitle="handleTitle"
    ></UserLeftGuide>
    <!-- 修改用户信息模态框 -->
    <NormalModal v-if="isEditUserModalVisible" class="select-modal" size="mid">
      <div v-if="isEditUser" class="select-text">
        {{ $t("userSetting.editUser") }}
      </div>
      <div v-else class="select-text">{{ $t("userSetting.editPassword") }}</div>
      <EditUser
        v-if="isEditUser"
        :user="users[0]"
        @close="handleEditUserModalClose"
      ></EditUser>
      <EditPassword
        v-else
        :userId="users[0].id"
        @logout="logout"
      ></EditPassword>
    </NormalModal>
    <!-- 注销账户模态框 -->
    <DelUser :userId="users[0].id"></DelUser>
    <!-- 自定义弹窗捕获 -->
    <AlertBox
      v-if="alertMsg"
      :message="alertMsg"
      @close="alertMsg = null"
    ></AlertBox>
    <MessageBox
      v-if="message"
      :message="message"
      @close="message = null"
    ></MessageBox>
  </div>
</template>

<script>
import api from "@/api/api";
import { endpoints } from "@/api/endpoints";
import AlertBox from "@/components/AlertBox.vue";
import MessageBox from "@/components/MessageBox.vue";
import NormalModal from "@/components/NormalModal.vue";
import EditUser from "@/components/user/EditUser.vue";
import EditPassword from "@/components/user/EditPassword.vue";
import DelUser from "@/components/user/DelUser.vue";
import { mapState, mapMutations } from "vuex";
import { eventBus } from "@/utils/eventBus";
import UserLeftGuide from "@/components/user/UserLeftGuide.vue";
import * as echarts from "echarts";

export default {
  name: "UserSetting",
  data() {
    return {
      users: [
        {
          id: 0,
          username: "",
          email: "",
          password: "",
          credit_count: 0,
          state: 0,
          adddate: "",
        },
      ],
      guideList: [],
      isEditUser: true, // 修改用户信息还是修改密码
      creditChart: null,
      alertMsg: "",
      message: "",
    };
  },

  components: {
    UserLeftGuide,
    AlertBox,
    MessageBox,
    NormalModal,
    EditUser,
    EditPassword,
    DelUser,
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
    ...mapState("NormalModal", ["isEditUserModalVisible"]),

    creditCountColor() {
      const creditCount = this.users[0].credit_count;
      if (creditCount >= 50) {
        return "green";
      } else if (creditCount > 0) {
        return "orange";
      } else {
        return "red";
      }
    },
  },

  mounted() {
    if (!this.userInfo.usertoken) {
      this.$router.push("/home");
    }
    this.setGuideList();
    window.addEventListener("resize", this.resizeCharts);
    // 归还图书，刷新echarts
    eventBus.$on("borrow-returned", this.handleBorrowReturned);

    eventBus.$on("language-changed", this.setGuideList);
    this.selectUsersByUserName().then(() => {
      if (this.users[0].credit_count >= 0) {
        this.initCreditChart();
      }
      this.setEditUserModalVisible(false);
      this.setDelUserModalVisible(false);
    });
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
    eventBus.$off("borrow-returned", this.handleBorrowReturned);
    if (this.creditChart) {
      this.creditChart.dispose();
    }
  },

  watch: {
    $route() {
      this.$nextTick(() => {
        this.resizeCharts();
      });
    },
  },

  methods: {
    ...mapMutations("NormalModal", [
      "setEditUserModalVisible",
      "setDelUserModalVisible",
    ]),
    ...mapMutations("UserInfo", ["setUserInfo"]),

    setGuideList() {
      this.$nextTick(() => {
        this.guideList = [
          {
            id: 1,
            name: "collection",
            title: this.$t("userSetting.guideList.collection"),
            path: "/user/collection",
            icon: "ri-heart-line",
          },
          {
            id: 2,
            name: "borrow",
            title: this.$t("userSetting.guideList.borrow"),
            path: "/user/borrow",
            icon: "ri-book-open-line",
          },
          {
            id: 3,
            name: "comment",
            title: this.$t("userSetting.guideList.comment"),
            path: "/user/comment",
            icon: "ri-message-3-line",
          },
          {
            id: 4,
            name: "credit",
            title: this.$t("userSetting.guideList.credit"),
            path: "/user/credit",
            icon: "ri-bank-card-line",
          },
        ];
      });
    },

    async selectUsersByUserName() {
      try {
        const response = await api.get(
          endpoints.selectUserByUsername(this.userInfo.username)
        );
        const users = response.data.users;
        this.users =
          users.map((user) => ({
            ...user,
            creditCount: user.credit_count,
          })) || {};
        if (this.users.length === 0) {
          this.alertMsg = this.$t("userSetting.selectUsersByUserName.empty");
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("userSetting.selectUsersByUserName.error");
      }
    },

    // 刷新信誉分图表
    async handleBorrowReturned() {
      try {
        // 更新用户信息
        await this.selectUsersByUserName();
        this.$nextTick(() => {
          this.initCreditChart();
        });
      } catch (error) {
        console.error(error);
      }
    },

    goCredit() {
      this.$router.push({ path: "/user/credit" });
    },

    // 日期格式化
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    // 动态调整图表
    resizeCharts() {
      if (this.creditChart) this.creditChart.resize();
    },

    editUser() {
      this.isEditUser = true;
      this.setEditUserModalVisible(true);
    },

    handleEditUserModalClose() {
      this.setEditUserModalVisible(false);
      this.selectUsersByUserName();
    },

    logout() {
      this.setEditUserModalVisible(false);
      this.setUserInfo({
        role: "",
        username: "",
        usertoken: "",
      });
      if (this.$route.path !== "/home") {
        this.$router.push({ path: "/" });
      }
    },

    changePassword() {
      this.isEditUser = false;
      this.setEditUserModalVisible(true);
    },

    delAccount() {
      this.setDelUserModalVisible(true);
    },

    handleTitle() {
      if (this.$route.path !== "/user") {
        this.$router.push({ path: "/user" });
      }
    },

    // 初始化信誉分图表
    initCreditChart() {
      const chartContainer = this.$refs.creditChartRef;
      this.creditChart = echarts.init(chartContainer);
      const creditCount = this.users[0].credit_count;
      // 动态设置颜色，根据信誉分高低设置绿->红
      const getColor = (count) => {
        if (count >= 50) {
          return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: "rgb(84, 198, 84)" },
            { offset: 1, color: "rgb(198, 236, 1)" },
          ]);
        } else {
          return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: "rgb(236, 99, 1)" },
            { offset: 1, color: "rgb(236, 1, 1)" },
          ]);
        }
      };

      const gaugeData = [
        {
          value: creditCount,
        },
      ];

      const option = {
        series: [
          {
            type: "gauge",
            startAngle: 90,
            endAngle: -270,
            pointer: {
              show: false,
            },
            progress: {
              show: true,
              width: 20,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                color: getColor(creditCount),
              },
            },
            axisLine: {
              lineStyle: {
                width: 20,
                color: [[1, "#E0E0E0"]],
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            data: gaugeData,
            title: {
              show: true,
              fontSize: 20,
            },
            detail: {
              width: 40,
              height: 14,
              fontSize: 20,
              color: creditCount >= 50 ? "rgb(84, 198, 84)" : "rgb(236, 1, 1)", // 内部文字颜色
              formatter: "{value}",
              offsetCenter: ["0%", "0%"],
            },
          },
        ],
      };
      this.creditChart.setOption(option);
    },
  },
};
</script>

<style scoped>
.user {
  height: 100%;
  width: 100%;
  z-index: 0;
  background: var(--background-color);
  display: flex;
  flex-direction: column;
}

.user-body {
  position: fixed;
  background: var(--background-color);
  height: 100%;
  width: 85%;
  left: 15%;
  transition: left 0.3s ease;
}

.user-title {
  width: 100%;
  height: 40px;
  padding: 10px 0 0 20px;
  text-align: left;
  font-size: 20px;
  font-weight: bold;
  color: var(--first-color);
}

.user-container {
  display: flex;
  background-color: var(--card-color);
  width: calc(100% - 40px);
  height: calc(100% - 40px - var(--header-height));
  margin: 20px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  gap: 20px;
}

.user-info,
.user-credit {
  flex: 1;
  background-color: var(--card-color);
  padding: 20px;
  border-radius: 8px;
}

.user-info-title,
.user-credit-title,
.account-security-title {
  font-weight: bold;
  font-size: 20px;
}

.account-security-description {
  margin-top: 10px;
  font-size: 14px;
}

.user-info-content,
.user-credit-content {
  margin-top: 10px;
}

.user-credit-echarts {
  width: 100%;
  height: 250px;
}

.user-credit-neg {
  color: red;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  margin: 20px;
}

.user-credit-neg .ri-alert-line {
  margin: 0 20px 0 20px;
  font-weight: normal;
}

.user-info-button {
  margin-top: 20px;
  margin-right: 20px;
  padding: 5px 10px;
  border: 1px solid var(--first-color);
  border-radius: 5px;
  background-color: var(--card-color);
  color: var(--first-color);
  font-weight: var(--font-medium);
}

.red-button {
  border: 1px solid red;
  color: red;
}

.user-info-button:hover {
  cursor: pointer;
  background-color: var(--first-color);
  color: var(--white-color);
  transition: 0.4s;
}

.red-button:hover {
  cursor: pointer;
  background-color: red;
  color: var(--white-color);
  transition: 0.4s;
}

.line {
  width: 100%;
  height: 1px;
  background-color: #ccc;
  margin: 20px 0;
}

.select-modal {
  width: 100%;
  height: 100%;
  transition: left 0.4s ease;
}

.select-text {
  left: 20px;
  width: 100%;
  height: 50px;
  text-align: left;
  font-size: 20px;
  font-weight: var(--font-semi-bold);
  color: var(--first-color);
  margin-top: 20px;
  margin-left: 20px;
}

.ri-question-line {
  font-weight: normal;
  font-size: 20px;
  margin-left: 10px;
}

.ri-question-line:hover {
  color: var(--first-color);
}
</style>