<!--
 * @Descripttion: 
 * @Author: liuYaoYu
 * @Date: 2021-03-04 15:23:44
 * @LastEditors: liuYaoYu
 * @LastEditTime: 2021-04-23 11:10:46
-->
<template>
  <BubbleBasicManage
    ref="BubbleBasicManage"
    title="消息通知列表"
    form-title="消息通知列表"
    type="noticeList"
    :filter="filter"
    noedit
    noinsert
    nodelete
    primaryKey="id"
    :rowbtn="rowbtn"
   
  />
   <!-- :injectionSubmit="injectionSubmit" -->
</template>

<script>
// @ is an alias to /src

export default {
  name: "NoticeList",

  data() {
    console.log(this.$bubble.pageLoadArguments)
    return {
      filter: [
        { key: "message", text: "消息内容" },
        {
          text: "消息类型",
          key: "type",
          type: "select",
          dictionary: "eventList",
        },
        {
          text: "消息时间",
          key: "date",
          type: "date",
        },
        {
          text: "消息状态",
          key: "status",
          type: "select",
          dictionary: "messageStatus",
        },
      ],
      rowbtn: [{ text: "查收", onclick: this.handle, loadingOnClick: true }],
    };
  },
  methods: {
    handle(v, callback) {
      this.$confirm("确认要处理该消息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$bubble
            .request("noticeList.enclosed", { id: v.id })
            .then((v) => {
              this.$refs.BubbleBasicManage.reload();
            })
            .catch((v) => {
              this.$alert("查收失败");
            });
        })
        .finally(() => {
          callback();
        });
    },
    // injectionSubmit(u, n, s, q) {
    //   console.log(u, n, s, q);
    //   return new Promise((resolve, reject) => {
    //     this.$bubble.request("noticeList.find").then((res) => {
    //       console.log(res);
    //       resolve({
    //         data: {},
    //       });
    //     });
    //   });
    // },

    //  if (q != []) {
    //         let par = {};
    //         q.forEach((r, i) => {
    //           const t = r.field;
    //           if (t == "date") {
    //             let [beginTime, endTime] = r.value.split(",");
    //             par.beginTime = this.$time(beginTime).format("YYYY-MM-DD");
    //             par.endTime = this.$time(endTime).format("YYYY-MM-DD");
    //           } else {
    //             par[t] = par[t] ? par[t] : "";
    //           }
    //           console.log(par);
    //         });
    //         return new Promise((resolve, reject) => {
    //           this.$bubble.request("noticeList.find", par).then((v) => {
    //             resolve({
    //               data: {
    //                 records: v.record.records,
    //                 total: v.record.records.length,
    //               },
    //             });
    //           });
    //         });
    //       } else {
    //         return new Promise((resolve, reject) => {
    //           this.$bubble.request("noticeList.page").then((v) => {
    //             resolve({
    //               data: {
    //                 records: v.record.records,
    //                 total: v.record.records.length,
    //               },
    //             });
    //           });
    //         });
    //       }
  },
};
</script>

<style lang="scss">
</style>