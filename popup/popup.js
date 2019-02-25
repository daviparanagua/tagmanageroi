window.addEventListener('load', function(){
    let show_monitor = document.getElementById('show_monitor');
    let show_balloons = document.getElementById('show_balloons');
    
    document.getElementById('show_monitor').addEventListener('click',()=>{
        chrome.storage.sync.set({ 'show_monitor': show_monitor.checked, 'show_monitor_info_dismissed':true }, ()=>{});
    });

    document.getElementById('show_balloons').addEventListener('click',()=>{
        chrome.storage.sync.set({ 'show_balloons': show_balloons.checked}, ()=>{});
    });

    chrome.storage.sync.get(['show_monitor', 'show_balloons'], (result)=>{
        show_monitor.checked = result.show_monitor;
        show_balloons.checked = result.show_balloons;
    });
});