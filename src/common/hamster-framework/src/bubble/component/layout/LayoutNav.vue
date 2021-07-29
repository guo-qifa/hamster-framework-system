<template>
    <div class="nav-history-wrap" v-show="list.length">
        <div class="nav-history" ref="nav" @contextmenu.prevent="contextmenu($event)">
            <el-tabs v-model="activeName" closable type="border-card" @tab-click="handleClick" @tab-remove="tabRemove">
                <el-tab-pane v-for="(item, index) in list" :key="item.name" :label="item.title" :name="item.name">
                    <p style="float:left;" slot="label" @contextmenu.prevent.stop="contextmenu(item, index, $event)">{{item.title}}</p>
                </el-tab-pane>
            </el-tabs>
        </div>
        <ul class="contextmenu" :style="{ top: pos.top + 'px', left: pos.left + 'px' }" v-show="showContextmenu">
            <li @click.stop="close(0)">全部关闭</li>
            <li @click.stop="close(1)" v-show="menuType > 0 && menuType != 4">关闭其他</li>
            <li @click.stop="close(2)" v-show="menuType > 0 && menuType != 2 && menuType != 4">关闭左边</li>
            <li @click.stop="close(3)" v-show="menuType > 0 && menuType != 3 && menuType != 4">关闭右边</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "LayoutNav",
    data() {
        return {
            list: [],
            activeName: "",
            showContextmenu: false,
            menuType: 0,
            pos: { top: 0, left: 0 }
        }
    },
    methods: {
        close(type) {

        },
        handleClick(v) {
            var c = this.list.find(v => {
                return v.name == this.activeName;
            })
            this.$router.push(c.path);
        },
        tabRemove(v) {
            if (this.list.length == 1) {
                return;
            }
            var c = this.list.findIndex(data => {
                return data.name == v;
            });
            if (v == this.activeName) {
                if (c == 0) {
                    this.$router.push(this.list[c + 1].path);
                } else {
                    this.$router.push(this.list[c - 1].path);
                }
            }
            this.list.splice(c, 1);
        },
        contextmenu(item, index, e) {
            return;
            var event = index == undefined ? item : e;
            this.showContextmenu = true;
            this.pos = { top: event.offsetY + 10, left: event.offsetX + 10 };
            if (this.list.length == 1) {
                this.menuType = 4;
                this.showContextmenu = false;
                return;
            }
            if (index == undefined) {
                this.menuType = 0;
                return;
            }
            if (index == 0) {
                this.menuType = 2;
                return;
            }
            if (index == this.list.length - 1) {
                this.menuType = 3;
                return;
            }
        }
    },
    created() {
        var config = this.$bubble.config.navHistory;
        this.$router.beforeEach((v, f, next) => {
            var exist = this.list.find(data => {
                return data.name == v.name;
            })
            if (!exist) {
                this.list.push({ name: v.name, title: v.meta, path: v.path });
                this.activeName = v.name;
            } else {
                this.activeName = exist.name;
            }
            if (this.list.length) {
                this.$emit("show");
            }
            next();
        });
        document.body.addEventListener("click", e => {
            this.showContextmenu = false;
        });
    }
}
</script>

<style scoped lang="scss">
.nav-history-wrap {
    position: absolute;
    top: 59px;
    left: 0;
    width: 100%;
    height: 39px;
    background: #fff;
    border-bottom: 1px #ddd solid;
}
.nav-history {
    height: 39px;
    overflow: hidden;
    background: #fff;
}

.contextmenu {
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    background: #fff;
    border-radius: 5px;
    overflow: hidden;
    border: 1px #ddd solid;
    z-index: 10;

    li {
        text-align: center;
        height: 36px;
        line-height: 36px;
        cursor: pointer;
        transition: all 0.2s;
        border-bottom: 1px #ddd solid;

        &:hover {
            color: #409eff;
        }

        &:last-child {
            border: none;
        }
    }
}
</style>