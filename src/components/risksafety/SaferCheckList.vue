<template>
    <div>
        <BubbleBasicManage title="安全检查记录单" :form="form" form-title="记录单" type="saferCheckList" :defaultFilter="defaultFilter" :filter="filter" primaryKey="id" :rowbtn="rowbtn" :btnWidth="340" />
        <el-dialog title="检查项目" :close-on-click-modal="false" :visible.sync="dialogVisible" width="80%">
            <div class="line"></div>
            <el-table :data="tableData" style="width: 100%" v-loading="tableLoading">
                <el-table-column prop="checkItem" label="检查项目">
                </el-table-column>
                <el-table-column prop="checkNorm" label="检查标准">
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
                <el-table-column prop="accordWith" label="是否符合项判断">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.accordWith" active-text="是" inactive-text="否" :active-value="1" :inactive-value="2" @change="changeSwitch(scope.row)"></el-switch>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>

export default {
    name: "SaferCheckList",
    data() {
        return {
            form: [
                { type: "input", text: "记录单名称", name: "recordName", valid: { required: true } },
                { type: "hidden", name: "id" },
                { type: "input", text: "检查要求", name: "checkRequired", valid: { required: true } },
                { type: "select", text: "标准类别", name: "checkType", dictionary: "checkType", valid: { required: true } },
                { type: "date", text: "检查时间", name: "checkTime", format: "yyyy-MM-dd 00:00:00" },
                { type: "input", text: "检查区域", name: "checkArea" },
                { type: "input", text: "检查人", name: "checkUser" },
                { type: "input", text: "检查结论", name: "checkResult" },
                { type: "input", text: "备注", name: "remark" },
            ],
            filter: [
                { key: "certificateName", text: "检查记录单名称" },
                { key: "checkUser", text: "检查人" },
                { key: "checkType", text: "检查类型", type: "select", dictionary: "checkType" },
            ],
            rowbtn: [
                { text: "查看检查项", onclick: this.showDetails },
                { text: "发布", onclick: this.publish, loadingOnClick: true, type: "success" },
                { text: "停止发布", onclick: this.depublish, loadingOnClick: true, type: "danger" }
            ],
            defaultFilter: [{ field: "delFlg", logic: "=", value: "0" }],
            tableData: [],
            current: null,
            dialogVisible: false,
            tableLoading: false,
            mainLoading: false
        }
    },
    methods: {
        showDetails(v) {
            this.current = v;
            this.dialogVisible = true;
            this.getDetailsData();
        },
        getDetailsData() {
            this.tableData = [];
            this.tableLoading = true;
            this.$bubble.request("saferCheckList.details", { id: this.current.id }).then((v) => {
                this.tableData = v.record;
            }).catch(v => {
                this.$alert("数据获取失败");
            }).finally(v => {
                this.tableLoading = false;
            });
        },
        changeSwitch(v) {
            this.tableLoading = true;
            this.$bubble.request("saferCheckList.detailsUpdate", { id: v.id, accordWith: v.accordWith }).then((v) => {
                this.getDetailsData();
            }).catch(v => {
                this.$alert("更改失败");
            });
        },
        publish(v, callback) {
            this.$confirm('确认发布吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // this.$bubble.request("saferCheckList.detailsUpdate", { id: v.id, accordWith: v.accordWith }).then((v) => {
                //     this.getDetailsData();
                // }).catch(v => {
                //     this.$alert("发布失败");
                // });
            }).finally(() => {
                setTimeout(() => {
                    callback();
                }, 500);
            });
        },
        depublish(v, callback) {
            this.$confirm('确认停止发布吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // this.$bubble.request("saferCheckList.detailsUpdate", { id: v.id, accordWith: v.accordWith }).then((v) => {
                //     this.getDetailsData();
                // }).catch(v => {
                //     this.$alert("发布失败");
                // });
            }).finally(() => {
                setTimeout(() => {
                    callback();
                }, 500);
            });
        }
    }
};
</script>

<style lang="scss">
</style>