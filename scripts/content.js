let n = 0;

(function(){
    
    let analyzer_popup = this.document.createElement('div');
    analyzer_popup.id = 'gaoi_analyzer';
    analyzer_popup.innerHTML = '<div class="ga-popup-title"><span class="hidable">Monitor de eventos </span><div class="right-menu"><a id="ga_oi_events_close_popup" class="hidable">🗕</a><a id="ga_oi_events_open_popup" class="showable">🗖</a><a id="ga_oi_events_toggle_position">↔</a></div></div><table id="ga_oi_events" class="hidable"><thead><tr><th>N</th><th>Horário</th><th>Categoria</th><th>Ação</th><th>Rótulo</th></tr></thead></table>';
    if(document.body){
        document.body.appendChild(analyzer_popup);
    } else {
        window.addEventListener('load',function(){
            document.body.appendChild(analyzer_popup);
        });
    }    
})();

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    n++;
    let data = request.data || {};
    let ev_table = document.querySelector('#ga_oi_events');

    let tr = document.createElement('tr');
    tr.innerHTML = '<td>'+n+'</td><td>' + new Date().toLocaleString('pt-BR',{ hour:'2-digit', minute: '2-digit' ,second: '2-digit' }) + '</td>' + '<td>' + parseField(data.ec) + '</td>' + '<td>' + parseField(data.ea) + '</td>' + '<td>' + parseField(data.el) + '</td>';
    ev_table.insertBefore(tr,ev_table.firstChild);

    sendResponse({data: data, success: true});
});

document.querySelector('#ga_oi_events_close_popup').addEventListener('click', function(){
    document.querySelector('#gaoi_analyzer').classList.add('ga-analyzer-hidden');
})

document.querySelector('#ga_oi_events_open_popup').addEventListener('click', function(){
    document.querySelector('#gaoi_analyzer').classList.remove('ga-analyzer-hidden');
})

document.querySelector('#ga_oi_events_toggle_position').addEventListener('click', function(){
    document.querySelector('#gaoi_analyzer').classList.toggle('ga-analyzer-left');
})

function parseField(fieldText){
    fieldText = decodeURIComponent(fieldText);
    fieldText = fieldText.replace(/_/g, '<span class="ul_separator">_ </span>');
    return fieldText;
}