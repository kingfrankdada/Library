<template>
  <div class="edit-user">
    <table>
      <thead>
        <tr>
          <th>字段</th>
          <th>双击可进行编辑</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>帐户名称*</td>
          <td>
            <InputTag
              v-model="users[0].username"
              @input="updateUser()"
            ></InputTag>
          </td>
        </tr>
        <tr>
          <td>帐户邮箱*</td>
          <td>
            <InputTag v-model="users[0].email" @input="updateUser()"></InputTag>
          </td>
        </tr>
      </tbody>
    </table>
    <p>Tips：双击表单项进行编辑，按下回车键提交表单项</p>
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
      @close="message = null"
    ></MessageBox>
  </div>
</template>

<script>
import api from "@/api/api";
import { endpoints } from "@/api/endpoints";
import AlertBox from "../AlertBox.vue";
import InputTag from "../InputTag.vue";
import MessageBox from "../MessageBox.vue";
import { mapState } from "vuex";
// import bcrypt from "bcryptjs";

export default {
  name: "EditUser",

  data() {
    return {
      users: [
        {
          id: null,
          username: "",
          email: "",
          password: "******",
          credit_count: 0,
          state: 0,
          adddate: "",
        },
      ],
      alertMsg: "",
      message: "",
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
  },

  components: {
    AlertBox,
    MessageBox,
    InputTag,
  },

  mounted() {
    this.selectUsersByUserName();
  },

  methods: {
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
          })) || [];
        if (this.users.length === 0) {
          this.alertMsg = "未找到任何用户记录";
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "获取用户数据失败";
      }
    },

    resetForm() {
      this.users = [
        {
          id: null,
          username: "",
          email: "",
          password: "",
          credit_count: 0,
          state: 0,
          adddate: "",
        },
      ];
    },

    updateUser() {
      // this.alertMsg = "更新表单数据成功";
    },

    async submitForm() {
      const user = this.users[0];
      if (!user.username || !user.email) {
        this.alertMsg = "用户名和邮箱不能为空";
        return;
      }
      try {
        await api.post(endpoints.updateUser(user.id), {
          username: user.username,
          email: user.email,
        });

        // 添加更新日志
        const adddate = new Date().toLocaleString("sv-SE", {
          timeZoneName: "short",
        });
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "更新",
          info: `更新用户：${user.username}`,
          creditCount: null,
          adddate: adddate,
        };
        await api.post(endpoints.addLog, newLog);

        this.alertMsg = "更新用户数据成功";
        this.$emit("close");
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "更新用户数据失败";
      }
    },
  },
};
</script>

<style scoped>
.edit-user {
  height: 100%;
  width: 100%;
  margin-bottom: 20px;
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

p {
  margin-left: 8px;
}

button {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 40%;
  margin-top: 10%;
  width: 20%;
  height: 12.5%;
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