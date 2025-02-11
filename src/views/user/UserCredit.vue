<template>
  <div class="credit-credit">
    <!-- 搜索框 -->
    <div class="search-box">
      <input
        type="text"
        v-model="searchText"
        :placeholder="$t('userCredit.searchPlaceholder')"
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
        {{ $t("userCredit.showRecentDays") }}
      </label>
      <label @click="deleteAll">
        <i class="ri-delete-bin-5-fill"></i>
        {{ $t("userCredit.delete") }}
      </label>
    </div>

    <!-- 信誉分表格 -->
    <table v-if="paginatedCredits.length > 0">
      <thead>
        <tr>
          <th @click="sortCredits('adddate')">
            {{ $t("userCredit.date") }}
            <span :class="getSortIcon('adddate')"></span>
          </th>
          <th @click="sortCredits('credit_count')">
            {{ $t("userCredit.creditCount") }}
            <span :class="getSortIcon('credit_count')"></span>
          </th>
          <th @click="sortCredits('credit_count')">
            {{ $t("userCredit.info") }}
            <span :class="getSortIcon('credit_count')"></span>
          </th>
          <!-- <th>删除</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(credit, index) in paginatedCredits" :key="index">
          <td :title="formatDate(credit.adddate)">
            {{ formatDate(credit.adddate) }}
          </td>
          <td :style="creditIconColor(credit)" :title="credit.credit_count">
            {{ credit.credit_count }}
          </td>
          <td :title="credit.info">{{ credit.info }}</td>
          <!-- <td>
            <button :title="'删除信誉分'" class="del-btn" @click="delLog(credit)">
              <i class="ri-delete-bin-5-fill"></i>
            </button>
          </td> -->
        </tr>
      </tbody>
    </table>

    <p v-else style="text-align: center">{{ boxMsg }}</p>

    <!-- 分页控制 -->
    <div class="pagination">
      <span>{{ $t("userCredit.pageSize") }}</span>
      <select v-model="pageSize" @change="handlePageSizeChange">
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
      <button @click="firstPage">{{ $t("userCredit.firstPage") }}</button>
      <button @click="prevPage" :disabled="currentPage === 1">
        {{ $t("userCredit.prevPage") }}
      </button>
      <span
        >{{
          $t("userCredit.pageInfo", {
            currentPage,
            totalPages: totalPages || 1,
          })
        }}
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        {{ $t("userCredit.nextPage") }}
      </button>
      <button @click="lastPage">{{ $t("userCredit.lastPage") }}</button>
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
import AlertBox from "@/components/AlertBox.vue";
import MessageBox from "@/components/MessageBox.vue";
import { mapState } from "vuex";

export default {
  name: "UserCredit",
  components: {
    AlertBox,
    MessageBox,
  },
  data() {
    return {
      alertMsg: "",
      message: "",
      boxMsg: "",
      credits: [],
      searchText: "",
      sortColumn: null,
      sortOrder: "asc",
      pageSize: 10, // 每页显示的条数
      currentPage: 1, // 当前页
      showRecentDays: true,
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),

    // 筛选后的信誉分
    filteredCredits() {
      // 是否启用最近七天
      let credits = [...this.credits];
      if (this.showRecentDays) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        credits = credits.filter(
          (credit) => new Date(credit.adddate) >= sevenDaysAgo
        );
      }
      // 根据搜索框筛选数据
      const filterList = this.searchText.toLowerCase();
      return credits
        .filter(
          (credit) =>
            credit.info.toLowerCase().includes(filterList) ||
            credit.adddate.toLowerCase().includes(filterList)
        )
        .sort((a, b) => new Date(b.id) - new Date(a.id));
    },

    // 排序后的信誉分
    sortedCredits() {
      const credits = [...this.filteredCredits];
      if (this.sortColumn) {
        credits.sort((a, b) => {
          const aVal = a[this.sortColumn];
          const bVal = b[this.sortColumn];
          if (this.sortOrder === "asc") {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
          }
        });
      }
      return credits;
    },

    // 当前页显示的信誉分
    paginatedCredits() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.sortedCredits.slice(start, end);
    },

    // 总页数
    totalPages() {
      return Math.ceil(this.filteredCredits.length / this.pageSize || 1);
    },
  },

  mounted() {
    this.selectCredits();
    this.$nextTick(() => {
      this.boxMsg = this.$t("userCredit.defaultBoxMsg");
    });
  },

  watch: {
    searchText() {
      this.currentPage = 1;
    },
  },

  methods: {
    // 动态颜色，100-75为绿色，75-25为橙色，25以下为红色
    creditIconColor(credit) {
      const count = credit.credit_count;
      if (count >= 75) {
        return { color: "green" };
      } else if (count >= 25) {
        return { color: "orange" };
      } else if (count < 25) {
        return { color: "red" };
      } else {
        return { color: "gray" };
      }
    },

    filterByRecentDays() {
      this.currentPage = 1; // 切换筛选时重置到第一页
    },

    async selectCredits() {
      try {
        const response = await api.get(endpoints.selectCredit);
        this.credits = response.data.credit || [];
        // 过滤当前用户的信誉分
        this.credits = this.credits.filter(
          (credit) => credit.username === this.userInfo.username
        );
        if (this.credits.length === 0) {
          this.boxMsg = this.$t("userCredit.selectCredits.empty");
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = this.$t("userCredit.selectCredits.error");
      }
    },
    // 排序信誉分
    sortCredits(column) {
      if (this.sortColumn === column) {
        this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      } else {
        this.sortColumn = column;
        this.sortOrder = "asc";
      }
    },

    // 获取排序图标
    getSortIcon(column) {
      if (this.sortColumn === column) {
        return this.sortOrder === "asc" ? "sort-asc-icon" : "sort-desc-icon";
      }
      return "sort-icon";
    },

    async deleteAll() {
      if (this.credits.length > 0) {
        try {
          await api.post(endpoints.delCredit(this.userInfo.username));
        } catch (error) {
          console.error(error.response?.data?.error || error.message);
          this.alertMsg = this.$t("userCredit.deleteAll.error");
          return;
        }
        this.message = this.$t("userCredit.deleteAll.success");
        this.selectCredits();
      } else {
        this.alertMsg = this.$t("userCredit.deleteAll.empty");
      }
    },

    // 翻页：上一页
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    // 翻页：下一页
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    // 当用户更改每页显示的条数时，重置当前页为第一页
    handlePageSizeChange() {
      this.currentPage = 1;
      this.selectCredits();
    },

    // 日期格式化
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
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
.credit-credit {
  height: 100%;
  width: 85%;
  overflow-y: auto;
  background: var(--background-color);
  scrollbar-width: none; 
  -ms-overflow-style: none;
}

.credit-credit::-webkit-scrollbar {
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
  margin-right: 10px;
}

.toolbar label:last-child:hover {
  color: red;
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
