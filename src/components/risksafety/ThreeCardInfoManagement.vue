<template>
    <el-row :gutter="20">
        <el-col :span="4" v-if="userType == 2" v-loading="workLoading" style="overflow: hidden;">
            <el-form style="padding: 0 10px;" :inline="true">
                <el-form-item :label="userType == 2 ? '公司名称' : '车间名称'">
                    <el-input placeholder="输入关键字进行过滤" size="mini" v-model="filterText" clearable></el-input>
                </el-form-item>
            </el-form>
            <el-tree highlight-current default-expand-all class="filter-tree" :data="data" :props="defaultProps" :filter-node-method="filterNode" ref="tree" node-key="id" @node-click="nodeSelect">
            </el-tree>
        </el-col>
        <el-col :span="userType == 2 ? 20 : 24">
            <el-card class="box-card" v-loading="formLoading">
                <el-tabs v-model="activeName">
                    <!-- 安全承诺卡 -->
                    <el-tab-pane label="安全承诺卡" name="first">
                        <el-form label-position="left" label-width="80px">
                            <el-row :gutter="30">
                                <el-col :span="12">
                                    <el-form-item style="margin-bottom: 0;margin: 10px 0;" label="卡编号">
                                        <el-input v-model="baseform1.cardCode" disabled="disabled" size="medium"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item style="margin-bottom: 0;margin: 10px 0;" label="制卡时间">
                                        <el-input v-model="baseform1.createTime" disabled="disabled" size="medium"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item style="margin-bottom: 0;margin: 10px 0;" label="负责人">
                                        <el-input v-model="baseform1.manager" disabled="disabled" size="medium"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item style="margin-bottom: 0;margin: 10px 0;" label="联系电话">
                                        <el-input v-model="baseform1.telephone" disabled="disabled" size="medium"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <h1 style="color: rgb(0, 168, 255);">安全承诺卡内容</h1>
                        <BubbleForm ref="BubbleForm1" :nosubmit="!rightControl.allowAdd && !rightControl.allowEdit" :formConfig="formConfig.first" :formData="baseform1" @submit="submit($event, 0)" labelWidth="80px" />
                    </el-tab-pane>
                    <!-- 安全应知卡 -->
                    <el-tab-pane label="安全应知卡" name="second">
                        <el-form label-position="left" label-width="80px">
                            <el-row :gutter="30">
                                <el-col :span="12">
                                    <el-form-item style="margin-bottom: 0;margin: 10px 0;" label="卡编号">
                                        <el-input v-model="baseform2.cardCode" disabled="disabled" size="medium"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item style="margin-bottom: 0;margin: 10px 0;" label="制卡时间">
                                        <el-input v-model="baseform2.createTime" disabled="disabled" size="medium"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item style="margin-bottom: 0;margin: 10px 0;" label="负责人">
                                        <el-input v-model="baseform2.manager" disabled="disabled" size="medium"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item style="margin-bottom: 0;margin: 10px 0;" label="联系电话">
                                        <el-input v-model="baseform2.telephone" disabled="disabled" size="medium"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <h1 style="color: rgb(0, 168, 255);">安全应知卡内容</h1>
                        <BubbleForm ref="BubbleForm2" :nosubmit="!rightControl.allowAdd && !rightControl.allowEdit" :formConfig="formConfig.first" :formData="baseform2" @submit="submit($event, 0)" labelWidth="80px" />
                    </el-tab-pane>
                    <!-- 安全应急卡 -->
                    <el-tab-pane label="安全应急卡" name="third">
                        <el-form label-position="left" label-width="80px">
                            <el-row :gutter="30">
                                <el-col :span="12">
                                    <el-form-item style="margin-bottom: 0;margin: 10px 0;" label="卡编号">
                                        <el-input v-model="baseform3.cardCode" disabled="disabled" size="medium"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item style="margin-bottom: 0;margin: 10px 0;" label="制卡时间">
                                        <el-input v-model="baseform3.createTime" disabled="disabled" size="medium"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item style="margin-bottom: 0;margin: 10px 0;" label="负责人">
                                        <el-input v-model="baseform3.manager" disabled="disabled" size="medium"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item style="margin-bottom: 0;margin: 10px 0;" label="联系电话">
                                        <el-input v-model="baseform3.telephone" disabled="disabled" size="medium"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <h1 style="color: rgb(0, 168, 255);">应急救援</h1>
                        <div class="line"></div>
                        <el-form label-position="left" label-width="120px">
                            <el-form-item style="margin-bottom: 0;margin: 10px 0;" label="事故救援电话">
                                <el-input v-model="baseform3.accidentPhone" size="medium"></el-input>
                            </el-form-item>
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span style="font-size: 20px;">应急防护</span>
                                    <el-button style="margin-left: 15px;" size="mini" v-if="rightControl.allowAdd || rightControl.allowEdit" type="primary" @click="addAccident">添加</el-button>
                                </div>
                                <div v-for="item in accidentList" :key="item.key">
                                    <div class="accident-box">
                                        <div>
                                            <span>事故类型</span>
                                            <el-select size="mini" style="width: 150px;margin-left: 15px;" v-model="item.accType" placeholder="请选择">
                                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                            </el-select>
                                        </div>
                                        <div class="input">
                                            <span>应急措施</span>
                                            <el-input v-model="item.accMeasure" size="mini"></el-input>
                                            <el-button style="margin-left: 15px;" v-if="rightControl.allowDelete" size="mini" type="danger" @click="removeAccident(item)">移除</el-button>
                                        </div>
                                    </div>
                                </div>
                                <p v-show="!accidentList.length">暂无应急防护</p>
                            </el-card>
                            <div class="line"></div>
                            <el-button class="pull-right" style="margin-left:10px;" v-if="rightControl.allowAdd || rightControl.allowEdit" size="medium" type="primary" @click="submitAccident()">提交</el-button>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
import { initRightControl } from "@/utils";
export default {
    name: "ThreeCardInfoManagement",
    data() {
        const orgId = localStorage.getItem('orgId');
        var auth = this.$bubble.pageLoadArguments;
        return {
            rightControl: initRightControl(auth.auth),
            userType: localStorage.getItem("userType"),
            orgId,
            activeName: "first",
            data: [],
            filterText: "",
            defaultProps: {
                children: 'children',
                label: 'title'
            },
            currentWorkplace: null,
            workLoading: true,
            formLoading: false,
            baseform1: {},
            baseform2: {},
            baseform3: {},
            formData: {},
            //应急防护列表
            accidentList: [],
            value: "",
            options: (() => {
                var rs = [];
                for (const tmp in this.$bubble.Dictionary.hazFactor) {
                    rs.push({ label: this.$bubble.Dictionary.hazFactor[tmp], value: tmp });
                }
                return rs;
            })(),
            formConfig: {
                first: [
                    { type: "textarea", text: "内容", name: "content", minRows: 10 },
                    {
                        type: "image", text: "承诺照片", name: "pic",
                        multiple: true,
                        headers: { loginTokensAnjian: 'Bearer' + this.$bubble.LS.getItem("token") }, onSuccess: (v) => {
                            res.object.url = uploadPrefix + res.object.url;
                            return v.object.url;
                        }
                    },
                ]
            }
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        workplaceSelect(v) { 
            this.currentWorkplace = v
        },
        submit(v, idx) {
            v;
        },
        addAccident() {
            if (this.accidentList.length == 6) {
                return;
            }
            this.accidentList.push({ type: "", content: "", key: parseInt(Math.random() * 10000) });
        },
        removeAccident(v) {
            this.accidentList.splice(this.accidentList.indexOf(v), 1);
        },
        submitAccident() {
            //应急防护列表
            this.accidentList
            //应急防护电话
            this.accidentPhone
        },
        setCardInfo(v, target) {
            this.$set(target, 'cardCode', v && v.cardCode || "");
            this.$set(target, 'createTime', v && v.createTime || "");
            this.$set(target, 'manager', v && v.manager || "");
            this.$set(target, 'telephone', v && v.telephone || "");
        },
        initTab1(cb) {
            // this.$bubble.request("threeCardInfo.getInfoTab1", { enterpriseId: 1, workId: this.currentWorkplace.id }).then((v) => {
            this.$bubble.request("threeCardInfo.getInfoTab1", { enterpriseId: Number(this.orgId) == this.orgId ? this.orgId :  this.currentWorkplace.id }).then((v) => {
                this.setCardInfo(v.record, this.baseform1);
                this.$set(this.baseform1, 'content', v.record.content);
                this.$set(this.baseform1, 'pic', v.record.pic);

            }).catch(e => {
                this.setCardInfo(null, this.baseform1);
                this.$set(this.baseform1, 'content', "");
                this.$set(this.baseform1, 'pic', []);
                // this.$alert("数据获取失败");
            }).finally(cb);
        },
        initTab2(cb) {
            // this.$bubble.request("threeCardInfo.getInfoTab2", { enterpriseId: 1, workId: this.currentWorkplace.id }).then((v) => {
            this.$bubble.request("threeCardInfo.getInfoTab2", { enterpriseId: Number(this.orgId) == this.orgId ? this.orgId :  this.currentWorkplace.id }).then((v) => {
                this.setCardInfo(v.record, this.baseform2);
                this.$set(this.baseform2, 'content', v.record.content);
                this.$set(this.baseform2, 'pic', v.record.pic);
            }).catch(e => {
                this.setCardInfo(null, this.baseform2);
                this.$set(this.baseform2, 'content', "");
                this.$set(this.baseform2, 'pic', []);
                // this.$alert("数据获取失败");
            }).finally(cb);
        },
        initTab3(cb) {
            // this.$bubble.request("threeCardInfo.getInfoTab3", { enterpriseId: 1, workId: this.currentWorkplace.id }).then((v) => {
            this.$bubble.request("threeCardInfo.getInfoTab3", { enterpriseId: Number(this.orgId) == this.orgId ? this.orgId :  this.currentWorkplace.id }).then((v) => {
                this.setCardInfo(v.record, this.baseform3);
                this.$set(this.baseform3, 'accidentPhone', v.record.phone);
                this.accidentList = v.record.emergencyCardDetailList && v.record.emergencyCardDetailList;
            }).catch(e => {
                this.setCardInfo(null, this.baseform3);
                this.$set(this.baseform3, 'accidentPhone', "");
                this.accidentList = [];
                // this.$alert("数据获取失败");
            }).finally(cb);
        },
        nodeSelect(v) {
            this.currentWorkplace = v
            
            console.log(v)
            this.formLoading = true;
            var count = 0;
            var loadOk = () => {
                if (++count == 3) {
                    this.formLoading = false;
                    this.$refs.BubbleForm1.initData();
                    this.$refs.BubbleForm2.initData();
                }
            }
            this.initTab1(loadOk);
            this.initTab2(loadOk);
            this.initTab3(loadOk);
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.title.indexOf(value) !== -1;
        },
        initTreeData_1() {
            this.$bubble.request("workPlace.tree", { pageNum: 1, pageSize: 500 }).then((v) => {
                this.data = v.record;
                this.currentWorkplace = v.record[0].children[0];
                this.workLoading = false;
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(this.currentWorkplace.id);
                    this.nodeSelect(this.currentWorkplace);
                })
            }).catch(e => {
                this.$alert("数据获取失败");
            });
        },
        initTreeData_2() {
            this.$bubble
                .request("searchCom.companyList", {cmyName: this.filterText})
                .then((v) => {
                    this.data = v.record;
                    this.currentWorkplace = v.record[0].children[0];
                    this.workLoading = false;
                    this.$nextTick(() => {
                        this.$refs.tree.setCurrentKey(this.currentWorkplace.id);
                        this.nodeSelect(this.currentWorkplace);
                    })
                })
                .catch((e) => {
                    this.$alert("数据获取失败");
                });
        },
    },
    created() {
        if(this.userType == 2) {
            this.initTreeData_2();
        } else {
            // this.initTreeData_1();
            console.log(this.orgId)
            this.nodeSelect({})
        }
    }
}
</script>

<style lang="scss" scoped>
.workplace-box {
    height: 100%;

    h1 {
        font-size: 22px;
        margin: 0;
        padding: 15px 10px;
        border-bottom: 1px #ddd solid;
    }

    ul {
        padding: 10px;
        margin: 0;

        li {
            height: 50px;
            line-height: 50px;
            transition: all 0.2s;
            padding: 0 10px;
            cursor: pointer;
            font-size: 16px;

            &:hover {
                color: #79bbff;
            }

            &.active {
                background: #409eff;
                color: #fff;
            }
        }
    }
}

.accident-box {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .input {
        margin-left: 20px;
        flex-grow: 1;
        display: flex;
        align-items: center;

        span {
            display: block;
            width: 80px;
        }

        .el-input {
            flex-grow: 1;
            margin-left: 15px;
        }
    }
}

.line {
    margin: 15px 0;
    height: 1px;
    background: #ebeef5;
}
</style>