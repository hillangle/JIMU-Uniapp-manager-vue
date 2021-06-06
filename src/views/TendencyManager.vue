<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 动态管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                  <el-form-item label="昵称">
                    <el-input v-model="query.userName" placeholder="昵称" class="handle-input mr10"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号">
                    <el-input v-model="query.telphone" placeholder="手机号" class="handle-input mr10"></el-input>
                  </el-form-item>
                  <el-form-item label="内容">
                    <el-input v-model="query.content" placeholder="内容" class="handle-input mr10"></el-input>
                  </el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
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
                <el-table-column  label="ID" width="55" align="center">
                  <template #default="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column prop="userName" label="昵称">
                  <template #default="scope">
                    {{ scope.row.user.userName}}
                  </template>
                </el-table-column>
                <el-table-column prop="telphone" label="手机号">
                  <template #default="scope">
                    {{ scope.row.user.telphone}}
                  </template>
                </el-table-column>
                <el-table-column prop="group_name" label="兴趣小组"></el-table-column>
                <el-table-column prop="content" label="内容"></el-table-column>
                <el-table-column label="状态" align="center">
                  <template #default="scope">
                    <el-tag
                        :type="scope.row.status=='0' ? 'success' : scope.row.status === '1' ? 'danger' : ''"
                    >
                      {{ scope.row.status === '0' ? '正常' : scope.row.status === '1' ? '封号' : ''}}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createDate" label="发布时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button
                            type="text"
                            @click="detail(scope.$index, scope.row.unid)">
                          详情
                        </el-button>
                        <el-button
                            type="text"
                            :class="scope.row.status === '0' ? 'red' : 'green'"
                            @click="handleStatusChange(scope.$index, scope.row.status, scope.row.unid)"
                        >{{ scope.row.status === '0' ? '隐藏' : scope.row.status === '1' ? '显示' : ''}}</el-button>
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
        <!-- 详情弹出框 -->
        <el-dialog title="动态详情" v-model="detailVisible" width="80%" :before-close="handleDialogClose">
          <detail :unid ="unid" ref="detail"></detail>
          <template #footer>
                  <span class="dialog-footer">
                      <el-button @click="cancel">取 消</el-button>
                  </span>
          </template>
        </el-dialog>
    </div>
</template>

<script>
import $detail from "../views/TendencyDetail";
import { getTendencyList, updateTendencyStatus } from "../api/TendencyManager";
export default {
    name: "tendency",
    data() {
        return {
          fullscreenLoading: false,
          options: [{
            value: '0',
            label: '未知'
          }, {
            value: '1',
            label: '男'
          }, {
            value: '2',
            label: '女'
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
          detailVisible: false,
          pageTotal: 0,
          form: {},
          idx: -1,
          id: -1,
          updateQuery: {
            unid: "",
            status: ""
          },
          unid:""
        };
    },
    components: {
      "detail" : $detail
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
          this.fullscreenLoading = true;
          getTendencyList(this.query).then(res => {
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
              updateTendencyStatus(this.updateQuery).then(() => {
                this.getData();
              })

            })
            .catch(() => {});
        },
        // 编辑操作
        detail(index, row) {
            this.idx = index;
            this.unid = row;
            this.detailVisible = true;
            this.$refs.detail.getDetail(row);
        },
        cancel(){
            this.$refs.detail.clearDialog();
            this.detailVisible = false;
        },
        handleDialogClose(){
          this.$refs.detail.clearDialog();
          this.detailVisible = false;
        },
        // 分页导航
        handlePageChange(val) {
            this.query.pageIndex = val;
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
