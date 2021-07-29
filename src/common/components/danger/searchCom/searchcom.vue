<template>
  <div class="searchCom">
    <i-form
      :model="formItem"
      :label-width="80"
      ref="company"
      label-position="right"
      style="width:100%"
    >
      <Row v-if="!companyFlag">
        <i-col span="24">
          <Form-item label="企业名称">
            <Input
              type="text"
              placeholder="请输入"
              v-model="formItem.cmyName"
              clearable
              readonly
              style="width: 100%"
              @focus="eventFocus"
            />
          </Form-item>
        </i-col>
      </Row>
      <Row v-if="companyFlag">
        <i-col span="24" style="float:right">
          <Form-item label="车间名称">
            <Input
              type="text"
              placeholder="请输入"
              v-model="formItem.className"
              clearable
              readonly
              style="width: 100%"
              @focus="eventFocus"
            />
          </Form-item>
        </i-col>
      </Row>
      <!--<Button-->
              <!--type="success"-->
              <!--@click.native="workcomreset"-->
              <!--size="small"-->
              <!--style="margin-top: 4px; position: absolute;top: 0px;right: -35px"-->
      <!--&gt;重置</Button>-->
    </i-form>


    <Dropdown class="aDivBox">
      <a href="javascript:void(0)" class="aDiv"> </a>
      <div class="alertDiv" slot="list">
        <div class="left" style="height: 100%" v-if="userType == 1">
          <i-form
            :model="formItem"
            :label-width="100"
            ref="company"
            label-position="right"
            style="margin: 10px 0 0 0; padding: 10px 0 10px  0;  "
          >
            <Row>
              <i-col span="24">
                <Form-item label="车间名称" prop="eventName">
                  <i-input
                    v-model="formItem.workName"
                    placeholder="请搜索车间名称"
                  ></i-input>
                </Form-item>
              </i-col>
            </Row>
            <Row style="padding-right:18px">
              <i-col span="4" style="margin-top: 4px;float:right;">
                <Button
                  type="success"
                  @click.native="workcomsearch"
                  size="small"
                  style="margin: 4px 0px 0 0;"
                  >查询</Button
                >
              </i-col>
              <i-col span="4" style="margin-top: 4px;float:right">
                <Button
                  type="success"
                  @click.native="workcomreset"
                  size="small"
                  style="margin-top: 4px;"
                  >重置</Button
                >
              </i-col>
            </Row>
          </i-form>
          <depTree
            style="height: 100%"
            :treeData="comTreeData"
            pageType="role"
            @role="role"
          >
          </depTree>
        </div>
        <div class="left" style="height: 100%" v-else>
          <i-form
            :model="formItem"
            :label-width="100"
            ref="company"
            label-position="right"
            style="margin: 10px 0 0 0; padding: 10px 0 10px  0;  "
          >
            <Row>
              <i-col span="24">
                <Form-item label="企业名称" prop="eventName">
                  <i-input
                    v-model="girdItem.cmyName"
                    placeholder="请搜索企业名称"
                  ></i-input>
                </Form-item>
              </i-col>
            </Row>

            <Row style="padding-right:18px">
              <i-col span="4" style="margin-top: 4px;float:right;">
                <Button
                  type="success"
                  @click.native="girdcomsearch"
                  size="small"
                  style="margin: 4px 0px 0 0;"
                  >查询</Button
                >
              </i-col>
              <i-col span="4" style="margin-top: 4px;float:right">
                <Button
                  type="success"
                  @click.native="girdcomreset"
                  size="small"
                  style="margin-top: 4px;"
                  >重置</Button
                >
              </i-col>
            </Row>
          </i-form>
          <depTree
            style="height: 100%"
            :treeData="girdTreeData"
            pageType="role"
            @role="role"
          >
          </depTree>
        </div>
      </div>
    </Dropdown>
  </div>
</template>
<script>
import Qs from "qs";
import depTree from "@/common/components/system/depTree";

export default {
  components: { depTree },
  data() {
    return {
      formItem: {
        workName: "",
      },
      girdItem: {
        cmyName: "",
      },
      userType: false,
      Workshop: [],
      companyFlag: false,
      companyList: [
        { cmyId: "", cmyName: "全部", count: 0 },
        { cmyId: "2", cmyName: "扬州市不锈钢制品有限公司", count: 15 },
        { cmyId: "16", cmyName: "扬州海昌", count: 12 },
        { cmyId: "32", cmyName: "扬州乾照光电", count: 10 },
        { cmyId: "27", cmyName: "扬州众力金属制造有限公司", count: 2 },
        { cmyId: "1", cmyName: "晶澳（扬州）太阳能科技有限公司", count: 1 },
      ],
      formItem: {
        cmyName: "",
        className: "",
      },
      girdTreeData: [],
      comTreeData: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    role(data) {
      if (data[0].type == "1") {
      }
      if (data[0].type == "2") {
        this.company = {};
        this.company.workId = "";
        this.company.cmyId = data[0].id;
          this.formItem.className = data[0].title;
          this.formItem.workName = data[0].title;
          this.girdItem.cmyName = data[0].title;
          this.formItem.cmyName = data[0].title
          this.$emit("changeCom", data[0]);
      }
      if (data[0].type == "3") {
        this.formItem.className = data[0].title;
        this.formItem.workName = data[0].title;
        this.$emit("changeCom", data[0],'workid');
      }

    },
    eventFocus() {},
    girdcomreset() {
      this.girdItem.cmyName = "";
        this.formItem.cmyName = ''
      this.getGirdTreeData();
        this.$emit("Reset");
    },
  
    girdcomsearch() {
      this.getGirdTreeData();
    },
    workcomreset() {
      this.formItem.workName = "";
      this.formItem.className =''
      this.getComTreeData();
        this.$emit("Reset");
    },
    workcomsearch() {
      this.getComTreeData();
    },
    comChange(data) {
      this.$emit("changeCom", data);
    },
    async getCompany() { 
      var that = this;
      var res = await this.$bubble.request('searchCom.riskList')
      if (res.code == 0) {
      } else {
        var res = [
          { cmyId: "2", cmyName: "扬州市不锈钢制品有限公司", count: 15 },
          { cmyId: "16", cmyName: "扬州海昌", count: 12 },
          { cmyId: "32", cmyName: "扬州乾照光电", count: 10 },
          { cmyId: "27", cmyName: "扬州众力金属制造有限公司", count: 2 },
          { cmyId: "1", cmyName: "晶澳（扬州）太阳能科技有限公司", count: 1 },
        ];
      }
    },
    async assWorkshop() {
      var that = this;
      var data = {
        pageNum: 1,
        pageSize: 50,
      };
      var data = Qs.stringify(data);
      var res = await this.$http.post(
        `${this.$store.state.ajaxUrl}` +
          "workshop/queryBean",
        data
      );

      if (res.data.code == 0) {
        this.Workshop = res.data.object.records;
      } else {
      }
    },
    async getComTreeData() {
      var that = this;
      let k =this.formItem.workName ? "?workName=" + this.formItem.workName:''

      const res = await this.$http.get(
        `${this.$store.state.ajaxUrl}` +
          "risk/getGridCompanyWorkshopList"+k
      );

      if (res.data.code == 0) {
        this.cmyId = res.data.object[0].id;
        this.comTreeData = res.data.object;
      } else {
        this.$Message.error({
          content: res.data.message,
          duration: 5,
          closable: true,
        });
      }
    },
    async getGirdTreeData() {
      var that = this;
      const res = await this.$bubble.request('searchCom.companyList',{
        cmyName: this.girdItem.cmyName
      })
 

      if (res.code == 0) {
        this.cmyId = res.record[0].id;
        this.girdTreeData = res.record;
      } else {
        this.$Message.error({
          content: res.message,
          duration: 5,
          closable: true,
        });
      }
    },
  },

  created() {},

  mounted() {
    this.userType = localStorage.userType == "1" ? true : false;
    // this.assWorkshop();
    // this.getCompany();
    this.getGirdTreeData();
    this.getComTreeData();
    var userType = localStorage.userType;
    if (userType == 1) {
      this.companyFlag = true;
      this.assWorkshop();
    }
    if (userType == 2) {
      this.companyFlag = false;
      this.getCompany();
    }

    
    document.onkeydown = function(e) {
      var ev = (typeof event!= 'undefined') ? window.event : e;
      if(ev.keyCode == 13) {
        return false;
      }
    }

  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
};
</script>
<style lang="less" scoped>
.searchCom {
  width: 330px;
  margin: 8px 8px 0 0;
  /*display: flex;*/
  padding-left: 30px;
  box-sizing: border-box;
  height: 36px;
  position: relative;
}
.alertDiv {
  position: absolute;
  border: 1px solid #ccc;
  background: #fff;
  right: -3px;
  top: -4px;
  z-index: 9999;
  height: 650px;
  width: 335px;
}
.aDivBox {
  background: transparent;
  width: 303px;
  position: absolute;
  height: 26px;
  right: 0px;
  top: 0px;
  
  z-index: 99999;
  > div {
    background: transparent;
  }
}

</style>
<style>
  .ivu-input-small {
    height: 30px!important;
  }</style>
