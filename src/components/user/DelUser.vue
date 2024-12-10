<template>
  <div class="delete">
    <i
      class="ri-delete-box-line"
      id="delete-button"
      @click="setDelUserModalVisible(true)"
    ></i>
    <NormalModal size="small" v-if="isDelUserModalVisible">
      <div class="delete-form-content">
        <p class="warning-title"><i class="ri-alert-line"></i>警告</p>
        <p class="warning-message">
          <strong>此操作将会退出登录并清除您的所有用户数据</strong>
        </p>
      </div>
      <div class="delete-form-btn">
        <div class="delete-btn" @click="handleDel">确认</div>
        <div class="cancel-btn" @click="close">取消</div>
      </div>
    </NormalModal>
  </div>
</template>

<script scoped>
import api from "@/api/api";
import { endpoints } from "@/api/endpoints";
import { mapState, mapMutations } from "vuex";
import NormalModal from "@/components/NormalModal";

export default {
  name: "DelUser",

  props: {
    userId: {
      type: Number,
      required: true,
      default: 0,
    },
  },

  components: {
    NormalModal,
  },

  computed: {
    ...mapState("NormalModal", ["isDelUserModalVisible"]),
    ...mapState("UserInfo", ["userInfo"]),
  },

  methods: {
    ...mapMutations("UserInfo", ["setUserInfo"]),
    ...mapMutations("NormalModal", ["setDelUserModalVisible"]),

    async handleDel() {
      try {
        const adddate = new Date().toLocaleString("sv-SE", {
          timeZoneName: "short",
        });
        // 添加注销日志
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "注销",
          info: `用户${this.userInfo.username}于${adddate}注销`,
          creditCount: 0,
          adddate: adddate,
        };
        await api.post(endpoints.addLog, newLog);

        // 删除信誉分信息
        await api.post(endpoints.delCredit(this.userInfo.username));
        const user = {
          id: this.userId,
        };
        await api.post(endpoints.delUser(this.userId), user);
        // this.alertMsg = "删除用户成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除用户失败";
      }
      this.setUserInfo({
        role: "",
        username: "",
        usertoken: "",
        userIP: "",
      });
      if (this.$route.path !== "/home") {
        this.$router.push({ path: "/" });
      }
      this.setDelUserModalVisible(false);
    },

    close() {
      this.setDelUserModalVisible(false);
    },
  },
};
</script>

<style scoped>
.delete {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.delete-form-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70%;
  width: 100%;
}

.ri-alert-line {
  margin: 0 5px 0 5px;
  font-weight: normal;
}

.warning-title {
  font-size: 24px;
  font-weight: bold;
  color: red;
  margin-bottom: 10px;
}

.warning-message {
  padding: 5px;
  text-align: center;
  margin: 5px 0;
}

.delete-form-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: end;
  height: 30%;
  width: 100%;
}

.delete-btn,
.cancel-btn {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 50%;
}

.delete-btn:hover {
  background-color: red;
  border-radius: 0 0 0 2px;
  color: var(--white-color);
}

.cancel-btn:hover {
  background-color: var(--border-color);
  border-radius: 0 0 2px 0;
}
</style>
