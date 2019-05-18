chrome.tabs.query({ active: true, currentWindow: true }, function callback(tabs) {
  if (tabs[0].url.indexOf('://progtest.fit.cvut.cz') == -1)
  chrome.tabs.create({url: "https://progtest.fit.cvut.cz/"})
})

function save_options() {
  var theme = document.getElementById('theme').value;
  chrome.storage.sync.set({
    selectedTheme: theme
  }, function () {
    var status = document.getElementById('status');
    status.textContent = 'Option saved';
    chrome.tabs.reload();
    setTimeout(function () {
      status.textContent = '';
    }, 1500);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    selectedTheme: 'light'
  }, function (items) {
    document.getElementById('theme').value = items.selectedTheme;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);