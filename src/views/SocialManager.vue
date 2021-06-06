<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 平台管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                  <el-button type="primary" icon="el-icon-add" @click="handleAdd">新增</el-button>
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
                <el-table-column label="图标" align="center">
                  <template #default="scope">
                    <el-image
                        class="table-td-thumb"
                        :src="scope.row.img"
                        :preview-src-list="[scope.row.img]"
                    ></el-image>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="平台名称" align="center"></el-table-column>
                <el-table-column align="center" label="关联关系">
                    <template #default="scope">
                        {{ scope.row.relation === '0' ? '图片' : '链接'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
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
        <el-dialog title="新增" v-model="addVisible" width="30%" :before-close="handleDialogClose">
            <el-form ref="addForm" :model="form" label-width="70px">
                <el-form-item label="平台名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="平台图标">
                  <div class="crop-demo">
                    <img :src="cropImg" :class="preClass" />
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
                <el-form-item label="关联">
                  <el-select v-model="form.relation" placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleDialogClose">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>

      <!-- 编辑弹出框 -->
      <el-dialog title="编辑" v-model="editVisible" width="30%" :before-close="handleDialogClose">
        <el-form ref="form" :model="form" label-width="70px">
          <el-form-item label="平台名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="平台图标">
            <div class="crop-demo">
              <img :src="cropImg" class="pre-img" />
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
          <el-form-item label="关联">
            <el-select v-model="form.relation" placeholder="请选择">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleDialogClose">取 消</el-button>
                    <el-button type="primary" @click="updateEdit">确 定</el-button>
                </span>
        </template>
      </el-dialog>
    </div>
</template>

<script>
import { getSocialList, updateSocialStatus, addSocial } from "../api/SocialManager";
var currentVal = null;
export default {
    name: "social",
    data() {
        return {
            fullscreenLoading: false,
            options: [
                { value: '0', label: '图片' },
                { value: '1', label: '链接' }
            ],
            value: '',
            query: { userName: "", telphone: "", content: "", offset: 1, limit: 10, status:"" },
            tableData: [],
            editVisible: false,
            addVisible: false,
            pageTotal: 0,
            form: { unid: "", name: "", relation: "", status: "", img: "" },
            id: -1,
            updateQuery: { unid: "", status: "" },
            fileList: [],
            cropImg: "",
            preClass:""
        };
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
            let Base64 = require('js-base64').Base64;
            this.query.status = "0";
            getSocialList(this.query).then(res => {
                res.rows.forEach((item,index)=>{
                  item.index = index +1;
                  item.img = Base64.decode(item.img).indexOf('data:image/png;base64,') == -1 ? 'data:image/png;base64,' + item.img : Base64.decode(item.img);
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
        handleStatusChange(index,status,unid) {
            let msg = "确定要隐藏吗？";
            if(status == '1'){
                msg = "确认要显示吗？";
            }
            this.$confirm(msg, "提示", {
                type: "warning"
            }).then(() => {
                if(status == '0') {
                    this.updateQuery.status = '1';
                }else{
                    this.updateQuery.status = '0'
                }
                this.updateQuery.unid = unid;
                updateSocialStatus(this.updateQuery);
                this.getData();
            }).catch(() => {});
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
            this.addVisible = false;
            console.log(this.form);
            this.form.status = '0';
            this.form.img = this.cropImg;
            this.form.img = this.form.img.replace("data:image/png;base64,", "");
            addSocial(this.form).then(() => {
              this.getData();
            })
            this.$refs.addForm.resetFields();
        },
      // 保存编辑
        updateEdit() {
          this.editVisible = false;
          console.log(this.form);
          this.form.status = '0';
          this.form.img = this.cropImg;
          this.form.img = this.form.img.replace("data:image/png;base64,", "");
          updateSocialStatus(this.form).then(() => {
            this.getData();
          })
        },
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm("确定要删除吗？", "提示", {
                type: "warning"
            }).then(() => {
                this.updateQuery.unid = row.unid;
                this.updateQuery.status = "1";
                updateSocialStatus(this.updateQuery).then(() => {
                    this.$message.success("删除成功");
                    this.tableData.splice(index, 1);
                })
            }).catch(() => {});
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
            this.cropImg = event.target.result;
          };
          reader.readAsDataURL(file);
        },
        handleDialogClose(){
          this.form = {};
          this.addVisible = false;
          this.editVisible = false;
          this.cropImg = "";
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
