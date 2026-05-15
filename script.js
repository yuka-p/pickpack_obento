/* ====================== localStorage管理 ====================== */
/* ユーザーの選択内容（主食、主菜、副菜、デザート）をブラウザに保存・取得する */
function getSelections() {
  return JSON.parse(
    localStorage.getItem("selections") ||
      '{"rice":null,"main":null,"side":[],"dessert":null}',
  );
}

function saveSelections(selections) {
  localStorage.setItem("selections", JSON.stringify(selections));
}

/* ====================== ページロード時の処理 ====================== */
/* ページ全体が読み込まれたら、bodyに 'loaded' クラスを付与 */
/* style.css で body.loaded の opacity: 1 により、フェードイン効果が起動 */
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

/* ====================== 日本語名マップ ====================== */
const names = {
  salmon: "焼き鮭",
  saba: "さばの塩焼き",
  sawara: "さわらの西京焼き",
  sanma: "さんま",
  tonkatsu: "とんかつ",
  karaage: "からあげ",
  nanban: "チキン南蛮",
  "pork-ginger": "豚の生姜焼き",
  nikujaga: "肉じゃが",
  hamburg: "ハンバーグ",

  sausage: "ウインナー",
  gratin: "エビグラタン",
  minitomato: "ミニトマト",
  meatballs: "ミートボール",
  tamagoyaki: "たまごやき",
  kinpira: "きんぴらごぼう",
  spinach: "ほうれん草の和え物",
  "potato-salad": "ポテトサラダ",
  macaroni: "マカロニサラダ",
  pumpkin: "かぼちゃの煮物",
  mushroom: "ピーマンときのこの炒め物",
  aspara: "アスパラベーコン",
};

// 食材IDから日本語名を取得する関数
function jpName(key) {
  return names[key] || key || "";
}

/* ====================== 選択ページ用：オプションボタンの処理 ====================== */
/* main.html と side.html で、ユーザーが選択肢ボタンをクリックした時の処理 */
/* 主食・主菜：ラジオボタン的に1つだけ選択（前の選択は解除） */
/* 副菜：チェックボックス的に最大3つまで複数選択可能 */
/* デザート：ラジオボタン的に1つだけ選択 */
function setupOptionButtons(selections) {
  // メッセージ表示エリアを取得
  const riceMessage = document.getElementById("rice-message");
  const mainMessage = document.getElementById("main-message");
  const sideMessage = document.getElementById("side-message");
  const dessertMessage = document.getElementById("dessert-message");

  // 全オプションボタンにクリックリスナーを設定
  const optionBtns = document.querySelectorAll(".option-btn");
  optionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      const value = btn.dataset.value;
      const message = btn.dataset.message;

      // ===== 主食選択：ラジオボタン形式 =====
      if (type === "rice") {
        // 前の選択を全削除
        document
          .querySelectorAll('[data-type="rice"]')
          .forEach((b) => b.classList.remove("selected"));
        selections.rice = value;
        btn.classList.add("selected");
        if (riceMessage) riceMessage.textContent = message;
      }
      // ===== 主菜選択：ラジオボタン形式 =====
      else if (type === "main") {
        document
          .querySelectorAll('[data-type="main"]')
          .forEach((b) => b.classList.remove("selected"));
        selections.main = value;
        btn.classList.add("selected");
        if (mainMessage) mainMessage.textContent = message;
      }
      // ===== 副菜選択：チェックボックス形式（最大3つ） =====
      else if (type === "side") {
        // 既に選択されている場合は解除、されていなければ追加
        if (selections.side.includes(value)) {
          selections.side = selections.side.filter((v) => v !== value);
          btn.classList.remove("selected");
        } else {
          selections.side.push(value);
          btn.classList.add("selected");
          // 4つ以上選択されていたら、最初の選択を自動削除
          if (selections.side.length > 3) {
            const removed = selections.side.shift();
            document
              .querySelector(`[data-type="side"][data-value="${removed}"]`)
              ?.classList.remove("selected");
          }
        }
        // メッセージ更新：選択が1つ以上あれば表示、なければ空にする
        if (sideMessage)
          sideMessage.textContent = selections.side.length > 0 ? message : "";
      }
      // ===== デザート選択：ラジオボタン形式 =====
      else if (type === "dessert") {
        document
          .querySelectorAll('[data-type="dessert"]')
          .forEach((b) => b.classList.remove("selected"));
        selections.dessert = value;
        btn.classList.add("selected");
        if (dessertMessage) dessertMessage.textContent = message;
      }
      // 選択内容を localStorage に保存
      saveSelections(selections);
    });
  });

  // ===== 「副菜・デザート選択へ」ボタン =====
  // 主食と主菜が両方選択されていることを確認してから画面遷移
  const goSide = document.getElementById("go-side");
  if (goSide) {
    goSide.addEventListener("click", () => {
      if (!selections.rice || !selections.main) {
        alert("主食と主菜を選んでください");
        return;
      }
      window.location.href = "side.html";
    });
  }

  // ===== 「完成ページへ」ボタン =====
  // 副菜3つとデザート1つが選択されていることを確認してから画面遷移
  const goFinish = document.getElementById("go-finish");
  if (goFinish) {
    goFinish.addEventListener("click", () => {
      if (selections.side.length < 3 || !selections.dessert) {
        alert("副菜3つとデザート1つを選んでください");
        return;
      }
      window.location.href = "finish.html";
    });
  }

  // ===== ページロード時の選択状態を復元 =====
  // localStorage に保存されている選択内容を読み込んで、ボタンのハイライトを設定
  document.querySelectorAll(".option-btn").forEach((btn) => {
    const type = btn.dataset.type;
    const value = btn.dataset.value;

    if (type === "rice" && selections.rice === value) {
      btn.classList.add("selected");
    }
    if (type === "main" && selections.main === value) {
      btn.classList.add("selected");
    }
    if (type === "side" && selections.side.includes(value)) {
      btn.classList.add("selected");
    }
    if (type === "dessert" && selections.dessert === value) {
      btn.classList.add("selected");
    }
  });
}

/* ====================== 共通ボタン：戻るボタン ====================== */
/* ブラウザの戻るボタンと同じ動作を実行 */
const backBtn = document.getElementById("back-btn");
if (backBtn) {
  backBtn.addEventListener("click", () => {
    history.back();
  });
}

/* ====================== 共通ボタン：もう一度つくるボタン ====================== */
/* 保存されている選択内容とタイトルを全削除して、最初のページに戻る */
const restartBtn = document.getElementById("restart-btn");
if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    localStorage.removeItem("selections");
    localStorage.removeItem("customBentoTitle");
    window.location.href = "index.html";
  });
}

/* ====================== finish.html 用：完成時の落ち葉アニメーション ====================== */
/* finish.html が表示されたときに、画面上から落ち葉が広がるアニメーション演出 */
/* 秋のテーマに合わせた視覚効果 */
function showFallingLeaves() {
  // 3種類の落ち葉画像をランダムに使用
  const leafImages = [
    "images/momiji.png",
    "images/icho.png",
    "images/ochiba.png",
  ];
  // 20枚の落ち葉を生成
  for (let i = 0; i < 20; i++) {
    const leaf = document.createElement("img");
    leaf.src = leafImages[Math.floor(Math.random() * leafImages.length)];
    leaf.className = "falling-leaf";
    leaf.style.position = "fixed";
    leaf.style.top = "50%";
    leaf.style.left = "50%";
    leaf.style.width = 30 + Math.random() * 40 + "px";
    leaf.style.zIndex = 9999;
    leaf.style.pointerEvents = "none";
    document.body.appendChild(leaf);

    // ランダムな飛び散り方向を計算
    const x = (Math.random() - 0.5) * 600;
    const y = (Math.random() - 0.5) * 600;

    // Web Animations API を使用したアニメーション
    leaf.animate(
      [
        {
          transform: `translate(-50%, -50%) scale(0.5)`,
          opacity: 1,
        },
        {
          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${Math.random() * 720}deg) scale(1)`,
          opacity: 0.8,
        },
      ],
      {
        duration: 3000 + Math.random() * 1000,
        easing: "ease-out",
        fill: "forwards",
      },
    );
    // アニメーション終了後、DOM から削除
    setTimeout(() => leaf.remove(), 4000);
  }
}

/* ====================== finish.html 用：弁当画像のレンダリング ====================== */
/* 選択した食材の画像を、弁当箱内の指定位置に配置して表示する */
/* 食材によって位置やサイズを調整する例外設定も管理 */
function renderBento(data) {
  // localStorage または URL パラメータから選択内容を取得
  const bentoData = data || getSelections();
  // ===== デフォルトレイアウト =====
  // 各食材が配置される基本位置とサイズ（弁当箱内の相対位置）

  const layout = {
    rice: {
      left: "32%",
      top: "60%",
      width: "280px",
    },
    leaf: {
      left: "50%",
      top: "50%",
      width: "350px",
    },
    main: {
      left: "67%",
      top: "55%",
      width: "280px",
    },
    side1: {
      left: "55%",
      top: "75%",
      width: "180px",
    },
    side2: {
      left: "80%",
      top: "70%",
      width: "180px",
    },
    side3: {
      left: "60%",
      top: "25%",
      width: "180px",
    },
    dessert: {
      left: "82%",
      top: "35%",
      width: "150px",
    },
  };

  // ===== 例外設定：食材ごとのカスタム位置とサイズ =====
  // 大きな食材や特殊な形状の食材は、別途位置を指定
  const exceptions = {
    onigiri: {
      left: "27%",
      top: "50%",
      width: "430px",
    },
    apple: {
      left: "78%",
      top: "35%",
      width: "180px",
    },
    orange: {
      left: "82%",
      top: "30%",
      width: "150px",
    },
    omanju: {
      left: "82%",
      top: "35%",
      width: "180px",
    },
    halloween: {
      left: "82%",
      top: "40%",
      width: "200px",
    },
    oimo: {
      left: "80%",
      top: "33%",
      width: "200px",
    },
    nikujaga: {
      left: "68%",
      top: "60%",
      width: "270px",
    },
    hamburg: {
      left: "67%",
      top: "60%",
      width: "240px",
    },
    karaage: {
      left: "67%",
      top: "55%",
      width: "250px",
    },
    tonkatsu: {
      left: "65%",
      top: "50%",
      width: "320px",
    },
    sanma: {
      left: "50%",
      top: "45%",
      width: "480px",
    },
    "pork-ginger": {
      left: "67%",
      top: "60%",
      width: "240px",
    },
  };

  // ===== サイズのみの例外設定 =====
  // 位置はデフォルトだが、サイズだけ特殊な食材
  const sizeExceptions = {
    sausage: "210px",
    minitomato: "250px",
    kinpira: "120px",
    aspara: "250px",
    spinach: "150px",
  };

  const layer = document.getElementById("food-layer");
  if (!layer) return;
  layer.innerHTML = "";

  /**
   * 画像生成ヘルパー
   * @param {string} src
   * @param {string} key
   * @param {object} defaultPos
   * @param {string} className
   */
  const createImg = (src, key, defaultPos, className) => {
    let pos = {
      ...defaultPos,
    };
    // 例外設定がある場合、デフォルト位置を上書き
    if (exceptions[key]) {
      pos = {
        ...pos,
        ...exceptions[key],
      };
    }
    // サイズ例外がある場合、サイズを上書き
    if (sizeExceptions[key]) {
      pos.width = sizeExceptions[key];
    }
    // img 要素を生成
    const img = document.createElement("img");
    img.src = src;
    img.style.position = "absolute";
    img.style.left = pos.left;
    img.style.top = pos.top;
    img.style.width = pos.width;
    img.dataset.key = key;
    img.className = className;
    return img;
  };
  /* ===== 描画順序（z-index）を指定 ===== */
  /* 奥から手前への順序で append することで、重ね順を制御 */
  // 奥側の副菜3番目
  if (bentoData.side?.[2])
    layer.appendChild(
      createImg(
        `images/${bentoData.side[2]}.png`,
        bentoData.side[2],
        layout.side3,
        "side-back",
      ),
    );
  // デザート
  if (bentoData.dessert)
    layer.appendChild(
      createImg(
        `images/${bentoData.dessert}.png`,
        bentoData.dessert,
        layout.dessert,
        "dessert-back",
      ),
    );
  // 主食（ご飯）
  if (bentoData.rice)
    layer.appendChild(
      createImg(
        `images/${bentoData.rice}.png`,
        bentoData.rice,
        layout.rice,
        "rice",
      ),
    );
  // 装飾用の葉（中央）
  layer.appendChild(createImg("images/leaf.png", "leaf", layout.leaf, "leaf"));
  // 主菜（メイン）
  if (bentoData.main)
    layer.appendChild(
      createImg(
        `images/${bentoData.main}.png`,
        bentoData.main,
        layout.main,
        "main",
      ),
    );
  // 前側の副菜1番目と2番目
  if (bentoData.side?.[0])
    layer.appendChild(
      createImg(
        `images/${bentoData.side[0]}.png`,
        bentoData.side[0],
        layout.side1,
        "side-front",
      ),
    );

  if (bentoData.side?.[1])
    layer.appendChild(
      createImg(
        `images/${bentoData.side[1]}.png`,
        bentoData.side[1],
        layout.side2,
        "side-front",
      ),
    );
}

/* ====================== finish.html 用：食べるボタンの処理 ====================== */
/* 「ぱくぱくもぐもぐ」ボタンをクリックすると、選択された順番で食材が消えるインタラクション */
/* ユーザーが仮想的に弁当を食べる体験を提供 */
function setupEatButton(bentoData) {
  const eatBtn = document.getElementById("eat-btn");
  const layer = document.getElementById("food-layer");
  if (!eatBtn || !layer || !bentoData) return;

  // ===== 食べる順序を定義 =====
  // 弁当を食べる際の自然な順序（副菜→主菜→主食→デザート）
  const eatOrder = [
    bentoData.side?.[0],
    bentoData.side?.[1],
    bentoData.main,
    bentoData.rice,
    bentoData.side?.[2],
    "leaf",
    bentoData.dessert,
  ].filter(Boolean);

  eatBtn.addEventListener("click", () => {
    // 現在の食材画像リストを取得
    const imgs = Array.from(layer.querySelectorAll("img"));
    // eatOrder に従って、1つずつ食材を削除
    for (let key of eatOrder) {
      const targetImg = imgs.find((img) => img.dataset.key === key);
      if (targetImg) {
        targetImg.remove();
        return;
      }
    }
    // すべての食材が削除されたら、完了メッセージを表示
    const messageElement = document.getElementById("bento-message");
    if (messageElement) {
      messageElement.textContent = "ごちそうさまでした！🍱✨";
    } else {
      alert("ごちそうさまでした！🍱✨");
    }
  });
}

/* ====================== finish.html 用：タイトル・名前変更・シェア機能 ====================== */
/* 弁当に名前をつけたり、SNSでシェアしたりする機能を管理 */
function setupFinishPage(randomMessage, selections, bentoTitle) {
  const data = selections || getSelections();
  const mainName = jpName(data.main) || "主菜なし";
  const firstSideName = data.side?.[0] ? jpName(data.side[0]) : "副菜なし";

  // ===== デフォルトタイトル =====
  // URL パラメータまたは localStorage または 選択食材から自動生成
  let titleToUse =
    bentoTitle ||
    localStorage.getItem("customBentoTitle") ||
    `${mainName}と${firstSideName}弁当🍱`;
  // ===== ページタイトルとヘッダーを設定 =====
  const titleElement = document.getElementById("bento-title");
  if (titleElement) {
    titleElement.textContent = titleToUse;
    document.title = `${titleToUse} | pickpackおべんとう`;
  }

  // ===== 「名前をつけるボタン」の処理 =====
  // クリックすると入力フォームが表示され、カスタムタイトルを設定できる
  const renameBtn = document.getElementById("rename-btn");
  const renameContainer = document.getElementById("rename-container");
  const customInput = document.getElementById("custom-title-input");
  const updateBtn = document.getElementById("update-title-btn");

  if (renameBtn && renameContainer && customInput && updateBtn) {
    // 名前をつけるボタンをクリック → 入力フォームを表示
    renameBtn.addEventListener("click", () => {
      renameContainer.style.display = "block";
      customInput.value = titleToUse;
    });
    // 更新ボタンをクリック → 新しい名前で上書き
    updateBtn.addEventListener("click", () => {
      const newTitle = customInput.value.trim();
      if (newTitle) {
        titleToUse = newTitle;
        bentoTitle = newTitle;
        if (titleElement) titleElement.textContent = titleToUse;
        document.title = `${titleToUse} | pickpackおべんとう`;
        localStorage.setItem("customBentoTitle", titleToUse);
        renameContainer.style.display = "none";
      }
    });
  }

  // ===== 「Xでシェアする」ボタン =====
  // 現在の弁当の選択内容と名前を含む URL を生成し、Twitter (X) で共有
  const shareXBtn = document.getElementById("share-x");
  if (shareXBtn) {
    shareXBtn.addEventListener("click", () => {
      // 選択内容を URL パラメータに変換
      const params = new URLSearchParams();
      if (data.rice) params.set("rice", data.rice);
      if (data.main) params.set("main", data.main);
      if (data.side?.length) params.set("side", data.side.join(","));
      if (data.dessert) params.set("dessert", data.dessert);

      if (bentoTitle) params.set("title", bentoTitle);

      // 共有用 URL を生成
      const baseURL = `${location.origin}${location.pathname}`;
      const sharePageURL = `${baseURL}?${params.toString()}`;
      // X （Twitter）の共有 URL を生成
      const hashtags = "pickpackおべんとう,お弁当をつくってみよう";
      const text = `今日は「${titleToUse}」 #${hashtags.replace(/,/g, " #")}`;
      const shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(sharePageURL)}`;
      // X の共有画面を新しいウィンドウで開く
      window.open(shareURL, "_blank");
    });
  }
}
/* ====================== URL パラメータから選択内容を復元 ====================== */
/* SNS からのリンク経由で開かれた場合、URL に含まれた選択内容を読み込む */
/* 例：?rice=onigiri&main=salmon&side=sausage,tamagoyaki&dessert=apple&title=カスタム弁当 */
function getSelectionsFromURL() {
  const params = new URLSearchParams(location.search);
  // main または rice のパラメータがない場合は、選択内容がないので null を返す
  if (!params.has("main") && !params.has("rice")) return null;

  return {
    rice: params.get("rice"),
    main: params.get("main"),
    side: params.get("side") ? params.get("side").split(",") : [],
    dessert: params.get("dessert"),
  };
}

/* ====================== ランダムメッセージ ====================== */
const messages = [
  "素敵な1日になりますように🌈",
  "あなたに元気を届けます🌸",
  "秋風と一緒にランチタイムを楽しんでね🍂",
  "おいしい時間をどうぞ🍴",
  "今日も笑顔で過ごせますように😊",
  "心もお腹も満たされますように💛",
  "お昼のひととき、ちょっとだけゆったりしてね🍵",
  "お弁当と一緒に秋もひとくちどうぞ🍁",
  "ひと口ごとに笑顔が増えますように🌸",
  "今日もおつかれさま🌿",
  "休憩することも大事だよ🐢",
];

/* ====================== ページロード時の初期化処理 ====================== */
/* ページが読み込まれたときに実行される全体的な初期化 */
/* どのページが開かれたかによって、実行される処理が変わる */

document.addEventListener("DOMContentLoaded", () => {
  // ===== 選択内容の取得 =====
  // URL パラメータから復元 OR localStorage から取得
  let selections = getSelectionsFromURL() || getSelections();

  // ===== URL パラメータからタイトル情報を取得 =====
  const params = new URLSearchParams(window.location.search);
  const titleParam = params.get("title");

  // ===== タイトルの決定ロジック =====
  // 優先度：URL のタイトルパラメータ > localStorage の保存タイトル > 自動生成タイトル
  const mainName = jpName(selections.main) || "主菜なし";
  const firstSideName = selections.side?.[0]
    ? jpName(selections.side[0])
    : "副菜なし";
  const defaultTitle = `${mainName}と${firstSideName}お弁当🍱`;

  const storedTitle = localStorage.getItem("customBentoTitle");

  let bentoTitle =
    titleParam && titleParam.trim() !== ""
      ? titleParam
      : storedTitle && storedTitle.trim() !== ""
        ? storedTitle
        : defaultTitle;

  // ===== ページタイトルとヘッダーを設定 =====
  // finish.html で弁当のタイトルを表示するため
  const titleElem = document.getElementById("bento-title");
  if (titleElem) {
    titleElem.textContent = bentoTitle;
    document.title = `${bentoTitle} | pickpackおべんとう`;
  }

  // ===== ランダムメッセージを表示 =====
  // finish.html で励ましメッセージを表示するため
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const messageElement = document.getElementById("bento-message");
  if (messageElement) messageElement.textContent = randomMessage;
  // ===== main.html と side.html のイベント設定 =====
  // オプションボタンが存在するページ（選択ページ）での処理を初期化
  if (document.querySelector(".option-btn")) {
    setupOptionButtons(selections);
  }

  // ===== finish.html の完成画面を初期化 =====
  // 弁当画像のレンダリング、食べるボタン、シェア機能をセットアップ
  if (document.getElementById("food-layer")) {
    renderBento(selections);
    setupEatButton(selections);
    setupFinishPage(randomMessage, selections, bentoTitle);
    showFallingLeaves();
  }
});
