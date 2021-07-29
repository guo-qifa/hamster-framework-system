<template>
    <div style="height: 100%;">
        <aside class="bubble-layout-sider i-scrollbar-hide" :class="{ miniMenu: currentMenuSize == 'mini', miniPage: currentPageSize == 'mini' }">
            <!-- 正常菜单 -->
            <LayoutMenu :menu="menu" v-if="currentPageSize == 'normal'" :currentMenuSize="currentMenuSize" :currentPageSize="currentPageSize"
                :class="{ miniMenu: currentMenuSize == 'mini' && currentPageSize == 'normal', miniPage: currentPageSize == 'mini' }" />
            <!-- 侧边菜单 -->
            <el-drawer v-if="currentPageSize == 'mini'" :withHeader="false" title="菜单" :visible.sync="menuDrawer" direction="ltr">
                <LayoutMenu :menu="menu" :currentMenuSize="currentMenuSize" :currentPageSize="currentPageSize"
                    :class="{ miniMenu: currentMenuSize == 'mini' && currentPageSize == 'normal', miniPage: currentPageSize == 'mini' }" />
            </el-drawer>
        </aside>
        <section class="bubble-layout" :class="{ miniMenu: currentMenuSize == 'mini', miniPage: currentPageSize == 'mini' }">
            <LayoutHeader :menuDrawer="menuDrawer" :username="username" :count="count" :currentPageSize="currentPageSize" :currentMenuSize="currentMenuSize" @toggleMenuSize="toggleMenuSize"
                :class="{ miniMenu: currentMenuSize == 'mini', miniPage: currentPageSize == 'mini' }" />
            <!-- 历史路由 -->
            <div class="bubble-layout-wrap" :class="{'has-nav': isShowNav}">
                <LayoutNav v-if="$bubble.config.navHistory && $bubble.config.navHistory.show" @show="showNav" />
                <main class="bubble-layout-content">
                    <el-card shadow="never">
                        <slot></slot>
                    </el-card>
                </main>
                <footer class="bubble-layout-footer" v-if="hasFooter">
                    <slot name="footer"></slot>
                </footer>
            </div>
        </section>
        <el-backtop target=".bubble-layout-wrap"></el-backtop>
    </div>
</template>

<script>
import LayoutMenu from "./LayoutMenu"
import LayoutHeader from "./LayoutHeader"
import LayoutNav from "./LayoutNav"

export default {
    name: "BubbleLayout",
    components: { LayoutMenu, LayoutHeader, LayoutNav },
    props: {
        menu: {
            type: Array,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        count: {
            type: Number,
            required: false,
            default: 0
        }
    },
    data() {
        return {
            //当前窗口大小,用于布局组件自适应
            currentPageSize: "normal",
            //当前菜单大小类型
            currentMenuSize: "normal",
            hasFooter: false,
            //顶部用户名
            name: "暴走金丝熊",
            menuDrawer: false,
            isShowNav: false
        }
    },
    methods: {
        showNav() {
            this.isShowNav = true;
        },
        toggleMenuSize(v) {
            if (this.currentPageSize == "mini") {
                this.menuDrawer = true;
            } else {
                this.currentMenuSize = v;
            }
        },
        initSize() {
            //全屏布局  侧边菜单
            if (window.innerWidth < 740) {
                this.currentPageSize = "mini"
            }
            //正常布局  收缩菜单
            if (window.innerWidth >= 740) {
                this.currentPageSize = "normal"
            }
            //正常布局  收缩菜单
            if (window.innerWidth >= 740 && window.innerWidth < 900) {
                this.currentMenuSize = "mini"
            } else {
                this.currentMenuSize = "normal"
            }
            //正常布局  展开菜单
            if (window.innerWidth >= 900) {
                this.currentMenuSize = "normal"
            }
        }
    },
    mounted() {
        //菜单以及页面布局切换
        window.addEventListener("resize", this.initSize);
        this.initSize();
        this.hasFooter = !!this.$slots.footer;
    }
}
</script>

<style lang="scss" scoped>
.bubble-layout-sider {
    width: 200px;
    height: 100%;
    float: left;
    overflow-x: hidden;
    background-color: #fff;
    transition: all 0.3s;
    box-shadow: 2px 116px 8px 0 rgba(29, 35, 41, 0.05);
    border-right: 1px #ddd solid;

    &.miniMenu {
        width: 65px;
    }

    &.miniPage {
        width: 0;
    }
}
.i-scrollbar-hide::-webkit-scrollbar {
    width: 0;
}

.bubble-layout {
    min-width: 560px;
    margin-left: 200px;
    height: 100%;
    overflow: hidden;
    background: #f0f2f5;
    position: relative;
    display: flex;
    flex: auto;
    flex-direction: column;
    min-height: 0;
    transition: all 0.3s;

    &.miniMenu {
        margin-left: 65px;
    }

    &.miniPage {
        margin-left: 0;
    }

    .bubble-layout-wrap {
        display: flex;
        flex: auto;
        flex-direction: column;
        min-height: 0;
        overflow-x: hidden;
        overflow-y: auto;
        margin-top: 60px;

        &.has-nav {
            padding-top: 50px;
        }

        .bubble-layout-content {
            flex: auto;
            padding: 10px;
        }

        .bubble-layout-footer {
            flex: 0 0 auto;
            padding: 10px;
        }
    }
}
</style>