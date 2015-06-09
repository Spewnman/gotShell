gotShell = function() {
    // Global Variables
    this.isInitialized       = false;
    this.defaultSpeed        = 0;
    this.curTextSpeed        = this.defaultSpeed;
    this.defaultColor        = "F0F0F0";
    this.curTextColor        = this.defaultColor;
    this.newElem             = {};
    this.myElem              = {};      // The DIV class to manipulate
    this.objStrArray         = [];       // contains info of what to type to console
    this.cmdPrompt           = "#<c:d47b2b>G</c><c:ffffff>o</c><c:d47b2b>T</c>-> ";       // command prompt
    this.cmdPromptCursor     = "<b:1>_</b>";
    this.cmdPromptCursorLen  = 17;        // Expanded to HTML version of the cursor length (add and remCursor functions
    this.showCursorTyping    = false;    // if true redraws cursor / removes cursor after every character output
    this.isTyping            = false;
    this.isTag               = false;
    this.defaultParentID     = "";
    this.parentID            = "";
    this.tagID               = 0;
    this.tagBlink            = '<em id="%s" style="animation: blink %ss steps(5, start) infinite;' +
        '-webkit-animation: blink %ss steps(5, start) infinite;}' +
        '@keyframes blink {to { visibility: hidden; }}' +
        '@-webkit-keyframes blink {to { visibility: hidden; }}">';
    this.tagColor            = '<em id="%s" style="color:#%s">';
    this.tagSpeed            = "";


    this.bindParentElem      = function (newParent) {
        if (newParent === undefined) newParent = "gotShell";
        this.parentID = newParent;
        this.myElem = document.getElementById(newParent);
    };

    this.getTag              = function () {
        //
        var theTag = "";                                // will hold the text between the tag < and >
        var tagEnd;                                     // The end position in the array of the tag >

        tagEnd = this.objStrArray.indexOf(">");     // Find the closing tag >
        for (var i = 0; i < tagEnd; ++i) {               // remove the text from between the tags < >
            theTag += this.objStrArray.shift();
        }
        if(this.objStrArray[0] == ">") this.objStrArray.shift();  // remove the trailing > for the tag
        if(this.objStrArray[0] == "<") this.objStrArray.unshift('');
        return theTag;                                  // return the text of the tag
    };

    this.initialize          = function (parentElement, textSpeed, textColor) {
        if (!this.isInitialized) {
            // initialize main items, parent, text speed and text color
            if (parentElement === undefined) parentElement = "gotShell";
            this.defaultParentID = parentElement;
            this.bindParentElem(this.defaultParentID);

            if (textSpeed === undefined) textSpeed = 1;
            this.defaultSpeed = textSpeed;
            this.curTextSpeed = textSpeed;

            if (textColor === undefined) textColor = "F0F0F0";
            this.defaultColor = textColor;

            if (this.cmdPromptCursor.length < 1) this.cmdPromptCursor = "_";

            this.isInitialized = true;
            console.log("gotShell object Initialized");
        }
    };

    this.remCmdPromptCursor  = function () {
    };

    this.addCmdPromptCursor  = function () {
        this.objStrArray = this.objStrArray.concat(this.cmdPromptCursor.split(""));
    };

    this.changeCmdPromptCursor   = function (newCursor) {
        this.cmdPromptCursor = newCursor;
        // Expand got codes to html codes to determine length of expanded cursor

    };

    this.addString           = function (theString, addNewLine, addCmdPrompt) {
        // Remove the cmdPromptCursor from the screen
        var cursorLen = this.cmdPromptCursor.length;
        var htmlLen = this.myElem.innerHTML.length;
        var innerEnd;
        if(this.myElem.innerHTML.length >= cursorLen)
        {
            innerEnd = this.myElem.innerHTML.substr(-1, cursorLen);
            this.myElem.innerHTML = this.myElem.innerHTML.substr(0,htmlLen-(cursorLen));
            console.log (innerEnd);
        }

        tmpArr = theString.split("");
        if(theString !== undefined) this.objStrArray = this.objStrArray.concat(tmpArr);
        if(addNewLine)              this.objStrArray = this.objStrArray.concat("<br>");
        if(addCmdPrompt)            this.objStrArray = this.objStrArray.concat(this.cmdPrompt.split(""));
        //this.objStrArray = this.objStrArray.concat(this.cmdPromptCursor.split(""));
        this.addCmdPromptCursor();
        if(!this.isTyping){
            var curChar = this.objStrArray.shift().toString();
            this.addStr(curChar);
        }
    };

    this.addStr              = function (theChar) {
        // If we are in the main Shell DIV auto scroll contents
        if(this.parentID == this.defaultParentID)
        {
            var objDiv = document.getElementById(this.parentID);
            objDiv.scrollTop = objDiv.scrollHeight;
        }


        var theTag;
        // if theChar is start of tag, process if new tag or end of tag
        if (theChar == "<") {
            this.isTag = true;
            theTag = this.getTag();
            if (this.objStrArray.length >= 0) theChar = this.objStrArray.shift();
            else theChar = '';
            switch (theTag) {
                case "br":                                      // Means add a new line
                    this.myElem.innerHTML += "<br>";
                    break;
                case "/c":                                      // Means end of color tag
                    this.curTextColor = this.defaultColor;
                    this.parentID = this.defaultParentID;
                    this.bindParentElem(this.parentID);
                    this.myElem.innerHTML += "</em>";
                    break;
                case "/s":                                      // Means end of Speed tag
                    this.curTextSpeed = this.defaultSpeed;
                    this.myElem.innerHTML += "</em>";
                    break;
                case "/b":
                    this.parentID = this.defaultParentID;
                    this.bindParentElem(this.parentID);
                    this.myElem.innerHTML += "</em>";
                    break;
                default:
                    var tagType = theTag.substr(0, 1);
                    var tagData = theTag.substr(2, theTag.length - 2);
                    switch (tagType) {
                        case "c":       // create an <em> tag with color style, change parent to this new tag
                            this.tagID++;
                            // Create a new element the old fashioned way
                            var elemStr = '<em id="' + this.tagID + '" style="color:#' + tagData + '">';
                            this.myElem.innerHTML += elemStr;
                            // make the parent element this new one
                            this.myElem = document.getElementById(this.tagID);
                            break;
                        case "s":
                            this.curTextSpeed = tagData;
                            break;
                        case "b":       // Create an <em> tag with .blink style for blinking
                            this.tagID++;
                            // Create a new element the old fashioned way
                            if(Number(tagData) < 0 || Number(tagData) > 10) tagData = "2";
                            // This code is the same as the .blink section of the cli.css
                            var elemStr = '<em id="' + this.tagID + '" style="' +
                                'animation: blink ' +tagData+ 's steps(5, start) infinite;' +
                                '-webkit-animation: blink ' +tagData+ 's steps(5, start) infinite;}' +
                                '@keyframes blink {to { visibility: hidden; }}' +
                                '@-webkit-keyframes blink {to { visibility: hidden; }}">';
                            this.myElem.innerHTML += elemStr;
                            // make the parent element this new one
                            this.myElem = document.getElementById(this.tagID);
                            break;
                        default:    // if we hit this, an incorrect type was used.
                            break;
                    }
            }
        }

        curTimer = setTimeout(function () {
            if (theChar !== undefined) this.myElem.innerHTML += theChar;
            if (this.objStrArray.length > 0) {
                this.isTyping = true;
                this.addStr(this.objStrArray.shift().toString());
            }
            else this.isTyping = false;
        }, this.curTextSpeed);
    };
}