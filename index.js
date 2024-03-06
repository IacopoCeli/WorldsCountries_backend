const getCountriesAPI = require('./my_module/getCountries')
const express = require('express');
const cors = require('cors');
const app = express();

const MakeResponseJsonMessage = (status, message, jsonObject = {}) => {

    return {
        status: status,
        message: message,
        jsonObject: {
            elementNumber: jsonObject.length ? jsonObject.length : 0,
            object: jsonObject
        }
    }
}

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))


app.get('/', (req, res) => { res.send(MakeResponseJsonMessage(1, 'Welcome to expressJs-test 1.0')) });


app.get('/testRouteParams/:routeParam1/:routeParam2', (req, res) => {
    res.send(MakeResponseJsonMessage(1, `you are sending @ the server the rout params ${req.params.routeParam1} and ${req.params.routeParam2}`));
});


app.get('/testQueryString', (req, res) => { res.send(MakeResponseJsonMessage(1, '', req.query)) })



/*
    get params:
        - name
        - carSide
        - continent
        - populationMax
        - populationMin
        - currencies
*/
app.get('/Countries', (req, res) => {

    getCountriesAPI.GetCountries()
        .then(data => {

            let name = req.query.name ? req.query.name : '';
            let carSide = req.query.carSide ? req.query.carSide : '';
            let continent = req.query.continent ? 
                                (req.query.continent.split('').map((c, index, array) => c = (!index || array[index-1] == ' ') ? c.toUpperCase() : 
                                c.toLowerCase())).join('') : ''; // Capitalizzo ogni parola di una frase
            let populationMax = req.query.populationMax ? req.query.populationMax : '';
            let populationMin = req.query.populationMin ? req.query.populationMin : '';
            let currencies = (req.query.currencies) ? req.query.currencies.split(';') : '';

            res.send(MakeResponseJsonMessage(1, '', data.filter(country => {

                return (country.name.common.toUpperCase().includes(name.toUpperCase()) &&
                        ((!carSide) || (country.car.side.toUpperCase() == carSide.toUpperCase())) &&
                        ((!continent) || (country.continents.includes(continent))) &&
                        ((!populationMax) || (country.population <= parseInt(populationMax))) &&
                        ((!populationMin) || (country.population >= parseInt(populationMin))) &&
                        ((!currencies) || (Object.getOwnPropertyNames(country.currencies).filter((currency) => currencies.includes(currency)).length > 0)))

            })))
        
        })
        .catch(err => res.send(MakeResponseJsonMessage(0, err)))

});

app.get('/WorldCurrencies', (req, res) => {

    getCountriesAPI.GetCountries()
        .then(data => {

            let _currencies = [];

            data.forEach(country => {
                Object.getOwnPropertyNames(country.currencies).forEach((currency) => {

                    let c = {
                        name: country.currencies[currency].name,
                        label: currency,
                        symbol: country.currencies[currency].symbol ? country.currencies[currency].symbol : 'n.a.'
                    };

                    if(_currencies.filter(ele => ele.label == c.label) == 0) _currencies.push(c);

                })
            });

            res.send(MakeResponseJsonMessage(1, '', _currencies));

        })
        .catch(err => res.send(MakeResponseJsonMessage(0, err)));

});



app.all('*', (req, res) => { res.send(MakeResponseJsonMessage(0, 'Invalid route path!')) })

app.listen(8081);