<template>
  <div class="admin-menu">
    <!-- 搜索框 -->
    <div class="search-box">
      <input
        type="text"
        v-model="searchText"
        :placeholder="$t('adminMenu.searchPlaceholder')"
      />
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <label @click="isAddModalVisible = true">
        <i class="ri-menu-add-line"></i>
        {{ $t("adminMenu.addMenu") }}
      </label>
      <label>
        <input
          type="checkbox"
          v-model="showRecentDays"
          @change="filterByRecentDays"
        />
        {{ $t("adminMenu.showRecentDays") }}
      </label>
      <label>
        <input type="checkbox" v-model="enableSelection" />
        {{ $t("adminMenu.enableSelection") }}
      </label>
      <!-- 全选 -->
      <label v-show="enableSelection">
        <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
        {{ $t("adminMenu.selectAll") }}
      </label>
      <label v-show="enableSelection" @click="deleteSelectedMenus">
        <i class="ri-delete-bin-5-fill"></i>
        {{ $t("adminMenu.delete") }}
      </label>
    </div>

    <!-- 分类表格 -->
    <table v-if="paginatedMenus.length > 0">
      <thead>
        <tr>
          <th v-if="enableSelection">
            <input
              type="checkbox"
              v-model="selectPage"
              @change="toggleSelectPage"
            />
          </th>
          <th @click="sortMenus('id')">
            ID
            <span :class="getSortIcon('id')"></span>
          </th>
          <th @click="sortMenus('title')">
            {{ $t("adminMenu.title") }}*
            <span :class="getSortIcon('title')"></span>
          </th>
          <!-- <th>状态*</th> -->
          <th>{{ $t("adminMenu.delete") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(menu, index) in paginatedMenus" :key="index">
          <!-- 点击单元格触发复选框 -->
          <td v-if="enableSelection" @click="toggleCheckbox(menu.id)">
            <input type="checkbox" :value="menu.id" v-model="selectedMenus" />
          </td>
          <td>{{ menu.id }}</td>
          <td>
            <InputTag v-model="menu.title" @input="updateMenu(menu)"></InputTag>
          </td>
          <!-- <td>
            <select v-model="menu.state" @change="updateMenu(menu)">
              <option value="1">正常</option>
              <option value="0">关闭</option>
            </select>
          </td> -->
          <td>
            <button
              class="del-btn"
              :title="$t('adminMenu.delete')"
              @click="delMenu(menu)"
            >
              <i class="ri-delete-bin-5-fill"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else style="margin-left: 20px">{{ $t("adminMenu.noMenu") }}</p>

    <!-- 编辑分类模态框 -->
    <EditTag
      v-if="editMsg"
      class="select-modal"
      :editMsg="editMsg"
      :editId="editId"
      :editName="editName"
      @update="updateMenu"
      @close="editMsg = null"
    ></EditTag>

    <!-- 分类添加模态框 -->
    <NormalModal
      v-if="isAddModalVisible"
      class="select-modal"
      @close="closeModal"
      size="large"
    >
      <div class="select-text">{{ $t("adminMenu.addMenu") }}</div>
      <AddMenu></AddMenu>
    </NormalModal>

    <!-- 分页控制 -->
    <div class="pagination">
      <span>{{ $t("adminMenu.pageSize") }}</span>
      <select v-model="pageSize" @change="handlePageSizeChange">
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
      <button @click="firstPage">{{ $t("adminMenu.firstPage") }}</button>
      <button @click="prevPage" :disabled="currentPage === 1">
        {{ $t("adminMenu.prevPage") }}
      </button>
      <span>
        {{
          $t("adminMenu.pageInfo", { currentPage, totalPages: totalPages || 1 })
        }}
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        {{ $t("adminMenu.nextPage") }}
      </button>
      <button @click="lastPage">{{ $t("adminMenu.lastPage") }}</button>
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
import AddMenu from "@/components/admin/AddMenu.vue";
import EditTag from "@/components/EditTag.vue";
import NormalModal from "@/components/NormalModal.vue";
import { mapState } from "vuex";

export default {
  name: "AdminMenu",

  components: {
    AddMenu,
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
      editMsg: "", // 编辑分类传入数据
      editId: null, // 存储编辑的分类 ID
      editName: "",
      menus: [],
      searchText: "",
      sortColumn: null,
      sortOrder: "asc",
      pageSize: 10, // 每页显示的条数
      currentPage: 1, // 当前页
      showRecentDays: false,
      enableSelection: false, // 是否启用复选框
      selectAll: false, // 全选
      selectPage: false, // 当页全选
      selectedMenus: [], // 选中
      isAddModalVisible: false,
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),

    // 筛选后的分类
    filteredMenus() {
      const filterList = this.searchText.toLowerCase();
      let menus = [...this.menus];

      // 启用最近七天筛选
      if (this.showRecentDays) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        menus = menus.filter((menu) => new Date(menu.adddate) >= sevenDaysAgo);
      }

      // 根据搜索框内容筛选
      return menus
        .filter((menu) => menu.title.toLowerCase().includes(filterList))
        .sort((a, b) => new Date(b.id) - new Date(a.id));
    },

    // 排序后的分类
    sortedMenus() {
      const menus = [...this.filteredMenus];
      if (this.sortColumn) {
        menus.sort((a, b) => {
          const aVal = a[this.sortColumn];
          const bVal = b[this.sortColumn];
          if (this.sortOrder === "asc") {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
          }
        });
      }
      return menus;
    },

    // 当前页显示的分类
    paginatedMenus() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.sortedMenus.slice(start, end);
    },

    // 总页数
    totalPages() {
      return Math.ceil(this.filteredMenus.length / this.pageSize || 1);
    },
  },

  mounted() {
    this.selectMenus();
    this.$nextTick(() => {
      this.boxMsg = this.$t("adminMenu.defaultBoxMsg");
    });
  },

  watch: {
    selectedMenus: {
      handler() {
        // 更新全页全选状态
        const allIds = this.filteredMenus.map((menu) => menu.id);
        this.selectAll = allIds.every((id) => this.selectedMenus.includes(id));

        // 更新当页全选状态
        const currentPageIds = this.paginatedMenus.map((menu) => menu.id);
        this.selectPage = currentPageIds.every((id) =>
          this.selectedMenus.includes(id)
        );
      },
      deep: true,
    },

    currentPage() {
      const currentPageIds = this.paginatedMenus.map((menu) => menu.id);
      this.selectPage = currentPageIds.every((id) =>
        this.selectedMenus.includes(id)
      );
    },

    searchText() {
      this.currentPage = 1;
      this.resetSelection();
    },
  },

  methods: {
    // 点击单元格切换复选框
    toggleCheckbox(menuId) {
      if (this.selectedMenus.includes(menuId)) {
        this.selectedMenus = this.selectedMenus.filter((id) => id !== menuId);
      } else {
        this.selectedMenus.push(menuId);
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
    openEdit(menu) {
      this.editName = menu.title;
      this.editMsg = menu.info;
      this.editId = menu.id;
    },

    // 筛选最近七天
    filterByRecentDays() {
      this.currentPage = 1;
      this.resetSelection();
    },

    // 全页全选
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedMenus = this.filteredMenus.map((menu) => menu.id);
      } else {
        this.selectedMenus = [];
      }
    },

    // 当页全选
    toggleSelectPage() {
      const currentPageIds = this.paginatedMenus.map((menu) => menu.id);
      if (this.selectPage) {
        this.selectedMenus = Array.from(
          new Set([...this.selectedMenus, ...currentPageIds])
        );
      } else {
        this.selectedMenus = this.selectedMenus.filter(
          (id) => !currentPageIds.includes(id)
        );
      }
    },

    // 还原复选框状态
    resetSelection() {
      this.selectedMenus = [];
      this.selectAll = false;
      this.selectPage = false;
    },

    // 关闭模态框
    closeModal() {
      this.isAddModalVisible = false;
      this.selectMenus();
      this.currentPage = 1;
    },

    async selectMenus() {
      try {
        const response = await api.get(endpoints.selectMenu);
        this.menus = response.data.menus || [];
        if (this.menus.length === 0) {
          this.boxMsg = this.$t("adminMenu.selectMenus.empty");
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = this.$t("adminMenu.selectMenus.fail");
      }
    },

    // 删除分类
    async delMenu(menu) {
      try {
        await api.post(endpoints.delMenu(menu.id), menu);
        // this.alertMsg = "删除分类成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminMenu.delMenu.fail");
      }

      // 添加删除日志
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      const newLog = {
        username: this.userInfo.username,
        userIP: this.userInfo.userIP,
        type: "删除",
        info: `删除分类：${menu.title}`,
        adddate: adddate,
      };

      try {
        await api.post(endpoints.addLog, newLog);
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        // this.alertMsg = "添加日志失败";
      }

      this.selectMenus();
    },

    // 删除选中的分类
    async deleteSelectedMenus() {
      if (this.selectedMenus.length === 0) {
        this.alertMsg = this.$t("adminMenu.deleteSelectedMenus.empty");
        return;
      }

      // 构造日志信息
      const deletedTitles = [];
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      try {
        // 删除选中的分类
        for (const menuId of this.selectedMenus) {
          const menu = this.menus.find((n) => n.id === menuId);
          if (menu) {
            deletedTitles.push(menu.title);
            await api.post(endpoints.delMenu(menuId));
          }
        }

        // 添加批量删除日志
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "删除",
          info: `批量删除分类：${deletedTitles.join(", ")}`,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        // 重置状态
        this.selectedMenus = [];
        this.selectMenus();
        this.resetSelection();
        this.currentPage = 1;
        this.message = this.$t("adminMenu.deleteSelectedMenus.success");
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminMenu.deleteSelectedMenus.fail");
      }
    },

    async updateMenu(menu) {
      try {
        await api.post(endpoints.updateMenu(menu.id), {
          title: menu.title,
          info: menu.info,
          top: menu.top,
        });
        // 添加更新日志
        const adddate = new Date().toLocaleString("sv-SE", {
          timeZoneName: "short",
        });

        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "更新",
          info: `更新分类：${menu.title || menu.name}`,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);
        this.selectMenus();
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminMenu.updateMenu.fail");
      }
    },

    // 排序分类
    sortMenus(column) {
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
      this.selectMenus();
    },
  },
};
</script>

<style scoped>
.admin-menu {
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

.menu-type-icon {
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

.menu-info {
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
  background-color: var(--card-color);
  color: var(--text-color);
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
