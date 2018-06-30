import DB from '../idb';

//Register Service Worker
if('serviceWorker' in navigator){  
    navigator.serviceWorker.register('serviceWorker.js')

    .then(() =>{
        console.log('Service Worker Registered');
    });
}

document.addEventListener('DOMContentLoaded', () => {

   
    const convertFrom = document.getElementById('convert-from');
    const convertTo = document.getElementById('convert-to');

    const convertButton = document.getElementById('convert-button');
    const convertedValue = document.querySelector('input#converted-value');  
    const body = document.querySelector('body');

    function value_to_convert(){
        const valueEntered = document.getElementById('value-to-convert').value;
        return valueEntered;
    }

    function node_option(nodeType, currency){
        if(arguments.length !==2){
            console.error('Two arguments are needed.');
        }else{
            const createOptionNode = document.createElement(nodeType);
            createOptionNode.innerText = currency;

            return createOptionNode;
        }
    }

    function add_currencies(arrayOfCurrencies){

        if(
            arrayOfCurrencies.length === 0 || typeof arrayOfCurrencies === 'undefined'
        ){
        console.error('Currency array cannot be empty or undefined.');
        }
        const nodeTypeToCreate = 'option';

            arrayOfCurrencies.map(currency => {
                convertFrom.appendChild(node_option(nodeTypeToCreate, currency));
                convertTo.appendChild(node_option(nodeTypeToCreate, currency));
        });
    }

    function get_currencies(){
        const url = 'https://free.currencyconverterapi.com/api/v5/currencies';
        fetch(url, {
            cache: 'default',
        })
            .then(res => res.json())
            .then(data => {
                const arrayOfCurrencies = Object.keys(data.results).sort();

                //Save a users currency exchange used when online for usage when the user is offline
                DB.saveCurrencyArray('allCurrencies', arrayOfCurrencies);

                add_currencies(arrayOfCurrencies);
            }).catch(err=> {
                console.error(`Error while getting currency: ${err}`,
        );
        //Get the exchange rate when offline
        DB.getCurrencies('allCurrencies').then(arrayOfCurrencies => {
            if(typeof arrayOfCurrencies === 'undefined')
            return;
            add_currencies(arrayOfCurrencies);
        });
       }); 
    }


    function get_rate(url, queryString){
        if (arguments.length !== 2) {
            console.error('Two currencies are needed o perform this operation.');
        
        }else{
            const valueEntered = value_to_convert();
            fetch(url, {
                cache: 'default',
            })
            .then(res => res.json())
            .then(data => {
                const exchangeRate = Object.values(data);

                //Save currency currency used during online transaction to be used offline
                DB.saveCurrencies(queryString, exchangeRate);

                calculate_rate(...exchangeRate, valueEntered);
            }).catch(err =>{
                console.error(`Error getting conversion rate: ${err}`,);
                //Get the currency exchange rate when the user is offline
                DB.getCurrencies(queryString).then(data => {
                    if(typeof data === 'undefined') return;
                    calculate_rate(data, valueEntered);
                });
            });     
        }

    }
   
    function api_url(queryString){
        if(typeof queryString === 'undefined'){
            console.error('The parameter passed to the function is undefined.');
        }else{
            const currencyUrl = `https://free.currencyconverterapi.com/api/v5/convert?q=${queryString}&compact=ultra`;
            return currencyUrl;
        }
    }

    function apply_rate(){
        const currency1 = document.getElementById('convert-from').value;
        const currency2 = document.getElementById('convert-to').value;

        const currencyQueryString = `${currency1}_${currency2}`;

        const url = api_url(currencyQueryString);

        get_rate(url, currencyQueryString);
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
        body.addEventListener('keydown', e => enter_pressed(e));
    }

    function process_request(){
        convert();
        get_currencies();
    }

    process_request();

});