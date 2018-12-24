import AreaChart from 'components/AreaChart/index'; // echart组件
import * as api from 'api/monitor'
export default {
  name: "detail",
  components: {
    AreaChart
  },
  // computed: {
  //   act() {
  //     console.log(this.$store.getters)
  //     if (this.$store.getters.sysEchartsActIndex === '0') {
  //       return true
  //     } else {
  //       return false
  //     }
  //   }
  // },
  created() {
    this.id = this.$route.query.id // 获取传过来的服务ID
    api.getInstance({  // 信息列表的显示
      id: this.id
    }).then(data => {
      this.metadata = data[0].registration.metadata
      this.status = data[0].statusInfo.status
      this.name = data[0].registration.name
    })
    
    this.circleData() // 页面初始化调用一次，之后循环调用
    if (!this.queryTimer) {
      this.queryTimer = setInterval(() => {
        this.circleData()
      }, 20000)
    }
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
      // RESOURCESArr: [null, null, null],
      // SHIROArr: [null, null, null],
      processCPUUsage: '', // 进程CPU使用率
      systermCPUUsage: '', // 系统CPU使用率
      PID: '',
      UPTIME: '',
      CPUCOUNT: '',
      name: '',
      timer: null,
      queryTimer: null,
      errorObj: {
        gc: {
          show: false,
          message: '',
          title: 'Fetching GC metrics failed.'
        },
        process: {
          show: false,
          message: '',
          title: 'Fetching process metrics failed.'
        },
        threads: {
          show: false,
          message: '',
          title: 'Fetching threads metrics failed.'
        },
        heap: {
          show: false,
          message: '',
          title: 'Fetching heap metrics failed.'
        },
        noHeap: {
          show: false,
          message: '',
          title: 'Fetching noHeap metrics failed.'
        },
        // resources: {
        //   show: false,
        //   message: '',
        //   title: 'Fetching resources metrics failed.'
        // },
        // shiro: {
        //   show: false,
        //   message: '',
        //   title: 'Fetching shiro metrics failed.'
        // },
      }
    };
  },

  beforeDestroy() {
    window.clearInterval(this.timer)
    window.clearInterval(this.queryTimer)
  },
  methods: {
    formatTime(t) {
      // t = Math.round(t)
      let d = parseInt(t / 60 / 60 / 24)
      let h = parseInt(t / 60 / 60 % 24)
      let m = parseInt(t / 60 % 60)
      let s = parseInt(t % 60)
      return `${d}d ${h}h ${m}m ${s}s`
    },
    circleData() {
      // 初始化数据
      // 基础数据
      api.getPID({
        id: this.id,
      }).then(data => {
        this.PID = data.propertySources[0].properties.value.value
      })
      api.getDetail({
        id: this.id,
        type: 'system.cpu.count'
      }).then(data => {
        this.CPUCOUNT = data.measurements[0].value
      })
      api.getDetail({
        id: this.id,
        type: 'process.uptime'
      }).then(data => {
        this.timerValue = data.measurements[0].value
        this.UPTIME = this.formatTime(this.timerValue)
        if (!this.timer) {
          this.timer = setInterval(() => {
            this.timerValue++
            this.UPTIME = this.formatTime(this.timerValue)
          }, 1000)
        }
      })
      // 垃圾回收
      api.getDetail({
        id: this.id,
        type: 'jvm.gc.pause'
      }).then(data => {
        this.errorObj.gc.show = false
        this.gcObj.count = data.measurements[0].value
        this.gcObj.total = data.measurements[1].value.toFixed(2) + 's'
        this.gcObj.max = data.measurements[2].value.toFixed(2) + 's'
      }).catch((error) => {
        this.errorObj.gc.show = true
        this.errorObj.gc.message = error.message
      })
      // 进程信息
      api.getDetail({
        id: this.id,
        type: 'process.cpu.usage'
      }).then(data => {
        this.errorObj.process.show = false
        this.processCPUUsage = data.measurements[0].value.toFixed(2)
      }).catch((error) => {
        this.errorObj.process.show = true
        this.errorObj.process.message = error.message
      })
      api.getDetail({
        id: this.id,
        type: 'system.cpu.usage'
      }).then(data => {
        this.errorObj.process.show = false
        this.systermCPUUsage = data.measurements[0].value.toFixed(2)
      }).catch((error) => {
        this.errorObj.process.show = true
        this.errorObj.process.message = error.message
      })

      // 线程信息
      Promise.all([api.getDetail({
        id: this.id,
        type: 'jvm.threads.live'
      }), api.getDetail({
        id: this.id,
        type: 'jvm.threads.daemon'
      }), api.getDetail({
        id: this.id,
        type: 'jvm.threads.peak'
      })]).then((resArr) => {
        this.errorObj.threads.show = false
        this.threadsArr = resArr.map(data => data.measurements[0].value)
      }).catch((error) => {
        this.errorObj.threads.show = true
        this.errorObj.threads.message = error.message
      })

      

      // 堆内存信息
      Promise.all([api.getDetail({
        id: this.id,
        type: 'jvm.memory.used?tag=area:heap'
      }), api.getDetail({
        id: this.id,
        type: 'jvm.memory.committed?tag=area:heap'
      }), api.getDetail({
        id: this.id,
        type: 'jvm.memory.max?tag=area:heap'
      })]).then((resArr) => {
        this.errorObj.heap.show = false
        this.heapArr = resArr.map(data => Number((data.measurements[0].value / 10e8).toFixed(2)))
      }).catch((error) => {
        this.errorObj.heap.show = true
        this.errorObj.heap.message = error.message
      })

      // // 非堆内存信息
      Promise.all([api.getDetail({
        id: this.id,
        type: 'jvm.memory.used?tag=area:nonheap&id=Metaspace'
      }), api.getDetail({
        id: this.id,
        type: 'jvm.memory.used?tag=area:nonheap'
      }), api.getDetail({
        id: this.id,
        type: 'jvm.memory.committed?tag=area:nonheap'
      }), api.getDetail({
        id: this.id,
        type: 'jvm.memory.max?tag=area:nonheap'
      })]).then((resArr) => {
        this.errorObj.noHeap.show = false
        this.nonHeapArr = resArr.map(data => Number((data.measurements[0].value / 10e8).toFixed(2)))
      }).catch((error) => {
        this.errorObj.noHeap.show = true
        this.errorObj.noHeap.message = error.message
      })


      // 缓存 RESOURCES
      // api.getDetail({
      //   id: this.id,
      //   type: 'cache.gets?tag=name:RESOURCES,result:hit'
      // }).then((res) => {
      //   const { data, status } = res
      //   if (status === 200 && data) {
      // this.errorObj.resources.show = false
      //     this.$set(this.RESOURCESArr, 0, data.measurements[0].value)
      //   }
      // }).catch((error) => {
      //   this.errorObj.resources.show = true
      //   this.errorObj.resources.message = error.message
      // })
      // api.getDetail({
      //   id: this.id,
      //   type: 'cache.gets?tag=name:RESOURCES,result:miss'
      // }).then((res) => {
      //   const { data, status } = res
      //   if (status === 200 && data) {
      // this.errorObj.resources.show = false
      //     this.$set(this.RESOURCESArr, 1, data.measurements[0].value)
      //   }
      // }).catch((error) => {
      //   this.errorObj.resources.show = true
      //   this.errorObj.resources.message = error.message
      // })
      // api.getDetail({
      //   id: this.id,
      //   type: 'cache.size?tag=name:RESOURCES'
      // }).then((res) => {
      //   const { data, status } = res
      //   if (status === 200 && data) {
      // this.errorObj.resources.show = false
      //     this.$set(this.RESOURCESArr, 2, data.measurements[0].value)
      //   }
      // }).catch((error) => {
      //   this.errorObj.resources.show = true
      //   this.errorObj.resources.message = error.message
      // })
      // // 缓存 SHIRO
      // api.getDetail({
      //   id: this.id,
      //   type: 'cache.gets?tag=name:SHIRO,result:hit'
      // }).then((res) => {
      //   const { data, status } = res
      //   if (status === 200 && data) {
      // this.errorObj.shiro.show = false
      //     this.$set(this.SHIROArr, 0, data.measurements[0].value)
      //   }
      // }).catch((error) => {
      //   this.errorObj.shiro.show = true
      //   this.errorObj.shiro.message = error.message
      // })
      // api.getDetail({
      //   id: this.id,
      //   type: 'cache.gets?tag=name:SHIRO,result:miss'
      // }).then((res) => {
      //   const { data, status } = res
      //   if (status === 200 && data) {
      // this.errorObj.shiro.show = false
      //     this.$set(this.SHIROArr, 1, data.measurements[0].value)
      //   }
      // }).catch((error) => {
      //   this.errorObj.shiro.show = true
      //   this.errorObj.shiro.message = error.message
      // })
      // api.getDetail({
      //   id: this.id,
      //   type: 'cache.size?tag=name:SHIRO'
      // }).then((res) => {
      //   const { data, status } = res
      //   if (status === 200 && data) {
      // this.errorObj.shiro.show = false
      //     this.$set(this.SHIROArr, 2, data.measurements[0].value)
      //   }
      // }).catch((error) => {
      //   this.errorObj.shiro.show = true
      //   this.errorObj.shiro.message = error.message
      // })
    },

  }
};
