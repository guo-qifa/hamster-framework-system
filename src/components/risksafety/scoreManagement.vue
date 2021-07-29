<template>
  <el-row :gutter="20">
        <el-col :span="4" v-loading="workLoading" style="overflow: hidden;">
            <el-form style="padding: 0 10px;" :inline="true">
                <el-form-item label="公司名称">
                    <el-input placeholder="输入关键字进行过滤" size="mini" v-model="filterText" clearable></el-input>
                </el-form-item>
            </el-form>
            <el-tree highlight-current default-expand-all class="filter-tree" :data="data" :props="defaultProps" :filter-node-method="filterNode" ref="tree" node-key="id" @node-click="nodeSelect">
            </el-tree>
        </el-col>
        <el-col :span="20">
            <BubbleBasicManage
                ref="scoreManage"
                title=""
                :form="form"
                form-title="记分"
                type="scoreManage"
                label-width="160px"
                :defaultFilter="defaultFilter"
                :injectionSubmit="injectionSubmit"
                :filter="filter"
                primaryKey="id"
                nodelete
                noedit
            />
        </el-col>
  </el-row>
</template>

<script>
export default {
    name: 'scoreManagement',
    data() {
        return {
            workLoading: true,
            filterText: "",
            data: [],
            defaultProps: {
                children: 'children',
                label: 'title'
            },
            defaultFilter: [{ field: "cmyId", logic: "=", value: "" }],
            filter: [
                { key: "content", text: "事项" },
                {
                    key: "type",
                    text: "记分状态",
                    type: "select",
                    dictionary: "scoreManageType",
                },
            ],
            form: [
                {
                    type: "input",
                    text: "企业名称",
                    name: "cmyName",
                    disabled: true
                },
                { type: "hidden", name: "cmyId" },
                {
                    type: "select",
                    text: "类型",
                    name: "type",
                    dictionary: "scoreManageType"
                },
                {
                    type: "number",
                    text: "分数",
                    name: "score",
                    valid: { required: true },
                },
                {
                    type: "input",
                    text: "事项",
                    name: "content",
                    valid: { required: true },
                },
            ]
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        getCompany() {
            this.$bubble.request("searchCom.companyList").then((v) => {
                console.log(v)
                this.data = v.record;
                // this.currentWorkplace = v.record[0].children[0];
                this.workLoading = false;
            }).catch(e => {
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

        injectionSubmit(u, n, s, p) {
            //初始化请求参数
            let data = {};
            p.map(param => {data[param.field] = param.value});
            return new Promise((resolve, reject) => {
                this.$bubble.request("scoreManagement.page", {
                    ...data,
                    pageNum: n,
                    pageSize: s
                }).then((v) => {
                    resolve({
                        data: {
                            records: v.record.records,
                            total: v.record.total,
                        },
                    });
                });
            });
        },
    },
    created() {
        this.getCompany();
    }

}
</script>

<style>

</style>