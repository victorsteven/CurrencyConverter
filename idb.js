import idb from 'idb';


var dbPromise = idb.open('currency-db', 1, upgradeDb => {
    switch(upgradeDb.oldVersion){
        case 0: 
        upgradeDb.createObjectStore('currency-db');
        break;
        

        default: 
            console.error("Database creation was not successful.");
            break;

    }
});

export default class DB {
    static getCurrencies(key){
        return dbPromise
            .then(db => {
                if(!db) return;
                const transaction = db.transaction('currency-db');
                const store = transaction.objectStore('currency-db');

                const data = store.get(key);

                return data;
            })
            .catch(err => {
                console.error('Database error', err);
            });
    }

    static saveCurrencyArray(key, arrayOfCurrencies){
        return dbPromise
                .then(db => {
                    const transaction = db.transaction('currency-db', 'readwrite');
                    const store = transaction.objectStore('currency-db');
                    store.put(arrayOfCurrencies, key);
                })
                .catch(err => {
                    console.error('Error occured saving data', err);
                });
    }

    static saveCurrencies(key, currencies){
        return dbPromise
            .then(db => {
                const transaction = db.transaction('currency-db', 'readwrite');
                const store = transaction.objectStore('currency-db');
                currencies.forEach(currency =>store.put(currency, key));
            })
            .catch(err => {
                console.error('Error occured savind data', err);
            });
    }
}


