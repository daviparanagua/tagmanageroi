window.addEventListener('load', ()=>{
    document.getElementById('clearallbtn').addEventListener('click',()=>{
        clearAllEvents();
    })
})


// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
    name: "tag-devtools-" + chrome.devtools.inspectedWindow.tabId
});

backgroundPageConnection.onMessage.addListener(function (message) {
    // Handle responses from the background page, if any
    console.log(backgroundPageConnection.name);
    let ev_table = document.querySelector('#event-list');
    let data = message.data || {};
    let cell = document.createElement('tr');
    cell.className = "event recent fading";
    let cellString = '';

    if(data.ec == 'PageView'){cell.classList.add('pageview');}
    if(data.ec == 'ecommerce'){cell.classList.add('ecommerce');}
    if(data.ec == 'Midia'){cell.classList.add('midia');}

    //cellString += '<div class="event"><div class="title">' + new Date().toLocaleString('pt-BR',{ hour:'2-digit', minute: '2-digit' ,second: '2-digit' }) + '</div>';
    //cellString += '<div class="event_body"><div class="category">' + parseField(data.ec) + '</div>' + '<div class="action">' + parseField(data.ea) + '</div>' + '<div class="label">' + parseField(data.el) + '</div></div></div>';
    
    //cellString += '<td class="time">' + new Date().toLocaleString('pt-BR',{ hour:'2-digit', minute: '2-digit' ,second: '2-digit' }) + '</td>';
    cellString += '<td class="category">' + parseField(data.ec) + '</td>' + '<td class="action">' + parseField(data.ea) + '</td>' + '<td class="label">' + parseField(data.el) + '</td>';
    
    cell.innerHTML = cellString;

    //ev_table.appendChild(cell);
    ev_table.insertBefore(cell,ev_table.firstChild);

    setTimeout(()=>{cell.classList.remove("recent");}, 100);
    setTimeout(()=>{cell.classList.remove("fading");}, 2000);
});


function parseField(fieldText){
    fieldText = decodeURIComponent(fieldText);
    fieldText = fieldText.replace(/_/g, '<span class="ul_separator">_</span>');
    return fieldText;
}

function clearAllEvents(){
    document.getElementById('event-list').innerHTML = '';
}