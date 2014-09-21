/* Chattr - Made by Jeremy Plsek. Contribution by Charlie and Ethan. Initiated at CodeDay Boston */

var cnt = 0; // wut ??

function loadDependency(src, callback){
    var jqElement = document.createElement('script');
    jqElement.src = src;
    jqElement.async = true;
    jqElement.onreadystatechange = jqElement.onload = (function(){
        var state = jqElement.readyState;
        if(!callback.done && (!state || /loaded|complete/.test(state))){
            callback.done = true;
            callback();
        }
    });
    document.getElementsByTagName("head")[0].appendChild(jqElement);
}

function loadFirebase(){
    // Add Firebase
    console.log('loadFirebase: loading firebase');
    loadDependency("//cdn.firebase.com/js/client/1.0.15/firebase.js", dependCallback);
}

function injectDependencies(){
    // Add jQuery
    if(!("$" in window)){ // Is jquery incuded?
        console.log('injectDependencies: loading jquery');
        loadDependency("//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js", loadFirebase);
    } else {
        console.log('injectDependencies: loading firebase');
        loadFirebase();
    }
}

function loadChattr(){
    // 1 ////////////////////////////////////////////////////////////////////////////////////////
    $('body').append('\
        <div class="button chat-button" id="capanel-toggle">\
            + Chat\
        </div>\
    ');
    
    // 2 ////////////////////////////////////////////////////////////////////////////////////////
    $("#shrink").hide();

    $('#capanel').hide();
    $('#capanel-toggle').click(function(){
        $('#capanel').toggle();
        $('#capanel-toggle').toggle();
        scroll();
    });
    
    // 3 ////////////////////////////////////////////////////////////////////////////////////////
    var nameField = $('#capanel-name').val();

    console.log("Using url: " + firebaseURL);

    fbGroups = new Firebase(firebaseURL + "/groups");
    
    var group = 'default';
    fb = new Firebase(firebaseURL + "/groups/" + group);

    if (nameField == ''){
        username = 'Anonymous';
        console.log("set anon name..");
        $('#capanel-name').val('Anonymous');
    } else {
        username = nameField;
        console.log("use last cached name..");
    }

    fbUsers = new Firebase(firebaseURL+"/users/");

    fbUsers.push({name:username});

    // retrieve the last record
    fbUsers.endAt().limit(1).on('child_added', lastUser);

    // Gets the user, has to wait until deleteOne gets set (lastUser)
    setTimeout(function(snapshot){
        console.log("fbUser: "+fbUser.toString());

        fbUser.on('value', function(snapshot) {
            fbUserName = snapshot.val().name;
            console.log("setTimeOut: fbUserName is: "+fbUserName);
            listUsers();
        });
        fb.push({name:"userJoin", text:fbUserName+" joined the chat", time:newDate()});

        scroll();
    }, 2000);

    fbUsers.on('child_removed', function(snapshot) {
        var fbUserRemoved = $('.selectUsers').children('#' + getMessageId(snapshot));
        console.log(fbUserName+" left chattr...");
        fb.push({name:"userLeft", text:fbUserName+" left the chat", time:newDate()});
        fbUserRemoved.remove();
    });

    //console.log(fb);

    // checks when the user presses enter in the text box
    $("#capanel-text").keypress(function(e) {
        if (e.keyCode == 13) {
            send(fb);
        }
    });
    $("#capanel-submit").click(function() {
        send(fb);
    });

    $("#capanel #enlarge").click(function(){
        $('#capanel').css("width", '350px');
        $('#capanel').css("height", '500px');
        $('#capanel .textbox').css("height", '60%');
        $("#capanel #enlarge").hide();
        $("#capanel #shrink").show();
    });
    /*$("#capanel #full").click(function(){
        $('#capanel').css("width", 'calc(100% - 20px)');
        $('#capanel').css("height", 'calc(100% - 20px)');
        $('#capanel .textbox').css("height", '60%');
    });*/
    $("#capanel #shrink").click(function(){
        $('#capanel').removeAttr('style');
        $('#capanel').removeAttr('style');
        $('#capanel .textbox').removeAttr('style');
        $("#capanel #enlarge").show();
        $("#capanel #shrink").hide();
    });
    $("#capanel #close").click(function(){
        $("#capanel").hide();
        $('#capanel-toggle').show();
    });

    $('#addGroupInput').hide();
    $('.cancelGroup').hide();

    showMessages(fb);
    showGroup(group);
    defaultMessage(fb, group);
    showAddBtn();

    $(".cancelGroup").click(function(){
        console.log(".cancelGroup was clicked");
        cancelGroup(group);
    });

    $('.addGroup').click(function(){
        console.log("add group btn clicked, groupCurrent: "+group);

        hideGroup();
        hideAddBtn();

        $('#addGroupInput').show();

        showCancelBtn();

        // check key strokes
        $("#addGroupInput").keypress(function(e) {
            if (e.keyCode == 13) { // enter

                hideCancelBtn();
                createGroup(fbGroups);

            } else if (e.keyCode == 27) { // escape

                cancelGroup(group);

            }

        });
        scroll();
    });

    scroll();

    // show group list
    fbGroups.on('child_added', function(snapshot) {
        $('<option/>')
            .attr('id', getMessageId(snapshot))
            .text(getMessageId(snapshot))
            .appendTo($('#capanel .selectGroups'));

        scroll();

    });

    $('.selectGroups').change(clickGroup);
    
    // 4 ////////////////////////////////////////////////////////////////////////////////////////
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

    scroll();
}

// date style
function newDate(){

    var date   = new Date();
    var years   = date.getFullYear();
    var months  = date.getMonth();
    var days    = date.getDay();
    var hours   = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    months  = months  < 10 ? "0"+months  : ""+months;
    days    = days    < 10 ? "0"+days    : ""+days;
    hours   = hours   < 10 ? "0"+hours   : ""+hours;
    minutes = minutes < 10 ? "0"+minutes : ""+minutes;
    seconds = seconds < 10 ? "0"+seconds : ""+seconds;

    return time = months+"/"+days+" - "+hours+":"+minutes;

}

// get the nicer unique ID
function getMessageId(snapshot) {
  return snapshot.name().replace(/[^a-z0-9\-\_]/gi,'');
}

// get the unique ID
function getId(snapshot) {
  return snapshot.name();
}

// shows the messages taken from the database (shows reusively by the on() function)
function showMessages(fb){
    fb.limit(50).on('child_added', function(snapshot){
        var message = snapshot.val();
        
        if (message.name == "changedName"){ // changed user names
        
            $('<li class="nameChange"/>')
                .attr('id', getMessageId(snapshot))
                .append($('<div class="out"/>')
                .text(message.text))
                .appendTo($('#capanel .textbox'));
        
        } else if (message.name == "Chattr!"){ // initial lobbies
        
            $('<li class="groupTitle"/>')
                .attr('id', getMessageId(snapshot))
                .append($('<div class="out"/>')
                .text(message.text))
                .appendTo($('#capanel .textbox'));
                
        } else if (message.name == "userLeft"){ // when a user leaves
        
            $('<li class="userLeave"/>')
                .attr('id', getMessageId(snapshot))
                .append($('<div class="out"/>')
                .text(message.text))
                .appendTo($('#capanel .textbox'));
        
        } else if (message.name == "userJoin"){ // when a user leaves
        
            $('<li class="userJoined"/>')
                .attr('id', getMessageId(snapshot))
                .append($('<div class="out"/>')
                .text(message.text))
                .appendTo($('#capanel .textbox'));
        
        } else { // everything else
        
            /* if text contains http convert into an anchor _blank */
            
            var text = message.text;
            
            // supposed to create links...
            var text = text.replace(/(>|<a[^<>]+href=['"])?(https?:\/\/([-a-z0-9]+\.)+[a-z]{2,5}(\/[-a-z0-9!#()\/?&.,]*[^ !#?().,])?)/gi, function($0, $1, $2){
                return ($1 ? $0 : '<a href="' + $2 + '" target="_blank">' + $2 + '</a>');
            });
            // convert protocol-less URLs into links
            var text = message.text.replace(/(:\/\/|>)?\b(([-a-z0-9]+\.)+[a-z]{2,5}(\/[-a-z0-9!#()\/?&.]*[^ !#?().,])?)/gi, function($0, $1, $2){
                return ($1 ? $0 : '<a href="http://' + $2 + '">' + $2 + '</a>');
            });
        
            $('<li/>')
                .attr('id', getMessageId(snapshot))
                .append($('<div class="user"/>')
                .text(message.name)
                .attr('title', message.name))
                .append($('<div class="time"/>')
                .text(message.time)
                .attr('title', message.time))
                .append($('<div class="out"/>')
                .text(text))
                .appendTo($('#capanel .textbox'));
        }
        
        scroll();
    });
}

// scrolls down when called
function scroll(){
    $('#capanel .textbox').scrollTop($('#capanel .textbox').prop("scrollHeight"));
}

// shows the group the the user is in
function showGroup(group){
    $('#currentGroup').remove();

    $(".group").show();

    $('<span id="currentGroup"/>')
        .text(group)
        .appendTo($('.group'));

    console.log("show group: " + group);

}

// shows this message when creating a new group that is empty
function defaultMessage(fb, group){
    fb.once('value', function(snapshot){
        if(snapshot.val() === null){
            fb.push({name: 'Chattr!', text: 'Welcome to the ' + group + ' group!' });
        }

        console.log("added a default message to: " + group);
    });
}

// sends the message the user wrote
function send(fb){
    var nameField = $('#capanel-name').val(); // gets the name from the input
    
    if (nameField == ''){ // checks if it's empty
        $('#capanel-name').val('Anonymous');
    }
    
    if (nameField != fbUserName){ // updates the database for the userlist
    
        console.log("send() updated username: " + fbUserName+" to: " + nameField);
        var nameChangeMsg = fbUserName + " changed their name to " + nameField;
        
        /*$('<li class="nameChange"/>')
            .text(nameChangeMsg)
            .appendTo($('#capanel .textbox'));*/
        
        fbUser.update({name:nameField});
        
        fb.push({ name : "changedName", text : nameChangeMsg, time : newDate() }); // sends message about a name change
        
        fbUsers.off();
        $('.select-user').remove();
        listUsers();
    }
    
    var text = $('#capanel-text').val();
    
    fb.push({name:fbUserName, text:text, time:newDate()});
    $('#capanel-text').val('');

    console.log("Sending message...");

    scroll();
}

// create group from button
function createGroup(fbGropus){

console.log("creating group?");

    if ($('#addGroupInput').val() == ''){
        // do nothing
    } else {

        group = $('#addGroupInput').val();

        group = group.replace(/\ /g,'_');
        group = group.replace(/\./g,'-');

        hideAddGroupInput();

        fb.off(); // turns off the chat

        Firebase.goOffline(); // gets offline for new fb

        fb = new Firebase(firebaseURL+"/groups/"+group);

        $(".textbox li").remove();

        hideGroup();

        console.log("Created a Group: "+group);

        showGroup(group);

        Firebase.goOnline();

        //console.log(fb);

        showMessages(fb);

        defaultMessage(fb, group);

        showAddBtn();
    }

    scroll();
}

function cancelGroup(group){
    hideCancelBtn();
    hideAddGroupInput();
    console.log("cancelGroup: "+group);
    showGroup(group);
    showAddBtn();
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
function hideAddGroupInput(){
    console.log('hideAddGroupInput');
    $("#addGroupInput").hide();
}
function hideGroup(){
    console.log('hideGroup');
    $(".group").hide();
}

//clicking an existing group
function clickGroup(){

    /* This function runs the same ammount of times as there are databases for some reason */

    console.log("clicking exsisting group: "+$(this).val());

    group = $(this).val(); // grabs option text

    // remove prevous chat and stop previous js
    $(".textbox li").remove();
    
    hideGroup();
    showAddBtn(); // (hides incase the user clicks "add" then decides to join a group before clicking "cancel"
    hideAddGroupInput();
    hideCancelBtn();

    fb.off(); // turns off the chat

    Firebase.goOffline(); // gets offline for new fb

    fb = new Firebase(firebaseURL + "/groups/" + group);

    Firebase.goOnline();

    //console.log(fb);

    showMessages(fb)
    showGroup(group);

    defaultMessage(fb, group);

    scroll();
}

function listUsers(){
    fbUsers.on('child_added', function(snapshot){
        console.log("listUsers()");
        var message = snapshot.val();
        $('<option class="select-user"/>')
            .attr('id', getMessageId(snapshot))
            .text(message.name)
            .appendTo($('#capanel .selectUsers'));
    });
}

// set removing user from database
function lastUser(snapshot){
    // all records after the last continue to invoke this function
    //console.log(idName);
    //console.log(++cnt);

    if (cnt == 1){ // lastUser gets ran twice, so adding 1
        idName = getId(snapshot);
        fbUser = new Firebase(firebaseURL+"/users/"+idName);
        fbUser.onDisconnect().remove(function(){
            $("#"+idName).remove();
        });
        console.log('deleteLAST:'+idName);
        cnt =+ 10000;
    }
    console.log(++cnt);

    // IF YOU CAN GET THIS WORKING WITHOUT A TIMEOUT, GOOD LUCK!
    setTimeout(function(){
        console.log(cnt + ":250");
        if (cnt == 1){
            idName = getId(snapshot);
            fbUser = new Firebase(firebaseURL+"/users/"+idName);
            fbUser.onDisconnect().remove(function(){
                $("#"+idName).remove();
            });
            console.log('deleteONE:'+idName);
            cnt =+ 10000;
        }
    }, 1500);
}

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Called when dependencies finished loading
//void dependCallback(){
//    loadChattr();
//}

// Main entry point (nothing runs before this!)
function entry(){
    // grabs website URL, firebase cannot have periods...
    yourURL = window.location.hostname.replace(/\./g,'-');
    // default to handle multiple sites
    firebaseURL = "https://chatappcd.firebaseio.com/" + yourURL + "/chat";
    
    injectDependencies();
}

entry();