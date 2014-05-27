/* Chattr - Made by Jeremy Plsek, Initiated at CodeDay Boston */

function makeUI(){

    //firebaseURL = "https://chatappcd.firebaseio.com/"+window.location.hostname+"/chat"; /* default to handle multiple sites */
    
    injectDependencies();
    
    // waits for dependencies
    setTimeout(function(){
        chattr(); // runs actual app
    }, 1000); 
}

function injectDependencies(){
    var head = document.getElementsByTagName("head")[0];

    // Add jQuery
    if (!("$" in window)){ // Is jquery incuded?
        var jqElement = document.createElement('script');
        jqElement.src  = "//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js";
        head.appendChild(jqElement);
    }
    
    // Add Firebase
    var fbElement = document.createElement('script');
    fbElement.src  = "//cdn.firebase.com/js/client/1.0.15/firebase.js";
    head.appendChild(fbElement);
}

function chattr(){

    $(document).ready(function() {

    $('body').append('\
        <div class="button chat-button" id="capanel-toggle">\
            + Chat\
        </div>\
    ');

    });

    $(document).ready(function() {
    
        $(document).ready(function() {
            
            
            $("#shrink").hide();
            
            $('#capanel').hide();
            $('#capanel-toggle').click(function(){
                $('#capanel').toggle();
                $('#capanel-toggle').toggle();
            });
            
        });
            
        // date style
        function newDate(){

            var date    = new Date();
            var hours   = date.getHours(); 
            var minutes = date.getMinutes(); 
            var seconds = date.getSeconds();
            
            hours   = hours   < 10 ? "0"+hours   : ""+hours;
            minutes = minutes < 10 ? "0"+minutes : ""+minutes;
            seconds = seconds < 10 ? "0"+seconds : ""+seconds;
            
            return time = hours+":"+minutes+":"+seconds;
            
        }
    
        // get the nicer unique ID
        function getMessageId(snapshot) {
          return snapshot.name().replace(/[^a-z0-9\-\_]/gi,'');
        }
        
        // get the unique ID
        function getId(snapshot) {
          return snapshot.name();
        }

        // enables the messages taken from the database (shows reusively by the on() function)
        function showMessages(fb){

            fb.limit(50).on('child_added', function(snapshot) {
                var message = snapshot.val();
                $('<div class="message"/>')
                    .attr('id', getMessageId(snapshot))
                    .append($('<div class="user"/>')
                    .text(message.name))
                    .append($('<div class="time"/>')
                    .text(message.time))
                    .append($('<div class="out"/>')
                    .text(message.text))
                    .appendTo($('#capanel .textbox'));
                    
                scroll();
                
            });
            
        }

        // scrolls down when called
        function scroll(){
            
            $('#capanel .textbox').scrollTop($('#capanel .textbox').prop("scrollHeight"));
            
        }

        // shows the group the the user is in
        function showGroup(group){

            $('<div class="group"/>')
                    .text("Current Group: "+group)
                    .prependTo($('.top'));
                    
            console.log("show group: "+group);

        }

        // shows this message when creating a new group that is empty
        function defaultMessage(fb, group){
            
            fb.once('value', function(snapshot) {
                if (snapshot.val() === null) {
                    fb.push({name: 'Chattr', text: 'Welcome to the '+group+' group!' });
                }
                
                console.log("added a default message to: "+group);
                
            });
            
        }

        // sends the message the user wrote
        function send(fb){
            
            // updates the username
            if ($('#capanel-name').val() != fbUserName){
                fbUser.update({name:$('#capanel-name').val()});
                fbUsers.off
                $('.select-user').remove();
                listUsers();
            }
            if ($('#capanel-name').val() == ''){
                $('#capanel-name').val('Anonymous');
            }
            if ($('#capanel-text').val() == ''){
                // do nothing
            } else {
                var name = $('#capanel-name').val();
                var text = $('#capanel-text').val();
                newDate();
                fb.push({name:name, text:text, time:time});
                $('#capanel-text').val('');
            }
            
            console.log("Sending message...");
            
            scroll();
            
        }

        // create group from button
        function createGroup(fbGropus){
            
            if ($('#addGroupInput').val() == ''){
                // do nothing
            } else {
                
                group = $('#addGroupInput').val();
                
                $("#addGroupInput").remove();
                
                fb.off(); // turns off the chat
                
                Firebase.goOffline(); // gets offline for new fb
                
                fb = new Firebase(firebaseURL+"/groups/"+group);
                
                $(".message").remove();
                $(".group").remove();
                
                console.log("CreateGroup: "+group);
                
                showGroup(group);
                
                Firebase.goOnline();
                
                //console.log(fb);
                
                showMessages(fb)
                
                defaultMessage(fb, group);
                
                addGroupBtn()
                
                scroll();
                
            }
            
            console.log("create group...");
            
            scroll();
            
        }
        
        function cancelGroup(groupCurrent){
            $(".cancelGroup").remove();
            $("#addGroupInput").remove();
            showGroup(groupCurrent);
            addGroupBtn()
        }
        
        // adding the group button to the page
        function addGroupBtn(){
            $('<button type="button" class="button addGroup" title="add group">Add</button>')
                .insertAfter($('#capanel .selectGroups'));
                
            // activate button
            $('.addGroup').click(function(){
            
                var groupCurrent = $(".group").val();
                
                $(".group").remove();
                $(".addGroup").remove();
                
                $('<input type="text" class="input" maxlength="20" id="addGroupInput" placeholder="New Group Name" autofocus/>')
                    .prependTo($('.top'));
                    
                $('<button type="button" class="button cancelGroup" title="cancel group">Cancel</button>')
                    .insertAfter($('#capanel .selectGroups'));
                    
                // check key strokes
                $("#addGroupInput").keypress(function(e) {
                    if (e.keyCode == 13) { // enter
                        
                        $(".cancelGroup").remove();
                        createGroup(fbGroups);
                        
                    } else if (e.keyCode == 27) { // escape
                        
                        cancelGroup(groupCurrent)
                        
                    }
                    
                });
                
                $(".cancelGroup").click(function(){
                
                    cancelGroup(groupCurrent)
                
                });
                
                console.log("add group btn");
                
                console.log("groupCurrent: "+groupCurrent);
                
                scroll();
                
            });
        }

        //clicking an existing group
        function clickGroup(event){
            
            console.log("clicking exsist group...");
                    
            // remove prevous chat and stop previous js
            
            $(".message").remove();
            $(".group").remove();
            
            fb.off(); // turns off the chat
            
            Firebase.goOffline(); // gets offline for new fb
            
            
            var group = event.target.id;
            fb = new Firebase(firebaseURL+"/groups/"+group);
            
            Firebase.goOnline();
            
            //console.log(fb);
            
            showMessages(fb)
            showGroup(group);
            
            defaultMessage(fb, group);
            
            scroll();
            
        }

        function listUsers(){
            fbUsers.on('child_added', function(snapshot) {
                var message = snapshot.val();
                $('<option class="select-user"/>')
                    .attr('id', getMessageId(snapshot))
                    .text(message.name)
                    .appendTo($('#capanel .selectUsers'));
                    
            
            });
        }

        cnt = 0;

        // set removing user from database
        function lastUser(snapshot) {

            // all records after the last continue to invoke this function
            //console.log(idName);
            //console.log(++cnt);
           
            
            if (cnt == 1){ // lastUser gets ran twice, so adding 1
                
                idName = getId(snapshot);
                fbUser = new Firebase(firebaseURL+"/users/"+idName);
                fbUser.onDisconnect().remove(function(){
                    $("#"+idName).remove()
                });
                console.log('deleteLAST:'+idName);
                cnt=+10000;
                
            }
            console.log(++cnt);
            
            // IF YOU CAN GET THIS WORKING WITHOUT A TIMEOUT, GOOD LUCK!
            setTimeout(function(){
                
                console.log(cnt+":250");
                if (cnt == 1){
                    idName = getId(snapshot);
                    fbUser = new Firebase(firebaseURL+"/users/"+idName);
                    fbUser.onDisconnect().remove(function(){
                        $("#"+idName).remove()
                    });
                    console.log('deleteONE:'+idName);
                    cnt=+10000;
                } 
            }, 1500); 

        }
            
        $(document).ready(function() {

            console.log("Using url: "+firebaseURL);
            
            fbGroups = new Firebase(firebaseURL+"/groups");
            
            if ($('#capanel-name').val() == ''){
                username = 'Anonymous';
                //$('#capanel-name').val('Anonymous')
            } else {
                var username = $('#capanel-name').val();
            }
            
            
            
            fbUsers = new Firebase(firebaseURL+"/users/");
            
            
            fbUsers.push({name:username});
            
            // retrieve the last record
            fbUsers.endAt().limit(1).on('child_added', lastUser);
            
            // Gets the user
            setTimeout(function(){
                
                console.log(fbUser.toString());
                
                fbUser.on('value', function(snapshot) {
                    
                    fbUserName = snapshot.val().name;
                       
                    listUsers();
                
                });
                
                scroll();
                
            }, 2500); 
            
            
            fbUsers.on('child_changed', function(snapshot) {
              var message = snapshot.val();
              var fbUserChanged = $('.selectUsers').children('#' + getMessageId(snapshot));
              if (fbUserChanged) {
                fbUserChanged
                    .attr('id', getMessageId(snapshot))
                    .text(message.name)
                    .appendTo($('#capanel .selectUsers'));
              }
            });
            
            fbUsers.on('child_removed', function(snapshot) {
                  var fbUserRemoved = $('.selectUsers').children('#' + getMessageId(snapshot));
                  if (fbUserRemoved) {
                        fbUserRemoved.remove();
                  }
            });
            
            
            var group = 'default';
            fb = new Firebase(firebaseURL+"/groups/"+group);
            
            //console.log(fb);
            
            // checks when the user presses enter in the text box
            $("#capanel-text").keypress(function(e) {
                if (e.keyCode == 13) {
                    
                    send(fb)
                    
                }
            });
            
            $("#capanel-submit").click(function() {
                
                send(fb)
                
            });
            
            $("#capanel #enlarge").click(function(){
                $('#capanel').css("width", '350px');
                $('#capanel').css("height", '500px');
                $('#capanel .textbox').css("height", '60%');
                $("#capanel #enlarge").hide();
                $("#capanel #shrink").show();
            });
            $("#capanel #shrink").click(function(){
                $('#capanel').removeAttr('style')
                $('#capanel .textbox').removeAttr('style')
                $("#capanel #enlarge").show();
                $("#capanel #shrink").hide();
            });
            $("#capanel #close").click(function(){
                $("#capanel").hide();
                $('#capanel-toggle').show();
            });
            
            showMessages(fb);
            
            showGroup(group);
            
            defaultMessage(fb, group);
            
            addGroupBtn();
            
            scroll();
            
            // show group list
            fbGroups.on('child_added', function(snapshot) {
                $('<option class="select-group"/>')
                    .attr('id', getMessageId(snapshot))
                    .text(getMessageId(snapshot))
                    .appendTo($('#capanel .selectGroups'));
                    
                scroll();
                
                $('.select-group').click(clickGroup); // clicking .select-group in chrome doesnt work?
            });
            
        });

        $('head').append('\
        <style>\
            /* Chattr Stylesheet */\
            #capanel *{\
                box-sizing:border-box;\
                margin:0;\
            }\
            #capanel{ /* Main Panel */\
                font-family:helvetica;\
                font-size:80%;\
                position:absolute;\
                width:250px; /* static for now */\
                height:400px;\
                background:#F6F6F6;\
                border:1px solid #c6c6c6;\
                color:#191a1c;\
                padding:0;\
                box-sizing:border-box;\
                bottom:10px;\
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
            #capanel .message{\
                border-bottom:1px solid #DBDBDB;\
                padding:3px 5px;\
            }\
            #capanel .message:nth-child(even){\
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
                margin-bottom:8px;\
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
            </style>\
        ');

        $('body').append('\
            <div id="capanel">\
                <div class="top">\
                        <button type="button" id="enlarge" class="button" title="enlarge">++</button>\
                        <button type="button" id="shrink" class="button" title="shrink">--</button>\
                    <button type="button" id="close" class="button" title="close">X</button>\
                    <div class="drops">\
                    Groups:\
                    <select class="button selectGroups">\
                        <option></option>\
                    </select>\
                    <br/>Users:\
                    <select class="button selectUsers">\
                        <option></option>\
                    </select>\
                    </div>\
                </div>\
                <div class="textbox"></div>\
                <div class="bottom">\
                    <form>\
                        <input id="capanel-name" onClick="this.select();" type="text" class="input" placeholder="Name" maxlength="20"/>\
                        <input type="text" id="capanel-text" class="textarea" placeholder="Message" maxlength="1024"></textarea>\
                        \
                        <input style="background: rgb(212, 212, 212);color: rgb(148, 152, 161);" class="button" type="button" name="file" value="Upload..." readonly/>\
                        <input id="capanel-submit" class="button" type="button" value="Send"/>\
                    </form>\
                </div>\
            </div> <!-- #capanel -->\
        ');

        scroll();
    });

}

makeUI();
