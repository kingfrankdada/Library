<template>
  <div class="admin">
    <div class="header">
      <HeaderGuide></HeaderGuide>
    </div>
    <div v-show="this.$route.path === '/admin'" class="home-body">
      <div class="dashboard">
        <!-- 实时数据卡片 -->
        <div class="card real-time-data">
          <div class="card-title">实时数据</div>
          <div class="card-body">
            <div class="card-form-item">
              <h4>在线用户数</h4>
              <span class="card-form-count">{{ onlineUserCount }}</span>
            </div>
            <div class="card-form-item">
              <h4>收录图书数</h4>
              <span class="card-form-count">{{ books.length }}</span>
            </div>
            <div class="card-form-item">
              <h4>{{ userInfo.role != 0 ? "借阅信息数" : "系统日志数" }}</h4>
              <span class="card-form-count">{{ logs.length }}</span>
            </div>
          </div>
        </div>
        <!-- CPU数据卡片 -->
        <div class="card cpu-data">
          <div class="card-title">服务器处理器数据</div>
          <div class="card-body">
            <div class="card-form-item">
              <span class="card-form-text">
                CPU型号:
                <br />
                {{ systemInfo.cpuUsage.brand }}
                <br />
                CPU频率(GHz):
                <br />
                {{ systemInfo.cpuUsage.speed.toFixed(2) }}
              </span>
              <div class="sys-chart-container" ref="cpuChartContainer"></div>
            </div>
          </div>
        </div>
        <!-- 内存数据卡片 -->
        <div class="card book-data">
          <div class="card-title">服务器内存数据</div>
          <div class="card-body">
            <div class="card-form-item">
              <span class="card-form-text">
                内存总大小:
                <br />
                {{ formatSpeed(systemInfo.memoryUsage.totalMemory) }}
                <br />
                已使用内存:
                <br />
                {{ formatSpeed(systemInfo.memoryUsage.usedMemory) }}
              </span>
              <div class="sys-chart-container" ref="memChartContainer"></div>
            </div>
          </div>
        </div>
        <!-- 账号活跃情况卡片 -->
        <div class="card account-activity">
          <div class="card-title">历史在线记录</div>
          <div class="card-body">
            <div
              class="history-count-chart-container"
              ref="historyCountChartContainer"
            ></div>
          </div>
        </div>
        <!-- 公告卡片 -->
        <div class="card log-ratio">
          <div class="card-title">
            {{ userInfo.role != 0 ? "借阅信息" : "系统日志" }}
          </div>
          <div class="card-body">
            <div class="log-chart-container">
              <ul class="log-list">
                <li
                  v-for="log in logs.slice(0, 100)"
                  :key="log.id"
                  class="log-item"
                  :style="logColorType(log)"
                  @click="$router.push(`/admin/log`)"
                  :title="log.info"
                >
                  <i :class="logIconType(log)"></i>
                  {{ log.type }} - {{ log.username }} - {{ log.adddate }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <router-view class="admin-body"></router-view>
    <AdminLeftGuide class="left-guide-model"></AdminLeftGuide>
    <!-- 自定义弹窗捕获 -->
    <AlertBox
      v-if="alertMsg"
      :message="alertMsg"
      @close="alertMsg = null"
    ></AlertBox>
  </div>
</template>

<script>
import api from "@/api/api";
import { endpoints } from "@/api/endpoints";
import HeaderGuide from "@/components/HeaderGuide";
import AdminLeftGuide from "@/components/admin/AdminLeftGuide";
import AlertBox from "@/components/AlertBox.vue";
import * as echarts from "echarts";
import { mapState } from "vuex";

export default {
  name: "AdminHome",

  data() {
    return {
      systemInfo: {
        cpuUsage: {
          brand: "获取中...",
          speed: 0,
          usedPercentage: 0,
        },
        memoryUsage: {
          totalMemory: 0,
          usedMemory: 0,
          usedPercentage: 0,
        },
      },
      books: [],
      menuTitles: [],
      dailyUser: [],
      logs: [],
      typeCount: {},
      alertMsg: "",
      pollingInterval: null,
      cpuChart: null,
      memChart: null,
      historyCountChart: null,
    };
  },

  components: {
    HeaderGuide,
    AdminLeftGuide,
    AlertBox,
  },

  created() {
    if (this.userInfo.role != 1 && this.userInfo.role != 0) {
      this.$router.push("/home");
    }
    this.getSystemInfo();
  },

  mounted() {
    this.initCpuChart();
    this.initMemChart();
    this.getDailyUser();
    this.selectBooks();
    this.selectLogs();

    window.addEventListener("resize", this.resizeCharts);

    this.pollingInterval = setInterval(() => {
      this.getSystemInfo();
      this.$nextTick(() => {
        this.updateMemChart();
        this.updateCpuChart();
        // this.updateBookMenusChart();
      });
    }, 2000);
  },

  beforeDestroy() {
    // 防止内存泄漏
    window.removeEventListener("resize", this.resizeCharts);
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    if (this.cpuChart || this.memChart || this.historyCountChart) {
      this.cpuChart.dispose();
      this.memChart.dispose();
      this.historyCountChart.dispose();
    }
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
    ...mapState("AdminLeftGuide", ["isLeftGuideVisible"]),
    ...mapState("SysInfo", ["onlineUserCount"]),
  },

  watch: {
    $route() {
      this.$nextTick(() => {
        this.resizeCharts();
        this.selectBooks();
        this.selectLogs();
      });
    },
  },

  methods: {
    // 动态图标
    logIconType(log) {
      const type = log.type;
      switch (type) {
        case "登录":
          return "ri-login-box-line";
        case "登出":
          return "ri-logout-box-line";
        case "注册":
          return "ri-user-add-line";
        case "注销":
          return "ri-user-unfollow-line";
        case "更新":
          return "ri-refresh-line";
        case "新增":
          return "ri-add-circle-line";
        case "删除":
          return "ri-delete-bin-5-line";
        case "借阅":
          return "ri-book-open-line";
        case "归还":
          return "ri-book-line";
        default:
          return null;
      }
    },

    // 动态颜色
    logColorType(log) {
      const type = log.type;
      switch (type) {
        case "登录":
          return "color: green;";
        case "登出":
          return "color: orange;";
        case "注册":
          return "color: #00bfff;";
        case "注销":
          return "color: #ff0000;";
        case "更新":
          return "color: #ff00ff;";
        case "新增":
          return "color: limegreen;";
        case "删除":
          return "color: #ff0000;";
        case "借阅":
          return "color: #964B00;";
        case "归还":
          return "color: goldenrod;";
        default:
          return null;
      }
    },

    // 动态调整图表
    resizeCharts() {
      if (this.cpuChart) this.cpuChart.resize();
      if (this.memChart) this.memChart.resize();
      if (this.historyCountChart) this.historyCountChart.resize();
    },

    // 获取系统信息
    async getSystemInfo() {
      try {
        const response = await api.get(endpoints.systemInfo);
        this.systemInfo = response.data;
      } catch (error) {
        console.error("获取系统信息失败:", error);
      }
    },

    // 获取历史在线用户
    async getDailyUser() {
      try {
        const response = await api.get(endpoints.selectDailyUser);
        // console.log(response);
        const dailyUser = response.data.dailyUser;

        this.dailyUser = (dailyUser || []).sort((a, b) => {
          return new Date(a.sys_date) - new Date(b.sys_date);
        });

        if (this.dailyUser.length === 0) {
          this.alertMsg = "未找到任何在线用户记录";
        } else {
          // 获取数据后，历史在线表
          this.$nextTick(() => {
            this.initHistoryCountChart();
          });
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "获取历史在线数据失败";
      }
    },

    // 获取所有图书
    async selectBooks() {
      try {
        const response = await api.get(endpoints.selectBook);
        const books = response.data.books;
        this.books = books || [];

        if (this.books.length === 0) {
          this.alertMsg = "未找到任何图书记录";
        } else {
          // 获取数据后，更新分类占比表
          this.$nextTick(() => {
            // this.initBookMenusChart();
          });
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "获取图书数据失败";
      }
    },

    // 获取日志
    async selectLogs() {
      try {
        const response = await api.get(endpoints.selectLog);
        this.logs = response.data.log || [];
        this.logs.sort((a, b) => b.id - a.id);
        // 如果不为超级管理员，只显示借阅和归还日志
        if (this.userInfo.role != 0) {
          this.logs = this.logs.filter(
            (log) => log.type === "借阅" || log.type === "归还"
          );
        }
        if (this.logs.length === 0) {
          this.boxMsg = "未找到任何日志记录";
        }
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.boxMsg = "获取日志数据失败";
      }
    },

    // 格式化速度
    formatSpeed(speed) {
      if (isNaN(speed) || speed === undefined || speed === null || speed < 0) {
        return "获取中...";
      }
      if (speed < 1024 * 1024) {
        return `${(speed / 1024).toFixed(2)} Kb`;
      } else if (speed < 1024) {
        return `${(speed / 1024 / 1024).toFixed(2)} MB`;
      } else {
        return `${(speed / 1024 / 1024 / 1024).toFixed(2)} GB`;
      }
    },

    // 初始化历史用户登录统计图表
    initHistoryCountChart() {
      const chartContainer = this.$refs.historyCountChartContainer;
      this.historyCountChart = echarts.init(chartContainer);
      const data = this.dailyUser.map((item) => [
        new Date(item.sys_date),
        Number(item.user_count),
      ]);

      const option = {
        tooltip: {
          trigger: "axis",
          confine: true,
          position(pt) {
            return [pt[0], "10%"];
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: data.map((item) => {
            const date = new Date(item[0]);
            return `${date.getFullYear()}-${
              date.getMonth() + 1
            }-${date.getDate()}`;
          }),
          axisLabel: {
            formatter(value) {
              return value;
            },
          },
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          minInterval: 1,
        },
        series: [
          {
            name: "用户数量",
            type: "line",
            // smooth: true,
            symbol: "none",
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(84, 112, 198)",
                },
                {
                  offset: 1,
                  color: "rgb(1, 191, 236)",
                },
              ]),
            },
            data: data.map((item) => item[1]),
          },
        ],
      };

      this.historyCountChart.setOption(option);
    },

    // 初始化CPU图表
    initCpuChart() {
      const chartContainer = this.$refs.cpuChartContainer;
      this.cpuChart = echarts.init(chartContainer);

      const gaugeData = [
        {
          value: this.systemInfo.cpuUsage.usedPercentage,
          name: "CPU",
          title: {
            show: true,
            fontSize: 15,
            color: "hsl(230, 62%, 56%)",
          },
          detail: {
            show: true,
          },
        },
      ];

      const option = {
        series: [
          {
            type: "gauge",
            startAngle: 90,
            endAngle: -270,
            pointer: {
              show: false,
            },
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                borderWidth: 0,
                borderColor: "#464646",
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgb(84, 112, 198)",
                  },
                  {
                    offset: 1,
                    color: "rgb(1, 191, 236)",
                  },
                ]),
              },
            },
            axisLine: {
              lineStyle: {
                width: 20,
              },
            },
            splitLine: {
              show: false,
              distance: 0,
              length: 10,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
              distance: 50,
            },
            data: gaugeData,
            title: {
              show: true,
              fontSize: 20,
            },
            detail: {
              width: 40,
              height: 14,
              fontSize: 20,
              color: "hsl(230, 62%, 56%)",
              formatter: "{value}%",
              offsetCenter: ["0%", "0%"],
            },
          },
        ],
      };

      this.cpuChart.setOption(option);
    },

    // 更新CPU图表
    updateCpuChart() {
      this.cpuChart.setOption({
        series: [
          {
            data: [
              {
                value: this.systemInfo.cpuUsage.usedPercentage,
                name: "CPU",
                title: {
                  show: true,
                  fontSize: 15,
                  color: "hsl(230, 62%, 56%)",
                },
                detail: {
                  show: true,
                },
              },
            ],
          },
        ],
      });
    },

    // 初始化内存图表
    initMemChart() {
      const chartContainer = this.$refs.memChartContainer;
      this.memChart = echarts.init(chartContainer);

      const gaugeData = [
        {
          value: this.systemInfo.memoryUsage.usedPercentage,
          name: "MEM",
          title: {
            show: true,
            fontSize: 15,
            color: "hsl(230, 62%, 56%)",
          },
          detail: {
            show: true,
          },
        },
      ];

      const option = {
        series: [
          {
            type: "gauge",
            startAngle: 90,
            endAngle: -270,
            pointer: {
              show: false,
            },
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                borderWidth: 0,
                borderColor: "#464646",
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgb(84, 112, 198)",
                  },
                  {
                    offset: 1,
                    color: "rgb(1, 191, 236)",
                  },
                ]),
              },
            },
            axisLine: {
              lineStyle: {
                width: 20,
              },
            },
            splitLine: {
              show: false,
              distance: 0,
              length: 10,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
              distance: 50,
            },
            data: gaugeData,
            title: {
              show: true,
              fontSize: 20,
            },
            detail: {
              width: 40,
              height: 14,
              fontSize: 20,
              color: "hsl(230, 62%, 56%)",
              formatter: "{value}%",
              offsetCenter: ["0%", "0%"],
            },
          },
        ],
      };

      this.memChart.setOption(option);
    },
    // 更新内存图表
    updateMemChart() {
      this.memChart.setOption({
        series: [
          {
            data: [
              {
                value: this.systemInfo.memoryUsage.usedPercentage,
                name: "MEM",
                title: {
                  show: true,
                  fontSize: 15,
                  color: "hsl(230, 62%, 56%)",
                },
                detail: {
                  show: true,
                },
              },
            ],
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
.admin {
  height: 100%;
  width: 100%;
  z-index: 0;
  background: var(--background-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-body {
  position: fixed;
  height: 100%;
  width: 85%;
  left: 15%;
  transition: left 0.3s ease;
}

.home-body {
  position: fixed;
  left: 15%;
  height: 100%;
  width: 85%;
  padding: 20px;
  overflow-y: auto;
}

.dashboard {
  display: grid;
  grid-template-columns: 50% 23% 23%;
  grid-template-rows: 20% 40% 25%;
  gap: 20px;
  height: 100%;
}

.card {
  background-color: var(--body-color);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.card-title {
  display: flex;
  font-weight: var(--font-semi-bold);
  font-size: 20px;
  padding: 0 0 5px 0;
}

.card-body {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  padding: 0 5px 5px 0;
  width: 100%;
}

.card-body > * {
  margin-right: auto;
}

.card-form-item {
  width: 100%;
}

.card-form-count {
  font-weight: var(--font-semi-bold);
  position: sticky;
  font-size: 20px;
  color: var(--text-color);
  padding: 0 5px 5px 0;
}

h4 {
  color: var(--text-color);
}

.card-form-text {
  position: absolute;
  padding: 0 5px 5px 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 200px;
}

.sys-chart-container {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 450px;
  overflow: visible;
}

.history-count-chart-container {
  top: -30px;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 270px;
  overflow: visible;
}

/* .menu-chart-container {
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  overflow: visible;
} */

.log-chart-container {
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.log-box {
  margin-left: 7.5%;
}

.log-chart-container::-webkit-scrollbar {
  display: none;
}

.real-time-data {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

.cpu-data {
  grid-column: 2 / 3;
  grid-row: 1 / 3;
}

.book-data {
  grid-column: 3 / 4;
  grid-row: 1 / 3;
}

/* .book-type-ratio {
  grid-column: 1 / 4;
  grid-row: 3 / 4;
} */

.log-ratio {
  grid-column: 1 / 4;
  grid-row: 3 / 4;
}

.account-activity {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}

.log-form {
  position: absolute;
  display: flex;
  width: 100%;
  justify-content: center;
  font-size: 30px;
  color: var(--first-color);
  font-weight: var(--font-medium);
  top: 20px;
  z-index: 0;
}

.log-list {
  list-style: none;
  padding: 0;
}

.log-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  z-index: 1;
}

.log-item:hover {
  background-color: var(--background-color);
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
