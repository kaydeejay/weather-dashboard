$(document).ready(function(){

    var searchForm = $(".city-search");
    var searchedCities = [];

    $(searchForm).submit(addCity);

    function getCityData(city){
        var weatherKey = "7fa09e46f60ddbd49aa136e8c0cd30a4";
        var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + weatherKey;

        console.log(weatherURL);

        $.ajax({
            url: weatherURL,
            method: "GET"
          }).then(function(response){
            console.log(JSON.stringify(response));
          });
        
    }
    
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
            getCityData(newCity);
        }
        
    }
});