// js/effects.js

(function() {
    function initEffects() {
        const encoreAudio = new Audio('https://actions.google.com/sounds/v1/crowds/battle_crowd_cheer_and_applause.ogg'); // Placeholder

        document.getElementById('lighter-btn').addEventListener('click', function() {
            document.body.classList.toggle('lighter-mode');
            this.classList.toggle('active');
        });

        document.getElementById('overdrive-btn').addEventListener('click', function() {
            document.body.classList.toggle('overdrive-active');
            this.classList.toggle('active');
        });

        document.getElementById('encore-btn').addEventListener('click', function() {
            const audioEl = window.appPlayer.getAudioElement();
            
            if (audioEl && !audioEl.paused) {
                audioEl.pause();
            }
            
            document.body.classList.add('encore-active');
            encoreAudio.currentTime = 0;
            encoreAudio.play().catch(e => console.log("Encore audio error", e));
            
            // Wait 5 seconds for dramatic effect, then restart song
            setTimeout(function() {
                document.body.classList.remove('encore-active');
                if (audioEl) {
                    audioEl.currentTime = 0;
                    audioEl.play().catch(e => console.log("Resume audio error", e));
                }
                
                // Trigger massive confetti
                const popperBtn = document.getElementById('popper-btn');
                if (popperBtn) popperBtn.click();
            }, 5000);
        });

        // Hook EQ visualizer into audio play state
        const audioEl = window.appPlayer.getAudioElement();
        if (audioEl) {
            audioEl.addEventListener('play', () => {
                document.getElementById('eq-visualizer').classList.add('is-playing');
            });
            audioEl.addEventListener('pause', () => {
                document.getElementById('eq-visualizer').classList.remove('is-playing');
            });
            audioEl.addEventListener('ended', () => {
                document.getElementById('eq-visualizer').classList.remove('is-playing');
            });
        }
    }

    window.appEffects = {
        init: initEffects
    };
})();

