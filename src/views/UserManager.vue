<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                  <el-form-item label="昵称">
                    <el-input v-model="query.userName" placeholder="昵称" class="handle-input mr10"></el-input>
                  </el-form-item>
                  <el-form-item label="性别">
                    <el-select v-model="query.sex" placeholder="请选择">
                      <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="手机号">
                    <el-input v-model="query.telphone" placeholder="手机号" class="handle-input mr10"></el-input>
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
                <el-table-column prop="userName" label="昵称"></el-table-column>
                <el-table-column label="性别" align="center">
                    <template #default="scope">
                      <el-tag
                          :type="scope.row.sex=='0' ? 'error' : scope.row.sex === '1' ? 'success' : scope.row.sex === '2' ? 'warning' : ''"
                      >
                        {{ scope.row.sex === '0' ||  scope.row.sex === null ? '未知' : scope.row.sex === '1' ? '男' : scope.row.sex === '2' ? '女' : '' }}
                      </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="telphone" label="手机号"></el-table-column>
                <el-table-column prop="birthday" label="出生日期"></el-table-column>
                <el-table-column prop="remark" label="签名"></el-table-column>
                <el-table-column prop="remark" label="兴趣小组"></el-table-column>
                <el-table-column label="状态" align="center">
                  <template #default="scope">
                    <el-tag
                        :type="scope.row.status=='0' ? 'success' : scope.row.status === '1' ? 'danger' : ''"
                    >
                      {{ scope.row.status === '0' ? '正常' : scope.row.status === '1' ? '封号' : ''}}
                    </el-tag>
                  </template>
                </el-table-column>

                <el-table-column prop="createDate" label="注册时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button
                            type="text"
                            :class="scope.row.status === '0' ? 'green' : 'red'"
                            @click="handleStatusChange(scope.$index, scope.row.status, scope.row.unid)"
                        >{{ scope.row.status === '0' ? '封号' : scope.row.status === '1' ? '恢复' : ''}}</el-button>
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
    </div>
</template>

<script>
import { getUserList, updateDataStatus } from "../api/UserManager";
export default {
    name: "user",
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
            sex: "",
            telphone: "",
            userRole: "ROLE_APPUSER",
            offset: 1,
            limit: 10
          },
          tableData: [],
          editVisible: false,
          pageTotal: 0,
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
          getUserList(this.query).then(res => {
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
          let msg = "确定要封号吗？";
          if(status == '1'){
            msg = "确认要恢复吗？";
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
              updateDataStatus(this.updateQuery);
              this.getData();
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
