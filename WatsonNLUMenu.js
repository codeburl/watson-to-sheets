/**
 * Add a custom menu to this spreadsheet */
function onOpen() {
  const spreadsheet = SpreadsheetApp.getActive();
  const menuItems = [
    {name: "Analyze URLs...", functionName: "analyzeUrls"},
  ];
  spreadsheet.addMenu("Watson NLU", menuItems);
}
    

/**
 * Call Watson NLU API and send results to new sheet */    
function analyzeUrls() {
  const spreadsheet = SpreadsheetApp.getActive();
  const settings = getSettings(spreadsheet);
  const urls = getURLs(spreadsheet);
  const results = urls.map(function(url) {
    return analyzeOneUrl(url, settings);
  });
  const resultsSheet = addResultsSheet(spreadsheet);
  writeResults(results, resultsSheet);
}

/**
 * Add a new, unique sheet to the document to store the results.
 * @param {Object} spreadsheet The spreadsheet under analysis.
 * @return {Object} The new sheet.
*/
function addResultsSheet(spreadsheet) {
  const formattedDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  const sheetName = "Results " + formattedDate;
  const sheetPosition = spreadsheet.getNumSheets();
  var resultsSheet = spreadsheet.insertSheet(sheetName, sheetPosition);
  return resultsSheet;
}

/**
 * Call Watson NLU API to analyze supplied URL with provided settings.
 * @param {string} url The URL to analyze.
 * @param {Object} settings The settings to configure the API call.
 * @return {Object} The results of the API call.
*/
function analyzeOneUrl(url, settings) {
  Logger.log("Starting analysis of %s...", url);
  const data = {
    url: url,
    features: {
      sentiment: {},
    },
  };
  const headers = {
    "Authorization" : "Basic " + Utilities.base64Encode("apikey:" + settings.apiKey),
  };
  const options = {
    method: "POST",
    contentType: "application/json",
    headers: headers,
    payload: JSON.stringify(data),
  };

  const response = UrlFetchApp.fetch(settings.endpointUrl, options);
  var responseContent = JSON.parse(response.getContentText());

  const result = {
    url: url,
    sentimentDocumentScore: responseContent.sentiment.document.score,
    sentimentDocumentLabel: responseContent.sentiment.document.label,
    apiResponse: response,
  };
  return result;
}

/**
 * Read necessary settings from existing Settings sheet 
 * @param {Object} spreadsheet The spreadsheet to analyze.
 * @return {Object} The user-defined and core script settings.
*/
function getSettings(spreadsheet) {
  const settingsSheet = spreadsheet.getSheetByName("Settings");
  const coreSettingsRange = settingsSheet.getRange("B4:B5");
  const coreSettings = coreSettingsRange.getValues();
 
  const userSettingsRange = settingsSheet.getRange("C10:C19");
  const userSettings = userSettingsRange.getValues();

  const settings = {
    apiKey:                     coreSettings[0][0],
    endpointUrl:                coreSettings[1][0],

    categories:                 userSettings[0][0],
    categoriesLimit:   parseInt(userSettings[1][0], 10),
    concepts:                   userSettings[2][0],
    conceptsLimit:     parseInt(userSettings[3][0], 10),
    sentiment:                  userSettings[4][0],
    sentimentDocument:          userSettings[5][0],
    sentimentTargets:           userSettings[6][0],
    entities:                   userSettings[7][0],
    entitiesLimit:     parseInt(userSettings[8][0], 10),
    entitiesSentiment:          userSettings[9][0],
  };
  return settings;
}

/**
 * Read URLs to analyze, excluding any empty rows.
 * @param {Object} spreadsheet The spreadsheet to analyze.
 * @return {string[]} The URLs the user wants to analyze this round.
*/
function getURLs(spreadsheet) {
  const urlsSheet = spreadsheet.getSheetByName("Input URLs");
  const urlsRange = urlsSheet.getRange("A3:A");
  const rawUrls = urlsRange.getValues().map(function(cell) {
    return cell[0];
  });
  const urls = rawUrls.filter(Boolean);
  return urls;
}

/**
 * Add the results to cells in a sheet.
 * @param {Object[]} results The results of the analysis.
 * @param {Object} resultsSheet The sheet to add results to.
 */
function writeResults(results, sheet) {
  const header = [
    "URL",
    "Sentiment.Document.Score",
    "Sentiment.Document.Label",
    "API Response",
  ];
  var newData = [header];
  for (var i in results) {
    var result = results[i];
    var row = [
      result.url,
      result.sentimentDocumentScore,
      result.sentimentDocumentLabel,
      result.apiResponse,
    ];
    newData.push(row);
  }
  sheet.getRange(1, 1, newData.length, newData[0].length).setValues(newData);
}