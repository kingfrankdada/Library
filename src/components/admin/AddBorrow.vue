<template>
  <div class="add-borrow">
    <table>
      <thead>
        <tr>
          <th>{{ $t("addBorrow.title") }}</th>
          <th>{{ $t("addBorrow.input") }}</th>
        </tr>
      </thead>
      <tbody>
        <!-- 用户选择框 -->
        <tr>
          <td>{{ $t("addBorrow.username") }}*</td>
          <td>
            <select v-model="newBorrow.username">
              <option value="" disabled>
                {{ $t("addBorrow.usernamePlaceholder") }}
              </option>
              <option
                v-for="(user, index) in filteredUsers"
                :key="index"
                :value="user.username"
              >
                {{ user.username }}
              </option>
            </select>
          </td>
        </tr>

        <!-- 书籍选择框 -->
        <tr>
          <td>{{ $t("addBorrow.book") }}*</td>
          <td>
            <select v-model="newBorrow.bookname">
              <option value="" disabled>
                {{ $t("addBorrow.bookPlaceholder") }}
              </option>
              <option
                v-for="(book, index) in filteredBooks"
                :key="index"
                :value="book.name"
                :title="book.info"
              >
                {{ book.name }}
              </option>
            </select>
          </td>
        </tr>

        <!-- 借阅日期 -->
        <tr>
          <td>{{ $t("addBorrow.startdate") }}*</td>
          <td>
            {{ newBorrow.start_date }}
          </td>
        </tr>

        <!-- 归还日期 -->
        <tr>
          <td>{{ $t("addBorrow.overdate") }}*</td>
          <td>
            <input
              v-model="newBorrow.over_date"
              type="date"
              :min="today"
              @change="calculateDays"
            />
          </td>
        </tr>

        <!-- 借阅天数 -->
        <tr>
          <td>{{ $t("addBorrow.days") }}*</td>
          <td>
            <input
              v-model="newBorrow.days"
              type="number"
              :placeholder="$t('addBorrow.daysPlaceholder')"
              @change="updateOverDateFromDays"
              :min="1"
            />
          </td>
        </tr>

        <!-- 添加用户 -->
        <tr>
          <td>{{ $t("addBorrow.adduser") }}</td>
          <td>{{ userInfo.username }}</td>
        </tr>

        <!-- 添加日期 -->
        <tr>
          <td>{{ $t("addBorrow.adddate") }}</td>
          <td>{{ new Date().toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>

    <button @click="submitForm">{{ $t("addBorrow.submit") }}</button>

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
  name: "AddBorrow",
  components: {
    AlertBox,
    MessageBox,
  },
  computed: {
    ...mapState("UserInfo", ["userInfo"]),
    today() {
      return new Date().toISOString().split("T")[0]; // 获取今天的日期
    },
  },
  data() {
    return {
      newBorrow: {
        username: "",
        bookname: "",
        start_date: new Date().toISOString().split("T")[0],
        over_date: "",
        days: "",
        adddate: "",
      },
      books: [],
      users: [],
      filteredBooks: [],
      filteredUsers: [],
      alertMsg: "",
      message: "",
    };
  },
  mounted() {
    this.selectBooks();
    this.selectUsers();
  },
  methods: {
    // 获取图书，导入到图书列表
    async selectBooks() {
      try {
        const response = await api.get(endpoints.selectBook);
        this.books = response.data.books || [];
        if (this.books.length === 0) {
          this.alertMsg = this.$t("addBorrow.selectBooks.empty");
        }
        this.filteredBooks = [...this.books];
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("addBorrow.selectBooks.fail");
      }
    },

    // 获取用户，导入到用户列表
    async selectUsers() {
      try {
        const response = await api.get(endpoints.selectUser);
        this.users = response.data.users || [];
        this.filteredUsers = [...this.users];
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("addBorrow.selectUsers.fail");
      }
    },

    // 自动计算借阅天数
    calculateDays() {
      if (this.newBorrow.start_date && this.newBorrow.over_date) {
        const start = new Date(this.newBorrow.start_date);
        const end = new Date(this.newBorrow.over_date);
        const timeDiff = end - start;
        this.newBorrow.days = Math.max(
          1,
          Math.ceil(timeDiff / (1000 * 3600 * 24))
        );
      }
    },

    // 根据借阅天数自动计算归还日期
    updateOverDateFromDays() {
      if (this.newBorrow.days && this.newBorrow.start_date) {
        const start = new Date(this.newBorrow.start_date);
        const end = new Date(
          start.getTime() + (this.newBorrow.days - 1) * 24 * 60 * 60 * 1000
        );
        this.newBorrow.over_date = end.toISOString().split("T")[0];
      }
    },

    // 提交表单
    async submitForm() {
      this.newBorrow.adduser = this.userInfo.username;
      this.newBorrow.adddate = new Date().toISOString().split("T")[0];

      if (
        !this.newBorrow.username ||
        !this.newBorrow.bookname ||
        !this.newBorrow.start_date ||
        !this.newBorrow.over_date ||
        !this.newBorrow.days
      ) {
        this.alertMsg = this.$t("addBorrow.submitForm.empty");
        return;
      }

      try {
        await api.post(endpoints.borrow, {
          username: this.newBorrow.username,
          bookname: this.newBorrow.bookname,
          start_date: this.newBorrow.start_date,
          over_date: this.newBorrow.over_date,
          days: this.newBorrow.days,
        });

        // 添加借阅日志
        const adddate = new Date().toLocaleString("sv-SE", {
          timeZoneName: "short",
        });
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "借阅",
          info: `用户${this.newBorrow.username}于${adddate}借阅图书：${this.newBorrow.bookname}`,
          creditCount: null,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        this.message = this.$t("addBorrow.submitForm.success");
        this.resetForm(); // 提交后重置表单
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        console.error(errorMessage);

        if (error.response?.status === 400) {
          this.alertMsg = errorMessage; // 已借阅
        } else {
          this.alertMsg = this.$t("addBorrow.submitForm.fail");
        }
      }
    },

    // 重置表单
    resetForm() {
      this.newBorrow = {
        username: "",
        bookname: "",
        start_date: "",
        over_date: "",
        days: 0,
        adddate: "",
      };
      this.filteredBooks = [...this.books];
      this.filteredUsers = [...this.users];
    },
  },
};
</script>

<style scoped>
.add-borrow {
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
  height: 30px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  outline: none;
  box-sizing: border-box;
  overflow: auto;
  background-color: var(--card-color);
  color: var(--text-color);
}

input[type="date"],
select {
  height: 30px;
  padding: 5px;
  resize: none;
  outline: none;
  box-sizing: border-box;
  overflow: auto;
  background-color: var(--card-color);
  color: var(--text-color);
}

select {
  width: 100%;
  padding: 5px;
}

textarea[type="text"] {
  height: 100px;
  font-family: var(--body-font);
  font-size: 16px;
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
