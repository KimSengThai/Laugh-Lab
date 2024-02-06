document.addEventListener("DOMContentLoaded", initialize);

function initialize() {

    // Front End Stuffs
    // Joke Types checking button
    let jokeTypes1 = document.querySelector(".jokeTypes1");
    let jokeTypes2 = document.querySelector(".jokeTypes2");
    let jokeTypesBoth = document.querySelector(".jokeTypesBoth");

    function updateBothJokes() {
        if (!jokeTypes1.checked && !jokeTypes2.checked) {
            jokeTypesBoth.checked = true;
        } else {
            jokeTypesBoth.checked = false;
        }
    }

    updateBothJokes();
    jokeTypes1.addEventListener("change", updateBothJokes);
    jokeTypes2.addEventListener("change", updateBothJokes);

    // Categories checking
    let anyCategories = document.querySelector(".anyCategories");
    let customCategories = document.querySelector(".customCategories");
    let customCategoriesPro = document.querySelector(".customCategoriesPro");
    let customCategoriesMisc = document.querySelector(".customCategoriesMisc");
    let customCategoriesDark = document.querySelector(".customCategoriesDark");
    let customCategoriesPun = document.querySelector(".customCategoriesPun");
    let customCategoriesSpooky = document.querySelector(".customCategoriesSpooky");

    function updateanyCategories() {
        if (anyCategories.checked) {
            customCategoriesPro.checked = true
            customCategoriesPro.disabled = true
            customCategoriesMisc.checked = true
            customCategoriesMisc.disabled = true
            customCategoriesDark.checked = true
            customCategoriesDark.disabled = true
            customCategoriesPun.checked = true
            customCategoriesPun.disabled = true
            customCategoriesSpooky.checked = true
            customCategoriesSpooky.disabled = true
        } else if (!anyCategories.checked) {
            customCategoriesPro.disabled = false
            customCategoriesMisc.disabled = false
            customCategoriesDark.disabled = false
            customCategoriesPun.disabled = false
            customCategoriesSpooky.disabled = false
        }
    }


    anyCategories.addEventListener("change", updateanyCategories);
    customCategories.addEventListener("change", updateanyCategories);

    updateanyCategories()
    // function for if user didnt select any categories

    function noCategoriesSelected() {

        let noSelected = !customCategoriesPro.checked && !customCategoriesMisc.checked && !customCategoriesDark.checked && !customCategoriesPun.checked && !customCategoriesSpooky.checked

        if (noSelected) {
            setup.textContent = "Yo";
            setup.classList.add("redText");
            delivery.textContent = "Pick a categories please!";
            delivery.classList.add("redText");
            jokeGeneratorButton.disabled = true;
        } else {
            setup.classList.remove("redText");
            delivery.classList.remove("redText");
            jokeGeneratorButton.disabled = false;
        }
    }

    anyCategories.addEventListener("change", noCategoriesSelected);
    customCategoriesPro.addEventListener("change", noCategoriesSelected);
    customCategoriesMisc.addEventListener("change", noCategoriesSelected);
    customCategoriesDark.addEventListener("change", noCategoriesSelected);
    customCategoriesPun.addEventListener("change", noCategoriesSelected);
    customCategoriesSpooky.addEventListener("change", noCategoriesSelected);
    

    // Fetching Stuffs
    // Getting a random joke using fetch
    const url = "https://v2.jokeapi.dev/joke/";
    let btn = document.querySelector(".btn");
    let setup = document.querySelector(".setup");
    let delivery = document.querySelector(".delivery");
    const arrayOfAllData = []

    async function getRandomJoke(type, blackListTag, categoryList, inputSearchNow) {
        try {
            const response = await fetch(url + `${categoryList}?type=${type}${blackListTag}${inputSearchNow}`);
            const data = await response.json();
            // Check for twopart and onepart joke then check for error false or true
            if (type === "twopart" && data.error === false) {
                    setup.textContent = data.setup;
                    delivery.textContent = data.delivery; 
                    arrayOfAllData.push(data)  
                    addToFavourite.disabled = false;
                } else if (type === "single" && data.error === false) {
                    setup.textContent = "";
                    delivery.textContent = data.joke;
                    arrayOfAllData.push(data)
                    addToFavourite.disabled = false;
                } else if (data.error === true) {
                    setup.textContent = "error code: " + data.code;
                    delivery.textContent = data.message;                 
                }
        } catch (error) {
            console.log("Sorry, there's been an issue loading the jokes for you!", error);
            delivery.textContent = "Sorry, there's been an issue loading the jokes for you!";
        }
    }


    // Function for when submit button is click and we call fetch to call upton API
    function jokeTypes() {
        let blackListTag = checkForRatedR();
        let categoryList = checkForCategories();
        let inputSearchNow = searchInput();

        if (jokeTypes1.checked && !jokeTypes2.checked) {
            getRandomJoke("single", blackListTag, categoryList, inputSearchNow);
        } else if (!jokeTypes1.checked && jokeTypes2.checked) {
            getRandomJoke("twopart", blackListTag, categoryList, inputSearchNow);
        } else if ((jokeTypes1.checked && jokeTypes2.checked) || jokeTypesBoth.checked) {
            let number = Math.floor(Math.random() * 2);;
            if (number === 0) {
                getRandomJoke("single", blackListTag, categoryList, inputSearchNow);
            } else if (number === 1) {
                getRandomJoke("twopart", blackListTag, categoryList, inputSearchNow);
            }
        }
    }

    // Submit button to call a function jokeTypes
    jokeGeneratorButton = document.getElementById("jokeGeneratorButton")

    jokeGeneratorButton.addEventListener("click", jokeTypes);


    // Check for Black list 
    let ratedROff = document.querySelector(".ratedROff");
    let ratedROn =document.querySelector(".ratedROn");

    function checkForRatedR() {
        if (ratedROff.checked) {
            return "&blacklistFlags=nsfw,racist,sexist,explicit"
        } else if (ratedROn.checked) {
            return ""         
        }
    }

    // Check for categories    
    function checkForCategories() {
        if (anyCategories.checked) {
            return "Any";
        } else if (customCategories.checked) {
            let selectedCategories = [];
    
            if (customCategoriesPro.checked) selectedCategories.push("Programming");
            if (customCategoriesMisc.checked) selectedCategories.push("Misc");
            if (customCategoriesDark.checked) selectedCategories.push("Dark");
            if (customCategoriesPun.checked) selectedCategories.push("Pun");
            if (customCategoriesSpooky.checked) selectedCategories.push("Spooky");
    
            return selectedCategories.join(",");
        }
    }

    // Check for keywords  
    function searchInput() {
        let inputValue = document.getElementById("searchMeNow").value;
        if (inputValue === undefined) {
            return ""
        } else {
            return "&contains=" + inputValue;
        }
    }

    // function to disable the add this joke to favourite


    // Add list to favourite
    let addToFavourite = document.querySelector("#addToFavourite")
    let containerForFavourite = document.querySelector("#containerForFavourite")


    addToFavourite.addEventListener("click", () => {
        let TwoPart = `<div class="card" style="width: 18rem;"><div class="cardBodyFlex card-body"><h5 class="card-title">Joke</h5><ul class="list-group list-group-flush"><li class="list-group-item">Joke ID: ${arrayOfAllData[arrayOfAllData.length-1].id}</li><li class="list-group-item">Joke Type: ${arrayOfAllData[arrayOfAllData.length-1].type}</li><li class="list-group-item">Category: ${arrayOfAllData[arrayOfAllData.length-1].category}</li><span></ul>
        <p class="card-text"><br/>${arrayOfAllData[arrayOfAllData.length-1].setup}<br/><br/>${arrayOfAllData[arrayOfAllData.length-1].delivery}</p><a class="btn btn-danger">Delete</a></div></div>`
        let OnePart = `<div class="card" style="width: 18rem;"><div class="cardBodyFlex card-body"><h5 class="card-title">Joke</h5><ul class="list-group list-group-flush"><li class="list-group-item">Joke ID: ${arrayOfAllData[arrayOfAllData.length-1].id}</li><li class="list-group-item">Joke Type: ${arrayOfAllData[arrayOfAllData.length-1].type}</li><li class="list-group-item">Category: ${arrayOfAllData[arrayOfAllData.length-1].category}</li><span></ul>
        <p class="card-text"><br/>${arrayOfAllData[arrayOfAllData.length-1].joke}</p><a class="btn btn-danger">Delete</a></div></div>`
        let cardBox

        if (arrayOfAllData[arrayOfAllData.length-1].type === "twopart") {
            cardBox = TwoPart;
        } else if (arrayOfAllData[arrayOfAllData.length-1].type === "single") {
            cardBox = OnePart; 
        }

        containerForFavourite.innerHTML += cardBox;

        // event listener to remove favourite
        let deleteButtons = document.querySelectorAll(".btn-danger");

        deleteButtons.forEach(eventButton => {
            eventButton.addEventListener('click', () => {
                eventButton.closest('.card').remove();
                updateCardTitles()
            });
        });

        updateCardTitles()

        addToFavourite.disabled = true;
    })

    function updateCardTitles() {
        let cardTitle = document.querySelectorAll(".card-title")
        let i = 1
        
        cardTitle.forEach(eventHeading => {
            eventHeading.textContent = "Joke Number " + i++
        })
    }

}
