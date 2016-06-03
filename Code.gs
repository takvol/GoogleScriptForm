var FOLDER_ID = 'a1b2r3a4k5a6d7a8b9r0a';  //id of folder in google drive. must be shared to view to anyone on the web, to show images in table
var SHEET_ID = 'a1b2r3a4k5a6d7a8b9r0a';  //id of google spreadsheet
var SHEET_NAME = 'Demo form responses';  //name of the sheet in spreadsheet
var LOG_EMAIL = 'your_email_here@somemail.com'; //email for sending error logs to

function doGet(e) {
  return HtmlService.createTemplateFromFile("Form.html").evaluate().setTitle("Demo quiz");
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function uploadFiles(form) {
  var respond;
  
  try {
    var file="";
    var url="";
    var image="";
    var folder = DriveApp.getFolderById(FOLDER_ID);
    var sheet = SpreadsheetApp.openById(SHEET_ID);
    var row;
    var name = form.q_name;
    var heap = form.q_heap;
    var mirror = form.q_mirror;
    var world = form.q_world;
    var cloud = form.q_cloud;
    var blob = form.q_image;
    var id = "_" + new Date().getTime() + Math.random().toString().substring(2,5);
    var date = new Date();
    
    if(blob && blob.getName()){         
      file = folder.createFile(blob);
      file.setDescription('Uploaded by ' + id);
      url = file.getUrl();
      image = "=IMAGE(\"//drive.google.com/uc?export=view&id="+file.getId()+"\",2)";
      //image will only be displayed in sheet if it's folder is shared to anyone on the web
    }
    
    row = sheet.getSheetByName(SHEET_NAME).appendRow([date, id, name, heap, mirror, world, cloud, url, image]).getLastRow();
    sheet.getSheetByName(SHEET_NAME).setRowHeight(row, 100);
    
    respond = "Thanks! Your response has been recorded.";
  } catch(e) {
    var message = {error:e.toString(), date:date, id:id, name:name, heap:heap, mirror:mirror, world:world, cloud:cloud,
                   file:file, url:url, image:image, folder:folder, sheet:sheet, row:row};
    
    Logger.log(JSON.stringify(message, null, 4));
    
    try {
      GmailApp.sendEmail(LOG_EMAIL, "Error In Demo Form", JSON.stringify(message, null, 4));
      Logger.log("Error email sent");
    } catch(e) {
      Logger.log("No email sent");
    } finally {
      respond = "Error occurred: " + e.toString();
    }
    
  } finally {
    return respond;
  }
}
