const allPlayers = new Set();
const $ = selector => document.querySelector(selector);
const make = (tag, className = '', value = '') => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (value) element.textContent = value;
  return element;
};
const videoPath = clip => `videos/web/${clip.id}.mp4?v=20261026`;
const posterPath = clip => `assets/posters/${clip.id}.jpg?v=20261026`;
const timeLabel = seconds => `${seconds.toFixed(1)} s`;
const clockLabel = seconds => {
  const time = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  return `${Math.floor(time / 60)}:${(time % 60).toFixed(1).padStart(4, '0')}`;
};
const icons = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>',
  restart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a8 8 0 1 1-7.7 10h2.1A6 6 0 1 0 8 7.7V11H6V4h2v1.3A8 8 0 0 1 12 4z"/></svg>',
};
const clamp = (value, max) => Math.max(0, Math.min(max, value));

function makeTransport(label, duration, initialSpeed = 1) {
  const node = make('div', 'transport');
  const button = make('button', 'transport-toggle');
  button.type = 'button';
  const seek = make('input', 'transport-seek');
  seek.type = 'range';
  seek.min = '0';
  seek.max = String(duration);
  seek.step = '0.05';
  seek.value = '0';
  seek.setAttribute('aria-label', `Seek ${label}`);
  const clock = make('span', 'transport-clock');
  const speed = make('select', 'transport-speed');
  speed.setAttribute('aria-label', `Playback speed for ${label}`);
  for (const value of [...new Set([0.5, 1, 1.5, 2, 3, initialSpeed])].sort((a, b) => a - b)) {
    const option = make('option', '', `${value}×`);
    option.value = String(value);
    speed.append(option);
  }
  speed.value = String(initialSpeed);
  node.append(button, seek, clock, speed);
  return {node, button, seek, clock, speed, scrubbing: false};
}
function setButton(button, state, label) {
  const kind = state === 'playing' ? 'pause' : state === 'ended' ? 'restart' : 'play';
  const verb = kind[0].toUpperCase() + kind.slice(1);
  button.innerHTML = icons[kind];
  button.setAttribute('aria-label', `${verb} ${label}`);
  button.title = `${verb} ${label}`;
  button.disabled = state === 'loading';
}
function setTimeline(transport, current, duration) {
  const position = clamp(current, duration);
  if (!transport.scrubbing) transport.seek.value = String(position);
  transport.seek.style.setProperty('--progress', `${duration ? position / duration * 100 : 0}%`);
  transport.clock.textContent = `${clockLabel(position)} / ${clockLabel(duration)}`;
}
function makeCard(clip, title, layout, feature = false) {
  const card = make('div', 'media-card');
  const bar = make('div', 'media-card-bar');
  const name = make(feature ? 'span' : 'h4', 'media-name', feature ? '' : clip.title);
  const metrics = make('div', 'media-metrics');
  if (clip.initial !== undefined) metrics.append(make('span', 'planning-time', `First solution ${clip.initial.toFixed(2)} s`));
  if (clip.planning !== undefined) metrics.append(make('span', 'planning-time', `Planning ${clip.planning.toFixed(2)} s`));
  if (clip.session !== undefined) metrics.append(make('span', 'planning-time', `Agent session ${Math.round(clip.session)} min`));
  if (clip.cost !== undefined) metrics.append(make('span', 'planning-time', `Cost ${clip.cost.toFixed(1)} rad`));
  // Clips without a timeline in seconds (e.g. benchmarks that score distance) omit the timer.
  const timer = clip.timer === false ? null : make('span', 'media-timer');
  if (timer) metrics.append(timer);
  const speedTag = clip.speed ? make('span', 'speed-tag', `${clip.speed}× playback`) : null;
  if (speedTag) metrics.append(speedTag);
  bar.append(name, metrics);
  const shell = make('div', 'video-shell');
  const video = make('video');
  video.src = videoPath(clip);
  video.poster = posterPath(clip);
  video.preload = 'none';
  video.muted = true;
  video.playsInline = true;
  video.setAttribute('aria-label', `${title}: ${clip.title || title}`);
  video.style.aspectRatio = clip.aspect || (layout === 'comparison' && title.includes('arms') ? '16 / 9' : layout === 'assembly' ? '1280 / 864' : layout === 'scaling' || layout === 'comparison' ? '1280 / 954' : '16 / 9');
  shell.append(video);
  card.append(bar);
  if (clip.scheduling !== undefined && clip.solution !== undefined) {
    const breakdown = make('div', 'planning-breakdown');
    breakdown.append(
      make('span', '', `Scheduling time: ${clip.scheduling.toFixed(2)} s`),
      make('strong', '', `Initial solution + refinement: ${clip.solution.toFixed(2)} s`),
    );
    card.append(breakdown);
  }
  card.append(shell);
  return {clip, card, shell, video, timer, speedTag};
}
function updateMetric({clip, video, timer}) {
  if (!timer) return;
  const current = Number.isFinite(video.currentTime) ? video.currentTime : 0;
  timer.textContent = `${clip.excerpt ? 'Playback' : clip.execution ? 'Execution' : 'Makespan'} ${timeLabel(Math.min(current, clip.duration))} / ${timeLabel(clip.duration)}${clip.excerpt ? ' excerpt' : ''}`;
}
function seekVideo(entry, seconds) {
  const time = clamp(seconds, entry.clip.duration);
  if (entry.video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    entry.video.currentTime = time;
  } else {
    entry.pendingSeek = time;
    if (!entry.waitingForMetadata) {
      entry.waitingForMetadata = true;
      entry.video.addEventListener('loadedmetadata', () => {
        entry.waitingForMetadata = false;
        if (entry.pendingSeek !== null) entry.video.currentTime = entry.pendingSeek;
        entry.pendingSeek = null;
        entry.refresh?.();
      }, {once: true});
    }
    entry.video.preload = 'metadata';
    if (entry.video.networkState === HTMLMediaElement.NETWORK_EMPTY) entry.video.load();
  }
}

// Baselines use one timeline so seeking and speed changes preserve alignment.
function createComparison(mount, {title, clips, cols}) {
  const root = make('div', 'media-group comparison');
  root.style.setProperty('--cols', String(cols || clips.length));
  const header = make('div', 'media-group-header');
  header.append(make('h3', 'media-group-title', title));
  const grid = make('div', 'media-grid');
  const entries = clips.map(clip => {
    const entry = makeCard(clip, title, 'comparison');
    grid.append(entry.card);
    return entry;
  });
  const duration = Math.max(...clips.map(clip => clip.duration / (clip.speed || 1)));
  const leader = entries.reduce((a, b) => a.clip.duration / (a.clip.speed || 1) >= b.clip.duration / (b.clip.speed || 1) ? a : b);
  entries.forEach(entry => {
    entry.transport = makeTransport(`${title} comparison`, duration);
    entry.transport.node.classList.add('overlay-transport');
    entry.shell.append(entry.transport.node);
  });
  const status = make('span', 'sr-only');
  status.setAttribute('role', 'status');
  root.append(header, grid, status);
  mount.append(root);
  let state = 'idle';
  let manualPause = false;
  let blockedAutoplay = false;
  let generation = 0;
  let frame = 0;
  let speed = 1;
  const wallTime = () => leader.video.currentTime / (leader.clip.speed || 1);
  const update = (position = wallTime()) => {
    root.dataset.state = state;
    entries.forEach(entry => {
      entry.shell.dataset.state = state;
      setButton(entry.transport.button, state, `${title} comparison`);
      setTimeline(entry.transport, position, duration);
      updateMetric(entry);
    });
  };
  const pause = () => {
    generation++;
    cancelAnimationFrame(frame);
    entries.forEach(({video}) => video.pause());
    if (state !== 'ended') state = 'paused';
    update();
  };
  const seek = position => {
    const time = clamp(position, duration);
    entries.forEach(entry => {
      const sourceTime = Math.min(entry.clip.duration, time * (entry.clip.speed || 1));
      seekVideo(entry, sourceTime);
      if (state === 'playing') {
        if (sourceTime >= entry.clip.duration - 0.05) entry.video.pause();
        else if (entry.video.paused && entry.video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) entry.video.play().catch(() => {});
      }
    });
    if (state === 'ended' && time < duration - 0.05) state = 'paused';
    if (state === 'playing' && time >= duration - 0.05) {
      entries.forEach(({video}) => video.pause());
      cancelAnimationFrame(frame);
      state = 'ended';
    }
    update(time);
  };
  const play = async (automatic = false) => {
    if (state === 'playing' || state === 'loading') return;
    if (automatic && (manualPause || blockedAutoplay || state === 'ended')) return;
    if (!automatic) { manualPause = false; blockedAutoplay = false; }
    allPlayers.forEach(player => { if (player !== api) player.pause(); });
    if (state === 'ended') seek(0);
    state = 'loading';
    update();
    const token = ++generation;
    const active = entries.filter(entry => entry.video.currentTime < entry.clip.duration - 0.05);
    try {
      entries.forEach(({clip, video}) => { video.preload = 'auto'; video.playbackRate = (clip.speed || 1) * speed; });
      await Promise.all(active.map(({video}) => video.play()));
      if (token !== generation) { active.forEach(({video}) => video.pause()); return; }
      state = 'playing';
      status.textContent = '';
      update();
      const tick = () => {
        if (state !== 'playing') return;
        const time = wallTime();
        entries.forEach(({clip, video}) => {
          if (video === leader.video) return;
          const desired = Math.min(clip.duration, time * (clip.speed || 1));
          if (Math.abs(video.currentTime - desired) > 0.25) video.currentTime = desired;
          if (time >= clip.duration / (clip.speed || 1)) video.pause();
        });
        update(time);
        if (leader.video.ended || time >= duration - 0.04) {
          entries.forEach(({video}) => video.pause());
          state = 'ended';
          update(duration);
          return;
        }
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    } catch (error) {
      if (token !== generation) return;
      pause();
      if (automatic) blockedAutoplay = true;
      status.textContent = 'Video unavailable. Select play to try again.';
    }
  };
  entries.forEach(entry => {
    const {transport, video} = entry;
    const toggle = () => {
      if (state === 'playing') { manualPause = true; pause(); }
      else play(false);
    };
    transport.button.addEventListener('click', toggle);
    video.addEventListener('click', toggle);
    transport.seek.addEventListener('pointerdown', () => { transport.scrubbing = true; });
    transport.seek.addEventListener('pointerup', () => { transport.scrubbing = false; update(); });
    transport.seek.addEventListener('input', () => seek(Number(transport.seek.value)));
    transport.speed.addEventListener('change', () => {
      speed = Number(transport.speed.value);
      entries.forEach(other => {
        other.transport.speed.value = String(speed);
        other.video.playbackRate = (other.clip.speed || 1) * speed;
      });
    });
  });
  const api = {root, play, pause, get state() { return state; }, dispose() {
    pause();
    allPlayers.delete(api);
    entries.forEach(({video}) => { video.removeAttribute('src'); video.load(); });
    root.remove();
  }};
  allPlayers.add(api);
  update();
  return api;
}

// Featured, scaling, and assembly clips have their own hover/touch controls.
function createIndependent(mount, {title, clips, layout, feature = false}) {
  const root = make('div', `media-group ${layout}${feature ? ' featured-player' : ''}`);
  const header = make('div', 'media-group-header');
  header.append(make(feature ? 'h2' : 'h3', 'media-group-title', title));
  const grid = make('div', 'media-grid');
  const entries = clips.map(clip => {
    const entry = makeCard(clip, title, layout, feature);
    entry.transport = makeTransport(clip.title || title, clip.duration, clip.speed || 1);
    entry.transport.node.classList.add('overlay-transport');
    entry.shell.append(entry.transport.node);
    entry.state = 'idle';
    entry.manualPause = false;
    entry.blockedAutoplay = false;
    entry.generation = 0;
    entry.speed = clip.speed || 1;
    entry.pendingSeek = null;
    entry.waitingForMetadata = false;
    grid.append(entry.card);
    return entry;
  });
  root.append(header, grid);
  mount.append(root);
  const groupState = () => entries.some(entry => entry.state === 'playing') ? 'playing' : entries.some(entry => entry.state === 'loading') ? 'loading' : 'paused';
  const refresh = entry => {
    entry.shell.dataset.state = entry.state;
    root.dataset.state = groupState();
    setButton(entry.transport.button, entry.state, entry.clip.title || title);
    setTimeline(entry.transport, entry.video.currentTime, entry.clip.duration);
    updateMetric(entry);
    if (entry.speedTag) entry.speedTag.textContent = `${entry.speed}× playback`;
  };
  const pauseEntry = (entry, manual = false) => {
    if (manual) entry.manualPause = true;
    entry.generation++;
    entry.video.pause();
    if (entry.state !== 'ended') entry.state = 'paused';
    refresh(entry);
  };
  const pause = () => entries.forEach(entry => {
    if (entry.state === 'playing' || entry.state === 'loading') pauseEntry(entry);
  });
  const playEntry = async (entry, automatic = false) => {
    if (entry.state === 'playing' || entry.state === 'loading') return;
    if (automatic && (entry.manualPause || entry.blockedAutoplay || entry.state === 'ended')) return;
    if (!automatic) {
      entry.manualPause = false;
      entry.blockedAutoplay = false;
      allPlayers.forEach(player => { if (player !== api) player.pause(); });
    }
    if (entry.state === 'ended') seekVideo(entry, 0);
    entry.state = 'loading';
    refresh(entry);
    const token = ++entry.generation;
    entry.video.preload = 'auto';
    entry.video.playbackRate = entry.speed;
    try {
      await entry.video.play();
      if (token !== entry.generation) { entry.video.pause(); return; }
      entry.state = 'playing';
      refresh(entry);
    } catch (error) {
      if (token !== entry.generation) return;
      entry.state = 'paused';
      if (automatic) entry.blockedAutoplay = true;
      refresh(entry);
    }
  };
  const cardVisible = element => {
    const rect = element.getBoundingClientRect();
    const visible = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 68));
    return visible >= Math.min(110, rect.height * 0.3);
  };
  const play = (automatic = false) => {
    if (!automatic) { entries.forEach(entry => playEntry(entry, false)); return; }
    entries.forEach(entry => {
      if (cardVisible(entry.shell)) playEntry(entry, true);
      else if (entry.state === 'playing' || entry.state === 'loading') pauseEntry(entry);
    });
  };
  for (const entry of entries) {
    entry.refresh = () => refresh(entry);
    const {transport, video} = entry;
    transport.button.addEventListener('click', () => {
      if (entry.state === 'playing') pauseEntry(entry, true);
      else playEntry(entry, false);
    });
    video.addEventListener('click', () => {
      if (entry.state === 'playing') pauseEntry(entry, true);
      else playEntry(entry, false);
    });
    video.addEventListener('timeupdate', () => refresh(entry));
    video.addEventListener('seeked', () => refresh(entry));
    video.addEventListener('ended', () => { entry.state = 'ended'; refresh(entry); });
    transport.seek.addEventListener('pointerdown', () => { transport.scrubbing = true; });
    transport.seek.addEventListener('pointerup', () => { transport.scrubbing = false; refresh(entry); });
    transport.seek.addEventListener('input', () => {
      const time = Number(transport.seek.value);
      seekVideo(entry, time);
      if (entry.state === 'ended' && time < entry.clip.duration - 0.05) entry.state = 'paused';
      if (entry.state === 'playing' && time >= entry.clip.duration - 0.05) { video.pause(); entry.state = 'ended'; }
      refresh(entry);
      setTimeline(transport, time, entry.clip.duration);
    });
    transport.speed.addEventListener('change', () => {
      entry.speed = Number(transport.speed.value);
      video.playbackRate = entry.speed;
      refresh(entry);
    });
  }
  const api = {root, entries, play, pause, get state() { return groupState(); }, dispose() {
    pause();
    allPlayers.delete(api);
    entries.forEach(({video}) => { video.removeAttribute('src'); video.load(); });
    root.remove();
  }};
  allPlayers.add(api);
  entries.forEach(refresh);
  return api;
}

let featured;
const picker = $('#demo-picker');
const buttons = window.CUARMS_FEATURED.map((clip, index) => {
  const button = make('button', 'demo-choice');
  button.type = 'button';
  button.setAttribute('aria-pressed', String(index === 0));
  const image = make('img');
  image.src = posterPath(clip); image.alt = ''; image.width = 96; image.height = 60;
  button.append(image, make('strong', '', clip.title));
  button.addEventListener('click', () => {
    if (featured?.entries[0].clip.id === clip.id) return;
    featured?.dispose();
    featured = createIndependent($('#featured-player'), {title: clip.title, clips: [clip], layout: 'feature', feature: true});
    $('#featured-description').textContent = clip.caption;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    scheduleAutoplay();
  });
  picker.append(button);
  return button;
});
featured = createIndependent($('#featured-player'), {title: window.CUARMS_FEATURED[0].title, clips: [window.CUARMS_FEATURED[0]], layout: 'feature', feature: true});
createChoice($('#roboballet-comparisons'), {title: '40 targets', choose: 'a setting',
  options: window.CUARMS_WELDING});
createChoice($('#tabletop-comparisons'), {title: 'Four objects', choose: 'a task',
  options: window.CUARMS_TABLETOP});
createIndependent($('#scaling-player'), {title: 'Six and eight objects', clips: window.CUARMS_SCALING, layout: 'scaling'});
createIndependent($('#assembly-player'), {title: 'Assembly tasks', clips: window.CUARMS_ASSEMBLIES, layout: 'assembly'});
createIndependent($('#xecbs-player'), {title: 'Four scenes', clips: window.CUARMS_XECBS, layout: 'benchmark'});
createIndependent($('#method-player'), {title: 'How cuArms works', clips: window.CUARMS_METHOD, layout: 'feature', feature: true});
createIndependent($('#lego-player'), {title: 'Six structures', clips: window.CUARMS_LEGO, layout: 'benchmark'});
// A comparison with buttons for its cases; a choice rebuilds the synchronized player.
function createChoice(mount, group) {
  const block = make('div', 'choice-group');
  const header = make('div', 'choice-header');
  header.append(make('h3', 'choice-title', group.title));
  const options = make('div', 'choice-options');
  options.setAttribute('role', 'group');
  options.setAttribute('aria-label', `${group.title}: choose ${group.choose || 'a case'}`);
  header.append(options);
  const table = make('div', 'choice-table');
  const player = make('div');
  block.append(header, table, player);
  mount.append(block);
  const showTable = option => {
    table.replaceChildren();
    if (!option.table) return;
    const element = make('table', 'metrics-table');
    const head = make('tr');
    option.table.columns.forEach(text => head.append(make('th', '', text)));
    element.append(head);
    option.table.rows.forEach(row => {
      const line = make('tr');
      row.forEach((text, index) => line.append(make(index ? 'td' : 'th', '', text)));
      element.append(line);
    });
    table.append(element);
  };
  let current;
  const buttons = group.options.map((option, index) => {
    const button = make('button', 'choice-option', option.label);
    button.type = 'button';
    button.setAttribute('aria-pressed', String(index === 0));
    button.addEventListener('click', () => {
      if (button.getAttribute('aria-pressed') === 'true') return;
      current?.dispose();
      current = createComparison(player, option);
      showTable(option);
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      scheduleAutoplay();
    });
    options.append(button);
    return button;
  });
  current = createComparison(player, group.options[0]);
  showTable(group.options[0]);
}

if (window.CUARMS_INTENT) createChoice($('#intent-results'), window.CUARMS_INTENT);
for (const family of window.CUARMS_AGENTS) {
  const section = make('div', 'agent-family');
  section.append(make('h3', '', family.title), make('p', 'section-description', family.description));
  $('#agent-results').append(section);
  for (const group of family.groups) createChoice(section, group);
}

// Autoplay visible videos, pausing groups that leave view. A manual pause persists.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let scheduled = false;
function scheduleAutoplay() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    if (document.hidden || reducedMotion.matches) { allPlayers.forEach(player => player.pause()); return; }
    const candidates = [...allPlayers].map(player => {
      const rect = player.root.getBoundingClientRect();
      const visible = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 68));
      return {player, visible, score: visible / Math.max(1, Math.min(rect.height, innerHeight - 68))};
    }).filter(item => item.visible >= 140 && item.score >= 0.25).sort((a, b) => b.score - a.score);
    const active = candidates[0]?.player;
    allPlayers.forEach(player => { if (player !== active && (player.state === 'playing' || player.state === 'loading')) player.pause(); });
    active?.play(true);
  });
}
window.addEventListener('scroll', scheduleAutoplay, {passive: true});
window.addEventListener('resize', scheduleAutoplay);
document.addEventListener('visibilitychange', scheduleAutoplay);
reducedMotion.addEventListener('change', scheduleAutoplay);
scheduleAutoplay();
