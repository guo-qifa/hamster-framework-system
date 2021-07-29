<!--
 * @Descripttion: 
 * @Author: liuYaoYu
 * @Date: 2021-04-23 14:12:43
 * @LastEditors: liuYaoYu
 * @LastEditTime: 2021-04-23 17:21:19
-->
<template>
  <div class="hazardRiskPop">
    <h4>关联的危害因素</h4>
    <Row>
      <Col span="20">
        <Form label-position="left" :label-width="100">
          <FormItem label="危害因素名称">
            <Input :value.sync="info.name" size="small" :readonly="info!=undefined" />
          </FormItem>
        </Form>
      </Col>
    </Row>
    <!-- 手风琴 -->
    <div class="scroll">
      <Collapse @on-change="collapseChange" accordion v-if="info.records.length>0">
        <Panel v-for="(v,index) of info.records" :key="index">
          <!-- title  start -->
          <template>
            时间:&nbsp;&nbsp;&nbsp;&nbsp;{{v.createTime}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span
              :class="{'inlineBlock':true,'sus':v.status=='01','err':v.status!='01'}"
            >{{v.status&&(v.status=='01'?"正常":"异常")||'/'}}</span>
            <span class="plople">
              巡检人:
              {{v.createUser}}
            </span>
          </template>
          <!-- title  end -->
          <div slot="content" class="content">
            <Row>
              <Col span="20">
                <Form label-position="left" :label-width="100">
                  <FormItem label="整改建议" :label-width="80" v-if="v.proposal">
                    <Input
                      :value.sync="v.proposal"
                      type="textarea"
                      :autosize="{minRows: 2,maxRows: 5}"
                      placeholder="Enter something..."
                      :readonly="v.proposal!=undefined"
                    />
                  </FormItem>
                  <FormItem label="检查描述" :label-width="80" v-if="v.content">
                    <Input
                      :value.sync="v.content"
                      type="textarea"
                      :autosize="{minRows: 2,maxRows: 5}"
                      placeholder="Enter something..."
                      :readonly="v.content!=undefined"
                    />
                  </FormItem>
                  <FormItem v-if="v.pic && v.pic instanceof Array && v.pic.length > 0" label="图片上传" :label-width="80">
                    <template>
                      <div class="demo-upload-list" v-for="(item,index) in v.pic" :key="index">
                        <template v-if="item">
                          <img :src="item" class="img" @click="handleView(item)" />
                        </template>
                      </div>
                    </template>
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </div>
        </Panel>
      </Collapse>
      <div class="zw" v-else>
          暂无数据
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "hazardRiskPop",
  methods: {
    handleView(name) {
      this.imgName = name;
      open(name,'_brank')
    },
    /**
     * @name: 手风琴改变状态获取的值
     * @Author: liuYaoYu
     * @param {*} e
     * @return {*}
     * @Date: 2021-04-23 14:54:34
     * @LastEditTime: Do not Edit
     */

    collapseChange(e) {},
    /**
     * @name: 设置弹窗配置
     * @Author: liuYaoYu
     * @param {*}
     * @return {*}
     * @Date: 2021-04-23 15:14:01
     * @LastEditTime: Do not Edit
     */
    setPop() {
      this.$emit("setPageSize", 900);
      this.$emit("setPageTopSize", 110);
      this.$emit("setModalMove");
      this.$emit("setButtonCenter");
      this.$emit("setModalClass", "hidden-register-modal");
      this.$emit("setTitle", "查看记录");
      this.$emit("setPageActions", [
        {
          text: "取消",
          action: "save",
          handle: () => {
            this.$emit("hide");
          }
        }
      ]);
    }
  },
  data() {
    return {
      value2: "1",
      imgName: "",
      visible: false
    };
  },
  props: {
    info: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  created() {
    this.setPop``;
    console.log(this.info)
  }
};
</script>
<style lang="less" scoped>
.img {
  width: 100px;
  height: 100px;
  cursor: pointer;
}
/deep/ .demo-upload-list {
  position: relative;
  display: inline-block;
}
::v-deep.demo-upload-list-cover {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
.zw{
    display: flex;
    justify-content: center;
    align-items: center;
}
.err,
.sus {
  width: 70px;
  height: 24px;
  border-radius: 12px;
  background: orange;
  text-align: center;
  line-height: 24px;
  color: #fff;
  margin-left: 20px;
  margin-right: 20px;
}
.err {
  background: #dddddd;
}
.box,
.list {
  display: flex;
}
.hazardRiskPop {
  height: 100%;
  width: 100%;
  padding: 1% 3%;
  box-sizing: border-box;
}
</style>