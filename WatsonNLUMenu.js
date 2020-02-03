/**
 * @OnlyCurrentDoc
 * The above annotation limits the access this script has to just this document, which is just what we want */

/**
 * Add a custom menu to this Google Sheet */
function onOpen() {
  const googleSheet = SpreadsheetApp.getActive();
  const menuItems = [
    {name: "Analyze URLs...", functionName: "analyzeUrls"},
  ];
  googleSheet.addMenu("Watson NLU", menuItems);
}
    

/**
 * Call Watson NLU API and send results to new sheet */    
function analyzeUrls() {
  const googleSheet = SpreadsheetApp.getActiveSpreadsheet();
  const settings = readSettings(googleSheet);
  const urls = readURLs(googleSheet);
  Logger.log("Found %s URLs to analyze...", urls.length);
  const results = urls.map(function(url) {
    return analyzeOneUrl(url, settings);
  });
  const resultsSheet = addResultsSheet(googleSheet);
  writeResults(results, resultsSheet);
}

/**
 * Add a new, unique sheet to the document to store the results.
 * @param {Object} googleSheet The Google Sheet under analysis.
 * @return {Object} The new sheet.
*/
function addResultsSheet(googleSheet) {

  const formattedDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  const sheetName = "Results " + formattedDate;
  const sheetPosition = googleSheet.getNumSheets();

  Logger.log("Adding new sheet '%s' for results data...", sheetName);
  var resultsSheet = googleSheet.insertSheet(sheetName, sheetPosition);
  return resultsSheet;
}

/**
 * Call Watson NLU API to analyze supplied URL with provided settings.
 * @param {string} url The URL to analyze.
 * @param {Object} settings The settings to configure the API call.
 * @return {Object} The results of the API call.
*/
function analyzeOneUrl(url, settings) {
  Logger.log("Sending %s to Watson API for analysis...", url);
  
  const options = buildAPIRequestOptions(url, settings);
  const analyzeTextURL = settings.endpointUrl + "/v1/analyze?version=2019-07-12"
  const response = UrlFetchApp.fetch(analyzeTextURL, options);
  const responseContent = JSON.parse(response.getContentText());
  // Logger.log("Got raw API response: %s", JSON.stringify(responseContent));
  const result = {
    apiResponse: responseContent,
  };
  return result;
}

/**
 * Create configuration for HTTP POST call to Watson NLU API with the provided settings.
 * @param {string} url The URL to analyze.
 * @param {Object} settings The settings to configure the API call.
 * @return {Object} The options to use for UrlFetchApp.fetch().
*/
function buildAPIRequestOptions(url, settings) {
  const data = {
    features: configureFeatures(settings),
    url: url,
  };

  const headers = {
    authorization: "Basic " + Utilities.base64Encode("apikey:" + settings.apiKey),
  };

  const options = {
    contentType: "application/json",
    headers: headers,
    method: "POST",
    payload: JSON.stringify(data),
  };
  return options;
}

/**
 * Create configuration of Watson NLU API features with the provided settings.
 * @param {Object} settings The settings to configure the API call.
 * @return {Object} The features to pass to the Watson API.
*/
function configureFeatures(settings) {
  const CATEGORIES_MAX = 10;
  const CONCEPTS_MAX = 50;
  const ENTITIES_MAX = 250;

  var features = {};

  if (settings.categories) {
    features.categories = {
      limit: settings.categoriesLimit <= CATEGORIES_MAX ? settings.categoriesLimit : CATEGORIES_MAX,
    }
  }
  if (settings.concepts) {
    features.concepts = {
      limit: settings.conceptsLimit <= CONCEPTS_MAX ? settings.conceptsLimit : CONCEPTS_MAX,
    }
  }
  if (settings.sentiment) {
    features.sentiment = {
      document: settings.sentimentDocument,
      targets: settings.sentimentTargets.split(","),
    }
  }
  if (settings.entities) {
    features.entities = {
      limit: settings.entitiesLimit <= ENTITIES_MAX ? settings.entitiesLimit : ENTITIES_MAX,
      sentiment: settings.entitiesSentiment,
    }
  }
  return features;
}

/**
 * Extract the unique, sorted headings (keys) from flattened results objects with keys in dot notation.
 * @param {Object[]} data The data array.
 * @return {string[]} The unique headings.
*/
function extractHeadings(data) {
  var headings = {}; // since we don't have Set in Apps Script 
  data.forEach(function(item) {
    Object.keys(item).forEach(function(key) {
      headings[key] = true;
    });
  });
  return Object.keys(headings).sort();
}

/**
 * Read necessary settings from existing Settings sheet 
 * @param {Object} googleSheet The Google Sheet to analyze.
 * @return {Object} The user-defined and core script settings.
*/
function readSettings(googleSheet) {
  const settingsSheet = googleSheet.getSheetByName("Settings");
  const coreSettingsRange = settingsSheet.getRange("B8:B9");
  const coreSettings = coreSettingsRange.getValues();
 
  const userSettingsRange = settingsSheet.getRange("C14:C23");
  const userSettings = userSettingsRange.getValues();

  const settings = {
    apiKey:            coreSettings[0][0],
    endpointUrl:       coreSettings[1][0],

    categories:        userSettings[0][0],
    categoriesLimit:   userSettings[1][0],
    concepts:          userSettings[2][0],
    conceptsLimit:     userSettings[3][0],
    sentiment:         userSettings[4][0],
    sentimentDocument: userSettings[5][0],
    sentimentTargets:  userSettings[6][0],
    entities:          userSettings[7][0],
    entitiesLimit:     userSettings[8][0],
    entitiesSentiment: userSettings[9][0],
  };
  return settings;
}

/**
 * Read URLs to analyze, excluding any empty rows.
 * @param {Object} googleSheet The Google Sheet to analyze.
 * @return {string[]} The URLs the user wants to analyze this round.
*/
function readURLs(googleSheet) {
  const urlsSheet = googleSheet.getSheetByName("Input URLs");
  const urlsRange = urlsSheet.getRange("A2:A");
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
  const resultsDotNotation = results.map(function(result) { return _dotNotation(result.apiResponse) });
  var header = extractHeadings(resultsDotNotation);
  header.unshift("URL");
  var newData = [ header ]

 resultsDotNotation.forEach(function(result) {
    var row = [ result.retrieved_url ];
    header.slice(1).forEach(function(key) {
      row.push(result[key] || "");
    });
    newData.push(row);
  });
  const numNewRows = newData.length;
  const numNewColumns = newData[0].length;
  Logger.log("Writing %s rows/%s columns to new sheet (including header) ", numNewRows, numNewColumns);
  
  sheet.getRange(1, 1, numNewRows, numNewColumns).setValues(newData);
}

/**
 * Flatten an object into dot notation.
 * > _dotNotation({a: 1, b: "two", c: [4, 5], d: {first: "Alia", second: "Bruce"}})
 * {
 *  a: 1,
 *  b: 'two',
 *  'c.000': 4,
 *  'c.001': 5,
 *  'd.first': 'Alia',
 *  'd.second': 'Bruce'
 * }
 * 
 * @param {Object} obj The object to reformat.
 * @return {string[][]} The string keys and values from the object.
 */
function _dotNotation(obj, result, prefix) {
  result = result || {},
  prefix = prefix || "";

  Object.keys(obj).forEach(function(key) {
    if ( typeof(obj[key]) === "object" ) {
      if ( parseInt(key, 10) == key ) {
        var pad = "000";
        var paddedKey = (pad + key).slice(-pad.length);
        _dotNotation(obj[key], result, prefix + paddedKey + ".");
      }
      else {
        _dotNotation(obj[key], result, prefix + key + ".");
      }  
    } else if ( parseInt(key, 10) == key ) {
      var pad = "000";
      var paddedKey = (pad + key).slice(-pad.length);
      return result[prefix + paddedKey] = obj[key];
    } else {
      return result[prefix + key] = obj[key];
    }
  });

  return result;
}
