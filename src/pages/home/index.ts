import { DOMParser } from 'xmldom';


/**
 * 新闻
 */
interface News {
	title?: string;
	link?: string;
	category?: string;
	description?: string;
	pub_date?: string;
	guid?: string;
}

interface Data {
	news_list?: News[];
}

interface Method {}

/**
 * 首页
 */
Page<Data, Method>({
	data: {
		news_list: []
	},

	async onLoad(query) {
		const self = this;

		wx.request({
			url: 'https://www.oschina.net/news/rss',
			success(res) {
				const doc = new DOMParser().parseFromString(
					res.data as string, 'application/xml'
				);

				const items = Array.from(
					doc.getElementsByTagName('item')
				);

				const get_node_value = (target: Element, node_name: string) => {
					return target
						.getElementsByTagName(node_name)
						.item(0)
						?.firstChild
						?.nodeValue
						?? ''
					;
				};

				const news_list: News[] = items.reduce((news_list, item) => {
					const news: News = {
						title: get_node_value(item, 'title'),
						link: get_node_value(item, 'link'),
						category: get_node_value(item, 'category'),
						description: get_node_value(item, 'description'),
						pub_date: get_node_value(item, 'pubDate'),
						guid: get_node_value(item, 'guid')
					};

					news_list.push(news);

					return news_list;
				}, [] as News[]);

				self.setData({ news_list: news_list });
			}
		});
	}
});
