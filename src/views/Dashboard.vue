<template>
    <div>
        <el-row :gutter="20" style="height: 350px;">
            <el-col :span="12">
                <el-row>
                    <el-col :span="24">
                        <el-card shadow="hover" class="mgb20">
                            <div class="user-info">
                                <img src="../assets/img/img.jpg" class="user-avator" alt />
                                <div class="user-info-cont">
                                    <div class="user-info-name">{{ name }}</div>
                                    <div>{{ role }}</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-user-solid grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">1234</div>
                                    <div>新增用户数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-message-solid grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">1234</div>
                                    <div>新增动态数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover" >
                   <template #header>
                        <div class="clearfix">
                            <span>通知公告</span>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="addNotic">添加</el-button>
                        </div>
                   </template>
                   <el-table :data="noticList" style="width:100%;height: 180px;" ref="multipleTable"
                              header-cell-class-name="table-header">
                        <el-table-column prop="index" label="序号"></el-table-column>
                        <el-table-column label="标题">
                            <template #default="scope">
                                <div class="todo-item" >
                                  {{ scope.row.title }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createDate" :formatter ="createDateFormat" align="createDate" label="发布时间"></el-table-column>
                        <el-table-column label="操作">
                            <template #default="scope">
                                <el-button
                                    type="text"
                                    :class="scope.row.status === '0' ? 'green' : 'red'"
                                    @click="handleStatusChange(scope.$index, scope.row.status, scope.row.unid)"
                                >{{ scope.row.status === '0' ? '下架' : scope.row.status === '1' ? '上架' : ''}}</el-button>
                            </template>
                        </el-table-column>
                   </el-table>
                   <div class="pagination">
                        <el-pagination
                            background
                            layout="total, prev, pager, next"
                            :current-page="query.offset"
                            :page-size="query.limit"
                            :total="pageTotal"
                            @current-change="handlePageChange"
                        ></el-pagination>
                   </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row>
        <!-- 新增弹出框 -->
        <el-dialog title="新增" v-model="addVisible" width="30%" :before-close="handleDialogClose">
            <el-form ref="addForm" :model="form" label-width="80px" :rules="rule">
                <el-form-item label="公告标题" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input type="textarea" v-model="form.content"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import Schart from "vue-schart";
import {getNoticList,updateNoticStatus,addNotic} from "../api/NoticManager";
var currentVal = null;

export default {
    name: "dashboard",
    data() {
        return {
            name: localStorage.getItem("ms_username"),
            noticList: [
            ],
            query:{
              offset: 1, limit: 2
            },
            updateQuery: {
              unid: "",
              status: ""
            },
            addVisible: false,
            form:{
              title:"",
              content:""
            },
            rule: {
              title: [
                {required: true, message: '请输入公告标题', trigger: 'blur'}
              ],
              content: [
                {required: true, message: '请输入公告内容', trigger: 'blur'}
              ]
            },
            options: {
                type: "bar",
                title: {
                    text: "用户活跃度"
                },
                xRorate: 25,
                labels: ["周一", "周二", "周三", "周四", "周五"],
                datasets: [
                    {
                      label: "家电",
                      data: [234, 278, 270, 190, 230]
                    },
                    {
                      label: "百货",
                      data: [164, 178, 190, 135, 160]
                    },
                    {
                      label: "食品",
                      data: [144, 198, 150, 235, 120]
                    }
                ]
            },
            options2: {
                type: "line",
                title: {
                    text: "激活码核销数"
                },
                labels: ["6月", "7月", "8月", "9月", "10月"],
                datasets: [
                    {
                      label: "家电",
                      data: [234, 278, 270, 190, 230]
                    },
                    {
                      label: "百货",
                      data: [164, 178, 150, 135, 160]
                    },
                    {
                      label: "食品",
                      data: [74, 118, 200, 235, 90]
                    }
                ]
            }
        };
    },
    components: {
        Schart
    },
    computed: {
        role() {
            return this.name === "admin" ? "超级管理员" : "普通用户";
        }
    },
    methods: {
        changeDate() {
          getNoticList(this.query).then(res => {
            res.rows.forEach((item, index) => {
              item.index = index + 1;
            })
            currentVal.noticList = res.rows; //将返回数据赋值给tableData = res.rows;
            this.pageTotal = res.total || 0;
            this.offset = res.offset || 1;
          });
        },
        createDateFormat(row) {
            var t = new Date(row.createDate)// row 表示一行数据, createTime 表示要格式化的字段名称
            if (!t) {
              return ''
            }
            let year = t.getFullYear()
            let month = this.dateIfAddZero(t.getMonth() + 1)
            let day = this.dateIfAddZero(t.getDate())
            return year + '-' + month + '-' + day
        },
        dateIfAddZero : function (time) {
          return time
        },
        handleStatusChange(index,status,unid){
          let msg = "确定要下架吗？";
          if(status == '1'){
            msg = "确认要上架吗？";
          }
          this.$confirm(msg, "提示", {
            type: "warning"
          })
              .then(() => {
                if(status == '0') {
                  this.updateQuery.status = '1';
                }else{
                  this.updateQuery.status = '0'
                }
                this.updateQuery.unid = unid;
                updateNoticStatus(this.updateQuery).then(() => {
                  this.changeDate();
                });

              })
              .catch(() => {});
        },
        addNotic() {
          this.addVisible = true;
        },
        saveEdit(){
          this.$refs.addForm.validate((valid) => {
            if (valid) {
              this.addVisible = false;
              this.form.status = '0';
              addNotic(this.form).then(() => {
                this.changeDate();
                this.form = {};
              })
              this.$refs.addForm.resetFields();
            }else{
              this.$message.error("请检查填写内容");
              return false;
            }
          })
        },
        // 分页导航
        handlePageChange(val) {
          this.query.pageIndex = val;
          this.changeDate();
        },
        handleDialogClose(){
          this.form = {};
          this.addVisible = false;
        }
    },
    created() {
      currentVal = this;//将this赋给变量在then()回调中使用
      this.changeDate();
    }
};
</script>

<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    /*border-bottom: 2px solid #ccc;*/
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 2px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>
