# SelfProjects_Scrap-Results
Scrap Football Results 

## Procedure

### Generating the Raw Data
1. Navigate to the url https://www.soccer24.com
2. Select a date prior to today from the date picker to retrieve the results of games for the day.
3. Note. Ensure that all leagues are expanded (i.e. not collapsed).
4. Note. The website only features results for the past seven days.
5. Right-click on mouse and select Save as to to save the web page in the stored_web_pages folder.
6. Select the saved web page and open it in a new page and save the file as sample.html in the project folder.
7. At the command prompt: npm run results.

### Convert JSON to HTML
1. Navigate to the url http://convertjson.com/json-to-html-table.htm
2. Option 1 - Select the raw data file from the step above (ie the tips.txt file)
3. Option 3 - Select Format JSON
4. Select Convert JSON To HTML.


### Append the results data to the BetAnalysis.xls spreadsheet
1. Open the Betanalysis spreadsheet.
2. Place the curser after the last occupied row.
3. Copy the converted data in the Result Data box of the JSON to HTML convertor website and paste it at the cusror position in the Bet analysis spreadsheet.

# To Generate Bet List
1. To generate the raw data, make sure that you select the current date in the date picker.
2. At the command prompt: npm run bets.
3. Follow the rest of the steps as above.