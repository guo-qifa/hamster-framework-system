<template>
  <ul v-loading="mapLoading">
    <li v-for="(item, index) in list" :key="item.key" class="supply-wrap">
      <div class="supply-item">
        <span>物资</span>
        <BubbleObjectChoiceInput
          ref="object"
          config="emergencyThings"
          :search="search"
          v-model="item.matId"
          @change="
            (v) => {
              typeChoice(v, item);
            }
          "
          :defaultSelected="item.defaultSelected"
        />
      </div>
      <div class="supply-item">
        <span>数量</span>
        <el-input-number
          v-model="item.count"
          :min="0"
          placeholder="请输入物资数量"
        >
        </el-input-number>
        <el-button
          size="mini"
          style="margin-left: 15px"
          icon="el-icon-delete"
          type="danger"
          v-show="index > 0"
          @click="remove(item, index)"
          >移除
        </el-button>
      </div>
    </li>
    <p class="text-center">
      <el-button
        size="medium"
        icon="el-icon-circle-plus-outline"
        type="primary"
        @click="add"
        >添加物资</el-button
      >
    </p>
  </ul>
</template>

<script>
export default {
  name: "PlanSupply",
  props: ["value", "config", "fulldata"],
  data(mapLoading) {
    return {
      list: [{ matId: 1, count: 10 }],
      search: [],
      mapData: {},
      mapLoading: mapLoading,
    };
  },
  methods: {
    remove(item, idx) {
      this.list.splice(this.list.indexOf(item), 1);
      this.update();
    },
    add() {
      this.list.push({ matId: "", count: 0 });
      this.update();
    },
    typeChoice(v, item) {
      item.matId = v;
      this.update();
    },
    update() {
      this.$emit(
        "input",
        this.list.slice().map((v) => {
          var rs = Object.assign({}, v);
          delete rs.key;
          delete rs.name;
          delete rs.defaultSelected;
          return rs;
        })
      );
    },
    initValue() {
      if (this.value && this.value.length) {
        this.list = this.value.slice();
        this.list.forEach((v) => {
          v.key = parseInt(Math.random() * 10000000);
          v.name = this.mapData[v.matId];
          v.defaultSelected = { text: v.name, value: v.matId };
        });
      } else {
        this.list = [];
      }
    },
    initMapData() {
      this.$bubble
        .request("emergencyThings.select", {})
        .then((v) => {
          v.record.forEach((v) => {
            this.mapData[v.id] = v.name;
          });
          this.initValue();
        })
        .catch((v) => {
          this.$alert("数据获取失败");
        })
        .finally((v) => {
          this.mapLoading = false;
        });
    },
  },
  created() {
    this.$watch("value", (n) => {
      this.initValue();
    });
    this.initMapData();
  },
};
</script>

<style lang="scss" scoped>
.supply-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px #ddd solid;
  box-sizing: border-box;
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