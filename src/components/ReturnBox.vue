<template>
  <div class="return" @click="handleClickOutside">
    <div class="return-content">
      <span class="close-button" @click="close">&times;</span>
      <div class="return-text">
        {{ returnMsg }}
      </div>
      <span>{{ book.bookname }}</span>
      <div class="rating">
        <div v-for="n in 5" :key="n" class="star-container">
          <div
            class="star full"
            :class="{ active: score >= n }"
            @click="setRating(n)"
          ></div>
        </div>
      </div>

      <!-- 相关留言 -->
      <div class="message">
        <textarea
          type="text"
          v-model="newMessage.info"
          placeholder="请输入您对此图书的留言"
        ></textarea>
      </div>

      <div class="close-form" @click="handleSubmit">
        <div class="close-form-item">确定</div>
        <div class="close-form-loading"></div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
import { endpoints } from "@/api/endpoints";
import { mapState } from "vuex";

export default {
  name: "ReturnBox",

  props: {
    returnMsg: {
      type: String,
      default: "系统错误！",
    },
    book: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      score: this.book.score || null,
      selectedBook: {},
      newMessage: {
        title: "",
        info: "",
        adduser: "",
        adddate: "",
        book_id: null,
        views: 0,
        likes: 0,
      },
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
  },

  mounted() {
    this.selectBookByName(this.book.bookname);
  },

  methods: {
    close() {
      this.$emit("close");
    },

    handleClickOutside(event) {
      if (event.target.classList.contains("return")) {
        this.close();
      }
    },

    setRating(value) {
      this.score = value;
    },

    async selectBookByName(name) {
      try {
        const response = await api.get(endpoints.selectBookByBookname(name));
        this.selectedBook = response.data.books[0];
      } catch (error) {
        console.error("选择图书失败:", error.message);
      }
    },

    async submitRating() {
      try {
        if (!this.selectedBook.id || this.score === null) {
          throw new Error("未正确选择图书或评分为空");
        }

        const currentScore = this.selectedBook.score || 0;
        const totalRatings = this.selectedBook.num_score || 0;
        const newScore = this.score;

        const updatedScore =
          totalRatings > 0
            ? (currentScore * totalRatings + newScore) / (totalRatings + 1)
            : newScore;

        const updatedBook = {
          ...this.selectedBook,
          score: updatedScore.toFixed(1),
          num_score: totalRatings + 1,
        };

        await this.updateBook(updatedBook);
      } catch (error) {
        console.error(
          "评分提交失败:",
          error.response?.data?.error || error.message
        );
      }
    },

    async updateBook(book) {
      try {
        await api.post(endpoints.updateBook(book.id), book);
        console.log("评分更新成功");
      } catch (error) {
        console.error(
          "更新图书评分失败:",
          error.response?.data?.error || error.message
        );
      }
    },

    async addMessage() {
      if (this.newMessage.info) {
        this.newMessage.adduser = this.userInfo.username;
        this.newMessage.adddate = new Date().toISOString().split("T")[0];
        this.newMessage.views = 1;
        this.newMessage.likes = 0;
        this.newMessage.title = `借阅评分：${this.book.bookname}`;
        // this.newMessage.book_id = this.book.id;
        this.newMessage.book_id = this.selectedBook.id;
        try {
          await api.post(endpoints.addMessage, this.newMessage);
        } catch (error) {
          console.error(error.response?.data?.error || error.message);
          this.alertMsg = "论坛留言添加失败";
        }
      }
    },

    handleSubmit() {
      this.submitRating();
      this.addMessage();
      this.close();
    },
  },
};
</script>

<style scoped>
.return {
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
  backdrop-filter: blur(2px);
  animation: fade-in 0.5s;
}

.return-content {
  width: 35%;
  height: 35%;
  background-color: var(--card-color);
  border-radius: 3px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.return-text {
  padding: 10px;
  text-align: center;
}

.rating {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  gap: 5px;
}

textarea{
  color: var(--text-color);
  background-color: var(--card-color);
}

.message {
  width: 75%;
}

textarea[type="text"] {
  font-family: var(--body-font);
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  outline: none;
  box-sizing: border-box;
  overflow: auto;
}

.star-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 24px;
  height: 24px;
}

.star {
  position: absolute;
  width: 24px;
  height: 24px;
  clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );
  background-color: #ddd;
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;
}

.star.active {
  background-color: gold;
}

.star:hover {
  transform: scale(1.2);
}

.close-form {
  width: 100%;
  height: 15%;
  position: absolute;
  text-align: center;
  font-display: center;
  color: var(--first-color);
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  bottom: 0;
}

.close-form-item {
  width: 100%;
  height: 93%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-form-loading {
  width: 100%;
  height: 7%;
  display: flex;
  background: rgb(41, 181, 41);
  animation: loading 2s;
}

.close-form:hover {
  background: var(--border-color);
  border-radius: 0 0 2px 2px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 20px;
  color: var(--backgroun-color);
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.5s;
  z-index: 1;
}

.close-button:hover {
  animation: rotate 0.1s linear;
  color: #000;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(90deg);
  }
}

@keyframes loading {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}
</style>
