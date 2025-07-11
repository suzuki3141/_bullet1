"use strct"
const electron = require("electron")
const app = electron.app;

const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;

app.on("window-all-closed", () => {
    if(process.platform != "darwin"){
        app.quit();
    }
});

app.on("ready",() => {
    mainWindow = new BrowserWindow({width:1024, height:768,useContentSize:true,titleBarStyle:'hidden',frame:false});
    mainWindow.loadFile("./index.html");
    mainWindow.setFullScreen(true);
    mainWindow.on("closed",() => {
        mainWindow = null;
    })
})

function windowclose(){
    app.quit;
}