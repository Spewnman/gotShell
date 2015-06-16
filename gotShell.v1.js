// ****************************************************************************
// gotShell Object
//
// Description:
//      Creates a DOS/Unix type shell within a DIV element.  Other elements may
//      work, however they were not tested, DIV is recommended.
//
// Object Constructor Variables:
//      ShellContainerID        = The HTML element ID for the container of the
//                                Shell object.
//      setDefaultTextColor     = The default text color to be used in HEX code
//                                Defaults to White text if none specified.
//      setDefaultTextSpeed     = The default speed at which text is "typed" to
//                                the screen.  Defaults to 0 (instant).
//
// Object Public Methods:
//      TypeString              = Types out a string to the shell.  Accepts
//                                Color and speed codes, whether or not to
//                                add a new line to the end of the string, and
//                                whether or not to include the command prompt
//                                after the string and optional new line.
// ****************************************************************************
function gotShell(ShellContainerID, setDefaultTextColor, setDefaultTextSpeed, ShellContainerClass, ShellContainerParent){
    this.isInitialized = false;
    var isTyping = false;
    var isTag = false;

    // Container variables
    var ContainerID = ShellContainerID;
    var ShellContainer;

    // Text Color and Speed Variables.
    var defaultTextColor = setDefaultTextColor || "#FFFFFF";
    var defaultTextSpeed = setDefaultTextSpeed || 0;
    var curTextSpeed = defaultTextSpeed;

    // Size variables -
    var shellWidth = "640px";
    var shellHeight = "480px";

    // Array values that contain the text to output, or the text being input.
    var textOutQueue = [];
    var textInQueue  = [];

    // public variables
    this.cmdPrompt = "GoT-# ";

// ***** ShellContainerID is NOT optional, if it is null do not initialize. *****
// If the element with ID = ShellContainerID exists, bind to that element.
// If that element does not exist, create a new element with that ID.
    if(!ContainerID) {this.isInitialized = false;}
    else {
        // check to see if an element with this ID exists, then bind to it.
        ShellContainer = document.getElementById(ContainerID);
        if(!ShellContainer){
            // if there is no existing element with this ID, create one.
            ShellContainer = document.createElement("div");
            ShellContainer.id = ContainerID;
            ShellContainer.className = ShellContainerClass || "gotShell";

            // Apend the new object to parent or to document if no
            if(!ShellContainerParent)  {document.body.appendChild(ShellContainer);}
            else {document.getElementById(ShellContainerParent).appendChild(ShellContainer);
            }
        }
        // Set Initialized to True
        this.isInitialized = true;
    }

// Get and Set functions for default text color and speed
    this.getDefaultTextColor = function()        {if(this.isInitialized){return defaultTextColor;} else{return null;}};
    this.setDefaultTextColor = function(newColor){
        if(this.isInitialized){
            defaultTextColor = newColor;
            ShellContainer.style.color = newColor;
        }
    };
    this.getDefaultTextSpeed = function()        {if(this.isInitialized){return defaultTextSpeed;} else{return null;}};
    this.setDefaultTextSpeed = function(newSpeed){if(this.isInitialized){defaultTextSpeed = newSpeed;}};

// METHODS
    this.writeString = function(theString, addNewLine, addCmdPrompt) {
        // Add each character of the string as a new item at the end of the output array.
        theString = theString.toString();
        var tmpArray = theString.split("");
        if(tmpArray.length > 0)  {textOutQueue = textOutQueue.concat(tmpArray);}

        // HTML tags are added to the array as an element instead of being split up.
        if(addNewLine)      textOutQueue = textOutQueue.concat("<br/>");

        // If adding the command prompt, split it out char by char.
        if(addCmdPrompt)    textOutQueue = textOutQueue.concat(this.cmdPrompt.split(""));

        if(!isTyping && textOutQueue.length > 0){
            typeChar(textOutQueue.shift().toString());
        }
    };

    var typeChar = function(theChar){
        // first lets scroll the contents of the DIV if the text exceeds the depth of the DIV window
        ShellContainer.scrollTop = ShellContainer.scrollHeight;
        // as long as there are characters in the array, keep running this timer to display
        // a single character at a time.
        curTimer = setTimeout(function() {
            if(theChar !== undefined) ShellContainer.innerHTML += theChar;
            if(textOutQueue.length > 0) {
                isTyping = true;
                typeChar(textOutQueue.shift().toString());
            }
            else isTyping = false;
        }, curTextSpeed);
    };

    this.showShell = function(toShowOrNot){
        if(toShowOrNot === undefined) toShowOrNot = true;
        if(toShowOrNot) {ShellContainer.style.display = "";}
        else {ShellContainer.style.display = "none";}
    };
    this.hideShell = function(){this.showShell(false);};
}