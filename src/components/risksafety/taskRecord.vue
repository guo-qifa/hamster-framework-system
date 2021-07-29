<!--
 * @Descripttion: 
 * @Author: liuYaoYu
 * @Date: 2021-04-22 13:43:00
 * @LastEditors: liuYaoYu
 * @LastEditTime: 2021-04-22 16:50:22
-->
<template>
  <div>
    <BubbleBasicManage
      title="学习任务"
      type="task"
      :filter="filter"
      primaryKey="id"
      :injectionSubmit="injectionSubmit"
      :rowbtn="rowbtn"
      noinsert
      nodeit
      nodelete
    />
    <!-- 任务对象dialog -->
    <el-dialog
        append-to-body
        :visible.sync="missionPeopleVisible"
        width="80%"
      >
      <p slot="title">
        <span class="el-dialog__title">任务对象</span>
        <el-button style="margin-left: 30px" type="primary" size="mini" @click="reAllocate">重新分配任务</el-button>
      </p>
      <BubbleBasicManage
        ref="errorBasicManage"
        title=""
        type="taskPerson"
        :selectMode="'multiple'"
        :dataKey="'personId'"
        :filter="filter1"
        primaryKey="id"
        :injectionSubmit="injectionSubmit1"
        :rowbtn="rowbtn1"
        noinsert
        nodeit
        nodelete
      />
    </el-dialog>
    <!-- 错题集 -->
    <el-dialog
        append-to-body
        :visible.sync="errorVisible"
        title="错题"
        width="80%"
      >
      <el-collapse v-model="activeNames">
        <el-collapse-item
              :title="`第${label.sort}题  题型：${label.questionType}`"
              :name="values + ''"
              v-for="(label, values) in errorDetailList"
              :key="values">
          <div class="content-slo">
            <div>
                <el-row>
                    <el-col :span="16">
                        <p>问题：{{ label.stem }}</p>
                    </el-col>
                </el-row>
            </div>
            <div class="choose" v-if="label.questionType == '单选' || label.questionType == '多选'">
                <el-row>
                    <el-col :span="16">
                        <p>A: {{label.chooseA}}</p>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <p>B: {{label.chooseB}}</p>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <p>C: {{label.chooseC}}</p>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <p class="end">D: {{label.chooseD}}</p>
                    </el-col>
                </el-row>
            </div>

            <div class="answer">
                <span class="panel-answer-item">正确答案：<span>{{label.answer}}</span></span>
                <span class="panel-answer-item">人员填写：<span>{{label.userAnswer}}</span></span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
  </div>
</template>

<script>
import { getToday, getQueryVariable } from '@/utils';
export default {
  data() {
    console.log(this.$bubble.pageLoadArguments)
    return {
      missionPeopleVisible: false,
      errorVisible: false,
      currentMissionId: null,
      activeNames: '0',
      errorDetailList: [],
      filter: [
        {key: 'keyWord', text: '关键词'},
        {key: 'missionStatus', text: '任务状态',type: 'select',dictionary: 'taskRecordList', default: ''},
        {key: "date", text: "时间段查询", type: "datetime",default: ''},
      ],
      rowbtn: [
        {
          text: "查看任务对象",
          onclick: (rowData) => {
            this.showPerson(rowData);
          },
        },
      ],

      filter1: [
        {key: 'keyWord', text: '关键词'},
      ],
      rowbtn1: [
        {
          text: "错题详情",
          onclick: (rowData) => {
            this.showError(rowData);
          },
        },
      ],
    };
  },
  methods: {
    showPerson(rowData) {
      this.currentMissionId = rowData.id;
      this.missionPeopleVisible = true;
      this.$nextTick(() => {
        this.$refs.errorBasicManage.reload();
      })
    },
    showError(rowData) {
      let _this = this;
      this.$bubble.request("task.error", {id: rowData.examId}).then((v) => {
          if(v.code == '0') {
            _this.errorDetailList = v.record;
            _this.activeNames = '0';
            _this.errorVisible = true;
          } else {
            _this.$message.error('初始化错题失败！')
          }
        });
    },
    reAllocate() {
      console.log('重新分配任务')
    },
    injectionSubmit(u, n, s, p) {
      //初始化请求参数
      let data = {
        beginDate: "",
        endDate: "",
        isTrusted: true,
        keyWord: "",
        missionStatus: "",
      };
      p.forEach((v) => {
        if (v.field == "date" && v.value) {
          let start = '';
          let end = '';
          if(typeof(v.value) == 'string') {
            start = v.value.split(",")[0];
            end = v.value.split(",")[1];
          }
          if(v.value instanceof Array && v.value.length == 2) {
            start = v.value[0];
            end = v.value[1];
          }
          let beginTime = this.$time(start).format("yyyy-MM-DD HH:mm:ss");
          let endTime = this.$time(end).format("yyyy-MM-DD HH:mm:ss");
          data.beginTime = beginTime;
          data.endTime = endTime;
        } else {
          data[v.field] = v.value;
        }
      });
      return new Promise((resolve, reject) => {
        this.$bubble.request("task.page", {
          ...data,
          pageNum: n,
          pageSize: s
        }).then((v) => {
          resolve({
            data: {
              records: v.record.list,
              total: v.record.totalRows,
            },
          });
        });
      });
    },
    injectionSubmit1(u, n, s, p) {
      //初始化请求参数
      let data = {
        isTrusted: true,
        keyWord: "",
        missionId: this.currentMissionId
      };
      p.map(param => {data[param.field] = param.value});
      return new Promise((resolve, reject) => {
        this.$bubble.request("task.personPage", {
          ...data,
          pageNum: n,
          pageSize: s
        }).then((v) => {
          resolve({
            data: {
              records: v.record.list,
              total: v.record.totalRows,
            },
          });
        });
      });
    },
  },
  created() {
    if (getQueryVariable("today")) {
      this.filter[2]["default"] = getToday(0);
    }
    this.filter[1]["default"] = getQueryVariable("missionStatus")
  },
};
</script>

<style>
</style>