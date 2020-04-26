
/* ------------------------ Flickr Image object ------------------- */



// This is a Constructor function for objects representing 
// the images from Flickr we want to display.
// It stores the URLs for the large and small images.

// It also has a method (getImageObject) that will 
// return a Promise that resolves to an 
// image DOM element that we can add to the page
// (it will only resolve once the image has fully downloaded.
// So we will only be able to use the image once it has 
// downloaded and not before) .

function FlickrImage(smallfilename, bigfilename) {
    this.filename = smallfilename;
    this.bigfilename = bigfilename;
}




// We add a function to the object (via its prototype) 
// for each FlickrImage object

// It should return a promise that resolves to 
// a DOM element (i.e. an image element)
// representing the smaller version of the image. 
// The promise is returned straightaway but it 
//  only resolves when it has fully downloaded the image


FlickrImage.prototype.getImageObject = function () {



    // Return the promise

    return new Promise((resolve, reject) => {


        // Create an image object

        var imageObject = new Image();


        // Start to download the image.
        // Once it has downloaded (or failed)  
        // it will trigger the onload 
        // or onerror event handlers

        imageObject.src = this.filename;


        // add an onload event handler to detect when the file has downloaded

        // We specifically use the arrow function 
        // notation so that this inner function does 
        // not have its own 'this' variable (that  
        // would have been bound to the window object)
        // I.e. now the 'this' variable  will be bound to the receiver of the 
        // method call (i.e. it is bound to 'this' 
        // in the getImageObject function (which in turn is 
        // bound to the receiving FlickrImage object)

        imageObject.onload = () => {


            // This image must be clickable
            // I.e. clicking on it (the small image) must display
            // the large image whose filename is stored in this object

            // Again, since we are using an arrow function 'this' is not rebound 
            // (since it is an arrow function)
            // Therefore 'this' is a reference to receiver of the message/method call.
            // (i.e. since 'this' is a reference to the 'this' variable of the lexical parent)


            // Therefore this.bigfilename refers to the filename of whichever
            // FlickrImage object the method was invoked on


            // Note: We could also have bound the onclick event handler at the same time as we 
            // created the object and not in this inner function, since 'this' refers to the 
            // same object in either case

            // The showLargeImage function will display the URL we pass to it
            // as a CSS background			

            imageObject.onclick = () => { showLargeImage(this.bigfilename) };
             

            // Now the image has downloaded we can resolve the promise	

            resolve(imageObject);

        } // end of onload function



        // Arrange to reject the Promise if we can't load the image.

        imageObject.onerror = () => {


            // We make sure we keep the user informed of the status
            // of our page

            imageObject.innerHTML = "Can't Load";

            // We reject the Promise
            reject();

        } // end of onerror function



    }); // end of Promise parameter list



}	// end of  getImageObject prototype function



/* ----------------- DATA -------------------------*/

// array of search terms that will be used to create the buttons/list items

// Note the last search term was tested to ensure 
// there were no search results for it.
// This allows us to test how our application 
// responds to that situation. 	 

var searchTerms = [
    "Cork Institute of Technology",
    "Sunset Beach Ireland",
    "Lighthouse Ireland",
    "testfornoresults"
];


/* -------------------Search Flickr ---------------------*/

// Function to search Flickr with the search term provided 
// (as an argument)

// We send JSON-P request to Flickr to search for 
// images containing the text provided

function getImages(searchTermText) {


    // Store the search term in localStorage.
    // This is so we can retrieve it the next time we load the page
    // and perform the same search again.

    // If we perform another search we will replace this 
    // search term with the new one
    // Therefore it always stores the most recent search term

    localStorage.setItem('lastsearch', searchTermText)

    // Construct the URL for API request

    baseurl = "https://www.flickr.com/services/rest?";

    request = "method=flickr.photos.search";

    request += "&per_page=10";


    request += "&api_key=84771751fd6c1dc451f668ae5361af6d"; //<---- PUT API KEY HERE


    // Add the search term to the request URL

    request += "&text=" + escape(searchTermText);


    // Set the callback function (via padding) for the returned  JSON-P
    // I.e. we want the returning JavaScript to call the showImages() function

    request += "&format=json&jsoncallback=showImages";

    request += "&tag_mode=all";

    full = baseurl + request;

    // Add the url to a script element and add it to the head 
    // When the data is returned by Flickr it will call
    // the showImages() function

    var src = document.createElement("script");
    src.setAttribute("src", full);
    document.querySelectorAll("head")[0].appendChild(src);

    // display some text that will be removed once the results come back

    document.getElementById("pics").innerHTML = "<div id = 'searching'>Searching Flickr ....</div>";


    // Disable the buttons until the data has returned.

    disableButtons()
}

/* -------------------Handle FlickrSearch Results ------------------*/

// Function that is given a JSON object containing 
// the data we need to create the image URLs.
// This function is automatically called by the JavaScript
// that returns from Flickr

function showImages(images) {

    // Create a new blank array to store FlickrImage Objects 
    // representing each image in the results. 
    var flickrImageArray = [];

    // Remove the HTML content of the "pics" div.
    // I.e. delete the "Searching Flickr ...." text
    document.getElementById('pics').innerHTML = "";


    // Check if there was an error message in the results

    if (images.stat == 'fail') {
        document.getElementById('pics').innerHTML = "Error";

        // enable the buttons so the user can start another search
        enableButtons()
    }
    else   // otherwise we can process the results 
    {
        // Store how many photos were returned

        var targetnr = images.photos.photo.length;

        // If none came back alert the user to the fact

        if (targetnr == 0) {
            document.getElementById('pics').innerHTML = "No Results";

            // enable the buttons so the user can start another search
            enableButtons()
        }
        else // Otherwise we know there are 1 or more images in the data
        {

            // Loop through the photes creating the urls for the images
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


                // Use these two image names  to create an 
                // instance of a flickrImage object 
                // and add this object to the flickrImage array. 
                flickrImageArray.push(new FlickrImage(smallurl, bigurl));

            } // end of loop

            // Once the flickerImageArray function is filled we
            // can pass it to the createImages function inorder
            // to put them on the page 		    
            createImages(flickrImageArray);

        } // end of targetnr = 0 else statement


    } // end of images.stat=='fail' else statement

} // end of showImages function


/* ------------------------ Place Images on the Page ------------ */



// We pass an array of FlickrImage objects to this
// function so it can display them on the page
function createImages(flickr_array) {

    // Create an array to store promises
    var promiseArray = [];

    // Loop through the array of FLickrImage objects

    for (var i = 0; i < flickr_array.length; i++) {

        // For each image create an element to place the small image in. 
        let divObj = document.createElement("div");
        divObj.className = "imagecontainer";

        // Create a loader image

        var loader = document.createElement("img");
        loader.src = 'images/loader.png';
        loader.className = "loader";

        // Put the loader image in the divObj object we created above
        // (until the image is downloaded)

        divObj.appendChild(loader);


        // get a Promise from the current instance 
        // of our Custom FlicklrImage object
        // that will resolve with an image DOM object for the image 
        // we want to display. 
        // Calling the function starts downloading the image




        var tempPromise = flickr_array[i].getImageObject();


        // When the promise resolves we must add the image to the 
        // element we previously added the loader gif to.
        // (removing the existing content first) 

        // Note that we used let above to declare the variable 
        // containing the DOM element (divObj)
        // This binds it to this block (i.e. this iteration of the loop)
        // So the handler function below is bound to each individual 
        // divObj and not the element in the divOBj variable
        //  at the time of their execution (which it would be otherwise)

        tempPromise.then(function (resolvedImage) {
            divObj.innerHTML = "";
            divObj.appendChild(resolvedImage)
        })

        // Push the Promise onto a array of all the promises (i.e. for each image)
        promiseArray.push(tempPromise);

        // Add the new div to the page
        document.getElementById('pics').appendChild(divObj);


    } // end of loop


    // Now that the loop has finished and filled the array of Promises
    // we can specify some code to execute once all the Promises resolve. 
    // I.e. enable  the buttons when they are all added to the screen

    Promise.all(promiseArray).then(enableButtons);


    // Note: This suffices for this lab. In reality there is an issue with 
    // an image not being found. I.e. the corresponding Promise will not 
    // resolve, therefore all() cannot be invoked and the buttons 
    // will remain disabled

    // However, We will leave this solution here in order to see how all() works 
    // (and because Flickr is reliable enough for our purposes )

    // Possible solutions include using a timeout to enable the buttons after
    // a certain time has elapsed

}


/* ----------------- Enable and Display search buttons ----------- */

// This simply changes the class of the element containing the 
// search 'buttons'. We can then enable the buttons with 
// pointer-events properties. 

function enableButtons() {
    document.getElementById("searches").className = "on";
}

// This simply changes the class of the element containing the 
// search 'buttons'. We can then disable the buttons with 
// pointer-events properties. 

function disableButtons() {
    document.getElementById("searches").className = "off";
}


/* ----------------------Showing large version of image ---------- */

// Change the background of the body element to the image filename
// you pass to the function. Wait for the image to download before
// changing the background. 

function showLargeImage(imgName) {
    // show the element indicating we are loading an image. 

    document.getElementById("loading").style.display = "block";

    // Create a new image object
    var largeImage = new Image();


    // start dowloading the image whose URL/name we received	
    largeImage.src = imgName;

    // Arrange to change the background of the body tag
    // when the image has downloaded

    largeImage.onload = function () {


        // hide the element indicating we are loading an image. 

        document.getElementById("loading").style.display = "none";

        // change the background image

        document.body.style.backgroundImage = "url(" + largeImage.src + ")";
    }

}

/* ----------------------- Setup the page ------------------ */

// Set up the page

window.addEventListener("load", init);



function init() {

    // Loop through all the search terms in the searchTerms array
    // for each one create a clickable list item.
    // Add them to the page.


    // We use _let_ here to create a closure
    // I.e. the variable i is bound to each iteration of the loop
    // So each eventhandler sees a different i variable
    // (each of which has the value of i that existed when it was created)

    // using _var_ would have meant each eventhandler saw the same value for i
    // whenever they were invoked (i.e. they would all see the same value and search
    // for the same terms)

    for (let i = 0; i < searchTerms.length; i++) {

        // We will add list items for each search term
        // and make them clickable by adding event handlers

        // Create the list item
        var newB = document.createElement("li");

        // Create a text node with the current search term and 
        // add it to the list item
        var newT = document.createTextNode(searchTerms[i]);
        newB.appendChild(newT);

        // Add the list item to the page
        document.querySelector("nav ul").appendChild(newB);


        // Add an event handler for each list item that 
        // that starts a search for the corresponding search term

        newB.addEventListener("click", function () {

            // start the search
            // Note that the version of i here is from
            // the closure we create with _let_ in 
            // the loop

            getImages(searchTerms[i]);

            // an alternative to using a closure could be to have
            // each searchTerm use its own innerHTML (i.e. its own search term)
            // to start a search.
            //
            //     				getImages(this.innerHTML);
            //
            // Or we could have stored the term in the 
            // list item element itself with datasets, etc, etc. 

        });

    }

    // We start the page we want to check if we stored a previous
    // search term in local storage 
    // (if we did we want to automatically start that search)
    loadFromStorage();


}



// Check if any search terms are in local storage. 
// Perform a search on them if there are. 

function loadFromStorage() {

    var lastsearchterms = localStorage.getItem("lastsearch");

    // check if there were any terms before searching

    if (lastsearchterms != null) getImages(lastsearchterms);


}

function deleteCache(){
    self.addEventListener('activate', function (event) {
        event.waitUntil(
            caches.keys().then(function (cacheNames) {
                return Promise.all(
                    cacheNames.filter(function (cacheName) {
                        // Return true if you want to remove this cache,
                        // but remember that caches are shared across
                        // the whole origin
                    }).map(function (cacheName) {
                        return caches.delete(cacheName);
                    })
                );
            })
        );
    });
}


