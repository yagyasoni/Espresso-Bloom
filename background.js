chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'updateTheme') {
      chrome.theme.update({
          colors: {
              frame: message.theme.colors.frame,
              tab: message.theme.colors.tab,
              toolbar: message.theme.colors.toolbar,
              omnibox_background: message.theme.colors.addressBar,
              tab_text: message.theme.colors.text,
              bookmark_text: message.theme.colors.text
          }
      });
      sendResponse({status: 'theme updated'});
  }
});