/* // add this code to a js file, example search.js

onmessage = function (e) {
    searchTerms = e.data;   // this will get search term 
    importScripts("movieObj.js");

}

function processFilms(data) {

    for (var row in data) {
        //use search s in here to see if it === title
        var text = data[row]["title"];
        //can do this for link as well

        //need to create json object for title & link 

        postMessage("test");

    }

} */


onmessage = function (e) {
    searchWord = e.data;
    importScripts("/lib/movieObj.js");
}

function processFilms(data) {
    for (var key in data) {
        if (data[key]["title"].includes(searchWord) == true) {
            var regex = new RegExp(searchWord);
            var text = data[key]["title"];
            newText = text.replace(regex, '<mark>$&</mark>');
            var dataJSON = {
                'title': newText, 'link': data[key]["link"]
            };
            postMessage(JSON.stringify(dataJSON));
            console.log(JSON.stringify(dataJSON));
        }
    }
}



// add this code to your search2.html file:
//worker_search = new Worker("search.js");

//this will send the search term:
//worker_search.postMessage("night");


//in search2.html this will get the search data in search.js and send it back to search2.html
//worker_search.onmessage = function (event) {
  //  console.log(event.data);} // event.data needs to be changed to unpack json object so we can get link and title