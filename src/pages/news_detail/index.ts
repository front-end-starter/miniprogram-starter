interface Data {
	news_detail: string;
}

interface Method {}

/**
 * 新闻详情页
 */
Page<Data, Method>({
	data: {
		news_detail: ''
	},

	async onLoad(query) {
		const self = this;

		wx.setNavigationBarTitle({
			title: query.title ?? ''
		});

		wx.request({
			url: query.link ?? '',
			success(res) {
				const news_detail = (res.data as string).match(/<div class="content" id="articleContent">[\s\S]*(?=<div class="news-links">)/);

				(news_detail === null) || self.setData({
					news_detail: news_detail[0].replace(/<img.* src="(.*?)" .*\/>/g, '<img src="$1" style="max-width: 100%;" />')
				});
			}
		});
	}
});
