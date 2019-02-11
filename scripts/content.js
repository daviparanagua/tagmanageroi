let n = 0;

// Inject pagescript
var s = document.createElement('script');
s.src = chrome.extension.getURL('pageScript.js');
(document.head || document.documentElement).appendChild(s);
//Our pageScript.js only add listener to window object, 
//so we don't need it after it finish its job. But depend your case, 
//you may want to keep it.
//s.parentNode.removeChild(s);

(function(){
    let analyzer_popup = this.document.createElement('div');
    analyzer_popup.id = 'gaoi_analyzer';

    analyzer_popup.classList.add('current_view_e');

    analyzer_popup.innerHTML = `
    <div class="ga-popup-title">
        <div class="right-menu">
            <a id="ga_oi_events_view_p" class="hidable view_e">P</a>
            <a id="ga_oi_events_view_e" class="hidable view_p">E</a>
            <span class="separator hidable">|</span>
            <a id="ga_oi_events_clear" class="hidable">🗑</a>
            <a id="ga_oi_events_toggle_opacity" class="hidable">👁</a>
            <span class="separator hidable">|</span>
            <a id="ga_oi_events_close_popup" class="hidable">🗕</a>
            <a id="ga_oi_events_open_popup" class="showable">🗖</a>
            <a id="ga_oi_events_toggle_position">↔</a>
            <a id="ga_oi_events_close">🗙</a> 
        </div>
        <div class="page-info hidable">
            <div class="page-info-topic">Nome da página: <strong id="gaoi-monitor-page-name"></strong></div>
            <div class="page-info-topic">URL:  <strong id="gaoi-monitor-URL"></strong></div>
        </div>
        <hr class="hidable" />
    </div>
    <div id="gaoi-analyzer-table-wrapper">
        <table id="ga_oi_events" class="hidable view_e">
            <thead>
                <tr>
                    <th>N</th><th>Horário</th><th>Categoria</th><th>Ação</th><th>Rótulo</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <table id="ga_oi_produts" class="hidable view_p">
            <thead>
                <tr>
                    <th>Produto</th><th>Preço</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
    `;

    if(document.body){
        document.body.appendChild(analyzer_popup);
    } else {
        window.addEventListener('load',function(){
            document.body.appendChild(analyzer_popup);
        });
    }    
})();
    
chrome.storage.sync.get(['default_view', 'minimized', 'left_aligned'], function(result) {
    if(result.default_view){
        toggleGATab(result.default_view);
    } else {
        toggleGATab('e');
    }

    if(result.minimized == 1){
        hide();
    }

    if(result.left_aligned == 1){
        document.querySelector('#gaoi_analyzer').classList.add('ga-analyzer-left');
    }
});

window.addEventListener('load',function(){
    let event = new CustomEvent('GET_DATALAYER');
    window.dispatchEvent(event);
});

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    n++;
    let data = request.data || {};
    let ev_table = document.querySelector('#ga_oi_events tbody');

    let tr = document.createElement('tr');
    tr.innerHTML = '<td>'+n+'</td><td>' + new Date().toLocaleString('pt-BR',{ hour:'2-digit', minute: '2-digit' ,second: '2-digit' }) + '</td>' + '<td>' + parseField(data.ec) + '</td>' + '<td>' + parseField(data.ea) + '</td>' + '<td>' + parseField(data.el) + '</td>';
    ev_table.insertBefore(tr,ev_table.firstChild);

    sendResponse({data: data, success: true});
});

window.addEventListener('message', function receiveDatalayer(event) {
    if(event.data.action === 'GOT_DATALAYER') {
       //window.removeEventListener('message', receiveDatalayer, false);
       //this.console.log(event.data.payload);
    }
}, false);

document.querySelector('#ga_oi_events_close_popup').addEventListener('click', function(){
    hide();
    chrome.storage.sync.set({minimized: 1}, function() {});
})

document.querySelector('#ga_oi_events_open_popup').addEventListener('click', function(){
    unhide();
    chrome.storage.sync.set({minimized: 0}, function() {});
})

document.querySelector('#ga_oi_events_toggle_position').addEventListener('click', function(){
    let element = document.querySelector('#gaoi_analyzer')
    let stValue = 0;

    if(!element.classList.contains('ga-analyzer-left')){
        stValue = 1;
    }

    chrome.storage.sync.set({left_aligned: stValue}, function() {});
    document.querySelector('#gaoi_analyzer').classList.toggle('ga-analyzer-left');
})

document.querySelector('#ga_oi_events_toggle_opacity').addEventListener('click', function(){
    document.querySelector('#gaoi_analyzer').classList.toggle('ga-analyzer-opaque');
})

document.querySelector('#ga_oi_events_close').addEventListener('click', function(){
    document.querySelector('#gaoi_analyzer').outerHTML = '';
})

document.querySelector('#ga_oi_events_clear').addEventListener('click', function(){
    document.querySelector("#ga_oi_events tbody").innerHTML = "";
})

document.querySelector('#ga_oi_events_view_p').addEventListener('click', function(){
    toggleGATab('p');
})

document.querySelector('#ga_oi_events_view_e').addEventListener('click', function(){
    toggleGATab('e');
})

function toggleGATab(tab){
    document.querySelector("#gaoi_analyzer").classList.remove("current_view_e");
    document.querySelector("#gaoi_analyzer").classList.remove("current_view_p");
    document.querySelector("#gaoi_analyzer").classList.add("current_view_" + tab);
    chrome.storage.sync.set({default_view: tab}, function() {});
}

function parseField(fieldText){
    fieldText = decodeURIComponent(fieldText);
    fieldText = fieldText.replace(/_/g, '<span class="ul_separator">_</span>');
    return fieldText;
}

function hide(){
    document.querySelector('#gaoi_analyzer').classList.add('ga-analyzer-hidden');
}

function unhide(){
    document.querySelector('#gaoi_analyzer').classList.remove('ga-analyzer-hidden');
}