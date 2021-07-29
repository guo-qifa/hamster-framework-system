<!--
 * @Descripttion: 
 * @Author: liuYaoYu
 * @Date: 2021-03-04 15:23:44
 * @LastEditors: liuYaoYu
 * @LastEditTime: 2021-07-10 15:50:26
-->
<template>
  <BubbleLayout :menu="menu" :username="username">
    <router-view />
    <template slot="footer">
      <p class="text-center">© 2020 江苏瑞丰信息技术股份有限公司 Copyright</p>
    </template>
    <el-drawer
      :visible.sync="$store.state.noticeShow"
      size="400px"
      class="drawerBox"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="first">
          <el-card class="box-card" v-for="j in 4" :key="j">
            <div v-for="o in 4" :key="o" class="text item">
              {{ "列表内容 " + o }}
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="second">
          <el-button   v-for="j in 4" :key="j" plain @click="open2"> 不会自动关闭 </el-button>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </BubbleLayout>
</template>

<script>
import { getToken } from "@/utils";
// import {} from '@'
import axios from "axios";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      activeName: "first",
      menu: [],
      drawer: false,
      username: "",
    };
  },

  methods: {
     open2() {
        this.$notify({
          title: '警告',
          message: '这是一条警告的提示消息',
          type: 'warning'
        });
      },
    handleClick(tab, event) {
      debugger;
      console.log(tab, event);
    },
    async initMenu() {
      const o = await axios({
        url: "https://yzanjian.rfyfb.com/system/user/listCurrentAuthorizedMenu",
        headers: {
          loginTokensAnjian: getToken``,
        },
      });
      let index = o.data.object.findIndex((i) => {
        return i.name == "企业风险管控子系统";
      });
      window.localStorage.setItem(
        "companyRiskSubsystem",
        JSON.stringify(o.data.object[index].children)
      );
      var rs = [];
      var menu = JSON.parse(
        window.localStorage.getItem("companyRiskSubsystem")
      );
      for (let i = 0; i < menu.length; i++) {
        if (menu[i].children.length) {
          //有子节点的导航
          rs.push({
            title: menu[i].name,
            icon: "el-icon-user",
            children: [],
            url: menu[i].url,
          });
          rs[rs.length - 1].children = this.menuHelp(menu[i].children);
        } else {
          //无子节点的导航
          rs.push({
            title: menu[i].name,
            icon: "el-icon-user",
            path: "/" + menu[i].url,
            query: { id: menu[i].id },
            url: menu[i].url,
          });
        }
      }
      debugger;
      this.menu = rs;
    },
    menuHelp(v) {
      var rs = [];
      for (let i = 0; i < v.length; i++) {
        rs.push({
          title: v[i].name,
          path: "/" + v[i].url,
          query: { id: v[i].id },
        });
      }
      return rs;
    },
  },
  created() {
    this.$bubble.subscribe("loginout", () => {
      setTimeout(() => {
        this.$router.push("/login");
      }, 500);
    });
    this.username = localStorage.getItem("userName") || ""; //初始化右上角用户名
    this.initMenu(); //初始化左侧导航菜单
  },
  watch: {},
};
</script>

<style lang="less">
.home {
  text-align: center;
}
.drawerBox {
  .el-drawer__header {
    align-items: center;
    color: #72767b;
    display: flex;
    margin-bottom: 0 !important;
    padding: 10px 20px !important;
  }
  .el-drawer__body {
    padding: 0 20px !important;
  }
}
/deep/ .el-drawer__header {
  align-items: center;
  color: #72767b;
  display: flex;
  margin-bottom: 0 !important;
  padding: 10px 20px !important;
}
</style>