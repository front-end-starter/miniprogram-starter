interface WxsRegExp extends RegExp {
	constructor: 'RegExp';
}

declare function getRegExp(pattern: string, flags?: string): WxsRegExp;
