
function bindEvents(){

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
}