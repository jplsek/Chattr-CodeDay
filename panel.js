
// scrolls down when called
function scroll(){
    $('#capanel .textbox').scrollTop($('#capanel .textbox').prop("scrollHeight"));
}

// show and hide buttons on the page
function showAddBtn(){
    console.log('showAddBtn');
    $('.addGroup').show();
}
function showCancelBtn(){
    console.log('showCancelBtn');
    $('.cancelGroup').show();
}
function hideAddBtn(){
    console.log('hideAddBtn');
    $(".addGroup").hide();
}
function hideCancelBtn(){
    console.log('hideCancelBtn');
    $(".cancelGroup").hide();
}

function loadPanel(){
    $('head').append('\
    <style>\
        /* Chattr Stylesheet */\
        #capanel *{\
            box-sizing:border-box;\
            margin:0;\
        }\
        #capanel{ /* Main Panel */\
            font-family:helvetica;\
            font-size:12px;\
            position:fixed;\
            width:250px; /* static for now */\
            height:400px;\
            background:#F6F6F6;\
            border:1px solid #c6c6c6;\
            color:#191a1c;\
            padding:0;\
            box-sizing:border-box;\
            bottom:10px;\
            left:10px;\
            z-index:100;\
        }\
        #capanel .top{\
            padding:5px 0;\
        }\
        #capanel .bottom{\
            text-align:center;\
            bottom: 5px;\
            position: absolute;\
        }\
        #capanel .textbox{\
            border:1px solid #DBDBDB;\
            background:#fefefe;\
            margin: 0px 10px 5px;\
            height:50%;\
            position:relative;\
            overflow-y: scroll;\
        }\
        #capanel .button{\
            border:1px solid #DBDBDB;\
            color:#191a1c;\
            padding:3px 5px;\
            border-radius:5px;\
            background:#fefefe;\
            text-decoration:none;\
        }\
        #capanel .textarea{\
            width: 100%;\
            background: #fff;\
            border-top: 1px solid #C6C6C6;\
            border-bottom: 1px solid #C6C6C6;\
            border-left: transparent;\
            border-right: transparent;\
            height: 40px;\
            font-family:helvetica;\
            padding:3px 5px;\
            margin: 0 0 5px;\
        }\
        #capanel .input{\
            width: 100%;\
            background: #fff;\
            border-top: 1px solid #C6C6C6;\
            border-bottom: 1px solid #C6C6C6;\
            border-left: transparent;\
            border-right: transparent;\
            padding:3px 5px;\
        }\
        #capanel .textbox li{\
            border-bottom:1px solid #DBDBDB;\
            padding:3px 5px;\
            list-style:none;\
        }\
        #capanel .textbox li:nth-child(even){\
            background:#FCFCFC;\
        }\
        #capanel .user{\
            float:left;\
            font-weight:bold;\
            text-transform: capitalize;\
        }\
        #capanel .time{\
            float:right;\
            font-style: italic;\
        } \
        #capanel .out{\
            clear:both;\
            word-wrap: break-word;\
        }\
        #capanel-toggle{\
            border:1px solid #DBDBDB;\
            color:#191a1c;\
            padding:3px 5px;\
            border-radius:5px;\
            background:#fefefe;\
            text-decoration:none;\
            position: fixed;\
            bottom: 10px;\
            left: 10px;\
            box-shadow: 0 0 2px 1px rgba(50,250,155,0.3);\
            cursor: pointer;\
            z-index:100;\
            user-select: none;\
            -moz-user-select: none;\
        }\
        #capanel .selectUsers{\
            margin-left: 9px;\
            text-transform: capitalize;\
        }\
        #capanel .drops, #capanel .group{\
            margin-left: 10px;\
            clear:both;\
        }\
        #capanel .group{\
            margin-bottom:9px;\
            font-weight:bold;\
            float:left;\
        }\
        #capanel .selectGroups, #capanel .selectUsers{\
            max-width:60%;\
        }\
        #capanel #close{\
            float:right;\
            position: absolute;\
            right: 0;\
            top:0;\
        }\
        #capanel #enlarge, #capanel #shrink{\
            position: absolute;\
            right: 25px;\
            top: 0;\
        }\
        #capanel .nameChange .out{\
            font-size: 10px;\
            color: rgba(15, 146, 15, 1);\
        }\
        #capanel .groupTitle .out{\
            color: rgba(15, 146, 15, 1);\
            font-weight: bold;\
        }\
        #capanel .userLeave .out{\
            color: rgba(146, 103, 15, 1);\
            font-size: 10px;\
        }\
        #capanel .userJoined .out{\
            color: rgba(0, 111, 255, 1);\
            font-size: 10px;\
        }\
        </style>\
    ');
    
    $('body').append('\
        <div id="capanel">\
            <div class="top">\
                    <div class="group">Current Group: </div>\
                    <input type="text" class="input" maxlength="20" id="addGroupInput" placeholder="New Group Name"/>\
                    <button type="button" id="enlarge" class="button" title="enlarge">[+]</button>\
                    <button type="button" id="shrink" class="button" title="shrink">[-]</button>\
                <button type="button" id="close" class="button" title="close">X</button>\
                <div class="drops">\
                Groups:\
                <select class="button selectGroups">\
                    <option style="display:none"></option>\
                </select>\
                <button type="button" class="button addGroup" title="add group">Add</button>\
                <button type="button" class="button cancelGroup" title="cancel group">Cancel</button>\
                <br/>Users:\
                <select class="button selectUsers">\
                    <option style="display:none"></option>\
                </select>\
                </div>\
            </div>\
            <div class="textbox"></div>\
            <div class="bottom">\
                <form>\
                    <input id="capanel-name" type="text" class="input" placeholder="Name" maxlength="20"/>\
                    <input type="text" id="capanel-text" class="textarea" placeholder="Message" maxlength="1024"></textarea>\
                    \
                    <input type="file" id="fileSelect" style="display:none;"/>\
                    <input class="button" type="button" name="file" value="Upload..." style="background:rgba(195, 195, 195, 1);" onclick="document.getElementById(\'fileSelect\').click();" readonly/>\
                    <input id="capanel-submit" class="button" type="button" value="Send"/>\
                </form>\
            </div>\
        </div> <!-- #capanel -->\
    ');

    $('body').append('\
        <div class="button chat-button" id="capanel-toggle">\
            + Chat\
        </div>\
    ');
    
    scroll();
}