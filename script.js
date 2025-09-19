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
  'salmon': '焼き鮭',
  'saba': 'さばの塩焼き',
  'sawara': 'さわらの西京焼き',
  'sanma': 'さんま',
  'tonkatsu': 'とんかつ',
  'karaage': 'からあげ',
  'nanban': 'チキン南蛮',
  'pork-ginger': '豚の生姜焼き',
  'nikujaga': '肉じゃが',
  'hamburg': 'ハンバーグ',
  // 副菜
  'sausage': 'ウインナー',
  'gratin': 'エビグラタン',
  'minitomato': 'ミニトマト',
  'meatballs': 'ミートボール',
  'tamagoyaki': 'たまごやき',
  'kinpira': 'きんぴらごぼう',
  'spinach': 'ほうれん草の和え物',
  'potato-salad': 'ポテトサラダ',
  'macaroni': 'マカロニサラダ',
  'pumpkin': 'かぼちゃの煮物',
  'mushroom': 'ピーマンときのこの炒め物',
  'aspara': 'アスパラベーコン'
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
function renderBento(data) {
  const bentoData = data || getSelections();
  console.log('bentoData:', bentoData);
  
  const layout = {
    rice:    { left: '32%', top: '60%', width: '280px' },
    leaf:    { left: '50%', top: '50%', width: '350px' },
    main:    { left: '67%', top: '55%', width: '280px' },
    side1:   { left: '55%', top: '75%', width: '180px' },
    side2:   { left: '80%', top: '70%', width: '180px' },
    side3:   { left: '60%', top: '25%', width: '180px' },
    dessert: { left: '82%', top: '35%', width: '150px' }
  };

  // 例外ルール：特定のおかずのサイズ・位置
  const exceptions = {
    'apple':        { left: '78%', top: '35%', width: '180px' },
    'orange':       { left: '82%', top: '30%', width: '150px' },
    'omanju':       { left: '82%', top: '35%', width: '180px' },
    'halloween':    { left: '82%', top: '40%', width: '200px' },
    'oimo':         { left: '80%', top: '33%', width: '200px' },
    'nikujaga':     { left: '68%', top: '60%', width: '270px'  },
    'hamburg':      { left: '67%', top: '60%', width: '240px'  },
    'karaage':      { left: '67%', top: '55%', width: '250px'  },
    'tonkatsu':     { left: '65%', top: '50%', width: '320px'  },
    'sanma':        { left: '50%', top: '45%', width: '480px'  },
    'pork-ginger':  { left: '67%', top: '60%', width: '240px'  },

  };

  // 食材別サイズ指定（widthだけ上書きする）
  const sizeExceptions = {
    'sausage':  '250px',
    'minitomato':  '250px',
    'kinpira':  '120px',
    'aspara':  '250px',
    'spinach':  '150px'
  };

  const layer = document.getElementById('food-layer');
  if (!layer) return;
  layer.innerHTML = '';

  /**
   * 画像生成ヘルパー
   * @param {string} src 画像パス
   * @param {string} key 食材名（exceptionsキー用）
   * @param {object} defaultPos デフォルト位置
   * @param {string} className クラス名
   */
    const createImg = (src, key, defaultPos, className) => {
      let pos = { ...defaultPos };
      // 位置例外
      if (exceptions[key]) {
        pos = { ...pos, ...exceptions[key] }; // 位置・サイズを上書き
      }

// サイズ例外（widthだけ上書き）
      if (sizeExceptions[key]) {
         pos.width = sizeExceptions[key];
      }

    const img = document.createElement('img');
    img.src = src;
    img.style.position = 'absolute'; // ←絶対位置指定
    img.style.left = pos.left;
    img.style.top = pos.top;
    img.style.width = pos.width;
    img.dataset.key = key; // 食べる用
    img.className = className;
    return img;
  };

  // --- ここから描画 ---
  // side3（奥）
  if (bentoData.side?.[2])
    layer.appendChild(createImg(`images/${bentoData.side[2]}.png`, bentoData.side[2], layout.side3, 'side-back'));

  // dessert
  if (bentoData.dessert)
    layer.appendChild(createImg(`images/${bentoData.dessert}.png`, bentoData.dessert, layout.dessert, 'dessert-back'));

  // rice
  if (bentoData.rice)
    if (bentoData.rice)
  layer.appendChild(createImg(`images/${bentoData.rice}.png`, bentoData.rice, layout.rice, 'rice'));

  // leaf
  layer.appendChild(createImg('images/leaf.png', 'leaf', layout.leaf, 'leaf'));

  // main
  if (bentoData.main)
    layer.appendChild(createImg(`images/${bentoData.main}.png`, bentoData.main, layout.main, 'main'));


  // side1 / side2（手前）
  if (bentoData.side?.[0])
    layer.appendChild(createImg(`images/${bentoData.side[0]}.png`, bentoData.side[0], layout.side1, 'side-front'));

  if (bentoData.side?.[1])
    layer.appendChild(createImg(`images/${bentoData.side[1]}.png`, bentoData.side[1], layout.side2, 'side-front'));

}

// ====================== 食べるボタン ======================
function setupEatButton(bentoData) {
  const eatBtn = document.getElementById('eat-btn');
  const layer = document.getElementById('food-layer');
  if (!eatBtn || !layer || !bentoData) return;

  const eatOrder = [
    bentoData.side?.[0],
    bentoData.side?.[1],
    bentoData.main,
    bentoData.rice,
    bentoData.side?.[2],
    'leaf',
    bentoData.dessert
  ].filter(Boolean); // undefined を除外

  eatBtn.addEventListener('click', () => {
    const imgs = Array.from(layer.querySelectorAll('img'));

    for (let key of eatOrder) {
      const targetImg = imgs.find(img => img.dataset.key === key);
      if (targetImg) {
        targetImg.remove();
        return;
      }
    }

    const messageElement = document.getElementById('bento-message');
    if (messageElement) {
      messageElement.textContent = 'ごちそうさまでした！🍱✨';
    } else {
      alert('ごちそうさまでした！🍱✨');
    }
  });
}

/* ====================== finish.html 用 タイトル & シェア ====================== */
function setupFinishPage(randomMessage, selections) {
  const data = selections || getSelections();
  const mainName = jpName(data.main) || '主菜なし';
  const firstSideName = data.side?.[0] ? jpName(data.side[0]) : '副菜なし';

  // カスタムタイトル or デフォルト
  let bentoTitle = localStorage.getItem('customBentoTitle') || `${mainName}と${firstSideName}お弁当🍱`;
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
        renameContainer.style.display = 'none';
      }
    });
  }

  // Xシェア
  const shareXBtn = document.getElementById('share-x');
  if (shareXBtn) {
    shareXBtn.addEventListener('click', () => {
      // 1. URLパラメータを作成
      const params = new URLSearchParams();
      if (data.rice) params.set('rice', data.rice);
      if (data.main) params.set('main', data.main);
      if (data.side?.length) params.set('side', data.side.join(','));
      if (data.dessert) params.set('dessert', data.dessert);

      // finish.htmlのURLを元に共有URL生成
      const baseURL = `${location.origin}${location.pathname}`;
      const sharePageURL = `${baseURL}?${params.toString()}`;

      const hashtags = 'pickpackおべんとう,お弁当をつくってみよう';
      const text = `今日は「${bentoTitle}」 #${hashtags.replace(/,/g,' #')}`;
      const shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(sharePageURL)}`;

      window.open(shareURL, '_blank');
    });
  }
}

/* ====================== URLパラメータから selections 復元 ====================== */
function getSelectionsFromURL() {
  const params = new URLSearchParams(location.search);
  if (!params.has('main') && !params.has('rice')) return null;

  return {
    rice: params.get('rice'),
    main: params.get('main'),
    side: params.get('side') ? params.get('side').split(',') : [],
    dessert: params.get('dessert')
  };
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
  'ひと口ごとに笑顔が増えますように🌸',
  '今日もおつかれさま🌿',
  '休憩しながらいこう🐢'
];

/* ====================== 初期化 ====================== */
document.addEventListener('DOMContentLoaded', () => {
  let selections = getSelectionsFromURL() || getSelections();

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
    renderBento(selections);
    setupEatButton(selections);
    setupFinishPage(randomMessage, selections); // ←selectionsを渡す
  }
});
