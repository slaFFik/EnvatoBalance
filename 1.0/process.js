// Restores input to saved value from localStorage.
window.onload = function() {
    var username = localStorage["envato_username"];
    var key      = localStorage["envato_api_key"];

    if (key && key.length > 1) {
        jQuery("#key").val(key);
    }else{
        user_message('error');
    }

    if (username && username.length > 1) {
        jQuery("#username").val(username);
    }else{
        user_message('error');
    }
}

jQuery(document).ready(function(){
    jQuery('#save').click(save);
});

// Saves options to localStorage.
function save() {
    var username = jQuery("#username").val();
    var key      = jQuery("#key").val();
    console.log(username);
    console.log(key);

    localStorage["envato_username"] = username;
    localStorage["envato_api_key"]  = key;

    user_message('saved');

    return false;
};

function user_message(type){
    var status = jQuery("#status");
    status.removeAttr('style');
    if (type == 'saved'){
        // Update status to let user know options were saved.
        if(jQuery("#key").val().length > 1 && jQuery("#username").val().length > 1){
            status.removeClass('error').addClass('ok').html('Options were saved.');
            setTimeout(function() {
                status.animate({'opacity': '0'}, 1000, function(){
                    status.removeClass('ok');
                });
            }, 1000);
        }else{
            user_message('error');
        }
    }else
    if(type == 'error'){
        status.removeClass('ok').addClass('error').html('Both username and API key should be entered.').fadeIn('fast');
    }
}