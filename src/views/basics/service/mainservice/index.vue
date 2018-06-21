<template>
    <div>
        <el-col :span="24" class="opaPart">
            <el-radio-group v-model="radio3">
                <el-radio-button label="全部"></el-radio-button>
                <el-radio-button label="信息查询"></el-radio-button>
                <el-radio-button label="消息推送"></el-radio-button>
                <el-radio-button label="数据更新"></el-radio-button>
            </el-radio-group>
        </el-col>
        <el-col :span="24">
            <el-card class="box-card">
                <div class="fw-part-card">
                    <el-tag class="fw-part-tag" size="small">信息查询</el-tag>
                    <el-row class="fw-rowbox" :gutter="20">
                        <el-col :span="8">
                            <el-card class="box-card">
                                <div slot="header" class="box-card-header">
                                    学生分数查询                                
                                    <el-button class="box-card-hbtn" type="success" size="small" @click="toStudentInfo">查看</el-button>
                                </div>
                                <div class="fw-part-con">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut </div>
                                <div class="fw-part-foot">
                                    <div class="target">
                                        <i class=""></i>
                                        <span>天音智慧教育</span>
                                    </div>
                                    <div class="count">
                                        <i class="el-icon-view"></i>
                                        12345
                                    </div>
                                </div>    
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card class="box-card">
                                <div slot="header" class="box-card-header">
                                    学生分数查询                                
                                    <el-button class="box-card-hbtn" type="success" size="small" @click="toStudentInfo">查看</el-button>
                                </div>
                                <div class="fw-part-con">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut </div>
                                <div class="fw-part-foot">
                                    <div class="target">
                                        <i class=""></i>
                                        <span>天音智慧教育</span>
                                    </div>
                                    <div class="count">
                                        <i class="el-icon-view"></i>
                                        12345
                                    </div>
                                </div>    
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card class="box-card">
                                <div slot="header" class="box-card-header">
                                    学生分数查询                                
                                    <el-button class="box-card-hbtn" type="success" size="small" @click="toStudentInfo">查看</el-button>
                                </div>
                                <div class="fw-part-con">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut </div>
                                <div class="fw-part-foot">
                                    <div class="target">
                                        <i class=""></i>
                                        <span>天音智慧教育</span>
                                    </div>
                                    <div class="count">
                                        <i class="el-icon-view"></i>
                                        12345
                                    </div>
                                </div>    
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
                <div class="fw-part-card">
                    <el-tag class="fw-part-tag" size="small">信息查询</el-tag>
                    <el-row class="fw-rowbox" :gutter="20">
                        <el-col :span="8">
                            <el-card class="box-card">
                                <div slot="header" class="box-card-header">
                                    学生分数查询                                
                                    <el-button class="box-card-hbtn" type="success" size="small" @click="toStudentInfo">查看</el-button>
                                </div>
                                <div class="fw-part-con">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut </div>
                                <div class="fw-part-foot">
                                    <div class="target">
                                        <i class=""></i>
                                        <span>天音智慧教育</span>
                                    </div>
                                    <div class="count">
                                        <i class="el-icon-view"></i>
                                        12345
                                    </div>
                                </div>    
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card class="box-card">
                                <div slot="header" class="box-card-header">
                                    学生分数查询                                
                                    <el-button class="box-card-hbtn" type="success" size="small" @click="toStudentInfo">查看</el-button>
                                </div>
                                <div class="fw-part-con">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut </div>
                                <div class="fw-part-foot">
                                    <div class="target">
                                        <i class=""></i>
                                        <span>天音智慧教育</span>
                                    </div>
                                    <div class="count">
                                        <i class="el-icon-view"></i>
                                        12345
                                    </div>
                                </div>    
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card class="box-card">
                                <div slot="header" class="box-card-header">
                                    学生分数查询                                
                                    <el-button class="box-card-hbtn" type="success" size="small" @click="toStudentInfo">查看</el-button>
                                </div>
                                <div class="fw-part-con">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut </div>
                                <div class="fw-part-foot">
                                    <div class="target">
                                        <i class=""></i>
                                        <span>天音智慧教育</span>
                                    </div>
                                    <div class="count">
                                        <i class="el-icon-view"></i>
                                        12345
                                    </div>
                                </div>    
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
                <div class="fw-part-card">
                    <el-tag class="fw-part-tag" size="small">信息查询</el-tag>
                    <el-row class="fw-rowbox" :gutter="20">
                        <el-col :span="8">
                            <el-card class="box-card">
                                <div slot="header" class="box-card-header">
                                    学生分数查询                                
                                    <el-button class="box-card-hbtn" type="success" size="small" @click="toStudentInfo">查看</el-button>
                                </div>
                                <div class="fw-part-con">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut </div>
                                <div class="fw-part-foot">
                                    <div class="target">
                                        <i class=""></i>
                                        <span>天音智慧教育</span>
                                    </div>
                                    <div class="count">
                                        <i class="el-icon-view"></i>
                                        12345
                                    </div>
                                </div>    
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card class="box-card">
                                <div slot="header" class="box-card-header">
                                    学生分数查询                                
                                    <el-button class="box-card-hbtn" type="success" size="small" @click="toStudentInfo">查看</el-button>
                                </div>
                                <div class="fw-part-con">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut </div>
                                <div class="fw-part-foot">
                                    <div class="target">
                                        <i class=""></i>
                                        <span>天音智慧教育</span>
                                    </div>
                                    <div class="count">
                                        <i class="el-icon-view"></i>
                                        12345
                                    </div>
                                </div>    
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card class="box-card">
                                <div slot="header" class="box-card-header">
                                    学生分数查询                                
                                    <el-button class="box-card-hbtn" type="success" size="small" @click="toStudentInfo">查看</el-button>
                                </div>
                                <div class="fw-part-con">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut </div>
                                <div class="fw-part-foot">
                                    <div class="target">
                                        <i class=""></i>
                                        <span>天音智慧教育</span>
                                    </div>
                                    <div class="count">
                                        <i class="el-icon-view"></i>
                                        12345
                                    </div>
                                </div>    
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
        </el-col>
    </div>
</template>

<script>
export default {
    name:'mainservice',
    data() {
        return {
            radio3:''
        }
    },
    created(){
    },
    methods:{
        toStudentInfo () {
            this.$router.push('/service/studentinfo')
        }
    }
}
</script>