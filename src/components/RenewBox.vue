<template>
  <div class="renew" @click="handleClickOutside">
    <div class="renew-content">
      <span class="close-button" @click="close">&times;</span>
      <div class="renew-form">
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
          <p><strong>作者:</strong> {{ book.author }}</p>
          <p><strong>分类:</strong> {{ book.menu }}</p>
          <p><strong>价格:</strong> {{ book.price }}元</p>
          <p><strong>出版社:</strong> {{ book.press }}</p>
          <p><strong>库存数量:</strong> {{ book.num }}本</p>
          <p><strong>入库日期:</strong> {{ book.adddate }}</p>
        </div>
      </div>

      <!-- 底部简介 -->
      <div class="book-description">
        &nbsp;&nbsp;&nbsp;&nbsp;{{ book.info }}
      </div>

      <!-- 续借表单 -->
      <div class="renew-actions">
        <div class="renew-inputs">
          <div>
            <label for="renew-days">预计续借天数 (最大7天):</label>
            <input
              id="renew-days"
              type="number"
              v-model="renewDays"
              placeholder="输入天数"
              min="1"
              max="7"
            />
          </div>
          <div>
            <label for="over-date">预计归还日期:</label>
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
          <button class="action-button renew-button" @click="handleRenew">
            确认续借
          </button>
          <button class="action-button cancel-button" @click="handleCancel">
            取消
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
  name: "RenewBox",
  props: {
    book: {
      type: Object,
      default: () => ({
        id: null,
        name: "未知书籍",
        author: "未知作者",
        menu: "未知分类",
        price: "未知价格",
        press: "未知出版社",
        num: 0,
        img: "image-add-fill.png",
        info: "暂无更多信息",
        state: 1,
        adddate: "未知日期",
      }),
    },
  },

  data() {
    return {
      alertMsg: "",
      message: "",
      renewDays: 1, // 默认续借一天
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
    // 当续借天数发生变化时更新归还日期
    renewDays(newDays) {
      if (newDays && newDays > 0) {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + parseInt(newDays, 10));
        this.overDate = newDate.toISOString().split("T")[0];
      }
    },

    // 当归还日期发生变化时更新续借天数
    overDate(newDate) {
      if (newDate) {
        const startDate = new Date(this.minOverDate);
        const endDate = new Date(newDate);
        const diffDays = Math.ceil(
          (endDate - startDate) / (1000 * 60 * 60 * 24)
        );
        this.renewDays = diffDays > 0 ? diffDays : 1;
      }
    },
  },

  methods: {
    close() {
      this.$emit("close");
    },

    handleClickOutside(event) {
      if (event.target.classList.contains("renew")) {
        this.close();
      }
    },

    // 计算最大归还日期（当前日期 + 7天）
    calMaxOverDate() {
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 7);
      return maxDate.toISOString().split("T")[0];
    },

    // 续借逻辑
    async handleRenew() {
      if (!this.userInfo.usertoken) {
        this.alertMsg = "请先登录";
        return;
      }

      if (!this.renewDays || !this.overDate) {
        this.alertMsg = "请填写预计续借天数和归还日期";
        return;
      }

      if (this.book.num <= 0) {
        this.alertMsg = "库存不足，无法续借";
        return;
      }

      // 续借天数超过 7 天
      if (this.renewDays > 7) {
        this.alertMsg = "续借天数不能超过7天";
        return;
      }

      try {
        await api.post(endpoints.renew, {
          username: this.userInfo.username,
          bookname: this.book.name,
          start_date: new Date().toISOString().split("T")[0],
          over_date: this.overDate,
          days: this.renewDays,
        });

        // 添加续借日志
        const adddate = new Date().toLocaleString("sv-SE", {
          timeZoneName: "short",
        });
        const newLog = {
          username: this.userInfo.username,
          userIP: this.userInfo.userIP,
          type: "借阅",
          info: `用户${this.userInfo.username}于${adddate}续借图书：${this.book.name}`,
          creditCount: null,
          adddate: adddate,
        };

        await api.post(endpoints.addLog, newLog);

        this.message = `续借成功: ${this.book.name}`;
        this.$emit("reSelect");
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        console.error(errorMessage);
        if (error.response?.status === 404) {
          this.alertMsg = "已经续借过该图书";
        } else this.alertMsg = "续借失败，请重试";
      }
    },

    handleCancel() {
      this.$emit("close");
    },
  },
};
</script>


<style scoped>
.renew {
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

.renew-content {
  width: 60%;
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

.renew-form {
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
  margin-top: 20px;
  font-size: 16px;
  color: var(--text-color);
  width: 100%;
  text-align: left;
  padding: 20px;
  border-top: 1px solid #ddd;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow-y: auto;
}

.renew-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.renew-inputs {
  height: 50px;
  display: flex;
  gap: 10px;
}

.renew-inputs label {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}

.renew-inputs input {
  padding: 10px;
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

.renew-button {
  color: var(--first-color);
  border: 1px solid var(--first-color);
  background-color: var(--white-color);
}

.renew-button:hover {
  background-color: var(--first-color);
  color: var(--white-color);
  transition: 0.4s;
}

.cancel-button {
  color: red;
  border: 1px solid red;
  background-color: var(--white-color);
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
