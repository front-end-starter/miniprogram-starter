/**
 * object 转 查询字符串
 */
const obj_to_query_string: (
	obj: { [key: string]: any }
) => string = (obj) => {
	const items = JSON.stringify(obj)
		.match(getRegExp('".*?":.*?((?=,")|(?=}$))', 'g'))
	;

	if (items === null) {
		return '';
	}

	const query_string = items.reduce((
		query_string,
		item
	) => {
		const item_obj = item
			.match(getRegExp('^"(?<key>.*?)":["](?<value>.*?)["]$'))
		;

		if (item_obj === null) {
			return query_string;
		}

		if (query_string.length !== 0) {
			query_string += '&'
		}

		return `${query_string}${item_obj[1]}=${item_obj[2]}`;
	}, '');

	return query_string;
};

module.exports = obj_to_query_string;
