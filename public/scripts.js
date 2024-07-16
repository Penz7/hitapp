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
    let hitCount = 0;
    const maxHits = 50;

    const imageInput = document.getElementById('imageInput');
    const stickElement = document.getElementById('stick');
    const hitSound = document.getElementById('hitSound');
    const endSound = document.getElementById('endSound');
    const imageElement = document.getElementById('image');
    const deleteButton = document.getElementById('deleteButton');

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

    function showImage(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageElement.src = e.target.result;
            imageElement.style.display = 'block';
            deleteButton.style.display = 'block'; // Show the delete button
            imageInput.style.display = 'none'; // Hide the input
        }
        reader.readAsDataURL(file);
    }

    function deleteImage() {
        imageElement.src = '';
        imageElement.style.display = 'none';
        deleteButton.style.display = 'none'; // Hide the delete button
        imageInput.style.display = 'block'; // Show the input
        imageInput.value = null; // Clear the selected file from input
    }
    

    function hit() {
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

            playSound(endSound);  // Play the end sound
            setTimeout(() => {
                alert('Hãy dừng lại');
            }, 100); // Slight delay to ensure the sound plays before the alert
        }
    }

    imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            showImage(file);
        }
    });

    stickElement.addEventListener('click', hit);
    deleteButton.addEventListener('click', deleteImage);
});