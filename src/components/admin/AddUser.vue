<template>
  <div class="add-user">
    <table>
      <thead>
        <tr>
          <th>字段</th>
          <th>输入</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>名称*</td>
          <td>
            <input
              v-model="newUser.username"
              type="text"
              placeholder="输入用户名称"
            />
          </td>
        </tr>
        <tr>
          <td>状态*</td>
          <td>
            <select v-model="newUser.state">
              <option value="1">正常</option>
              <option value="0">关闭</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>预设邮箱*</td>
          <td>
            <input
              v-model="newUser.email"
              type="text"
              placeholder="输入预设用户邮箱"
            />
          </td>
        </tr>
        <tr>
          <td>注册日期</td>
          <td>
            {{ new Date().toLocaleDateString() }}
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="submitForm">提交</button>
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
        this.alertMsg = "用户信息不完整";
        return;
      }
      try {
        await api.post(endpoints.reg, this.newUser);
        // this.alertMsg = "用户添加成功";
        this.message = "用户添加成功，初始密码为：" + this.newUser.password;
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
        this.alertMsg = "用户添加失败";
      }
    },

    resetForm() {
      this.newUser = {
        username: "",
        state: 1,
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