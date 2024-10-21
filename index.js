import * as Carousel from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
// const url = "https://api.thecatapi.com/v1/breeds";
// const API_KEY =
//   "live_fmjjiIsCxnMq92eAof05df2TA9pTo6VVgv36vX1hIy14C0NYhKDhipxgdQOr7XDi";

//Setting default baseURl AND Header for my API key
axios.defaults.baseURL = "https://api.thecatapi.com/v1";
axios.defaults.headers.common["x-api-key"] =
  "live_fmjjiIsCxnMq92eAof05df2TA9pTo6VVgv36vX1hIy14C0NYhKDhipxgdQOr7XDi";

//  * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
//  */
/**WORKING ON AXION....
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */

//Function to updateProgress width
function updateProgress(event) {
  console.log(event);

  if (event.lengthcomputable) {
    const percentageComplete = math.floor(event.loaded / event.total) * 100;
    progressBar.style.width = `${percentageComplete}%`;
  }
}

//Adding my axios interceptors to log the time between request and response to the console.
axios.interceptors.request.use(
  (config) => {
    //set the width of the progressBar element to 0%.
    progressBar.style.width = "0%";

    ///Set the body cursor style to "progress"
    document.body.style.cursor = "progress";
    config.startTime = Date.now();
    console.log(
      `Request started at: ${new Date(config.startTime).toISOString()}`
    );
    return config;
  },
  (err) => {
    return promise.reject(err);
  }
);

// Add Interceptors Response time
axios.interceptors.response.use((response) => {
  const duration = Date.now() - response.config.startTime;
  console.log(`Response was recieved at: ${duration} ms`);

  //Reset the progress to 100% when the response is received
  progressBar.style.width = "100%";
  setTimeout(() => {
    progressBar.style.width = "0%"; //hide the progressbar after short delay
  }, 500);

  // Remove the cursor style (reset to default)
  document.body.style.cursor = "auto";
  return response;
});

//Test request with progress tracking
axios
  .get("/breeds", {
    onDownloadProgress: updateProgress, // call the updateProgess function
  })
  .then((response) => {
    console.log(`Data Received:`, response.data);
  })

  .catch((err) => {
    console.log("Error: ", err);
    return promise.reject(err);
  });

// REPLACING MY FETCH() WITH AXIOS.GET()
async function initialLoad() {
  try {
    //Retrieve a list of breeds from the Cat API
    const breedsResponse = await axios.get("/breeds");

    //No need of parsing my Json data because axios does it!
    const breedsData = breedsResponse.data;
    // Loop through each breed and creat an <option> element
    breedsData.forEach((breed) => {
      const newBreedOptions = document.createElement("option");
      newBreedOptions.value = breed.id;
      newBreedOptions.textContent = breed.name;
      breedSelect.appendChild(newBreedOptions);
    });
    // Execute fetchImages function to create the initial carousel
    if (breedsData.length > 0) {
      retrieveBreedInfo(breedsData[0].id);
    }
  } catch (err) {
    console.error("An Error occurence fetching the breed:", err);
  }
}
//Excute the function immediately
initialLoad();

//Changing my fetch() method to Axion
breedSelect.addEventListener("change", (event) => {
  const selectedBreedId = event.target.value;
  retrieveBreedInfo(selectedBreedId);
});

//create function to retreve breed info and sisplay the carousel from img data:
async function retrieveBreedInfo(breedId) {
  try {
    // const SelectedBreed = breedSelect.value;
    const carousel = document.getElementById("carouselExampleControls");

    //Clear previous carousel and infoDump
    carousel.innerHTML = "";
    infoDump.innerHTML = "";

    // Construct the API request URL
    // const apiUrl =
    // const fetchBreed = await fetch('https://api.thecatapi.com/v1/breeds' + selectedBreed;);
    // const responseArray = document.createElement('responseArray');
    //Retrieve images for the selected breed
    const imgResponse = await axios.get(
      `https://api.thecatapi.com/v1/images/search?limit=5&breed_id=${breedId}`
    );
    const imgData = await imgResponse.data;

    //create new elements for the carousela and append them to the Carousel
    imgData.forEach((data) => {
      const carouselElement = document.createElement("img");
      carouselElement.src = data.url;
      carouselElement.alt = "CAT iMAGE";

      // Set the size of my cat images to display in small
      carouselElement.style.width = "300px";
      carouselElement.style.height = "auto";

      carousel.appendChild(carouselElement);
    });

    //Display breed info in infoDump
    const breedInfo = imgData[0]?.breeds;
    if (breedInfo) {
      const infoText = document.createElement("p");
      infoText.innerHTML = `<strong>${breedInfo.name}</strong>: ${breedInfo.description}`;
      infoDump.appendChild(infoText);
    }
  } catch (err) {
    console.error("An Error occurence fetching the images:", err);
  }
}

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  // your code here
  try {
    //check if the image is favorited
    const response = await axios.get("/favourites");

    //find if the image is in the favorites list
    const alFavorited = response.data.some(
      (favourite) => favourite.image_id === imgId
    );

    if (alFavorited) {
      //if its already favourated, remove it!
      const favoriteId = response.data.find(
        (favourite) => favourite.image_id === imgId
      ).id;
      await axios.delete(`/favourites/${favoriteId}`);
      console.log(`Removed image ${imgId} from favourites`);
    } else {
      await axios.post("/favourites", {
        image_id: imgId,
      });
      console.log(`Added omage ${imgId} to favorites.`);
    }
  } catch (err) {
    console.error("Error make the image favorite:", error);
  }
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

async function getFavourites() {
  try {
    const response = await axios.get("/favourites");
    const favourites = response.data;

    //Assuming each fav contains an img_iid, fetch the img Url

    const imgPromises = favourites.map((favorite) => {
      return axios.get(
        `https://api.thecatapi.com/v1/images/search?breed_id=${favorite.image_id}`
      );
    });

    const imgResponses = await Promise.all(imgPromises);
    const imgs = imgResponses.map((response) => reponse.data[0]); //Extract the img data

    // Build and display the carousel with favorite images
    retrieveBreedInfo(breedId);
  } catch (err) {
    console.error("Error fetching fav. images:", err);
  }
}

// Bind the getFavourites function to the button click event

getFavouritesBtn.addEventListener("click", getFavourites);
/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
