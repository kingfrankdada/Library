<template>
  <div class="select-user">
    <table v-if="filteredUsers.length > 0">
      <thead>
        <tr>
          <th @click="sortUsers('id')">
            ID
            <span :class="getSortIcon('id')"></span>
          </th>
          <th @click="sortUsers('username')">
            用户*
            <span :class="getSortIcon('username')"></span>
          </th>
          <th @click="sortUsers('email')">
            邮箱*
            <span :class="getSortIcon('email')"></span>
          </th>
          <th @click="sortUsers('state')">
            状态*
            <span :class="getSortIcon('state')"></span>
          </th>
          <th @click="sortUsers('creditCount')">
            信誉分*
            <span :class="getSortIcon('creditCount')"></span>
          </th>
          <th @click="sortUsers('adddate')">
            注册日期
            <span :class="getSortIcon('adddate')"></span>
          </th>
          <th>删除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in sortedUsers" :key="index">
          <td>{{ user.id }}</td>
          <td>
            <InputTag
              v-model="user.username"
              @input="updateUser(user)"
            ></InputTag>
          </td>
          <td>
            <InputTag v-model="user.email" @input="updateUser(user)"></InputTag>
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
            <button class="del-btn" title="删除" @click="delUser(user)">
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
      @close="alertMsg = null"
    ></AlertBox>
  </div>
</template>

<script>
import axios from "axios";
import InputTag from "../InputTag.vue";
import AlertBox from "../AlertBox.vue";
import { mapState } from "vuex";

export default {
  name: "SelectUser",
  components: {
    InputTag,
    AlertBox,
  },

  props: {
    searchText: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      users: [],
      alertMsg: "",
      boxMsg: "暂无数据...",
      sortColumn: "",
      sortOrder: "asc", // 默认为升序asc
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),

    filteredUsers() {
      const filterList = this.searchText.toLowerCase();
      return this.users.filter(
        (user) =>
          user.username.toLowerCase().includes(filterList) ||
          user.email.toLowerCase().includes(filterList)
      );
    },

    sortedUsers() {
      const notices = [...this.filteredUsers];
      if (this.sortColumn) {
        notices.sort((a, b) => {
          const aVal = a[this.sortColumn];
          const bVal = b[this.sortColumn];
          if (this.sortOrder === "asc") {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
          }
        });
      }
      return notices;
    },
  },

  methods: {
    async selectUsers() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/selectUser"
        );
        console.log(response);
        this.users =
          response.data.users.map((user) => ({
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
          email: user.email,
        });
        // this.alertMsg = "更新用户数据成功";

        // 添加更新日志
        const adddate = new Date().toLocaleString("sv-SE", {
          timeZoneName: "short",
        });

        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "更新",
          info: `更新用户：${user.username}`,
          creditCount: user.creditCount,
          adddate: adddate,
        };

        await axios.post("http://localhost:3000/api/addLog", newLog);

        // 添加信誉分表更新信息
        const newCredit = {
          username: user.username,
          creditCount: user.creditCount,
          info: "管理员更新",
          adddate: adddate,
        };

        await axios.post("http://localhost:3000/api/addCredit", newCredit);
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "更新用户数据失败";
      }
    },

    async delUser(user) {
      try {
        await axios.post(`http://localhost:3000/api/delUser/${user.id}`, user);
        // this.alertMsg = "删除用户成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除用户失败";
      }

      // 添加删除日志
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      const newLog = {
        username: this.userInfo.username,
        userIP: this.userInfo.userIP,
        type: "删除",
        info: `删除用户：${user.username}`,
        creditCount: 0,
        adddate: adddate,
      };

      await axios.post("http://localhost:3000/api/addLog", newLog);

      this.selectUsers();
    },

    sortUsers(column) {
      if (this.sortColumn === column) {
        this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      } else {
        this.sortColumn = column;
        this.sortOrder = "asc";
      }
    },

    getSortIcon(column) {
      if (this.sortColumn === column) {
        return this.sortOrder === "asc" ? "sort-asc-icon" : "sort-desc-icon";
      }
      return "sort-icon";
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
  cursor: pointer;
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

.sort-icon {
  margin-left: 5px;
}
.sort-asc-icon::after {
  content: "▲";
}
.sort-desc-icon::after {
  content: "▼";
}
</style>
