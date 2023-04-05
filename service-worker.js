chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'screenDimensions') {
		screenDimensions = request.dimensions;
	} else if (request.action === 'show_tab_breakout') {
		chrome.tabs.query({ currentWindow: true }, (tabs) => {
			const screenWidth = screenDimensions.width;
			const screenHeight = screenDimensions.height;
			const windowWidth = Math.floor(
				screenWidth / Math.ceil(Math.sqrt(tabs.length))
			);
			const windowHeight = Math.floor(
				screenHeight / Math.ceil(Math.sqrt(tabs.length))
			);

			let xPos = 0;
			let yPos = 0;

			tabs.forEach((tab, index) => {
				const tabId = tab.id;
				chrome.windows.create(
					{
						tabId: tabId,
						left: xPos,
						top: yPos,
						width: windowWidth,
						height: windowHeight,
						focused: index === 0,
					},
					(newWindow) => {
						chrome.storage.sync.set({ isOriginalWindow: false });
						if (index === 0) {
							chrome.storage.local.set({
								originalWindowId: newWindow.id,
							});
						}
					}
				);

				xPos += windowWidth;
				if (xPos >= screenWidth) {
					xPos = 0;
					yPos += windowHeight;
				}
			});
		});
	} else if (request.action === 'merge_windows') {
		mergeAllWindows();
	}
});

function mergeAllWindows() {
	chrome.windows.getAll({ populate: true }, (windows) => {
		const activeWindowId = windows.find((w) => w.focused === true).id;
		const activeTabIndex = windows
			.find((w) => w.focused === true)
			.tabs.findIndex((t) => t.active === true);

		windows.forEach((window) => {
			if (window.id === activeWindowId) return;

			window.tabs.forEach((tab, index) => {
				chrome.tabs.move(tab.id, {
					windowId: activeWindowId,
					index: activeTabIndex + index + 1,
				});
			});
			chrome.windows.remove(window.id);
		});

		chrome.windows.update(activeWindowId, { focused: true });
	});
}
