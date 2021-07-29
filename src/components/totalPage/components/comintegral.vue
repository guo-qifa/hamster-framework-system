<template>
	<div style="width: 100%;height: 100%;">
		<BubbleBasicManage
			ref="comintegral"
			:injectionSubmit="injectionSubmit"
			title=""
			type="comintegral"
			label-width="160px"
			primaryKey="id"
			:showPage="false"
			nodelete
			noedit
			noinsert
			:rowbtn="rowbtn"
		/>
	</div>
</template>
<script>
import Qs from "qs";
export default {
	components: {},
	props: {
		type: {
			type: String,
			default() {
				return "0";
			}
		},
		vueObj: {
			type: Object,
			default() {
				return {};
			}
		},
	},
	data() {
		return {
			rowbtn: [
				{
					text: "记分详情",
					onclick: (...arg) => {
						this.scoreDetail(arg[0]);
					},
				},
			]
		};
	},
	created() {
		//初始化模态框配置
		this.$emit("setPageSize", 1200);
		this.$emit("setPageTopSize", 110);
		this.$emit("setModalMove");
		this.$emit("setButtonCenter");

		this.$emit("setTitle", "记分企业列表");
		this.$emit("setPageActions", [
			{
				text: "取消",
				action: "save",
				handle: () => {
					this.$emit("hide");
				}
			}
		]);
	},

	mounted: function() {},
	watch: {},
	computed: {},
	methods: {
		scoreDetail(row) {
			this.$emit('hide')
			$channel.$emit("tabs", "scoreManagement");
			this.vueObj.$router.push({
				name: "scoreManagement",
				query: { id: 428, cmyId: row.id }
			});
		},
		injectionSubmit(u, n, s, q) {
			let type = this.type;
			return new Promise((resolve, reject) => {
				var par = {type};

				this.$bubble.request("comintegral.page", par).then((v) => {
					v.record.map(item => {item.type = type})
					resolve({
						data: {
							records: v.record,
							total: v.record.length,
						},
					});
				});
			});
		},
	}
};
</script>
<style lang="less" scoped></style>
