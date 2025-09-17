/* ====================== selections の取得・保存 ====================== */
function getSelections() {
  return JSON.parse(localStorage.getItem('selections') || '{"rice":null,"main":null,"side":[],"dessert":null}');
}
function saveSelections(selections) {
  localStorage.setItem('selections', JSON.stringify(selections));
}

/* ====================== 日本語名マップ ====================== */
const names = {
  // 主菜
  'grilled-salmon': '焼き鮭',
  'saba-salt': 'さばの塩焼き',
  'sawara-saikyo': 'さわらの西京焼き',
  'tonkatsu': 'とんかつ',
  'flied-chicken': 'からあげ',
  'chicken-nanban': 'チキン南蛮',
  'pork-ginger': '豚の生姜焼き',
  'nikujaga': '肉じゃが',
  'hamburg': 'ハンバーグ',
  // 副菜
  'macaroni': 'マカロニサラダ',
  'ebigratin': 'エビグラタン',
  'kinpira': 'きんぴらごぼう',
  // デザート・その他
  'apple': 'りんご',
  'orange': 'オレンジ',
  'sanma': 'さんま'
};
function jpName(key) {
  return names[key] || key || '';
}

/* ====================== 選択ページ用 ====================== */
function setupOptionButtons(selections) {
  const riceMessage = document.getElementById('rice-message');
  const mainMessage = document.getElementById('main-message');
  const sideMessage = document.getElementById('side-message');
  const dessertMessage = document.getElementById('dessert-message');

  const optionBtns = document.querySelectorAll('.option-btn');
  optionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      const value = btn.dataset.value;
      const message = btn.dataset.message;

      if (type === 'rice') {
        document.querySelectorAll('[data-type="rice"]').forEach(b => b.classList.remove('selected'));
        selections.rice = value;
        btn.classList.add('selected');
        if (riceMessage) riceMessage.textContent = message;
      }

      else if (type === 'main') {
        document.querySelectorAll('[data-type="main"]').forEach(b => b.classList.remove('selected'));
        selections.main = value;
        btn.classList.add('selected');
        if (mainMessage) mainMessage.textContent = message;
      }

      else if (type === 'side') {
        if (selections.side.includes(value)) {
          selections.side = selections.side.filter(v => v !== value);
          btn.classList.remove('selected');
        } else {
          selections.side.push(value);
          btn.classList.add('selected');
          if (selections.side.length > 3) {
            const removed = selections.side.shift();
            document.querySelector(`[data-type="side"][data-value="${removed}"]`)?.classList.remove('selected');
          }
        }
        if (sideMessage) sideMessage.textContent = selections.side.length > 0 ? message : '';
      }

      else if (type === 'dessert') {
        document.querySelectorAll('[data-type="dessert"]').forEach(b => b.classList.remove('selected'));
        selections.dessert = value;
        btn.classList.add('selected');
        if (dessertMessage) dessertMessage.textContent = message;
      }

      saveSelections(selections);
    });
  });

  const goSide = document.getElementById('go-side');
  if (goSide) {
    goSide.addEventListener('click', () => {
      if (!selections.rice || !selections.main) {
        alert('主食と主菜を選んでください');
        return;
      }
      window.location.href = 'side.html';
    });
    
  }

  const goFinish = document.getElementById('go-finish');
  if (goFinish) {
    goFinish.addEventListener('click', () => {
      if (selections.side.length < 3 || !selections.dessert) {
        alert('副菜3つとデザート1つを選んでください');
        return;
      }
      window.location.href = 'finish.html';
    });
  }

   document.querySelectorAll('.option-btn').forEach(btn => {
    const type = btn.dataset.type;
    const value = btn.dataset.value;

    if (type === 'rice' && selections.rice === value) {
      btn.classList.add('selected');
    }
    if (type === 'main' && selections.main === value) {
      btn.classList.add('selected');
    }
    if (type === 'side' && selections.side.includes(value)) {
      btn.classList.add('selected');
    }
    if (type === 'dessert' && selections.dessert === value) {
      btn.classList.add('selected');
    }
  });
}

const backBtn = document.getElementById('back-btn');
if (backBtn) {
  backBtn.addEventListener('click', () => {
    history.back(); // 1つ前のページに戻る
  });
}

const restartBtn = document.getElementById('restart-btn'); // ←finish.htmlのボタンidに合わせる
if (restartBtn) {
  restartBtn.addEventListener('click', () => {
    // 1. 保存していた選択状態を消す
    localStorage.removeItem('selections');
    // 2. カスタムタイトルも消したい場合はこれも
    localStorage.removeItem('customBentoTitle');
    // 3. 最初のページへ戻る
    window.location.href = 'index.html'; // ←最初のページのファイル名に合わせる
  });
}

/* ====================== finish.html 用 弁当表示 ====================== */
function renderBento() {
  const data = getSelections();

  const layout = {
    rice:    { left: '32%', top: '60%', width: '280px' },
    leaf:    { left: '50%', top: '50%', width: '350px' },
    main:    { left: '65%', top: '55%', width: '300px' },
    side1:   { left: '60%', top: '75%', width: '150px' },
    side2:   { left: '80%', top: '75%', width: '150px' },
    side3:   { left: '60%', top: '25%', width: '150px' },
    dessert: { left: '82%', top: '30%', width: '150px' }
  };

  const layer = document.getElementById('food-layer');
  if (!layer) return;
  layer.innerHTML = '';

  const createImg = (src, pos, className) => {
    const img = document.createElement('img');
    img.src = src;
    img.style.left = pos.left;
    img.style.top = pos.top;
    img.style.width = pos.width;
    img.className = className;
    return img;
  };

  if (data.side?.[2]) layer.appendChild(createImg(`images/${data.side[2]}.png`, layout.side3, 'side-back'));
  if (data.dessert) layer.appendChild(createImg(`images/${data.dessert}.png`, layout.dessert, 'dessert-back'));
  if (data.rice) layer.appendChild(createImg(`images/${data.rice}.png`, layout.rice, 'rice'));
  layer.appendChild(createImg('images/leaf.png', layout.leaf, 'leaf'));
  if (data.main) layer.appendChild(createImg(`images/${data.main}.png`, layout.main, 'main'));
  if (data.side?.[0]) layer.appendChild(createImg(`images/${data.side[0]}.png`, layout.side1, 'side-front'));
  if (data.side?.[1]) layer.appendChild(createImg(`images/${data.side[1]}.png`, layout.side2, 'side-front'));
}

/* ====================== finish.html 用 タイトル & シェア ====================== */
function setupFinishPage(randomMessage) {
  const data = getSelections();
  const mainName = jpName(data.main) || '主菜なし';
  const firstSideName = data.side?.[0] ? jpName(data.side[0]) : '副菜なし';

  // カスタムタイトル or デフォルト
  let bentoTitle = localStorage.getItem('customBentoTitle') || `${mainName}と${firstSideName}のお弁当🍱`;
  const titleElement = document.getElementById('bento-title');
  if (titleElement) titleElement.textContent = bentoTitle;

  // 名前をつけるボタン
  const renameBtn = document.getElementById('rename-btn');
  const renameContainer = document.getElementById('rename-container');
  const customInput = document.getElementById('custom-title-input');
  const updateBtn = document.getElementById('update-title-btn');

  if (renameBtn && renameContainer && customInput && updateBtn) {
    renameBtn.addEventListener('click', () => {
      renameContainer.style.display = 'block';
      customInput.value = bentoTitle;
    });

    updateBtn.addEventListener('click', () => {
      const newTitle = customInput.value.trim();
      if (newTitle) {
        bentoTitle = newTitle;
        if (titleElement) titleElement.textContent = bentoTitle;
        localStorage.setItem('customBentoTitle', bentoTitle);
      }
    });
  }

  // Xシェア
  const shareXBtn = document.getElementById('share-x');
  if (shareXBtn) {
    shareXBtn.addEventListener('click', () => {
      const hashtags = 'pickpackおべんとう,今日の気分,好きなお弁当をつくってみよう';
      const text = `今日は「${bentoTitle}」！\n${randomMessage} #${hashtags.replace(/,/g,' #')}`;
      const shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(location.href)}`;
      window.open(shareURL, '_blank');
    });
  }
}

/* ====================== ランダムメッセージ ====================== */
const messages = [
  '素敵な1日になりますように🌈',
  'あなたに元気を届けます🌸',
  '秋風と一緒にランチタイムを楽しんでね🍂',
  'おいしい時間をどうぞ🍴',
  '今日も笑顔で過ごせますように😊',
  '心もお腹も満たされますように💛',
  'お昼のひととき、ちょっとだけゆったりしてね🍵',
  'お弁当と一緒に秋もひとくちどうぞ🍁',
  '秋色ランチタイムで元気をチャージ⚡',
  'ひと口ごとに笑顔が増えますように🌸',
  'お昼のひととき、にこにこ気分で過ごせますように🌞'
];

/* ====================== 初期化 ====================== */
document.addEventListener('DOMContentLoaded', () => {
  const selections = getSelections();

  // ランダムメッセージ
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const messageElement = document.getElementById('bento-message');
  if (messageElement) messageElement.textContent = randomMessage;

  // 選択ボタンがあるページ
  if (document.querySelector('.option-btn')) {
    setupOptionButtons(selections);
  }

  // finish.html用
  if (document.getElementById('food-layer')) {
    renderBento();
    setupFinishPage(randomMessage);
  }
});
