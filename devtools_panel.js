
// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
    name: "tag-devtools-" + chrome.devtools.inspectedWindow.tabId
});

backgroundPageConnection.onMessage.addListener(function (message) {
    // Handle responses from the background page, if any
    console.log(backgroundPageConnection.name);
    let ev_table = document.querySelector('#event-list');
    let data = message.data || {};
    let cell = document.createElement('div');

    cellString = '<div class="event"><div class="title">' + new Date().toLocaleString('pt-BR',{ hour:'2-digit', minute: '2-digit' ,second: '2-digit' }) + '</div>';
    cellString += '<div class="event_body"><div class="category">' + parseField(data.ec) + '</div>' + '<div class="action">' + parseField(data.ea) + '</div>' + '<div class="label">' + parseField(data.el) + '</div></div></div>';
    
    cell.innerHTML = cellString;

    //ev_table.appendChild(cell);
    ev_table.insertBefore(cell,ev_table.firstChild);
});


function parseField(fieldText){
fieldText = decodeURIComponent(fieldText);
fieldText = fieldText.replace(/_/g, '<span class="ul_separator">_</span>');
return fieldText;
}