<template>
  <div class="add-user">
    <table>
      <thead>
        <tr>
          <th>{{ $t("addUser.field") }}</th>
          <th>{{ $t("addUser.input") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ $t("addUser.username") }}*</td>
          <td>
            <input
              v-model="newUser.username"
              type="text"
              :placeholder="$t('addUser.usernamePlaceholder')"
            />
          </td>
        </tr>
        <tr>
          <td>{{ $t("addUser.state") }}*</td>
          <td>
            <select v-model="newUser.state">
              <option value="1">{{ $t("addUser.normal") }}</option>
              <option value="0">{{ $t("addUser.banned") }}</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>{{ $t("addUser.email") }}*</td>
          <td>
            <input
              v-model="newUser.email"
              type="text"
              :placeholder="$t('addUser.emailPlaceholder')"
            />
          </td>
        </tr>
        <tr>
          <td>{{ $t("addUser.adddate") }}</td>
          <td>
            {{ new Date().toLocaleDateString() }}
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="submitForm">{{ $t("addUser.submit") }}</button>
    <!-- 自定义弹窗捕获 -->
    <AlertBox
      v-if="alertMsg"
      :message="alertMsg"
      @close="alertMsg = null"
    ></AlertBox>
    <MessageBox
      v-if="message"
      :message="message"
      :showCopyButton="showCopyButton"
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
  name: "AddUser",
  components: {
    AlertBox,
    MessageBox,
  },

  data() {
    return {
      newUser: {
        username: "",
        password: "",
        role: 2,
        creditCount: 100,
        state: 1,
        adddate: "",
        email: "",
      },
      alertMsg: "",
      message: "",
      showCopyButton: false,
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
  },

  methods: {
    async submitForm() {
      this.newUser.adddate = new Date().toISOString().split("T")[0];
      this.newUser.password = Math.random().toString(36).slice(-8);
      if (!this.newUser.username || !this.newUser.email) {
        this.alertMsg = this.$t("addUser.submitForm.empty");
        return;
      }
      try {
        await api.post(endpoints.reg, this.newUser);
        // this.alertMsg = "用户添加成功";
        this.message = this.$t("addUser.submitForm.success", {
          password: this.newUser.password,
        });
        this.showCopyButton = true;

        // 添加更新日志
        const adddate = new Date().toLocaleString("sv-SE", {
          timeZoneName: "short",
        });
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "新增",
          info: `新增用户：${this.newUser.username}`,
          creditCount: null,
          adddate: adddate,
        };
        await api.post(endpoints.addLog, newLog);

        this.resetForm(); // 提交后重置表单
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("addUser.submitForm.fail");
      }
    },

    resetForm() {
      this.newUser = {
        username: "",
        password: "",
        role: 2,
        creditCount: 100,
        state: 1,
        adddate: "",
        email: "",
      };
    },
  },
};
</script>

<style scoped>
.add-user {
  height: 100%;
  width: 100%;
  margin-bottom: 20px;
  overflow-y: scroll;
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
  text-align: left;
}

th {
  background-color: var(--background-color);
}

button {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 40%;
  width: 20%;
  height: 7.5%;
  border: 1px solid var(--first-color);
  border-radius: 5px;
  background-color: var(--card-color);
  color: var(--first-color);
  font-weight: var(--font-medium);
}

button:hover {
  background-color: var(--first-color);
  color: var(--white-color);
  transition: 0.4s;
}

input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: var(--card-color);
  color: var(--text-color);
}

input:focus,
textarea:focus,
select:focus {
  border: 1px solid var(--first-color);
  transition: 0.4s;
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