import echarts from "echarts";
import PageBar from "components/PageBar/index"; // 分页组件
import * as api from 'api/monitor'
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { debounce } from 'utils';
export default {
  name: "monitor",
  components: {
    PageBar
  },
  async created() {
    this.id = this.$route.query.id
    let res = await api.getOneInstance({
      id: this.id
    })
    const {status, data} = res
    if (status === 200 && data) {
      this.metadata = data[0].registration.metadata
      this.status = data[0].statusInfo.status
    }
    await this.circleData()
  },
  data() {
    return {
      id: '', // 服务id
      status: '', // 服务状态
      metadata: [], // 信息数组
      gcList: [], // 垃圾回收
      tabDateValue: "日报",
      currentPage4: 4,
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value7: "",
      inputValue: "",
      chart: null,
      activeName: "first",
      radio3: "当日分时统计",
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎是",
          address: "423423423"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "432424"
        },
        {
          date: "2016-05-01",
          name: "王小虎是",
          address: "23424"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "24"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "24"
        }
      ],
    };
  },
  mounted() {
    this.init();
    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
      if (this.chart) {
          this.chart.resize()
      }
      }, 100)
      window.addEventListener('resize', this.__resizeHanlder)
    }

    // 监听侧边栏的变化
    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
  },
  beforeDestroy() {
    // 解除echarts调用
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
        window.removeEventListener('resize', this.__resizeHanlder)
    }

    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    async circleData() {
      // 初始化数据
      // 垃圾回收
      let res = await api.getGc({
        id: this.id
      })
      const {data, status} = res
      if (status === 200 && data) {
        this.gcList = data.measurements
      }
      // 
    },
    init() {
      // 所有echarts初始化

      this.initChart();
    },
    initChart() {
      this.chart = echarts.init(this.$refs.monitorEcharts, "macarons");
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        color: ["#209cee", "#42d3a5", "#ffdd57"],
        legend: {
          data: ["LIVE: 63", "DAEMON: 63", "PEAK LIVE: 63"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["14:00:00", "14:30:00", "15:00:00", "15:30:00", "16:00:00"]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "LIVE: 63",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            // smooth: true,
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "DAEMON: 63",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            // smooth: true,
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "PEAK LIVE: 63",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            // smooth: true,
            data: [150, 232, 201, 154, 190, 330, 410]
          }
        ]
      });
    },
    handleCurrentPage(number) {
      // 点击页码
      this.getPublicBookList(number);
      this.CurrentPage = number;
    },
    handleCurrentPageSize(number) {
      // 选择每页条数
      this.size = number;
      this.getPublicBookList(1, number);
      this.CurrentPage = 1;
    },
    handleTabClick(tab, event) {
      // console.log(tab, event);
    },
    outputExcel() {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "导出表格.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    }
  }
};
