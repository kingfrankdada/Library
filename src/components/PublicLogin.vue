<template>
  <div class="login">
    <i
      class="ri-user-line login-button"
      id="login-button"
      @click="setLoginModalVisible(true)"
    ></i>
    <NormalModal :size="modalSize" v-if="isLoginModalVisible">
      <div class="login-title">
        <span>LOGIN</span>
      </div>

      <div class="login-logo">
        <!-- <i class="ri-book-3-line"></i> -->
        <span>在线高校图书管理系统</span>
      </div>

      <div class="login-form" @keyup.enter="handleLogin">
        <input
          v-focus
          v-model="username"
          class="username"
          type="text"
          placeholder="Enter your username"
        />
        <input
          v-model="password"
          class="password"
          type="password"
          placeholder="Enter your password"
        />
        <button @click="handleLogin" class="login-btn">SUBMIT</button>
      </div>
      <div class="reg-change-btn">
        <div class="reg-change-btn-item" @click="changeRegModal">
          没有账户？立刻注册
        </div>
      </div>

      <!-- 自定义弹窗捕获 -->
      <AlertBox
        v-if="alertMsg"
        :message="alertMsg"
        @close="alertMsg = ''"
      ></AlertBox>
    </NormalModal>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import axios from "axios";
import AlertBox from "@/components/AlertBox";
import NormalModal from "@/components/NormalModal";

export default {
  name: "UserLogin",

  components: {
    AlertBox,
    NormalModal,
  },

  data() {
    return {
      username: "",
      password: "",
      alertMsg: "",
      modalSize: "normal",
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
    ...mapState("NormalModal", ["isLoginModalVisible"]),
  },

  methods: {
    ...mapMutations("NormalModal", [
      "setLoginModalVisible",
      "setLogoutModalVisible",
      "setRegModalVisible",
    ]),
    ...mapMutations("UserInfo", ["setUserInfo"]),

    checkWindowSize() {
      this.modalSize = window.innerWidth < 1150 ? "large" : "normal";
    },

    changeRegModal() {
      this.setLoginModalVisible(false);
      this.$nextTick(() => {
        this.setRegModalVisible(true);
      });
    },

    async handleLogin() {
      try {
        const response = await axios.post("http://localhost:3000/api/login", {
          username: this.username,
          password: this.password,
        });
        // 返回数据
        const userName = response.data.userName || this.username;
        const userToken = response.data.userToken;

        this.setUserInfo({
          isAdmin: userName === "admin",
          userName,
          userToken,
        });
        this.setLoginModalVisible(false);
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "登录失败:用户名或密码错误";
      }
    },
  },

  mounted() {
    this.checkWindowSize();
    window.addEventListener("resize", this.checkWindowSize);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.checkWindowSize);
  },
};
</script>
  
<style>
* {
  overflow: hidden;
}

.login {
  height: 100%;
  width: 100%;
  z-index: 0;
}

.login-title {
  position: relative;
  display: flex;
  height: 30%;
  width: 100%;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: 60px;
}

.login-logo {
  position: relative;
  height: 10%;
  width: 100%;
  text-align: center;
  font-size: 15px;
  color: var(--first-color);
  font-weight: var(--font-medium);
  overflow: hidden;
  text-align: center;
  align-items: center;
  justify-content: center;
}

.login-logo span {
  position: relative;
  top: 25%;
  text-align: center;
  align-items: center;
  justify-content: center;
}

.login-form {
  width: 100%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-form input {
  width: 70%;
  height: 80%;
  margin: 2%;
  border: 1px solid var(--first-color);
  border-radius: 5px;
}

.login-form button {
  cursor: pointer;
  margin: 2%;
  width: 30%;
  height: 75%;
  border: 1px solid var(--first-color);
  border-radius: 5px;
  background-color: var(--white-color);
  color: var(--first-color);
  font-weight: var(--font-medium);
}

.login-form button:hover {
  background-color: var(--first-color);
  color: var(--white-color);
  transition: 0.4s;
}

.reg-change-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 10%;
  text-align: center;
  font-size: 15px;
  color: var(--text-color);
  font-weight: var(--font-medium);
  overflow: hidden;
}

.reg-change-btn-item {
  cursor: pointer;
}

.reg-change-btn-item:hover {
  color: var(--first-color);
}

@media screen and (min-width: 1150px) {
  .login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .login-logo {
    position: relative;
    height: 10%;
    width: 100%;
    text-align: center;
    font-size: 15px;
    color: var(--first-color);
    font-weight: var(--font-medium);
    overflow: hidden;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
}
</style>