<template>
  <div class="borrow" @click="handleClickOutside">
    <div class="borrow-content">
      <span class="close-button" @click="close">&times;</span>
      <div class="borrow-form">
        <div class="book-image">
          <img
            v-lazy="
              book.img
                ? `/assets/img/${book.img}`
                : '/assets/img/image-add-fill.png'
            "
            :alt="$t('borrowBox.imgAlt')"
            :class="{ 'default-cover': !book.img, 'book-cover': book.img }"
          />
        </div>

        <!-- 右侧图书其他信息 -->
        <div class="book-info">
          <p class="book-title">{{ book.name }}</p>
          <p>
            <strong>{{ $t("borrowBox.author") }}</strong> {{ book.author }}
          </p>
          <p>
            <strong>{{ $t("borrowBox.menu") }}</strong> {{ book.menu }}
          </p>
          <p>
            <strong>{{ $t("borrowBox.price") }}</strong> {{ book.price }}元
          </p>
          <p>
            <strong>{{ $t("borrowBox.press") }}</strong> {{ book.press }}
          </p>
          <p>
            <strong>{{ $t("borrowBox.num") }}</strong> {{ book.num }}
          </p>
          <p>
            <strong>{{ $t("borrowBox.adddate") }}</strong> {{ book.adddate }}
          </p>
        </div>
      </div>

      <!-- 底部简介 -->
      <div class="book-description">
        &nbsp;&nbsp;&nbsp;&nbsp;{{ book.info }}
      </div>

      <!-- 借阅表单 -->
      <div class="borrow-actions">
        <div class="borrow-inputs">
          <div>
            <label for="borrow-days">{{ $t("borrowBox.borrowDays") }}</label>
            <input
              id="borrow-days"
              type="number"
              v-model="borrowDays"
              :placeholder="$t('borrowBox.borrowDaysPlaceholder')"
              min="1"
              max="30"
            />
          </div>
          <div>
            <label for="over-date">{{ $t("borrowBox.overDate") }}</label>
            <input
              id="over-date"
              type="date"
              v-model="overDate"
              :min="minOverDate"
              :max="maxOverDate"
            />
          </div>
        </div>
        <div class="buttons">
          <button class="action-button borrow-button" @click="handleBorrow">
            {{ $t("borrowBox.handleBorrow") }}
          </button>
          <button class="action-button cancel-button" @click="handleCancel">
            {{ $t("borrowBox.handleCancel") }}
          </button>
        </div>
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
  name: "BorrowBox",
  props: {
    book: {
      type: Object,
      default: () => ({
        id: null,
        name: "Unknown",
        author: "Unknown",
        menu: "Unknown",
        price: "Unknown",
        press: "Unknown",
        num: 0,
        img: "image-add-fill.png",
        info: "Unknown",
        state: 1,
        adddate: "Unknown",
      }),
    },
  },

  data() {
    return {
      alertMsg: "",
      message: "",
      borrowDays: 1, // 默认借阅一天
      overDate: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0], // 默认日期为明天
      minOverDate: new Date().toISOString().split("T")[0],
      maxOverDate: this.calMaxOverDate(),
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
  },

  components: {
    AlertBox,
    MessageBox,
  },

  watch: {
    // 当借阅天数发生变化时更新归还日期
    borrowDays(newDays) {
      if (newDays && newDays > 0) {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + parseInt(newDays, 10));
        this.overDate = newDate.toISOString().split("T")[0];
      }
    },

    // 当归还日期发生变化时更新借阅天数
    overDate(newDate) {
      if (newDate) {
        const startDate = new Date(this.minOverDate);
        const endDate = new Date(newDate);
        const diffDays = Math.ceil(
          (endDate - startDate) / (1000 * 60 * 60 * 24)
        );
        this.borrowDays = diffDays > 0 ? diffDays : 1;
      }
    },
  },

  methods: {
    close() {
      this.$emit("close");
    },

    handleClickOutside(event) {
      if (event.target.classList.contains("borrow")) {
        this.close();
      }
    },

    // 计算最大归还日期（当前日期 + 30天）
    calMaxOverDate() {
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 30);
      return maxDate.toISOString().split("T")[0];
    },

    // 借阅逻辑
    async handleBorrow() {
      if (!this.userInfo.usertoken) {
        this.alertMsg = this.$t("borrowBox.loginError");
        return;
      }

      if (!this.borrowDays || !this.overDate) {
        this.alertMsg = this.$t("borrowBox.formError");
        return;
      }

      if (this.book.num <= 0) {
        this.alertMsg = this.$t("borrowBox.emptyError");
        return;
      }

      // 借阅天数超过 30 天
      if (this.borrowDays > 30) {
        this.alertMsg = this.$t("borrowBox.overDaysError");
        return;
      }

      try {
        await api.post(endpoints.borrow, {
          username: this.userInfo.username,
          bookname: this.book.name,
          start_date: new Date().toISOString().split("T")[0],
          over_date: this.overDate,
          days: this.borrowDays,
        });

        // 添加借阅日志
        const adddate = new Date().toLocaleString("sv-SE", {
          timeZoneName: "short",
        });
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "借阅",
          info: `用户${this.userInfo.username}于${adddate}借阅图书：${this.book.name}`,
          creditCount: null,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        this.message = this.$t("borrowBox.borrowSuccess");
        this.$emit("reSelect");
      } catch (error) {
        const errMsg = error.response?.data?.error || error.message;
        console.error(errMsg);

        if (error.response?.status === 400) {
          this.alertMsg = this.$t("borrowBox.borrowRepeat");
        } else {
          this.alertMsg = this.$t("borrowBox.borrowFail");
        }
      }
    },

    handleCancel() {
      this.$emit("close");
    },
  },
};
</script>


<style scoped>
.borrow {
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

.borrow-content {
  width: 60%;
  max-height: 80%;
  background-color: var(--card-color);
  border-radius: 3px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
}

.borrow-form {
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

.book-description {
  white-space: pre-wrap;
  margin-top: 20px;
  font-size: 16px;
  color: var(--text-color);
  width: 100%;
  max-height: 150px;
  text-align: left;
  padding: 20px;
  border-top: 1px solid #ddd;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow-y: auto;
  scrollbar-width: none; 
  -ms-overflow-style: none;
}

.book-description::-webkit-scrollbar {
  display: none;
}

.borrow-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.borrow-inputs {
  height: 50px;
  display: flex;
  gap: 10px;
}

.borrow-inputs label {
  margin-right: 10px;
  font-size: 14px;
  color: var(--first-color);
  font-weight: bold;
}

.borrow-inputs input {
  padding: 5px;
  background-color: var(--card-color);
  color: var(--text-color);
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
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
  border: 1px solid var(--btn-color);
  background-color: var(--card-color);
}

.borrow-button:hover {
  background-color: var(--first-color);
  color: var(--white-color);
  transition: 0.4s;
}

.cancel-button {
  color: red;
  border: 1px solid red;
  background-color: var(--card-color);
}

.cancel-button:hover {
  background-color: red;
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
