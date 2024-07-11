document.addEventListener('DOMContentLoaded', (event) => {
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCbrsT4bqBZJncyo1gPeUFtl6w3ffsQUUU",
        authDomain: "hitapp-c3cd6.firebaseapp.com",
        projectId: "hitapp-c3cd6",
        storageBucket: "hitapp-c3cd6.appspot.com",
        messagingSenderId: "260752362006",
        appId: "1:260752362006:web:ad5cf211fb8c5bbc468337",
        measurementId: "G-20CFZJZYGV"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Initialize Firebase Cloud Messaging
    const messaging = firebase.messaging();

    // Request notification permission
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            // Get the token
            messaging.getToken({ vapidKey: 'BMZNptIottPEMkd5NoqAGhmDmbTDhpIrGgUEydxoXAfwZZvTFgOfEsQs0Y7BvsmoB6GFEimKxSqAWDiGlzGGpP0' }).then((currentToken) => {
                if (currentToken) {
                    console.log('Token obtained: ', currentToken);
                    // Send the token to your server and update the UI if necessary
                } else {
                    console.log('No registration token available. Request permission to generate one.');
                }
            }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
            });
        } else {
            console.log('Unable to get permission to notify.');
        }
    });

    // Listen for messages when the web app is in the foreground
    messaging.onMessage((payload) => {
        console.log('Message received. ', payload);
        // Customize notification here
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: payload.notification.icon
        };

        new Notification(notificationTitle, notificationOptions);
    });

    // Your existing script.js code
    let images = ["./image/anh1.png", "./image/anh2.png", "./image/anh3.png", "./image/anh4.png", "./image/anh5.png", "./image/anh6.png", "./image/anh7.png", "./image/anh8.png"];
    let currentImageIndex = 0;
    let hitCount = 0;
    const maxHits = 5;

    const imageElement = document.getElementById('image');
    const stickElement = document.getElementById('stick');
    const hitSound = document.getElementById('hitSound');
    const endSound = document.getElementById('endSound');

    function playSound(audioElement) {
        const clone = audioElement.cloneNode(true);
        clone.play();
    }

    function sendNotification(title, body) {
        // Send a message to your backend server to trigger a push notification
        fetch('https://your-heroku-app.herokuapp.com/sendNotification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                body: body,
                token: 'USER_DEVICE_TOKEN'
            })
        });
    }

    function hit() {
        if (currentImageIndex >= images.length - 1) {
            return; // Stop further clicks after reaching the last image
        }

        hitCount++;
        stickElement.style.transform = 'translateX(-50%) rotate(-30deg)';
        playSound(hitSound);  // Play the hit sound

        // Check for level up
        if (hitCount % maxHits === 0) {
            const level = hitCount / maxHits;
            sendNotification(`Level ${level} reached!`, `You have reached level ${level}`);
        }

        setTimeout(() => {
            stickElement.style.transform = 'translateX(-50%) rotate(0deg)';
        }, 100);

        if (hitCount >= maxHits) {
            hitCount = 0;
            currentImageIndex++;

            if (currentImageIndex >= images.length - 1) {
                imageElement.src = images[currentImageIndex];
                playSound(endSound);  // Play the end sound
                setTimeout(() => {
                    alert('Hãy dừng lại');
                }, 100); // Slight delay to ensure the sound plays before the alert
            } else {
                imageElement.src = images[currentImageIndex];
            }
        }
    }

    stickElement.addEventListener('click', hit);
});
