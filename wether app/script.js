const apiKey = "754026ef6a580e65815a5f6f00dfd632";

const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBar = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const weatherCondition = document.querySelector(".condition");

let darkmode = localStorage.getItem('darkmode');
const modeSwitch = document.getElementById("mode-switch");
const backBtn = document.getElementById("backarrow");
const getlocation = document.getElementById("current-location");
const appBtn = document.querySelector(".appicon");
const container = document.querySelector(".card");
//let clickCount = 0;

appBtn.addEventListener("click", () => {
    container.style.display = "block";
    appBtn.style.display = "none";
})


async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        document.getElementById("current-location").style.display = "none";
        document.getElementById("backarrow").style.display = "block"
    }
    else {
        var data = await response.json();

        /*  console.log(data); */
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "/images/clouds.png";
            weatherCondition.textContent = `Cloudy Now`;
        }

        else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "/images/rain.png";
            weatherCondition.textContent = `Rainy Now`;
        }

        else if (data.weather[0].main == "Snow") {
            weatherIcon.src = "/images/snow.png";
            weatherCondition.textContent = `Snow Now`;
        }

        else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "/images/clear.png";
            weatherCondition.textContent = `Clear Sunny Now`;
        }

        else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "/images/mist.png";
            weatherCondition.textContent = `Mist Now`;
        }

        else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "/images/drizzle.png";
            weatherCondition.textContent = `Drizzle Now`
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
        document.getElementById("current-location").style.display = "none";
        document.getElementById("backarrow").style.display = "block"

    }

}

const enbaleDarkmode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkmode', 'active');
}

const disableDarkmode = () => {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkmode', null);
}

if (darkmode === 'active') enbaleDarkmode()

modeSwitch.addEventListener("click", () => {
    localStorage.getItem('darkmode')
    darkmode !== "active" ? enbaleDarkmode() : disableDarkmode()
})

backBtn.addEventListener("click", () => {
    location.reload();
})

function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
            );

            if (!response.ok) {
                alert("Unable to fetch your location weather!");
                return;
            }

            const data = await response.json();

            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

            const condition = data.weather[0].main;

            if (condition === "Clouds") {
                weatherIcon.src = "/images/clouds.png";
                weatherCondition.textContent = `Cloudy Now`;
            } else if (condition === "Rain") {
                weatherIcon.src = "/images/rain.png";
                weatherCondition.textContent = `Rainy Now`;
            } else if (condition === "Snow") {
                weatherIcon.src = "/images/snow.png";
                weatherCondition.textContent = `Snow Now`;
            } else if (condition === "Clear") {
                weatherIcon.src = "/images/clear.png";
                weatherCondition.textContent = `Clear Sunny Now`;
            } else if (condition === "Mist") {
                weatherIcon.src = "/images/mist.png";
                weatherCondition.textContent = `Mist Now`;
            } else if (condition === "Drizzle") {
                weatherIcon.src = "/images/drizzle.png";
                weatherCondition.textContent = `Drizzle Now`;
            }

            document.querySelector(".weather").style.display = "block";
            document.querySelector(".error").style.display = "none";
            document.getElementById("backarrow").style.display = "block";
            document.getElementById("current-location").style.display = "none";
        });
    } else {
        alert("Geolocation not supported by this browser.");
    }
}

getlocation.addEventListener("click", () => {
    getCurrentLocationWeather();
});

searchBtn.addEventListener("click", () => {
    bookmarkBtn.style.display = "block";
    checkWeather(searchBar.value);
});

// Favourites 

let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

const bookmarkBtn = document.getElementById("bookmark-btn");
const favouritesList = document.querySelector(".favourites-list");


function updateStarIcon(city) {
    if (favourites.includes(city)) {
        bookmarkBtn.textContent = "❤︎";
        bookmarkBtn.style.color = "gold"
    } else {
        bookmarkBtn.textContent = "♡";
        bookmarkBtn.style.color = "white";
    }
}


function addToFavourites(city) {
    if (!favourites.includes(city)) {
        favourites.push(city);
        localStorage.setItem("favourites", JSON.stringify(favourites));
        loadFavourites();
        updateStarIcon(city);
    }
}


function removeFavourite(city) {
    favourites = favourites.filter(item => item !== city);
    localStorage.setItem("favourites", JSON.stringify(favourites));
    loadFavourites();
    updateStarIcon(city);
}


function loadFavourites() {
    favouritesList.innerHTML = "";

    favourites.forEach(city => {
        const div = document.createElement("div");
        div.classList.add("fav-item");

        div.innerHTML = `
            <span class="fav-city">${city}</span>
            <button class="remove-fav">×</button>
        `;


        div.querySelector(".fav-city").addEventListener("click", () => {
            checkWeather(city);
        });


        div.querySelector(".remove-fav").addEventListener("click", () => {
            removeFavourite(city);
        });

        favouritesList.appendChild(div);
    });
}

loadFavourites();


bookmarkBtn.addEventListener("click", () => {
    const city = document.querySelector(".city").innerHTML;

    if (!city) return;

    if (favourites.includes(city)) {
        removeFavourite(city);
    } else {
        addToFavourites(city);
    }
});

updateStarIcon(data.name);
bookmarkBtn.style.display = "inline-block";


