var searchCity = []
// Moment JS to display the current date next to the search city 
var todayDate = moment().format(' (D/M/YYYY)');

// This runs all the below functions when the search button is pressed 
$('#search-button').on('click', function (e) {
    // this stops the button to refresh the page
    e.preventDefault()
    // assign the cityName from the users input and then push into empty array so that it can be rendered onto page using renderButton function
    var cityName = $('#search-input').val()
    searchCity.push(cityName)
    // Need to pass cityName into function as it shown below with the function
    cityAPI(cityName)
    // this clears duplicate buttons so that there is only one
    clearButtons()
    // This displays the date on top of the cards
    dates()
    // This displays and gets the info from API forecast for the next 5 days
    fiveDayForecast(cityName)
    // This saves the info of the city name and weather to the local storage
    saveCity()
    // This gets the city name and the relevant weather from the local storgae
    showSavedCity()
    renderButtons()
})

function renderButtons() {
    // Need to use showSavedCity function whcih is where we get te information from local storage, which we will then assign this to the new rendered button below
    showSavedCity()
    // loop to go through the empty array of searchCity so that a new button can be rendered
    for (var i = 0; i < searchCity.length; i++) {
        console.log(searchCity[i])
        var buttons = $('<button>')
        // Assigned its id and class so that I can use it for formatting
        buttons.attr({ 'id': "cityBtn", 'class': "col-sm-12" })
        // Buttons text is from the looping through of searchCity by the users input 
        buttons.text(searchCity[i])
        // Adds the buttons to the div on the pagex 
        $("#history").append(buttons);
        // tried to add the getItem storage into the function that loops through new button elements
        buttons.on('click', function (event) {
            // used event target to target the element that caused the button on click
            var cityName = $(event.target).text()
            cityAPI(cityName)
            dates()
            fiveDayForecast(cityName)
        })

    }

}
// clear buttons stop them to showing on page twice
function clearButtons() {
    $('#history').empty()
}
// Get the user input and put into cityName variable, available globally
var cityName = $('#search-input').val()

// When user put in town and clicks button, put the city into the link for API
function cityAPI(cityName) {
    var APIKey = "5b045dfac16392eda5cca0b2562f708e";
    // use cityName to help find the relevant API address for the city
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // Log the queryURL
        console.log(queryURL);
        // Log the resulting object
        console.log(response);
        // Assigned response.cod to variable so that I could check if incorrect town or now town input
        let cityCod = response.cod
        console.log(cityCod)
        if (cityCod === '404') {
            // alerts user to input correct city name if incorrect, this if/else also show in the .catch function
            return alert('Please input correct city name')
        }
        else {
            saveCity()
            // assigned the responses to variables 
            // convert to celcius by minussing the below number
            var tempCalc = response.main.temp - 273.15;
            var city = response.name;
            var wind = response.wind.speed;
            var humidity = response.main.humidity;
            var icon = response.weather[0].icon;
            // https://www.youtube.com/watch?v=8R3FtApLdms
            // same format as the API address to find the correct icon for the weather
            var iconUrl = "http://openweathermap.org/img/wn/" + icon + ".png"
            // Set the attribute of the iconUrl so that it shows the correct icon in the icon div
            var iconFormat = $('#icon').attr('src', iconUrl,);
            $('#city').text(city + todayDate);
            // toFixed to reduce it to 2 decimal point
            $('#temp').text('Temperature: ' + tempCalc.toFixed(2) + "°C");
            $('#wind').text('Wind: ' + wind + "KPH");
            $('#humidity').text('Humidity: ' + humidity + "%");
        }
    })
        // if then fails then catch with run
        .catch(function (error) {
            console.log(error)
            return alert('Please input correct city name')
        })
}
// Function to display the date on each of the 5 day weather forecast cards
function dates() {
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

function fiveDayForecast(cityName) {
    // Similar format when trying to find the city day weather
    var APIKey = "5b045dfac16392eda5cca0b2562f708e";
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


function saveCity() {
    localStorage.setItem("searchCity", JSON.stringify(searchCity)); //saves city input to local storage 
}

// Saving to local storage but not displaying the city button once refreshed
function showSavedCity() {
    searchCity = JSON.parse(localStorage.getItem('searchCity')) || [];
}
// This keeps the buttons on the page even when the browser is refreshed
renderButtons()