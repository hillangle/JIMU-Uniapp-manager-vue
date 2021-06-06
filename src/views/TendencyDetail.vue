<template>
  <el-card>
    <el-row>
      <el-col>{{createDate}} 发布动态</el-col>
    </el-row>
    <el-row style="line-height: 100px;padding-top: 20px;">
      <el-col :span="3">
        <el-avatar
            class="md_headpic"
            :size="50"
            :src="userImg"
            @error="errorHandler"
          >
            <img :src="userImg" />
          </el-avatar>
      </el-col>
      <el-col :span="5">
        {{userName}}
      </el-col>
      <el-col :span="5">
        {{telphone}}
      </el-col>
      <el-col :span="11"></el-col>
    </el-row>
    <el-row>
      <el-col :span="3">
      </el-col>
      <el-col :span="21">
        {{content}}
      </el-col>
    </el-row>
    <el-row style="line-height: 100px;padding-top: 20px;">
      <el-col :span="3">
      </el-col>
      <el-col :span="21">
        <img class="photo" :src="photo.path" v-for="(photo,index) in photos" :key="index"/>
      </el-col>
    </el-row>
  </el-card>
  <el-scrollbar>
    <el-card>
      <el-row>
      <el-col>评论</el-col>
      </el-row>
      <el-row v-for="(comment,index) in comments" :key="index" style="line-height: 100px;padding-top: 20px;">
        <el-col :span="3">
        </el-col>
        <el-col :span="3">
          <el-avatar
              class="md_headpic"
              :size="50"
              :src="comment.commentUserImg"
              @error="errorHandler"
          >
            <img :src="comment.commentUserImg" />
          </el-avatar>
        </el-col>
        <el-col :span="5">
          {{comment.commentContent}}
        </el-col>
        <el-col :span="5">
          {{comment.commentCreateDate}}
        </el-col>
      </el-row>
    </el-card>
  </el-scrollbar>
</template>

<script>
import { getTendencyInfo } from "../api/TendencyManager";
export default {
    name: "tendencyDetail",
    props:["unid"],
    data() {
        return {
          createDate:'',
          userImg:'',
          userName:'',
          telphone:"",
          content:"",
          photos:[],
          comments:[],
          query:{
            unid:"",
            offset: 1,
            limit: 1
          }
        };
    },
  created() {
      this.getDetail(this.unid);
    },
    methods: {
        getDetail(unid) {
          this.query.unid = unid
          getTendencyInfo(this.query).then(res => {
            console.log(res.rows[0])
            this.createDate = res.rows[0].createDate;
            this.userImg = res.rows[0].user.userPhotos[0] == undefined ? '': res.rows[0].user.userPhotos[0].attaPath;
            this.userName = res.rows[0].user.userName;
            this.telphone = res.rows[0].user.telphone;
            this.content = res.rows[0].content;
            for(let i = 0; i < res.rows[0].attas.length; i++){
              this.photos.push({path: res.rows[0].attas[i].attaPath});
            }
            for(let j = 0; j < res.rows[0].discusses.length; j++){
              this.comments.push({
                commentUserImg:res.rows[0].discusses[j].user.userPhotos[0] == undefined ? '' : res.rows[0].discusses[j].user.userPhotos[0].attaPath,
                commentContent:res.rows[0].discusses[j].content,
                commentCreateDate:res.rows[0].discusses[j].createDate
              })
            }
          })
        },
        clearDialog() {
          this.createDate = "";
          this.userImg = "";
          this.userName = "";
          this.telphone = "";
          this.content = "";
          this.photos = [];
          this.comments = [];
        }
    }
};
</script>

<style scoped>
el-col {
  vertical-align: middle;
}

.photo {
  width: 120px;
  height: 120px;
}
</style>
