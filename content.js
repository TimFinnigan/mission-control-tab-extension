chrome.runtime.sendMessage({
	action: 'screenDimensions',
	dimensions: { width: window.innerWidth, height: window.innerHeight },
});

document.addEventListener('keydown', (event) => {
	if (
		(event.metaKey || event.ctrlKey) &&
		event.shiftKey &&
		event.key === 'U'
	) {
		chrome.runtime.sendMessage({ action: 'show_tab_breakout' });
	}
});

document.addEventListener('click', () => {
	chrome.storage.local.get(
		['isOriginalWindow', 'originalWindowId'],
		(data) => {
			if (!data.isOriginalWindow && data.originalWindowId) {
				chrome.runtime.sendMessage({
					action: 'windowClicked',
					originalWindowId: data.originalWindowId,
				});
			}
		}
	);
});
