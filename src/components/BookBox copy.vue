<template>
  <div class="book" @click="handleClickOutside">
    <div class="book-content">
      <span class="close-button" @click="close">&times;</span>
      <div class="book-form">
        <!-- 左侧封面图片 -->
        <div class="book-image">
          <img
            v-lazy="
              book.img
                ? `/assets/img/${book.img}`
                : '/assets/img/image-add-fill.png'
            "
            alt="封面"
            :class="{ 'default-cover': !book.img, 'book-cover': book.img }"
          />
        </div>

        <!-- 右侧图书其他信息 -->
        <div class="book-info">
          <p class="book-title">{{ book.name }}</p>
          <!-- 评分信息 -->
          <p
            v-if="
              book.score !== null && book.score !== undefined && book.score != 0
            "
          >
            <strong>评分:</strong> {{ (+book.score).toFixed(1) + " / 5" }} 共
            {{ book.num_score || 0 }} 人参与
          </p>
          <p v-else><strong>评分:</strong> 暂无</p>
          <p><strong>作者:</strong> {{ book.author }}</p>
          <p><strong>分类:</strong> {{ book.menu }}</p>
          <!-- <p><strong>价格:</strong> {{ book.price }}元</p> -->
          <p><strong>出版社:</strong> {{ book.press }}</p>
          <p><strong>库存数量:</strong> {{ book.num }}本</p>
          <p><strong>入库日期:</strong> {{ book.adddate }}</p>
        </div>

        <!-- 相关评论 -->
        <div v-if="bookMessages.length" class="book-message">
          <p class="message-title">读者留言</p>
          <div class="message-info">
            <p v-for="message in bookMessages" :key="message.id">
              {{ message.adduser }} ：{{ message.info }}
            </p>
          </div>
        </div>
      </div>

      <!-- 底部简介 -->
      <div class="book-description">
        &nbsp;&nbsp;&nbsp;&nbsp;{{ book.info }}
      </div>

      <!-- 操作按钮 -->
      <div class="book-actions">
        <button class="action-button borrow-button" @click="actionButton">
          {{ btnMsg }}
        </button>
        <!-- <button class="action-button message-button" @click="messageBook">
          留言
        </button> -->
        <button
          class="action-button favorite-button"
          @click="toggleFavorite"
          :class="{ favorited: isFavorited }"
        >
          {{ isFavorited ? "取消收藏" : "收藏" }}
        </button>
      </div>
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
import { mapState } from "vuex";
import AlertBox from "./AlertBox.vue";
import MessageBox from "./MessageBox.vue";

export default {
  name: "BookBox",
  props: {
    book: {
      type: Object,
      default: () => ({
        name: "未知书籍",
        author: "未知作者",
        menu: "未知分类",
        price: "未知价格",
        press: "未知出版社",
        num: 0,
        score: 0,
        num_score: 0,
        img: "image-add-fill.png",
        info: "暂无更多信息",
        state: 1,
        adddate: "未知日期",
      }),
    },
    // 是否为借阅按钮
    btnMsg: {
      type: String,
      default: "借阅",
    },
  },

  data() {
    return {
      alertMsg: "",
      message: "",
      isFavorited: false,
      users: [
        {
          id: 0,
          username: "",
          email: "",
          password: "",
          credit_count: 0,
          state: 0,
          adddate: "",
        },
      ],
      bookMessages: [],
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
  },

  components: {
    AlertBox,
    MessageBox,
  },

  mounted() {
    this.checkIfFavorited();
    this.selectUsersByUserName();
    this.selectBookMessage();
  },

  methods: {
    close() {
      this.$emit("close");
    },
    handleClickOutside(event) {
      if (event.target.classList.contains("book")) {
        this.close();
      }
    },

    // 查询当前用户信息
    async selectUsersByUserName() {
      try {
        const response = await api.get(
          endpoints.selectUserByUsername(this.userInfo.username)
        );
        const users = response.data.users;
        this.users =
          users.map((user) => ({
            ...user,
          })) || {};
        if (this.users.length === 0) {
          this.alertMsg = "未找到任何用户记录";
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "获取用户数据失败";
      }
    },

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

    // 收藏/取消收藏图书
    async toggleFavorite() {
      if (this.userInfo.usertoken) {
        if (this.isFavorited) {
          await this.cancelFavorite();
        } else {
          await this.addFavorite();
        }
        this.isFavorited = !this.isFavorited;
      } else this.alertMsg = "请先登录";
    },

    async addFavorite() {
      const newFavorite = {
        name: this.book.name,
        user: this.userInfo.username,
        author: this.book.author,
        menu: this.book.menu,
        price: this.book.price,
        press: this.book.press,
        num: this.book.num,
        img: this.book.img,
        info: this.book.info,
        state: this.book.state,
        adddate: this.book.adddate,
      };
      try {
        await api.post(endpoints.addFavorite(newFavorite));
        this.message = "收藏成功，请前往用户中心-我的收藏查看";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "收藏添加失败";
      }
    },

    async cancelFavorite() {
      try {
        await api.post(
          endpoints.delFavorite(this.userInfo.username, this.book.name)
        );
        // this.alertMsg = "取消收藏成功，请前往用户中心-我的收藏查看";
        this.$emit("reSelect");
        this.$emit("close");
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "取消收藏失败";
      }
    },

    // 选择图书评论信息
    async selectBookMessage() {
      try {
        const response = await api.get(
          endpoints.selectMessageByBookId(this.book.id)
        );
        this.bookMessages = response.data.messages || [];
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "获取图书留言失败";
      }
    },

    // 留言图书
    // messageBook() {
    //   console.log("留言图书");
    // },

    // 操作按钮
    actionButton() {
      switch (this.btnMsg) {
        case "借阅":
          if (this.userInfo.usertoken) {
            if (this.users[0].credit_count >= 25) {
              // 借阅逻辑
              this.$emit("borrowBook", this.book);
              this.$emit("close");
            } else this.alertMsg = "用户信誉分不足，操作失败";
          } else this.alertMsg = "请先登录";
          break;
        case "在图书中心查看":
          this.$router.push({
            path: "/book",
            query: { search: this.book.name.trim() },
          });
          break;
        case "归还":
          this.$emit("close");
          break;
      }
    },
  },
};
</script>

<style scoped>
.book {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);
  animation: fade-in 0.5s;
}

.book-content {
  width: 65%;
  max-height: 80%;
  background-color: var(--white-color);
  border-radius: 3px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
}

.book-form {
  display: flex;
  gap: 20px;
  width: 100%;
  align-items: flex-start;
}

.book-image img {
  width: 150px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.book-info {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  flex: 1;
  border-right: #ddd solid 1px;
}

.book-message {
  display: flex;
  flex-direction: column;
  font-size: 16px;
  flex: 1;
}

.book-title {
  font-size: 24px;
  font-weight: bold;
  color: var(--first-color);
  margin-bottom: 10px;
}

.book-info p {
  margin: 5px 0;
}

.message-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--first-color);
  margin-top: 10px;
  margin-bottom: 10px;
}

.message-info {
  height: 200px;
  overflow-y: scroll;
  --ms-overflow-style: none;
  scrollbar-width: none;
}

.message-info p {
  margin: 10px 0;
}
.book-description {
  white-space: pre-wrap;
  margin-top: 20px;
  font-size: 16px;
  color: var(--text-color);
  width: 100%;
  max-height: 200px;
  text-align: left;
  padding: 20px;
  border-top: 1px solid #ddd;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow-y: auto;
}

.book-actions {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 20px;
}

.action-button {
  padding: 10px;
  min-width: 100px;
  border-radius: 5px;
  font-weight: var(--font-medium);
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.4s;
}

.borrow-button {
  color: var(--first-color);
  border: 1px solid var(--first-color);
  background-color: var(--white-color);
}

.borrow-button:hover {
  background-color: var(--first-color);
  color: var(--white-color);
  transition: 0.4s;
}

.message-button {
  color: var(--first-color);
  border: 1px solid var(--first-color);
  background-color: var(--white-color);
}

.message-button:hover {
  background-color: var(--first-color);
  color: var(--white-color);
  transition: 0.4s;
}

.favorite-button {
  color: gold;
  border: 1px solid gold;
  background-color: var(--white-color);
}

.favorite-button.favorited {
  color: gray;
  border-color: gray;
  border: 1px solid gray;
}

.favorite-button.favorited:hover {
  background-color: gray;
  color: var(--white-color);
  transition: 0.4s;
}

.favorite-button:hover {
  background-color: gold;
  color: var(--white-color);
  transition: 0.4s;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 20px;
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.5s;
}

.close-button:hover {
  animation: rotate 0.1s linear;
  color: #000;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(90deg);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
