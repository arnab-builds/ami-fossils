// js/app.js

window.addEventListener('DOMContentLoaded', function() {
    // Initialize architecture in sequence
    
    // 1. Initialize Player (relies on playlist.js loaded before app.js)
    if (window.appPlayer) {
        window.appPlayer.init();
    }
    
    // 2. Initialize Stage Effects
    if (window.appEffects) {
        window.appEffects.init();
    }
    
    // 3. Initialize Soundboard & Share
    if (window.appSoundboard) {
        window.appSoundboard.init();
    }
    
    // 4. Handle global unmute logic (if needed for initial autoplay)
    // Note: In local audio, we generally wait for user interaction before playing.
    // Since the play button toggles playback properly now, 
    // we don't need the complex global click unmute logic that the YT player needed.
    
    console.log("Ami Fossils Virtual Concert Initialized.");
});

