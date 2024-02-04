console.log("HI!")

var userInput = $('#text-input')
var userCities = [];
var currentCity = $('#current-city');
var currentWeatherList = $('#current-weather')
var city;
var weatherAPIKey = 'f5ae2638dc599c5d3619396cd657ae93';

var weather = {};

userInput.on('change', function () {
    city = this.value
    getWeather()
    currentCity.text(city);
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
            console.log(weather);
        },
        // if invalid city is entered
        error: function (xhr, status, error) {
            // Handle error scenario, such as when the city is not found
            // alert("Please enter a valid city. Error: " + error);
        }
    });
}



// variable to handle user input via ID
// event handler takes user input and puts in an object called "userCities"
// user input triggers API call to retrieve data for that city
// current data is posted
// future forcast is looped over and appended and classes are added via bootstrap cards
// "userCities" is stringified and saves to local storage
// local storage is parsed and the DOM is appended to a ul and lis to represent recently viewed cities
