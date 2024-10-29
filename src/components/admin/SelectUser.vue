<template>
  <div class="select-user">
    <table v-if="users.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>用户*</th>
          <th>状态*</th>
          <th>信誉分*</th>
          <th>注册日期</th>
          <th>删除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="index">
          <td>{{ user.id }}</td>
          <td>
            <InputTag
              v-model="user.username"
              @input="updateUser(user)"
            ></InputTag>
          </td>
          <td>
            <select v-model="user.state" @change="updateUser(user)">
              <option value="1">正常</option>
              <option value="0">关闭</option>
            </select>
          </td>
          <td>
            <InputTag
              v-model="user.creditCount"
              @input="updateUser(user)"
            ></InputTag>
          </td>
          <td>{{ formatDate(user.adddate) }}</td>
          <td>
            <button class="del-btn" @click="delUser(user)">
              <i class="ri-delete-bin-5-fill"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>{{ boxMsg }}</p>
    <!-- 自定义弹窗捕获 -->
    <AlertBox
      v-if="alertMsg"
      :message="alertMsg"
      @close="alertMsg = ''"
    ></AlertBox>
  </div>
</template>

<script>
import axios from "axios";
import InputTag from "../InputTag.vue";
import AlertBox from "../AlertBox.vue";

export default {
  name: "SelectUser",
  components: {
    InputTag,
    AlertBox,
  },

  data() {
    return {
      users: [],
      alertMsg: "",
      boxMsg: "正在加载用户数据...",
    };
  },

  methods: {
    async selectUsers() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/selectUser"
        );
        console.log(response);
        const users = response.data.users;
        this.users =
          users.map((user) => ({
            ...user,
            creditCount: user.credit_count,
          })) || [];

        if (this.users.length === 0) {
          this.boxMsg = "未找到任何用户记录";
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = "获取用户数据失败";
      }
    },

    // 日期格式化
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    async updateUser(user) {
      try {
        await axios.post(`http://localhost:3000/api/updateUser/${user.id}`, {
          state: user.state,
          credit_count: user.creditCount,
          username: user.username,
        });
        this.alertMsg = "更新用户数据成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "更新用户数据失败";
      }
    },

    async delUser(user) {
      try {
        await axios.post(`http://localhost:3000/api/delUser/${user.id}`, user);
        this.alertMsg = "删除用户成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除用户失败";
      }
      this.selectUsers();
    },
  },

  mounted() {
    this.selectUsers();
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border-top: 1px solid #ddd;
  border-bottom: 1px dashed #ddd;
  padding: 8px;
  text-align: left;
  align-content: center;
  text-align: center;
  justify-content: center;
  justify-items: center;
}

th {
  background-color: #f2f2f2;
}

img {
  height: 75px;
  width: auto;
}

button {
  cursor: pointer;
  width: 30px;
  height: 30px;
  border: 1px solid var(--first-color);
  border-radius: 5px;
  background-color: var(--white-color);
  color: var(--first-color);
  font-weight: var(--font-medium);
}

button:hover {
  background-color: var(--first-color);
  color: var(--white-color);
  transition: 0.4s;
}

select {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
}
</style>
