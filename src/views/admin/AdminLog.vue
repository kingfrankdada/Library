<template>
  <div class="admin-log">
    <!-- 搜索框 -->
    <div class="search-box">
      <input
        type="text"
        v-model="searchText"
        placeholder="搜索用户名，IP，事件类型，详情或日期"
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
        仅显示最近七天
      </label>
      <label>
        <input type="checkbox" v-model="enableSelection" />
        启用复选框
      </label>
      <!-- 全选 -->
      <label v-show="enableSelection">
        <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
        全选
      </label>
      <label v-show="enableSelection" @click="deleteSelectedLogs">
        <i class="ri-delete-bin-5-fill"></i>
        删除选中
      </label>
    </div>

    <!-- 日志表格 -->
    <table v-if="paginatedLogs.length > 0">
      <thead>
        <tr>
          <th v-if="enableSelection">
            <input
              type="checkbox"
              v-model="selectPage"
              @change="toggleSelectPage"
            />
          </th>
          <th @click="sortLogs('id')">
            ID
            <span :class="getSortIcon('id')"></span>
          </th>
          <th @click="sortLogs('username')">
            用户名
            <span :class="getSortIcon('username')"></span>
          </th>
          <th @click="sortLogs('user_ip')">
            IP
            <span :class="getSortIcon('user_ip')"></span>
          </th>
          <th @click="sortLogs('type')">
            事件类型
            <span :class="getSortIcon('type')"></span>
          </th>
          <th @click="sortLogs('info')">
            详情
            <span :class="getSortIcon('info')"></span>
          </th>
          <th @click="sortLogs('adddate')">
            日期
            <span :class="getSortIcon('adddate')"></span>
          </th>
          <th>删除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(log, index) in paginatedLogs" :key="index">
          <td v-if="enableSelection" @click="toggleCheckbox(log.id)">
            <input type="checkbox" :value="log.id" v-model="selectedLogs" />
          </td>
          <td :title="log.id">{{ log.id }}</td>
          <td :title="log.username">{{ log.username }}</td>
          <td :title="log.user_ip">{{ log.user_ip }}</td>
          <td :style="logIconColor(log)" :title="log.type">
            {{ log.type }}
            <span class="log-type-icon">
              <i :class="logIconType(log)"></i>
            </span>
          </td>
          <td :title="log.info">{{ log.info }}</td>
          <td :title="log.adddate">{{ log.adddate }}</td>
          <td>
            <button :title="'删除日志'" class="del-btn" @click="delLog(log)">
              <i class="ri-delete-bin-5-fill"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else style="margin-left: 20px">{{ boxMsg }}</p>

    <!-- 分页控制 -->
    <div class="pagination">
      <span>每页显示：</span>
      <select v-model="pageSize" @change="handlePageSizeChange">
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
      <button @click="firstPage">首页</button>
      <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
      <span>第 {{ currentPage }} 页 / 共 {{ totalPages || 1 }} 页</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        下一页
      </button>
      <button @click="lastPage">尾页</button>
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
  name: "AdminLog",
  components: {
    AlertBox,
    MessageBox,
  },
  data() {
    return {
      alertMsg: "",
      message: "",
      boxMsg: "暂无数据...",
      logs: [],
      searchText: "",
      sortColumn: null,
      sortOrder: "asc",
      pageSize: 10, // 每页显示的条数
      currentPage: 1, // 当前页
      showRecentDays: false,
      enableSelection: false, // 是否启用复选框
      selectAll: false, // 全选
      selectPage: false, // 当页全选
      selectedLogs: [], // 选中
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
    // 筛选后的日志
    filteredLogs() {
      const filterList = this.searchText.toLowerCase();
      let logs = [...this.logs];

      // 启用最近七天筛选
      if (this.showRecentDays) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        logs = logs.filter((log) => new Date(log.adddate) >= sevenDaysAgo);
      }

      // 根据搜索框内容筛选
      return logs
        .filter(
          (log) =>
            log.username.toLowerCase().includes(filterList) ||
            log.info.toLowerCase().includes(filterList) ||
            log.type.toLowerCase().includes(filterList) ||
            log.user_ip.toLowerCase().includes(filterList) ||
            log.adddate.toLowerCase().includes(filterList)
        )
        .sort((a, b) => new Date(b.id) - new Date(a.id));
    },

    // 排序后的日志
    sortedLogs() {
      const logs = [...this.filteredLogs];
      if (this.sortColumn) {
        logs.sort((a, b) => {
          const aVal = a[this.sortColumn];
          const bVal = b[this.sortColumn];
          if (this.sortOrder === "asc") {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
          }
        });
      }
      return logs;
    },

    // 当前页显示的日志
    paginatedLogs() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.sortedLogs.slice(start, end);
    },

    // 总页数
    totalPages() {
      return Math.ceil(this.filteredLogs.length / this.pageSize);
    },
  },

  mounted() {
    if (this.userInfo.role != 0) {
      this.$router.push("/admin");
    }
    this.selectLogs();
  },

  watch: {
    selectedLogs: {
      handler() {
        // 更新全页全选状态
        const allIds = this.filteredLogs.map((log) => log.id);
        this.selectAll = allIds.every((id) => this.selectedLogs.includes(id));

        // 更新当页全选状态
        const currentPageIds = this.paginatedLogs.map((log) => log.id);
        this.selectPage = currentPageIds.every((id) =>
          this.selectedLogs.includes(id)
        );
      },
      deep: true,
    },

    currentPage() {
      const currentPageIds = this.paginatedLogs.map((log) => log.id);
      this.selectPage = currentPageIds.every((id) =>
        this.selectedLogs.includes(id)
      );
    },

    searchText() {
      this.currentPage = 1;
      this.resetSelection();
    },
  },

  methods: {
    // 动态图标
    logIconType(log) {
      const type = log.type;
      switch (type) {
        case "登录":
          return "ri-login-box-line";
        case "登出":
          return "ri-logout-box-line";
        case "注册":
          return "ri-user-add-line";
        case "注销":
          return "ri-user-unfollow-line";
        case "更新":
          return "ri-refresh-line";
        case "新增":
          return "ri-add-circle-line";
        case "删除":
          return "ri-delete-bin-5-line";
        case "借阅":
          return "ri-book-open-line";
        case "归还":
          return "ri-book-line";
        default:
          return null;
      }
    },

    // 动态颜色，登录绿，登出红，注册蓝，注销橙，更新紫，删除红
    logIconColor(log) {
      const type = log.type;
      switch (type) {
        case "登录":
          return "color: green;";
        case "登出":
          return "color: orange;";
        case "注册":
          return "color: #00bfff;";
        case "注销":
          return "color: #ff0000;";
        case "更新":
          return "color: #ff00ff;";
        case "新增":
          return "color: limegreen;";
        case "删除":
          return "color: #ff0000;";
        case "借阅":
          return "color: #964B00;";
        case "归还":
          return "color: goldenrod;";
        default:
          return null;
      }
    },

    // 点击单元格切换复选框
    toggleCheckbox(logId) {
      if (this.selectedLogs.includes(logId)) {
        this.selectedLogs = this.selectedLogs.filter((id) => id !== logId);
      } else {
        this.selectedLogs.push(logId);
      }
    },

    filterByRecentDays() {
      this.currentPage = 1;
      this.resetSelection();
    },

    // 全页全选
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedLogs = this.filteredLogs.map((log) => log.id);
      } else {
        this.selectedLogs = [];
      }
    },

    // 当页全选
    toggleSelectPage() {
      const currentPageIds = this.paginatedLogs.map((log) => log.id);
      if (this.selectPage) {
        this.selectedLogs = Array.from(
          new Set([...this.selectedLogs, ...currentPageIds])
        );
      } else {
        this.selectedLogs = this.selectedLogs.filter(
          (id) => !currentPageIds.includes(id)
        );
      }
    },

    // 还原复选框状态
    resetSelection() {
      this.selectedLogs = [];
      this.selectAll = false;
      this.selectPage = false;
    },

    async selectLogs() {
      try {
        const response = await api.get(endpoints.selectLog);
        this.logs = response.data.log || [];
        if (this.logs.length === 0) {
          this.boxMsg = "未找到任何日志记录";
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = "获取日志数据失败";
      }
    },

    async delLog(log) {
      try {
        await api.post(endpoints.delLog(log.id));
        // this.alertMsg = "删除日志成功";
        this.selectLogs();
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除日志失败";
      }
    },

    // 删除选中的日志
    async deleteSelectedLogs() {
      if (this.selectedLogs.length === 0) {
        this.alertMsg = "请选择要删除的日志";
        return;
      }
      try {
        for (const logId of this.selectedLogs) {
          await api.post(endpoints.delLog(logId));
        }
        this.selectedLogs = [];
        this.selectLogs();
        this.resetSelection();
        this.currentPage = 1;
        this.message = "删除成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除失败";
      }
    },

    // 排序日志
    sortLogs(column) {
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

    // 首页
    firstPage() {
      this.currentPage = 1;
    },

    // 上一页
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    // 下一页
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    // 尾页
    lastPage() {
      this.currentPage = this.totalPages;
    },

    handlePageSizeChange() {
      this.currentPage = 1;
      this.resetSelection();
      this.selectLogs();
    },
  },
};
</script>

<style scoped>
.admin-log {
  height: 100%;
  width: 85%;
  background: var(--background-color);
  overflow-y: auto;
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
  border-radius: 6px;
  color: var(--text-color);
  background-color: #f9f9f9;
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
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eaeaea;
  max-width: 125px;
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
  background-color: #f9f9f9;
}

td:hover {
  background-color: #f1f1f1;
  transition: background-color 0.3s;
}

td:last-child:hover {
  background-color: #f9f9f9;
}

.log-type-icon {
  margin-left: 5px;
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
  width: 80px;
  align-items: center;
  justify-content: center;
  justify-items: center;
}

.pagination select {
  width: 100px;
  padding: 5px;
  border-radius: 4px;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
