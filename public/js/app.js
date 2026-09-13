(function () {
  const searchInput = document.getElementById('search');
  const searchBtn = document.getElementById('search-btn');
  const resultsEl = document.getElementById('results');
  const placeholder = document.getElementById('placeholder');
  const statusEl = document.getElementById('status');
  const detailEl = document.getElementById('detail');
  const detailAvatar = document.getElementById('detail-avatar');
  const detailName = document.getElementById('detail-name');
  const detailDisplay = document.getElementById('detail-display');
  const detailId = document.getElementById('detail-id');
  const detailDesc = document.getElementById('detail-desc');
  const danceBtn = document.getElementById('dance-btn');

  const audio1 = document.getElementById('audio1');
  const audio2 = document.getElementById('audio2');
  const music1Btn = document.getElementById('music1');
  const music2Btn = document.getElementById('music2');

  let currentId = null;
  let activeAudio = null;

  function setStatus(text) {
    statusEl.textContent = text;
  }

  async function search() {
    const q = searchInput.value.trim();
    if (q.length < 2) {
      setStatus('Минимум 2 символа');
      return;
    }

    searchBtn.disabled = true;
    setStatus('Поиск...');
    resultsEl.innerHTML = '';
    detailEl.hidden = true;
    currentId = null;

    try {
      const res = await fetch('/api/search?q=' + encodeURIComponent(q));
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Ошибка API');
      }

      const users = json.data || [];
      if (users.length === 0) {
        resultsEl.innerHTML = '<div class="placeholder">Никого не найдено</div>';
        setStatus('0 результатов');
        return;
      }

      setStatus(users.length + ' найдено');
      users.forEach(u => {
        const row = document.createElement('div');
        row.className = 'player-row';
        row.dataset.id = u.id;

        const img = document.createElement('img');
        img.src = '/api/avatar/' + u.id;
        img.alt = '';
        img.loading = 'lazy';
        img.onerror = () => { img.style.opacity = '0.3'; };

        const info = document.createElement('div');
        info.className = 'player-info';
        info.innerHTML =
          '<div class="player-name">' + escapeHtml(u.name) + '</div>' +
          '<div class="player-display">' + escapeHtml(u.displayName) + '</div>' +
          '<div class="player-id">ID ' + u.id + '</div>';

        row.appendChild(img);
        row.appendChild(info);
        row.addEventListener('click', () => selectUser(u, row));
        resultsEl.appendChild(row);
      });
    } catch (err) {
      resultsEl.innerHTML = '<div class="placeholder">Ошибка: ' + escapeHtml(err.message) + '</div>';
      setStatus('Ошибка');
    } finally {
      searchBtn.disabled = false;
    }
  }

  async function selectUser(user, rowEl) {
    document.querySelectorAll('.player-row').forEach(r => r.classList.remove('active'));
    if (rowEl) rowEl.classList.add('active');

    currentId = user.id;
    detailEl.hidden = false;
    detailAvatar.src = '/api/avatar/' + user.id;
    detailName.textContent = user.name;
    detailDisplay.textContent = user.displayName !== user.name ? user.displayName : '';
    detailId.textContent = 'ID ' + user.id;
    detailDesc.textContent = 'Загрузка...';

    try {
      const res = await fetch('/api/user/' + user.id);
      if (res.ok) {
        const data = await res.json();
        detailDesc.textContent = data.description || 'Нет описания';
      } else {
        detailDesc.textContent = '';
      }
    } catch {
      detailDesc.textContent = '';
    }

    // reset dance state visual
    danceBtn.classList.remove('active');
    danceBtn.textContent = 'Танец';
    if (window.FroblokDance) window.FroblokDance.stop();
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // events
  searchBtn.addEventListener('click', search);
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') search();
  });

  danceBtn.addEventListener('click', () => {
    if (!window.FroblokDance) return;
    const active = window.FroblokDance.toggle();
    danceBtn.classList.toggle('active', active);
    danceBtn.textContent = active ? 'Стоп' : 'Танец';
  });

  // music
  function stopAllMusic() {
    [audio1, audio2].forEach(a => {
      a.pause();
      a.currentTime = 0;
    });
    music1Btn.classList.remove('playing');
    music2Btn.classList.remove('playing');
    activeAudio = null;
  }

  function toggleMusic(audio, btn) {
    if (activeAudio === audio && !audio.paused) {
      stopAllMusic();
      return;
    }
    stopAllMusic();
    audio.volume = 0.6;
    audio.play().then(() => {
      activeAudio = audio;
      btn.classList.add('playing');
    }).catch(() => {
      alert('Положи mp3 в public/assets/\nmusic1.mp3 = Oh My Little Baby Boy\nmusic2.mp3 = type london (ONDA ANDAR)');
    });
  }

  music1Btn.addEventListener('click', () => toggleMusic(audio1, music1Btn));
  music2Btn.addEventListener('click', () => toggleMusic(audio2, music2Btn));
})();
