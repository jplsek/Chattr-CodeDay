
// date style
function newDate(time){

    var date    = new Date(time);
    var years   = date.getFullYear();
    var months  = date.getMonth() + 1;
    var days    = date.getDate();
    var hours   = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    // adds 0 in front of < 10 numbers.
    months  = months  < 10 ? "0" + months  : "" + months;
    days    = days    < 10 ? "0" + days    : "" + days;
    hours   = hours   < 10 ? "0" + hours   : "" + hours;
    minutes = minutes < 10 ? "0" + minutes : "" + minutes;
    seconds = seconds < 10 ? "0" + seconds : "" + seconds;

    return time = months + "/" + days + " - " + hours + ":" + minutes;
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
            
            var time = newDate(message.time);
            var html = Autolinker.link(message.text);
            
            $('<li/>')
                .attr('id', getMessageId(snapshot))
                .append($('<div class="user"/>')
                    .text(message.name)
                    .attr('title', message.name))
                .append($('<div class="time"/>')
                    .text(time)
                    .attr('title', message.time))
                .append($('<div class="out"/>')
                    .html(html))
                .appendTo($('#capanel .textbox'));
        }
        
        scroll();
    });
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
        
        fb.push({ name : "changedName", text : nameChangeMsg, time : Date.now() }); // sends message about a name change
        
        fbUsers.off();
        $('.select-user').remove();
        listUsers();
    }
    
    var text = $('#capanel-text').val();
    
    fb.push({name:fbUserName, text:text, time: Date.now() });
    $('#capanel-text').val('');

    console.log("Sending message...");

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