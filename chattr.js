/* Chattr - Made by Jeremy Plsek. Contribution by Charlie and Ethan. Initiated at CodeDay Boston */

var cnt = 0; // wut ??

function loadDependency(src, callback){
    var jqElement = document.createElement('script');
    jqElement.src = src;
    jqElement.async = true;
    jqElement.onreadystatechange = jqElement.onload = function(){
        console.log("script loaded");
        var state = jqElement.readyState;
        if(!callback.done && (!state || /loaded|complete/.test(state))){
            callback.done = true;
            callback();
        }
    };
    document.getElementsByTagName("head")[0].appendChild(jqElement);
}

function loadFirebase(){
    // Add Firebase
    console.log('loadFirebase: loading firebase');
    loadDependency("https://cdn.firebase.com/js/client/1.0.15/firebase.js", dependCallback);
}

function injectDependencies(){
    // Add jQuery
    if(!("$" in window)){ // Is jquery incuded?
        console.log('injectDependencies: loading jquery');
        loadDependency("https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js", loadFirebase);
    } else {
        console.log('injectDependencies: loading firebase');
        loadFirebase();
    }
}

function loadChattr(){
    // 1 ////////////////////////////////////////////////////////////////////////////////////////
    // 4 ////////////////////////////////////////////////////////////////////////////////////////
    loadPanel();
    
    bindEvents();
    
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

    if (nameField === '' || nameField === undefined){
        username = 'Anonymous';
        console.log("set anon name..");
        $('#capanel-name').val('Anonymous');
    } else {
        username = nameField;
        console.log("use last cached name..");
    }

    fbUsers = new Firebase(firebaseURL+"/users/");

    fbUsers.push({ name : username });

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
        fb.push({ name : "userJoin", text : fbUserName + " joined the chat", time : newDate()});

        scroll();
    }, 2000);

    fbUsers.on('child_removed', function(snapshot) {
        var fbUserRemoved = $('.selectUsers').children('#' + getMessageId(snapshot));
        console.log(fbUserName+" left chattr...");
        fb.push({ name : "userLeft", text : fbUserName+" left the chat", time : newDate() });
        fbUserRemoved.remove();
    });

    //console.log(fb);

    $('#addGroupInput').hide();
    $('.cancelGroup').hide();

    showMessages(fb);
    showGroup(group);
    defaultMessage(fb, group);
    showAddBtn();

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
}

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Called when dependencies finished loading
function dependCallback(){
    loadChattr();
}

// Main entry point (nothing runs before this!)
function entry(){
    // grabs website URL, firebase cannot have periods...
    yourURL = window.location.hostname.replace(/\./g,'-');
    // default to handle multiple sites
    firebaseURL = "https://chatappcd.firebaseio.com/" + yourURL + "/chat";
    
    injectDependencies();
}

entry();