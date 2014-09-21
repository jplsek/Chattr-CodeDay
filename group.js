
function hideAddGroupInput(){
    console.log('hideAddGroupInput');
    $("#addGroupInput").hide();
}
function hideGroup(){
    console.log('hideGroup');
    $(".group").hide();
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