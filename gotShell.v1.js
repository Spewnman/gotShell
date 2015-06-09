gotShell = new Object();
gotShell.isInitialized = false;
gotShell.defaultTextColor = "";
gotShell.defaultTextSpeed = 0;

gotShell.Initialize = function(setDefaultTextSpeed, setDefaultTextColor)
{
    this.defaultTextColor = setDefaultTextColor || "#fff000";
    this.defaultTextSpeed = setDefaultTextSpeed || 0;
    this.isInitialized = true;
}
