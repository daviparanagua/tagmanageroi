window.addEventListener('load', function(){
    let show_monitor = document.getElementById('show_monitor');
    
    document.getElementById('show_monitor').addEventListener('click',()=>{
        chrome.storage.sync.set({ 'show_monitor': show_monitor.checked, 'show_monitor_info_dismissed':true }, ()=>{});
    });

    chrome.storage.sync.get(['show_monitor'], (result)=>{
        show_monitor.checked = result.show_monitor;
    });
});