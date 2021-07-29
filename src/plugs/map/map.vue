<template>
  <div class="mapBox" style="position: relative">
    <p class="tips">
      地图中 车间名称 为
      <span style="color: red">红色</span>的，是当前车间
    </p>
    <div class="lendgen">
      <p><i style="background: rgba(255, 0, 0, 0.4)"></i><span>一级</span></p>
      <p><i style="background: rgba(255, 165, 0, 0.4)"></i><span>二级</span></p>
      <p><i style="background: rgba(255, 255, 0, 0.5)"></i><span>三级</span></p>
      <p><i style="background: rgba(0, 0, 255, 0.4)"></i><span>四级</span></p>
    </div>
    <div id="map" class="mapView"></div>
    <input type="button" v-if="type != 'detail'" @click="draw()" class="btnApp" style="background: #efefef" value="绘制车间">
    <input type="button" @click="check()" class="btnApp" style="top: 60px; right: 15px; background: #efefef" value="2D/卫星">
  </div>
</template>
<script>
export default {
  props: ["config", "fulldata", "value"],
  data() {
    return {
      coorArr: [],
      flag:false,
      map: null, // 地图实例
      map3d: null, // 地图基础图层
      workListCoor: [],
      cmyCoor: "", // 公司现在所有的地标
      cmyCenter: [], // center  配置对象
      drawPolygon: null, // 地图配置
      personList: [], // 人员列表
      rowInfo: {},
      type: null
    };
  },
  mounted() {
    console.log('---------------------------------------')
    console.log(this.config, this.fulldata, this.value);
    console.log(this.config._this.$refs.list.$refs.list.rowInfo);
    console.log('---------------------------------------')
  },
  created() {
    if(this.config._this.currentRowData.id && this.fulldata.id) {
      this.type = 'detail'
      this.rowInfo = this.config._this.currentRowData;
    } else { 
      this.type = this.config._this.$refs.list.popType;
      if(this.type == 'edit') {
        this.rowInfo = this.config._this.$refs.list.$refs.list.rowInfo;
      }
    }

    console.log(this.type)
    this.getCmyCoor``;
    this.getWorkList``;
  },
  methods: {
    /**
     * @name:  获取数据
     * @Author: liuYaoYu
     * @param {*}
     * @return {*}
     * @Date: 2021-04-19 15:56:52
     * @LastEditTime: Do not Edit
     */
    getWorkList() {
      var that = this;
      this.$bubble.request("workPlace.map", {}).then((res) => {
        if (res.code == 0) {
          var arr = [];
          let { record: data } = res;
          for (var i = 0; i < data.length; i++) {
            if (data[i].coor && data[i].coor.length > 10) {
              if (
                JSON.parse(data[i].coor) &&
                JSON.parse(data[i].coor).length > 0
              ) {
                // 这边 判断了是不是  点击修改进来的 如果点击修改进来的 会进这个  判断
                if (this.type == "edit" || this.type == "detail") {
                  if (this.rowInfo.id != data[i].id) {
                    //是修改和新增的车间经纬度 除了当前的 修改的车间经纬度  ！=
                    if (
                      JSON.parse(data[i].coor) &&
                      JSON.parse(data[i].coorCenter)
                    ) {
                      var obj = {
                        coorArr: JSON.parse(data[i].coor),
                        coorCenter: JSON.parse(data[i].coorCenter),
                        workName: data[i].workName,
                        riskLevel: data[i].riskLevel,
                      };
                      arr.push(obj);
                    }
                  }
                } else {
                  //新增的所有车间经纬度
                  var obj = {
                    coorArr: JSON.parse(data[i].coor),
                    coorCenter: JSON.parse(data[i].coorCenter),
                    workName: data[i].workName,
                    riskLevel: data[i].riskLevel,
                  };
                  arr.push(obj);
                }
                this.workListCoor = arr;
              }
            }
          }
          if (this.type == "edit" || this.type == "detail") {
            if (
              this.rowInfo &&
              this.rowInfo.enterprisePojo &&
              this.rowInfo.enterprisePojo.coorCenter &&
              this.rowInfo.enterprisePojo.coorCenter.length > 10
            ) {
              var center = [];
              var coor = JSON.parse(this.rowInfo.enterprisePojo.coorCenter);
              this.cmyCoor = JSON.parse(this.rowInfo.enterprisePojo.coor);
              center.push(coor);
              this.cmyCenter = center;
             
              that.initMap(); //
            } else {
              this.cmyCoor = [];
              this.cmyCenter = [];
           
              that.initMap();
            }
          } else {
            this.getCmyCoor``;
          }
        }
      });
    },
    /**
     * @name: 获取渲染颜色
     * @Author: liuYaoYu
     * @param {*}
     * @return {*}
     * @Date: 2021-04-19 17:16:53
     * @LastEditTime: Do not Edit
     */
    async getCmyCoor() {
      let that = this;
      const res = await this.$bubble.request("workPlace.enter", {
        cmyId: localStorage.getItem('orgId'),
      });
      if (res.code == 0) {
        this.cmyCoor = JSON.parse(res.record[0].coor);
        var centerArr = [];
        centerArr.push(JSON.parse(res.record[0].coorCenter));
        this.cmyCenter = centerArr;
        this.initMap();
      } else {
        this.$Message.error({
          content: res.message,
          duration: 5,
          closable: true,
        });
      }
    },
    /**
     * @name: 初始化地图
     * @Author: liuYaoYu
     * @param {*}
     * @return {*}
     * @Date: 2021-04-19 10:44:37
     * @LastEditTime: Do not Edit
     */
    initMap() {
      //初始化三维地图控件
      const that = this;
      let d = this.cmyCenter;
      let center = [d[0].lng, d[0].lat];
     
      this.map3d = new BrightMap3D.Map("map", {
        mapType: BrightMap2D.MapType.NORMAL_OSM,
        // mapType: BrightMap3D.MapType.NORMAL_TIANDITU, //设置地图类型; lat--
        // || [118.858815, 31.962297]
        center, //设置地图初始中心点
        rotation: [-90, -30, 800], //设置地图初始姿态
        tk: that.$store.state.brightMapTk, //开发许可
        hdr: false, //设置底图的类型
      });
      this.map3d.scene.screenSpaceCameraController.enableTilt = false;
      this.drawPolygon = new BrightMap3D.DrawPolygonControl({
        fill: new BrightMap3D.Color(204, 204, 204, 0.1), //设置填充色
        lineColor: new BrightMap3D.Color(102, 102, 102, 1), //设置线颜色
        editing: false, //设置是否可编辑绘制好的图形
        midPoint: false, //在调整节点时，自动添加折线中点
        midPoint: true,
      });
      this.map3d.addControls(this.drawPolygon);
      if (this.cmyCoor.length > 0) {
        this.drawCmy(this.cmyCoor);
      }
      if (this.workListCoor.length > 0) {
      }
      this.drawWorks();
    },
    /**
     * @name: 绘制企业
     * @Author: liuYaoYu
     * @param {*}
     * @return {*}
     * @Date: 2021-04-20 14:43:30
     * @LastEditTime: Do not Edit
     */
    drawCmy(cmyCoor) {
      var coor = cmyCoor;
      var test = [];
      test.push(coor);
      var color = "";
      this.level = 4;
      if (this.level == "4") {
        color = new BrightMap3D.Color(0, 0, 0, 0.1);
      }
      if (this.level == "3") {
        color = new BrightMap3D.Color(255, 0, 0, 0.5);
      }
      if (this.level == "2") {
        color = new BrightMap3D.Color(255, 165, 0, 0.4);
      }
      if (this.level == "1") {
        color = new BrightMap3D.Color(255, 0, 0, 0.4);
      }
      color = new BrightMap3D.Color(0, 0, 0, 0.1);
      //固定的颜色，需要几个写几个
      for (var m = 0; m < test.length; m++) {
        var pointArr = [];
        var testarr = test[m];
        var col = color;
        for (var i = 0; i < testarr.length; i++) { 
          var lonlat = testarr[i];
          pointArr.push(lonlat.lng, lonlat.lat);
        }
        var editEntitys = new BrightMap3D.Polygon({
          position: pointArr, //设置坐标点数组，长度必须大于等于6
          color: col, //设置填充颜色，未设置纹理时有效
          outlineColor: new BrightMap3D.Color(0, 0, 0, 1), //可选，设置轮廓颜色
          clampToGround: false,
          height: 0.0,
          extrudedHeight: 0.0,
        });
        this.map3d.addOverlay(editEntitys);
      }
    },
    /**
     * @name: 绘制车间
     * @Author: liuYaoYu
     * @param {*}
     * @return {*}
     * @Date: 2021-04-19 10:25:45
     * @LastEditTime: Do not Edit
     */
    drawWorks() {
      var test = [];
      var test = this.workListCoor;
      if (
        this.rowInfo &&
        this.rowInfo.coor &&
        JSON.parse(this.rowInfo.coor) &&
        JSON.parse(this.rowInfo.coor).length > 0
      ) {
        if (
          this.rowInfo.coor &&
          this.rowInfo.coor.length > 0 &&
          JSON.parse(this.rowInfo.coor)
        ) {
          test.push({
            coorArr: JSON.parse(this.rowInfo.coor),
            coorCenter: JSON.parse(this.rowInfo.coorCenter),
            workName: this.rowInfo.workName,
            riskLevel: this.rowInfo.riskLevel,
            fontColor: true,
          });
        }
        this.drawWorkPlace(test);
      } else {
        this.drawWorkPlace(test);
      }
    },
    drawWorkPlace(test) {
      var color = "";
      for (var m = 0; m < test.length; m++) {
        var pointArr = [];
        var testarr = test[m];

        if (
          testarr.riskLevel == "01" ||
          testarr.riskLevel == "00" ||
          testarr.riskLevel == ""
        ) {
          color = new BrightMap3D.Color(0, 0, 255, 0.4); //蓝
        }
        if (testarr.riskLevel == "02") {
          color = new BrightMap3D.Color(255, 255, 0, 0.5); //黄rgba(255 255 0 / 50%)
        }
        if (testarr.riskLevel == "03") {
          color = new BrightMap3D.Color(255, 165, 0, 0.4); //255 165 0 / 50%
        }
        if (testarr.riskLevel == "04") {
          color = new BrightMap3D.Color(255, 0, 0, 0.4);
        }

        var col = color;
        var coors = testarr.coorArr;
        for (var i = 0; i < coors.length; i++) {
          var lonlat = coors[i];
          pointArr.push(lonlat.lng, lonlat.lat);
        }
        var editEntitys = new BrightMap3D.Polygon({
          position: pointArr, //设置坐标点数组，长度必须大于等于6
          color: col, //设置填充颜色，未设置纹理时有效
          outlineColor: new BrightMap3D.Color(255, 255, 255, 1.0), //可选，设置轮廓颜色
          clampToGround: false,
          height: 0.0,
          extrudedHeight: 0.0,
        });
        this.map3d.addOverlay(editEntitys);
        if (testarr.coorCenter) {
          if (testarr.fontColor) {
            this.addLabel(
              testarr.coorCenter,
              testarr.workName,
              Cesium.Color.RED
            );
          } else {
            this.addLabel(
              testarr.coorCenter,
              testarr.workName,
              Cesium.Color.BLACK
            );
          }
        } else {
          if (testarr.fontColor) {
            this.addLabel(
              testarr.coorArr[1],
              testarr.workName,
              Cesium.Color.RED
            );
          } else {
            this.addLabel(
              testarr.coorArr[1],
              testarr.workName,
              Cesium.Color.BLACK
            );
          }
        }
      }
    },
    draw() {
        this.drawPolygon.deactive();
        this.drawPolygon.active(this.drawComplete1);
    },
    //绘制结束回调
    drawComplete1(positions) {
      var pointArr = [];
      this.coorArr = [];
      for (var i = 0; i < positions.length; i++) {
        var lonlat = BrightMap3D.Convertor.worldToDegree(positions[i]);
        var lng = lonlat.lng;
        var lat = lonlat.lat;
        pointArr.push([lng, lat]);
        this.coorArr.push({
          lng: lng,
          lat: lat,
        });
      }
      this.drawPolygon.deactive();
      this.fulldata.coor = JSON.stringify(this.coorArr);
      return;
    },
    /**
     * @name: 切换模式 2D/卫星
     * @Author: liuYaoYu
     * @param {*}
     * @return {*}
     * @Date: 2021-04-19 10:26:13
     * @LastEditTime: Do not Edit
     */
    check() {
      if (!this.flag) {
        this.flag = true;
        this.map3d.setMapType(BrightMap3D.MapType.SATELLITE_ARCGIS);
      } else {
        this.flag = false;
        this.map3d.setMapType(BrightMap3D.MapType.NORMAL_OSM);
      }
    },

    //绘制文字
    addLabel(Centerlonlat, textLabel, fontColor) {
      var lng = Centerlonlat.lng;
      var lat = Centerlonlat.lat;
      this.map3d.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lng, lat, 20.61),
        label: {
          text: textLabel,
          font: "14pt Source Han Sans CN", //字体样式
          fillColor: fontColor,
          // fillColor: "red",       //字体颜色
          backgroundColor: Cesium.Color.AQUA, //背景颜色
          showBackground: false, //是否显示背景颜色
          style: Cesium.LabelStyle.FILL, //label样式
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.CENTER, //垂直位置
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT, //水平位置
          // pixelOffset:new Cesium.Cartesian2(10,0)            //偏移
        },
        distanceDisplay: 1200, //可选，设置在离相机多少距离时显示，单位米
      });
    },

    /**
     * @name: 获取人员列表
     * @Author: liuYaoYu
     * @param {*}
     * @return {*}
     * @Date: 2021-04-20 14:38:18
     * @LastEditTime: Do not Edit
     */
    async getPersonData() {
      var that = this;
      const res = await this.$http.post(
        `${this.$store.state.ajaxUrl}` + "personnel/queryBean",
        { cmyId: localStorage.orgId }
      );
      if (res.data.code == 0) {
      
        this.personList = res.data.object;
        if (this.rowInfo) {
          // this.formItem.chargeName = this.getPerson(this.rowInfo);
        } else {
          this.formItem.chargeName = "";
        }
      } else {
        this.$Message.error({
          content: res.data.message,
          duration: 5,
          closable: true,
        });
      }
    },

    /**
     * @name: 获取人员名称  =====   目前这个方法 不需要  =====
     * @Author: liuYaoYu
     * @param {*}
     * @return {*}
     * @Date: 2021-04-20 14:37:37
     * @LastEditTime: Do not Edit
     */
    getPerson(row) {
      var data = this.personList;
      var str = "";
      for (var i = 0; i < data.length; i++) {
        if (row.charge == data[i].id) {
          str = data[i].name;
          return str;
        }
      }
      return str;
    },
  },
};
</script>

<style scoped lang="scss">
/*地图窗口样式定义*/
.mapBox {
  overflow: hidden;
  height: 500px;
}
.lendgen {
  p {
    margin: 10px 0;
    i {
      display: inline-block;
      width: 30px;
      height: 20px;
      border-radius: 5px;
      margin-right: 10px;
      vertical-align: text-bottom;
    }
    span {
      display: inline-block;
      width: 30px;
      height: 20px;
      line-height: 20px;
    }
  }
  position: absolute;
  top: 60px;
  left: 30px;
  padding: 8px 10px;
  background: #fff;
  font-size: 15px;
  font-weight: 700;
  border-radius: 8px;
  z-index: 9999;
}
.tips {
  position: absolute;
  top: 10px;
  left: 30px;
  padding: 8px 10px;
  background: #fff;
  font-size: 18px;
  font-weight: 700;
  border-radius: 8px;
  z-index: 9999;
}
.mapView {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
/*页面功能按钮*/
.btnApp {
  cursor: pointer;
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 14px;
  width: 120px;
  height: 32px;
}
</style>