"use strct";
const electron = require("electron");
const app = electron.app;

const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;

app.on("window-all-closed", () => {
    if(process.platform != "darwin"){
        app.quit();
    }
});

app.on("ready",() => {
    mainWindow = new BrowserWindow({width:1024, height:768,useContentSize:true});
    mainWindow.loadFile("./index.html");
    mainWindow.on("closed",() => {
        mainWindow = null;
    })
})