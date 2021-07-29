<template>
    <div>
        <div class="demo-item">
            <p>表格:</p>
            <div class="demo-table">
                <BubbleList :search="search" :rowBtn="rowBtn" rurl="user.page" type="user" />
            </div>
        </div>
        <div class="line"></div>
        <div class="demo-item">
            <p>列表选取:</p>
            <div class="demo-table">
                <BubbleObjectChoiceInput config="user" v-model="demoChoice" @change="demoChoiceChange" :search="search" />
            </div>
        </div>
        <div class="line"></div>
        <div class="demo-item">
            <p>树选取:</p>
            <div class="demo-table">
                <BubbleTreeChoiceInput config="user" v-model="treeChoice" @change="demoChoiceChange" :defaultFilter="treeChoiceFilter" childrenKey="children" primaryKey="dptid"
                    selectMode='multiple' />
            </div>
        </div>
        <div class="line"></div>
        <div class="demo-item">
            <p>弹出表单:</p>
            <div class="demo-table">
                <el-button type="primary" @click="openForm">打开</el-button>
                <el-radio-group v-model="mode" style="margin-left: 20px;">
                    <el-radio label="drawer">侧边栏式</el-radio>
                    <el-radio label="dialog">弹窗式</el-radio>
                </el-radio-group>
                <BubblePopForm :mode="mode" :visible.sync="formVisible" title="用户操作" :formConfig="formConfig" label-width="120px" width="800px" :after-submit="afterSubmit" :formData="formData"
                    :submit="submit" />
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src

export default {
    name: "Demo",
    components: {},
    data() {
        return {
            mode: "drawer",
            //BubbleObjectChoiceInput
            demoChoice: [{ text: "sdakfjasdf", value: 123 }],
            treeChoice: [{ text: "sdakfjasdf", value: 123 }],
            treeChoiceFilter: [{ field: "_id", logic: "=", value: "123" }],
            //BubbleList
            search: [
                { text: "手机号", key: "phone" },
                { text: "用户名", key: "username" },
                { text: "是否是管理员", key: "isadmin", type: "select", option: [{ text: "是", value: 1 }, { text: "否", value: 0 }] }
            ],
            rowBtn: [
                { text: '操作1', onclick: () => { this.$alert("操作1") } }, { text: '操作2', onclick: () => { this.$alert("操作2") } }
            ],
            //BubblePopForm
            formVisible: false,
            formData: { expiretime: 100000000000, userid: 100, username: "123", tid: 421, state: 1, "dptid": 123, dptname: 'sdakfjasdf', sdate: '2020/11/10', edate: '2020/11/15' },
            formConfig: [
                {
                    type: "step", text: "基础信息", forms: [
                        { type: "input", text: "材料名称", name: "name", valid: { required: true } },
                        { type: "image", text: "图标", name: "image" },
                        { type: "day", text: "有效期", name: "expiretime", min: 1, max: 60, valid: { required: true }, unit: "ms" },
                        { type: "select", text: "状态", name: "state", dictionary: "CertifyClass", default: 0, valid: { required: true } },
                        { type: "input", text: "行政区深度", name: "regiondeep", valid: { pattern: 10 } },
                        { type: "textarea", text: "说明", name: "desc" },
                        { type: "dateRange", text: "项目起止日期", name: "sdate,edate", format: "yyyy年MM月dd日", valid: { required: true } },
                        {
                            type: "tableSelect", text: "用户", name: "userid", tableSelectConfig: "user", defaultSelected: (v) => {
                                return { text: v.username, value: v.tid }
                            }
                        },
                        {
                            //linkedKey为表格数据关联树数据所用字段名
                            type: "treeListSelect", text: "区域", name: "aid", treeSelectConfig: "region", tableSelectConfig: "manager", linkedKey: "_id", defaultFilter: {
                                tree: [{ field: "_id", logic: "=", value: '5fb4ab7d63a759578a9c9c59' }]
                            }, defaultSelected: v => {
                                return { text: "123", value: "5fb4ab7d63a759578a9c9c59" }
                            }
                        },
                        {
                            type: "tableSelect", text: "其他用户", name: "tid", tableSelectConfig: "user", selectMode: "multiple", defaultSelected: (v) => {
                                return [{ text: v.username, value: v.tid }, { text: '12314sdf', value: 5135 }]
                            }
                        },
                        {
                            type: "treeSelect", text: "部门", name: "dptid", treeSelectConfig: "department", childrenKey: "children", primaryKey: "dptid", defaultSelected: (v) => {
                                return { text: v.username, value: v.tid }
                            }
                        },
                        {
                            type: "treeSelect", text: "其他部门", name: "did", treeSelectConfig: "department", selectMode: "multiple", childrenKey: "children", primaryKey: "dptid", initData: (v) => {
                                return [{ text: v.dptname, value: v.dptid }, { text: 'rtwertwet', value: 5135 }]
                            }
                        }
                    ]
                },
                {
                    type: "step", text: "审核逻辑", forms: [
                        { type: "input", text: "材料名称", name: "name", valid: { required: true } },
                    ]
                },
                {
                    type: "step", text: "第三方平台", forms: [
                        { type: "input", text: "材料名称", name: "name", valid: { required: true } },
                    ]
                }
            ],
        }
    },
    methods: {
        demoChoiceChange(v) {
            v
        },
        openForm() {
            this.formVisible = true;
        },
        afterSubmit(v) {
            v
        },
        submit(v, callback) {
            setTimeout(() => {
                callback();
            }, 1000);
        }
    }
};
</script>

<style lang="scss">
.demo-item {
    width: 100%;

    & > p {
        font-size: 16px;
        margin-bottom: 10px;
        font-weight: bold;
    }
}

.line {
    margin: 25px 0;
}
</style>