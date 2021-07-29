<!--
 * @Descripttion: 
 * @Author: liuYaoYu
 * @Date: 2021-04-20 11:40:38
 * @LastEditors: liuYaoYu
 * @LastEditTime: 2021-04-26 10:17:16
-->
<template>
  <div class="details">
    <div class="formBox">
      <el-form label-width="140px" :model="formData">
        <el-form-item label="风险点名称" prop="riskName">
          <el-input size="mini" disabled v-model="formData.riskName"></el-input>
        </el-form-item>
        <el-form-item label="所属车间" prop="workName">
          <el-input size="mini" disabled v-model="formData.workName"></el-input>
        </el-form-item>
        <el-form-item label="风险点所在位置" prop="riskLocation">
          <el-input size="mini" disabled v-model="formData.riskLocation"></el-input>
        </el-form-item>
        <el-form-item label="生产工艺" prop="craft">
          <el-input
            size="mini"
            v-model="craftTypeList[formData.craft]"
            disabled
          ></el-input>
        </el-form-item>
        <el-col class="col">
          <el-form-item label="经度" prop="longitude">
            <el-input size="mini" disabled v-model="longitude"></el-input>
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <el-input size="mini" disabled v-model="latitude"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div class="map">
      <Map></Map>
    </div>
  </div>
</template>

<script>
import Map from "../map/map";
import dictionary from "../../config/dictionary";
export default {
  props: ['formData'],
  data() {
    return {
      longitude: '',
      latitude: '',
      craftTypeList: []
    };
  },
  components: {Map},
  created() {
    this.craftTypeList = dictionary.craftType;
    //经纬度
    if(this.formData.coor && this.formData.coor.indexOf('[') > -1 && this.formData.coor.indexOf(']') > -1) {
      this.formData.coor = JSON.parse(this.formData.coor);
      if(this.formData.coor.length == 2) {
        this.longitude = this.formData.coor[0];
        this.latitude = this.formData.coor[1];
      }
    }
  }

};
</script>

<style lang="scss" scoped>
.details {
  display: flex;
  justify-content: space-between;
}
.formBox {
  width: 48.5%;
}
.map {
  width: 48.5%;
  // background: red;
}
.col {
  display: flex;
  justify-content: space-around;
}
</style>