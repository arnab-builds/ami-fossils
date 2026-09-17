// js/player.js

(function() {
    let audio = null;
    let playlist = [];
    let currentIndex = 0;
    
    // UI Elements
    let playIcon, pauseIcon, vinyl, trackTitle, artImg, progressFill, timeLabel;
    
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
        artImg = document.getElementById('art-img');
        progressFill = document.getElementById('progress-fill');
        timeLabel = document.getElementById('time-label');

        // Audio Event Listeners
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('play', onPlayStateChange);
        audio.addEventListener('pause', onPlayStateChange);
        audio.addEventListener('error', onError);

        // UI Event Listeners
        document.getElementById('play-btn').addEventListener('click', togglePlay);
        document.getElementById('progress-track').addEventListener('click', seekTo);
        document.getElementById('shuffle-btn').addEventListener('click', shuffleTrack);
        
        // Initial setup
        loadTrack(currentIndex, false);
    }

    function loadTrack(index, autoPlay = false) {
        if (!playlist.length) return;
        
        if (index < 0) index = playlist.length - 1;
        if (index >= playlist.length) index = 0;
        
        currentIndex = index;
        const track = playlist[currentIndex];
        
        // Update DOM
        if (trackTitle) trackTitle.textContent = track.title;
        if (artImg) {
            artImg.src = track.cover || "";
            // Graceful fallback if no image
            artImg.onerror = function() {
                artImg.style.display = 'none';
            };
            artImg.onload = function() {
                artImg.style.display = 'block';
            }
        }
        
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

    function togglePlay() {
        if (!audio.src) return;
        
        if (audio.paused) {
            audio.play().catch(err => console.error("Playback error:", err));
        } else {
            audio.pause();
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
    }

    function onTimeUpdate() {
        const current = audio.currentTime || 0;
        const duration = audio.duration || 0;
        
        if (duration > 0) {
            const pct = (current / duration) * 100;
            if (progressFill) progressFill.style.width = pct + '%';
        }
        
        if (timeLabel) {
            timeLabel.textContent = formatTime(current) + ' / ' + formatTime(duration);
        }
    }

    function onLoadedMetadata() {
        onTimeUpdate(); // Update duration display
    }

    function onEnded() {
        playNextTrack();
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
        if (isNaN(sec)) return "0:00";
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

