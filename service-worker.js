let screenDimensions = { width: 0, height: 0 };

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'screenDimensions') {
		screenDimensions = request.dimensions;
	}
});

chrome.commands.onCommand.addListener((command) => {
	if (command === 'show_tab_breakout') {
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
				chrome.windows.create({
					tabId: tab.id,
					left: xPos,
					top: yPos,
					width: windowWidth,
					height: windowHeight,
					focused: index === 0,
				});

				xPos += windowWidth;
				if (xPos >= screenWidth) {
					xPos = 0;
					yPos += windowHeight;
				}
			});
		});
	}
});
