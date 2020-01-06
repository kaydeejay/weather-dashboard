$(document).ready(function(){
    
    var apiKey = "7fa09e46f60ddbd49aa136e8c0cd30a4";
    var searchForm = $(".city-search");
    var searchedCities = [];
    
    $(searchForm).submit(addCity);
    
    function addCity(){
        event.preventDefault();
    
        var cityList = $(".list-group");
        var newCity = $("#cityName").val();
        var newCityEl = $("<li>");
    
        if (searchedCities.indexOf(newCity) === -1){
            searchedCities.push(newCity);
            $(newCityEl).attr("class", "list-group-item");
            $(newCityEl).text(newCity);
            $(cityList).prepend(newCityEl);
            $("#cityName").val("");

            $(newCityEl).on("click", reloadCity);
            getCityData(newCity);
        } 
    }

    function reloadCity(){
        getCityData($(this).text());
    }

    function getCityData(city){
        var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

        $.ajax({
            url: weatherURL,
            method: "GET"
          }).then(function(response){
            var cityID = response.id;
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;
            var cityDate = dateParser(response.dt);
            var cityIconURL ="http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";

            $(".city-title").text(city + ' ' + cityDate);
            $(".city-icon").attr("src", cityIconURL);
            $("#cityTemp").text(Math.round((response.main.temp - 273.15)*1.8 + 32) + String.fromCharCode(176) + "F");
            $("#cityHumid").text(response.main.humidity + "%");
            $("#cityWind").text(response.wind.speed + "mph");

            getFiveDay(cityID);
            getUV(latitude, longitude);
          });
        
    }

    function getUV(lat, lon){
        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;
        
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function(response){
            $("#cityUV").text(response.value);
        });
    }

    function getFiveDay(cityID){
        var fiveDayURL = "http://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + apiKey;

        $.ajax({
            url: fiveDayURL,
            method: "GET"
        }).then(function(response){

            var fiveDayDates = [];
            var fiveDayIcons = [];
            var fiveDayTemps = [];
            var fiveDayHumid = [];
            var fiveDayBadges = $(".five-day").children();

            for (var i = 3; i <= 35; i += 8){
                fiveDayDates.push(dateParser(response.list[i].dt));
                fiveDayIcons.push(response.list[i].weather[0].main);
                fiveDayTemps.push(response.list[i].main.temp);
                fiveDayHumid.push(response.list[i].main.humidity);
            }
            for (var i = 0; i<fiveDayBadges.length; i++) {
                var currentBadge = $(fiveDayBadges[i]).children(0);
                var dateHeader = $("<h5>");
                var weatherIcon = $("<img>");
                var tempEl = $("<div>");
                var humidEl = $("<div>");
                var iconURL = "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png";

                $(currentBadge).empty();

                $(dateHeader).text(fiveDayDates[i]);
                $(weatherIcon).attr("src", iconURL);
                $(tempEl).text("Temp: " + Math.round((fiveDayTemps[i] - 273.15)*1.8+32) + String.fromCharCode(176) + "F");
                // Math.round((response.main.temp - 273.15)*1.8 + 32) + String.fromCharCode(176) + "F"
                $(humidEl).text("Humidity: " + fiveDayHumid[i] + "%");

                $(currentBadge).append(dateHeader);
                $(currentBadge).append(weatherIcon);
                $(currentBadge).append(tempEl);
                $(currentBadge).append(humidEl);
                
            }
        });
    }

    

    function dateParser(date){
        var a = new Date(date * 1000);
        var year = a.getFullYear();
        var month = a.getMonth() + 1;
        var date = a.getDate();
        var parsedDate = month + '/' + date + '/' + year;
        return parsedDate;
    }
});