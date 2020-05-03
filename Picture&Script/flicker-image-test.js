
// array of search terms that will be used to create the buttons/list items

var searchTerms = [
    "Sylhet",
    "Sunset Beach Ireland",
    "Lighthouse Ireland",
    "testfornoresults"
];




// send JSON-P request to Flickr to search for 
// images containing the text provided

function getImages(text) {


    // Store the search term in localStorage

    localStorage.setItem('lastsearch', text)

    // Construct URL for API request

    baseurl = "https://www.flickr.com/services/rest?";

    request = "method=flickr.photos.search";

    request += "&per_page=10";

    request += "&api_key=84771751fd6c1dc451f668ae5361af6d"; //<---- PUT API KEY HERE



    // Add the search term to the request URL

    request += "&text=" + escape(text);


    // Set the callback function (padding) for the returned  JSON-P

    request += "&format=json&jsoncallback=showImages";

    request += "&tag_mode=all";

    full = baseurl + request;

    // Add the url to a script element and add it to the head 

    var src = document.createElement("script");
    src.setAttribute("src", full);
    document.querySelectorAll("head")[0].appendChild(src);

    // display some text that will be removed once the results come back

    document.getElementById("pics").innerHTML = "<div id = 'searching'>Searching Flickr ....</div>";
}


// The function that is called when the JSON-P results come back 

function showImages(images) {


    // Remove the previous images

    document.getElementById('pics').innerHTML = "";


    // Check if there was an error message in the result

    if (images.stat == 'fail') {
        document.getElementById('pics').innerHTML = "Error";
    }
    else {
        // Store how many photos were returned

        var targetnr = images.photos.photo.length;

        // If none came back alert the user to the fact

        if (targetnr == 0) {
            document.getElementById('pics').innerHTML = "No Results";
        }
        else {

            // Loop through the photes creatign the urls for the images
            // (I.e. large version and small version)

            for (i = 0; i < images.photos.photo.length; i++) {
                var url = "http://farm" + images.photos.photo[i].farm;

                url += ".static.flickr.com/";

                url += images.photos.photo[i].server + "/";

                url += images.photos.photo[i].id + "_";

                url += images.photos.photo[i].secret;

                 


                // Create 2 different image urls based on the base url

                var smallurl = url + "_s.jpg";
                var bigurl = url + ".jpg";

                // Create an image object for the smaller image

                var newImg = document.createElement("img");

                // Set its src to the small image url

                newImg.src = smallurl;


                // store the big image url in the dataset of the small image
                // so we can access it when we click on the small image

                newImg.dataset.big = bigurl;


                // Add an event handler to the small image that extracts the big 
                // image url from the dataset of the image you clicked on and changes  
                // the src of the image on screen to that URL (displaying the image)

                newImg.onclick = function () {

                    document.getElementById("bigimg").src = this.dataset.big;

                }


                // Add the small image ot the page

                document.getElementById('pics').appendChild(newImg);
            }

        }


    }

}





window.addEventListener("load", init);



// Set up the page

function init() {

    // loop through the search terms in the array

    for (var i = 0; i < searchTerms.length; i++) {
        // Create list items for each search term 

        var newB = document.createElement("li");

        // insert the text of the search term in each list item

        var newT = document.createTextNode(searchTerms[i]);
        newB.appendChild(newT);

        // Add the list item to a ul tag on the page

        document.querySelector("nav ul").appendChild(newB);

        // Add a event listener that arranges that if you click on a
        // list item it will extract its own innerHTML (i.e. the 
        // actual seach term) and pass it to a function that
        // will perform a search with that term

        newB.addEventListener("click", function () {

            getImages(this.innerHTML);

        });

    }

    // call the function that checks if there is a search term
    // in local storage. If there is, perform a search with it. 
    loadFromStorage();

}





// This function gets called when the page loads
// It retrieves a seach term from local storage
// And performs a search with that term if one is found.

function loadFromStorage() {

    var lastsearchterms = localStorage.getItem("lastsearch");

    if (lastsearchterms != null) getImages(lastsearchterms);

}

/* 
function deleteCache() {
    self.addEventListener('activate', function (event) {
        event.waitUntil(
            caches.keys().then(function (cacheNames) {
                return Promise.all(
                    cacheNames.filter(function (cacheName) {
                        // Return true if you want to remove this cache,
                        // but remember that caches are shared across
                        // the whole origin
                        cache.delete('/images/*.png')
                    }).map(function (cacheName) {
                        return caches.delete(cacheName);
                    })
                );
            })
        );
    });
   // Cache.delete();
}
 */