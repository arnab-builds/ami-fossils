// js/soundboard.js

(function() {
    function initSoundboard() {
        const cheerAudio = new Audio('./assets/sounds/cheering.mp3'); 
        const clapAudio = new Audio('./assets/sounds/clapping.mp3');
        
        // Microphone sounds
        const micSoundA = new Audio('./assets/sounds/ReelAudio-24134.mp3');
        const micSoundB = new Audio('./assets/sounds/ReelAudio-39914.mp3');
        let micSoundIndex = 0;

        document.getElementById('cheer-btn').addEventListener('click', function() {
            cheerAudio.currentTime = 0;
            cheerAudio.play().catch(e => console.log("Cheer audio error", e));
        });

        document.getElementById('clap-btn').addEventListener('click', function() {
            clapAudio.currentTime = 0;
            clapAudio.play().catch(e => console.log("Clap audio error", e));
        });

        // Dialogue button
        const dialogueBtn = document.getElementById('dialogue-btn');
        if(dialogueBtn) {
            dialogueBtn.removeAttribute('disabled');
            dialogueBtn.style.opacity = '1';
            dialogueBtn.style.cursor = 'pointer';
            dialogueBtn.addEventListener('click', function() {
                if (micSoundIndex === 0) {
                    micSoundA.currentTime = 0;
                    micSoundA.play().catch(e => console.log("Mic A error", e));
                    micSoundIndex = 1;
                } else {
                    micSoundB.currentTime = 0;
                    micSoundB.play().catch(e => console.log("Mic B error", e));
                    micSoundIndex = 0;
                }
                
                // Visual bounce
                this.style.transform = 'scale(1.2)';
                this.style.boxShadow = '0 0 20px #00d2d3';
                setTimeout(() => {
                    this.style.transform = '';
                    this.style.boxShadow = '';
                }, 200);
            });
        }

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
                // Play share sound
                cheerAudio.currentTime = 0;
                cheerAudio.play().catch(e => console.log("Share audio error", e));

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

