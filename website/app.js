/* Global Variables */
const apiKey = '47a10e3387db18cc4f8422e70e41092a&units=imperial';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const baseUrlCoordinatesByZipCode = 'http://api.openweathermap.org/geo/1.0/zip'

const generateButtonElement = document.getElementById('generate');
const zipCodeElement = document.getElementById('zip');
const feelingElement = document.getElementById('feelings');
const dateElement = document.getElementById('date');
const tempElement = document.getElementById('temp');
const contentElement = document.getElementById('content');
const userInfo = document.getElementById('userInfo');

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();

const fahrenheitToCelcius = (fahrenheit) => {
    return ((parseFloat(fahrenheit) - 32) / 1.8).toFixed(2);
}

/**
 * 
 * @param {string} baseUrlCoordinatesByZipCode 
 * @param {string} zipCode 
 * @param {string} apiKey 
 * @returns {
        "zip": string,
        "name": string,
        "lat": number,
        "lon": number,
        "country": string
    }
 */
const getGeoCoordinate = async (zipCode) => {
    const geoCoordinateResponse = await fetch(`${baseUrlCoordinatesByZipCode}?zip=${zipCode},US&appid=${apiKey}`);
    return await geoCoordinateResponse.json();
}
/**
 * 
 * @param {string} baseUrl 
 * @param {string} zipCode 
 * @param {string} apiKey 
 * @returns {
        "main": {
            "temp": number,
            "feels_like": number,
            "temp_min": number,
            "temp_max": number,
            "pressure": number,
            "humidity": number
        }
    }
 */
const getWeatherDataFromOpenWeatherAPI = async (geoCoordinate) => {
    const weatherDataResponse = await fetch(`${baseUrl}?lat=${geoCoordinate?.lat}&lon=${geoCoordinate?.lon}&exclude=hourly,daily&appid=${apiKey}`);
    return await weatherDataResponse.json();
};

/**
 * 
 * @param {Object} data 
 * @returns 
 */
const postWeatherData = (data) => {
    const payload = {
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    }
    return fetch('/postWeatherData', payload);
};

const retrieveData = async () => {
    const request = await fetch('/getWeatherData');
    try {
        // Transform into JSON
        const allData = await request.json()
        console.log(allData)
        // Write updated data to DOM elements
        dateElement.innerHTML = '<span>Current date: </span>' + '<b>' + allData?.date + '<b/>';
        tempElement.innerHTML = '<span>Current temputure: </span>' + '<b>' + Math.round(allData.temp) + ' degrees'+ '<b/>';
        contentElement.innerHTML = '<span>Note: </span>' + '<b>' + allData?.content+ '<b/>';
    }
    catch(error) {
        console.log("error", error);
        alert('Something went wrong, please try again!');
    }
}

const requestWeatherData = (e) => {
    e.preventDefault();

    const zipCode = zipCodeElement.value;
    const content = feelingElement.value;
    if (!zipCode) {
        alert('Zip code is required!')
        return;
    }
    getGeoCoordinate(zipCode)
        .then(value => {
            return getWeatherDataFromOpenWeatherAPI(value);
        })
        .then((data) => {
            console.log('weather data');
            console.log(data);
            const payload = {
                temp: fahrenheitToCelcius(data.main.temp),
                date: newDate,
                content: content
            }
            return postWeatherData(payload);
        })
        .then(() => retrieveData())
        .catch(function (error) {
            console.log(error);
            alert('Something went wrong, please try again!');
        });
}

generateButtonElement.addEventListener('click', requestWeatherData);