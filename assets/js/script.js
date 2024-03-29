// user input
var userInput = $('#text-input');
// search button
var searchBtn = $('#search');
// clear recent searches button
var clearBtn = $('#clear');
// array for recent searches
var userCities = [];
// information for current wewather
var currentCity = $('#current-city');
var currentWeatherEl = $('#current-weather');
var currentWeatherListEl = $('<ul>');
var weatherAPIKey = 'f5ae2638dc599c5d3619396cd657ae93';

// object for current weather stats
var weather = {};
// array including objects for 5 day forecast
var weatherForecast = [];
// flag if user input is a valid city
var cityValid = false;

// pulls from local storage on page load
getData();

// event listener for search button
searchBtn.on('click', function () {

    // conditional if user input is or is not blank
    if (userInput.val() === "") {
        return;
    } else {
        // Assign user input to variable and corrects capitalization
        var cityName = userInput.val().trim().toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        // Search weather
        getWeather(cityName);

        // Search 5-day forecast
        getWeatherForecast(cityName);

        // Clear user input
        userInput.val("");
    }
});

// clear all information in recent searches and on page
clearBtn.on('click', function () {
    $('#search-list').empty();
    currentCity.empty();
    currentWeatherEl.empty();
    $('#forecast-section').empty();
    userCities = [];
    storeData(userCities);
    displayUserCities()

})

// Stores to local storage
function storeData(arr) {
    localStorage.setItem('userCities', JSON.stringify(arr));
}

// Retrieves data from local storage to be displayed
function getData() {
    var storedCities = JSON.parse(localStorage.getItem('userCities'));
    if (storedCities !== null) {
        userCities = storedCities;
    }
    displayUserCities(); // Display cities as soon as they are fetched
}


// Displays the recent searches
function displayUserCities() {
    storeData(userCities);

    // Clear existing city buttons to prevent duplicates
    $('#search-list').empty();

    // iterates over userCities array to be appended to the DOM as buttons
    userCities.forEach(function (city) {
        var cityButton = $('<button>')
            .addClass('btn btn-info m-1') // Add Bootstrap classes and a margin
            .text(city) // Set the button text to the city name
            .on('click', function () {
                var cityName = $(this).text();
                console.log(`The button is reading: ${cityName}`);
                getWeather(cityName);
                getWeatherForecast(cityName);
            });

        // Appends buttons in list items to the DOM
        var searchEl = $('<span>')
        $('#search-list').append(searchEl);
        searchEl.html(cityButton);

    });
}


// request for openWeather API
function getWeather(cityName) {
    var requestWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + weatherAPIKey + '&units=imperial';
    console.log(`Get Weather is reading: ${cityName}`)
    $.ajax({
        url: requestWeatherUrl,
        method: 'GET',
        success: function (response) {
            console.log(response);
            cityValid = true;
            // Assuming the request was successful and data is retrieved
            // writes to object for weather data
            weather.temp = Math.floor(response.main.temp);
            weather.wind_speed = Math.floor(response.wind.speed);
            weather.humidity = response.main.humidity;
            weather.condition = response.weather[0].main
            weather.icon = response.weather[0].icon;
            // Takes care of current day weather for searched city 
            showCurrentWeather(cityName);


            // Check if the city is already in the userCities array and if it's a valid city
            if (!userCities.includes(cityName) && cityValid) {
                // console.log(cityValid)
                userCities.push(cityName); // Add city to array if not already present
                storeData(userCities);
                displayUserCities();
            }

        },
        // if invalid city is entered
        error: function (xhr, status, error) {
            cityValid = false;
            // Handle error scenario, such as when the city is not found
            alert("Please enter a valid city. Error: " + error);
        }
    });
}

// fetches forecast
function getWeatherForecast(cityName) {
    var requestWeatherForecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + weatherAPIKey + '&units=imperial';
    weatherForecast = [];
    $.ajax({
        url: requestWeatherForecastUrl,
        method: 'GET',
        success: function (response) {

            // Assuming the request was successful and data is retrieved
            for (var i = 4; i < response.list.length; i += 8) { // Adjusted to loop through each day for noon forecast
                var forecast = {
                    temp: Math.floor(response.list[i].main.temp),
                    humidity: response.list[i].main.humidity,
                    wind_speed: Math.floor(response.list[i].wind.speed),
                    icon: response.list[i].weather[0].icon,
                    date: response.list[i].dt_txt
                };
                weatherForecast.push(forecast);
            }
            showFiveDayForecast();
        },
        error: function (xhr, status, error) {
            // Handle error
            console.error("Error fetching weather forecast:", error);
        }
    });
}

// Displays current weather information
function showCurrentWeather(cityName) {
    // Clear previous weather data
    currentWeatherListEl.empty();
    currentCity.empty(); // Clear previous city name and weather icon

    // Set the city name text
    currentCity.append(cityName);
    var currentDate = $('<h3>');
    currentDate.text('Now');
    currentDate.addClass('display-5 ml-5 col now-text');

    // Append the weather icon image to the currentCity
    var weatherIconUrl = `http://openweathermap.org/img/wn/${weather.icon}.png`;
    var weatherIconImg = $('<img>').attr('src', weatherIconUrl).attr('alt', 'Weather icon').addClass('weather-icon');
    currentCity.append(weatherIconImg);
    currentCity.append(currentDate);

    // Create and append list items for weather details with margin class
    var tempLi = $('<li>').text(`Temperature: ${weather.temp} °F`).addClass('m-3');
    var humidityLi = $('<li>').text(`Humidity: ${weather.humidity} %`).addClass('m-3');
    var windLi = $('<li>').text(`Wind Speed: ${weather.wind_speed} MPH`).addClass('m-3');

    // Append the list items to the UL element
    currentWeatherListEl.addClass('search-list ml-0').append(tempLi, humidityLi, windLi);

    // Append the UL element to the currentWeatherEl container
    currentWeatherEl.append(currentWeatherListEl);
}


// Displays 5 day forecast
function showFiveDayForecast() {
    // Clear existing content in the forecast section
    $('#forecast-section').empty();

    // Loop through the first 5 items of the weatherForecast array
    for (var i = 0; i < 5; i++) {
        var forecast = weatherForecast[i];

        // Calculate the delay based on the index, for example
        var delayClass = `delay-${i + 1}s`;

        // Use the icon code from the forecast object to construct the image URL
        var iconUrl = `http://openweathermap.org/img/wn/${forecast.icon}.png`;

        // grabs date information from forecast object
        const dateString = forecast.date;
        const date = new Date(dateString);


        // Extracting the day of the week and the date
        const options = { weekday: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);


        // Create the card HTML with the weather icon image
        var cardHtml = `
               <div class="col justify-content-center fadeIn ${delayClass}">
                    <div class="card thick-border" style="width: 18rem;">
                    <section class="row">
                        <img src="${iconUrl}" class="col card-img-top weather-icon-card" alt="Weather icon">
                        <h5 class="col d-flex align-items-center">${formattedDate}</h5>
                     </section>
                        <div class="card-body">
                            <h5 class="card-title">Forecast</h5>
                            <p class="card-text">Temperature: ${forecast.temp}°F</p>
                            <p class="card-text">Humidity: ${forecast.humidity}%</p>
                            <p class="card-text">Wind Speed: ${forecast.wind_speed} mph</p>
                        </div>
                    </div>
                </div>
            `;

        // Append the card to the forecast section
        $('#forecast-section').append(cardHtml);
    }
}





