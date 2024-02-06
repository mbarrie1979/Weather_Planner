console.log("HI!")

var userInput = $('#text-input');
var searchBtn = $('#search');
var clearBtn = $('#clear');
var userCities = [];
var currentCity = $('#current-city');
var currentWeatherEl = $('#current-weather');
var currentWeatherListEl = $('<ul>');
var weatherAPIKey = 'f5ae2638dc599c5d3619396cd657ae93';

var weather = {};
var weatherForecast = [];
var cityValid = false;

getData();


searchBtn.on('click', function () {

    if (userInput.val() === "") {
        return;
    } else {
        // Assign user input to variable
        var cityName = userInput.val().trim(); // Use .trim() to remove any leading/trailing whitespace

        // Search weather
        getWeather(cityName);

        // Search 5-day forecast
        getWeatherForecast(cityName);

        // Clear user input
        userInput.val("");
    }
});

// clear all information in city list and on page
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


// rewuest for openWeather API
function getWeather(cityName) {
    var requestWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + weatherAPIKey + '&units=imperial';
    console.log(`Get Weather is reading: ${cityName}`)
    $.ajax({
        url: requestWeatherUrl,
        method: 'GET',
        success: function (response) {
            cityValid = true;
            // Assuming the request was successful and data is retrieved
            // writes to object for weather data
            weather.temp = Math.floor(response.main.temp);
            weather.wind_speed = Math.floor(response.wind.speed);
            weather.humidity = response.main.humidity;
            weather.condition = response.weather[0].main
            // Takes care of current day weather for searched city 
            showCurrentWeather(cityName);


            // Check if the city is already in the userCities array and if it's a valid city
            if (!userCities.includes(cityName) && cityValid) {
                console.log(cityValid)
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
            console.log(response);
            // Assuming the request was successful and data is retrieved
            for (var i = 4; i < response.list.length; i += 8) { // Adjusted to loop through each day for noon forecast
                var forecast = {
                    temp: Math.floor(response.list[i].main.temp),
                    humidity: response.list[i].main.humidity,
                    wind_speed: Math.floor(response.list[i].wind.speed), // Adjusted based on the correct path
                    condition: response.list[i].weather[0].main,
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


function showCurrentWeather(cityName) {
    // Clear previous weather data
    currentWeatherListEl.empty();
    currentCity.empty(); // Clear previous city name and weather icon
    // Determine the image source based on weather.condition
    var imgSrc;
    switch (weather.condition) {
        case "Clouds":
            imgSrc = "./assets/Images/cloudy.png";
            break;
        case "Clear":
            imgSrc = "./assets/Images/sunny.png";
            break;
        case "Rain":
            imgSrc = "./assets/Images/rain.png";
            break;
        case "Snow":
            imgSrc = "./assets/Images/snowy.png";
            break;
        case "Thunderstorm":
            imgSrc = "./assets/Images/thunderstorms.png";
            break;
        default:
            imgSrc = "";
    }
    // Set the city name text
    currentCity.append(cityName);
    // Append the image to the currentCity if imgSrc is not empty
    if (imgSrc) {
        var weatherIcon = $('<img>').attr('src', imgSrc).attr('alt', weather.condition).addClass('weather-icon');
        currentCity.append(weatherIcon);
    }



    // Create and append list items for weather details with margin class
    var tempLi = $('<li>').text(`Temperature: ${weather.temp} °F`).addClass('m-3');
    var humidityLi = $('<li>').text(`Humidity: ${weather.humidity} %`).addClass('m-3');
    var windLi = $('<li>').text(`Wind Speed: ${weather.wind_speed} MPH`).addClass('m-3');


    // Append the list items to the UL element
    currentWeatherListEl.append(tempLi, humidityLi, windLi );

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
                imgSrc = "./assets/Images/cloudy.png";
                break;
            case "Clear":
                imgSrc = "./assets/Images/sunny.png";
                break;
            case "Rain":
                imgSrc = "./assets/Images/rain.png";
                break;
            case "Snow":
                imgSrc = "./assets/Images/snowy.png";
                break;
            case "Thunderstorm":
                imgSrc = "./assets/Images/thunderstorms.png";
                break;
            default:
                imgSrc = "";
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





