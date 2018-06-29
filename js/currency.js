
//Register Service Worker
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js')
    .then(() =>{
        console.log('Service Worker Registered');
    });
}

document.addEventListener('DOMContentLoaded', () => {

    const body = document.querySelector('body');
    const convertFrom = document.getElementById('convert-from');
    const convertTo = document.getElementById('convert-to');

    const convertButton = document.getElementById('convert-button');
    const convertedValue = document.querySelector('input#converted-value');  

    function value_to_convert(){
        const valueEntered = document.getElementById('value-to-convert').value;
        return valueEntered;
    }

    function node_option(currency){
        if(currency === 'undefined'){
            return 'Please input a valid currency value';
        }else{
            const createOptionNode = document.createElement('option');
            createOptionNode.innerText = currency;

            return createOptionNode;
        }
    }

    function add_currencies(currencies){
        if(!(currencies.length === 0 && currencies === 'undefined')){
            currencies.map(currency => {
                convertFrom.appendChild(node_option(currency));
                convertTo.appendChild(node_option(currency));
            });
        }else{
            return 'Please select the currency to be converted from';
        }
    }

    function get_currencies(){
        fetch('https://free.currencyconverterapi.com/api/v5/currencies')
            .then(res => res.json())
            .then(data => {
                const currencies = Object.keys(data.results).sort();

                add_currencies(currencies);
            }).catch(err=> console.error(`${err}`
        ),
    );
    }

    function get_rate(url){
        
        if(url === 'undefined'){
            return "Please enter a valid URL.";
        }else{
            fetch(url)
            .then(res => res.json())
            .then(data => {
                const valueEntered = value_to_convert();
                const exchangeRate = Object.values(data);
                calculate_rate(...exchangeRate, valueEntered);
            }).catch(err => console.error(`${err}`));
            
        }

    }
   
    function api_url(currency1, currency2){
        if(arguments.length == 2){
            const currencyUrl = `https://free.currencyconverterapi.com/api/v5/convert?q=${currency1}_${currency2}&compact=ultra`;
            return currencyUrl;
        }else{
            return 'Two currencies are needed o perform this operation.';
        }
    }

    function apply_rate(){
        const currency1 = document.getElementById('convert-from').value;
        const currency2 = document.getElementById('convert-to').value;

        const url = api_url(currency1, currency2);

        get_rate(url);
    }

    function calculate_rate(rate, valueEntered){
        if(arguments.length == 2){
            const convertedCurrency = valueEntered * rate;
            convertedValue.value = convertedCurrency;

        }else{
            return 'Please provide the values to be converted'
        }
    }
    function enter_pressed(event){
        if(event === 'undefined'){
            return;
        }
        if(event.keyCode === 13){
            apply_rate();
        }
    }
    function convert(){
        convertButton.addEventListener('click', apply_rate);
        body.addEventListener('keydowm', e => enter_pressed(e));
    }

    function process_request(){
        convert();
        get_currencies();
    }

    process_request();

});