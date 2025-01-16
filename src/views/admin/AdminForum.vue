<template>
  <div class="admin-message">
    <!-- 搜索框 -->
    <div class="search-box">
      <input
        type="text"
        v-model="searchText"
        :placeholder="$t('adminForum.searchPlaceholder')"
      />
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <label @click="isAddModalVisible = true">
        <i class="ri-chat-new-line"></i>
        {{ $t("adminForum.add") }}
      </label>
      <label>
        <input
          type="checkbox"
          v-model="showRecentDays"
          @change="filterByRecentDays"
        />
        {{ $t("adminForum.showRecentDays") }}
      </label>
      <label>
        <input type="checkbox" v-model="enableSelection" />
        {{ $t("adminForum.enableSelection") }}
      </label>
      <!-- 全选 -->
      <label v-show="enableSelection">
        <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
        {{ $t("adminForum.selectAll") }}
      </label>
      <label v-show="enableSelection" @click="banSelectedMessages">
        <i class="ri-prohibited-line"></i>
        {{ $t("adminForum.ban") }}
      </label>
      <label v-show="enableSelection" @click="unbanSelectedMessages">
        <i class="ri-checkbox-circle-line"></i>
        {{ $t("adminForum.unban") }}
      </label>
      <label v-show="enableSelection" @click="deleteSelectedMessages">
        <i class="ri-delete-bin-5-fill"></i>
        {{ $t("adminForum.delete") }}
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
            {{ $t("adminForum.title") }}*
            <span :class="getSortIcon('title')"></span>
          </th>
          <th @click="sortMessages('info')">
            {{ $t("adminForum.info") }}*
            <span :class="getSortIcon('info')"></span>
          </th>
          <th @click="sortMessages('adduser')">
            {{ $t("adminForum.adduser") }}*
          </th>
          <th @click="sortMessages('views')">
            {{ $t("adminForum.views") }}*
            <span :class="getSortIcon('views')"></span>
          </th>
          <th @click="sortMessages('likes')">
            {{ $t("adminForum.likes") }}*
            <span :class="getSortIcon('likes')"></span>
          </th>
          <th @click="sortMessages('state')">
            {{ $t("adminForum.state") }}*
            <span :class="getSortIcon('state')"></span>
          </th>
          <!-- adddate -->
          <th @click="sortMessages('adddate')">
            {{ $t("adminForum.adddate") }}
            <span :class="getSortIcon('adddate')"></span>
          </th>
          <th>{{ $t("adminForum.delete") }}</th>
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
            :title="$t('adminForum.infoTip')"
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
              <option style="color: green" value="1">
                {{ $t("adminForum.normal") }}
              </option>
              <option style="color: red" value="0">
                {{ $t("adminForum.banned") }}
              </option>
            </select>
          </td>
          <td>{{ message.adddate }}</td>
          <td>
            <button
              class="del-btn"
              :title="$t('adminForum.delete')"
              @click="delMessage(message)"
            >
              <i class="ri-delete-bin-5-fill"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else style="margin-left: 20px">{{ $t("adminForum.noMessage") }}</p>

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
      <span>{{ $t("adminForum.pageSize") }}</span>
      <select v-model="pageSize" @change="handlePageSizeChange">
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
      <button @click="firstPage">{{ $t("adminForum.firstPage") }}</button>
      <button @click="prevPage" :disabled="currentPage === 1">
        {{ $t("adminForum.prevPage") }}
      </button>
      <span>
        {{
          $t("adminForum.pageInfo", {
            currentPage,
            totalPages: totalPages || 1,
          })
        }}
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        {{ $t("adminForum.nextPage") }}
      </button>
      <button @click="lastPage">{{ $t("adminForum.lastPage") }}</button>
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
  name: "adminForum",

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
      boxMsg: "",
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
      return Math.ceil(this.filteredMessages.length / this.pageSize || 1);
    },
  },

  mounted() {
    this.selectMessages();
    this.$nextTick(() => {
      this.boxMsg = this.$t("adminForum.defaultBoxMsg");
    });
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
          this.boxMsg = this.$t("adminForum.selectMessages.empty");
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = this.$t("adminForum.selectMessages.fail");
      }
    },

    // 删除留言
    async delMessage(message) {
      try {
        await api.post(endpoints.delMessage(message.id), message);
        // this.alertMsg = "删除留言成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminForum.delMessage.fail");
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
        // this.alertMsg = "添加日志失败";
      }

      this.selectMessages();
    },

    // 删除选中的留言
    async deleteSelectedMessages() {
      if (this.selectedMessages.length === 0) {
        this.alertMsg = this.$t("adminForum.delMessage.empty");
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
        this.message = this.$t("adminForum.delMessage.success");
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminForum.delMessage.fail");
      }
    },

    // 批量屏蔽选中公告
    async banSelectedMessages() {
      if (this.selectedMessages.length === 0) {
        this.alertMsg = this.$t("adminForum.banMessage.empty");
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
        this.message = this.$t("adminForum.banMessage.success");
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminForum.banMessage.fail");
      }
    },

    // 批量取消屏蔽选中公告
    async unbanSelectedMessages() {
      if (this.selectedMessages.length === 0) {
        this.alertMsg = this.$t("adminForum.unbanSelectedMessages.empty");
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
        this.message = this.$t("adminForum.unbanSelectedMessages.success");
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminForum.unbanSelectedMessages.fail");
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
        this.alertMsg = this.$t("adminForum.updateMessage.fail");
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
  scrollbar-width: none; 
  -ms-overflow-style: none;
}

.admin-message::-webkit-scrollbar {
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

td:last-child:hover {
  background-color: var(--card-color);
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
  background-color: var(--card-color);
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
  width: auto;
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
