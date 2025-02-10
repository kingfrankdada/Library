<template>
  <div class="user-borrow">
    <!-- 搜索框 -->
    <div class="search-box">
      <input
        type="text"
        v-model="searchText"
        :placeholder="$t('userBorrow.searchPlaceholder')"
      />
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <label>
        <input
          type="checkbox"
          v-model="showRecentDays"
          @change="filterByRecentDays"
        />
        {{ $t("userBorrow.showRecentDays") }}
      </label>
    </div>

    <!-- 借阅记录表格 -->
    <table v-if="paginatedBorrows.length > 0">
      <thead>
        <tr>
          <th @click="sortBorrows('start_date')">
            {{ $t("userBorrow.startDate") }}
            <span :class="getSortIcon('start_date')"></span>
          </th>
          <th @click="sortBorrows('over_date')">
            {{ $t("userBorrow.overDate") }}
            <span :class="getSortIcon('over_date')"></span>
          </th>
          <th @click="sortBorrows('days')">
            {{ $t("userBorrow.days") }}
            <span :class="getSortIcon('days')"></span>
          </th>
          <th @click="sortBorrows('bookname')">
            {{ $t("userBorrow.bookname") }}
            <span :class="getSortIcon('bookname')"></span>
          </th>
          <th @click="sortBorrows('return_date')">
            {{ $t("userBorrow.returnDate") }}
            <span :class="getSortIcon('return_date')"></span>
          </th>
          <th @click="sortBorrows('record_days')">
            {{ $t("userBorrow.recordDays") }}
            <span :class="getSortIcon('record_days')"></span>
          </th>
          <th @click="sortBorrows('credit_delta')">
            {{ $t("userBorrow.creditDelta") }}
            <span :class="getSortIcon('credit_delta')"></span>
          </th>
          <th @click="sortBorrows('state')">
            {{ $t("userBorrow.state") }}
            <span :class="getSortIcon('state')"></span>
          </th>
          <th>{{ $t("userBorrow.actions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in paginatedBorrows" :key="record.id">
          <td :title="record.start_date">{{ record.start_date }}</td>
          <td :title="record.over_date">{{ record.over_date }}</td>
          <td :title="record.days">{{ record.days || "-" }}</td>
          <td :title="record.bookname">{{ record.bookname }}</td>
          <td :title="record.return_date || $t('userBorrow.borrowing')">
            {{ record.return_date || $t("userBorrow.borrowing") }}
          </td>
          <td :title="record.record_days">{{ record.record_days || "--" }}</td>
          <td :style="record.credit_delta > 0 ? 'color: red' : 'color: green'">
            -{{ record.credit_delta || "-" }}
          </td>
          <td
            :style="
              record.state === 0
                ? 'color: green'
                : record.state === 1
                ? 'color: orange'
                : 'color: red'
            "
          >
            {{
              record.state === 0
                ? $t("userBorrow.returned")
                : record.state === 1
                ? $t("userBorrow.borrowing")
                : $t("userBorrow.overdue")
            }}
          </td>

          <td>
            <div v-if="!record.return_date" class="action-buttons">
              <button @click="handleReturn(record)">
                {{ $t("userBorrow.return") }}
              </button>
              <button
                @click="handleRenew(record)"
                v-if="record.is_renew === 0 && record.state === 1"
              >
                {{ $t("userBorrow.renew") }}
              </button>
            </div>
            <span v-else>{{ $t("userBorrow.returned") }}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else style="text-align: center">{{ boxMsg }}</p>

    <!-- 分页控制 -->
    <div class="pagination">
      <span>{{ $t("userBorrow.pageSize") }}</span>
      <select v-model="pageSize" @change="handlePageSizeChange">
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
      <button @click="firstPage">{{ $t("userBorrow.firstPage") }}</button>
      <button @click="prevPage" :disabled="currentPage === 1">
        {{ $t("userBorrow.prevPage") }}
      </button>
      <span>{{
        $t("userBorrow.pageInfo", { currentPage, totalPages: totalPages || 1 })
      }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        {{ $t("userBorrow.nextPage") }}
      </button>
      <button @click="lastPage">{{ $t("userBorrow.lastPage") }}</button>
    </div>
    <!-- 图书借阅模态框 -->
    <RenewBox
      v-if="selectedBorrowBook"
      :book="selectedBorrowBook"
      @reSelect="fetchBorrowBorrows"
      @success="renewSuccess"
      @close="selectedBorrowBook = null"
    ></RenewBox>

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
    <ReturnBox
      v-if="returnMsg"
      :returnMsg="returnMsg"
      :book="returnBook"
      @close="returnMsg = null"
    ></ReturnBox>
  </div>
</template>

<script>
import api from "@/api/api";
import { endpoints } from "@/api/endpoints";
import AlertBox from "@/components/AlertBox.vue";
import MessageBox from "@/components/MessageBox.vue";
import ReturnBox from "@/components/ReturnBox.vue";
import RenewBox from "@/components/RenewBox.vue";
import { mapState } from "vuex";
import { eventBus } from "@/utils/eventBus";

export default {
  name: "UserBorrow",
  components: {
    AlertBox,
    MessageBox,
    RenewBox,
    ReturnBox,
  },
  data() {
    return {
      records: [], // 用户的借阅记录
      users: [
        {
          id: 0,
          username: "",
          email: "",
          password: "",
          credit_count: 0,
          state: 0,
          adddate: "",
        },
      ],

      books: [], // 缓存续借图书
      selectedBorrowBook: null, // 续借的图书
      returnMsg: "",
      returnBook: null,

      searchText: "",
      alertMsg: "",
      message: "",
      boxMsg: "",
      sortColumn: null,
      sortOrder: "asc",
      pageSize: 10,
      currentPage: 1,
      showRecentDays: false,
    };
  },
  computed: {
    ...mapState("UserInfo", ["userInfo"]),

    // 仅显示最近七天记录的开关
    filteredBorrows() {
      const filter = this.searchText.toLowerCase();
      let records = [...this.records];

      // 如果启用了最近七天筛选
      if (this.showRecentDays) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        records = records.filter(
          (record) => new Date(record.start_date) >= sevenDaysAgo
        );
      }

      // 根据搜索框内容筛选
      return records
        .filter(
          (record) =>
            record.bookname.toLowerCase().includes(filter) ||
            record.start_date.includes(filter) ||
            record.over_date.includes(filter)
        )
        .sort((a, b) => new Date(b.id) - new Date(a.id));
    },

    sortedBorrows() {
      const sorted = [...this.filteredBorrows];
      if (this.sortColumn) {
        sorted.sort((a, b) => {
          const aVal = a[this.sortColumn];
          const bVal = b[this.sortColumn];
          if (this.sortOrder === "asc") {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
          }
        });
      }
      return sorted;
    },

    // 当前页的借阅记录
    paginatedBorrows() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.sortedBorrows.slice(start, end);
    },

    // 总页数
    totalPages() {
      return Math.ceil(this.filteredBorrows.length / this.pageSize || 1);
    },
  },

  mounted() {
    this.fetchBorrowBorrows();
    this.selectUsersByUserName();
    this.$nextTick(() => {
      this.boxMsg = this.$t("userBorrow.defaultBoxMsg");
    });
  },
  watch: {
    searchText() {
      this.currentPage = 1;
    },
  },
  methods: {
    filterByRecentDays() {
      this.currentPage = 1; // 切换筛选时重置到第一页
    },

    // 获取用户借阅记录
    async fetchBorrowBorrows() {
      try {
        const response = await api.get(
          endpoints.selectBorrowByUsername(this.userInfo.username)
        );
        this.records = response.data.record || [];
        if (this.records.length === 0) {
          this.boxMsg = this.$t("userBorrow.fetchBorrowBorrows.empty");
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = this.$t("userBorrow.fetchBorrowBorrows.error");
      }
    },

    // 查询当前用户信息
    async selectUsersByUserName() {
      try {
        const response = await api.get(
          endpoints.selectUserByUsername(this.userInfo.username)
        );
        const users = response.data.users;
        this.users =
          users.map((user) => ({
            ...user,
          })) || {};
        if (this.users.length === 0) {
          this.alertMsg = this.$t("userBorrow.selectUsersByUserName.empty");
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("userBorrow.selectUsersByUserName.error");
      }
    },

    sortBorrows(column) {
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

    // 归还图书
    async handleReturn(record) {
      if (!this.userInfo.usertoken) {
        this.alertMsg = this.$t("userBorrow.handleReturn.login");
        return;
      }
      try {
        await api.post(endpoints.return, {
          id: record.id,
          username: this.userInfo.username,
          bookname: record.bookname,
        });

        // 添加归还日志
        const adddate = new Date().toLocaleString("sv-SE", {
          timeZoneName: "short",
        });
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "归还",
          info: `用户${this.userInfo.username}于${adddate}归还图书${record.bookname}`,
          creditCount: null,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        this.returnBook = this.records.find((item) => item.id === record.id);
        this.returnMsg = this.$t("userBorrow.handleReturn.success");
        this.fetchBorrowBorrows();
        // 刷新eharts
        eventBus.$emit("borrow-returned");
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("userBorrow.handleReturn.fail");
      }
    },

    // 续借图书
    async handleRenew(record) {
      if (!this.userInfo.usertoken) {
        this.alertMsg = this.$t("userBorrow.handleRenew.login");
        return;
      }
      if (this.users[0].credit_count <= 50) {
        this.alertMsg = this.$t("userBorrow.handleRenew.credit");
        return;
      }

      // 使用selectBookByBookname先查找对应图书存入this.books中
      try {
        const response = await api.get(
          endpoints.selectBookByBookname(record.bookname)
        );
        this.books = response.data.books || [];
        this.selectedBorrowBook = this.books[0];
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("userBorrow.handleRenew.fail");
      }
    },

    renewSuccess(bookname) {
      this.fetchBorrowBorrows();
      this.message = this.$t("renewBox.handleRenew.success", { bookname });
    },

    // 翻页
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },

    // 更改每页条数时重置当前页
    handlePageSizeChange() {
      this.currentPage = 1;
    },

    // 首页
    firstPage() {
      this.currentPage = 1;
    },

    // 尾页
    lastPage() {
      this.currentPage = this.totalPages;
    },
  },
};
</script>

<style scoped>
.user-borrow {
  height: 100%;
  width: 85%;
  background: var(--background-color);
  overflow-y: auto;
  scrollbar-width: none; 
  -ms-overflow-style: none;
}

.user-borrow::-webkit-scrollbar {
  display: none;
}

.search-box {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.search-box input {
  width: 60%;
  padding: 12px;
  border: 1px solid #ddd;
  color: var(--text-color);
  border-radius: 6px;
  background-color: var(--card-color);
  font-size: 16px;
}

.toolbar {
  display: flex;
  justify-content: left;
  align-items: center;
  margin-left: 20px;
}

.toolbar label {
  font-size: 14px;
  color: var(--text-color);
  cursor: pointer;
}

table {
  margin-left: 20px;
  width: calc(100% - 40px);
  border-collapse: collapse;
  margin-top: 5px;
  margin-bottom: 50px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eaeaea;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

th {
  background-color: var(--first-color);
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  text-transform: uppercase;
}

td {
  font-size: 14px;
  background-color: var(--card-color);
}

td:hover {
  background-color: var(--background-color);
  transition: background-color 0.3s;
}

td:last-child:hover {
  background-color: var(--card-color);
}

button {
  cursor: pointer;
  width: 100%;
  height: 30px;
  border: 1px solid var(--first-color);
  border-radius: 5px;
  background-color: var(--card-color);
  color: var(--first-color);
  font-weight: var(--font-medium);
}

button:hover {
  background-color: var(--first-color);
  color: var(--card-color);
  transition: 0.4s;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-buttons button {
  flex: 1;
  cursor: pointer;
  height: 30px;
  width: 50%;
  border: 1px solid var(--first-color);
  border-radius: 5px;
  background-color: var(--card-color);
  color: var(--first-color);
  font-weight: var(--font-medium);
  text-align: center;
}

.action-buttons button:hover {
  background-color: var(--first-color);
  color: var(--card-color);
  transition: 0.4s;
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

.pagination {
  position: sticky;
  height: 12.5%;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 40px;
  gap: 20px;
  z-index: 1;
  background: var(--background-color);
}

.pagination span {
  margin-right: 10px;
  font-size: 14px;
}

.pagination button {
  padding: 5px 10px;
  width: auto;
  align-items: center;
  justify-content: center;
  justify-items: center;
}

.pagination select {
  width: 100px;
  padding: 5px;
  border-radius: 4px;
  background-color: var(--card-color);
  color: var(--text-color);
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
