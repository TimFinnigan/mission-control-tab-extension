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
	chrome.runtime.sendMessage({ action: 'merge_windows' });
});
