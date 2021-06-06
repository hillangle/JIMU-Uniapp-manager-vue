<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 活动管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                  <el-button type="primary" icon="el-icon-edit" @click="handleAdd">新增</el-button>
                </el-form>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                v-loading.fullscreen.lock="fullscreenLoading"
            >
                <el-table-column prop="index" label="ID" width="55" align="center"></el-table-column>
                <el-table-column label="封面" align="center">
                  <template #default="scope">
                    <el-image
                        class="table-td-thumb"
                        :src="scope.row.img"
                    ></el-image>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="活动名称" align="center"></el-table-column>
                <el-table-column prop="startTime" :formatter ="startTimeFormat" align="startTime" label="报名时间"></el-table-column>
                <el-table-column prop="endTime" :formatter ="endTimeFormat" align="endTime" label="截止时间"></el-table-column>
                <el-table-column prop="createDate" :formatter ="createDateFormat" align="createDate" label="创建时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button
                            type="text"
                            @click="handleEdit(scope.$index, scope.row)"
                        >详情</el-button>
                        <el-button
                            type="text"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
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
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="新增" v-model="addVisible" width="80%" :before-close="handleDialogClose">
            <el-form ref="addForm" :model="form" label-width="100px" :rules="rule">
              <el-form-item label="封面" prop="img">
                <div class="crop-demo">
                  <img :src="form.img" :class="preClass" />
                  <div class="crop-demo-btn">
                    选择图片
                    <input
                        class="crop-input"
                        type="file"
                        name="image"
                        accept="image/*"
                        @change="setImage"
                    />
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="活动名称" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="活动介绍" prop="content">
                <el-input type="textarea" v-model="form.content"></el-input>
              </el-form-item>
              <el-form-item label="活动地址" prop="address">
                <el-input type="textarea" v-model="form.address"></el-input>
              </el-form-item>
<!--              <el-form-item label="活动详情" prop="address">
                <quill-editor ref="text" v-model="form.content" class="myQuillEditor" :options="editorOption" />
              </el-form-item>-->
              <el-form-item label="活动时间" prop="activeTime">
                <el-date-picker
                    v-model="form.activeTime"
                    type="datetime"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期时间"
                    align="right"
                    :picker-options="pickerOptions1">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="报名开始" prop="startTime">
                <el-date-picker
                    v-model="form.startTime"
                    type="datetime"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期时间"
                    align="right"
                    :picker-options="pickerOptions1">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束日期" prop="endTime">
                <el-date-picker
                    v-model="form.endTime"
                    type="datetime"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期时间"
                    align="right"
                    :picker-options="pickerOptions1">
                </el-date-picker>
              </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>

      <!-- 编辑弹出框 -->
      <el-dialog title="编辑" v-model="editVisible" width="80%" :before-close="handleDialogClose">
        <el-form ref="editForm" :model="form" label-width="70px" :rules="rule">
          <el-form-item label="封面">
            <div class="crop-demo">
              <img :src="form.img" class="pre-img" />
              <div class="crop-demo-btn">
                选择图片
                <input
                    class="crop-input"
                    type="file"
                    name="image"
                    accept="image/*"
                    @change="setImage"
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item label="活动名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="活动详情" prop="content">
            <el-input type="textarea" v-model="form.content"></el-input>
          </el-form-item>
          <el-form-item label="活动地址" prop="address">
            <el-input type="textarea" v-model="form.address"></el-input>
          </el-form-item>
          <el-form-item label="活动时间" prop="activeTime">
              <el-date-picker
                  v-model="form.activeTime"
                  type="datetime"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期时间"
                  align="right"
                  :picker-options="pickerOptions1">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="报名开始" prop="startTime">
              <el-date-picker
                  v-model="form.startTime"
                  type="datetime"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期时间"
                  align="right"
                  :picker-options="pickerOptions1">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期" prop="endTime">
              <el-date-picker
                  v-model="form.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期时间"
                  align="right"
                  :picker-options="pickerOptions1">
              </el-date-picker>
            </el-form-item>
        </el-form>
        <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateEdit">确 定</el-button>
                </span>
        </template>
      </el-dialog>
    </div>
</template>

<script>
import { getActivityList, updateActivityStatus, addActivity } from "../api/ActivityManager";

var currentVal = null;
export default {
    name: "activity",
    data() {
        return {
            fullscreenLoading: false,
            rule: {
              img:[
                {required: true, message: '请上传活动封面', trigger: 'blur' }
              ],
              name:[
                {required: true, message: '请输入活动名称', trigger: 'blur' }
              ],
              content:[
                {required: true, message: '请输入活动详情', trigger: 'blur' }
              ],
              address:[
                {required: true, message: '请输入活动地址', trigger: 'blur' }
              ],
              activeTime:[
                {required: true, message: '请选择活动时间', trigger: 'blur' }
              ],
              startTime:[
                {required: true, message: '请选择报名开始时间', trigger: 'blur' }
              ],
              endTime:[
                {required: true, message: '请选报名结束动时间', trigger: 'blur' }
              ]
            },
            value: '',
            query: { userName: "", telphone: "", content: "", offset: 1, limit: 10, status:"" },
            tableData: [],
            editVisible: false,
            addVisible: false,
            pageTotal: 0,
            form: { unid: "", name: "", status: "", img: "" },
            id: -1,
            updateQuery: { unid: "", status: "" },
            fileList: [],
            pickerOptions1: {
              shortcuts: [{
                text: '今天',
                onClick(picker) {
                  picker.$emit('pick', new Date());
                }
              }, {
                text: '昨天',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24);
                  picker.$emit('pick', date);
                }
              }, {
                text: '一周前',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', date);
                }
              }],
              preClass:""
            }
        }
    },
    created() {
        currentVal = this;//将this赋给变量在then()回调中使用
        this.getData();
    },
    computed: {
    },
    methods: {
      //获取列表数据
      getData() {
        this.fullscreenLoading = true;
        // let Base64 = require('js-base64').Base64;
        this.query.status = "0";
        getActivityList(this.query).then(res => {
          res.rows.forEach((item, index) => {
            item.index = index + 1;
            item.img = 'data:image/png;base64,' + item.img;
          })
          currentVal.tableData = res.rows; //将返回数据赋值给tableData = res.rows;
          this.pageTotal = res.total || 0;
          this.offset = res.offset || 1;
          this.fullscreenLoading = false;
        });
      },
      //搜索按钮
      handleSearch() {
        this.getData();
      },
      handleAdd() {
        this.addVisible = true;
      },
      // 编辑操作
      handleEdit(index, row) {
        this.form = row;
        this.cropImg = row.img;
        this.editVisible = true;
      },
      // 保存编辑
      saveEdit() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.addVisible = false;
            this.form.status = '0';
            this.form.activeTime = this.rTime(this.form.activeTime);
            this.form.startTime = this.rTime(this.form.startTime);
            this.form.endTime = this.rTime(this.form.endTime);
            this.form.img = this.form.img.replace("data:image/png;base64,", "");
            addActivity(this.form).then(() => {
              currentVal.tableData = [];
              this.getData();
              this.form = {};
              this.preClass = "";
            })
            this.form = null;
          }else{
            this.$message.error("请检查填写内容");
            return false;
          }
        })
      },
      // 保存编辑
      updateEdit() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.editVisible = false;
            this.form.status = '0';
            this.form.activeTime = this.rTime(this.form.activeTime);
            this.form.startTime = this.rTime(this.form.startTime);
            this.form.endTime = this.rTime(this.form.endTime);
            this.form.img = this.form.img.replace("data:image/png;base64,", "");
            updateActivityStatus(this.form).then(() => {
              this.getData();
              this.form = {};
            })
            this.form = {};
            this.preClass = "";
          } else {
            this.$message.error("请检查填写内容");
            return false;
          }
        })
      },
      handleDelete(index, row) {
        // 二次确认删除
        this.$confirm("确定要删除吗？", "提示", {
          type: "warning"
        }).then(() => {
          this.updateQuery.unid = row.unid;
          this.updateQuery.status = "1";
          updateActivityStatus(this.updateQuery).then(() => {
            this.$message.success("删除成功");
            this.tableData.splice(index, 1);
          })
        }).catch(() => {
        });
      },
      // 分页导航
      handlePageChange(val) {
        this.query.pageIndex = val;
        this.getData();
      },
      setImage(e) {
        const file = e.target.files[0];
        if (!file.type.includes("image/")) {
          return;
        }
        const reader = new FileReader();
        reader.onload = event => {
          this.preClass = "pre-img";
          this.form.img = event.target.result;
        };
        reader.readAsDataURL(file);
      },
      rTime(date) {
        var json_date = new Date(date).toJSON();
        return new Date(+new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      },
      startTimeFormat(row) {
        var t = new Date(row.startTime)// row 表示一行数据, createTime 表示要格式化的字段名称
        if (!t) {
          return ''
        }
        let year = t.getFullYear()
        let month = this.dateIfAddZero(t.getMonth() + 1)
        let day = this.dateIfAddZero(t.getDate())
        // let hours = this.dateIfAddZero(t.getHours())
        // let minutes = this.dateIfAddZero(t.getMinutes())
        // let seconds = this.dateIfAddZero(t.getSeconds())
        return year + '-' + month + '-' + day
      },
      endTimeFormat(row) {
        var t = new Date(row.endTime)// row 表示一行数据, createTime 表示要格式化的字段名称
        if (!t) {
          return ''
        }
        let year = t.getFullYear()
        let month = this.dateIfAddZero(t.getMonth() + 1)
        let day = this.dateIfAddZero(t.getDate())
        // let hours = this.dateIfAddZero(t.getHours())
        // let minutes = this.dateIfAddZero(t.getMinutes())
        // let seconds = this.dateIfAddZero(t.getSeconds())
        return year + '-' + month + '-' + day
      },
      createDateFormat(row) {
        var t = new Date(row.createDate)// row 表示一行数据, createTime 表示要格式化的字段名称
        if (!t) {
          return ''
        }
        let year = t.getFullYear()
        let month = this.dateIfAddZero(t.getMonth() + 1)
        let day = this.dateIfAddZero(t.getDate())
        // let hours = this.dateIfAddZero(t.getHours())
        // let minutes = this.dateIfAddZero(t.getMinutes())
        // let seconds = this.dateIfAddZero(t.getSeconds())
        return year + '-' + month + '-' + day
      },
      dateIfAddZero : function (time) {
        return time
      },
      handleDialogClose(){
        this.form = {};
        this.addVisible = false;
        this.editVisible = false;
      }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.green {
  color: #08ff00;
}
.mr10 {
    margin-right: 10px;
}
.ore-img {
  width: 100px;
  height: 142px;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.crop-demo {
  display: flex;
  align-items: flex-end;
}
.crop-demo-btn {
  position: relative;
  width: 100px;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  margin-left: 30px;
  background-color: #409eff;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  box-sizing: border-box;
}
.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
.pre-img{
  height: 100px;
  width: 100px;
}
</style>
