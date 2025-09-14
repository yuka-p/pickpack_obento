// 選択状態管理
let selections = {
  rice: null,
  main: null,
  side: [],
  dessert: null
};

document.addEventListener('DOMContentLoaded', () => {
  // ボタンがあるページ用
  const optionBtns = document.querySelectorAll('.option-btn');
  optionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      const value = btn.dataset.value;

      if (type === 'side') {
  // 副菜は3つ
  if (selections.side.includes(value)) {
    // 同じものを押したら解除
    selections.side = selections.side.filter(v => v !== value);
    btn.classList.remove('selected');
  } else {
    // 新しいものを追加
    selections.side.push(value);
    btn.classList.add('selected');
    // もし4つ目になったら最初のを削除
    if (selections.side.length > 3) {
      const removed = selections.side.shift(); // 一番古いのを消す
      // そのボタンのselectedも外す
      document.querySelector(`[data-type="side"][data-value="${removed}"]`)
        ?.classList.remove('selected');
    }
  }
} else if (type === 'dessert') {
  // デザートは1つ
  document.querySelectorAll('[data-type="dessert"]').forEach(b => b.classList.remove('selected'));
  selections.dessert = value;
  btn.classList.add('selected');
} else {
  // 主食・主菜
  document.querySelectorAll(`[data-type="${type}"]`).forEach(b => b.classList.remove('selected'));
  selections[type] = value;
  btn.classList.add('selected');
}

      // 保存
      localStorage.setItem('selections', JSON.stringify(selections));
    });
  });

  // ページ遷移ボタン
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
      if (selections.side.length === 0 || !selections.dessert) {
        alert('副菜とデザートを選んでください');
        return;
      }
      window.location.href = 'finish.html';
    });
  }

// finish.html 用に selections を取得
const selections = JSON.parse(localStorage.getItem('selections') || '{"rice":null,"main":null,"side":[],"dessert":null}');

if (document.getElementById('food-layer')) {
  renderBento();
}});

// 弁当表示
function renderBento() {
  const data = JSON.parse(localStorage.getItem('selections') || '{}');

  // ====== サイズ・位置設定オブジェクト ======
  const layout = {
    rice:    { left: '30%', top: '60%', width: '280px' },
    leaf:    { left: '50%', top: '50%', width: '350px' },
    main:    { left: '65%', top: '55%', width: '300px' },
    // 副菜3つ分の座標
    side1:   { left: '60%', top: '75%', width: '150px' }, // 手前1
    side2:   { left: '80%', top: '75%', width: '150px' }, // 手前2
    side3:   { left: '60%', top: '30%', width: '150px' }, // 奥
    dessert: { left: '82%', top: '40%', width: '150px' }
  };
  // ==========================================

  const layer = document.getElementById('food-layer');
  layer.innerHTML = '';

   // ========== 共通の生成関数 ==========
  const createImg = (src, pos, className) => {
    const img = document.createElement('img');
    img.src = src;
    img.style.left = pos.left;
    img.style.top = pos.top;
    img.style.width = pos.width;
    img.className = className; // z-index管理用のクラス
    return img;
  };

  // -------- 奥に置くものから順に append --------

  // ①副菜3つ目（奥）
  if (data.side && data.side[2]) {
    layer.appendChild(createImg(`images/${data.side[2]}.png`, layout.side3, 'side-back'));
  }

  // ②デザート（奥）
  if (data.dessert) {
    layer.appendChild(createImg(`images/${data.dessert}.png`, layout.dessert, 'dessert-back'));
  }

  // ③主食（中央の後ろ寄り）
  if (data.rice) {
    layer.appendChild(createImg(`images/${data.rice}.png`, layout.rice, 'rice'));
  }

  // ④仕切り葉っぱ（中央）
  layer.appendChild(createImg('images/leaf.png', layout.leaf, 'leaf'));

  // ⑤主菜（中央）
  if (data.main) {
    layer.appendChild(createImg(`images/${data.main}.png`, layout.main, 'main'));
  }

  // ⑥副菜1・副菜2（手前）
  if (data.side && data.side[0]) {
    layer.appendChild(createImg(`images/${data.side[0]}.png`, layout.side1, 'side-front'));
  }
  if (data.side && data.side[1]) {
    layer.appendChild(createImg(`images/${data.side[1]}.png`, layout.side2, 'side-front'));
  }
}

document.getElementById('restart-btn').addEventListener('click', () => {
  // 選択をリセット
  const emptySelections = { rice: null, main: null, side: [], dessert: null };
  localStorage.setItem('selections', JSON.stringify(emptySelections));

  // index.html に戻る
  location.href = 'index.html';
});