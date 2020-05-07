if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
    .then((reg) => console.log('Service worker registered', reg))
    .catch((err)=> console.log('Servie workre not registered', err))
}


/* (function () {
    class App {
        constructor() {
            this.registerServiceWorker();
            this._app = document.querySelector('.app');

            this.fetchOfflineContent = this.fetchOfflineContent.bind(this);
            this.fetchAppContent = this.fetchAppContent.bind(this);
            self.addEventListener('online', this.fetchAppContent);
            self.addEventListener('offline', this.fetchOfflineContent);

            this.checkNetworkState();
        }

        checkNetworkState() {
            this._offlineEvent = new Event('offline');
            if (!navigator.onLine) {
                self.dispatchEvent(this._offlineEvent);
            }
        }

        fetchOfflineContent() {
            if (!navigator.onLine) {
                const offlineUrl = self.location.origin + '/public/offline.html';
                caches.match(offlineUrl)
                    .then(response => {
                        return response.text();
                    })
                    .then(offlineHtml => {
                        while (this._app.firstChild) {
                            this._app.removeChild(this._app.firstChild);
                        }
                        this._app.insertAdjacentHTML('afterbegin', offlineHtml);
                    })
                    .catch(error => {
                        console.log(`Could not fetch offline content due to - ${error}`);
                    });
            }
        }

        fetchAppContent() {
            while (this._app.firstChild) {
                this._app.removeChild(this._app.firstChild);
            }
            this._app.textContent = 'Main Application';
        }
        /*Register service worker*/

        /* registerServiceWorker() {
            const serviceWorker = navigator.serviceWorker;
            if (!serviceWorker) {
                return;
            }

            serviceWorker.register('./sw.js')
                .then((registration) => {
                    console.log('Service worker registered successfully!');
                }).catch((error) => {
                    console.log('Some error occurred while registering Service Worker');
                });
        } */

        /*Install app*/
/*
    }
    /*
    let deferredPrompt;
    const addBtn = document.querySelector('.add-button');
    //addBtn.style.display = 'none';

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        //addBtn.style.display = 'block';

        window.addEventListener('click', (e) => {
            // hide our user interface that shows our A2HS button
            //addBtn.style.display = 'none';
            // Show the prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
            });
        });
    });*/

    /* const addBtn = document.querySelector('.add-button');
    //addBtn.style.display = 'none';
     function deleteCache() {
         addBtn.addEventListener('activate', function (event) {
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
    }
   // Cache.delete(); */

/*
    new App();
})(); */