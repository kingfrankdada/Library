<template>
  <div class="logout">
    <i
      class="ri-logout-box-line"
      id="logout-button"
      @click="setLogoutModalVisible(true)"
    ></i>
    <NormalModal size="small" v-if="isLogoutModalVisible">
      <div class="logout-form-content">
        <p>确定要退出登录？</p>
      </div>
      <div class="logout-form-btn">
        <div class="logout-btn" @click="handleLogout">确认</div>
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
  name: "PublicLogout",

  components: {
    NormalModal,
  },

  computed: {
    ...mapState("NormalModal", ["isLogoutModalVisible"]),
    ...mapState("UserInfo", ["userInfo"]),
  },

  methods: {
    ...mapMutations("UserInfo", ["setUserInfo"]),
    ...mapMutations("NormalModal", ["setLogoutModalVisible"]),
    async handleLogout() {
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });
      // 添加登出日志
      const newLog = {
        username: this.userInfo.username,
        userIP: this.userInfo.userIP,
        type: "登出",
        info: `用户${this.userInfo.username}于${adddate}登出`,
        creditCount: 0,
        adddate: adddate,
      };
      await api.post(endpoints.addLog, newLog).then(() => {
        this.setUserInfo({
          role: "",
          username: "",
          usertoken: "",
          userIP: "",
        });
        this.setLogoutModalVisible(false);
        if (this.$route.path !== "/home") {
          this.$router.push({ path: "/" });
        }
      });
    },
    close() {
      this.setLogoutModalVisible(false);
    },
  },
};
</script>

<style scoped>
.logout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.logout-form-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 70%;
  width: 100%;
}

.logout-form-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: end;
  height: 30%;
  width: 100%;
}

.logout-btn {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 50%;
}

.cancel-btn {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 50%;
}

.logout-btn:hover {
  background-color: var(--border-color);
  border-radius: 0 0 0 2px;
}

.cancel-btn:hover {
  background-color: var(--border-color);
  border-radius: 0 0 2px 0;
}
</style>