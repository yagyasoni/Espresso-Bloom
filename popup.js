document.addEventListener('DOMContentLoaded', function() {
  // Theme definitions with RGB color values for Chrome themes
  const themes = [
    {
      id: 'taro-latte',
      name: 'Taro Latte',
      description: 'A creamy, pastel purple boba drink theme',
      colors: {
        frame: [166, 141, 168],         // Taro Purple #A68DA8
        toolbar: [107, 78, 49],         // Coffee Brown #6B4E31
        ntp_background: [245, 232, 217], // Creamy White #F5E8D9
        accent: [217, 167, 176]         // Dusty Pink #D9A7B0
      }
    },
    {
      id: 'brown-sugar',
      name: 'Brown Sugar Boba Coffee',
      description: 'Rich brown sugar and caramel tones',
      colors: {
        frame: [138, 85, 34],          // Warm Caramel #8A5522
        toolbar: [63, 42, 29],         // Deep Brown Sugar #3F2A1D
        ntp_background: [232, 217, 194], // Creamy Beige #E8D9C2
        accent: [31, 31, 31]           // Pearl Black #1F1F1F
      }
    },
    {
      id: 'matcha-espresso',
      name: 'Matcha Boba Espresso',
      description: 'Vibrant matcha green with espresso accents',
      colors: {
        frame: [123, 160, 91],         // Matcha Green #7BA05B
        toolbar: [74, 44, 31],         // Espresso Brown #4A2C1F
        ntp_background: [242, 237, 228], // Off-White Cream #F2EDE4
        accent: [169, 169, 169]        // Pearl Gray #A9A9A9
      }
    },
    {
      id: 'mocha-bliss',
      name: 'Mocha Boba Bliss',
      description: 'Chocolatey mocha with whipped cream',
      colors: {
        frame: [60, 47, 47],           // Chocolate #3C2F2F
        toolbar: [92, 64, 51],         // Mocha Brown #5C4033
        ntp_background: [248, 241, 233], // Whipped Cream #F8F1E9
        accent: [139, 90, 43]          // Cocoa Dust #8B5A2B
      }
    },
    {
      id: 'caramel-macchiato',
      name: 'Caramel Macchiato Boba',
      description: 'Layered caramel and espresso',
      colors: {
        frame: [198, 142, 23],         // Caramel Gold #C68E17
        toolbar: [51, 47, 44],         // Espresso Dark #332F2C
        ntp_background: [237, 228, 217], // Milky Beige #EDE4D9
        accent: [217, 179, 130]        // Soft Tan #D9B382
      }
    }
  ];

  const themeContainer = document.getElementById('themeContainer');
  const statusElement = document.getElementById('status');
  const instructionsElement = document.getElementById('instructions');

  function showStatus(message, isSuccess = true) {
    statusElement.textContent = message;
    statusElement.style.display = 'block';
    statusElement.style.backgroundColor = isSuccess ? '#e8f0fe' : '#feeae8';
    statusElement.style.color = isSuccess ? '#4285F4' : '#EA4335';
    setTimeout(() => statusElement.style.display = 'none', 5000);
  }

  function createThemeManifest(theme) {
    return {
      manifest_version: 3,
      name: `${theme.name} Boba Theme`,
      version: "1.0",
      description: theme.description,
      theme: {
        colors: {
          frame: theme.colors.frame,
          toolbar: theme.colors.toolbar,
          ntp_background: theme.colors.ntp_background,
          ntp_text: theme.colors.toolbar,
          ntp_link: theme.colors.accent,
          button_background: theme.colors.accent,
          tab_text: theme.colors.ntp_background,
          tab_background_text: theme.colors.toolbar,
          bookmark_text: theme.colors.ntp_background
        },
        tints: {
          buttons: [0.33, 0.5, 0.47],
          frame: [0.33, 0.5, 0.5],
          background_tab: [0.33, 0.5, 0.75]
        }
      }
    };
  }

  function downloadTheme(theme) {
    const manifest = createThemeManifest(theme);
    const manifestJson = JSON.stringify(manifest, null, 2);
    const blob = new Blob([manifestJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Download into a folder named after the theme ID with the file named manifest.json
    chrome.downloads.download({
      url: url,
      filename: `${theme.id}/manifest.json`,
      saveAs: false // Set to true if you want the user to choose the location
    }, (downloadId) => {
      if (downloadId) {
        chrome.storage.local.set({ selectedTheme: theme.id });
        document.querySelectorAll('.theme-card').forEach(card => {
          card.classList.remove('selected');
          if (card.dataset.themeId === theme.id) {
            card.classList.add('selected');
          }
        });
        showStatus(`${theme.name} theme downloaded! Install via Developer Mode.`);
        instructionsElement.style.display = 'block';
      } else {
        showStatus(`Failed to download ${theme.name}.`, false);
      }
      // Clean up the object URL
      URL.revokeObjectURL(url);
    });
  }

  themes.forEach(theme => {
    const themeCard = document.createElement('div');
    themeCard.className = 'theme-card';
    themeCard.dataset.themeId = theme.id;

    const colorPreview = document.createElement('div');
    colorPreview.className = 'color-preview';

    const frameSection = document.createElement('div');
    frameSection.className = 'color-section';
    frameSection.style.backgroundColor = `rgb(${theme.colors.frame.join(',')})`;

    const toolbarSection = document.createElement('div');
    toolbarSection.className = 'color-section';
    toolbarSection.style.backgroundColor = `rgb(${theme.colors.toolbar.join(',')})`;

    const bgSection = document.createElement('div');
    bgSection.className = 'color-section';
    bgSection.style.backgroundColor = `rgb(${theme.colors.ntp_background.join(',')})`;

    const accentSection = document.createElement('div');
    accentSection.className = 'color-section';
    accentSection.style.backgroundColor = `rgb(${theme.colors.accent.join(',')})`;

    colorPreview.appendChild(frameSection);
    colorPreview.appendChild(toolbarSection);
    colorPreview.appendChild(bgSection);
    colorPreview.appendChild(accentSection);

    const themeInfo = document.createElement('div');
    themeInfo.className = 'theme-info';

    const themeTitle = document.createElement('div');
    themeTitle.className = 'theme-title';
    themeTitle.textContent = theme.name;

    const themeDescription = document.createElement('div');
    themeDescription.className = 'theme-description';
    themeDescription.textContent = theme.description;

    themeInfo.appendChild(themeTitle);
    themeInfo.appendChild(themeDescription);

    themeCard.appendChild(colorPreview);
    themeCard.appendChild(themeInfo);

    themeCard.addEventListener('click', () => downloadTheme(theme));
    themeContainer.appendChild(themeCard);
  });

  chrome.storage.local.get('selectedTheme', function(data) {
    if (data.selectedTheme) {
      const selectedCard = document.querySelector(`.theme-card[data-theme-id="${data.selectedTheme}"]`);
      if (selectedCard) {
        selectedCard.classList.add('selected');
      }
    }
  });
});