// finds errors on JS
'use strict';
/* 
weather api https://www.weatherbit.io/api/weather-forecast-16-day
https://api.weatherbit.io/v2.0/forecast/daily
Your API Key: 3c5b4b36457f455886f10d7cd6bc05cb
Your API Key: f4d489e503b54097b0c57e2db6193da9
https://workflowy.com/s/IKbH.yDtVmoJUb2
*/
let celsius = true;
// stores the the variable that indicates which city will be displayed when the page loads
let currentCity = 'São Paulo';
// api's url
const baseURL = 'https://api.weatherbit.io/v2.0/forecast/daily';
// api's key
const apiKey = 'f4d489e503b54097b0c57e2db6193da9';
// sets a name to the week days, otherwise they'd be displayed as numbers 0 - 6 (Sunday to Saturday)
const weekdays = {
    0: 'Dom',
    1: 'Seg',
    2: 'Ter',
    3: 'Qua',
    4: 'Qui',
    5: 'Sex',
    6: 'Sáb',
}

// executes getForecast function, displays São Paulo's weather forecast when the page is first loaded
getForecast(currentCity);

/* 
JQuery is way easier than typing document.getElementById('search').onclick
(event) loads all the information about the event (what the function does)
this way the page does not lose the info
*/
//changes the weather forecast according to the city typed
$('#search').on('click', function(e) {
    // If this method is called, the default action of the event will not be triggered.
 	event.preventDefault();
    /* .val() in JQuery is the same as .value() in JS,
    this constant stores the value inserted in the search box (#city)
    it'll be the name of cities
    */
    let newCity = $('#city').val();
    // executes funtion getForecast() using the constant newCity
    getForecast(newCity);
});

// gets info from toggle switch
$('#unit-toggle').on('change', function(e) {
    celsius = !celsius;
    getForecast(currentCity);
});
/*
executes ajax, this function avoids it to be written twice as we need ajax to be used both
for the #search and when the page is loaded for the first time (default city)
*/
function getForecast(city) {
    // displays load bar but not the forecast (it's still loading the api)
    $('#loader').css('display', '');
    $('#forecast').css('display', 'none');
    // condition that changes °C to °F(#unit on <span>) according to the toggle switch position
    const unit = (celsius ? '°C' : '°F');
    console.log(unit);
    $('#unit').text(unit);
    // sets labels for the toggle
    // executes function clearfields()
    clearfields();
    // resquests api
    /*
    this one could also be used but let's give a try on the other $.ajax
    $.ajax(url).done(function(result) {
    	console.log(result);
    })
    */
    $.ajax({
        // accesses the base URL
        url: baseURL,
        // inserts api key, gets the info of a city and set the language to Brazilian portuguese (pt-br)
        data: {
            key: apiKey,
            city: city,
            lang: 'pt'
        },
        // if the api is successfully accessed 
        success: function(result) {
            // displays the forecast, not the load icon
            $('#loader').css('display', 'none');
            $('#forecast').css('display', '');
            // sets the <h2> element to the typed city name
            $('#city-name').text(result.city_name);
            console.log(result);
            // creates a variable containing forecast info
            const forecast = result.data;
            console.log(forecast)
            // gets info from today's forecast info (array 0)
            const today = forecast[0];
            console.log(today);
            // calls function displayToday
            displayToday(today);
            /* stores info from next days in a const
            slice() starts getting  array elements from that number on
            */
            const nextDays = forecast.slice(1);
            // calls function displayNextDays
            displayNextDays(nextDays);
        },
        // in case of error, displays the error response
        error: function(error) {
            console.log(error.responseText);
        }
    });
}

function clearfields() {
    // deletes previous #next-days (min, max temperature cards for next days forecast)
    $('#next-days').empty();
}

// displays today's forescast info
function displayToday(today) {
    /* gets info related to average temperatyre, windSpeed, humidity, a brief weather description (including icon)
     and stores them in a constant */
    let temperature = Math.round(today.temp);
    // if the temperatures is not Celsius (according to what is selected on the toggle)
    if (!celsius) {
        temperature = CelToFah(temperature);
    }
    const weather = today.weather.description;
    const windSpeed = today.wind_spd;
    const humidity = today.rh;
    const icon = today.weather.icon;
    // backsticks (` `) were used for the icon's URL
    const iconURL = `https://www.weatherbit.io/static/img/icons/${icon}.png`;
    console.log(iconURL);
    // sets <span> (on html) to values gotten from the api
    $('#current-temperature').text(temperature);
    $('#current-weather').text(weather);
    $('#current-wind').text(windSpeed);
    $('#current-humidity').text(humidity);
    // attributes the source of the image to #weather-icon
    $('#weather-icon').attr('src', iconURL);
}

// displays next days' forescast info (minimum and maximum temperature only)
function displayNextDays(nextDays) {
    // executes for loop
    for (let i = 0; i < nextDays.length; i = i + 1) {
        // stores tomorrow's weather info (min, max temperature) according to the date
        const day = nextDays[i];
        //Math.round() is used to round numbers
        let min = Math.round(day.min_temp);
        let max = Math.round(day.max_temp);
        // if the temperatures is not Celsius (according to what is selected on the toggle)
        if (!celsius) {
            min = CelToFah(min);
            max = CelToFah(max);
        }
        const date = new Date(day.valid_date);
        //.getUTCDay 0 - 6 (it starts on Sunday (0))
        const weekday = weekdays[date.getUTCDay()];
        /* creates <div> (tomorrow's day card)
        ${} displays what is stored in the constants ,
        .getUTCDate returns the day of the month 1 - 31
        .getUTCMonth returns the month 0 - 11 (that's why + 1 , it's an array)
        */
        const card = $(`<div class="day-card">
            <div class="date">${date.getUTCDate()}/${date.getUTCMonth() + 1}</div>
            <div class="weekday">${weekday}</div>
            <div class="temperatures">
              <span class="max">${max}°</span>
              <span class="min">${min}°</span>
            </div>
          </div>`);
        // appends x to <div class="next-days"> (on html)
        card.appendTo('#next-days');
        // show the first element of the array card on console log
        console.log(card[0]);
    }
}
// changes the temperature from Celsius to
function CelToFah(celsius) {
    return Math.round(1.8 * celsius + 32);
}