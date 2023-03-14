// $.ajax({
//     url: "https://api.openweathermap.org/data/2.5/forecast",
//     data: {
//         lat: [], // latitude of the city
//         lon: [], // longitude of the city
//         appid: "91c2192a6f0948bb2d116c3e5eb13b43" // your OpenWeatherMap API key
//     },
//     success: function (response) {
//         // extract the relevant information from the JSON response
//         var city = response.city.name;
//         var date = response.list[0].dt_txt;
//         var icon = response.list[0].weather[0].icon;
//         var temp = response.list[0].main.temp;
//         var humidity = response.list[0].main.humidity;

//         // display the information on your dashboard
//         $("#city").text(city);
//         $("#date").text(date);
//         $("#icon").attr("src", "https://openweathermap.org/img/w/" + icon + ".png");
//         $("#temp").text(temp);
//         $("#humidity").text(humidity);
//     }
// });

var cityList = [];
// get the user's input city name from a form input field
var cityName = $("#cityInput").val();
// Moment JS to display the current date next to the search city 
var currentDate = moment().format(' (D/M/YYYY)');
// add the city name to the array
cityList.push(cityName);



// store the updated array in localStorage
localStorage.setItem("cityList", JSON.stringify(cityList));
// retrieve the cityList array from localStorage
var cityList = JSON.parse(localStorage.getItem("cityList"));

// loop through the array and display each city in a list on the dashboard
for (var i = 0; i < cityList.length; i++) {
    var city = cityList[i];
    var listItem = $("<li>").text(city);
    $("#cityList").append(listItem);
}

$(document).ready(function () {
    // retrieve the cityList array from localStorage
    var cityList = JSON.parse(localStorage.getItem("cityList"));

    // loop through the array and display each city in a list on the dashboard
    for (var i = 0; i < cityList.length; i++) {
        var city = cityList[i];
        var listItem = $("<li>").text(city);
        $("#city-list").append(listItem);
    }

    // add click event listener to the Clear History button
    $("#clear-history").on("click", function () {
        // clear the cityList array in localStorage
        localStorage.removeItem("cityList");
        // clear the list of cities on the dashboard
        $("#city-list").empty();
    });

    // add submit event listener to the search form
    $("form").on("submit", function (event) {
        event.preventDefault();
        // get the value of the city input field
        var city = $("#city-input").val().trim();
        // call the function to get weather data for the city
        getWeatherData(city);
        // clear the city input field
        $("#city-input").val("");
        cityList.push(city)
        getWeatherData(city)
        date()
        displayForecast(city)
        addToSearchHistory(city);
        showSavedCity()
        renderButtons()
    });
});

function renderButtons() {
    // Need to use showSavedCity function whcih is where we get te information from local storage, which we will then assign this to the new rendered button below
    showSavedCity()
    // loop to go through the empty array of searchCity so that a new button can be rendered
    for (var i = 0; i < cityList.length; i++) {
        console.log(cityList[i])
        var buttons = $('<button>')
        // Assigned its id and class so that I can use it for formatting
        buttons.attr({ 'id': "cityBtn", 'class': "col-sm-12" })
        // Buttons text is from the looping through of searchCity by the users input 
        buttons.text(cityList[i])
        // Adds the buttons to the div on the pagex 
        $("#history").append(buttons);
        // tried to add the getItem storage into the function that loops through new button elements
        buttons.on('click', function (event) {
            // used event target to target the element that caused the button on click
            var cityName = $(event.target).text()
            getWeatherData(cityName)
            date()
            displayForecast(cityName)
        })

    }

}

function getWeatherData(city) {
    // make the API call to OpenWeatherMap
    var APIkey = "91c2192a6f0948bb2d116c3e5eb13b43";
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIkey;
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(queryURL);
            console.log(response);
            let cityCod = response.cod
            console.log(cityCod)
            if (cityCod === 'not found') {
                return alert('City name not found')
            }
            else {
                addToSearchHistory()
                var tempCalc = response.main.temp - 273.15;
                var city = response.name;
                var wind = response.wind.speed;
                var humidity = response.main.humidity;
                var icon = response.weather[0].icon;
                var iconUrl = "http://openweathermap.org/img/wn/" + icon + ".png"
                var iconFormat = $('#icon').attr('src', iconUrl,);
                $('#city').text(city + todayDate);
                // toFixed to reduce it to 2 decimal point
                $('#temp').text('Temperature: ' + tempCalc.toFixed(2) + "°C");
                $('#wind').text('Wind: ' + wind + "KPH");
                $('#humidity').text('Humidity: ' + humidity + "%");



                // display the current weather data
                displayCurrentWeather(response);
                // display the 5-day forecast
                displayForecast(response);
                // add the city to the search history
                addToSearchHistory(city);
            }
        });

}


function displayCurrentWeather(response) {
    // extract the necessary data from the API response
    var cityName = response.city.name;
    var date = response.list[0].dt_txt.split(" ")[0];
    var icon = "http://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png";
    var temp = convertKelvinToFahrenheit(response.list[0].main.temp);
    var humidity = response.list[0].main.humidity;
    var windSpeed = response.list[0].wind.speed;
    // create HTML elements to display the data
    var cityHeader = $("<h3>").text(cityName + " (" + date + ")");
    var weatherIcon = $("<img>").attr
}

function date() {
    // Setting variable and adding the amount of the days from the current date
    let tomorrow = moment().add(1, 'days');
    let twoDays = moment().add(2, 'days');
    let threeDays = moment().add(3, 'days');
    let fourDays = moment().add(4, 'days');
    let fiveDays = moment().add(5, 'days');
    // Using text to print it onto the correct days card, need to format it so that it matches the current date format
    $('#tomorrow').text(tomorrow.format(' D/M/YYYY'))
    $('#twoDays').text(twoDays.format(' D/M/YYYY'))
    $('#threeDays').text(threeDays.format(' D/M/YYYY'))
    $('#fourDays').text(fourDays.format(' D/M/YYYY'))
    $('#fiveDays').text(fiveDays.format(' D/M/YYYY'))
}

function displayForecast(cityName) {
    // Similar format when trying to find the city day weather
    var APIKey = "91c2192a6f0948bb2d116c3e5eb13b43";
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // // Create CODE HERE to Log the queryURL
        console.log(queryURL);
        // // Create CODE HERE to log the resulting object
        console.log(response);
        // Assign the response to a list of 40 variables, that can then be looped through to find the times of the day that I want
        var forecastList = response.list
        // console.log(forecastList)
        for (i = 1; i <= 5; i++) {
            // console.log(i) / to check that it shows 5 to reperesent the 5 forecast cards
            // console.log(forecastList[i*6].main.temp)
            // mulitply i by 6 to find the 12:00 weather
            var temp = forecastList[i * 6].main.temp - 273.15
            var wind = forecastList[i * 6].wind.speed
            var humidity = forecastList[i * 6].main.humidity
            var icon = forecastList[i * 6].weather[0].icon
            // number attached to end of div in HTML made it easier to loop through and show the text that I wanted to on the page
            var tempCalc = $('#tempforecast' + [i]).text('Temp: ' + temp.toFixed(2) + ' °C');
            var windEl = $('#windforecast' + [i]).text('Wind speed: ' + wind + 'KPH');
            var humidityEl = $('#humidityforecast' + [i]).text('Humidity: ' + humidity + ' %');
            var iconUrl = "http://openweathermap.org/img/wn/" + icon + ".png"
            var iconFormat = $('#iconforecast' + [i]).attr('src', iconUrl)

        }
    }
    )
}
