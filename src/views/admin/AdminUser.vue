<template>
  <div class="admin-user">
    <!-- 搜索框 -->
    <!-- <div class="search-box">
      <input
        type="text"
        v-model="searchText"
        :placeholder="$t('adminUser.searchPlaceholder')"
      />
    </div> -->
    <SearchForm
      :searchConfig="searchConfig"
      @search="search"
      @reSelect="reSelect"
    />

    <!-- 工具栏 -->
    <div class="toolbar">
      <label @click="isAddModalVisible = true">
        <i class="ri-user-add-line"></i>
        {{ $t("adminUser.add") }}
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
        {{ $t("adminUser.enableSelection") }}
      </label>
      <!-- 全选 -->
      <label v-show="enableSelection">
        <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
        {{ $t("adminUser.selectAll") }}
      </label>
      <label v-show="enableSelection" @click="banSelectedUsers">
        <i class="ri-prohibited-line"></i>
        {{ $t("adminUser.ban") }}
      </label>
      <label v-show="enableSelection" @click="unbanSelectedUsers">
        <i class="ri-checkbox-circle-line"></i>
        {{ $t("adminUser.unban") }}
      </label>
      <label v-show="enableSelection" @click="deleteSelectedUsers">
        <i class="ri-delete-bin-5-fill"></i>
        {{ $t("adminUser.delete") }}
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
            {{ $t("adminUser.username") }}*
            <span :class="getSortIcon('username')"></span>
          </th>
          <th v-if="userInfo.role == 0" @click="sortUsers('role')">
            {{ $t("adminUser.role") }}*
            <i class="ri-question-line" :title="$t('adminUser.roleTip')"></i>
            <span :class="getSortIcon('role')"></span>
          </th>
          <th @click="sortUsers('email')">
            {{ $t("adminUser.email") }}*
            <span :class="getSortIcon('email')"></span>
          </th>
          <th @click="sortUsers('state')">
            {{ $t("adminUser.state") }}*
            <span :class="getSortIcon('state')"></span>
          </th>
          <th @click="sortUsers('creditCount')">
            {{ $t("adminUser.credit") }}*
            <span :class="getSortIcon('creditCount')"></span>
          </th>
          <th @click="sortUsers('adddate')">
            {{ $t("adminUser.adddate") }}
            <span :class="getSortIcon('adddate')"></span>
          </th>
          <th>{{ $t("adminUser.delete") }}</th>
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
              <option value="0">{{ $t("adminUser.superAdmin") }}</option>
              <option value="1">{{ $t("adminUser.admin") }}</option>
              <option value="2">{{ $t("adminUser.user") }}</option>
            </select>
          </td>
          <td>
            <InputTag v-model="user.email" @input="updateUser(user)"></InputTag>
          </td>
          <td>
            <select
              :title="
                user.state === 0
                  ? $t('adminUser.banned')
                  : $t('adminUser.normal')
              "
              :style="{ color: user.state === 0 ? 'red' : 'green' }"
              v-model="user.state"
              @change="updateUser(user)"
            >
              <option style="color: green" value="1">
                {{ $t("adminUser.normal") }}
              </option>
              <option style="color: red" value="0">
                {{ $t("adminUser.banned") }}
              </option>
            </select>
          </td>
          <td>
            <InputTag
              v-model="user.creditCount"
              @input="updateUser(user)"
            ></InputTag>
          </td>
          <td :title="formatDate(user.adddate)">
            {{ formatDate(user.adddate) }}
          </td>
          <td>
            <button
              :disabled="
                userInfo.role != 0 || user.username === userInfo.username
              "
              class="del-btn"
              :title="
                userInfo.role != 0 || user.username === userInfo.username
                  ? $t('adminUser.denied')
                  : $t('adminUser.delete')
              "
              @click="delUser(user)"
            >
              <i class="ri-delete-bin-5-fill"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else style="margin-left: 20px">{{ $t("adminUser.noUser") }}</p>

    <!-- 用户添加模态框 -->
    <NormalModal
      v-if="isAddModalVisible"
      class="select-modal"
      @close="closeModal"
      size="large"
    >
      <div class="select-text">{{ $t("adminUser.add") }}</div>
      <AddUser></AddUser>
    </NormalModal>

    <!-- 分页控制 -->
    <div class="pagination">
      <span>{{ $t("adminUser.pageSize") }}</span>
      <select v-model="pageSize" @change="handlePageSizeChange">
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
      <button @click="firstPage">{{ $t("adminUser.firstPage") }}</button>
      <button @click="prevPage" :disabled="currentPage === 1">
        {{ $t("adminUser.prevPage") }}
      </button>
      <span>
        {{
          $t("adminUser.pageInfo", {
            currentPage,
            totalPages: totalPages || 1,
          })
        }}
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        {{ $t("adminUser.nextPage") }}
      </button>
      <button @click="lastPage">{{ $t("adminUser.lastPage") }}</button>
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
import { eventBus } from "@/utils/eventBus";
import SearchForm from "@/components/SearchForm.vue";
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
    SearchForm,
  },

  data() {
    return {
      alertMsg: "",
      message: "",
      boxMsg: "",
      users: [],
      // searchText: "",
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

      // 搜索配置
      activeSearch: false,
      searchConfig: [],
      searchForm: {},
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),

    // 筛选后的用户
    filteredUsers() {
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

      if (this.activeSearch) {
        users = users.filter((user) => {
          const usernameMatch = user.username
            .toLowerCase()
            .includes(this.searchForm.username.toLowerCase());

          const roleMatch = user.role
            .toLowerCase()
            .includes(this.searchForm.role.toLowerCase());

          const emailMatch = user.email
            .toLowerCase()
            .includes(this.searchForm.email.toLowerCase());

          const stateMatch =
            this.searchForm.state === "" || // 如果 state 为空，匹配所有
            user.state == this.searchForm.state;

          return usernameMatch && roleMatch && stateMatch && emailMatch;
        });
      }

      // 根据搜索框内容筛选
      return (
        users
          // .filter(
          //   (user) =>
          //     user.username.toLowerCase().includes(filterList) ||
          //     user.role.toLowerCase().includes(filterList) ||
          //     user.email.toLowerCase().includes(filterList)
          // )
          .sort((a, b) => new Date(b.id) - new Date(a.id))
      );
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
      return Math.ceil(this.filteredUsers.length / this.pageSize || 1);
    },
  },

  mounted() {
    eventBus.$on("language-changed", this.setConfig);

    this.selectUsers().then(() => {
      this.setConfig();
      this.boxMsg = this.$t("adminUser.defaultBoxMsg");
    });
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
    setConfig() {
      this.searchConfig = [
        {
          key: "username",
          label: this.$t("adminUser.username"),
          type: "input",
          placeholder: this.$t("adminUser.searchForm.username"),
        },
        {
          key: "role",
          label: this.$t("adminUser.role"),
          type: "select",
          options: [
            {
              value: "0",
              label: this.$t("adminUser.superAdmin"),
              color: "red",
            },
            {
              value: "1",
              label: this.$t("adminUser.admin"),
              color: "orange",
            },
            {
              value: "2",
              label: this.$t("adminUser.user"),
              color: "green",
            },
          ],
          placeholder: this.$t("adminUser.searchForm.role"),
        },
        {
          key: "email",
          label: this.$t("adminUser.email"),
          type: "input",
          placeholder: this.$t("adminUser.searchForm.email"),
        },
        {
          key: "state",
          label: this.$t("adminUser.state"),
          type: "select",
          options: [
            { value: "1", label: this.$t("adminUser.normal"), color: "green" },
            { value: "0", label: this.$t("adminUser.banned"), color: "red" },
          ],
          placeholder: this.$t("adminUser.searchForm.state"),
        },
      ];
    },

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
          this.boxMsg = this.$t("adminUser.selectUsers.empty");
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = this.$t("adminUser.selectUsers.fail");
      }
    },

    // 删除用户
    async delUser(user) {
      try {
        await api.post(endpoints.delUser(user.id), user);
        // this.alertMsg = "删除用户成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminUser.delUser.fail");
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
        // this.alertMsg = "添加日志失败";
      }

      this.selectUsers();
    },

    // 删除选中的用户
    async deleteSelectedUsers() {
      if (this.selectedUsers.length === 0) {
        this.alertMsg = this.$t("adminUser.deleteSelectedUsers.empty");
        return;
      }

      if (this.userInfo.role != 0) {
        this.alertMsg = this.$t("adminUser.deleteSelectedUsers.denied");
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
        this.message = this.$t("adminUser.deleteSelectedUsers.success");
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminUser.deleteSelectedUsers.fail");
      }
    },

    // 封禁选中用户
    async banSelectedUsers() {
      if (this.selectedUsers.length === 0) {
        this.alertMsg = this.$t("adminUser.banSelectedUsers.empty");
        return;
      }

      if (this.userInfo.role != 0) {
        this.alertMsg = this.$t("adminUser.banSelectedUsers.denied");
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
        this.message = this.$t("adminUser.banSelectedUsers.success");
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminUser.banSelectedUsers.fail");
      }
    },

    // 取消封禁选中用户
    async unbanSelectedUsers() {
      if (this.selectedUsers.length === 0) {
        this.alertMsg = this.$t("adminUser.unbanSelectedUsers.empty");
        return;
      }

      if (this.userInfo.role != 0) {
        this.alertMsg = this.$t("adminUser.unbanSelectedUsers.denied");
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
        this.message = this.$t("adminUser.unbanSelectedUsers.success");
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminUser.unbanSelectedUsers.fail");
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
        this.alertMsg = this.$t("adminUser.updateUser.fail");
      }
    },

    search(searchForm) {
      this.reSelect();
      this.searchForm = searchForm;
      this.activeSearch = true;
    },

    reSelect() {
      this.currentPage = 1;
      this.activeSearch = false;
      this.sortColumn = null;
      this.selectUsers();
      this.selectedUsers = [];
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

  beforeDestroy() {
    eventBus.$off("language-changed", this.setConfig);
  },
};
</script>

<style scoped>
.admin-user {
  height: 100%;
  width: 85%;
  background: var(--background-color);
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.admin-user::-webkit-scrollbar {
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
  border-radius: 6px;
  color: var(--text-color);
  background-color: var(--card-color);
  font-size: 16px;
}

.toolbar {
  display: flex;
  justify-content: left;
  align-items: center;
  margin: 0 0 10px 20px;
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

td:last-child:hover {
  background-color: var(--card-color);
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
  background-color: var(--card-color);
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
  background-color: var(--card-color);
  color: var(--text-color);
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
