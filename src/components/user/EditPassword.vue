<template>
  <div class="edit-password">
    <form>
      <table>
        <tbody>
          <tr>
            <td>{{ $t("editPassword.username") }}</td>
            <td>
              {{ userInfo.username }}
            </td>
          </tr>
          <tr>
            <td>{{ $t("editPassword.oldPassword") }}</td>
            <td>
              <input
                v-model="oldPassword"
                type="password"
                :placeholder="$t('editPassword.oldPasswordPlaceholder')"
                class="input-field"
                autocomplete="current-password"
              />
            </td>
          </tr>
          <tr>
            <td>{{ $t("editPassword.newPassword") }}</td>
            <td>
              <input
                v-model="newPassword"
                type="password"
                :placeholder="$t('editPassword.newPasswordPlaceholder')"
                class="input-field"
                autocomplete="new-password"
              />
            </td>
          </tr>
          <tr>
            <td>{{ $t("editPassword.confirmPassword") }}</td>
            <td>
              <input
                v-model="confirmPassword"
                type="password"
                :placeholder="$t('editPassword.confirmPasswordPlaceholder')"
                class="input-field"
                autocomplete="new-password"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
    <!-- <p class="warning">
      <i class="ri-alert-line"></i>警告：密码修改后需重新登录
    </p> -->
    <button @click="submitForm">{{ $t("editPassword.submit") }}</button>
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
import AlertBox from "../AlertBox.vue";
import MessageBox from "../MessageBox.vue";
import { mapState } from "vuex";

export default {
  name: "EditPassword",

  data() {
    return {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      alertMsg: "",
      message: "",
    };
  },

  props: {
    userId: {
      type: Number,
      required: true,
    },
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
  },

  components: {
    AlertBox,
    MessageBox,
  },

  methods: {
    async submitForm() {
      try {
        if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
          this.alertMsg = this.$t("editPassword.submitForm.empty");
        } else if (this.newPassword !== this.confirmPassword) {
          this.alertMsg = this.$t("editPassword.submitForm.notMatch");
        } else if (this.newPassword.length < 6) {
          this.alertMsg = this.$t("editPassword.submitForm.short");
        } else {
          await api.post(endpoints.resetPassword(this.userId), {
            id: this.userId,
            username: this.userInfo.username,
            password: this.newPassword,
            oldPassword: this.oldPassword,
          });
          this.$emit("logout");
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("editPassword.submitForm.error");
      }
    },
  },
};
</script>

<style scoped>
.edit-password {
  height: 100%;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  border-top: 1px solid #ddd;
  border-bottom: 1px dashed #ddd;
  padding: 8px;
}

input {
  color: var(--text-color);
  background-color: var(--card-color);
}

th {
  background-color: var(--background-color);
}

.warning {
  font-weight: bold;
  color: red;
  text-align: center;
}

.ri-alert-line {
  font-weight: normal;
}

button {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 40%;
  margin-top: 20px;
  width: 20%;
  height: 12.5%;
  border: 1px solid red;
  border-radius: 5px;
  background-color: var(--card-color);
  color: red;
  font-weight: var(--font-medium);
}

button:hover {
  background-color: red;
  color: var(--white-color);
  transition: 0.4s;
}

.input-field {
  width: 100%;
  padding: 5px;
  border: 1px solid var(--first-color);
  border-radius: 4px;
  transition: border-color 0.3s;
}

.close-button {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #aaa;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s;
}

.close-button:hover {
  color: #000;
}
</style>
