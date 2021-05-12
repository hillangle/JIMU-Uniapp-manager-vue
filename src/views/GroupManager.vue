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
                  <el-button type="primary" icon="el-icon-search" @click="handleAdd">新增</el-button>
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-model="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="兴趣小组名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
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
          editVisible: false,
          pageTotal: 0,
          form: {name:"",status:""},
          id: -1,
          updateQuery: { unid: "", status: "" }
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
          this.editVisible = true;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.value = row.relation;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.form.status = "0";
            addGroup(this.form).then(() => {
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
            this.$set(this.query, "pageIndex", val);
            this.getData();
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
</style>
