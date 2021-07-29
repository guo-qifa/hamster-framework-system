<template>
    <p>{{text}}</p>
</template>

<script>
var mapData = null;
var initRequest = false;
var callbackList = [];

export default {
    name: "gridId",
    props: ["data"],
    data() {
        return {
            text: "加载中.."
        }
    },
    methods: {
        setText() {
            var grid = mapData.find(v=>{
                return v.id == this.data.gridId;
            });
            this.text = grid ? grid.name : '暂无';
        }
    },
    created() {
        callbackList.push(this.setText);
        if (initRequest) {
            return;
        }
        initRequest = true;
        this.$bubble.request("grid.select", { userType: 2 }).then(v=>{
            mapData = v.record;
            callbackList.forEach(v=>{v()});
        }).catch(v=>{
            this.text = "加载失败";
        })
    }
}
</script>

<style lang="scss" scoped>
.supply-wrap {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px #ddd solid;

    .supply-item {
        display: flex;
        align-items: center;
        width: 50%;
        padding: 0 20px;

        span {
            display: block;
            width: 50px;
        }
    }
}
</style>