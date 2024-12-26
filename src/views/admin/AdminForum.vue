<template>
  <div class="admin-message">
    <!-- 搜索框 -->
    <div class="search-box">
      <input
        type="text"
        v-model="searchText"
        placeholder="搜索留言名，发表用户或日期"
      />
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <label @click="isAddModalVisible = true">
        <i class="ri-chat-new-line"></i>
        添加留言
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
      <label v-show="enableSelection" @click="banSelectedMessages">
        <i class="ri-prohibited-line"></i>
        屏蔽
      </label>
      <label v-show="enableSelection" @click="unbanSelectedMessages">
        <i class="ri-checkbox-circle-line"></i>
        取消屏蔽
      </label>
      <label v-show="enableSelection" @click="deleteSelectedMessages">
        <i class="ri-delete-bin-5-fill"></i>
        删除选中
      </label>
    </div>

    <!-- 留言表格 -->
    <table v-if="paginatedMessages.length > 0">
      <thead>
        <tr>
          <th v-if="enableSelection">
            <input
              type="checkbox"
              v-model="selectPage"
              @change="toggleSelectPage"
            />
          </th>
          <th @click="sortMessages('id')">
            ID
            <span :class="getSortIcon('id')"></span>
          </th>
          <th @click="sortMessages('title')">
            论坛留言*
            <span :class="getSortIcon('title')"></span>
          </th>
          <th @click="sortMessages('info')">
            详情内容*
            <span :class="getSortIcon('info')"></span>
          </th>
          <th @click="sortMessages('adduser')">发表用户*</th>
          <th @click="sortMessages('views')">
            浏览数*
            <span :class="getSortIcon('views')"></span>
          </th>
          <th @click="sortMessages('likes')">
            点赞数*
            <span :class="getSortIcon('likes')"></span>
          </th>
          <th @click="sortMessages('state')">
            状态*
            <span :class="getSortIcon('state')"></span>
          </th>
          <th>删除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(message, index) in paginatedMessages" :key="index">
          <td v-if="enableSelection" @click="toggleCheckbox(message.id)">
            <input
              type="checkbox"
              :value="message.id"
              v-model="selectedMessages"
            />
          </td>
          <td>{{ message.id }}</td>
          <td>
            <InputTag
              v-model="message.title"
              @input="updateMessage(message)"
            ></InputTag>
          </td>
          <td
            class="message-info"
            title="双击可进入编辑模式"
            @dblclick="openEdit(message)"
          >
            {{ message.info }}
          </td>
          <td>
            <InputTag
              v-model="message.adduser"
              @input="updateMessage(message)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="message.views"
              @input="updateMessage(message)"
            ></InputTag>
          </td>
          <td>
            <InputTag
              v-model="message.likes"
              @input="updateMessage(message)"
            ></InputTag>
          </td>
          <td>
            <select
              :style="{ color: message.state === 1 ? 'green' : 'red' }"
              v-model="message.state"
              @change="updateMessage(message)"
            >
              <option style="color: green" value="1">正常</option>
              <option style="color: red" value="0">屏蔽</option>
            </select>
          </td>
          <td>
            <button class="del-btn" title="删除" @click="delMessage(message)">
              <i class="ri-delete-bin-5-fill"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else style="margin-left: 20px">{{ boxMsg }}</p>

    <!-- 编辑留言模态框 -->
    <EditTag
      v-if="editMsg"
      class="select-modal"
      :editMsg="editMsg"
      :editId="editId"
      :editName="editName"
      @update="updateMessage"
      @close="editMsg = null"
    ></EditTag>

    <!-- 留言添加模态框 -->
    <NormalModal
      v-if="isAddModalVisible"
      class="select-modal"
      @close="closeModal"
      size="large"
    >
      <div class="select-text">添加留言</div>
      <AddMessage></AddMessage>
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
import AddMessage from "@/components/admin/AddMessage.vue";
import EditTag from "@/components/EditTag.vue";
import NormalModal from "@/components/NormalModal.vue";
import { mapState } from "vuex";

export default {
  name: "AdminMessage",

  components: {
    AddMessage,
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
      editMsg: "", // 编辑留言传入数据
      editId: null, // 存储编辑的留言 ID
      editName: "",
      messages: [],
      searchText: "",
      sortColumn: null,
      sortOrder: "asc",
      pageSize: 10, // 每页显示的条数
      currentPage: 1, // 当前页
      showRecentDays: false,
      enableSelection: false, // 是否启用复选框
      selectAll: false, // 全选
      selectPage: false, // 当页全选
      selectedMessages: [], // 选中
      isAddModalVisible: false,
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),

    // 筛选后的留言
    filteredMessages() {
      const filterList = this.searchText.toLowerCase();
      let messages = [...this.messages];

      // 启用最近七天筛选
      if (this.showRecentDays) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        messages = messages.filter(
          (message) => new Date(message.adddate) >= sevenDaysAgo
        );
      }

      // 根据搜索框内容筛选
      return messages
        .filter(
          (message) =>
            message.title.toLowerCase().includes(filterList) ||
            message.info.toLowerCase().includes(filterList) ||
            message.adduser.toLowerCase().includes(filterList)
        )
        .sort((a, b) => new Date(b.id) - new Date(a.id));
    },

    // 排序后的留言
    sortedMessages() {
      const messages = [...this.filteredMessages];
      if (this.sortColumn) {
        messages.sort((a, b) => {
          const aVal = a[this.sortColumn];
          const bVal = b[this.sortColumn];
          if (this.sortOrder === "asc") {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
          }
        });
      }
      return messages;
    },

    // 当前页显示的留言
    paginatedMessages() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.sortedMessages.slice(start, end);
    },

    // 总页数
    totalPages() {
      return Math.ceil(this.filteredMessages.length / this.pageSize);
    },
  },

  mounted() {
    this.selectMessages();
  },

  watch: {
    selectedMessages: {
      handler() {
        // 更新全页全选状态
        const allIds = this.filteredMessages.map((message) => message.id);
        this.selectAll = allIds.every((id) =>
          this.selectedMessages.includes(id)
        );

        // 更新当页全选状态
        const currentPageIds = this.paginatedMessages.map(
          (message) => message.id
        );
        this.selectPage = currentPageIds.every((id) =>
          this.selectedMessages.includes(id)
        );
      },
      deep: true,
    },

    currentPage() {
      const currentPageIds = this.paginatedMessages.map(
        (message) => message.id
      );
      this.selectPage = currentPageIds.every((id) =>
        this.selectedMessages.includes(id)
      );
    },

    searchText() {
      this.currentPage = 1;
      this.resetSelection();
    },
  },

  methods: {
    // 点击单元格切换复选框
    toggleCheckbox(messageId) {
      if (this.selectedMessages.includes(messageId)) {
        this.selectedMessages = this.selectedMessages.filter(
          (id) => id !== messageId
        );
      } else {
        this.selectedMessages.push(messageId);
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
    openEdit(message) {
      this.editName = message.title;
      this.editMsg = message.info;
      this.editId = message.id;
    },

    // 筛选最近七天
    filterByRecentDays() {
      this.currentPage = 1;
      this.resetSelection();
    },

    // 全页全选
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedMessages = this.filteredMessages.map(
          (message) => message.id
        );
      } else {
        this.selectedMessages = [];
      }
    },

    // 当页全选
    toggleSelectPage() {
      const currentPageIds = this.paginatedMessages.map(
        (message) => message.id
      );
      if (this.selectPage) {
        this.selectedMessages = Array.from(
          new Set([...this.selectedMessages, ...currentPageIds])
        );
      } else {
        this.selectedMessages = this.selectedMessages.filter(
          (id) => !currentPageIds.includes(id)
        );
      }
    },

    // 还原复选框状态
    resetSelection() {
      this.selectedMessages = [];
      this.selectAll = false;
      this.selectPage = false;
    },

    // 关闭模态框
    closeModal() {
      this.selectMessages();
      this.isAddModalVisible = false;
      this.currentPage = 1;
    },

    async selectMessages() {
      try {
        const response = await api.get(endpoints.selectMessage);
        this.messages = response.data.message || [];
        if (this.messages.length === 0) {
          this.boxMsg = "未找到任何留言记录";
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = "获取留言数据失败";
      }
    },

    // 删除留言
    async delMessage(message) {
      try {
        await api.post(endpoints.delMessage(message.id), message);
        // this.alertMsg = "删除留言成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除留言失败";
      }

      // 添加删除日志
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      const newLog = {
        username: this.userInfo.username,
        userIP: this.userInfo.userIP,
        type: "删除",
        info: `删除留言：${message.title}`,
        adddate: adddate,
      };

      try {
        await api.post(endpoints.addLog, newLog);
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "添加日志失败";
      }

      this.selectMessages();
    },

    // 删除选中的留言
    async deleteSelectedMessages() {
      if (this.selectedMessages.length === 0) {
        this.alertMsg = "请选择要删除的留言";
        return;
      }

      // 构造日志信息
      const deletedTitles = [];
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      try {
        // 删除选中的留言
        for (const messageId of this.selectedMessages) {
          const message = this.messages.find((n) => n.id === messageId);
          if (message) {
            deletedTitles.push(message.title);
            await api.post(endpoints.delMessage(messageId));
          }
        }

        // 添加批量删除日志
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "删除",
          info: `批量删除留言：${deletedTitles.join(", ")}`,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        // 重置状态
        this.selectedMessages = [];
        this.selectMessages();
        this.resetSelection();
        this.currentPage = 1;
        this.message = "删除成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除失败";
      }
    },

    // 批量屏蔽选中公告
    async banSelectedMessages() {
      if (this.selectedMessages.length === 0) {
        this.alertMsg = "请选择要屏蔽的公告";
        return;
      }

      if (this.userInfo.role != 0) {
        this.alertMsg = "权限不足";
        return;
      }

      const bannedMessages = [];
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      try {
        for (const messageId of this.selectedMessages) {
          const message = this.messages.find((m) => m.id === messageId);
          if (message && message.state != 0) {
            bannedMessages.push(message.title);
            await api.post(endpoints.updateMessage(messageId), {
              ...message,
              state: 0,
            });
          }
        }

        // 添加批量屏蔽日志
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "更新",
          info: `批量屏蔽公告：${bannedMessages.join(", ")}`,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        // 重置状态
        this.selectedMessages = [];
        this.selectMessages();
        this.resetSelection();
        this.currentPage = 1;
        this.message = "屏蔽成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "屏蔽失败";
      }
    },

    // 批量取消屏蔽选中公告
    async unbanSelectedMessages() {
      if (this.selectedMessages.length === 0) {
        this.alertMsg = "请选择要取消屏蔽的公告";
        return;
      }

      const unbannedMessages = [];
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      try {
        for (const messageId of this.selectedMessages) {
          const message = this.messages.find((m) => m.id === messageId);
          if (message && message.state == 0) {
            unbannedMessages.push(message.title);
            await api.post(endpoints.updateMessage(messageId), {
              ...message,
              state: 1,
            });
          }
        }

        // 添加批量取消屏蔽日志
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "更新",
          info: `批量取消屏蔽公告：${unbannedMessages.join(", ")}`,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        // 重置状态
        this.selectedMessages = [];
        this.selectMessages();
        this.resetSelection();
        this.currentPage = 1;
        this.message = "取消屏蔽成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "取消屏蔽失败";
      }
    },

    async updateMessage(message) {
      try {
        await api.post(endpoints.updateMessage(message.id), {
          title: message.title,
          info: message.info,
          adduser: message.adduser,
          views: message.views,
          likes: message.likes,
          state: message.state,
        });

        // 添加更新日志
        const adddate = new Date().toLocaleString("sv-SE", {
          timeZoneName: "short",
        });

        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "更新",
          info: `更新留言：${message.title || message.name}`,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);
        this.selectMessages();
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "更新留言数据失败";
      }
    },

    // 排序留言
    sortMessages(column) {
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
      this.selectMessages();
    },
  },
};
</script>

<style scoped>
.admin-message {
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

.message-type-icon {
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

.message-info {
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
