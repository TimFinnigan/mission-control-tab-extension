let screenDimensions = { width: 0, height: 0 };

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
						chrome.windows.getCurrent((window) => {
							chrome.storage.local.set({
								originalWindowId: window.id,
							});
						});
					}
				);

				xPos += windowWidth;
				if (xPos >= screenWidth) {
					xPos = 0;
					yPos += windowHeight;
				}
			});
		});
	} else if (request.action === 'windowClicked') {
		if (request.originalWindowId) {
			mergeAllWindows(request.originalWindowId);
		}
	}
});

function mergeAllWindows(originalWindowId) {
	chrome.windows.getAll({ populate: true }, (windows) => {
		const originalWindow = windows.find((w) => w.id === originalWindowId);
		if (!originalWindow) return;

		windows.forEach((window) => {
			if (window.id === originalWindowId) return;

			window.tabs.forEach((tab) => {
				chrome.tabs.move(tab.id, {
					windowId: originalWindow.id,
					index: -1,
				});
			});
			chrome.windows.remove(window.id);
		});

		chrome.windows.update(originalWindow.id, { focused: true });
	});
}
