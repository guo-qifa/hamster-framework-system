<template>
	<div style="width: 100%;height: 100%;">
		<BubbleBasicManage
			ref="promiseDetailInfo"
			:injectionSubmit="injectionSubmit"
			title=""
			type="promiseDetailInfo"
			label-width="160px"
			primaryKey="id"
			nodelete
			noedit
			noinsert
			:rowbtn="rowbtn"
		/>
	</div>
</template>
<script>
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
		}
	},
	data() {
		return {
			rowbtn: [
				{
					text: "查看",
					onclick: (...arg) => {
						this.lookPromiseFu(arg[0]);
					},
				},
			]
		};
	},
	created() {
		//初始化模态框配置
		this.$emit("setPageSize", 900);
		this.$emit("setPageTopSize", 110);
		this.$emit("setModalMove");
		this.$emit("setButtonCenter");

		this.$emit("setTitle", "承诺详情");
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
		//获取表格接口所需时间
		getPromiseTime() {
			var now = new Date();
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var day = now.getDate();
			month = month < 10 ? "0" + month : month;
			day = day < 10 ? "0" + day : day;
			return `${year}-${month}-${day} 0:0:0`;
		},
		lookPromiseFu(row) {
			this.$emit('hide')
			$channel.$emit("tabs", "threeCardInfoManagement");
			this.vueObj.$router.push({ name: "threeCardInfoManagement", query: { id: 134, cmyId: row.enterpriseId} });
		},
		injectionSubmit(u, n, s, q) {
			let promiseTime = this.getPromiseTime();
			let status = this.type;
			return new Promise((resolve, reject) => {
				var par = {pageNum: n, pageSize: s, promiseTime, status};

				this.$bubble.request("promiseDetailInfo.page", par).then((v) => {
					v.record.records.map(item => {item.status = status})
					resolve({
						data: {
							records: v.record.records,
							total: v.record.total,
						},
					});
				});
			});
		},
	}
};
</script>
<style lang="less" scoped>
</style>
