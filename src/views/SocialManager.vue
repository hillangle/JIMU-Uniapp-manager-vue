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
                  <el-button type="primary" icon="el-icon-search" @click="handleadd">新增</el-button>
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
                <el-table-column prop="unid" label="ID" width="55" align="center"></el-table-column>
                <el-table-column label="图标">
                  <template #default="scope">
                    <el-image
                        class="table-td-thumb"
                        :src="scope.row.img"
                        :preview-src-list="[scope.row.img]"
                    ></el-image>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="平台名称"></el-table-column>
                <el-table-column align="center" label="关联关系">
                  {{ scope.row.relation === '0' ? '图片' : '链接'}}
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-model="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="平台名称">
                    <el-input v-model="form.name"></el-input>
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
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { getSocialList, updateSocialStatus, addSocial } from "../api/SocialManager";
export default {
    name: "basetable",
    data() {
        return {
          fullscreenLoading: false,
          options: [{
            value: '0',
            label: '图片'
          }, {
            value: '1',
            label: '链接'
          }],
          value: '',
          query: {
            userName: "",
            telphone: "",
            content: "",
            offset: 1,
            limit: 10
          },
          tableData: [],
          multipleSelection: [],
          delList: [],
          editVisible: false,
          pageTotal: 0,
          form: {},
          idx: -1,
          id: -1,
          updateQuery: {
            unid: "",
            status: ""
          },
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
          this.fullscreenLoading = true;
          getSocialList(this.query).then(res => {
                console.log(res);
                this.tableData = res.rows;
                this.pageTotal = res.total || 0;
                this.offset = res.offset || 1;
                this.fullscreenLoading = false;
            });
        },
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
            })
            .then(() => {
              if(status == '0') {
                this.updateQuery.status = '1';
              }else{
                this.updateQuery.status = '0'
              }
              this.updateQuery.unid = unid;
              updateSocialStatus(this.updateQuery);
              this.getData();
            })
            .catch(() => {});
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
            addSocial(this.form).then(() => {
              this.$message.success(`修改第 ${this.idx + 1} 行成功`);
              this.$set(this.tableData, this.idx, this.form);
            })
        },
        handleDelete(index) {
          // 二次确认删除
          this.$confirm("确定要删除吗？", "提示", {
            type: "warning"
          })
              .then(() => {
                this.$message.success("删除成功");
                this.tableData.splice(index, 1);
              })
              .catch(() => {});
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
