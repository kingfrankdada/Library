<template>
  <div class="admin-user">
    <!-- 搜索框 -->
    <div class="search-box">
      <input
        type="text"
        v-model="searchText"
        placeholder="搜索用户名，角色或注册信息"
      />
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <label @click="isAddModalVisible = true">
        <i class="ri-user-add-line"></i>
        添加用户
      </label>
      <!-- <label>
        <input
          type="checkbox"
          v-model="showRecentDays"
          @change="filterByRecentDays"
        />
        仅显示最近七天
      </label> -->
      <label>
        <input type="checkbox" v-model="enableSelection" />
        启用复选框
      </label>
      <!-- 全选 -->
      <label v-show="enableSelection">
        <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
        全选
      </label>
      <label v-show="enableSelection" @click="banSelectedUsers">
        <i class="ri-prohibited-line"></i>
        封禁
      </label>
      <label v-show="enableSelection" @click="unbanSelectedUsers">
        <i class="ri-checkbox-circle-line"></i>
        取消封禁
      </label>
      <label v-show="enableSelection" @click="deleteSelectedUsers">
        <i class="ri-delete-bin-5-fill"></i>
        删除选中
      </label>
    </div>

    <!-- 用户表格 -->
    <table v-if="paginatedUsers.length > 0">
      <thead>
        <tr>
          <th v-if="enableSelection">
            <input
              type="checkbox"
              v-model="selectPage"
              @change="toggleSelectPage"
            />
          </th>
          <th @click="sortUsers('id')">
            ID
            <span :class="getSortIcon('id')"></span>
          </th>
          <th @click="sortUsers('username')">
            用户*
            <span :class="getSortIcon('username')"></span>
          </th>
          <th v-if="userInfo.role == 0" @click="sortUsers('role')">
            权限组*
            <i
              class="ri-question-line"
              title="提示：该项会在重新登陆后生效"
            ></i>
            <span :class="getSortIcon('role')"></span>
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
        <tr v-for="(user, index) in paginatedUsers" :key="index">
          <td v-if="enableSelection" @click="toggleCheckbox(user.id)">
            <input type="checkbox" :value="user.id" v-model="selectedUsers" />
          </td>
          <td>{{ user.id }}</td>
          <td>
            <InputTag
              v-model="user.username"
              @input="updateUser(user)"
            ></InputTag>
          </td>
          <td v-if="userInfo.role == 0">
            <select v-model="user.role" @change="updateUser(user)">
              <option value="0">超级管理员</option>
              <option value="1">管理员</option>
              <option value="2">用户</option>
            </select>
          </td>
          <td>
            <InputTag v-model="user.email" @input="updateUser(user)"></InputTag>
          </td>
          <td>
            <select
              :style="{ color: user.state === 0 ? 'red' : 'green' }"
              v-model="user.state"
              @change="updateUser(user)"
            >
              <option style="color: green" value="1">正常</option>
              <option style="color: red" value="0">封禁</option>
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
            <button
              :disabled="userInfo.role != 0"
              class="del-btn"
              :title="userInfo.role != 0 ? '权限不足' : '删除'"
              @click="delUser(user)"
            >
              <i class="ri-delete-bin-5-fill"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else style="margin-left: 20px">{{ boxMsg }}</p>

    <!-- 用户添加模态框 -->
    <NormalModal
      v-if="isAddModalVisible"
      class="select-modal"
      @close="closeModal"
      size="large"
    >
      <div class="select-text">添加用户</div>
      <AddUser></AddUser>
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
import AddUser from "@/components/admin/AddUser.vue";
import NormalModal from "@/components/NormalModal.vue";
import { mapState } from "vuex";

export default {
  name: "AdminUser",

  components: {
    AddUser,
    AlertBox,
    MessageBox,
    InputTag,
    NormalModal,
  },

  data() {
    return {
      alertMsg: "",
      message: "",
      boxMsg: "暂无数据...",
      users: [],
      searchText: "",
      sortColumn: null,
      sortOrder: "asc",
      pageSize: 10, // 每页显示的条数
      currentPage: 1, // 当前页
      showRecentDays: false,
      enableSelection: false, // 是否启用复选框
      selectAll: false, // 全选
      selectPage: false, // 当页全选
      selectedUsers: [], // 选中
      isAddModalVisible: false,
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),

    // 筛选后的用户
    filteredUsers() {
      const filterList = this.searchText.toLowerCase();
      let users = [...this.users];

      // 启用最近七天筛选
      if (this.showRecentDays) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        users = users.filter((user) => new Date(user.adddate) >= sevenDaysAgo);
      }

      // 如果当前用户不是超级管理员，隐藏超级管理员
      if (this.userInfo.role != 0) {
        users = users.filter((user) => user.role != 0);
      }

      // 根据搜索框内容筛选
      return users
        .filter(
          (user) =>
            user.username.toLowerCase().includes(filterList) ||
            user.role.toLowerCase().includes(filterList) ||
            user.email.toLowerCase().includes(filterList)
        )
        .sort((a, b) => new Date(b.id) - new Date(a.id));
    },

    // 排序后的用户
    sortedUsers() {
      const users = [...this.filteredUsers];
      if (this.sortColumn) {
        users.sort((a, b) => {
          const aVal = a[this.sortColumn];
          const bVal = b[this.sortColumn];
          if (this.sortOrder === "asc") {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
          }
        });
      }
      return users;
    },

    // 当前页显示的用户
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.sortedUsers.slice(start, end);
    },

    // 总页数
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.pageSize);
    },
  },

  mounted() {
    this.selectUsers();
  },

  watch: {
    selectedUsers: {
      handler() {
        // 更新全页全选状态
        const allIds = this.filteredUsers.map((user) => user.id);
        this.selectAll = allIds.every((id) => this.selectedUsers.includes(id));

        // 更新当页全选状态
        const currentPageIds = this.paginatedUsers.map((user) => user.id);
        this.selectPage = currentPageIds.every((id) =>
          this.selectedUsers.includes(id)
        );
      },
      deep: true,
    },

    currentPage() {
      const currentPageIds = this.paginatedUsers.map((user) => user.id);
      this.selectPage = currentPageIds.every((id) =>
        this.selectedUsers.includes(id)
      );
    },

    searchText() {
      this.currentPage = 1;
      this.resetSelection();
    },
  },

  methods: {
    // 点击单元格切换复选框
    toggleCheckbox(userId) {
      if (this.selectedUsers.includes(userId)) {
        this.selectedUsers = this.selectedUsers.filter((id) => id !== userId);
      } else {
        this.selectedUsers.push(userId);
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

    // 筛选最近七天
    filterByRecentDays() {
      this.currentPage = 1;
      this.resetSelection();
    },

    // 全页全选
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedUsers = this.filteredUsers.map((user) => user.id);
      } else {
        this.selectedUsers = [];
      }
    },

    // 当页全选
    toggleSelectPage() {
      const currentPageIds = this.paginatedUsers.map((user) => user.id);
      if (this.selectPage) {
        this.selectedUsers = Array.from(
          new Set([...this.selectedUsers, ...currentPageIds])
        );
      } else {
        this.selectedUsers = this.selectedUsers.filter(
          (id) => !currentPageIds.includes(id)
        );
      }
    },

    // 还原复选框状态
    resetSelection() {
      this.selectedUsers = [];
      this.selectAll = false;
      this.selectPage = false;
    },

    // 关闭模态框
    closeModal() {
      this.isAddModalVisible = false;
      this.selectUsers();
      this.currentPage = 1;
    },

    async selectUsers() {
      try {
        const response = await api.get(endpoints.selectUser);
        // console.log(response);
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

    // 删除用户
    async delUser(user) {
      try {
        await api.post(endpoints.delUser(user.id), user);
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
        creditCount: null,
        adddate: adddate,
      };

      try {
        await api.post(endpoints.addLog, newLog);
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "添加日志失败";
      }

      this.selectUsers();
    },

    // 删除选中的用户
    async deleteSelectedUsers() {
      if (this.selectedUsers.length === 0) {
        this.alertMsg = "请选择要删除的用户";
        return;
      }

      if (this.userInfo.role != 0) {
        this.alertMsg = "权限不足";
        return;
      }

      // 构造日志信息
      const deletedUsernames = [];
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      try {
        // 删除选中的用户
        for (const userId of this.selectedUsers) {
          const user = this.users.find((u) => u.id === userId);
          if (user) {
            deletedUsernames.push(user.username);
            await api.post(endpoints.delUser(userId));
          }
        }

        // 添加批量删除日志
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "删除",
          info: `批量删除用户：${deletedUsernames.join(", ")}`,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        // 重置状态
        this.selectedUsers = [];
        this.selectUsers();
        this.resetSelection();
        this.currentPage = 1;
        this.message = "删除成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除失败";
      }
    },

    // 封禁选中用户
    async banSelectedUsers() {
      if (this.selectedUsers.length === 0) {
        this.alertMsg = "请选择要封禁的用户";
        return;
      }

      if (this.userInfo.role != 0) {
        this.alertMsg = "权限不足";
        return;
      }

      const bannedUsernames = [];
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      try {
        for (const userId of this.selectedUsers) {
          const user = this.users.find((u) => u.id === userId);
          if (user && user.state != 0) {
            bannedUsernames.push(user.username);
            await api.post(endpoints.updateUser(userId), {
              role: user.role,
              state: 0,
              credit_count: user.credit_count,
              username: user.username,
              email: user.email,
            });
          }
        }

        // 添加批量封禁日志
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "更新",
          info: `批量封禁用户：${bannedUsernames.join(", ")}`,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        // 重置状态
        this.selectedUsers = [];
        this.selectUsers();
        this.resetSelection();
        this.currentPage = 1;
        this.message = "封禁成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "封禁失败";
      }
    },

    // 取消封禁选中用户
    async unbanSelectedUsers() {
      if (this.selectedUsers.length === 0) {
        this.alertMsg = "请选择要取消封禁的用户";
        return;
      }

      if (this.userInfo.role != 0) {
        this.alertMsg = "权限不足";
        return;
      }

      const unbannedUsernames = [];
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      try {
        for (const userId of this.selectedUsers) {
          const user = this.users.find((u) => u.id === userId);
          if (user && user.state == 0) {
            unbannedUsernames.push(user.username);
            await api.post(endpoints.updateUser(userId), {
              role: user.role,
              state: 1,
              credit_count: user.credit_count,
              username: user.username,
              email: user.email,
            });
          }
        }

        // 添加批量取消封禁日志
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "更新",
          info: `批量取消封禁用户：${unbannedUsernames.join(", ")}`,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        // 重置状态
        this.selectedUsers = [];
        this.selectUsers();
        this.resetSelection();
        this.currentPage = 1;
        this.message = "取消封禁成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "取消封禁失败";
      }
    },
    async updateUser(user) {
      try {
        await api.post(endpoints.updateUser(user.id), {
          role: user.role,
          state: user.state,
          credit_count: user.creditCount,
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
          creditCount: user.creditCount,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        // 添加信誉分表更新信息
        const newCredit = {
          username: user.username,
          creditCount: user.creditCount,
          info: "管理员更新",
          adddate: adddate,
        };

        await api.post(endpoints.addCredit, newCredit);
        this.selectUsers();
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "更新用户数据失败";
      }
    },

    // 排序用户
    sortUsers(column) {
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
      this.selectUsers();
    },
  },
};
</script>

<style scoped>
.admin-user {
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

.user-type-icon {
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

.del-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
