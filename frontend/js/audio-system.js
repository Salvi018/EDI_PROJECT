// Codecade Audio System - Calm & Premium
(function() {
    const AudioSystem = {
        bgMusic: null,
        sfxClick: null,
        sfxHover: null,
        sfxScroll: null,
        isMuted: true,
        hasInteracted: false,
        lastScrollSound: 0,
        lastHoverTime: 0,

        init() {
            this.createAudioElements();
            this.createToggleButton();
            this.attachEventListeners();
        },

        createAudioElements() {
            const audioHTML = `
                <audio id="bg-music" loop><source src="/assets/audio/lofi-bg.mp3" type="audio/mpeg"></audio>
                <audio id="sfx-click"><source src="/assets/audio/click-soft.mp3" type="audio/mpeg"></audio>
                <audio id="sfx-hover"><source src="/assets/audio/hover-soft.mp3" type="audio/mpeg"></audio>
                <audio id="sfx-scroll"><source src="/assets/audio/scroll-soft.mp3" type="audio/mpeg"></audio>
            `;
            document.body.insertAdjacentHTML('afterbegin', audioHTML);
            
            this.bgMusic = document.getElementById('bg-music');
            this.sfxClick = document.getElementById('sfx-click');
            this.sfxHover = document.getElementById('sfx-hover');
            this.sfxScroll = document.getElementById('sfx-scroll');
            
            this.bgMusic.volume = 0.15;
            this.sfxClick.volume = 0.25;
            this.sfxHover.volume = 0.15;
            this.sfxScroll.volume = 0.2;
        },

        createToggleButton() {
            const style = document.createElement('style');
            style.textContent = `
                .audio-toggle{position:fixed;bottom:30px;right:30px;width:60px;height:60px;border-radius:50%;background:rgba(153,50,204,0.3);border:2px solid rgba(255,20,147,0.6);box-shadow:0 0 20px rgba(153,50,204,0.5),inset 0 0 10px rgba(255,255,255,0.1);backdrop-filter:blur(10px);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:28px;transition:all 0.3s ease;z-index:1000}
                .audio-toggle:hover{transform:scale(1.1);box-shadow:0 0 30px rgba(255,20,147,0.8),inset 0 0 15px rgba(255,255,255,0.2);border-color:rgba(255,20,147,0.9)}
                .audio-toggle.muted{background:rgba(100,50,150,0.2);border-color:rgba(150,150,150,0.4)}
            `;
            document.head.appendChild(style);
            
            const button = document.createElement('button');
            button.id = 'audio-toggle';
            button.className = 'audio-toggle muted';
            button.innerHTML = '<span id="audio-icon">🔇</span>';
            button.setAttribute('aria-label', 'Toggle sound');
            document.body.appendChild(button);
        },

        attachEventListeners() {
            const toggle = document.getElementById('audio-toggle');
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleAudio();
            });

            document.addEventListener('click', (e) => {
                if (e.target.closest('#audio-toggle')) return;
                if (e.target.closest('button, a, .card, .retro-btn, .nav-link')) {
                    this.playSfx(this.sfxClick);
                }
                this.handleFirstInteraction();
            });

            const hoverElements = 'button, a, .card, .retro-panel, .nav-link, .retro-btn, .card-practice';
            document.addEventListener('mouseover', (e) => {
                if (e.target.matches(hoverElements) || e.target.closest(hoverElements)) {
                    const now = Date.now();
                    if (now - this.lastHoverTime > 100) {
                        this.playSfx(this.sfxHover);
                        this.lastHoverTime = now;
                    }
                }
            });

            window.addEventListener('scroll', () => {
                const now = Date.now();
                if (now - this.lastScrollSound > 800) {
                    this.playSfx(this.sfxScroll);
                    this.lastScrollSound = now;
                }
                this.handleFirstInteraction();
            });

            document.addEventListener('keydown', () => this.handleFirstInteraction(), { once: true });
        },

        playSfx(audio) {
            if (this.isMuted || !audio) return;
            try {
                const clone = audio.cloneNode();
                clone.volume = audio.volume;
                clone.play().catch(() => {});
            } catch (e) {}
        },

        toggleAudio() {
            this.isMuted = !this.isMuted;
            const toggle = document.getElementById('audio-toggle');
            const icon = document.getElementById('audio-icon');
            
            toggle.classList.toggle('muted', this.isMuted);
            icon.textContent = this.isMuted ? '🔇' : '🔊';
            
            if (this.isMuted) {
                try { this.bgMusic.pause(); } catch (e) {}
            } else {
                try { this.bgMusic.play().catch(() => {}); } catch (e) {}
            }
        },

        handleFirstInteraction() {
            if (!this.hasInteracted) {
                this.hasInteracted = true;
                if (!this.isMuted) {
                    try { this.bgMusic.play().catch(() => {}); } catch (e) {}
                }
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AudioSystem.init());
    } else {
        AudioSystem.init();
    }

    window.CodecadeAudio = AudioSystem;
})();
