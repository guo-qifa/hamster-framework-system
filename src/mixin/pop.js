export default {
    created(){
        //初始化模态框配置
		this.$emit("setPageSize", 900);
		this.$emit("setPageTopSize", 110);
		this.$emit("setModalMove");
		this.$emit("setButtonCenter");
		this.$emit("setPageActions", [
			{
				text: "取消",
				action: "save",
				handle: () => {
					this.$emit("hide");
				}
			}
		]);
    }
}