// js/player.js

(function() {
    let audio = null;
    let playlist = [];
    let currentIndex = 0;
    let isRepeat = false;
    
    let audioCtx = null;
    let analyser = null;
    let sourceNode = null;

    // UI Elements
    let playIcon, pauseIcon, vinyl, trackTitle, trackArtist, trackAlbum, artImg, progressFill, timeCurrent, timeDuration, repeatBtn;
    
    let filters = [];
    const eqFrequencies = [60, 150, 400, 1000, 2400, 6000, 12000];

    function initWebAudio() {
        if (audioCtx) {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            return;
        }
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            
            sourceNode = audioCtx.createMediaElementSource(audio);
            
            // Create EQ filters
            let lastNode = sourceNode;
            
            eqFrequencies.forEach((freq, i) => {
                let filter = audioCtx.createBiquadFilter();
                // 60, 150 are lows (lowshelf), 12000 is highs (highshelf), others peaking
                if (i === 0) filter.type = 'lowshelf';
                else if (i === eqFrequencies.length - 1) filter.type = 'highshelf';
                else filter.type = 'peaking';
                
                filter.frequency.value = freq;
                filter.gain.value = 0;
                
                lastNode.connect(filter);
                lastNode = filter;
                filters.push(filter);
            });
            
            lastNode.connect(analyser);
            analyser.connect(audioCtx.destination);
            
            // Wire up EQ UI
            setupEQControls();

            if (window.appEffects && window.appEffects.setAnalyser) {
                window.appEffects.setAnalyser(analyser);
            }
        } catch (e) {
            console.error("Web Audio API could not be initialized", e);
        }
    }

    function setupEQControls() {
        const sliders = document.querySelectorAll('.eq-slider');
        sliders.forEach((slider, i) => {
            slider.addEventListener('input', function() {
                let val = parseFloat(this.value);
                if (filters[i]) {
                    filters[i].gain.value = val;
                }
                const valLabel = this.parentElement.querySelector('.eq-value');
                if (valLabel) {
                    valLabel.textContent = (val > 0 ? '+' + val : val) + ' dB';
                }
                document.getElementById('eq-preset-select').value = 'custom';
            });
        });

        const presetSelect = document.getElementById('eq-preset-select');
        if (presetSelect) {
            presetSelect.addEventListener('change', function() {
                const val = this.value;
                let targetGains = [0, 0, 0, 0, 0, 0, 0];
                if (val === 'rock') targetGains = [6, 4, 0, -2, 2, 4, 6];
                if (val === 'bass') targetGains = [8, 6, 2, 0, 0, 0, 0];
                if (val === 'vocal') targetGains = [-2, -1, 2, 6, 4, 2, 0];
                if (val === 'flat') targetGains = [0, 0, 0, 0, 0, 0, 0];
                
                if (val !== 'custom') {
                    sliders.forEach((slider, i) => {
                        slider.value = targetGains[i];
                        if (filters[i]) filters[i].gain.value = targetGains[i];
                        const valLabel = slider.parentElement.querySelector('.eq-value');
                        if (valLabel) {
                            valLabel.textContent = (targetGains[i] > 0 ? '+' + targetGains[i] : targetGains[i]) + ' dB';
                        }
                    });
                }
            });
        }
        

    }

    function togglePlay() {
        if (!audio.src) return;
        
        initWebAudio(); // Ensure context is running on user interaction

        if (audio.paused) {
            audio.play().catch(err => console.error("Playback error:", err));
        } else {
            audio.pause();
        }
    }

    function initPlayer() {
        playlist = window.appPlaylist || [];
        audio = document.getElementById('audio-player');
        
        if (!audio) {
            console.error("Audio element not found.");
            return;
        }

        // Cache UI elements
        playIcon = document.getElementById('play-icon');
        pauseIcon = document.getElementById('pause-icon');
        vinyl = document.getElementById('vinyl');
        trackTitle = document.getElementById('track-title');
        trackArtist = document.getElementById('track-artist');
        trackAlbum = document.getElementById('track-album');
        artImg = document.getElementById('art-img');
        progressFill = document.getElementById('progress-fill');
        timeCurrent = document.getElementById('time-current');
        timeDuration = document.getElementById('time-duration');
        repeatBtn = document.getElementById('repeat-btn');

        // Audio Event Listeners
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('play', onPlayStateChange);
        audio.addEventListener('pause', onPlayStateChange);
        audio.addEventListener('error', onError);

        const eqToggleBtn = document.getElementById('eq-toggle-btn');
        const eqPanel = document.getElementById('eq-panel');
        if (eqToggleBtn && eqPanel) {
            eqToggleBtn.addEventListener('click', () => {
                eqPanel.classList.toggle('show');
                eqToggleBtn.classList.toggle('active');
            });
        }

        // Add event listeners
        if (playIcon && pauseIcon) {
            playIcon.parentElement.addEventListener('click', togglePlay);
        }
        
        const progTrack = document.getElementById('progress-track');
        if(progTrack) progTrack.addEventListener('click', seekTo);
        
        const shufBtn = document.getElementById('shuffle-btn');
        if(shufBtn) shufBtn.addEventListener('click', shuffleTrack);
        
        const prevBtn = document.getElementById('prev-btn');
        if(prevBtn) prevBtn.addEventListener('click', playPreviousTrack);
        
        const nextBtn = document.getElementById('next-btn');
        if(nextBtn) nextBtn.addEventListener('click', playNextTrack);
        
        if(repeatBtn) repeatBtn.addEventListener('click', toggleRepeat);

        const likeBtn = document.getElementById('like-btn');
        if(likeBtn) likeBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            const svg = this.querySelector('svg');
            if(this.classList.contains('active')) {
                svg.setAttribute('fill', '#00d2d3');
            } else {
                svg.setAttribute('fill', 'none');
            }
        });

        // Initial setup
        loadTrack(currentIndex, false);
    }

    function updateTrackUI(track) {
        if (trackTitle) trackTitle.textContent = track.title || "Unknown Title";
        if (trackArtist) trackArtist.textContent = track.artist || "Unknown Artist";
        if (trackAlbum) trackAlbum.textContent = track.album || "Unknown Album";
        
        if (artImg) {
            if (track.cover) {
                artImg.src = track.cover;
                artImg.onload = function() { artImg.style.display = 'block'; };
                artImg.onerror = function() { 
                    artImg.src = "./assets/images/music_palyer.jpeg"; 
                };
            } else {
                artImg.src = "./assets/images/music_palyer.jpeg";
                artImg.onload = function() { artImg.style.display = 'block'; };
                artImg.onerror = function() { artImg.style.display = 'none'; };
            }
        }
    }

    function loadTrack(index, autoPlay = false) {
        if (!playlist.length) return;
        
        if (index < 0) index = playlist.length - 1;
        if (index >= playlist.length) index = 0;
        
        currentIndex = index;
        const track = playlist[currentIndex];
        
        // Update DOM
        updateTrackUI(track);
        
        // Reset progress visually
        if (progressFill) progressFill.style.width = '0%';
        if (timeCurrent) timeCurrent.textContent = '0:00';
        if (timeDuration) timeDuration.textContent = '0:00';
        
        // Update Audio
        audio.src = track.src;
        audio.load();
        
        if (autoPlay) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => console.error("Autoplay prevented or error:", err));
            }
        }
    }

    function toggleRepeat() {
        isRepeat = !isRepeat;
        if(repeatBtn) {
            if(isRepeat) repeatBtn.classList.add('active');
            else repeatBtn.classList.remove('active');
        }
    }

    function onPlayStateChange() {
        const isPlaying = !audio.paused;
        if (playIcon) playIcon.style.display = isPlaying ? 'none' : 'block';
        if (pauseIcon) pauseIcon.style.display = isPlaying ? 'block' : 'none';
        
        if (vinyl) {
            if (isPlaying) vinyl.classList.add('spinning');
            else vinyl.classList.remove('spinning');
        }
        
        document.body.classList.toggle('is-playing', isPlaying);
    }

    function onTimeUpdate() {
        const current = audio.currentTime || 0;
        const duration = audio.duration || 0;
        
        if (duration > 0) {
            const pct = (current / duration) * 100;
            if (progressFill) progressFill.style.width = pct + '%';
        }
        
        if (timeCurrent) {
            timeCurrent.textContent = formatTime(current);
        }
        if (timeDuration && duration > 0) {
            timeDuration.textContent = formatTime(duration);
        }
    }

    function onLoadedMetadata() {
        onTimeUpdate(); // Update duration display
    }

    function onEnded() {
        if(isRepeat) {
            audio.currentTime = 0;
            audio.play().catch(err => console.error(err));
        } else {
            playNextTrack();
        }
    }

    function onError(e) {
        console.error("Audio playback error:", e);
        if (trackTitle) trackTitle.textContent = "Error loading track";
    }

    function playNextTrack() {
        loadTrack(currentIndex + 1, true);
    }

    function playPreviousTrack() {
        loadTrack(currentIndex - 1, true);
    }

    function seekTo(e) {
        if (!audio.duration) return;
        const rect = this.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audio.currentTime = audio.duration * pct;
    }

    function shuffleTrack() {
        if (playlist.length < 2) return;
        let randomIndex = currentIndex;
        while (randomIndex === currentIndex) {
            randomIndex = Math.floor(Math.random() * playlist.length);
        }
        loadTrack(randomIndex, true);
    }

    function formatTime(sec) {
        if (isNaN(sec) || !isFinite(sec)) return "0:00";
        sec = Math.floor(sec);
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    // Expose to window for app.js or effects.js
    window.appPlayer = {
        init: initPlayer,
        playNext: playNextTrack,
        playPrev: playPreviousTrack,
        getAudioElement: () => audio
    };
})();
