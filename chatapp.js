function makeUI(){
    injectDependencies();
    
    // waits for dependencies
    setTimeout(function(){
        chatApp(); // runs actual app
    }, 500); 
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

function chatApp(){

$(document).ready(function() {

$('head').append('\
    <link rel="stylesheet" href="style.css">\
');

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

function getMessageId(snapshot) {
  return snapshot.name().replace(/[^a-z0-9\-\_]/gi,'');
}

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
function defaultMessage(fb){
    
    fb.once('value', function(snapshot) {
        if (snapshot.val() === null) {
            fb.push({name: 'CodeDay', text: 'Welcome to the '+group+' group!' });
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
        
        group = $('#addGroupInput').val()
        
        fb.off(); // turns off the chat
        
        Firebase.goOffline(); // gets offline for new fb
        
        fb = new Firebase("https://chatappcd.firebaseio.com/chat/groups/"+group);
        
        $(".message").remove();
        $(".group").remove();
        
        
        
        showGroup(group);
        
        Firebase.goOnline();
        
        //console.log(fb);
        
        showMessages(fb)
        
        defaultMessage(fb);
        
        addGroupBtn()
        
        scroll();
        
    }
    
    console.log("create group...");
    
    scroll();
    
}
function addGroupBtn(){
        $('<button type="button" class="button addGroup" title="add group">Add</button>')
            .insertAfter($('#capanel .selectGroups'));
    // activate button
    $('.addGroup').click(function(event){
        
        $(".group").remove();
        $(".addGroup").remove();
        
        $('<input type="text" class="input" maxlength="20" id="addGroupInput" placeholder="New Group Name" autofocus/>')
            .prependTo($('.top'));
            
    
        $("#addGroupInput").keypress(function(e) {
            if (e.keyCode == 13) {
                
                createGroup(fbGroups);
                
                $("#addGroupInput").remove();
                
            } else if (e.keyCode == 27) {
                
                $("#addGroupInput").remove();
                
            }
            
        });
        
        console.log("add group btn");
        
        scroll();
        
    });
}

//clicking an existing group
function clickGroup(event){
            
    // remove prevous chat and stop previous js
    
    $(".message").remove();
    $(".group").remove();
    
    fb.off(); // turns off the chat
    
    Firebase.goOffline(); // gets offline for new fb
    
    
    var group = event.target.id;
    fb = new Firebase("https://chatappcd.firebaseio.com/chat/groups/"+group);
    
    Firebase.goOnline();
    
    //console.log(fb);
    
    showMessages(fb)
    showGroup(group);
    
    defaultMessage(fb);
    
    console.log("clicking exsist group...");
    
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
        fbUser = new Firebase("https://chatappcd.firebaseio.com/chat/users/"+idName);
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
            fbUser = new Firebase("https://chatappcd.firebaseio.com/chat/users/"+idName);
            fbUser.onDisconnect().remove(function(){
                $("#"+idName).remove()
            });
            console.log('deleteONE:'+idName);
            cnt=+10000;
        } 
    }, 1500); 

}
    
$(document).ready(function() {
    
    fbGroups = new Firebase("https://chatappcd.firebaseio.com/chat/groups");
    
    if ($('#capanel-name').val() == ''){
        username = 'Anonymous';
        //$('#capanel-name').val('Anonymous')
    } else {
        var username = $('#capanel-name').val();
    }
    
    
    
    fbUsers = new Firebase("https://chatappcd.firebaseio.com/chat/users/");
    
    
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
    fb = new Firebase("https://chatappcd.firebaseio.com/chat/groups/"+group);
    
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
    
    defaultMessage(fb);
    
    addGroupBtn();
    
    scroll();
    
    // show group list
    fbGroups.on('child_added', function(snapshot) {
        $('<option class="select-group"/>')
            .attr('id', getMessageId(snapshot))
            .text(getMessageId(snapshot))
            .appendTo($('#capanel .selectGroups'));
            
        scroll();
        
        $('.select-group').click(clickGroup);
    });
    
});

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
