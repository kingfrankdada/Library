<template>
  <div class="admin-borrow">
    <!-- 搜索框 -->
    <div class="search-box">
      <input
        type="text"
        v-model="searchText"
        placeholder="搜索借阅信息或用户"
      />
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <label @click="isAddModalVisible = true">
        <i class="ri-mail-add-line"></i>
        添加借阅信息
      </label>
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
      <label v-show="enableSelection" @click="deleteSelectedBorrows">
        <i class="ri-delete-bin-5-fill"></i>
        删除选中
      </label>
    </div>

    <!-- 借阅信息表格 -->
    <table v-if="paginatedBorrows.length > 0">
      <thead>
        <tr>
          <th v-if="enableSelection">
            <input
              type="checkbox"
              v-model="selectPage"
              @change="toggleSelectPage"
            />
          </th>
          <th @click="sortBorrows('id')">
            ID
            <span :class="getSortIcon('id')"></span>
          </th>
          <th @click="sortBorrows('username')">
            用户*
            <span :class="getSortIcon('username')"></span>
          </th>
          <th @click="sortBorrows('bookname')">
            图书*
            <span :class="getSortIcon('bookname')"></span>
          </th>
          <th @click="sortBorrows('start_date')">
            借阅日期*
            <span :class="getSortIcon('start_date')"></span>
          </th>
          <th @click="sortBorrows('over_date')">
            预计归还日期*
            <span :class="getSortIcon('over_date')"></span>
          </th>
          <th @click="sortBorrows('days')">
            预计借阅天数*
            <span :class="getSortIcon('days')"></span>
          </th>
          <th @click="sortBorrows('return_date')">
            实际归还日期*
            <span :class="getSortIcon('return_date')"></span>
          </th>
          <th @click="sortBorrows('record_days')">
            实际借阅天数*
            <span :class="getSortIcon('record_days')"></span>
          </th>
          <th @click="sortBorrows('overtime')">
            逾期天数*
            <span :class="getSortIcon('overtime')"></span>
          </th>
          <th @click="sortBorrows('state')">
            借阅状态*
            <span :class="getSortIcon('state')"></span>
          </th>
          <th @click="sortBorrows('credit_delta')">
            信誉分
            <span :class="getSortIcon('credit_delta')"></span>
          </th>
          <th @click="sortBorrows('adddate')">
            添加日期
            <span :class="getSortIcon('adddate')"></span>
          </th>
          <th>删除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(borrow, index) in paginatedBorrows" :key="index">
          <td v-if="enableSelection" @click="toggleCheckbox(borrow.id)">
            <input
              type="checkbox"
              :value="borrow.id"
              v-model="selectedBorrows"
            />
          </td>
          <td>{{ borrow.id }}</td>
          <td>
            <InputTag
              v-model="borrow.username"
              @input="updateBorrow(borrow)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="borrow.bookname"
              @input="updateBorrow(borrow)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="borrow.start_date"
              @input="updateBorrow(borrow)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="borrow.over_date"
              @input="updateBorrow(borrow)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="borrow.days"
              @input="updateBorrow(borrow)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="borrow.return_date"
              @input="updateBorrow(borrow)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="borrow.record_days"
              @input="updateBorrow(borrow)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="borrow.overtime"
              @input="updateBorrow(borrow)"
            ></InputTag>
          </td>
          <td>
            <select v-model="borrow.state" @change="updateBorrow(borrow)">
              <option value="2">已逾期</option>
              <option value="1">借阅中</option>
              <option value="0">已归还</option>
            </select>
          </td>
          <td>{{ borrow.credit_delta || "-" }}</td>
          <td>{{ borrow.adddate }}</td>
          <td>
            <button class="del-btn" title="删除" @click="delBorrow(borrow)">
              <i class="ri-delete-bin-5-fill"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else style="margin-left: 20px">{{ boxMsg }}</p>

    <!-- 编辑借阅信息模态框 -->
    <EditTag
      v-if="editMsg"
      class="select-modal"
      :editMsg="editMsg"
      :editId="editId"
      :editName="editName"
      @update="updateBorrow"
      @close="editMsg = null"
    ></EditTag>

    <!-- 借阅信息添加模态框 -->
    <NormalModal
      v-if="isAddModalVisible"
      class="select-modal"
      @close="closeModal"
      size="large"
    >
      <div class="select-text">添加借阅信息</div>
      <AddBorrow></AddBorrow>
    </NormalModal>

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
import InputTag from "@/components/InputTag.vue";
import AddBorrow from "@/components/admin/AddBorrow.vue";
import EditTag from "@/components/EditTag.vue";
import NormalModal from "@/components/NormalModal.vue";
import { mapState } from "vuex";

export default {
  name: "AdminBorrow",

  components: {
    AddBorrow,
    AlertBox,
    MessageBox,
    InputTag,
    EditTag,
    NormalModal,
  },

  data() {
    return {
      alertMsg: "",
      message: "",
      boxMsg: "暂无数据...",
      editMsg: "", // 编辑借阅信息传入数据
      editId: null, // 存储编辑的借阅信息 ID
      editName: "",
      borrows: [],
      searchText: "",
      sortColumn: null,
      sortOrder: "asc",
      pageSize: 10, // 每页显示的条数
      currentPage: 1, // 当前页
      showRecentDays: false,
      enableSelection: false, // 是否启用复选框
      selectAll: false, // 全选
      selectPage: false, // 当页全选
      selectedBorrows: [], // 选中
      isAddModalVisible: false,
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),

    // 筛选后的借阅信息
    filteredBorrows() {
      const filterList = this.searchText.toLowerCase();
      let borrows = [...this.borrows];

      // 启用最近七天筛选
      if (this.showRecentDays) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        borrows = borrows.filter(
          (borrow) => new Date(borrow.adddate) >= sevenDaysAgo
        );
      }

      // 根据搜索框内容筛选
      return borrows
        .filter(
          (borrow) =>
            borrow.username.toLowerCase().includes(filterList) ||
            borrow.bookname.toLowerCase().includes(filterList)
        )
        .sort((a, b) => new Date(b.id) - new Date(a.id));
    },

    // 排序后的借阅信息
    sortedBorrows() {
      const borrows = [...this.filteredBorrows];
      if (this.sortColumn) {
        borrows.sort((a, b) => {
          const aVal = a[this.sortColumn];
          const bVal = b[this.sortColumn];
          if (this.sortOrder === "asc") {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
          }
        });
      }
      return borrows;
    },

    // 当前页显示的借阅信息
    paginatedBorrows() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.sortedBorrows.slice(start, end);
    },

    // 总页数
    totalPages() {
      return Math.ceil(this.filteredBorrows.length / this.pageSize);
    },
  },

  mounted() {
    this.selectBorrows();
  },

  watch: {
    selectedBorrows: {
      handler() {
        // 更新全页全选状态
        const allIds = this.filteredBorrows.map((borrow) => borrow.id);
        this.selectAll = allIds.every((id) =>
          this.selectedBorrows.includes(id)
        );

        // 更新当页全选状态
        const currentPageIds = this.paginatedBorrows.map((borrow) => borrow.id);
        this.selectPage = currentPageIds.every((id) =>
          this.selectedBorrows.includes(id)
        );
      },
      deep: true,
    },

    currentPage() {
      const currentPageIds = this.paginatedBorrows.map((borrow) => borrow.id);
      this.selectPage = currentPageIds.every((id) =>
        this.selectedBorrows.includes(id)
      );
    },

    searchText() {
      this.currentPage = 1;
      this.resetSelection();
    },
  },

  methods: {
    // 点击单元格切换复选框
    toggleCheckbox(borrowId) {
      if (this.selectedBorrows.includes(borrowId)) {
        this.selectedBorrows = this.selectedBorrows.filter(
          (id) => id !== borrowId
        );
      } else {
        this.selectedBorrows.push(borrowId);
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

    // 打开编辑模态框
    openEdit(borrow) {
      this.editName = borrow.title;
      this.editMsg = borrow.info;
      this.editId = borrow.id;
    },

    // 筛选最近七天
    filterByRecentDays() {
      this.currentPage = 1;
      this.resetSelection();
    },

    // 全页全选
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedBorrows = this.filteredBorrows.map((borrow) => borrow.id);
      } else {
        this.selectedBorrows = [];
      }
    },

    // 当页全选
    toggleSelectPage() {
      const currentPageIds = this.paginatedBorrows.map((borrow) => borrow.id);
      if (this.selectPage) {
        this.selectedBorrows = Array.from(
          new Set([...this.selectedBorrows, ...currentPageIds])
        );
      } else {
        this.selectedBorrows = this.selectedBorrows.filter(
          (id) => !currentPageIds.includes(id)
        );
      }
    },

    // 还原复选框状态
    resetSelection() {
      this.selectedBorrows = [];
      this.selectAll = false;
      this.selectPage = false;
    },

    // 关闭模态框
    closeModal() {
      this.isAddModalVisible = false;
      this.selectBorrows();
      this.currentPage = 1;
    },

    async selectBorrows() {
      try {
        const response = await api.get(endpoints.selectBorrow);
        this.borrows = response.data.record || [];
        if (this.borrows.length === 0) {
          this.boxMsg = "未找到任何借阅记录";
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = "获取借阅数据失败";
      }
    },

    // 删除借阅信息
    async delBorrow(borrow) {
      try {
        await api.post(endpoints.delBorrow(borrow.id), borrow);
        // this.alertMsg = "删除借阅信息成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除借阅信息失败";
      }

      // 添加删除日志
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      const newLog = {
        username: this.userInfo.username,
        userIP: this.userInfo.userIP,
        type: "删除",
        info: `删除借阅信息：${borrow.title}`,
        adddate: adddate,
      };

      try {
        await api.post(endpoints.addLog, newLog);
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "添加日志失败";
      }

      this.selectBorrows();
    },

    // 删除选中的借阅信息
    async deleteSelectedBorrows() {
      if (this.selectedBorrows.length === 0) {
        this.alertMsg = "请选择要删除的借阅信息";
        return;
      }

      // 构造日志信息
      const deletedTitles = [];
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      try {
        // 删除选中的借阅信息
        for (const borrowId of this.selectedBorrows) {
          const borrow = this.borrows.find((n) => n.id === borrowId);
          if (borrow) {
            deletedTitles.push(borrow.title);
            await api.post(endpoints.delBorrow(borrowId));
          }
        }

        // 添加批量删除日志
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "删除",
          info: `批量删除借阅信息：${deletedTitles.join(", ")}`,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        // 重置状态
        this.selectedBorrows = [];
        this.selectBorrows();
        this.resetSelection();
        this.currentPage = 1;
        this.message = "删除成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除失败";
      }
    },

    async updateBorrow(borrow) {
      try {
        await api.post(endpoints.updateBorrow(borrow.id), borrow);
        // 添加更新日志
        const adddate = new Date().toLocaleString("sv-SE", {
          timeZoneName: "short",
        });

        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "更新",
          info: `更新借阅信息：${borrow.bookname || borrow.name}`,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);
        this.selectBorrows();
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "更新借阅信息数据失败";
      }
    },

    // 排序借阅信息
    sortBorrows(column) {
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
      this.selectBorrows();
    },
  },
};
</script>

<style scoped>
.admin-borrow {
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

.borrow-type-icon {
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

.select-modal {
  position: fixed;
  z-index: 9999;
  left: 7.5%;
}

.select-text {
  display: flex;
  align-items: center;
  left: 20px;
  width: 100%;
  height: 50px;
  font-size: 20px;
  font-weight: var(--font-semi-bold);
  color: var(--first-color);
  margin-top: 20px;
  margin-left: 20px;
}

.borrow-info {
  cursor: pointer;
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
