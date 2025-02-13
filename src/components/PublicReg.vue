<template>
  <div class="reg">
    <div class="reg-title">
      <span>Create Account</span>
    </div>

    <div class="reg-logo">
      <!-- <i class="ri-book-3-line"></i> -->
      <span>{{ $t("publicReg.logo") }}</span>
    </div>
    <div class="reg-form" @keyup.enter="handleReg">
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
        autocomplete="new-password"
      />
      <input
        v-model="confirmPassword"
        class="confirmPassword"
        type="password"
        placeholder="Enter your password again"
        autocomplete="new-password"
      />
      <input
        v-model="email"
        class="email"
        type="email"
        placeholder="Enter your email"
      />
      <!-- <button @click="handleReg" class="reg-btn" :disabled="loading">
        {{ loading ? "Loading..." : "SUBMIT" }}
      </button> -->
      <button @click="handleReg" class="reg-btn" :disabled="loading">
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
    <div class="login-change-btn">
      <div class="login-change-btn-item" @click="changeLoginModal">
        {{ $t("publicReg.changeLogin") }}
      </div>
    </div>

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
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import AlertBox from "@/components/AlertBox";
import MessageBox from "./MessageBox.vue";

export default {
  name: "UserReg",

  components: {
    AlertBox,
    MessageBox,
  },

  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      creditCount: 100,
      state: 1,
      email: "",
      alertMsg: "",
      adddate: "",
      message: "",
      loading: false,
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
  },

  methods: {
    ...mapMutations("NormalModal", [
      "setLoginModalVisible",
      "setRegModalVisible",
      "setRegModalVisible",
    ]),
    ...mapMutations("UserInfo", ["setUserInfo"]),
    changeLoginModal() {
      this.setRegModalVisible(false);
      this.$nextTick(() => {
        this.setLoginModalVisible(true);
      });
    },
    async handleReg() {
      // 前端数据验证
      this.username = this.username.trim();
      this.email = this.email.trim();
      if (this.username === "" || this.password === "" || this.email === "") {
        // alert("用户名和密码不能为空");
        this.alertMsg = this.$t("publicReg.handleReg.empty");
      } else if (this.password.length < 6) {
        // alert("密码不能少于6位");
        this.alertMsg = this.$t("publicReg.handleReg.short");
      } else if (this.password !== this.confirmPassword) {
        // alert("两次密码不一致");
        this.alertMsg = this.$t("publicReg.handleReg.notMatch");
      } else {
        this.adddate = new Date().toISOString().split("T")[0];
        this.loading = true;
        try {
          const response = await api.post(endpoints.reg, {
            username: this.username,
            usertoken: this.usertoken,
            password: this.password,
            role: 2, // 默认普通用户
            email: this.email,
            creditCount: this.creditCount,
            state: this.state,
            adddate: this.adddate,
          });
          // console.log(response);
          // alert(`注册成功：用户 ${response.data.username}`);

          // 获取用户的 IP 地址
          let userIP = "127.0.0.1";
          try {
            const ipResponse = await axios.get(
              "https://api.ipify.org?format=json",
              { timeout: 2000 }
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

          this.setUserInfo({
            role: response.data.role,
            username: response.data.username,
            usertoken: response.data.usertoken,
            userIP: userIP,
          });

          const adddate = new Date().toLocaleString("sv-SE", {
            timeZoneName: "short",
          });

          // 添加注册日志
          const newLog = {
            username: this.userInfo.username,
            userIP: this.userInfo.userIP,
            type: "注册",
            info: `用户${this.userInfo.username}于${adddate}注册`,
            creditCount: null,
            adddate: adddate,
          };
          await api.post(endpoints.addLog, newLog);

          // 添加信誉分表初始化信息
          const newCredit = {
            username: this.userInfo.username,
            creditCount: 100,
            info: "用户注册默认",
            adddate: adddate,
          };

          await api.post(endpoints.addCredit, newCredit);

          // this.alertMsg = `注册成功：用户 ${response.data.username}`;
          this.message = this.$t("publicReg.handleReg.success", {
            username: response.data.username,
          });

          this.loading = false;
          this.setRegModalVisible(false);
          window.location.reload();
        } catch (error) {
          // this.alertMsg = `注册失败：${error.response.data.error}`;
          this.alertMsg = this.$t("publicReg.handleReg.fail", {
            error: error.response.data.error,
          });
          this.loading = false;
        }
      }
    },
  },
};
</script>

<style>
* {
  overflow: hidden;
}

.reg {
  height: 100%;
  width: 100%;
}

.reg-title {
  height: 10%;
  width: 100%;
  margin: 10% 0 2% 0;
  text-align: center;
  font-size: 40px;
}

.reg-logo {
  height: 10%;
  width: 100%;
  text-align: center;
  font-size: 15px;
  color: var(--first-color);
  font-weight: var(--font-medium);
}

.reg-form {
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.reg-form input {
  width: 75%;
  height: 35%;
  margin: 1%;
  border: 1px solid var(--first-color);
  border-radius: 5px;
  background-color: var(--card-color);
  color: var(--text-color);
}

.reg-form button {
  cursor: pointer;
  padding: 0 20px 0 20px;
  margin-top: 10px;
  height: 35%;
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

.reg-form button:disabled .spinner {
  opacity: 0.8;
}

.reg-form button:hover {
  background-color: var(--first-color);
  color: var(--white-color);
  transition: 0.4s;
}

.reg-form button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.login-change-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 10%;
  margin-top: 5%;
  text-align: center;
  font-size: 15px;
  color: var(--text-color);
  font-weight: var(--font-medium);
}

.login-change-btn-item {
  cursor: pointer;
}

.login-change-btn:hover {
  color: var(--first-color);
}
</style>