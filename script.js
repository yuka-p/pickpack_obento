let bento = {
  rice: null,
  main: null,
  side: []
};

// 食品選択
function selectFood(category, item) {
  if(category === 'side') {
    if(bento.side.includes(item)) {
      // クリックで解除
      bento.side = bento.side.filter(s => s !== item);
    } else if(bento.side.length < 3) {
      bento.side.push(item);
    } else {
      alert('副菜は最大3つまでです');
    }
  } else {
    bento[category] = item;
  }
  renderBento();
}

// お弁当箱表示
function renderBento() {
  const box = document.getElementById('bento-box');
  box.innerHTML = '';

  if(bento.rice) box.innerHTML += `<div class="food-item">${bento.rice}</div>`;
  if(bento.main) box.innerHTML += `<div class="food-item">${bento.main}</div>`;
  bento.side.forEach(s => {
    box.innerHTML += `<div class="food-item">${s}</div>`;
  });
}

// Xでシェア
document.getElementById('share-btn').onclick = function() {
  const text = `私のお弁当：主食${bento.rice || ''}、主菜${bento.main || ''}、副菜${bento.side.join(', ')}`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};
