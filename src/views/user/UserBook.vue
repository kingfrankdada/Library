<template>
  <div class="user-book">
    <div class="book-body">
      <div v-if="filteredBooks.length" class="book-grid">
        <div
          v-for="(book, index) in filteredBooks"
          :key="index"
          :class="book.state === 1 ? 'book-card' : 'book-card disabled-card'"
          :title="
            book.state === 1
              ? $t('userBook.titleInfo')
              : $t('userBook.titleInfoDisabled')
          "
          @click="openBook(book)"
        >
          <i
            class="book-icon"
            :class="
              book.state === 1 ? 'ri-information-line' : 'ri-prohibited-line'
            "
          ></i>
          <img
            v-lazy="
              book.img
                ? `/assets/img/${book.img}`
                : '/assets/img/image-add-fill.png'
            "
            :alt="$t('userBook.imgAlt')"
            :class="{ 'default-cover': !book.img, 'book-cover': book.img }"
          />
          <div class="book-info">
            <p>
              <strong>{{ book.name }}</strong>
            </p>
            <p>{{ book.author }}</p>
            <p>{{ $t("userBook.num") }} {{ book.num }}</p>
            <p>{{ book.menu }}</p>
          </div>
        </div>
      </div>
      <div v-else class="book-grid">
        <span>{{ boxMsg }}</span>
      </div>
    </div>

    <!-- 页码条 -->
    <div class="pagination">
      <button @click="firstPage">{{ $t("userBook.firstPage") }}</button>
      <button @click="prevPage" :disabled="currentPage === 1">
        {{ $t("userBook.prevPage") }}
      </button>
      <span>
        {{
          $t("userBook.pageInfo", { currentPage, totalPages: totalPages || 1 })
        }}
      </span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages || !totalPages"
      >
        {{ $t("userBook.nextPage") }}
      </button>
      <button @click="lastPage">{{ $t("userBook.lastPage") }}</button>
    </div>

    <!-- 图书详情模态框 -->
    <BookBox
      v-if="selectedBook"
      :book="selectedBook"
      @close="selectedBook = null"
      @borrowBook="borrowBook"
      :btnMsg="$t('userBook.btnMsg')"
    ></BookBox>

    <!-- 图书借阅模态框 -->
    <BorrowBox
      v-if="selectedBorrowBook"
      :book="selectedBorrowBook"
      @reSelect="selectBooks"
      @close="selectedBorrowBook = null"
    ></BorrowBox>

    <!-- 左侧导航栏 -->
    <UserLeftGuide
      class="left-guide-model"
      :guideTitle="$t('userBook.guideTitle')"
      :guideList="menus"
      @handleTitle="handleTitle"
      @handleInfo="handleInfo"
    ></UserLeftGuide>

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
import { mapState } from "vuex";
import AlertBox from "@/components/AlertBox.vue";
import MessageBox from "@/components/MessageBox.vue";
import UserLeftGuide from "@/components/user/UserLeftGuide.vue";
import BorrowBox from "@/components/BorrowBox.vue";
import BookBox from "@/components/BookBox.vue";

export default {
  name: "UserBook",

  components: {
    AlertBox,
    MessageBox,
    UserLeftGuide,
    BorrowBox,
    BookBox,
  },

  data() {
    return {
      books: [],
      menus: [],
      selectedCategory: "",
      selectedBook: null, // 选择要展示的图书
      searchQuery: "", // 搜索框的值

      selectedBorrowBook: null, // 选择要借阅的图书

      currentPage: 1, // 默认展示第一页
      pageSize: 12, // 每页展示12本书 6x2
      alertMsg: "",
      message: "",
      boxMsg: this.$t("userBook.boxMsg"),
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),

    // 当前展示图书
    filteredBooks() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;

      // 大小写转换，适配模糊匹配
      const searchQuery = this.searchQuery
        ? this.searchQuery.toLowerCase()
        : "";

      const filtered = this.books
        .filter((book) => {
          const isCategoryMatch = this.selectedCategory
            ? book.menu === this.selectedCategory
            : true;

          const isNameMatch = searchQuery
            ? book.name.toLowerCase().includes(searchQuery)
            : true;

          return isCategoryMatch && isNameMatch;
        })
        .sort((a, b) => b.id - a.id);

      return filtered.slice(start, end);
    },

    // 总页数
    totalPages() {
      const searchQuery = this.searchQuery
        ? this.searchQuery.toLowerCase()
        : "";

      const filtered = this.books.filter((book) => {
        const isCategoryMatch = this.selectedCategory
          ? book.menu === this.selectedCategory
          : true;
        const isNameMatch = searchQuery
          ? book.name.toLowerCase().includes(searchQuery)
          : true;

        return isCategoryMatch && isNameMatch;
      });

      return Math.ceil(filtered.length / this.pageSize || 1);
    },
  },

  watch: {
    "$route.query.search"(newSearch) {
      this.searchQuery = newSearch || "";
      this.currentPage = 1;
      // this.updateAlertMessage();
    },
  },

  mounted() {
    this.selectBooks();
    this.selectMenus();
    this.searchQuery = this.$route.query.search || "";
    // this.updateAlertMessage(); // 初始页面加载时，更新搜索结果信息
  },

  methods: {
    // 检查是否已收藏
    async checkIfFavorited() {
      try {
        const response = await api.get(endpoints.checkFavorite, {
          params: { bookName: this.book.name, user: this.userInfo.username },
        });
        this.isFavorited = response.data.isFavorited;
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
      }
    },

    async selectBooks() {
      try {
        const response = await api.get(endpoints.selectBook);
        this.books = response.data.books || [];
        if (this.books.length === 0) {
          this.boxMsg = this.$t("userBook.bookEmpty");
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = this.$t("userBook.bookError");
      }
    },

    async selectMenus() {
      try {
        const response = await api.get(endpoints.selectMenu);
        this.menus = response.data.menus;
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = this.$t("userBook.menuError");
      }
    },

    // 清空分类搜索和图书搜索
    handleTitle() {
      this.currentPage = 1;
      this.selectedCategory = "";
      this.searchQuery = "";
      // 重置路由
      this.$router
        .replace({ path: this.$route.path, query: {} })
        .catch((error) => {
          if (error.name !== "NavigationDuplicated") {
            throw error;
          }
        });
    },

    // 点击左侧导航栏，切换对应分类
    handleInfo(item) {
      this.selectedCategory = item.title;
      this.currentPage = 1;
    },

    // 切换到上一页
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    // 切换到下一页
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    // 切换到最后一页
    lastPage() {
      this.currentPage = this.totalPages;
    },

    // 切换到第一页
    firstPage() {
      this.currentPage = 1;
    },

    // 选择图书，传递数据给 BookBox 组件
    openBook(book) {
      this.selectedBook = book;
    },

    // 借阅图书，传递数据给 BorrowBox 组件
    borrowBook(book) {
      this.selectedBorrowBook = book;
    },

    // 更新搜索的反馈
    updateAlertMessage() {
      const resultCount = this.filteredBooks.length;
      if (this.searchQuery) {
        if (resultCount > 0) {
          this.message = this.$t("userBook.searchResult", { resultCount });
        } else {
          this.message = this.$t("userBook.searchEmpty");
        }
      } else {
        this.message = "";
      }
    },
  },
};
</script>

<style scoped>
.user-book {
  height: 100%;
  width: 100%;
  z-index: 0;
  display: flex;
  flex-direction: column;
}

.book-body {
  position: absolute;
  background: var(--background-color);
  width: 85%;
  padding-right: 20px;
  height: 100%;
  left: 15%;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  padding-left: 20px;
  gap: 20px;
}

.book-grid {
  padding: 5px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
}

.book-card {
  cursor: pointer;
  height: 100%;
  background-color: var(--card-color);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.book-card.disabled-card {
  opacity: 0.6;
  pointer-events: none;
  cursor: not-allowed;
}

.book-card .book-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  color: var(--first-color);
}

.book-cover,
.default-cover {
  width: 75px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 10px;
}

.book-info strong {
  font-size: 15px;
  font-weight: bold;
  color: var(--first-color);
  margin: 10px 0;
}

.book-info p {
  font-size: 14px;
  color: var(--text-color);
  margin: 5px 0;
}

.book-info p:last-child {
  font-weight: bold;
}

.pagination {
  position: absolute;
  left: 7.5%;
  bottom: 20px;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.pagination button {
  padding: 5px 10px;
  border: 1px solid var(--first-color);
  border-radius: 5px;
  background-color: var(--card-color);
  color: var(--first-color);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background-color: var(--first-color);
  color: var(--white-color);
}

.book-modal-title {
  left: 20px;
  width: 100%;
  height: 10%;
  text-align: left;
  font-size: 20px;
  font-weight: var(--font-semi-bold);
  color: var(--first-color);
  margin-top: 20px;
  margin-left: 50px;
}

.book-modal-text {
  left: 20px;
  width: 100%;
  height: 90%;
  text-align: left;
  font-size: 20px;
  color: black;
  padding: 20px;
  white-space: pre-wrap;
  overflow-y: auto;
}
</style>