<template>
  <div class="admin-book">
    <!-- 搜索框 -->

    <!-- <div class="search-box">
      <input
        type="text"
        v-model="searchText"
        :placeholder="$t('adminBook.searchPlaceholder')"
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
        <i class="ri-contacts-book-upload-line"></i>
        {{ $t("adminBook.addBook") }}
      </label>
      <label>
        <input
          type="checkbox"
          v-model="showRecentDays"
          @change="filterByRecentDays"
        />
        {{ $t("adminBook.showRecentDays") }}
      </label>
      <label>
        <input type="checkbox" v-model="enableSelection" />
        {{ $t("adminBook.enableSelection") }}
      </label>
      <!-- 全选 -->
      <label v-show="enableSelection">
        <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
        {{ $t("adminBook.selectAll") }}
      </label>
      <label v-show="enableSelection" @click="closeSelectedBooks">
        <i class="ri-prohibited-line"></i>
        {{ $t("adminBook.closeSelected") }}
      </label>
      <label v-show="enableSelection" @click="openSelectedBooks">
        <i class="ri-checkbox-circle-line"></i>
        {{ $t("adminBook.openSelected") }}
      </label>
      <label v-show="enableSelection" @click="deleteSelectedBooks">
        <i class="ri-delete-bin-5-fill"></i>
        {{ $t("adminBook.delete") }}
      </label>
    </div>

    <!-- 图书表格 -->
    <table v-if="paginatedBooks.length > 0">
      <thead>
        <tr>
          <th v-if="enableSelection">
            <input
              type="checkbox"
              v-model="selectPage"
              @change="toggleSelectPage"
            />
          </th>
          <th @click="sortBooks('id')">
            ID
            <span :class="getSortIcon('id')"></span>
          </th>
          <th @click="sortBooks('name')">
            {{ $t("adminBook.name") }}*
            <span :class="getSortIcon('name')"></span>
          </th>
          <th @click="sortBooks('author')">
            {{ $t("adminBook.author") }}*
            <span :class="getSortIcon('author')"></span>
          </th>
          <th @click="sortBooks('menu')">
            {{ $t("adminBook.menu") }}*
            <span :class="getSortIcon('menu')"></span>
          </th>
          <th @click="sortBooks('price')">
            {{ $t("adminBook.price") }}*
            <span :class="getSortIcon('price')"></span>
          </th>
          <th @click="sortBooks('press')">
            {{ $t("adminBook.press") }}*
            <span :class="getSortIcon('press')"></span>
          </th>
          <th @click="sortBooks('num')">
            {{ $t("adminBook.num") }}*
            <span :class="getSortIcon('num')"></span>
          </th>
          <th>{{ $t("adminBook.cover") }}</th>
          <th>{{ $t("adminBook.info") }}*</th>
          <th @click="sortBooks('state')">
            {{ $t("adminBook.state") }}*
            <span :class="getSortIcon('state')"></span>
          </th>
          <th @click="sortBooks('score')">
            {{ $t("adminBook.score") }}*
            <span :class="getSortIcon('score')"></span>
          </th>
          <th @click="sortBooks('adddate')">
            {{ $t("adminBook.adddate") }}
            <span :class="getSortIcon('adddate')"></span>
          </th>
          <th>{{ $t("adminBook.delete") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(book, index) in paginatedBooks" :key="index">
          <!-- 点击单元格触发复选框 -->
          <td v-if="enableSelection" @click="toggleCheckbox(book.id)">
            <input type="checkbox" :value="book.id" v-model="selectedBooks" />
          </td>
          <td>{{ book.id }}</td>
          <td>
            <InputTag v-model="book.name" @input="updateBook(book)"></InputTag>
          </td>
          <td>
            <InputTag
              v-model="book.author"
              @input="updateBook(book)"
            ></InputTag>
          </td>
          <td>
            <select
              :title="book.menu"
              v-model="book.menu"
              @change="updateBook(book)"
            >
              <option v-for="title in menuTitles" :key="title" :value="title">
                {{ title }}
              </option>
            </select>
          </td>
          <td>
            <InputTag v-model="book.price" @input="updateBook(book)"></InputTag>
          </td>
          <td>
            <InputTag v-model="book.press" @input="updateBook(book)"></InputTag>
          </td>
          <td>
            <InputTag v-model="book.num" @input="updateBook(book)"></InputTag>
          </td>
          <td>
            <img
              v-lazy="
                book.img
                  ? `/assets/img/${book.img}`
                  : '/assets/img/image-add-fill.png'
              "
              :alt="$t('adminBook.imgAlt')"
            />
          </td>
          <td
            class="book-info"
            :title="$t('adminBook.editTitle')"
            @dblclick="openEdit(book)"
          >
            {{ book.info }}
          </td>
          <td>
            <select
              :title="
                book.state === 1 ? $t('adminBook.open') : $t('adminBook.close')
              "
              :style="{ color: book.state === 1 ? 'green' : 'red' }"
              v-model="book.state"
              @change="updateBook(book)"
            >
              <option style="color: green" value="1">
                {{ $t("adminBook.open") }}
              </option>
              <option style="color: red" value="0">
                {{ $t("adminBook.close") }}
              </option>
            </select>
          </td>
          <td>
            <InputTag v-model="book.score" @input="updateBook(book)"></InputTag>
          </td>
          <td :title="book.adddate">{{ book.adddate }}</td>
          <td>
            <button
              class="del-btn"
              :title="$t('adminBook.delete')"
              @click="delBook(book)"
            >
              <i class="ri-delete-bin-5-fill"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else style="margin-left: 20px">{{ $t("adminBook.noBook") }}</p>

    <!-- 编辑图书模态框 -->
    <EditTag
      v-if="editMsg"
      class="select-modal"
      :editMsg="editMsg"
      :editId="editId"
      :editName="editName"
      @update="updateBook"
      @close="editMsg = null"
    ></EditTag>

    <!-- 图书添加模态框 -->
    <NormalModal
      v-if="isAddModalVisible"
      class="select-modal"
      @close="closeModal"
      size="large"
    >
      <div class="select-text">{{ $t("adminBook.addBook") }}</div>
      <AddBook></AddBook>
    </NormalModal>

    <!-- 分页控制 -->
    <div class="pagination">
      <span>{{ $t("adminBook.pageSize") }}</span>
      <select v-model="pageSize" @change="handlePageSizeChange">
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
      <button @click="firstPage">{{ $t("adminBook.firstPage") }}</button>
      <button @click="prevPage" :disabled="currentPage === 1">
        {{ $t("adminBook.prevPage") }}
      </button>
      <span>
        {{
          $t("adminBook.pageInfo", { currentPage, totalPages: totalPages || 1 })
        }}
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        {{ $t("adminBook.nextPage") }}
      </button>
      <button @click="lastPage">{{ $t("adminBook.lastPage") }}</button>
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
import AddBook from "@/components/admin/AddBook.vue";
import EditTag from "@/components/EditTag.vue";
import NormalModal from "@/components/NormalModal.vue";
import { mapState } from "vuex";

export default {
  name: "AdminBook",

  components: {
    AddBook,
    AlertBox,
    MessageBox,
    InputTag,
    EditTag,
    NormalModal,
    SearchForm,
  },

  data() {
    return {
      alertMsg: "",
      message: "",
      boxMsg: "",
      editMsg: "", // 编辑图书传入数据
      editId: null, // 存储编辑的图书 ID
      editName: "",
      books: [],
      menuTitles: [],
      // searchText: "",
      sortColumn: null,
      sortOrder: "asc",
      pageSize: 10, // 每页显示的条数
      currentPage: 1, // 当前页
      showRecentDays: false,
      enableSelection: false, // 是否启用复选框
      selectAll: false, // 全选
      selectPage: false, // 当页全选
      selectedBooks: [], // 选中
      isAddModalVisible: false,

      // 搜索配置
      activeSearch: false,
      searchConfig: [],
      searchForm: {},
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),

    // 筛选后的图书
    filteredBooks() {
      let books = [...this.books];

      // 启用最近七天筛选
      if (this.showRecentDays) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        books = books.filter((book) => new Date(book.adddate) >= sevenDaysAgo);
      }

      if (this.activeSearch) {
        books = books.filter((book) => {
          const nameMatch = book.name
            .toLowerCase()
            .includes(this.searchForm.name.toLowerCase());

          const authorMatch = book.author
            .toLowerCase()
            .includes(this.searchForm.author.toLowerCase());

          const pressMatch = book.press
            .toLowerCase()
            .includes(this.searchForm.press.toLowerCase());

          const menuMatch = book.menu
            .toLowerCase()
            .includes(this.searchForm.menu.toLowerCase());

          const stateMatch =
            this.searchForm.state === "" || // 如果 state 为空，匹配所有
            book.state == this.searchForm.state;

          return (
            nameMatch && authorMatch && stateMatch && pressMatch && menuMatch
          );
        });
      }

      // 根据搜索框内容筛选
      return (
        books
          // .filter(
          //   (book) =>
          //     book.name.toLowerCase().includes(filterList) ||
          //     book.author.toLowerCase().includes(filterList) ||
          //     book.press.toLowerCase().includes(filterList) ||
          //     book.menu.toLowerCase().includes(filterList) ||
          //     book.state == (this.searchForm.state || (1 && 0))
          // )
          .sort((a, b) => new Date(b.id) - new Date(a.id))
      );
    },

    // 排序后的图书
    sortedBooks() {
      const books = [...this.filteredBooks];
      if (this.sortColumn) {
        books.sort((a, b) => {
          const aVal = a[this.sortColumn];
          const bVal = b[this.sortColumn];
          if (this.sortOrder === "asc") {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
          }
        });
      }
      return books;
    },

    // 当前页显示的图书
    paginatedBooks() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.sortedBooks.slice(start, end);
    },

    // 总页数
    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.pageSize || 1);
    },
  },

  mounted() {
    eventBus.$on("language-changed", this.setConfig);

    this.selectBooks();
    this.selectMenuTitles().then(() => {
      this.setConfig();
      this.boxMsg = this.$t("adminBook.defaultBoxMsg");
    });
  },

  watch: {
    selectedBooks: {
      handler() {
        // 更新全页全选状态
        const allIds = this.filteredBooks.map((book) => book.id);
        this.selectAll = allIds.every((id) => this.selectedBooks.includes(id));

        // 更新当页全选状态
        const currentPageIds = this.paginatedBooks.map((book) => book.id);
        this.selectPage = currentPageIds.every((id) =>
          this.selectedBooks.includes(id)
        );
      },
      deep: true,
    },

    currentPage() {
      const currentPageIds = this.paginatedBooks.map((book) => book.id);
      this.selectPage = currentPageIds.every((id) =>
        this.selectedBooks.includes(id)
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
          key: "name",
          label: this.$t("adminBook.name"),
          type: "input",
          placeholder: this.$t("adminBook.searchForm.name"),
        },
        {
          key: "author",
          label: this.$t("adminBook.author"),
          type: "input",
          placeholder: this.$t("adminBook.searchForm.author"),
        },
        {
          key: "press",
          label: this.$t("adminBook.press"),
          type: "input",
          placeholder: this.$t("adminBook.searchForm.press"),
        },
        {
          key: "menu",
          label: this.$t("adminBook.menu"),
          type: "select",
          options: [
            ...this.menuTitles.map((title) => ({
              value: title,
              label: title,
            })),
          ],
          placeholder: this.$t("adminBook.searchForm.menu"),
        },
        {
          key: "state",
          label: this.$t("adminBook.state"),
          type: "select",
          options: [
            { value: "1", label: this.$t("adminBook.open"), color: "green" },
            { value: "0", label: this.$t("adminBook.close"), color: "red" },
          ],
          placeholder: this.$t("adminBook.searchForm.state"),
        },
      ];
    },

    // 点击单元格切换复选框
    toggleCheckbox(bookId) {
      if (this.selectedBooks.includes(bookId)) {
        this.selectedBooks = this.selectedBooks.filter((id) => id !== bookId);
      } else {
        this.selectedBooks.push(bookId);
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
    openEdit(book) {
      this.editName = book.name;
      this.editMsg = book.info;
      this.editId = book.id;
    },

    // 筛选最近七天
    filterByRecentDays() {
      this.currentPage = 1;
      this.resetSelection();
    },

    // 全页全选
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedBooks = this.filteredBooks.map((book) => book.id);
      } else {
        this.selectedBooks = [];
      }
    },

    // 当页全选
    toggleSelectPage() {
      const currentPageIds = this.paginatedBooks.map((book) => book.id);
      if (this.selectPage) {
        this.selectedBooks = Array.from(
          new Set([...this.selectedBooks, ...currentPageIds])
        );
      } else {
        this.selectedBooks = this.selectedBooks.filter(
          (id) => !currentPageIds.includes(id)
        );
      }
    },

    // 还原复选框状态
    resetSelection() {
      this.selectedBooks = [];
      this.selectAll = false;
      this.selectPage = false;
    },

    // 关闭模态框
    closeModal() {
      this.isAddModalVisible = false;
      this.selectBooks();
      this.currentPage = 1;
    },

    async selectMenuTitles() {
      try {
        const response = await api.get(endpoints.menuTitles);
        this.menuTitles = response.data.titles;
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = this.$t("adminBook.selectMenuTitles.error");
      }
    },

    async selectBooks() {
      try {
        const response = await api.get(endpoints.selectBook);
        this.books = response.data.books || [];
        if (this.books.length === 0) {
          this.boxMsg = this.$t("adminBook.selectBooks.empty");
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = this.$t("adminBook.selectBooks.error");
      }
    },

    // 删除图书
    async delBook(book) {
      try {
        await api.post(endpoints.delBook(book.id), book);
        // this.alertMsg = "删除图书成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminBook.delBook.error");
      }

      // 添加删除日志
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      const newLog = {
        username: this.userInfo.username,
        userIP: this.userInfo.userIP,
        type: "删除",
        info: `删除图书：${book.name}`,
        adddate: adddate,
      };

      try {
        await api.post(endpoints.addLog, newLog);
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
      }

      this.selectBooks();
    },

    // 删除选中的图书
    async deleteSelectedBooks() {
      if (this.selectedBooks.length === 0) {
        this.alertMsg = this.$t("adminBook.deleteSelectedBooks.empty");
        return;
      }

      // 构造日志信息
      const deletedTitles = [];
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      try {
        // 删除选中的图书
        for (const bookId of this.selectedBooks) {
          const book = this.books.find((n) => n.id === bookId);
          if (book) {
            deletedTitles.push(book.name);
            await api.post(endpoints.delBook(bookId), book);
          }
        }

        // 添加批量删除日志
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "删除",
          info: `批量删除图书：${deletedTitles.join(", ")}`,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        // 重置状态
        this.selectedBooks = [];
        this.selectBooks();
        this.resetSelection();
        this.currentPage = 1;
        this.message = this.$t("adminBook.deleteSelectedBooks.success");
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminBook.deleteSelectedBooks.fail");
      }
    },

    // 开放选中图书
    async openSelectedBooks() {
      if (this.selectedBooks.length === 0) {
        this.alertMsg = this.$t("adminBook.openSelectedBooks.empty");
        return;
      }

      const openedTitles = [];
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      try {
        for (const bookId of this.selectedBooks) {
          const book = this.books.find((b) => b.id === bookId);
          if (book && book.state != 1) {
            openedTitles.push(book.name);
            await api.post(endpoints.updateBook(bookId), {
              ...book,
              state: 1,
            });
          }
        }

        // 添加批量开放日志
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "更新",
          info: `批量开放图书：${openedTitles.join(", ")}`,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        // 重置状态
        this.selectedBooks = [];
        this.selectBooks();
        this.resetSelection();
        this.currentPage = 1;
        this.message = this.$t("adminBook.openSelectedBooks.success");
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminBook.openSelectedBooks.fail");
      }
    },

    // 关闭选中图书
    async closeSelectedBooks() {
      if (this.selectedBooks.length === 0) {
        this.alertMsg = this.$t("adminBook.closeSelectedBooks.empty");
        return;
      }

      const closedTitles = [];
      const adddate = new Date().toLocaleString("sv-SE", {
        timeZoneName: "short",
      });

      try {
        for (const bookId of this.selectedBooks) {
          const book = this.books.find((b) => b.id === bookId);
          if (book && book.state != 0) {
            closedTitles.push(book.name);
            await api.post(endpoints.updateBook(bookId), {
              ...book,
              state: 0,
            });
          }
        }

        // 添加批量关闭日志
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "更新",
          info: `批量关闭图书：${closedTitles.join(", ")}`,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        // 重置状态
        this.selectedBooks = [];
        this.selectBooks();
        this.resetSelection();
        this.currentPage = 1;
        this.message = this.$t("adminBook.closeSelectedBooks.success");
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminBook.closeSelectedBooks.fail");
      }
    },
    async updateBook(book) {
      try {
        await api.post(endpoints.updateBook(book.id), book);
        // 添加更新日志
        const adddate = new Date().toLocaleString("sv-SE", {
          timeZoneName: "short",
        });

        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "更新",
          info: `更新图书：${book.name || book.name}`,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);
        this.selectBooks();
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = this.$t("adminBook.updateBook.fail");
      }
    },

    // 接收搜索组件传值，搜索
    search(searchForm) {
      this.reSelect();
      this.searchForm = searchForm;
      this.activeSearch = true;
    },

    reSelect() {
      this.currentPage = 1;
      this.activeSearch = false;
      this.sortColumn = null;
      this.selectBooks();
      this.selectedBooks = [];
    },

    // 排序图书
    sortBooks(column) {
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
      this.selectBooks();
    },
  },

  beforeDestroy() {
    eventBus.$off("language-changed", this.setConfig);
  },
};
</script>

<style scoped>
.admin-book {
  height: 100%;
  width: 85%;
  background: var(--background-color);
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.admin-book::-webkit-scrollbar {
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

img {
  height: 50px;
  width: auto;
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

.book-type-icon {
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

.book-info {
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
