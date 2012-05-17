// Force reload the balance once clicked on an icon
chrome.browserAction.onClicked.addListener(function(tab) {
    do_request(true);
});


function do_request(stop){
    var error    = false;
    var balance  = false;
    var results  = false;
    var username = localStorage["envato_username"];
    var key      = localStorage["envato_api_key"];
    
    // exit if no required data
    if(!key || !username){
        chrome.browserAction.setBadgeText({text:'err'});
        alert('Please define in settings both Envato Marketplaces username and API key!');
        return;
    }

    $.ajax({
        dataType: 'GET',
        url: 'http://marketplace.envato.com/api/edge/'+username+'/'+key+'/vitals.json',
        //url: 'http://dl.dropbox.com/u/6771917/vitals.json', // for testing
        complete: function(data){
            var results = $.parseJSON(data.responseText);
            if(results.code !== undefined && results.code == 'exception'){
                error = true;
                chrome.browserAction.setBadgeText({text: 'n/a'});
                return;
            }
            // overlay the icon
            var balance = process_balance(results.vitals.balance);
            chrome.browserAction.setBadgeText({text: String(balance)});
            
            if(stop == true){
                if(error){
                    alert('Sorry, the service is currently unavailable! Please check later.');
                    return;
                }
                alert(results.vitals.username+', your current balance is $'+results.vitals.balance);
            }else{
                setTimeout(function(){
                    do_request(false);
                }, 1800000);
            }
        }
    });
}

do_request(false);

function process_balance(balance){
    // display only integer
    var number = String(balance.split('.')[0]);
    var chars = number.length;
    
    if(chars < 5){ // 0-9999
        return number;
    }else 
    if(chars == 5){ // 10,000-99,999
        return number.substr(0, 2)+'k+';
    }else
    if(chars == 6){ // 100,000-999,999
        return number.substr(0, 3)+'k';
    }else
    if(chars > 6){ // 1,000,000-9,999,999
        return number.substr(0, 1)+'M+';
    }else{
        return 'n/a';
    }
}