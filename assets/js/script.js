console.log("HI!")

var userInput = $('#text-input')
var userCities = [];
var currentCity = $('#current-city');
var currentWeatherEl = $('#current-weather');
var currentWeatherListEl = $('<ul>');
var city;
var weatherAPIKey = 'f5ae2638dc599c5d3619396cd657ae93';

var weather = {};
var weatherForecast = [];

userInput.on('change', function () {
    city = this.value
    getWeather();
    getWeatherForecast();
})


// rewuest for openWeather API
function getWeather() {
    var requestWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + weatherAPIKey + '&units=imperial';

    $.ajax({
        url: requestWeatherUrl,
        method: 'GET',
        success: function (response) {

            // Assuming the request was successful and data is retrieved
            weather.temp = Math.floor(response.main.temp);
            weather.wind_speed = Math.floor(response.wind.speed);
            weather.humidity = response.main.humidity;
            weather.condition = response.weather[0].main
            console.log(weather.condition);
            console.log(response)
            showCurrentWeather();
        },
        // if invalid city is entered
        error: function (xhr, status, error) {
            // Handle error scenario, such as when the city is not found
            // alert("Please enter a valid city. Error: " + error);
        }
    });
}

function getWeatherForecast() {
    var requestWeatherForecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + weatherAPIKey + '&units=imperial';
    weatherForecast = []; // Make sure the name is consistent (Forecast not Forcast)
    $.ajax({
        url: requestWeatherForecastUrl,
        method: 'GET',
        success: function (response) {
            // Assuming the request was successful and data is retrieved
            for (var i = 0; i < response.list.length; i += 8) { // Adjusted to loop through each day
                var forecast = {
                    temp: Math.floor(response.list[i].main.temp),
                    humidity: response.list[i].main.humidity,
                    wind_speed: Math.floor(response.list[i].wind.speed), // Adjusted based on the correct path
                    condition: response.list[i].weather[0].main,
                    date: response.list[i].dt_txt
                };
                weatherForecast.push(forecast);
            }
            console.log(response)
            console.log(weatherForecast);
            showFiveDayForecast();
        },
        error: function (xhr, status, error) {
            // Handle error
            console.error("Error fetching weather forecast:", error);
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
            imgSrc = "/assets/Images/cloudy.png";
            break;
        case "Clear":
            imgSrc = "/assets/Images/sunny.png";
            break;
        case "Rain":
            imgSrc = "/assets/Images/rain.png";
            break;
        case "Snow":
            imgSrc = "/assets/Images/snowy.png";
            break;
        case "Thunderstorm":
            imgSrc = "/assets/Images/thunderstorms.png";
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


function showFiveDayForecast() {
    // Clear existing content in the forecast section
    $('#forecast-section').empty();

    // Loop through the first 5 items of the weatherForecast array
    for (var i = 0; i < 5; i++) {
        var forecast = weatherForecast[i];
        var imgSrc;
        // Calculate the delay based on the index, for example
        var delayClass = `delay-${i + 1}s`;
        // Determine the image source based on weather.condition
        switch (forecast.condition) {
            case "Clouds":
                imgSrc = "/assets/Images/cloudy.png";
                break;
            case "Clear":
                imgSrc = "/assets/Images/sunny.png";
                break;
            case "Rain":
                imgSrc = "/assets/Images/rain.png";
                break;
            case "Snow":
                imgSrc = "/assets/Images/snowy.png";
                break;
            case "Thunderstorm":
                imgSrc = "/assets/Images/thunderstorms.png";
                break;
            default:
                imgSrc = ""; // Default case if no condition matches or no icon needed
        }

        const dateString = forecast.date;
        const date = new Date(dateString);

        // Extracting the day of the week and the date
        const options = { weekday: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        console.log(formattedDate); // Outputs: "Tuesday, 5"


        // Create the card HTML with 'weather-icon' class added to the image
        var cardHtml = `
               <div class="col justify-content-center fadeIn ${delayClass}">
                    <div class="card thick-border" style="width: 18rem;">
                    <section class="row">
                        <img src="${imgSrc}" class="col card-img-top weather-icon-card" alt="${forecast.condition}">
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




// variable to handle user input via ID
// event handler takes user input and puts in an object called "userCities"
// user input triggers API call to retrieve data for that city
// current data is posted
// future forcast is looped over and appended and classes are added via bootstrap cards
// "userCities" is stringified and saves to local storage
// local storage is parsed and the DOM is appended to a ul and lis to represent recently viewed cities
