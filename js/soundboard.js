// js/soundboard.js

(function() {
    function initSoundboard() {
        // Sound assets (currently placeholders)
        const cheerAudio = new Audio('https://actions.google.com/sounds/v1/crowds/battle_crowd_cheer_and_applause.ogg'); 
        const clapAudio = new Audio('https://actions.google.com/sounds/v1/crowds/small_crowd_applause.ogg');
        
        // Disable dialogue for now since it's pending
        // const dialogues = [...];
        // const dialogueAudio = new Audio();
        // let currentDialogueIndex = 0;

        document.getElementById('cheer-btn').addEventListener('click', function() {
            cheerAudio.currentTime = 0;
            cheerAudio.play().catch(e => console.log("Cheer audio error", e));
        });

        document.getElementById('clap-btn').addEventListener('click', function() {
            clapAudio.currentTime = 0;
            clapAudio.play().catch(e => console.log("Clap audio error", e));
        });

        // Dialogue button is disabled via HTML, but we keep a stub here
        document.getElementById('dialogue-btn').addEventListener('click', function() {
            console.log("Dialogue feature is currently pending/coming soon.");
        });

        document.getElementById('popper-btn').addEventListener('click', function() {
            const duration = 3 * 1000;
            const end = Date.now() + duration;

            (function frame() {
                // launch confetti from random spots everywhere!
                if (typeof confetti !== 'undefined') {
                    confetti({
                        particleCount: 20,
                        spread: 120,
                        origin: { x: Math.random(), y: Math.random() - 0.2 },
                        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
                        ticks: 300,
                        gravity: 0.8
                    });
                }

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        });
        
        // Share Button
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', function() {
                const url = window.location.href;
                if (navigator.share) {
                    navigator.share({
                        title: 'Ami Fossils Virtual Concert',
                        url: url
                    }).catch(console.error);
                } else {
                    navigator.clipboard.writeText(url).then(function() {
                        const originalText = shareBtn.innerHTML;
                        shareBtn.innerHTML = 'Link copied!';
                        setTimeout(function() { shareBtn.innerHTML = originalText; }, 2000);
                    });
                }
            });
        }
    }

    window.appSoundboard = {
        init: initSoundboard
    };
})();

