// js/effects.js

(function() {
    let audioAnalyser = null;
    let dataArray = null;
    let animFrame = null;
    
    // Smoothing arrays
    let smoothBass = 0;
    let smoothMid = 0;
    let smoothHigh = 0;

    function initEffects() {
        const lighterBtn = document.getElementById('lighter-btn');
        if (lighterBtn) {
            lighterBtn.addEventListener('click', function() {
                document.body.classList.toggle('lighter-mode');
                this.classList.toggle('active');
            });
        }

        const overdriveBtn = document.getElementById('overdrive-btn');
        if (overdriveBtn) {
            overdriveBtn.addEventListener('click', function() {
                document.body.classList.toggle('overdrive-active');
                this.classList.toggle('active');
            });
        }

        // Cleanly hook into play events so the lights wake up
        const audioEl = window.appPlayer.getAudioElement();
        if (audioEl) {
            audioEl.addEventListener('play', () => {
                if (!animFrame && audioAnalyser) {
                    renderLighting();
                }
            });
        }
    }

    function setAnalyser(analyser) {
        audioAnalyser = analyser;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        const audioEl = window.appPlayer.getAudioElement();
        if (audioEl && !audioEl.paused && !animFrame) {
            renderLighting();
        }
    }

    function renderLighting() {
        const audioEl = window.appPlayer.getAudioElement();
        
        if (!audioEl || audioEl.paused || audioEl.ended || !audioAnalyser) {
            // Settle lights smoothly when paused
            smoothBass += (0 - smoothBass) * 0.05;
            smoothMid += (0 - smoothMid) * 0.05;
            smoothHigh += (0 - smoothHigh) * 0.05;
            applyLightingValues(smoothBass, smoothMid, smoothHigh);
            
            // Stop loop if fully settled
            if (smoothBass < 0.01 && smoothMid < 0.01 && smoothHigh < 0.01) {
                animFrame = null;
                return;
            }
        } else {
            audioAnalyser.getByteFrequencyData(dataArray);

            // Analyze frequency bands
            let bassSum = 0, midSum = 0, highSum = 0;
            const len = dataArray.length;
            
            // typical 256 fft size -> 128 bins
            for (let i = 0; i < 10; i++) bassSum += dataArray[i]; // Lows
            for (let i = 10; i < 60; i++) midSum += dataArray[i]; // Mids
            for (let i = 60; i < len; i++) highSum += dataArray[i]; // Highs
            
            // Normalize
            const rawBass = (bassSum / 10) / 255;
            const rawMid = (midSum / 50) / 255;
            const rawHigh = (highSum / (len - 60)) / 255;

            // Smooth with attack/release behavior
            // Fast attack and much faster release for subwoofer punch
            smoothBass += (rawBass - smoothBass) * (rawBass > smoothBass ? 0.6 : 0.25);
            smoothMid += (rawMid - smoothMid) * (rawMid > smoothMid ? 0.3 : 0.05);
            smoothHigh += (rawHigh - smoothHigh) * (rawHigh > smoothHigh ? 0.4 : 0.08);

            applyLightingValues(smoothBass, smoothMid, smoothHigh);
        }
        
        animFrame = requestAnimationFrame(renderLighting);
    }

    function applyLightingValues(bass, mid, high) {
        const root = document.documentElement;
        const isOverdrive = document.body.classList.contains('overdrive-active');
        const multiplier = isOverdrive ? 1.5 : 1;

        const globalOpacity = 0.5 + (bass * 0.5 * multiplier);
        root.style.setProperty('--global-light-opacity', globalOpacity);

        // Audio-reactive Overdrive Bounce/Pulse
        // Use a power curve so it behaves like a subwoofer cone (sharp, fast snap on loud kicks)
        const punchyBass = Math.pow(bass, 3);
        
        let overdriveScale = 1;
        let overdriveScreenScale = 1;
        let overdriveY = 0;
        
        if (isOverdrive) {
            overdriveScale = 1 + (punchyBass * 0.12); // Sharp scale up to 1.12
            overdriveScreenScale = 1 + (punchyBass * 0.08); // Sharp full screen scale
            overdriveY = punchyBass * -40; // Massive fast 40px jump
        }
        root.style.setProperty('--overdrive-scale', overdriveScale);
        root.style.setProperty('--overdrive-screen-scale', overdriveScreenScale);
        root.style.setProperty('--overdrive-y', `${overdriveY}px`);

    }

    window.appEffects = {
        init: initEffects,
        setAnalyser: setAnalyser
    };
})();

