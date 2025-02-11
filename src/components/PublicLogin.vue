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
        <span>{{ $t("publicLogin.logo") }}</span>
      </div>

      <div class="login-form" @keyup.enter="handleLogin">
        <input
          v-focus
          v-model="username"
          class="username"
          type="text"
          placeholder="Enter your username"
          autocomplete="username"
        />
        <input
          v-model="password"
          class="password"
          type="password"
          placeholder="Enter your password"
          autocomplete="current-password"
        />
        <!-- <button @click="handleLogin" class="login-btn" :disabled="loading">
          {{ loading ? "Loading..." : "SUBMIT" }}
        </button> -->
        <button @click="handleLogin" class="login-btn" :disabled="loading">
          <span class="button-content">
            <!-- SVG动画 -->
            <svg
              v-if="loading"
              class="spinner"
              viewBox="0 0 50 50"
              :style="{ height: '1em', width: '1em' }"
            >
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="currentColor"
                stroke-width="4"
              />
            </svg>
            <span :class="{ 'loading-text': loading }">
              {{ loading ? "Loading..." : "SUBMIT" }}
            </span>
          </span>
        </button>
      </div>
      <div class="reg-change-btn">
        <div class="reg-change-btn-item" @click="changeRegModal">
          {{ $t("publicLogin.changeReg") }}
        </div>
      </div>

      <!-- 自定义弹窗捕获 -->
      <AlertBox
        v-if="alertMsg"
        :message="alertMsg"
        @close="alertMsg = null"
      ></AlertBox>
    </NormalModal>
  </div>
</template>

<script>
import api from "@/api/api";
import { endpoints } from "@/api/endpoints";
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
      loading: false,
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

    keyDown(e) {
      if (e.key == 13) {
        this.handleLogin();
      }
    },

    checkWindowSize() {
      this.modalSize = window.innerWidth < 1150 ? "mid" : "normal";
    },

    changeRegModal() {
      this.setLoginModalVisible(false);
      this.$nextTick(() => {
        this.setRegModalVisible(true);
      });
    },

    async handleLogin() {
      this.loading = true;

      if(this.username === "" || this.password === "") {
        this.alertMsg = this.$t("publicLogin.empty");
        this.loading = false;
        return;
      }

      try {
        // 获取用户的 IP 地址
        let userIP = "127.0.0.1";
        try {
          const ipResponse = await axios.get(
            "https://api.ipify.org?format=json",
            { timeout: 1500 }
          );
          userIP = ipResponse.data.ip;
        } catch (error) {
          console.warn(
            "无法通过公网API获取IP地址，尝试本地获取:",
            error.message
          );
          try {
            const localResponse = await api.get(endpoints.getLocalIP);
            userIP = localResponse.data.ip;
          } catch (localError) {
            console.error("获取本地IP失败，使用默认IP:", localError.message);
          }
        }

        const adddate = new Date().toLocaleString("sv-SE", {
          timeZoneName: "short",
        });

        const response = await api.post(endpoints.login, {
          username: this.username,
          password: this.password,
        });
        // 返回数据
        const username = response.data.username || this.username;
        const usertoken = response.data.usertoken;
        const role = response.data.role || 2;

        this.setUserInfo({
          role,
          username,
          usertoken,
          userIP,
        });

        // 添加登录日志
        const newLog = {
          username: username,
          userIP: userIP,
          type: "登录",
          info: `用户${username}于${adddate}登录`,
          creditCount: null,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        this.loading = false;
        this.setLoginModalVisible(false);
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("publicLogin.loginError");
        this.loading = false;
      }
    },
  },

  mounted() {
    this.checkWindowSize();
    window.addEventListener("resize", this.checkWindowSize);
    window.addEventListener("keydown", this.keyDown);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.checkWindowSize);
    window.removeEventListener("keydown", this.keyDown, false);
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
  background-color: var(--card-color);
  color: var(--text-color);
}

.login-form button {
  cursor: pointer;
  padding: 0 20px 0 20px;
  height: 75%;
  border: 1px solid var(--first-color);
  border-radius: 5px;
  background-color: var(--card-color);
  color: var(--first-color);
  font-weight: var(--font-medium);
  position: relative;
}

.spinner {
  animation: rotate 1s linear infinite;
}

.spinner circle {
  stroke-dasharray: 90, 150;
  stroke-dashoffset: -35;
  stroke-linecap: round;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  transition: opacity 0.2s;
  opacity: 0.8;
}

.login-form button:disabled .spinner {
  opacity: 0.8;
}

.login-form button:hover {
  background-color: var(--first-color);
  color: var(--white-color);
  transition: 0.4s;
}

.login-form button:disabled {
  cursor: not-allowed;
  background-color: var(--first-color);
  color: var(--white-color);
  opacity: 0.8;
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

/* @media screen and (min-width: 1150px) {
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
} */
</style>