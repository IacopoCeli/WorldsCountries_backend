const url = 'https://restcountries.com/v3.1/independent?status=true';

async function GetCountries(){

    return fetch(url)
    .then(response => response.json())
    .then(data => data)
    .catch(err => {
        console.log(err);
        return '[]';
    })

}

module.exports = {GetCountries};