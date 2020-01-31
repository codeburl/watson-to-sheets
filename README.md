# watson-to-sheets
Connect your Google Sheets with IBM’s powerful Watson APIs to get powerful machine learning and analysis inside your spreadsheet without writing any code. 

This project adds a new (custom) menu to any Google Sheet that reads data and settings from your spreadsheet and sends it to the Watson APIs. 
The menu is powered by Google Apps Script (included in this repository), but does not require any coding. 

## Watson Natural Language Understanding

IBM advertises their Natural Language Understanding service as “a cloud native product that uses deep learning to extract metadata from text such as entities, keywords, categories, sentiment, emotion, relations, and syntax.” What that means in practical terms is that this API can analyze webpages and extract information like whether it's positive or negative (sentiment), what it focuses on (categories and concepts), and any people, cities, or organizations that get mentioned (entities).

This script brings the power of that service to your spreadsheet by reading a list of URLs you want to analyze, sending those URLs to IBM following your (configurable) settings, and adding the results in a clearly readable format to a new sheet in your spreadsheet.

### Getting started

First, make a private copy of [this spreadsheet](https://docs.google.com/spreadsheets/d/1PfLuPU4Pel7BcMUkMdzteUcqzpfSnW118xDE0bh-SGk/) that’s setup to work seamlessly with this script using the File->Make a copy menu item. Refresh your new spreadsheet window (completely) and you should see a new Watson NLU menu all the way on the right.

Second, follow the steps in the IBM documentation [Getting started with Natural Language Understanding](https://cloud.ibm.com/docs/services/natural-language-understanding?topic=natural-language-understanding-getting-started) to create (or sign into) your IBM Cloud account and add the (free) Lite plan for Natural Language Understanding to your account. Once you’ve added the service to your account you can get the API key and (Endpoint) URL on the IBM Cloud Manage tab (left side) by clicking Show Credentials and copying the two values to your spreadsheet’s first sheet (they go into cells B8 & B9).

Third, add the URLs you want to analyze to the Input URLs sheet (see the bottom).

Finally, see the analysis results by selecting the Watson NLU->Analyze URLs... menu item and waiting for the new results sheet to be added. You will be prompted to authorize the script the first time you run it.


### Other Implementations

There are a number of other projects that do similar integrations between text analysis APIs and Google Sheets and Docs:

* https://github.com/IBM-Cloud/watson-spreadsheet (written up at [Using Watson services with Google Docs](https://www.ibm.com/blogs/cloud-archive/2016/08/watson-services-and-google-docs/))
* [Perform Text Analysis with IBM Watson and Google Docs](https://www.labnol.org/internet/ibm-watson-google-docs-nlp/31481/)
* [Analyzing text in a Google Sheet using Cloud Natural Language API and Apps Script](https://cloud.google.com/blog/products/gcp/analyzing-text-in-a-google-sheet-using-cloud-natural-language-api-and-apps-script)
* [Automate Twitter Sentiment Analysis using Zapier and Watson (no coding required)](https://medium.com/ibm-watson/automate-twitter-sentiment-analysis-using-zapier-and-watson-no-coding-reqd-406aabd8ee66)
* [Tutorial: Analyzing Reviews using Google Sheets and Cloud Natural Language API](https://rominirani.com/tutorial-analyzing-reviews-using-google-sheets-and-cloud-natural-language-api-240ec8f3090c)


### IBM Documentation

* [Getting started with Natural Language Understanding](https://cloud.ibm.com/docs/services/natural-language-understanding?topic=natural-language-understanding-getting-started)
* [Watson Natural Language Understanding API docs](https://cloud.ibm.com/apidocs/natural-language-understanding/natural-language-understanding#introduction)

### Google Apps Scripts for Sheets Documentation

If you want to know more about how this code extends what a spreadsheet can do, see these guides from Google:

* [Extending Google Sheets](https://developers.google.com/apps-script/guides/sheets)
* [Quickstart: Menus and Custom Functions](https://developers.google.com/apps-script/quickstart/custom-functions)
* [Custom Functions in Google Sheets](https://developers.google.com/apps-script/guides/sheets/functions)

