console.log("HI!")

var userInput = $('#text-input')
var userCities = [];
var currentCity = $('#current-city');
var currentWeatherEl = $('#current-weather');
var currentWeatherListEl = $('<ul>');
var city;
var weatherAPIKey = 'f5ae2638dc599c5d3619396cd657ae93';

var weather = {};

userInput.on('change', function () {
    city = this.value
    getWeather();
    getWeatherForcast();
})


// rewuest for openWeather API
function getWeather() {
    var requestWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + weatherAPIKey + '&units=imperial';

    $.ajax({
        url: requestWeatherUrl,
        method: 'GET',
        success: function (response) {
            // Assuming the request was successful and data is retrieved
            weather.temp = response.main.temp;
            weather.wind_speed = response.wind.speed;
            weather.humidity = response.main.humidity;
            weather.condition = response.weather[0].main
            console.log(response);
            console.log(weather.condition);
            showCurrentWeather();
        },
        // if invalid city is entered
        error: function (xhr, status, error) {
            // Handle error scenario, such as when the city is not found
            // alert("Please enter a valid city. Error: " + error);
        }
    });
}

function getWeatherForcast() {
    var requestWeatherForcastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + weatherAPIKey + '&units=imperial';

    $.ajax({
        url: requestWeatherForcastUrl,
        method: 'GET',
        success: function (response) {
            // Assuming the request was successful and data is retrieved

            console.log(response);

        },

        error: function (xhr, status, error) {

        }
    });
}

function showCurrentWeather() {
    // Clear previous weather data
    currentWeatherListEl.empty();
    currentCity.empty(); // Clear previous city name and weather icon
    // Determine the image source based on weather.condition
    var imgSrc;
    switch (weather.condition) {
        case "Clouds":
            imgSrc = "./assets/images/cloudy.png";
            break;
        case "Clear":
            imgSrc = "./assets/images/sunny.png";
            break;
        case "Rain":
            imgSrc = "./assets/images/rain.png";
            break;
        case "Snow":
            imgSrc = "./assets/images/snowy.png";
            break;
        // Add more cases as needed
        default:
            imgSrc = ""; // Default case if no condition matches or no icon needed
    }
    // Set the city name text
    currentCity.append(city);
    // Append the image to the currentCity if imgSrc is not empty
    if (imgSrc) {
        var weatherIcon = $('<img>').attr('src', imgSrc).attr('alt', weather.condition).addClass('weather-icon');
        currentCity.append(weatherIcon);
    }



    // Create and append list items for weather details with margin class
    var tempLi = $('<li>').text(`Temperature: ${weather.temp} °F`).addClass('m-3');
    var windLi = $('<li>').text(`Wind Speed: ${weather.wind_speed} MPH`).addClass('m-3');
    var humidityLi = $('<li>').text(`Humidity: ${weather.humidity} %`).addClass('m-3');

    // Append the list items to the UL element
    currentWeatherListEl.append(tempLi, windLi, humidityLi);

    // Append the UL element to the currentWeatherEl container
    currentWeatherEl.append(currentWeatherListEl);
}




// variable to handle user input via ID
// event handler takes user input and puts in an object called "userCities"
// user input triggers API call to retrieve data for that city
// current data is posted
// future forcast is looped over and appended and classes are added via bootstrap cards
// "userCities" is stringified and saves to local storage
// local storage is parsed and the DOM is appended to a ul and lis to represent recently viewed cities
