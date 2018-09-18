import PageBar from "components/PageBar/index"; // 分页组件
import AreaChart from 'components/AreaChart/index'; // echart组件
import * as api from 'api/monitor'
import FileSaver from "file-saver"; // 导出Excel
import XLSX from "xlsx"; // Excel
export default {
  name: "monitor",
  components: {
    PageBar,
    AreaChart
  },
  created() {
    this.id = this.$route.query.id // 获取传过来的服务ID
    api.getInstance({  // 信息列表的显示
      id: this.id
    }).then((res) => {
      const { status, data } = res
      if (status === 200 && data) {
        this.metadata = data[0].registration.metadata
        this.status = data[0].statusInfo.status
      }
    })

    this.circleData() // 页面初始化调用一次，之后循环调用
  },
  data() {
    return {
      id: '', // 服务id
      status: '', // 服务状态
      metadata: [], // 信息数组
      gcObj: { // 垃圾回收
        count: '',
        total: '',
        max: '',
      },
      threadsArr: [null, null, null],
      heapArr: [null, null, null],
      nonHeapArr: [null, null, null, null],
      RESOURCESArr: [null, null, null],
      SHIROArr: [null, null, null],
      processCPUUsage: 0, // 进程CPU使用率
      systermCPUUsage: 0, // 系统CPU使用率
      tabDateValue: "日报",
      currentPage4: 4,
      pickerOptions2: { // 日期选择器数据
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


  methods: {
    circleData() {
      // 初始化数据
      // 垃圾回收
      api.getDetail({
        id: this.id,
        type: 'jvm.gc.pause'
      }).then((res) => {
        const { data, status } = res
        if (status === 200 && data) {
          this.gcObj.count = data.measurements[0].value
          this.gcObj.total = data.measurements[1].value.toFixed(2) + 's'
          this.gcObj.max = data.measurements[2].value.toFixed(2) + 's'
        }
      }).catch((error) => {
        console.dir(error)
      })
      // 进程信息
      api.getDetail({
        id: this.id,
        type: 'process.cpu.usage'
      }).then((res) => {
        const { data, status } = res
        if (status === 200 && data) {
          this.processCPUUsage = data.measurements[0].value.toFixed(2)
        }
      })
      api.getDetail({
        id: this.id,
        type: 'system.cpu.usage'
      }).then((res) => {
        const { data, status } = res
        if (status === 200 && data) {
          this.systermCPUUsage = data.measurements[0].value.toFixed(2)
        }
      })
      // 线程信息
      api.getDetail({
        id: this.id,
        type: 'jvm.threads.live'
      }).then((res) => {
        const { data, status } = res
        if (status === 200 && data) {
          this.$set(this.threadsArr, 0, data.measurements[0].value)
        }
      })
      api.getDetail({
        id: this.id,
        type: 'jvm.threads.daemon'
      }).then((res) => {
        const { data, status } = res
        if (status === 200 && data) {
          this.$set(this.threadsArr, 1, data.measurements[0].value)
        }
      })
      api.getDetail({
        id: this.id,
        type: 'jvm.threads.peak'
      }).then((res) => {
        const { data, status } = res
        if (status === 200 && data) {
          this.$set(this.threadsArr, 2, data.measurements[0].value)
        }
      })

      // 堆内存信息
      api.getDetail({
        id: this.id,
        type: 'jvm.memory.used?tag=area:heap'
      }).then((res) => {
        const { data, status } = res
        if (status === 200 && data) {
          this.$set(this.heapArr, 0, Number((data.measurements[0].value / 10e8).toFixed(2)))
        }
      })
      api.getDetail({
        id: this.id,
        type: 'jvm.memory.committed?tag=area:heap'
      }).then((res) => {
        const { data, status } = res
        if (status === 200 && data) {
          this.$set(this.heapArr, 1, Number((data.measurements[0].value / 10e8).toFixed(2)))
        }
      })
      api.getDetail({
        id: this.id,
        type: 'jvm.memory.max?tag=area:heap'
      }).then((res) => {
        const { data, status } = res
        if (status === 200 && data) {
          this.$set(this.heapArr, 2, Number((data.measurements[0].value / 10e8).toFixed(2)))
        }
      })
      // 非堆内存信息
      api.getDetail({
        id: this.id,
        type: 'jvm.memory.used?tag=area:nonheap&id=Metaspace'
      }).then((res) => {  
        const {data, status} = res
        if (status === 200 && data) {
          this.$set(this.nonHeapArr, 0, Number((data.measurements[0].value / 10e8).toFixed(2)))
        }
      })
      api.getDetail({
        id: this.id,
        type: 'jvm.memory.used?tag=area:nonheap'
      }).then((res) => {  
        const {data, status} = res
        if (status === 200 && data) {
          this.$set(this.nonHeapArr, 1, Number((data.measurements[0].value / 10e8).toFixed(2)))
        }
      })
      api.getDetail({
        id: this.id,
        type: 'jvm.memory.committed?tag=area:nonheap'
      }).then((res) => {  
        const {data, status} = res
        if (status === 200 && data) {
          this.$set(this.nonHeapArr, 2, Number((data.measurements[0].value / 10e8).toFixed(2)))
        }
      })
      api.getDetail({
        id: this.id,
        type: 'jvm.memory.max?tag=area:nonheap'
      }).then((res) => {  
        const {data, status} = res
        if (status === 200 && data) {
          this.$set(this.nonHeapArr, 3, Number((data.measurements[0].value / 10e8).toFixed(2)))
        }
      })
      // 缓存 RESOURCES
      api.getDetail({
        id: this.id,
        type: 'cache.gets?tag=name:RESOURCES,result:hit'
      }).then((res) => {  
        const {data, status} = res
        if (status === 200 && data) {
          this.$set(this.RESOURCESArr, 0, data.measurements[0].value)
        }
      })
      api.getDetail({
        id: this.id,
        type: 'cache.gets?tag=name:RESOURCES,result:miss'
      }).then((res) => {  
        const {data, status} = res
        if (status === 200 && data) {
          this.$set(this.RESOURCESArr, 1, data.measurements[0].value)
        }
      })
      api.getDetail({
        id: this.id,
        type: 'cache.size?tag=name:RESOURCES'
      }).then((res) => {
        const {data, status} = res
        if (status === 200 && data) {
          this.$set(this.RESOURCESArr, 2, data.measurements[0].value)
        }
      })
      // 缓存 SHIRO
      api.getDetail({
        id: this.id,
        type: 'cache.gets?tag=name:SHIRO,result:hit'
      }).then((res) => {  
        const {data, status} = res
        if (status === 200 && data) {
          this.$set(this.SHIROArr, 0, data.measurements[0].value)
        }
      })
      api.getDetail({
        id: this.id,
        type: 'cache.gets?tag=name:SHIRO,result:miss'
      }).then((res) => {  
        const {data, status} = res
        if (status === 200 && data) {
          this.$set(this.SHIROArr, 1, data.measurements[0].value)
        }
      })
      api.getDetail({
        id: this.id,
        type: 'cache.size?tag=name:SHIRO'
      }).then((res) => {
        const {data, status} = res
        if (status === 200 && data) {
          this.$set(this.SHIROArr, 2, data.measurements[0].value)
        }
      })
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
