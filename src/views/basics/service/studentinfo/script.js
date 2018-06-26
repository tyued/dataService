
import * as api from 'api/service/dataservice/index';
import * as infoapi from 'api/service/studentinfo/index';
import * as dicty from 'api/dictionary';

export default {
  name:'studentinfo',
  data() {
      return {
          listLoading:true,
          type:'',                //1. HTTP API(rest)  2. WebService API   3.  通过数据源发布
          servId:'',
          detail:true,
          DetailQuery:{
              detail: true
          },
          infoData:[],            //详细信息
          servTypeList:[],        //服务分类
          valRate: 0,             //评分
          
          tabPosition: 'left',
          nozzinfoD:[],           //接口详细信息
  
      }
  },
  created(){ 
      this.type =  this.$route.query.type
      this.servId =  this.$route.query.servId
      this.DetailQuery.servId = this.servId
      this.getBaseData()
  },
  mounted() {
      this.init()       
  },
  watch: {
      // servTypeList(){
      //     this.init()
      // }
  },
  computed: {
  },
  methods:{
      init(){
          if(this.type=='1'){                 //HTTP API(rest)
              infoapi.getRest(this.DetailQuery).then(response => {
                  this.infoData = response.data
                  this.infoData.tagname = ''
                  var that = this
                  this.servTypeList.forEach(function(item,index){
                      if(that.infoData.tag == item.key){
                          that.infoData.tagname = item.value    
                      }
                  })
                  this.infoData.tagname = this.infoData.tagname ? this.infoData.tagname : '其他'
                  this.listLoading = false

              });         
          }

      },
      // 获取服务分类
      getBaseData(){
          var query = {group:'servType'}
          dicty.getBaseData(query).then(response => {
              this.servTypeList = response.data
          });         
          
      },
      
  }
};