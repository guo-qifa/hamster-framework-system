<template>
    <el-form-item :label="config.text" :rules="config.validField" :prop="config.name">
        <el-radio v-model="radio" label="1" @change="typeChange">按月</el-radio>
        <el-radio v-model="radio" label="3" @change="typeChange">按日期</el-radio>
        <el-radio v-model="radio" label="2" @change="typeChange">按星期</el-radio>
        <el-radio v-model="radio" label="4" @change="typeChange">按小时</el-radio>
        <el-select v-model="input" placeholder="请选择月份" v-if="radio == '1'" @change="update">
            <el-option v-for="item in options1" :key="item.value" :label="item.text" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="input" placeholder="请选择日期" v-if="radio == '3'" @change="update">
            <el-option v-for="item in options2" :key="item.value" :label="item.text" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="input" placeholder="请选择星期" v-if="radio == '2'" @change="update">
            <el-option v-for="item in options3" :key="item.value" :label="item.text" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="input" placeholder="请选择小时" v-if="radio == '4'" @change="update">
            <el-option v-for="item in options4" :key="item.value" :label="item.text" :value="item.value"></el-option>
        </el-select>
    </el-form-item>
</template>

<script>
export default {
    name: "taskTimer",
    props: ["value", "config", "fulldata"],
    data() {
        return {
            input: "",
            radio: "1",
            options1: [],
            options2: [],
            options3: [],
            options4: [],
        }
    },
    methods: {
        typeChange() {
            this.input = "";
            this.$emit("input", this.input);
        },
        update() {
            var rs = "";
            for (let i = 0; i < 5; i++) {
                rs += i == this.radio ? this.input : "#";
            }
            this.$emit("input", rs);
        },
        loop(i, fn) {
            var rs = [];
            for (var idx = 0; idx < i; idx++) {
                rs.push(fn(idx));
            }
            return rs;
        },
        initOption() {
            this.options1 = this.loop(12, v => {
                return { text: (v + 1) + "月", value: v + 1 };
            });
            this.options2 = this.loop(31, v => {
                v = v + 1;
                return { text: (v < 10 ? "0" + v : v) + "号", value: v };
            });
            this.options3 = [{ text: "星期一", value: 1 }, { text: "星期二", value: 2 }, { text: "星期三", value: 3 }, { text: "星期四", value: 4 }, { text: "星期五", value: 5 }, { text: "星期六", value: 6 }, { text: "星期日", value: 7 }];
            this.options4 = this.loop(24, v => {
                return { text: (v < 10 ? "0" + v : v) + "时", value: v };
            });
        },
        initValue() {
            if (this.value && this.value.split) {
                var l = this.value.split("#");
                var index = 0;
                for (let i = 0; i < l.length; i++) {
                    if (l[i] > 0) {
                        index = i;
                    }
                }
                this.radio = index + "";
                this.input = l[index];
            }
        }
    },
    created() {
        this.$watch("value", n => {
            this.initValue();
        })
        this.input = this.value;
        this.initOption();
        this.initValue();
    }
}
</script>

<style scoped>
.el-select {
    width: 100%;
}
</style>