# watson-to-sheets
Connect your Google Sheets with IBM’s Watson APIs to get sophisticated, AI-powered analysis inside your spreadsheets without writing any code. 

This project adds a new (custom) menu to any Google Sheet that reads data and settings from your spreadsheet and sends it to the Watson APIs. The menu is powered by a Google Apps Script (included in this repository), but does not require any coding. 

## Watson Natural Language Understanding

IBM advertises their Natural Language Understanding service as “a cloud native product that uses deep learning to extract metadata from text such as entities, keywords, categories, sentiment, emotion, relations, and syntax.” What that means in practical terms is that this API can analyze webpages and extract information about its overall sentiment (positive or negative), what it focuses on (categories and concepts), and any people, cities, or organizations that get mentioned (entities). You can check out IBM’s demo [here](http://dte-nlu-demo.mybluemix.net/self-service/home).

This script brings the power of that service to your spreadsheets by reading a list of URLs or cells with text that you want to analyze, sending that data to IBM for analysis following your (configurable) settings, and adding the results in a clearly readable format to a new sheet.

### Getting Started

First, make a private copy of [this Google Sheet](https://docs.google.com/spreadsheets/d/1PfLuPU4Pel7BcMUkMdzteUcqzpfSnW118xDE0bh-SGk/) that’s setup to work seamlessly with this script using the _File->Make a copy_ menu item. Refresh the window (completely) with your new document and you should see a *Watson NLU* menu appear all the way on the right. This menu is where you’ll trigger analysis after setup.

Second, follow the steps in the IBM documentation [Getting started with Natural Language Understanding](https://cloud.ibm.com/docs/services/natural-language-understanding?topic=natural-language-understanding-getting-started) to create and confirm (or sign into) an IBM Cloud account and add the (free) Lite plan for Natural Language Understanding. Now it’s time to get your credentials. Click the Natural Language Understanding entry under Services in [this search](https://cloud.ibm.com/resources?search=natural%20language%20understanding) and the _View full details_ button. This will show you a new page with a Credentials section and a _Show Credentials_ button to the right. Click that button then copy the two values into your first sheet/tab (they go into cells B8 & B9).

Third, add the URLs or your own text that you want to analyze to the _Input URLs or Text_ sheet/tab. 

Finally, run the analysis and see the results by selecting the _Watson NLU->Analyze URLs or Text..._ menu item. A new sheet/tab will be added as soon as the processing is complete. 

### Authorization ###

![Authorization Required prompt](/images/authorization_required.png)

Google will prompt you to confirm authorization with an _Authorization Required_ popup the first time you run _Analyze URLs or Text..._. Select the _Continue_ button and then the account you want to use. At this point you will see a _This app isn't verified_ warning. Google makes it somewhat difficult for developers to submit simple applications for verifications, so I haven’t.

![Warning from Google that “This app isn't verified”](/images/not_verified.png)

Select the _Advanced_ link and then click the _Go to google-to-sheets Watson NLU Menu (unsafe)_ link. 

![Authorization request from Watson NLU Menu script](/images/permissions_details.png)

Review the actual, limited permissions you are granting to this new script (`google-to-sheets Watson NLU Menu`) inside this new Google Sheet and select the _Allow_ button if you are comfortable with this access. All this script has permission to do is manipulate this specific document and make external calls to the Watson API. That said, you should always be cautious about granting authorization to any new script.

### Review How This Works ###

All the code powering this Google Sheet is available for your review in this repository and from the _Tools->Script editor_ menu item.

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

