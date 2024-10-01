<template>
  <div class="admin">
    <div class="header">
      <HeaderGuide></HeaderGuide>
    </div>
    <div class="home-body">
      <div class="charts-container">
        <div class="chart" ref="userCountChartBox"></div>
        <div class="chart" ref="cpuUsageChartBox"></div>
        <div class="chart" ref="memoryUsageChartBox"></div>
      </div>
      <div class="system-info">
        <div class="cpu-info">
          <h2>CPU 信息</h2>
          <p>CPU 品牌: {{ systemInfo.cpuUsage.brand }}</p>
          <p>CPU 速度: {{ systemInfo.cpuUsage.speed }} GHz</p>
          <p>CPU 占用率: {{ systemInfo.cpuUsage.load }}%</p>
        </div>
        <div class="memory-info">
          <h2>内存信息</h2>
          <p>总内存: {{ formatMemory(systemInfo.memoryUsage.totalMemory) }}</p>
          <p>已用内存: {{ formatMemory(systemInfo.memoryUsage.usedMemory) }}</p>
          <p>内存占用率: {{ systemInfo.memoryUsage.usedPercentage }}%</p>
        </div>
      </div>
    </div>
    <router-view class="admin-body"></router-view>
    <LeftGuide class="left-guide-model"></LeftGuide>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderGuide from "@/components/HeaderGuide";
import LeftGuide from "@/components/LeftGuide";
import * as echarts from "echarts";
import axios from "axios";

export default {
  name: "AdminHome",

  data() {
    return {
      systemInfo: {
        cpuUsage: {
          brand: "",
          speed: 0,
          load: 0,
        },
        memoryUsage: {
          totalMemory: 0,
          usedMemory: 0,
          usedPercentage: 0,
        },
      },
      pollingInterval: null, // 存储轮询的定时器
    };
  },

  components: {
    HeaderGuide,
    LeftGuide,
  },

  created() {
    if (!this.userInfo.isAdmin) {
      this.$router.push("/home");
    }
    this.getSystemInfo();
  },

  mounted() {
    this.initCharts();
    this.updateBodyPosition(this.isLeftGuideVisible);
    this.pollingInterval = setInterval(() => {
      this.getSystemInfo();
    }, 1000);
  },

  beforeDestroy() {
    // 防止内存泄漏
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
    ...mapState("LeftGuide", ["isLeftGuideVisible"]),
    ...mapState("WebSocket", ["onlineUserCount"]),
  },

  watch: {
    isLeftGuideVisible(newVal) {
      this.updateBodyPosition(newVal);
    },
  },

  methods: {
    updateBodyPosition(isVisible) {
      this.$nextTick(() => {
        const adminBody = document.querySelector(".admin-body");
        const homeBody = document.querySelector(".home-body");
        if (adminBody) {
          adminBody.style.left = isVisible ? "15%" : "0";
          adminBody.style.width = isVisible ? "85%" : "100%";
        }
        if (homeBody) {
          homeBody.style.left = isVisible ? "15%" : "0";
          homeBody.style.width = isVisible ? "85%" : "100%";
        }
      });
    },

    async getSystemInfo() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/systemInfo"
        );
        this.systemInfo = response.data;
        this.updateCharts();
      } catch (error) {
        console.error("获取系统信息失败:", error);
      }
    },

    formatMemory(bytes) {
      const gb = bytes / (1024 * 1024 * 1024);
      return gb.toFixed(2) + " GB";
    },

    initCharts() {
      // 初始化在线用户图表
      this.userCountChart = echarts.init(this.$refs.userCountChartBox);
      this.userCountChart.setOption({
        tooltip: {
          formatter: "{a} <br/>{b} : {c}",
        },
        series: [
          {
            name: "在线用户",
            type: "gauge",
            progress: {
              show: true,
              itemStyle: {
                color: "#4960d4",
              },
            },
            detail: {
              valueAnimation: true,
              formatter: "{value}",
            },
            data: [
              {
                value: this.onlineUserCount,
                name: "Online Users",
              },
            ],
          },
        ],
      });

      // 初始化 CPU 使用率图表
      this.cpuUsageChart = echarts.init(this.$refs.cpuUsageChartBox);
      this.cpuUsageChart.setOption({
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%",
        },
        series: [
          {
            name: "CPU 占用率",
            type: "gauge",
            progress: {
              show: true,
              itemStyle: {
                color: "#4960d4",
              },
            },
            detail: {
              valueAnimation: true,
              formatter: "{value}%",
            },
            data: [
              {
                value: this.systemInfo.cpuUsage.load,
                name: "CPU Load",
              },
            ],
          },
        ],
      });

      // 初始化内存使用率图表
      this.memoryUsageChart = echarts.init(this.$refs.memoryUsageChartBox);
      this.memoryUsageChart.setOption({
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%",
        },
        series: [
          {
            name: "内存占用率",
            type: "gauge",
            progress: {
              show: true,
              itemStyle: {
                color: "#4960d4",
              },
            },
            detail: {
              valueAnimation: true,
              formatter: "{value}%",
            },
            data: [
              {
                value: this.systemInfo.memoryUsage.usedPercentage,
                name: "Memory Usage",
              },
            ],
          },
        ],
      });
    },

    updateCharts() {
      // 更新图表数据
      this.cpuUsageChart.setOption({
        series: [
          {
            data: [
              {
                value: this.systemInfo.cpuUsage.load,
                name: "CPU Load",
              },
            ],
          },
        ],
      });

      this.memoryUsageChart.setOption({
        series: [
          {
            data: [
              {
                value: this.systemInfo.memoryUsage.usedPercentage,
                name: "Memory Usage",
              },
            ],
          },
        ],
      });

      this.userCountChart.setOption({
        series: [
          {
            data: [
              {
                value: this.onlineUserCount,
                name: "Online Users",
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
  position: absolute;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 85%;
  left: 15%;
  transition: left 0.4s ease;
}

.charts-container {
  height: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.chart {
  width: 30%;
}

.system-info {
  height: 50%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  bottom: 50px;
  padding-bottom: 5%;
}

.cpu-info {
  height: 100%;
  width: 50%;
  margin: 10px;
  display: flex;
  background: var(--body-color);
  border-radius: 2px;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.memory-info {
  height: 100%;
  width: 50%;
  margin: 10px;
  display: flex;
  background: var(--body-color);
  border-radius: 2px;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
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
