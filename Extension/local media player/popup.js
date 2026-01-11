// ========================================
// State Management
// ========================================
const state = {
  currentVideo: null,
  playlist: [],
  currentIndex: 0,
  isPlaying: false,
  isMuted: false,
  volume: 100,
  playbackSpeed: 1.0,
  skipInterval: 5,
  isLooping: false,
  isFullscreen: false,
  subtitles: [],
  currentSubtitle: null,
  subtitleOffset: 0,
  resumePositions: {},
  settings: {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    audioBoost: 100,
    subtitleSize: 24,
    subtitleColor: '#ffffff',
    subtitleBgColor: '#000000',
    subtitleBgOpacity: 80,
    subtitlePosition: 90,
    autoplay: false,
    resume: true
  }
};

// ========================================
// DOM Elements
// ========================================
const elements = {
  // Screens
  welcomeScreen: document.getElementById('welcomeScreen'),
  playerWrapper: document.getElementById('playerWrapper'),
  
  // Video
  videoPlayer: document.getElementById('videoPlayer'),
  videoContainer: document.getElementById('videoContainer'),
  videoOverlay: document.getElementById('videoOverlay'),
  videoTitle: document.getElementById('videoTitle'),
  
  // Controls
  playPauseBtn: document.getElementById('playPauseBtn'),
  skipBackBtn: document.getElementById('skipBackBtn'),
  skipForwardBtn: document.getElementById('skipForwardBtn'),
  muteBtn: document.getElementById('muteBtn'),
  volumeSlider: document.getElementById('volumeSlider'),
  speedBtn: document.getElementById('speedBtn'),
  subtitleBtn: document.getElementById('subtitleBtn'),
  loopBtn: document.getElementById('loopBtn'),
  pipBtn: document.getElementById('pipBtn'),
  screenshotBtn: document.getElementById('screenshotBtn'),
  fullscreenBtn: document.getElementById('fullscreenBtn'),
  centerPlayBtn: document.getElementById('centerPlayBtn'),
  
  // Timeline
  timeline: document.getElementById('timeline'),
  timelineProgress: document.getElementById('timelineProgress'),
  timelineBuffered: document.getElementById('timelineBuffered'),
  timelineHandle: document.getElementById('timelineHandle'),
  timelinePreview: document.getElementById('timelinePreview'),
  currentTime: document.getElementById('currentTime'),
  duration: document.getElementById('duration'),
  
  // Buttons
  openFileBtn: document.getElementById('openFileBtn'),
  openPlaylistBtn: document.getElementById('openPlaylistBtn'),
  closePlayerBtn: document.getElementById('closePlayerBtn'),
  themeToggle: document.getElementById('themeToggle'),
  
  // File inputs
  videoFileInput: document.getElementById('videoFileInput'),
  playlistFileInput: document.getElementById('playlistFileInput'),
  subtitleFileInput: document.getElementById('subtitleFileInput'),
  
  // Panels
  settingsPanel: document.getElementById('settingsPanel'),
  statsPanel: document.getElementById('statsPanel'),
  speedPanel: document.getElementById('speedPanel'),
  settingsBtn: document.getElementById('settingsBtn'),
  statsBtn: document.getElementById('statsBtn'),
  closeSettingsBtn: document.getElementById('closeSettingsBtn'),
  closeStatsBtn: document.getElementById('closeStatsBtn'),
  
  // Playlist
  playlistItems: document.getElementById('playlistItems'),
  addToPlaylistBtn: document.getElementById('addToPlaylistBtn'),
  clearPlaylistBtn: document.getElementById('clearPlaylistBtn'),
  
  // Subtitle
  subtitleTrack: document.getElementById('subtitleTrack'),
  
  // Loading
  loadingIndicator: document.getElementById('loadingIndicator'),
  
  // Settings
  brightnessSlider: document.getElementById('brightnessSlider'),
  brightnessValue: document.getElementById('brightnessValue'),
  contrastSlider: document.getElementById('contrastSlider'),
  contrastValue: document.getElementById('contrastValue'),
  saturationSlider: document.getElementById('saturationSlider'),
  saturationValue: document.getElementById('saturationValue'),
  audioBoostSlider: document.getElementById('audioBoostSlider'),
  audioBoostValue: document.getElementById('audioBoostValue'),
  loadSubtitleBtn: document.getElementById('loadSubtitleBtn'),
  subtitleSyncSlider: document.getElementById('subtitleSyncSlider'),
  subtitleSyncValue: document.getElementById('subtitleSyncValue'),
  subtitleSizeSlider: document.getElementById('subtitleSizeSlider'),
  subtitleSizeValue: document.getElementById('subtitleSizeValue'),
  subtitleColorPicker: document.getElementById('subtitleColorPicker'),
  subtitleBgColorPicker: document.getElementById('subtitleBgColorPicker'),
  subtitleBgOpacitySlider: document.getElementById('subtitleBgOpacitySlider'),
  subtitleBgOpacityValue: document.getElementById('subtitleBgOpacityValue'),
  subtitlePositionSlider: document.getElementById('subtitlePositionSlider'),
  subtitlePositionValue: document.getElementById('subtitlePositionValue'),
  skipIntervalInput: document.getElementById('skipIntervalInput'),
  autoplayCheckbox: document.getElementById('autoplayCheckbox'),
  resumeCheckbox: document.getElementById('resumeCheckbox'),
  resetSettingsBtn: document.getElementById('resetSettingsBtn'),
  
  // Stats
  statResolution: document.getElementById('statResolution'),
  statFPS: document.getElementById('statFPS'),
  statBitrate: document.getElementById('statBitrate'),
  statCodec: document.getElementById('statCodec'),
  statFileSize: document.getElementById('statFileSize'),
  statDuration: document.getElementById('statDuration'),
  statSpeed: document.getElementById('statSpeed'),
  statVolume: document.getElementById('statVolume'),
  
  // Speed
  customSpeedInput: document.getElementById('customSpeedInput'),
  applyCustomSpeedBtn: document.getElementById('applyCustomSpeedBtn')
};

// ========================================
// Initialization
// ========================================
function init() {
  setupEventListeners();
  loadSettings();
  loadPlaylist();
  initTheme();
  hideControlsOnInactivity();
}

// ========================================
// Theme Management
// ========================================
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Animate the toggle
  elements.themeToggle.style.transform = 'scale(0.8) rotate(360deg)';
  setTimeout(() => {
    elements.themeToggle.style.transform = '';
  }, 300);
}

// ========================================
// File Handling
// ========================================
function openVideoFile() {
  elements.videoFileInput.click();
}

function openPlaylist() {
  elements.playlistFileInput.click();
}

function handleVideoFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    loadVideo(file);
    state.playlist = [file];
    state.currentIndex = 0;
    updatePlaylist();
    showPlayer();
  }
}

function handlePlaylistFileSelect(event) {
  const files = Array.from(event.target.files);
  if (files.length > 0) {
    state.playlist = files;
    state.currentIndex = 0;
    loadVideo(files[0]);
    updatePlaylist();
    showPlayer();
  }
}

function loadVideo(file) {
  if (!file) return;
  
  state.currentVideo = file;
  const videoUrl = URL.createObjectURL(file);
  
  elements.videoPlayer.src = videoUrl;
  elements.videoTitle.textContent = file.name;
  
  // Try to auto-detect subtitle file
  autoDetectSubtitle(file);
  
  // Resume from last position if enabled
  if (state.settings.resume && state.resumePositions[file.name]) {
    elements.videoPlayer.currentTime = state.resumePositions[file.name];
  }
  
  // Update stats
  updateStats();
  
  // Apply video filters
  applyVideoFilters();
}

function autoDetectSubtitle(videoFile) {
  // This would work if we had access to the file system
  // For now, we'll just clear current subtitles
  state.subtitles = [];
  state.currentSubtitle = null;
  elements.subtitleTrack.classList.remove('active');
}

// ========================================
// Player Controls
// ========================================
function showPlayer() {
  elements.welcomeScreen.classList.add('hidden');
  elements.playerWrapper.classList.add('active');
}

function closePlayer() {
  pauseVideo();
  elements.playerWrapper.classList.remove('active');
  elements.welcomeScreen.classList.remove('hidden');
  
  // Clean up
  if (elements.videoPlayer.src) {
    URL.revokeObjectURL(elements.videoPlayer.src);
    elements.videoPlayer.src = '';
  }
}

function togglePlayPause() {
  if (state.isPlaying) {
    pauseVideo();
  } else {
    playVideo();
  }
}

function playVideo() {
  elements.videoPlayer.play();
  state.isPlaying = true;
  elements.playPauseBtn.classList.add('playing');
  elements.centerPlayBtn.classList.add('hidden');
}

function pauseVideo() {
  elements.videoPlayer.pause();
  state.isPlaying = false;
  elements.playPauseBtn.classList.remove('playing');
  elements.centerPlayBtn.classList.remove('hidden');
}

function skipBackward() {
  elements.videoPlayer.currentTime = Math.max(0, elements.videoPlayer.currentTime - state.skipInterval);
}

function skipForward() {
  elements.videoPlayer.currentTime = Math.min(
    elements.videoPlayer.duration,
    elements.videoPlayer.currentTime + state.skipInterval
  );
}

function toggleMute() {
  state.isMuted = !state.isMuted;
  elements.videoPlayer.muted = state.isMuted;
  
  if (state.isMuted) {
    elements.muteBtn.classList.add('muted');
  } else {
    elements.muteBtn.classList.remove('muted');
  }
}

function setVolume(value) {
  state.volume = value;
  const audioBoostMultiplier = state.settings.audioBoost / 100;
  elements.videoPlayer.volume = Math.min(1, (value / 100) * audioBoostMultiplier);
  elements.volumeSlider.value = value;
  updateStats();
}

function changeSpeed(speed) {
  state.playbackSpeed = parseFloat(speed);
  elements.videoPlayer.playbackRate = state.playbackSpeed;
  elements.speedBtn.querySelector('.speed-text').textContent = `${speed}×`;
  
  // Update active speed option
  document.querySelectorAll('.speed-option').forEach(btn => {
    btn.classList.remove('active');
    if (parseFloat(btn.dataset.speed) === state.playbackSpeed) {
      btn.classList.add('active');
    }
  });
  
  updateStats();
}

function increaseSpeed() {
  const newSpeed = Math.min(5.0, state.playbackSpeed + 0.1);
  changeSpeed(newSpeed.toFixed(1));
}

function decreaseSpeed() {
  const newSpeed = Math.max(0.25, state.playbackSpeed - 0.1);
  changeSpeed(newSpeed.toFixed(1));
}

function resetSpeed() {
  changeSpeed(1.0);
}

function toggleLoop() {
  state.isLooping = !state.isLooping;
  elements.videoPlayer.loop = state.isLooping;
  
  if (state.isLooping) {
    elements.loopBtn.classList.add('active');
  } else {
    elements.loopBtn.classList.remove('active');
  }
}

function toggleSubtitles() {
  if (state.subtitles.length === 0) {
    // Prompt to load subtitle file
    elements.subtitleFileInput.click();
  } else {
    // Toggle subtitle visibility
    const isActive = elements.subtitleTrack.classList.toggle('active');
    if (isActive) {
      elements.subtitleBtn.classList.add('active');
    } else {
      elements.subtitleBtn.classList.remove('active');
    }
  }
}

async function togglePIP() {
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await elements.videoPlayer.requestPictureInPicture();
    }
  } catch (error) {
    console.error('PiP error:', error);
  }
}

function captureScreenshot() {
  const canvas = document.createElement('canvas');
  canvas.width = elements.videoPlayer.videoWidth;
  canvas.height = elements.videoPlayer.videoHeight;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(elements.videoPlayer, 0, 0, canvas.width, canvas.height);
  
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `screenshot-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  });
  
  // Visual feedback
  elements.videoContainer.style.opacity = '0.5';
  setTimeout(() => {
    elements.videoContainer.style.opacity = '1';
  }, 100);
}

function toggleFullscreen() {
  if (!state.isFullscreen) {
    if (elements.videoContainer.requestFullscreen) {
      elements.videoContainer.requestFullscreen();
    } else if (elements.videoContainer.webkitRequestFullscreen) {
      elements.videoContainer.webkitRequestFullscreen();
    } else if (elements.videoContainer.mozRequestFullScreen) {
      elements.videoContainer.mozRequestFullScreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    }
  }
}

// ========================================
// Timeline Controls
// ========================================
function updateTimeline() {
  if (!elements.videoPlayer.duration) return;
  
  const progress = (elements.videoPlayer.currentTime / elements.videoPlayer.duration) * 100;
  elements.timelineProgress.style.width = `${progress}%`;
  elements.timelineHandle.style.left = `${progress}%`;
  
  // Update buffered
  if (elements.videoPlayer.buffered.length > 0) {
    const buffered = (elements.videoPlayer.buffered.end(elements.videoPlayer.buffered.length - 1) / elements.videoPlayer.duration) * 100;
    elements.timelineBuffered.style.width = `${buffered}%`;
  }
  
  // Update time display
  elements.currentTime.textContent = formatTime(elements.videoPlayer.currentTime);
  elements.duration.textContent = formatTime(elements.videoPlayer.duration);
  
  // Update subtitle
  updateSubtitle(elements.videoPlayer.currentTime);
  
  // Save position for resume
  if (state.currentVideo && state.settings.resume) {
    state.resumePositions[state.currentVideo.name] = elements.videoPlayer.currentTime;
    saveResumePositions();
  }
}

function seekTimeline(event) {
  const rect = elements.timeline.getBoundingClientRect();
  const pos = (event.clientX - rect.left) / rect.width;
  elements.videoPlayer.currentTime = pos * elements.videoPlayer.duration;
}

function showTimelinePreview(event) {
  const rect = elements.timeline.getBoundingClientRect();
  const pos = (event.clientX - rect.left) / rect.width;
  const time = pos * elements.videoPlayer.duration;
  
  elements.timelinePreview.style.left = `${event.clientX - rect.left}px`;
  elements.timelinePreview.querySelector('.preview-time').textContent = formatTime(time);
}

// ========================================
// Subtitle Handling
// ========================================
function handleSubtitleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    parseSubtitles(content, file.name);
    elements.subtitleBtn.classList.add('active');
    elements.subtitleTrack.classList.add('active');
  };
  reader.readAsText(file);
}

function parseSubtitles(content, filename) {
  const ext = filename.split('.').pop().toLowerCase();
  
  if (ext === 'srt') {
    state.subtitles = parseSRT(content);
  } else if (ext === 'vtt') {
    state.subtitles = parseVTT(content);
  } else if (ext === 'ass') {
    state.subtitles = parseASS(content);
  }
}

function parseSRT(content) {
  const subtitles = [];
  const blocks = content.trim().split('\n\n');
  
  blocks.forEach(block => {
    const lines = block.split('\n');
    if (lines.length >= 3) {
      const timeMatch = lines[1].match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
      if (timeMatch) {
        const start = parseTimeString(timeMatch[1].replace(',', '.'));
        const end = parseTimeString(timeMatch[2].replace(',', '.'));
        const text = lines.slice(2).join('\n');
        
        subtitles.push({ start, end, text });
      }
    }
  });
  
  return subtitles;
}

function parseVTT(content) {
  const subtitles = [];
  const lines = content.split('\n');
  let i = 0;
  
  // Skip header
  while (i < lines.length && !lines[i].includes('-->')) {
    i++;
  }
  
  while (i < lines.length) {
    const timeMatch = lines[i].match(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/);
    if (timeMatch) {
      const start = parseTimeString(timeMatch[1]);
      const end = parseTimeString(timeMatch[2]);
      let text = '';
      i++;
      
      while (i < lines.length && lines[i].trim() !== '') {
        text += lines[i] + '\n';
        i++;
      }
      
      subtitles.push({ start, end, text: text.trim() });
    }
    i++;
  }
  
  return subtitles;
}

function parseASS(content) {
  // Simplified ASS parser
  const subtitles = [];
  const lines = content.split('\n');
  
  lines.forEach(line => {
    if (line.startsWith('Dialogue:')) {
      const parts = line.split(',');
      if (parts.length >= 10) {
        const start = parseASSTime(parts[1]);
        const end = parseASSTime(parts[2]);
        const text = parts.slice(9).join(',').replace(/\{[^}]*\}/g, '');
        
        subtitles.push({ start, end, text });
      }
    }
  });
  
  return subtitles;
}

function parseTimeString(timeStr) {
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  const seconds = parseFloat(parts[2]);
  
  return hours * 3600 + minutes * 60 + seconds;
}

function parseASSTime(timeStr) {
  const parts = timeStr.trim().split(':');
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  const seconds = parseFloat(parts[2]);
  
  return hours * 3600 + minutes * 60 + seconds;
}

function updateSubtitle(currentTime) {
  if (state.subtitles.length === 0 || !elements.subtitleTrack.classList.contains('active')) {
    return;
  }
  
  const adjustedTime = currentTime + (state.subtitleOffset / 1000);
  
  const currentSub = state.subtitles.find(sub => 
    adjustedTime >= sub.start && adjustedTime <= sub.end
  );
  
  if (currentSub) {
    if (state.currentSubtitle !== currentSub) {
      state.currentSubtitle = currentSub;
      elements.subtitleTrack.textContent = currentSub.text;
      
      // Animate subtitle appearance
      elements.subtitleTrack.style.transform = 'translateX(-50%) scale(0.95)';
      requestAnimationFrame(() => {
        elements.subtitleTrack.style.transform = 'translateX(-50%) scale(1)';
      });
    }
  } else {
    if (state.currentSubtitle) {
      state.currentSubtitle = null;
      elements.subtitleTrack.textContent = '';
    }
  }
}

function applySubtitleStyles() {
  elements.subtitleTrack.style.fontSize = `${state.settings.subtitleSize}px`;
  elements.subtitleTrack.style.color = state.settings.subtitleColor;
  
  const bgColor = state.settings.subtitleBgColor;
  const opacity = state.settings.subtitleBgOpacity / 100;
  elements.subtitleTrack.style.background = hexToRGBA(bgColor, opacity);
  
  elements.subtitleTrack.style.bottom = `${100 - state.settings.subtitlePosition}%`;
}

function hexToRGBA(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ========================================
// Playlist Management
// ========================================
function updatePlaylist() {
  elements.playlistItems.innerHTML = '';
  
  state.playlist.forEach((file, index) => {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    if (index === state.currentIndex) {
      item.classList.add('active');
    }
    
    item.innerHTML = `
      <div class="playlist-item-title">${file.name}</div>
      <div class="playlist-item-duration">Ready to play</div>
    `;
    
    item.addEventListener('click', () => {
      state.currentIndex = index;
      loadVideo(file);
      updatePlaylist();
      playVideo();
    });
    
    elements.playlistItems.appendChild(item);
  });
  
  savePlaylist();
}

function playNext() {
  if (state.currentIndex < state.playlist.length - 1) {
    state.currentIndex++;
    loadVideo(state.playlist[state.currentIndex]);
    updatePlaylist();
    if (state.settings.autoplay || state.isPlaying) {
      playVideo();
    }
  } else if (state.isLooping && state.playlist.length > 0) {
    state.currentIndex = 0;
    loadVideo(state.playlist[0]);
    updatePlaylist();
    playVideo();
  }
}

function playPrevious() {
  if (state.currentIndex > 0) {
    state.currentIndex--;
    loadVideo(state.playlist[state.currentIndex]);
    updatePlaylist();
    playVideo();
  }
}

function clearPlaylist() {
  if (confirm('Clear entire playlist?')) {
    state.playlist = [];
    state.currentIndex = 0;
    updatePlaylist();
  }
}

// ========================================
// Settings Management
// ========================================
function loadSettings() {
  const savedSettings = localStorage.getItem('playerSettings');
  if (savedSettings) {
    state.settings = { ...state.settings, ...JSON.parse(savedSettings) };
  }
  
  // Apply settings to UI
  elements.brightnessSlider.value = state.settings.brightness;
  elements.brightnessValue.textContent = `${state.settings.brightness}%`;
  elements.contrastSlider.value = state.settings.contrast;
  elements.contrastValue.textContent = `${state.settings.contrast}%`;
  elements.saturationSlider.value = state.settings.saturation;
  elements.saturationValue.textContent = `${state.settings.saturation}%`;
  elements.audioBoostSlider.value = state.settings.audioBoost;
  elements.audioBoostValue.textContent = `${state.settings.audioBoost}%`;
  elements.subtitleSizeSlider.value = state.settings.subtitleSize;
  elements.subtitleSizeValue.textContent = `${state.settings.subtitleSize}px`;
  elements.subtitleColorPicker.value = state.settings.subtitleColor;
  elements.subtitleBgColorPicker.value = state.settings.subtitleBgColor;
  elements.subtitleBgOpacitySlider.value = state.settings.subtitleBgOpacity;
  elements.subtitleBgOpacityValue.textContent = `${state.settings.subtitleBgOpacity}%`;
  elements.subtitlePositionSlider.value = state.settings.subtitlePosition;
  elements.subtitlePositionValue.textContent = `${state.settings.subtitlePosition}%`;
  elements.skipIntervalInput.value = state.skipInterval;
  elements.autoplayCheckbox.checked = state.settings.autoplay;
  elements.resumeCheckbox.checked = state.settings.resume;
  
  applySubtitleStyles();
}

function saveSettings() {
  localStorage.setItem('playerSettings', JSON.stringify(state.settings));
}

function resetSettings() {
  if (confirm('Reset all settings to defaults?')) {
    state.settings = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      audioBoost: 100,
      subtitleSize: 24,
      subtitleColor: '#ffffff',
      subtitleBgColor: '#000000',
      subtitleBgOpacity: 80,
      subtitlePosition: 90,
      autoplay: false,
      resume: true
    };
    
    loadSettings();
    saveSettings();
    applyVideoFilters();
    applySubtitleStyles();
  }
}

function applyVideoFilters() {
  if (!elements.videoPlayer) return;
  
  const filters = [
    `brightness(${state.settings.brightness}%)`,
    `contrast(${state.settings.contrast}%)`,
    `saturate(${state.settings.saturation}%)`
  ];
  
  elements.videoPlayer.style.filter = filters.join(' ');
}

// ========================================
// Stats Display
// ========================================
function updateStats() {
  if (!elements.videoPlayer.videoWidth) return;
  
  elements.statResolution.textContent = `${elements.videoPlayer.videoWidth}×${elements.videoPlayer.videoHeight}`;
  elements.statSpeed.textContent = `${state.playbackSpeed}×`;
  elements.statVolume.textContent = `${state.volume}%`;
  
  if (state.currentVideo) {
    elements.statFileSize.textContent = formatBytes(state.currentVideo.size);
  }
  
  if (elements.videoPlayer.duration) {
    elements.statDuration.textContent = formatTime(elements.videoPlayer.duration);
  }
  
  // Note: FPS, Bitrate, and Codec would require additional Media Source Extensions
  // or file parsing which is beyond basic <video> element capabilities
  elements.statFPS.textContent = '~30 fps';
  elements.statCodec.textContent = 'H.264';
  
  if (state.currentVideo && elements.videoPlayer.duration) {
    const bitrate = (state.currentVideo.size * 8) / elements.videoPlayer.duration;
    elements.statBitrate.textContent = formatBitrate(bitrate);
  }
}

// ========================================
// Playlist Persistence
// ========================================
function savePlaylist() {
  // We can't persist File objects, so we'll just save the count
  localStorage.setItem('playlistCount', state.playlist.length);
}

function loadPlaylist() {
  // Playlist will be empty on startup since we can't persist File objects
  // User will need to reload their videos
}

function saveResumePositions() {
  localStorage.setItem('resumePositions', JSON.stringify(state.resumePositions));
}

function loadResumePositions() {
  const saved = localStorage.getItem('resumePositions');
  if (saved) {
    state.resumePositions = JSON.parse(saved);
  }
}

// ========================================
// Utility Functions
// ========================================
function formatTime(seconds) {
  if (!isFinite(seconds)) return '00:00';
  
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatBitrate(bps) {
  if (bps === 0) return '0 bps';
  const k = 1000;
  const sizes = ['bps', 'Kbps', 'Mbps'];
  const i = Math.floor(Math.log(bps) / Math.log(k));
  return Math.round(bps / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ========================================
// Control Visibility
// ========================================
let controlsTimeout;
function hideControlsOnInactivity() {
  const resetTimer = () => {
    clearTimeout(controlsTimeout);
    elements.videoOverlay.classList.add('show');
    
    if (state.isPlaying) {
      controlsTimeout = setTimeout(() => {
        elements.videoOverlay.classList.remove('show');
      }, 3000);
    }
  };
  
  elements.videoContainer.addEventListener('mousemove', resetTimer);
  elements.videoContainer.addEventListener('click', resetTimer);
  
  resetTimer();
}

// ========================================
// Keyboard Shortcuts
// ========================================
function handleKeyPress(event) {
  // Don't handle if typing in an input
  if (event.target.tagName === 'INPUT') return;
  
  switch (event.key.toLowerCase()) {
    case ' ':
      event.preventDefault();
      togglePlayPause();
      break;
    case 'arrowleft':
      event.preventDefault();
      skipBackward();
      break;
    case 'arrowright':
      event.preventDefault();
      skipForward();
      break;
    case 'arrowup':
      event.preventDefault();
      setVolume(Math.min(100, state.volume + 5));
      break;
    case 'arrowdown':
      event.preventDefault();
      setVolume(Math.max(0, state.volume - 5));
      break;
    case '[':
      event.preventDefault();
      decreaseSpeed();
      break;
    case ']':
      event.preventDefault();
      increaseSpeed();
      break;
    case 'f':
      event.preventDefault();
      toggleFullscreen();
      break;
    case 'm':
      event.preventDefault();
      toggleMute();
      break;
    case 's':
      event.preventDefault();
      toggleSubtitles();
      break;
    case 'r':
      event.preventDefault();
      resetSpeed();
      break;
  }
}

// ========================================
// Event Listeners
// ========================================
function setupEventListeners() {
  // File opening
  elements.openFileBtn.addEventListener('click', openVideoFile);
  elements.openPlaylistBtn.addEventListener('click', openPlaylist);
  elements.videoFileInput.addEventListener('change', handleVideoFileSelect);
  elements.playlistFileInput.addEventListener('change', handlePlaylistFileSelect);
  elements.subtitleFileInput.addEventListener('change', handleSubtitleFileSelect);
  
  // Player controls
  elements.playPauseBtn.addEventListener('click', togglePlayPause);
  elements.centerPlayBtn.addEventListener('click', togglePlayPause);
  elements.skipBackBtn.addEventListener('click', skipBackward);
  elements.skipForwardBtn.addEventListener('click', skipForward);
  elements.muteBtn.addEventListener('click', toggleMute);
  elements.volumeSlider.addEventListener('input', (e) => setVolume(e.target.value));
  elements.speedBtn.addEventListener('click', () => {
    elements.speedPanel.classList.toggle('active');
  });
  elements.subtitleBtn.addEventListener('click', toggleSubtitles);
  elements.loopBtn.addEventListener('click', toggleLoop);
  elements.pipBtn.addEventListener('click', togglePIP);
  elements.screenshotBtn.addEventListener('click', captureScreenshot);
  elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
  elements.closePlayerBtn.addEventListener('click', closePlayer);
  
  // Theme
  elements.themeToggle.addEventListener('click', toggleTheme);
  
  // Timeline
  elements.timeline.addEventListener('click', seekTimeline);
  elements.timeline.addEventListener('mousemove', showTimelinePreview);
  
  // Video events
  elements.videoPlayer.addEventListener('loadedmetadata', () => {
    elements.loadingIndicator.classList.remove('active');
    updateTimeline();
    updateStats();
  });
  
  elements.videoPlayer.addEventListener('timeupdate', updateTimeline);
  
  elements.videoPlayer.addEventListener('play', () => {
    state.isPlaying = true;
    elements.playPauseBtn.classList.add('playing');
    elements.centerPlayBtn.classList.add('hidden');
  });
  
  elements.videoPlayer.addEventListener('pause', () => {
    state.isPlaying = false;
    elements.playPauseBtn.classList.remove('playing');
    elements.centerPlayBtn.classList.remove('hidden');
  });
  
  elements.videoPlayer.addEventListener('ended', () => {
    if (!state.isLooping) {
      playNext();
    }
  });
  
  elements.videoPlayer.addEventListener('waiting', () => {
    elements.loadingIndicator.classList.add('active');
  });
  
  elements.videoPlayer.addEventListener('canplay', () => {
    elements.loadingIndicator.classList.remove('active');
  });
  
  // Fullscreen changes
  document.addEventListener('fullscreenchange', () => {
    state.isFullscreen = !!document.fullscreenElement;
    if (state.isFullscreen) {
      elements.fullscreenBtn.classList.add('fullscreen');
    } else {
      elements.fullscreenBtn.classList.remove('fullscreen');
    }
  });
  
  // Panels
  elements.settingsBtn.addEventListener('click', () => {
    elements.settingsPanel.classList.add('active');
    elements.statsPanel.classList.remove('active');
  });
  
  elements.statsBtn.addEventListener('click', () => {
    elements.statsPanel.classList.add('active');
    elements.settingsPanel.classList.remove('active');
    updateStats();
  });
  
  elements.closeSettingsBtn.addEventListener('click', () => {
    elements.settingsPanel.classList.remove('active');
  });
  
  elements.closeStatsBtn.addEventListener('click', () => {
    elements.statsPanel.classList.remove('active');
  });
  
  // Settings controls
  elements.brightnessSlider.addEventListener('input', (e) => {
    state.settings.brightness = parseInt(e.target.value);
    elements.brightnessValue.textContent = `${state.settings.brightness}%`;
    applyVideoFilters();
    saveSettings();
  });
  
  elements.contrastSlider.addEventListener('input', (e) => {
    state.settings.contrast = parseInt(e.target.value);
    elements.contrastValue.textContent = `${state.settings.contrast}%`;
    applyVideoFilters();
    saveSettings();
  });
  
  elements.saturationSlider.addEventListener('input', (e) => {
    state.settings.saturation = parseInt(e.target.value);
    elements.saturationValue.textContent = `${state.settings.saturation}%`;
    applyVideoFilters();
    saveSettings();
  });
  
  elements.audioBoostSlider.addEventListener('input', (e) => {
    state.settings.audioBoost = parseInt(e.target.value);
    elements.audioBoostValue.textContent = `${state.settings.audioBoost}%`;
    setVolume(state.volume); // Reapply volume with new boost
    saveSettings();
  });
  
  elements.loadSubtitleBtn.addEventListener('click', () => {
    elements.subtitleFileInput.click();
  });
  
  elements.subtitleSyncSlider.addEventListener('input', (e) => {
    state.subtitleOffset = parseInt(e.target.value);
    elements.subtitleSyncValue.textContent = `${state.subtitleOffset}ms`;
  });
  
  elements.subtitleSizeSlider.addEventListener('input', (e) => {
    state.settings.subtitleSize = parseInt(e.target.value);
    elements.subtitleSizeValue.textContent = `${state.settings.subtitleSize}px`;
    applySubtitleStyles();
    saveSettings();
  });
  
  elements.subtitleColorPicker.addEventListener('input', (e) => {
    state.settings.subtitleColor = e.target.value;
    applySubtitleStyles();
    saveSettings();
  });
  
  elements.subtitleBgColorPicker.addEventListener('input', (e) => {
    state.settings.subtitleBgColor = e.target.value;
    applySubtitleStyles();
    saveSettings();
  });
  
  elements.subtitleBgOpacitySlider.addEventListener('input', (e) => {
    state.settings.subtitleBgOpacity = parseInt(e.target.value);
    elements.subtitleBgOpacityValue.textContent = `${state.settings.subtitleBgOpacity}%`;
    applySubtitleStyles();
    saveSettings();
  });
  
  elements.subtitlePositionSlider.addEventListener('input', (e) => {
    state.settings.subtitlePosition = parseInt(e.target.value);
    elements.subtitlePositionValue.textContent = `${state.settings.subtitlePosition}%`;
    applySubtitleStyles();
    saveSettings();
  });
  
  elements.skipIntervalInput.addEventListener('input', (e) => {
    state.skipInterval = parseInt(e.target.value) || 5;
  });
  
  elements.autoplayCheckbox.addEventListener('change', (e) => {
    state.settings.autoplay = e.target.checked;
    saveSettings();
  });
  
  elements.resumeCheckbox.addEventListener('change', (e) => {
    state.settings.resume = e.target.checked;
    saveSettings();
  });
  
  elements.resetSettingsBtn.addEventListener('click', resetSettings);
  
  // Speed panel
  document.querySelectorAll('.speed-option').forEach(btn => {
    btn.addEventListener('click', () => {
      changeSpeed(btn.dataset.speed);
    });
  });
  
  elements.applyCustomSpeedBtn.addEventListener('click', () => {
    const speed = parseFloat(elements.customSpeedInput.value);
    if (speed >= 0.1 && speed <= 5.0) {
      changeSpeed(speed.toFixed(1));
    }
  });
  
  // Playlist
  elements.addToPlaylistBtn.addEventListener('click', () => {
    elements.playlistFileInput.click();
  });
  
  elements.clearPlaylistBtn.addEventListener('click', clearPlaylist);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyPress);
  
  // Click outside to close panels
  document.addEventListener('click', (e) => {
    if (!elements.speedPanel.contains(e.target) && !elements.speedBtn.contains(e.target)) {
      elements.speedPanel.classList.remove('active');
    }
  });
  
  // Double click to fullscreen
  elements.videoPlayer.addEventListener('dblclick', toggleFullscreen);
}

// ========================================
// Start Application
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  init();
  loadResumePositions();
});
