chrome.tabs.query({ active: true, currentWindow: true }, function callback(tabs) {
  if ( tabs[0].url.indexOf('://progtest.fit.cvut.cz') == -1 &&
    tabs[0].url.indexOf('://ptmock.localhost') == -1){
    chrome.tabs.create({ url: "https://progtest.fit.cvut.cz/"})
    if (tabs[0].url.indexOf("://newtab") != -1) {
      chrome.tabs.remove(tabs[0].id);
    }
  }
})

function save_options() {
  var theme = document.getElementById('theme').value;
  var hide = document.getElementById('dropdown').checked;
  var notify = document.getElementById('notifications').checked;
  var highlight = document.getElementById('highlighting').checked;
  var sound = document.getElementById('sounds').checked;
  chrome.storage.sync.set({
    selectedTheme: theme,
    autoHide: hide,
    notifications: notify,
    highlighting: highlight,
    sounds: sound
  }, function () {
    var status = document.getElementById('status');
    status.textContent = 'Option saved';
    chrome.tabs.reload({bypassCache: true});
    setTimeout(function () {
      status.textContent = '';
    }, 1500);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    selectedTheme: 'light',
    autoHide: true,
    notifications: true,
    highlighting: true,
    sounds: true
  }, function (items) {
    document.getElementById('theme').value = items.selectedTheme;
    document.getElementById('dropdown').checked = items.autoHide;
    document.getElementById('notifications').checked = items.notifications;
    document.getElementById('highlighting').checked = items.highlighting;
    document.getElementById('sounds').checked = items.sounds;
    hideDropdown()
  });
}

function hideDropdown() {
  var dd = document.getElementById('config')
  if (document.getElementById('theme').value.includes('orig')) {
    dd.style.display = "none";
  } else {
    dd.style.display = "block";
  }
}

document.getElementById('theme').addEventListener('change', hideDropdown)
document.addEventListener('DOMContentLoaded', restore_options)
document.getElementById('save').addEventListener('click', save_options)
