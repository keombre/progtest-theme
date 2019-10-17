browser.tabs.query({ active: true, currentWindow: true }, function callback(tabs) {
  if (tabs[0].url.indexOf('://progtest.fit.cvut.cz') == -1 &&
      tabs[0].url.indexOf('://ptmock.localhost') == -1)
    browser.tabs.create({url: "https://progtest.fit.cvut.cz/"})
})

function save_options() {
  var theme = document.getElementById('theme').value;
  var hide = document.getElementById('dropdown').checked;
  browser.storage.sync.set({
    selectedTheme: theme,
    autoHide: hide
  }, function () {
    var status = document.getElementById('status');
    status.textContent = 'Option saved';
    browser.tabs.reload({bypassCache: true});
    setTimeout(function () {
      status.textContent = '';
    }, 1500);
  });
}

function restore_options() {
  browser.storage.sync.get({
    selectedTheme: 'light',
    autoHide: true
  }, function (items) {
    document.getElementById('theme').value = items.selectedTheme;
    document.getElementById('dropdown').checked = items.autoHide;
    hideDropdown()
  });
}

function hideDropdown() {
  var dd = document.getElementById('dropdown').parentNode
  if (document.getElementById('theme').value.includes('orig')) {
    dd.style.visibility = "hidden";
  } else {
    dd.style.visibility = "initial";
  }
}

document.getElementById('theme').addEventListener('change', hideDropdown)
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);