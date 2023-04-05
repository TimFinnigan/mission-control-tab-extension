chrome.runtime.sendMessage({
	action: 'screenDimensions',
	dimensions: {
		width: window.screen.availWidth,
		height: window.screen.availHeight,
	},
});
