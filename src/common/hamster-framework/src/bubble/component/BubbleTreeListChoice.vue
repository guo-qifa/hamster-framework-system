<template>
    <transition name="el-fade-in">
        <div class="object-choice-box" v-show="visible" @click="close($event)">
            <el-card class="wrap-card">
                <div slot="header" class="clearfix">
                    <span>{{tableChoiceConfig.title}}</span>
                    <button type="button" aria-label="Close" style="float: right;" class="el-dialog__headerbtn" @click="close()"><i class="el-dialog__close el-icon  el-icon-close"></i></button>
                    <el-button style="float: right; padding: 3px 10px" type="text" @click="onCreate()" v-if="create">新增
                    </el-button>
                </div>
                <div style="overflow: hidden;">
                    <el-tree ref="tree" class="tree-choice-list" v-loading="loading" :data="treeData" :node-key="treeChoiceConfig.valueKey" default-expand-all @node-click="onRowClick"
                        highlight-current :expand-on-click-node="false">
                        <span class="custom-tree-node custom-tree-node-content" slot-scope="{ data }">
                            {{ data[label] }}
                        </span>
                    </el-tree>
                    <BubbleList class="object-choice-list" :dataKey="tableChoiceConfig.valueKey" ref="table" :rurl="rurl || tableChoiceConfig.url" :type="type || tableChoiceConfig.type"
                        :defaultFilter="tableFilter" @selectChange="choice" :afterLoad="afterLoad" :search="search || tableChoiceConfig.search" :treeTable="treeTable || tableChoiceConfig.treeTable"
                        :selectMode="selectMode || tableChoiceConfig.selectMode" :radio="!tableChoiceConfig.hideOnClick" :defaultSelected="tableDefaultSelect" />
                    <div class="object-choice-select-list">
                        <p class="title">已选数据</p>
                        <el-table :data="currentSelect" style="width: 100%" size="small" border>
                            <el-table-column prop="text" :label="tableChoiceConfig.textName || '数据名'">
                            </el-table-column>
                            <el-table-column label="操作" width="100">
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" @click="deleteSelect(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div style="overflow: hidden;">
                    <div class="line"></div>
                    <el-button class="pull-right" style="margin-left:10px;" size="medium" type="primary" @click="submit()">提交</el-button>
                    <el-button class="pull-right" style="margin-left:10px;" size="medium" type="default" @click="close()">关闭</el-button>
                </div>
            </el-card>
        </div>
    </transition>
</template>

<script>
export default {
    name: "BubbleTreeListChoice",
    props: {
        //弹窗标题
        title: {
            type: String,
            required: false
        },
        //表格字段配置
        type: {
            type: String,
            required: false
        },
        //树配置
        treeType: {
            type: String,
            required: false
        },
        //请求地址
        rurl: {
            type: String,
            required: false
        },
        //树状结构的源数据
        treeTable: {
            type: String,
            required: false
        },
        tableConfig: {
            type: [String, Object],
            required: true
        },
        treeConfig: {
            type: [String, Object],
            required: true
        },
        //表格通过该字段名关联树ID
        linkedKey: {
            type: String,
            required: true
        },
        //默认筛选参数
        defaultFilter: {
            type: [Object, Array],
            required: false
        },
        //表格搜索配置
        search: {
            type: Array,
            required: false
        },
        visible: {
            type: Boolean,
            required: true
        },
        selectMode: {
            type: String,
            required: false,
            default: "single"
        },
        //默认选中项
        defaultSelected: {
            type: [Array, Object],
            required: false
        }
    },
    data() {
        return {
            label: typeof this.treeConfig === 'string' ? this.$bubble.ChoiceConfig[this.treeConfig].textKey : this.treeConfig.textKey,
            create: false,
            svisible: false,
            loading: true,
            treeData: [],
            selectData: null,
            tableFilter: this.defaultFilter && this.defaultFilter.table
        }
    },
    computed: {
        tableChoiceConfig() {
            if (typeof this.tableConfig === 'string') {
                return this.$bubble.ChoiceConfig[this.tableConfig]
            } else {
                return this.tableConfig;
            }
        },
        treeChoiceConfig() {
            if (typeof this.treeConfig === 'string') {
                return this.$bubble.ChoiceConfig[this.treeConfig]
            } else {
                return this.treeConfig;
            }
        },
        tableDefaultSelect() {
            if (this.defaultSelected) {
                if (this.selectMode == "single") {
                    return this.defaultSelected.value;
                } else {
                    return this.defaultSelected.map(v => {
                        return v.value
                    })
                }
            }
        },
        currentSelect() {
            if (!this.selectData) {
                return [];
            }
            if (this.selectData instanceof Array) {
                return this.selectData;
            }
            return [this.selectData]
        }
    },
    methods: {
        deleteSelect(v) {
            if (this.selectData instanceof Array) {
                for (let i = 0; i < this.selectData.length; i++) {
                    const element = this.selectData[i];
                    if (element.value == v.value) {
                        this.$refs.table.deleteSelect(this.selectData[i].value);
                        this.selectData.splice(i, 1);
                        if (!this.selectData.length) {
                            this.selectData = null;
                        }
                        break;
                    }
                }
            } else {
                this.$refs.table.deleteSelect(this.selectData.value);
                this.selectData = null;
            }
        },
        afterLoad(v) {
            if (this.treeChoiceConfig.fixed) {
                return this.treeChoiceConfig.fixed(v);
            } else {
                return v;
            }
        },
        choice(v) {
            if (this.selectMode == "single" && !v) {
                return;
            }
            if (this.selectMode == "single") {
                if (!this.selectData || this.selectData.value != v[this.tableChoiceConfig.valueKey]) {
                    this.selectData = { text: v[this.tableChoiceConfig.textKey], value: v[this.tableChoiceConfig.valueKey] };
                }
            } else {
                var _this = this;
                this.selectData = v.map(v => {
                    if (v[this.tableChoiceConfig.textKey]) {
                        return { text: v[_this.tableChoiceConfig.textKey], value: v[_this.tableChoiceConfig.valueKey] }
                    } else {
                        for (let i = 0; i < _this.selectData.length; i++) {
                            if (v[_this.tableChoiceConfig.valueKey] == _this.selectData[i].value) {
                                return _this.selectData[i];
                            }
                        }
                    }
                })
            }
        },
        onCreate() {
            this.$emit("oncreate");
        },
        submit() {
            this.$emit("onselect", this.selectData instanceof Array && (!this.selectData || !this.selectData.length) ? null : this.selectData);
            this.close();
        },
        close(e) {
            if (!e || e.target === e.currentTarget) {
                this.svisible = false;
                this.$refs.table.clearSelection();
                this.selectData = null;
            }
        },
        getRowVal(v, k) {
            if (k.indexOf(".") >= 0) {
                var s = k.split(".");
                return v[s[0]] ? v[s[0]][s[1]] : "";
            } else {
                return v[k];
            }
        },
        onRowClick(v) {
            this.tableFilter = [{ field: this.linkedKey, logic: "=", value: v[this.treeChoiceConfig.valueKey] }];
        },
        initDefaultSelected(v) {
            try {
                this.selectData = JSON.parse(JSON.stringify(v));
            } catch (error) {
                this.selectData = null;
            }
        },
        initTreeSouce(v, c) {
            var rs = [];
            for (var i = 0; i < v.length; i++) {
                rs.push(v[i]);
                if (v[i][this.treeChoiceConfig.childrenKey] && v[i][this.treeChoiceConfig.childrenKey].length) {
                    rs[rs.length - 1].children = this.initTreeSouce(v[i][this.treeChoiceConfig.childrenKey], true);
                }
            }
            return rs;
        },
        initTreeData() {
            this.loading = true;
            this.$bubble.requestTree(this.rurl ? this.rurl : this.treeChoiceConfig.url, this.defaultFilter ? this.defaultFilter.tree : undefined).then((v) => {
                if (v.errorcode) { 
                    this.$alert("数据获取失败");
                } else {
                    this.treeData = this.initTreeSouce(v.record instanceof Array ? v.record : [v.record]);
                    this.loading = false;
                }
            });
        }
    },
    created() {
        if (this._events.oncreate) {
            this.create = true;
        }
        this.$watch("defaultSelected", this.initDefaultSelected);
        this.initDefaultSelected(this.defaultSelected);
        this.$watch("visible", function (n, o) {
            this["svisible"] = !!n;
            if (n) {
                this.tableFilter = this.defaultFilter && this.defaultFilter.table;
                this.$refs.tree.setCurrentKey();
                this.$refs.table && this.$refs.table.initSelected();
                this.initDefaultSelected(this.defaultSelected);
            }
            this.$watch("svisible", (n, o) => {
                this.$emit('update:visible', !!n);
            });
        }.bind(this));
        this.initTreeData();
    }
};
</script>

<style lang="scss" scoped>
.object-choice-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2080;
    overflow: auto;
    background: rgba(0, 0, 0, 0.3);
}

.object-choice-box .wrap-card {
    position: absolute;
    top: 15%;
    left: 10%;
    width: 80%;
}

.object-choice-box td {
    cursor: pointer;
}

.object-choice-list {
    width: 50%;
    float: left;
}

.object-choice-select-list {
    width: 30%;
    float: left;
    padding: 0 30px;
    box-sizing: border-box;

    .title {
        font-size: 16px;
        height: 40px;
        line-height: 40px;
    }
}

.tree-choice-list {
    width: 20%;
    float: left;
}
</style>