class SCVoicePlayer extends HTMLElement {
  constructor() {
    super();
    this.audio = null;
    this.playButton = null;
    this.playIcon = null;
    this.pauseIcon = null;
    this.timeDisplay = null;
    this.waveBars = [];
    this._onTimeUpdate = this._onTimeUpdate.bind(this);
    this._onPlay = this._onPlay.bind(this);
    this._onPause = this._onPause.bind(this);
    this._onEnded = this._onEnded.bind(this);
  }

  connectedCallback() {
    // read attributes
    const audioSrc = this.getAttribute("audio") || "";
    const avatarSrc = this.getAttribute("avatar") || "";

    // main container
    const container = document.createElement("div");
    container.classList.add("sc-voice-container");

    // voice wrapper
    const voiceWrapper = document.createElement("div");
    voiceWrapper.classList.add("sc-voice-wrapper");

    // avatar image
    if (avatarSrc) {
      const avatarImg = document.createElement("img");
      avatarImg.classList.add("sc-voice-avatar");
      avatarImg.src = avatarSrc;
      voiceWrapper.appendChild(avatarImg);
    }

    // waves container
    const wavesContainer = document.createElement("div");
    wavesContainer.classList.add("sc-voice-waves");

    // create 20 waves
    for (let i = 1; i <= 20; i++) {
      const bar = document.createElement("div");
      bar.classList.add(`sc-voice-wave-${i}`, "sc-voice-wave-bar");
      wavesContainer.appendChild(bar);
      this.waveBars.push(bar);
    }
    voiceWrapper.appendChild(wavesContainer);

    // control wrapper
    this.controlWrapper = document.createElement("div");
    this.controlWrapper.classList.add("sc-voice-control-wrapper");

    // time
    this.timeDisplay = document.createElement("p");
    this.timeDisplay.classList.add("sc-voice-timeDisplay");
    this.timeDisplay.textContent = "0:00 / 0:00";
    this.controlWrapper.appendChild(this.timeDisplay);

    // controls
    this.playButton = document.createElement("div");
    this.playButton.classList.add("sc-voice-player");
    this.playButton.addEventListener("click", () => this._togglePlay());

    // icons
    this.playIcon = document.createElement("div");
    this.playIcon.classList.add("sc-voice-player-play");
    this.playIcon.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330" xml:space="preserve"><path fill="#F3F86E" d="M37.728 328.12a15 15 0 0 0 15.222-.4l240-149.999a15 15 0 0 0 0-25.44L52.95 2.28A15 15 0 0 0 30 15v300a15 15 0 0 0 7.728 13.12"/></svg>
  
        `;

    this.pauseIcon = document.createElement("div");
    this.pauseIcon.classList.add("sc-voice-player-pause");
    this.pauseIcon.style.display = "none";
    this.pauseIcon.innerHTML = `
          <svg height="14" width="14" viewBox="0 0 38 54" xmlns="http://www.w3.org/2000/svg">
            <rect fill="#F3F86E" x="0" y="0" width="14" height="54" rx="7"></rect>
            <rect fill="#F3F86E" x="24" y="0" width="14" height="54" rx="7"></rect>
          </svg>
        `;

    this.playButton.appendChild(this.playIcon);
    this.playButton.appendChild(this.pauseIcon);
    this.controlWrapper.appendChild(this.playButton);

    // hide native audio element
    this.audio = document.createElement("audio");
    this.audio.src = audioSrc;
    this.audio.addEventListener("timeupdate", this._onTimeUpdate);
    this.audio.addEventListener("play", this._onPlay);
    this.audio.addEventListener("pause", this._onPause);
    this.audio.addEventListener("ended", this._onEnded);

    // everything in one container
    container.appendChild(voiceWrapper);
    container.appendChild(this.controlWrapper);
    this.appendChild(container);
    this.appendChild(this.audio);
  }

  disconnectedCallback() {
    // clean up shit
    if (this.audio) {
      this.audio.removeEventListener("timeupdate", this._onTimeUpdate);
      this.audio.removeEventListener("play", this._onPlay);
      this.audio.removeEventListener("pause", this._onPause);
      this.audio.removeEventListener("ended", this._onEnded);
    }
  }

  _togglePlay() {
    if (!this.audio) return;
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  _onPlay() {
    this.playIcon.style.display = "none";
    this.pauseIcon.style.display = "flex";
  }

  _onPause() {
    this.playIcon.style.display = "flex";
    this.pauseIcon.style.display = "none";
  }

  _onEnded() {
    this.playIcon.style.display = "flex";
    this.pauseIcon.style.display = "none";
  }

  _onTimeUpdate() {
    const current = this.audio.currentTime;
    const duration = this.audio.duration;
    this.timeDisplay.textContent = `${this._formatTime(
      current
    )} / ${this._formatTime(duration)}`;

    if (!isNaN(duration)) {
      const fraction = current / duration;
      const barsToHighlight = Math.floor(fraction * this.waveBars.length);
      this.waveBars.forEach((bar, index) => {
        if (index < barsToHighlight) {
          bar.classList.add("active");
        } else {
          bar.classList.remove("active");
        }
      });
    }
  }

  _formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }
}
customElements.define("sc-voice-player", SCVoicePlayer);
