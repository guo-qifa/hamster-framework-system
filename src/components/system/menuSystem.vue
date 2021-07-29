<script src="../../config/interface.js"></script>
<template>
  <div class="menuBox">
    <div class="left" style="height: 100%">
      <el-card class="box-card" style="width: 92%">
        <depTree
          style="height: 100%"
          :treeData="treeData"
          pageType="role"
          :ifExpand='ifExpand'
          @role="role"
        >
          <div slot="topv" class="topV">
            <div class="_name">菜单目录</div>
          </div>
        </depTree>
      </el-card>
     
    </div>

    <div class="right">
      <el-card class="box-card" style="height: 100%">
        <div class="_top">
          <Row>
            <i-col span="2">
              <i-button
                @click="addMenu"
                type="success"
                style="height: 28px; margin-right: 5px"
              >
                <Icon type="android-done"></Icon>
                <span>新建</span>
              </i-button>
            </i-col>
          </Row>
        </div>
        <div class="content">
          <div class="content">
            <div class="addComInfo" style="height: 350px">
              <i-form
                :model="formItem"
                :label-width="100"
                ref="addUser"
                :rules="rules"
              >
                <Row v-if="flag">
                  <i-col span="24">
                    <Form-item label="上级菜单" prop="subMenuName">
                      <i-input
                        v-model="formItem.subMenuName"
                        readonly
                        placeholder="请填入"
                      ></i-input>
                    </Form-item>
                  </i-col>
                </Row>
                <Row>
                  <i-col span="24">
                    <Form-item label="菜单类型" prop="type">
                      <RadioGroup v-model="formItem.type">
                        <Radio label="1">
                          <span>目录</span>
                        </Radio>
                        <Radio label="2">
                          <span>文件</span>
                        </Radio>
                        <Radio label="3">
                          <span>页面</span>
                        </Radio>
                        <Radio label="4">
                          <span>按钮</span>
                        </Radio>
                      </RadioGroup>
                      <!-- <CheckboxGroup v-model="formItem.type" @on-change="getPayTypeFun">
                                            <Checkbox label="1">目录</Checkbox>
                                            <Checkbox label="2">文件</Checkbox>
                                            <Checkbox label="3">页面</Checkbox>
                                            <Checkbox label="4">按钮</Checkbox>
                                        </CheckboxGroup> -->
                    </Form-item>
                  </i-col>
                </Row>
                <Row>
                  <i-col span="24">
                    <Form-item label="菜单名称" prop="menuName">
                      <i-input
                        v-model="formItem.menuName"
                        placeholder="请填入"
                      ></i-input>
                    </Form-item>
                  </i-col>
                </Row>
                <Row v-if="this.formItem.type == '1' ? false : true">
                  <i-col span="24">
                    <Form-item label="请求地址" prop="url">
                      <i-input v-model="formItem.url" placeholder=""></i-input>
                    </Form-item>
                  </i-col>
                </Row>
                <Row>
                  <i-col span="24">
                    <Form-item label="显示排序">
                      <i-input
                        v-model="formItem.sort"
                        placeholder="请填入"
                      ></i-input>
                    </Form-item>
                  </i-col>
                </Row>
                <Row v-if="this.formItem.type == '3' ? true : false">
                  <i-col span="24">
                    <Form-item label="图标库">
                      <i-input
                        v-model="formItem.icon"
                        placeholder="请填入"
                      ></i-input>
                    </Form-item>
                  </i-col>
                </Row>
                <!-- <Row
                  style="margin-top: 30px"
                  v-if="this.formItem.type == '3' ? true : false"
                >
                  <i-col span="24">
                    <h3 style="height: 30px; text-align: left">教育培训配置</h3>
                  </i-col>
                </Row>
                <Row v-if="this.formItem.type == '3' ? true : false">
                  <i-col span="24">
                    <Form-item label="路由路径">
                      <i-input
                        v-model="formItem.component"
                        placeholder="请填入"
                      ></i-input>
                    </Form-item>
                  </i-col>
                </Row>
                <Row v-if="this.formItem.type == '3' ? true : false">
                  <i-col span="24">
                    <Form-item label="重定向地址">
                      <i-input
                        v-model="formItem.redirect"
                        placeholder="请填入"
                      ></i-input>
                    </Form-item>
                  </i-col>
                </Row> -->

                <Row style="margin: 20px">
                  <i-col span="24">
                    <Button
                      @click="save('编辑')"
                      type="primary"
                      style="cursor: pointer"
                      v-if="!newFlag && !saved"
                      >保存</Button
                    >
                    <Button type="success" style="cursor: pointer" v-if="saved"
                      >已保存</Button
                    >
                    <Button
                      @click="save('增加')"
                      type="primary"
                      style="cursor: pointer"
                      v-if="newFlag && !added"
                      >添加</Button
                    >
                    <Button type="success" style="cursor: pointer" v-if="added"
                      >已添加</Button
                    >
                    <Button
                      @click="deleteRow"
                      type="warning"
                      v-if="!deleted"
                      style="cursor: pointer; margin: 0 10px"
                      >删除</Button
                    >
                    <Button
                      v-if="deleted"
                      type="success"
                      style="cursor: pointer; margin: 0 10px"
                      >已删除</Button
                    >
                  </i-col>
                </Row>
              </i-form>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import depTree from "@/common/components/system/depTree";

export default {
  props: [],
  components: {
    depTree,
  },
  data() {
    return {
      ifExpand:true,
      saved: false,
      deleted: false,
      added: false,
      mapData: {},
      userType: localStorage.getItem("userType"),
      newFlag: false,
      selectObj: null,
      flag: true,
      tabHeight: 700,
      treeData: [],
      url: "user",
      more: true,
      isShowBtn: false,
      formItem: {
        subMenuName: "主目录",
        menuName: "",
        type: "1",
        url: "",
        jnje: "",
        jnjedx: "",
        bz: "",
        bxgsmc: "",
        time: "",
        status: true,
      },
      rules: {
        menuName: [
          {
            required: true,
            message: "菜单名称必填",
            trigger: "blur",
          },
        ],
        url: [
          {
            required: true,
            message: "菜单路径",
            trigger: "blur",
          },
        ],
        sort: [
          {
            required: true,
            message: "菜单排序必填",
            trigger: "blur",
          },
        ],
      },

      menuList: [
        {
          value: "1",
          label: "系统",
        },
        {
          value: "2",
          label: "文件",
        },
        {
          value: "3",
          label: "页面",
        },
        {
          value: "4",
          label: "按钮",
        },
      ],
      paramObj: {},
      bxlxList: [
        {
          value: "工伤保险",
          label: "工伤保险",
        },
        {
          value: "安全生产责任保险",
          label: "安全生产责任保险",
        },
      ],
    };
  },

  created() {
    this.initTreeData_1();
  },
  mounted() {},
  methods: {
    initTreeData_1() {
      this.$bubble
        .request("menuSystem.find", { workName: this.filterText })
        .then((v) => {
          this.treeData = v.record;
        })
        .catch((e) => { 
          this.$alert("数据获取失败");
        });
    },

    saveOrder(type) {
      var param = {
        menuName: this.formItem.menuName,
        sort: this.formItem.sort,
        parentId: this.formItem.parentId,
      };
      var _url = "";
      var _msg = ""; //this.formItem.parentId

      if (type == "编辑") {
        _url = "menuSystem.update";
        _msg = "保存成功！";
        param.menuId = this.selectObj.id;
        param.type = Number(this.formItem.type);
      } else if (type == "增加") {
        if (this.selectObj) {
          param.type = Number(this.formItem.type);
        } else {
          param.type = Number(this.formItem.type);
        }
        _url = "menuSystem.insert";
        _msg = "新增成功";
      }

      param.url = this.formItem.url;
      param.sort = Number(param.sort);
      if (this.formItem.component.length > 0) {
        param.component = this.formItem.component;
      }
      if (this.formItem.redirect.length > 0) {
        param.redirect = this.formItem.redirect;
      }
      if (this.formItem.icon.length > 0) {
        param.icon = this.formItem.icon;
      }

      this.$bubble
        .request(_url, param)
        .then((v) => {
          this.$message({
            type: "success",
            message: "菜单" + _msg,
          });
          if (type == "编辑") {
            this.saved = true;
            this.added = false;
            this.deleted = false;
          }
          if (type == "增加") {
            this.added = true;
            this.saved = false;
            this.deleted = false;
          }
          this.reset();
          setTimeout(() => {
            this.initTreeData_1();
          }, 500);
        })
        .catch((e) => { 
          this.$alert("数据获取失败");
        });
    },
    save(type) {
      if (this.selectObj) {
        if (this.formItem.type == 1 && this.formItem.type == 4) {
          this.$Message.warning({
            content: "目录下不能新建按钮！",
            duration: 10,
            closable: true,
          });
          return;
        }
        if (this.formItem.type == 2 && this.formItem.type == 4) {
          this.$Message.warning({
            content: "文件下不能新建按钮！",
            duration: 10,
            closable: true,
          });
          return;
        }
        if (
          this.formItem.type == null ||
          this.formItem.type == "null" ||
          this.formItem.type == ""
        ) {
          this.$Message.warning({
            content: "菜单类型必选！",
            duration: 10,
            closable: true,
          });
          return;
        }
      }
      this.$refs["addUser"].validate((valid) => {
        if (valid) {
          this.saveOrder(type);
        }
        setTimeout(() => {
          this.loading = false;
          this.$nextTick(() => {
            this.loading = true;
          });
        }, 1000);
      });
    },
    role(data) {
      this.saved = false;
      this.added = false;
      this.deleted = false;

      if (data == []) {
        this.selectObj = null;
      }
      this.newFlag = false;
      this.selectObj = data[0];
      this.formItem.menuName = data[0].title;
      this.formItem.type = data[0].type + "";
      this.formItem.url = data[0].url;
      this.formItem.sort = data[0].nodeKey;
      if (data[0].redirect) {
        this.formItem.redirect = data[0].redirect;
      } else {
        this.formItem.redirect = "";
      }
      if (data[0].component) {
        this.formItem.component = data[0].component;
      } else {
        this.formItem.component = "";
      }
      if (data[0].icon) {
        this.formItem.icon = data[0].icon;
      } else {
        this.formItem.icon = "";
      }
      if (data[0].pId == 0) {
        this.flag = true;
        this.formItem.subMenuName = "主目录";
      } else {
        this.flag = false;
      }
    },
    reset() {
      this.formItem.menuName = "";
      this.formItem.url = "";
      this.formItem.sort = "";

      this.formItem.component = "";
      this.formItem.redirect = "";
      this.formItem.icon = "";
    },
    addMenu() {
      this.newFlag = true;
      this.formItem.menuName = "";
      this.formItem.url = "";
      this.formItem.sort = "";
      this.formItem.component = "";
      this.formItem.redirect = "";
      this.formItem.icon = "";
      if (this.selectObj) {
        this.flag = true; 
        this.formItem.parentId = this.selectObj.id;
        this.formItem.subMenuName = this.selectObj.title;
        this.formItem.type = "2";
      } else {
        this.flag = true;
        this.formItem.type = "1";
        this.formItem.parentId = "";
        this.formItem.subMenuName = "主目录";
      }
    },
    getPayTypeFun(data) {
      if (data.length > 1) {
        this.formItem.menuTyp = [];
        let i = String(data.length - 1);
        this.formItem.type = [data[i]];
      }
    },
    async getTreeData() {
      const res = await this.$http.post(
        `${this.$store.state.systemUrl}` + "menu/queryAllMenu",
        {}
      );
      this.treeData = res.data.object;
    },
    showSelCol2(code, arr) {
      code = code + "";
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].value == code) {
          return arr[i].label;
        }
      }
    },
    addmenuSecond(row) {
      new this.$newPopup(
        addMenu,
        {
          props: {
            type: "添加二级菜单",
            row: row,
          },
        },
        () => {
          this.getTreeData();
        }
      );
    },

    selectMenu(e) {
      console.log(e, "22");
    },
    expandHandle() {},
    rowDoubleClickHandle() {},
    rowClickHandle() {},
    closeMore() {
      this.more = !this.more;
    },
    heightNum(height, flag) {
      this.tabHeight = height;
    },
    getTableData() {},

    init() {},
    showAreaDetail(rowData, type) {
      new this.$newPopup(
        addMenu,
        {
          props: {
            row: rowData,
            type: type,
          },
        },
        () => {
          this.searchArea();
        }
      );
    },
    delFunc(row) {
 
      this.$bubble
        .request("menuSystem.delete", { menuId: row.id })
        .then((v) => {
   
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.reset();
          this.deleted = true;
          this.saved = false;
          this.added = false;
          setTimeout(() => {
            this.initTreeData_1();
          }, 500);
        })
        .catch((e) => {
          // this.$alert("数据获取失败");
        });
    },
    deleteRow() {
      if (this.selectObj == null) {
        this.$Message.warning({
          content: "请先选择删除的菜单！",
          duration: 3,
          closable: true,
        });
        return;
      }
      this.$confirm("确认要删除选中的菜单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delFunc(this.selectObj);
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除",
          // });
        });
    },
    getChoose() {
      let list = this.$refs["queryTable"].getSelectioned() || [];
      let ids = [];
      for (let u of list) {
        ids.push(u.classGroupId);
      }
      if (ids.length == 0) {
        this.$Message.warning({
          content: "请选择一行",
          duration: 10,
          closable: true,
        });
        return "";
      } else if (ids.length > 1) {
        this.$Message.warning({
          content: "只能选择一行",
          duration: 10,
          closable: true,
        });
        return "";
      } else {
        return list[0];
      }
    },

    //查询
    searchArea(page) {
      this.formItem.pageNum = 1;
      this.formItem.pageSize = 10;
      this.$refs["queryTable"].load(this.formItem);
    },
    timeTrans(time) {
      return new Date(
        new Date(time).getTime() + 1000 * (60 * 60 * 23 + 60 * 59 + 59)
      ).Format("yyyy-MM-dd hh:mm:ss");
    },

    formReset() {
      this.resetTable();
    },
    resetTable() {
      this.searchArea();
    },
    roleUser(rowData) {
      new this.$newPopup(
        roleUser,
        {
          props: {},
        },
        () => {
          this.searchArea();
        }
      );
    },
  },
};
</script>

<style lang="less" scoped>
._name {
  height: 100%;
  line-height: 45px;
  font-weight: bold;
}
.menuBox {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  > div {
    display: flex;
  }
  .left {
    background: #fff;
    flex: 1;
    margin: 0 10px;
  }
  .right {
    flex: 4;
    background: #fff;
    margin-left: 0px;
    direction: flex;
    flex-direction: column;
    ._top {
      height: 45px;
      padding: 8px 0;
      margin-bottom: 30px;
      border-bottom: 1px solid #ccc;
    }
    .content {
      width: 100%;
    }
  }
}
/deep/ .ivu-form-item-content {
  text-align: left;
}
/deep/ .ivu-tree {
  width: 100% !important;
  padding-top: 30px;
  > ul {
    padding-left: 30px;

    width: 65% !important;
  }
}
</style>
