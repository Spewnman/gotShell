var gotShell =
{
    // Global Variables
    isInitialized       : false,
    defaultSpeed        : 0,
    curTextSpeed        : this.defaultSpeed,
    defaultColor        : "F0F0F0",
    curTextColor        : this.defaultColor,
    newElem             : {},
    myElem              : {},       // The DIV class to manipulate
    objStrArray         : [],       // contains info of what to type to console
    cmdPrompt           : "#<c:d47b2b>G</c><c:ffffff>o</c><c:d47b2b>T</c>-> ",       // command prompt
    cmdPromptCursor     : "<b:1>_</b>",
    cmdPromptCursorLen  : 17,        // Expanded to HTML version of the cursor length (add and remCursor functions
    showCursorTyping    : false,    // if true redraws cursor / removes cursor after every character output
    isTyping            : false,
    isTag               : false,
    defaultParentID     : "",
    parentID            : "",
    tagID               : 0,
    tagBlink            : '<em id="%s" style="animation: blink %ss steps(5, start) infinite;' +
        '-webkit-animation: blink %ss steps(5, start) infinite;}' +
        '@keyframes blink {to { visibility: hidden; }}' +
        '@-webkit-keyframes blink {to { visibility: hidden; }}">',
    tagColor            : '<em id="%s" style="color:#%s">',
    tagSpeed            : "",



    bindParentElem      : function (newParent) {
        if (newParent === undefined) newParent = "gotShell";
        gotShell.parentID = newParent;
        gotShell.myElem = document.getElementById(newParent);
    },

    getTag              : function () {
        //
        var theTag = "";                                // will hold the text between the tag < and >
        var tagEnd;                                     // The end position in the array of the tag >

        tagEnd = gotShell.objStrArray.indexOf(">");     // Find the closing tag >
        for (var i = 0; i < tagEnd; ++i) {               // remove the text from between the tags < >
            theTag += gotShell.objStrArray.shift();
        }
        if(gotShell.objStrArray[0] == ">") gotShell.objStrArray.shift();  // remove the trailing > for the tag
        if(gotShell.objStrArray[0] == "<") gotShell.objStrArray.unshift('');
        return theTag;                                  // return the text of the tag
    },

    initialize          : function (parentElement, textSpeed, textColor) {
        if (!this.isInitialized) {
            // initialize main items, parent, text speed and text color
            if (parentElement === undefined) parentElement = "gotShell";
            this.defaultParentID = parentElement;
            this.bindParentElem(gotShell.defaultParentID);

            if (textSpeed === undefined) textSpeed = 1;
            this.defaultSpeed = textSpeed;
            this.curTextSpeed = textSpeed;

            if (textColor === undefined) textColor = "F0F0F0";
            this.defaultColor = textColor;

            if (this.cmdPromptCursor.length < 1) this.cmdPromptCursor = "_";

            this.isInitialized = true;
            console.log("gotShell object Initialized");
        }
    },

    remCmdPromptCursor  : function () {
    },

    addCmdPromptCursor  : function () {
        gotShell.objStrArray = gotShell.objStrArray.concat(gotShell.cmdPromptCursor.split(""));
    },

    changeCmdPromptCursor   : function (newCursor) {
        gotShell.cmdPromptCursor = newCursor;
        // Expand got codes to html codes to determine length of expanded cursor

    },

    addString           : function (theString, addNewLine, addCmdPrompt) {
        // Remove the cmdPromptCursor from the screen
        var cursorLen = gotShell.cmdPromptCursor.length;
        var htmlLen = gotShell.myElem.innerHTML.length;
        var innerEnd;
        if(gotShell.myElem.innerHTML.length >= cursorLen)
        {
            innerEnd = gotShell.myElem.innerHTML.substr(-1, cursorLen);
            gotShell.myElem.innerHTML = gotShell.myElem.innerHTML.substr(0,htmlLen-(cursorLen));
            console.log (innerEnd);
        }

        tmpArr = theString.split("");
        if(theString !== undefined) gotShell.objStrArray = gotShell.objStrArray.concat(tmpArr);
        if(addNewLine)              gotShell.objStrArray = gotShell.objStrArray.concat("<br>");
        if(addCmdPrompt)            gotShell.objStrArray = gotShell.objStrArray.concat(gotShell.cmdPrompt.split(""));
        //gotShell.objStrArray = gotShell.objStrArray.concat(gotShell.cmdPromptCursor.split(""));
        gotShell.addCmdPromptCursor();
        if(!gotShell.isTyping){
            var curChar = gotShell.objStrArray.shift().toString();
            gotShell.addStr(curChar);
        }
    },

    addStr              : function (theChar) {
        // If we are in the main Shell DIV auto scroll contents
        if(gotShell.parentID == gotShell.defaultParentID)
        {
            var objDiv = document.getElementById(gotShell.parentID);
            objDiv.scrollTop = objDiv.scrollHeight;
        }


        var theTag;
        // if theChar is start of tag, process if new tag or end of tag
        if (theChar == "<") {
            gotShell.isTag = true;
            theTag = gotShell.getTag();
            if (gotShell.objStrArray.length >= 0) theChar = gotShell.objStrArray.shift();
            else theChar = '';
            switch (theTag) {
                case "br":                                      // Means add a new line
                    gotShell.myElem.innerHTML += "<br>";
                    break;
                case "/c":                                      // Means end of color tag
                    gotShell.curTextColor = gotShell.defaultColor;
                    gotShell.parentID = gotShell.defaultParentID;
                    gotShell.bindParentElem(gotShell.parentID);
                    gotShell.myElem.innerHTML += "</em>";
                    break;
                case "/s":                                      // Means end of Speed tag
                    gotShell.curTextSpeed = gotShell.defaultSpeed;
                    gotShell.myElem.innerHTML += "</em>";
                    break;
                case "/b":
                    gotShell.parentID = gotShell.defaultParentID;
                    gotShell.bindParentElem(gotShell.parentID);
                    gotShell.myElem.innerHTML += "</em>";
                    break;
                default:
                    var tagType = theTag.substr(0, 1);
                    var tagData = theTag.substr(2, theTag.length - 2);
                    switch (tagType) {
                        case "c":       // create an <em> tag with color style, change parent to this new tag
                            gotShell.tagID++;
                            // Create a new element the old fashioned way
                            var elemStr = '<em id="' + gotShell.tagID + '" style="color:#' + tagData + '">';
                            gotShell.myElem.innerHTML += elemStr;
                            // make the parent element this new one
                            gotShell.myElem = document.getElementById(gotShell.tagID);
                            break;
                        case "s":
                            gotShell.curTextSpeed = tagData;
                            break;
                        case "b":       // Create an <em> tag with .blink style for blinking
                            gotShell.tagID++;
                            // Create a new element the old fashioned way
                            if(Number(tagData) < 0 || Number(tagData) > 10) tagData = "2";
                            // This code is the same as the .blink section of the cli.css
                            var elemStr = '<em id="' + gotShell.tagID + '" style="' +
                                'animation: blink ' +tagData+ 's steps(5, start) infinite;' +
                                '-webkit-animation: blink ' +tagData+ 's steps(5, start) infinite;}' +
                                '@keyframes blink {to { visibility: hidden; }}' +
                                '@-webkit-keyframes blink {to { visibility: hidden; }}">';
                            gotShell.myElem.innerHTML += elemStr;
                            // make the parent element this new one
                            gotShell.myElem = document.getElementById(gotShell.tagID);
                            break;
                        default:    // if we hit this, an incorrect type was used.
                            break;
                    }
            }
        }

        curTimer = setTimeout(function () {
            if (theChar !== undefined) gotShell.myElem.innerHTML += theChar;
            if (gotShell.objStrArray.length > 0) {
                gotShell.isTyping = true;
                gotShell.addStr(gotShell.objStrArray.shift().toString());
            }
            else gotShell.isTyping = false;
        }, gotShell.curTextSpeed);
    }
};