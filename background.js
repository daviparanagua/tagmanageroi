console.log('starting...');
window.devtoolsPorts = {};

chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    console.log('listening...');
    let port = window.devtoolsPorts[info.tabId];
    
    let url = info.url
    let queryString = url.substring(url.indexOf('?') + 1 );
    let qs_data = parseQueryString(queryString);
    
    if(info.method == "GET"){
      let eventData = false;

      if(qs_data.t == 'event'){
        eventData = {data: qs_data};
        
      } else if (qs_data.t == 'pageview') {
        eventData = {data: {ec: 'PageView', ea: qs_data.dt , el: qs_data.dp }};
        
      } else if (qs_data.hasOwnProperty('tid')){
        eventData = {data: {ec: 'Transaction', ea: qs_data.tid , el: qs_data.dl }};
      }
      
      if(eventData)
      {
        chrome.tabs.sendMessage(info.tabId, eventData);
        if(port){port.postMessage(eventData);}
      }

    } else if(info.method == "POST") {
      console.log({m:'post',data:info.requestBody.raw});
    }
  },
  // filters
  {
    urls: [
      "*://*.google-analytics.com/*collect*"
    ]
  },
  // extraInfoSpec
  ["blocking","requestBody"]
);


// Background connection to devtools panel
chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name.indexOf("tag-devtools-") > -1);
  let portId = parseInt(port.name.substring(13));
  port.internalId = portId;

  window.devtoolsPorts[portId] = port;

  port.onDisconnect.addListener(function(port) {
    console.assert(port.name.indexOf("tag-devtools-") > -1);
    window.devtoolsPorts[port.internalId] = false;
  });
/*
  port.onMessage.addListener(function(msg) {
    if (msg.joke == "Knock knock")
      port.postMessage({question: "Who's there?"});
    else if (msg.answer == "Madame")
      port.postMessage({question: "Madame who?"});
    else if (msg.answer == "Madame... Bovary")
      port.postMessage({question: "I don't get it."});
  });
  */
});



function parseQueryString( queryString ) {
  let params = {};
  // Split into key/value pairs
  let queries = queryString.split("&");
  // Convert the array of strings into an object
  for (let i = 0, l = queries.length; i < l; i++ ) {
      let temp = queries[i].split('=');
      params[temp[0]] = temp[1];
  }  
  return params;
};