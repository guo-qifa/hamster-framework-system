<template>
    <BubbleLayout :menu="menu" username="暴走金丝熊">
        <router-view />
        <template slot="footer">123</template>
    </BubbleLayout>
</template>

<script>
// @ is an alias to /src

export default {
    name: "Home",
    components: {},
    data() {
        return {
            menu: [
                // {
                //     title: "组件Demo",
                //     icon: "el-icon-s-operation",
                //     path: "/demo"
                // },
                {
                    title: "用户列表",
                    icon: "el-icon-user",
                    path: "/userList",
                }
            ]
        }
    },
    created() {
        this.$bubble.subscribe("loginout", () => {
            setTimeout(() => {
                this.$router.push('/login')
            }, 500);
        });
    }
};
</script>

<style lang="scss">
.home {
    text-align: center;
}
</style>