chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    
    let url = info.url
    let queryString = url.substring(url.indexOf('?') + 1 );
    let qs_data = parseQueryString(queryString);

    if(info.method == "GET"){

      if(qs_data.t == 'event'){
        chrome.tabs.sendMessage(info.tabId, {data: qs_data});

      } else if (qs_data.t == 'pageview') {
        chrome.tabs.sendMessage(info.tabId, {data: {ec: 'PageView', ea: qs_data.dt , el: qs_data.dp }});
        
      } else if (qs_data.hasOwnProperty('tid')){
        chrome.tabs.sendMessage(info.tabId, {data: {ec: 'Transaction', ea: qs_data.tid , el: qs_data.dl }});
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