var dataLoaded = false;

window.addEventListener('GET_DATALAYER', function getDuckInPage(event) {
    //You can also use dispatchEvent
    window.postMessage({action: 'GOT_DATALAYER', payload: document.OiDatalayer}, '*');
 }, false);

GAfillPageData();

function GAfillPageData(){

    if(document.getElementById('gaoi_analyzer')){

        if(!window.document.hasOwnProperty('OiDatalayer')){
            document.querySelector('#gaoi-monitor-page-name').innerHTML = 'Datalayer não detectado'; 
            dataLoaded = false;
            
        } else {
            
            let dl = document.OiDatalayer;
            let products = false;
            let singleproduct = false;
            let ev_table = document.querySelector('#ga_oi_produts tbody');

            dataLoaded = true;

            if(dl.hasOwnProperty('pageInfo')){
                pageInfo = (dl.pageInfo ||  dl.page);
                document.querySelector('#gaoi-monitor-page-name').innerHTML = (pageInfo.pageName || '&lt;nenhum&gt;');
                document.querySelector('#gaoi-monitor-URL').innerHTML = (pageInfo.URL || '&lt;nenhum&gt;');
            } else {
                document.querySelector('#gaoi-monitor-page-name').innerHTML = '&lt;nenhum&gt;';
                document.querySelector('#gaoi-monitor-URL').innerHTML = '&lt;nenhum&gt;';
            }

            if(dl.hasOwnProperty('productInfo') && dl.productInfo.hasOwnProperty('products')){
                products = dl.productInfo.products;
            } else if(dl.hasOwnProperty('page') && dl.page.hasOwnProperty('product')) {
                singleproduct = dl.page.product;
            }

            if(products && typeof products[Symbol.iterator] === 'function' ){
                ev_table.innerHTML = '';

                for (pdt of products){
                    let tr = document.createElement('tr');
                    tr.innerHTML = '<td>' + (pdt.shortName || pdt.name) + (pdt.default ? ' ★' : '') + '</td>' + '<td>' + (pdt.discountPrice || pdt.price) + '</td>';
                    ev_table.appendChild(tr);
                }

            } else if (singleproduct && singleproduct.hasOwnProperty('name')){
                pdt = singleproduct;
                ev_table.innerHTML = '';

                let tr = document.createElement('tr');
                tr.innerHTML = '<td>' + (pdt.shortName || pdt.name) + (pdt.default ? ' ★' : '') + '</td>' + '<td>' + (pdt.discountPrice || pdt.price) + '</td>';
                ev_table.appendChild(tr);
            }
        }   
    }
    //if(!dataLoaded){
        setTimeout(function(){
            GAfillPageData();
        },1000);
    //}
}