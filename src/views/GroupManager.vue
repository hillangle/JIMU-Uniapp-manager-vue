<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 兴趣小组管理
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
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="index" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="兴趣小组名称" align="center"></el-table-column>
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
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="兴趣小组名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="兴趣小组图标">
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
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="兴趣小组名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="兴趣小组图标">
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
import { getGroupList, updateGroupStatus, addGroup } from "../api/GroupManager";
export default {
    name: "group",
    data() {
        return {
          fullscreenLoading: false,
          value: '',
          query: { status:"", offset: 1, limit: 10 },
          tableData: [],
          addVisible: false,
          editVisible: false,
          pageTotal: 0,
          form: {name:"",status:"", img: ""},
          id: -1,
          updateQuery: { unid: "", status: "" },
          cropImg: "",
          preClass:""
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
          this.fullscreenLoading = true;
          this.query.status = "0"
          getGroupList(this.query).then(res => {
                console.log(res);
                res.rows.forEach((item,index)=>{
                  item.index = index +1;
                })
                this.tableData = res.rows;
                this.pageTotal = res.total || 0;
                this.offset = res.offset || 1;
                this.fullscreenLoading = false;
            });
        },
        handleSearch() {
            this.getData();
        },
        handleAdd() {
          this.addVisible = true;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.cropImg = row.img;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.addVisible = false;
            this.form.status = "0";
            this.form.img = this.cropImg;
            this.form.img = this.form.img.replace("data:image/png;base64,", "");
            addGroup(this.form).then(() => {
              this.getData();
            })
        },// 保存编辑
        updateEdit() {
            this.editVisible = false;
            this.form.status = "0";
            this.form.img = this.cropImg;
            this.form.img = this.form.img.replace("data:image/png;base64,", "");
            updateGroupStatus(this.form).then(() => {
              this.getData();
            })
        },
        handleDelete(index,row) {
          // 二次确认删除
          this.$confirm("确定要删除吗？", "提示", {
            type: "warning"
          }).then(() => {
              this.updateQuery.unid = row.unid;
              this.updateQuery.status = "1";
              updateGroupStatus(this.updateQuery).then(() => {
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
          this.editVisible = false;
          this.addVisible = false;
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
