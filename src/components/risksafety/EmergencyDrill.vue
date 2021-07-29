<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="4" v-if="userType == 2">
                <el-form style="padding: 0 10px" :inline="true">
                    <el-form-item label="企业名称">
                    <el-input
                        placeholder="输入关键字进行过滤"
                        size="mini"
                        v-model="filterText"
                        clearable
                    ></el-input>
                    </el-form-item>
                </el-form>
                <el-tree
                    highlight-current
                    class="filter-tree"
                    :data="treeData"
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    ref="tree"
                    @node-click="nodeSelect"
                >
                </el-tree>
            </el-col>
            <el-col :span="userType == 2 ? 20 : 24">
                <BubbleBasicManage
                    ref="BubbleBasicManage"
                    title="应急演练"
                    :form="form"
                    form-title="应急演练"
                    type="emergencyDrill"
                    :filter="filter"
                    :injectionSubmit="injectionSubmit"
                    primaryKey="id"
                    :btnWidth="200"
                    :rowbtn="rowbtn"
                    :noinsert="!rightControl.allowAdd"
                    :noedit="!rightControl.allowEdit"
                    :nodelete="!rightControl.allowDelete"
                    :customImportButton="rightControl.allowImport"
                    :exportButton="rightControl.allowExport"
                    @customImport="customImportData"
                    @export="exportData"
                />
            </el-col>
        </el-row>

        <!-- 查看详情 -->
        <showDetailTemplate
            :visible="showDetailDialog"
            :formData="currentRowData"
            :formConfig="form"
            :beforeClose="beforeDetailDialogClose"
        >
        </showDetailTemplate>
    </div>
</template>

<script>
// @ is an alias to /src
import { getToken, initRightControl } from "@/utils";
import showDetailTemplate from '../showDetailTemplate/showDetailTemplate';
export default {
    name: "EmergencyDrill", 
    components: { showDetailTemplate },
    data() {
        var auth = this.$bubble.pageLoadArguments;
        const userType = localStorage.getItem('userType');
        const uploadPrefix = this.$bubble.config.uploadPrefix;
        return {
            rightControl: initRightControl(auth.auth),
            userType,
            filterText: '',
            treeData: [],
            defaultProps: {
                children: "children",
                label: "title",
            },
            defaultFilter: [{ field: "cmyId", logic: "=", value: "" }],
            form: [
                {
                    type: "step",
                    text: "基本信息",
                    forms: [
                        { type: "input", text: "演练名称", name: "name", valid: { required: true } },
                        { type: "hidden", name: "id" },
                        { type: "input", text: "演练地点", name: "place" },
                        { type: "date", text: "开始时间", name: "time", format: "yyyy-MM-dd 00:00:00",valid: { required: true } },
                        {
                            type: "tableSelect", text: "预案名称", name: "planId", tableSelectConfig: "planManagement", valid: { required: true }, defaultSelected: v => {
                                return { text: this.mapData[v.planId] ? this.mapData[v.planId] : v.planId, value: v.planId };
                            }
                        },
                        {
                            type: "tableSelect",
                            text: "部门",
                            name: "joinDept",
                            tableSelectConfig: "workPlace",
                            valid: { required: true },
                            defaultSelected: v => {
                                return { text: this.workListData[v.joinDept] ? this.workListData[v.joinDept] : v.joinDept, value: v.joinDept };
                            },
                            objectChoiceInputChange: (d, { fullData: f }) => {
                                if(d.joinDept) {
                                    d.person = f.chargeName;
                                    d.phone = f.phone;
                                }
                            }
                        },
                        { type: "input", text: "负责人", name: "person" },
                        { type: "input", text: "联系方式", name: "phone" },
                        { type: "textarea", text: "演练内容", minRows: 5, name: "content", valid: { required: true } },
                        { type: "textarea", text: "备注", minRows: 5, name: "remark" },
                    ]
                },
                {
                    type: 'step',
                    text: '演练文件',
                    forms: [
                        {
                            type: "image",
                            text: "演练图片",
                            name: "drillPhoto",
                            multiple: true,
                            headers: {
                                loginTokensAnjian: getToken(),
                            },
                            onSuccess(res) {
                                res.object.url = uploadPrefix + res.object.url;
                                return res.object.url
                            }
                        },
                        {
                            type: "upload",
                            text: "演练文件",
                            name: "drillData",
                            multiple: true,
                            headers: {
                                loginTokensAnjian: getToken(),
                            },
                            onSuccess(res) {
                                res.object.url = uploadPrefix + res.object.url;
                                return res.object.url
                            }
                        },
                    ]
                }
            ],
            filter: [
                { key: "name", text: "演练名称" },
                { key: "status", text: "演练状态", type: "select", dictionary: "emergencyDrillStatus" }
            ],
            mapData: [],
            workListData: [],
            rowbtn: [
                { 
                    text: "查看详情", 
                    onclick: this.showRowDetails,
                    visible: v => {
                        return initRightControl(auth.auth).allowShowDetail
                    }
                },
                {
                    text: "报告", onclick: this.report, visible: v => {
                        return v.status == 1 && userType == 1;
                    }
                },
            ],
            currentRowData: {},
            showDetailDialog: false,
        }
    },
    watch: {
        filterText(val) {
        this.$refs.tree.filter(val);
        },
    },
    methods: {
        showRowDetails(v) {
            this.currentRowData = v;
            this.showDetailDialog = true;
        },
        beforeDetailDialogClose() {
            this.showDetailDialog = false;
        },
        report(v) {
            this.$refs.BubbleBasicManage.edit(v);
        },
        initMapData() {
            this.$bubble.request("planManagement.page", { pageNum: 1, pageSize: 500 }).then((v) => {
                v.record.records.forEach(v => {
                    this.mapData[v.id] = v.name;
                });
            }).catch(v => {
                this.$alert("数据获取失败");
            });
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.title.indexOf(value) !== -1;
        },
        nodeSelect(v) {
            this.$set(this.defaultFilter, 0, {
                field: "cmyId",
                logic: "=",
                value: v.id,
            });
            
        },
        initTreeData() {
            this.$bubble
                .request("searchCom.companyList", {cmyName: this.filterText})
                .then((v) => {
                this.treeData = v.record;
                })
                .catch((e) => {
                this.$alert("数据获取失败");
                });
        },
        initWorkListData() {
            this.$bubble.request("workPlace.page", { pageNum: 1, pageSize: 500 }).then((v) => {
                v.record.records.forEach(v => {
                    this.workListData[v.id] = v.workName;
                });
            }).catch(v => {
                this.$alert("数据获取失败");
            });
        },
        injectionSubmit(u, n, s, p) {
            //初始化请求参数
            let data = {};
            p.map(param => {data[param.field] = param.value});
            return new Promise((resolve, reject) => {
                this.$bubble.request("emergencyDrill.page", {
                    ...data,
                    pageNum: n,
                    pageSize: s
                }).then((v) => {
                    resolve({
                        data: {
                            records: v.record.records.map(val => {
                                val.noedit = val.status == "2" ? true : false;
                                val.nodelete = val.status == "2" ? true : false;
                                return val
                            }),
                            total: v.record.total,
                        },
                    });
                });
            });
        },
        customImportData() { console.log("导入") },
        exportData() { console.log("导出") },
    },
    created() {
        if(this.userType == 2) {
            this.initTreeData();
        }
        this.initMapData();
        this.initWorkListData();
        this.$nextTick(() => {
            // console.log(this.$refs.BubbleBasicManage.$refs.form.formData)
        })
    }
};
</script>

<style lang="scss">
</style>