// Google Apps Script — runs in Google's V8 environment, NOT Node.js.
// Deploy manually: open Google Form → Extensions → Apps Script → paste this file.
// Set GITHUB_TOKEN as a Script Property (Project Settings → Script Properties).
// Add trigger: onFormSubmit → From form → On form submit.
function onFormSubmit() {
  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  const url = 'https://api.github.com/repos/jugisahunk/tulsa-wcs-community/actions/workflows/build-deploy.yml/dispatches';
  const options = {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    payload: JSON.stringify({ ref: 'main' }),
    contentType: 'application/json',
    muteHttpExceptions: true
  };
  const response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getResponseCode() + ': ' + response.getContentText());
}
