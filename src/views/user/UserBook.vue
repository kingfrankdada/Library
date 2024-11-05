<template>
  <div class="user-book">
    <div class="book-body">
      <div v-if="filteredBooks.length" class="book-grid">
        <div
          v-for="(book, index) in filteredBooks"
          :key="index"
          class="book-card"
        >
          <img
            :src="
              book.img
                ? `/assets/img/${book.img}`
                : '/assets/img/image-add-fill.png'
            "
            alt="封面"
            :class="{ 'default-cover': !book.img, 'book-cover': book.img }"
          />
          <div class="book-info">
            <h3>{{ book.name }}</h3>
            <p>作者：{{ book.author }}</p>
            <p>库存：{{ book.num }}本</p>
            <p>分类：{{ book.menu }}</p>
          </div>
        </div>
      </div>
      <div v-else class="book-grid">
        <span>{{ boxMsg }}</span>
      </div>

      <!-- 页码条 -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
        <span
          >第 {{ currentPage }} 页 / 共
          {{ totalPages ? totalPages : 1 }} 页</span
        >
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages || !totalPages"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- 左侧导航栏 -->
    <UserLeftGuide
      class="left-guide-model"
      :guideTitle="'图书中心'"
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
  </div>
</template>

<script>
import axios from "axios";
import AlertBox from "@/components/AlertBox.vue";
import UserLeftGuide from "@/components/user/UserLeftGuide.vue";
import { mapState } from "vuex";

export default {
  name: "UserBook",

  data() {
    return {
      books: [],
      menus: [],
      selectedCategory: "",
      currentPage: 1, // 默认展示第一页
      pageSize: 12, // 每页展示12本书 6x2
      alertMsg: "",
      boxMsg: "暂无数据...",
    };
  },
  computed: {
    ...mapState("UserInfo", ["userInfo"]),

    // 当前展示图书
    filteredBooks() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;

      // 过滤图书
      const filtered = this.selectedCategory
        ? this.books.filter((book) => book.menu === this.selectedCategory)
        : this.books;

      return filtered.slice(start, end);
    },

    // 总页数
    totalPages() {
      const filtered = this.selectedCategory
        ? this.books.filter((book) => book.menu === this.selectedCategory)
        : this.books;

      return Math.ceil(filtered.length / this.pageSize);
    },
  },

  components: {
    AlertBox,
    UserLeftGuide,
  },

  mounted() {
    this.selectBooks();
    this.selectMenus();
  },

  methods: {
    async selectBooks() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/selectBook"
        );
        this.books = response.data.books || [];
        if (this.books.length === 0) {
          this.boxMsg = "未找到任何图书记录";
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = "获取图书数据失败";
      }
    },

    async selectMenus() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/selectMenu"
        );
        this.menus = response.data.menus;
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = "获取分类信息数据失败";
      }
    },

    // 点击标题，重置分类
    handleTitle() {
      this.currentPage = 1;
      this.selectedCategory = "";
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
  },
};
</script>

<style scoped>
.user-book {
  height: 100%;
  width: 100%;
  z-index: 0;
  background: var(--background-color);
  display: flex;
  flex-direction: column;
}

.book-body {
  position: absolute;
  width: calc(85% - 20px);
  left: 15%;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  padding-left: 20px;
  gap: 20px;
  overflow: auto;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
}

.book-card {
  cursor: pointer;
  background-color: var(--white-color);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.book-cover,
.default-cover {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

.book-info h3 {
  font-size: 16px;
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
  background-color: var(--white-color);
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
</style>