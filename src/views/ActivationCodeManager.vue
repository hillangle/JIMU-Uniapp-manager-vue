<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 激活码管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                  <el-form-item label="状态">
                    <el-select v-model="query.status" placeholder="请选择">
                      <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                  <el-button type="primary" icon="el-icon-edit" @click="addVisible = true">新增</el-button>
                  <el-button type="primary" icon="el-icon-search" @click="handleExport">导出</el-button>
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
              <el-table-column
                  type="selection"
                  width="55">
              </el-table-column>
              <el-table-column  label="ID" width="55" align="center">
                <template #default="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
                <el-table-column prop="code" label="激活码"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template #default="scope">
                      <el-tag
                          :type="scope.row.status=='0' ? 'error' : scope.row.status === '1' ? 'success' : scope.row.status === '2' ? 'warning' : 'error'"
                      >
                        {{ scope.row.status === '0' ||  scope.row.status === null ? '未导出' : scope.row.status === '1' ? '未激活' : scope.row.status === '2' ? '已激活' : '异常' }}
                      </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createDate" label="创建时间"></el-table-column>
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
        <el-dialog title="新增" v-model="addVisible" width="30%" :before-close="handleDialogClose">
            <el-form ref="addForm" :model="form" label-width="120px">
              <el-form-item label="生成激活码数量">
                <el-input v-model="form.num"></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="addVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleAdd">生成</el-button>
                    </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { getActivationCodeList, addActivationCode, exportActivationCode } from "../api/ActivationCodeManager";
export default {
    name: "activationCode",
    data() {
        return {
            fullscreenLoading: false,
            options: [{
              value: '',
              label: '请选择'
            },{
              value: '0',
              label: '未导出'
            }, {
              value: '1',
              label: '未激活'
            }, {
              value: '2',
              label: '已激活'
            }],
            query: {
              offset: 1,
              limit: 10
            },
            tableData: [],
            addVisible: false,
            pageTotal: 0,
            form:{},
            unids:[]
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
          this.fullscreenLoading = true;
          getActivationCodeList(this.query).then(res => {
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
        handleAdd() {
            addActivationCode(this.form).then(() => {
                this.getData();
                this.form = {};
                this.addVisible = false;
            })
        },
        handleExport(){
            console.log(this.unids)
          // eslint-disable-next-line no-unused-vars
            var activationCodes = "";
            for(let i = 0; i < this.unids.length; i++){
               activationCodes += this.unids[i] + ','
            }
            exportActivationCode({"unids":activationCodes}).then(res => {
                this.getData();
                this.binaryDownload(res);
            })
        },
        // 分页导航
        handlePageChange(val) {
          this.query.pageIndex = val;
          this.getData();
        },
        handleSelectionChange(val) {
            this.unids = []
            for(let i = 0; i < val.length; i++){
                this.unids.push(val[i].unid)
            }
        },
        binaryDownload(res){
           // let contentDisposition = res.headers['content-disposition']; // 从Response Headers中获取content-disposition的值, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
            //let patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*'); // 设置正则表达式匹配格式
            // let patt = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/; // 设置正则表达式匹配格式
           // let result = patt.exec(contentDisposition); // 通过正则表达式提取“filename=” 后的值
            let filename = "excel.xls"; // 提取文件名
            // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
            if (typeof window.navigator.msSaveBlob !== 'undefined') {
                window.navigator.msSaveBlob(res, decodeURI(filename))
            }else{
                const blobURL = window.URL.createObjectURL(res); // 把blob转化为一个Blob URL
                const aLink = document.createElement('a'); // 创建a标签，用于跳转至下载链接
                aLink.href = blobURL; // 设置a标签href值
                aLink.setAttribute('download', filename); // 设置下载文件名称
                // 兼容：某些浏览器不支持HTML5的download属性
                if (typeof aLink.download === 'undefined') {
                    aLink.setAttribute('target', '_blank')
                }
                aLink.style.display = 'none'; // 隐藏a标签
                document.body.appendChild(aLink); // a标签插入到body中
                aLink.click(); // 模拟a标签点击事件 使其下载
                document.body.removeChild(aLink); // 移除a标签
                window.URL.revokeObjectURL(res); //释放掉blob对象
            }
        },
        handleDialogClose(){
            this.form = {};
            this.addVisible = false;
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
