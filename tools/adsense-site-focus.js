const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function write(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
}

function replaceOrThrow(source, search, replace, label) {
  const next = source.replace(search, replace);
  if (next === source) {
    throw new Error(`Patch failed: ${label}`);
  }
  return next;
}

function addNoindex(rel) {
  let html = read(rel);
  if (html.includes('name="robots"')) return;
  html = replaceOrThrow(
    html,
    /<meta name="viewport" content="width=device-width, initial-scale=1\.0">/,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="robots" content="noindex,follow">`,
    `${rel} noindex insert`
  );
  write(rel, html);
}

function createGuidePage({ title, description, slug, category, updated, intro, sections, related }) {
  const canonical = `https://calc.ssoxxl.com/guides/${slug}/`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    inLanguage: 'ko-KR',
    author: {
      '@type': 'Organization',
      name: '怨꾩궛??,
    },
    publisher: {
      '@type': 'Organization',
      name: '怨꾩궛??,
    },
    dateModified: updated,
    mainEntityOfPage: canonical,
  };

  const sectionHtml = sections
    .map(
      (section) => `
      <section class="article-section">
        <h2>${section.heading}</h2>
        ${section.body.map((p) => `<p>${p}</p>`).join('\n        ')}
        ${section.list ? `<ul>${section.list.map((item) => `<li>${item}</li>`).join('')}</ul>` : ''}
      </section>`
    )
    .join('\n');

  const relatedHtml = related
    .map((item) => `<a href="${item.href}" class="link-card">${item.label}</a>`)
    .join('\n        ');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8390635644947402" crossorigin="anonymous"></script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} | 怨꾩궛??媛?대뱶</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="怨꾩궛??>
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="https://calc.ssoxxl.com/og-image.svg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="https://calc.ssoxxl.com/og-image.svg">
<meta name="daumoa-verification" content="52638bd43577858cdf80a388c3bf173be6b9be4914b8bde1a3b347cf6786f5b4:Xj5dg0WfAX454QfLeg8nBA==">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="shortcut icon" href="/favicon.svg">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script>
(function(){
  var s=localStorage.getItem('gyesanwang_theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
  document.documentElement.setAttribute('data-theme',s);
})();
</script>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet">
<style>
:root{--bg:#f7f6f2;--surface:#fff;--surface2:#f0efe9;--border:#e2e0d8;--text:#1a1a18;--muted:#6e6d66;--accent:#2563eb;--accent-light:#eff6ff;}
[data-theme="dark"]{--bg:#0f0f14;--surface:#1a1a24;--surface2:#222230;--border:rgba(255,255,255,0.08);--text:#e8e8f0;--muted:#8b8ba0;--accent-light:rgba(37,99,235,0.15);}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--bg);color:var(--text);font-family:'Noto Sans KR',sans-serif;transition:background .3s,color .3s;}
header{background:var(--surface);border-bottom:2px solid var(--border);padding:0 24px;height:56px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:100;}
.logo{font-size:18px;font-weight:900;letter-spacing:-1px;display:flex;align-items:center;gap:6px;text-decoration:none;color:var(--text);}
.logo-badge{background:#0a0a0f;color:#FFD700;font-size:11px;font-weight:700;padding:2px 7px;border-radius:4px;border:1px solid #D4A017;font-family:'Courier New',monospace;}
.back-btn{margin-left:auto;padding:6px 14px;border-radius:6px;border:1px solid var(--border);background:transparent;color:var(--muted);font-family:inherit;font-size:13px;text-decoration:none;}
.wrap{max-width:860px;margin:0 auto;padding:36px 24px 64px;}
.crumb{font-size:12px;color:var(--muted);margin-bottom:14px;}
.crumb a{color:inherit;text-decoration:none;}
.hero{background:var(--surface);border:1.5px solid var(--border);border-radius:16px;padding:28px 28px 24px;margin-bottom:20px;}
.hero-tag{display:inline-block;padding:5px 10px;border-radius:999px;background:var(--accent-light);color:var(--accent);font-size:11px;font-weight:700;margin-bottom:10px;}
.hero h1{font-size:30px;line-height:1.3;letter-spacing:-1px;margin-bottom:10px;}
.hero p{font-size:15px;line-height:1.8;color:var(--muted);}
.hero-meta{display:flex;gap:12px;flex-wrap:wrap;margin-top:16px;font-size:12px;color:var(--muted);}
.article-card{background:var(--surface);border:1.5px solid var(--border);border-radius:16px;padding:28px;}
.article-card p{font-size:15px;line-height:1.9;color:var(--text);margin-bottom:14px;}
.article-section{margin-top:26px;}
.article-section h2{font-size:20px;letter-spacing:-.4px;margin-bottom:12px;}
.article-section ul{padding-left:20px;margin:0 0 10px;}
.article-section li{font-size:14px;line-height:1.9;color:var(--muted);margin-bottom:6px;}
.note-box{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:18px;margin:18px 0;}
.note-box strong{display:block;margin-bottom:8px;font-size:13px;}
.note-box p{font-size:13px;color:var(--muted);margin:0;line-height:1.8;}
.link-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:12px;}
.link-card{display:block;padding:14px 16px;border:1.5px solid var(--border);border-radius:12px;background:var(--surface2);text-decoration:none;color:var(--text);font-size:14px;font-weight:700;}
.link-card:hover{border-color:var(--accent);}
footer{background:#1a1a18;color:rgba(255,255,255,.5);text-align:center;padding:24px;font-size:12px;margin-top:40px;}
footer strong{color:#fff;}
@media(max-width:640px){
  .wrap{padding:20px 14px 48px;}
  .hero,.article-card{padding:20px 18px;}
  .hero h1{font-size:24px;}
  .link-grid{grid-template-columns:1fr;}
}
</style>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-49J8CVJW33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-49J8CVJW33');
</script>
</head>
<body>
<header>
  <a href="../../" class="logo"><span>怨꾩궛??/span><span class="logo-badge">??/span></a>
  <a href="../" class="back-btn">??媛?대뱶 紐⑥븘蹂닿린</a>
</header>
<div class="wrap">
  <div class="crumb"><a href="../../">??/a> / <a href="../">媛?대뱶</a> / ${category}</div>
  <div class="hero">
    <span class="hero-tag">${category}</span>
    <h1>${title}</h1>
    <p>${intro}</p>
    <div class="hero-meta">
      <span>理쒖쥌 ?낅뜲?댄듃 ${updated}</span>
      <span>?댁쁺 湲곗?: 怨꾩궛???몄쭛?</span>
      <span>寃??異? 吏곸옣??쨌 ?멸툑 쨌 蹂댄뿕 쨌 ?앺솢湲덉쑖</span>
    </div>
  </div>
  <article class="article-card">
    ${sectionHtml}
    <div class="note-box">
      <strong>怨꾩궛???덈궡</strong>
      <p>??媛?대뱶???쇰컲?곸씤 ?쒕룄 湲곗?怨??ㅻТ?먯꽌 ?먯＜ ?룰컝由щ뒗 ?ъ씤?몃? ?뺣━??李멸퀬 ?먮즺?덉슂. ?ㅼ젣 吏湲됱븸怨??몄븸? ?뚯궗 洹쒖젙, ?좉퀬 ?먮즺, 鍮꾧낵????ぉ, 怨좎슜 ?뺥깭???곕씪 ?щ씪吏????덉쑝??理쒖쥌 ?먮떒 ?꾩뿉???대떦 湲곌? 怨듭???湲됱뿬紐낆꽭?쒕? ?④퍡 ?뺤씤??二쇱꽭??</p>
    </div>
    <section class="article-section">
      <h2>?④퍡 蹂대㈃ 醫뗭? 怨꾩궛湲곗? 媛?대뱶</h2>
      <div class="link-grid">
        ${relatedHtml}
      </div>
    </section>
  </article>
</div>
<footer>
  <strong>怨꾩궛??/strong> ??怨꾩궛湲곕쭔 紐⑥? ?ъ씠?멸? ?꾨땲?? ?ㅼ젣 ?먮떒???꾩????섎뒗 ?댁꽕源뚯? ?④퍡 ?뺣━?⑸땲??
</footer>
</body>
</html>`;
}

function patchIndex() {
  let html = read('index.html');

  html = replaceOrThrow(
    html,
    /<title>[\s\S]*?<\/title>/,
    '<title>怨꾩궛????吏곸옣??湲됱뿬쨌?멸툑쨌蹂댄뿕 怨꾩궛湲곗? ?댁꽕 媛?대뱶</title>',
    'index title'
  );
  html = replaceOrThrow(
    html,
    /<meta name="description" content="[^"]*">/,
    '<meta name="description" content="?곕큺 ?ㅼ닔?뱀븸, ?댁쭅湲? ?ㅼ뾽湲됱뿬, ?곗감, 嫄닿컯蹂댄뿕猷? ?곕쭚?뺤궛, ?異쒖씠?먭퉴吏. 吏곸옣??湲됱뿬쨌?멸툑쨌蹂댄뿕 怨꾩궛湲곗? ?ㅻТ 媛?대뱶瑜??쒓납?먯꽌 ?뺤씤?섏꽭??">',
    'index description'
  );
  html = replaceOrThrow(
    html,
    /<meta property="og:title" content="[^"]*">/,
    '<meta property="og:title" content="怨꾩궛????吏곸옣??湲됱뿬쨌?멸툑쨌蹂댄뿕 怨꾩궛湲곗? ?댁꽕 媛?대뱶">',
    'index og title'
  );
  html = replaceOrThrow(
    html,
    /<meta property="og:description" content="[^"]*">/,
    '<meta property="og:description" content="怨꾩궛湲곕쭔 ?섏뿴?섏? ?딄퀬, 湲됱뿬쨌?멸툑쨌蹂댄뿕 ?먮떒???꾩슂???댁꽕 媛?대뱶源뚯? ?④퍡 ?쒓났?⑸땲??">',
    'index og desc'
  );
  html = replaceOrThrow(
    html,
    /<meta name="twitter:title" content="[^"]*">/,
    '<meta name="twitter:title" content="怨꾩궛????吏곸옣??湲됱뿬쨌?멸툑쨌蹂댄뿕 怨꾩궛湲곗? ?댁꽕 媛?대뱶">',
    'index twitter title'
  );
  html = replaceOrThrow(
    html,
    /<meta name="twitter:description" content="[^"]*">/,
    '<meta name="twitter:description" content="?곕큺, ?댁쭅湲? ?ㅼ뾽湲됱뿬, ?곗감, 嫄닿컯蹂댄뿕猷? ?異쒖씠??怨꾩궛湲곗? ?④퍡 ?쎈뒗 ?ㅻТ 媛?대뱶瑜??뺤씤?섏꽭??">',
    'index twitter desc'
  );

  html = replaceOrThrow(
    html,
    /<\/section>\s*<div class="calc-grid" id="calcGrid">/,
    `</section>

<section class="content-shell">
  <div class="focus-note">
    <div class="focus-lead">吏곸옣??쨌 ?멸툑 쨌 蹂댄뿕 以묒떖</div>
    <h2>怨꾩궛 寃곌낵留?蹂댁뿬二쇱? ?딄퀬, ???대윴 ?レ옄媛 ?섏삤?붿???媛숈씠 ?ㅻ챸?댁슂.</h2>
    <p>怨꾩궛?뺤? ?곕큺 ?ㅼ닔?뱀븸, ?댁쭅湲? ?ㅼ뾽湲됱뿬, ?곗감, 嫄닿컯蹂댄뿕猷? ?곕쭚?뺤궛泥섎읆 吏곸옣?몄씠 ?먯＜ 李얜뒗 怨꾩궛??以묒떖?쇰줈 ?댁쁺?⑸땲?? 媛?怨꾩궛湲??꾨옒?먮뒗 ?ㅼ젣 ?щ?? 怨꾩궛 湲곗????뺣━?덇퀬, 蹂꾨룄 媛?대뱶 臾몄꽌?먯꽌???뚯궗蹂꾨줈 寃곌낵媛 ?щ씪吏???댁쑀, ?ㅻТ?먯꽌 ?룰컝由щ뒗 ?ъ씤?? 怨듭떇 湲곗????④퍡 ?ㅻ챸?⑸땲??</p>
  </div>
  <div class="guide-strip">
    <div class="guide-strip-head">
      <div>
        <div class="focus-lead">?댁꽕 媛?대뱶</div>
        <h2>愿묎퀬瑜?遺숈씠湲??꾪븳 ?뉗? 臾멸뎄 ??? ?ㅼ젣 ?먮떒???꾩슂??湲???곕줈 ?뺣━?덉뒿?덈떎.</h2>
      </div>
      <a href="guides/" class="guide-more">媛?대뱶 ?꾩껜 蹂닿린</a>
    </div>
    <div class="guide-grid">
      <a href="guides/salary-negotiation/" class="guide-card">
        <span class="guide-tag">湲됱뿬</span>
        <strong>?곕큺 ?묒긽?????몄쟾蹂대떎 ?ㅼ닔?뱀븸??癒쇱? 遊먯빞 ?섎뒗 ?댁쑀</strong>
        <span>鍮꾧낵???앸?, 媛議??? 怨듭젣 李⑥씠源뚯? ?④퍡 ?쎈뒗 湲곕낯 媛?대뱶</span>
      </a>
      <a href="guides/severance-average-wage/" class="guide-card">
        <span class="guide-tag">?댁쭅湲?/span>
        <strong>?댁쭅湲?怨꾩궛?먯꽌 ?됯퇏?꾧툑???ы븿?섎뒗 ??ぉ? 臾댁뾿?멸???</strong>
        <span>?곸뿬湲? ?곗감?섎떦, ?듭긽?꾧툑 鍮꾧탳媛 ??以묒슂?쒖? ?뺣━?덉뒿?덈떎.</span>
      </a>
      <a href="guides/unemployment-eligibility/" class="guide-card">
        <span class="guide-tag">?ㅼ뾽湲됱뿬</span>
        <strong>?먯쭊?댁궗?몃뜲???ㅼ뾽湲됱뿬瑜?諛쏆쓣 ???덈뒗 ?덉쇅媛 ?덈굹??</strong>
        <span>?섍툒 議곌굔怨??댁궗 ???뺤씤???쒕쪟瑜?以묒떖?쇰줈 ?뺣━?덉뒿?덈떎.</span>
      </a>
      <a href="guides/annual-leave-rules/" class="guide-card">
        <span class="guide-tag">?곗감</span>
        <strong>?낆궗 泥ロ빐 ?곗감? ?뚭퀎?곕룄 湲곗? ?곗감???대뼸寃??ㅻⅨ媛??</strong>
        <span>?붿감, 1??李??곗감, ?섎떦 ?뺤궛源뚯? ?ㅼ젣 ?뚯궗?먯꽌 ?먯＜ 瑗ъ씠??遺遺꾩쓣 ?ㅻ９?덈떎.</span>
      </a>
      <a href="guides/health-insurance-paycheck/" class="guide-card">
        <span class="guide-tag">蹂댄뿕</span>
        <strong>嫄닿컯蹂댄뿕猷뚭? ?ㅻⅤ硫??ㅼ닔?뱀븸? ?쇰쭏??以꾩뼱?쒕굹??</strong>
        <span>湲됱뿬紐낆꽭?쒕? 蹂???媛숈씠 ?뺤씤?댁빞 ??怨듭젣 援ъ“瑜??ㅻ챸?⑸땲??</span>
      </a>
      <a href="guides/loan-repayment-methods/" class="guide-card">
        <span class="guide-tag">?異?/span>
        <strong>?먮━湲덇퇏?? ?먭툑洹좊벑, 留뚭린?쇱떆?곹솚? ?대뼸寃??ㅻ?源뚯슂?</strong>
        <span>湲덈━蹂대떎 ???곹솚 援ъ“瑜?癒쇱? 遊먯빞 ?섎뒗 ?댁쑀瑜??щ?? ?④퍡 ?뺣━?덉뒿?덈떎.</span>
      </a>
    </div>
  </div>
</section>

<div class="calc-grid" id="calcGrid">`,
    'index insert focus section'
  );

  html = replaceOrThrow(
    html,
    /<section class="hero">[\s\S]*?<\/section>/,
    `<section class="hero">
  <h1>吏곸옣????怨꾩궛? <span class="end">怨꾩궛??/span>?먯꽌 ??/h1>
  <p class="subcopy">?곕큺, ?댁쭅湲? ?ㅼ뾽湲됱뿬, ?곗감, 嫄닿컯蹂댄뿕猷? ?곕쭚?뺤궛泥섎읆 ?ㅼ젣 ?앺솢??諛붾줈 ?용뒗 怨꾩궛湲곗? ?댁꽕 媛?대뱶瑜??④퍡 ?쒓났?⑸땲??</p>
  <div class="popular-tags">
    <span class="popular-label">留롮씠 李얜뒗 怨꾩궛:</span>
    <a class="popular-tag" href="salary/">?곕큺 ?ㅼ닔?뱀븸</a>
    <a class="popular-tag" href="retire/">?댁쭅湲?/a>
    <a class="popular-tag" href="unemploy/">?ㅼ뾽湲됱뿬</a>
    <a class="popular-tag" href="annual-leave/">?곗감</a>
    <a class="popular-tag" href="health-insurance/">嫄닿컯蹂댄뿕猷?/a>
    <a class="popular-tag" href="guides/"><span class="tag-dot"></span> ?댁꽕 媛?대뱶</a>
  </div>
  <div class="search-bar">
    <input type="text" id="searchInput" placeholder="怨꾩궛湲?寃??.. (?? ?댁쭅湲? ?곕큺, 嫄닿컯蹂댄뿕猷?" oninput="searchCalc()">
    <button>寃??/button>
  </div>
</section>`,
    'index hero rewrite'
  );

  html = replaceOrThrow(
    html,
    `.scroll-top:hover{transform:translateY(-2px) !important;}`,
    `.scroll-top:hover{transform:translateY(-2px) !important;}
.content-shell{max-width:900px;margin:0 auto;padding:0 24px 28px;}
.focus-note,.guide-strip{background:var(--surface);border:1.5px solid var(--border);border-radius:14px;padding:24px;margin-bottom:16px;}
.focus-note h2,.guide-strip-head h2{font-size:24px;line-height:1.4;letter-spacing:-.8px;margin-bottom:10px;}
.focus-note p{font-size:14px;line-height:1.9;color:var(--muted);}
.focus-lead{font-size:11px;font-weight:800;color:var(--accent);letter-spacing:.6px;text-transform:uppercase;margin-bottom:8px;}
.guide-strip-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-end;margin-bottom:18px;}
.guide-more{display:inline-flex;align-items:center;justify-content:center;padding:9px 14px;border-radius:10px;border:1.5px solid var(--border);background:var(--surface2);color:var(--text);text-decoration:none;font-size:13px;font-weight:700;white-space:nowrap;}
.guide-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
.guide-card{display:block;padding:18px;border:1.5px solid var(--border);border-radius:12px;background:var(--surface2);text-decoration:none;color:var(--text);transition:all .2s;}
.guide-card:hover{border-color:var(--accent);transform:translateY(-2px);}
.guide-tag{display:inline-block;padding:4px 8px;border-radius:999px;background:var(--accent-light);color:var(--accent);font-size:11px;font-weight:700;margin-bottom:8px;}
.guide-card strong{display:block;font-size:15px;line-height:1.6;margin-bottom:6px;}
.guide-card span:last-child{display:block;font-size:12px;color:var(--muted);line-height:1.7;}`,
    'index css insert'
  );

  html = replaceOrThrow(
    html,
    `@media(max-width:600px){
  .calc-grid{grid-template-columns:1fr;padding:0 16px 80px;}
  nav .nav-btn{display:none;}
  .hero{padding:32px 16px 24px;}
  .logo-sub{display:none;}
}`,
    `@media(max-width:600px){
  .calc-grid{grid-template-columns:1fr;padding:0 16px 80px;}
  .content-shell{padding:0 16px 24px;}
  .guide-grid{grid-template-columns:1fr;}
  .guide-strip-head{display:block;}
  .guide-strip-head h2,.focus-note h2{font-size:20px;}
  .guide-more{margin-top:10px;}
  nav .nav-btn{display:none;}
  .hero{padding:32px 16px 24px;}
  .logo-sub{display:none;}
}`,
    'index media query update'
  );

  const removableCards = [
    'coffee-savings/',
    'youtube/',
    'bmi/',
    'bmr/',
    'dday/',
    'ovulation/',
    'lotto/',
  ];
  for (const href of removableCards) {
    const pattern = new RegExp(`<a href="${href}"[\\s\\S]*?<\\/a>\\s*`, 'g');
    html = html.replace(pattern, '');
  }

  write('index.html', html);
}

function patchAbout() {
  let html = read('about/index.html');
  html = replaceOrThrow(
    html,
    /<meta name="description" content="[^"]*">/,
    '<meta name="description" content="怨꾩궛?뺤? 吏곸옣??湲됱뿬쨌?멸툑쨌蹂댄뿕쨌?앺솢湲덉쑖 怨꾩궛怨??댁꽕 媛?대뱶瑜??④퍡 ?쒓났?섎뒗 ?뺣낫 ?ъ씠?몄엯?덈떎.">',
    'about description'
  );
  html = replaceOrThrow(
    html,
    /<meta property="og:description" content="[^"]*">/,
    '<meta property="og:description" content="吏곸옣??湲됱뿬쨌?멸툑쨌蹂댄뿕쨌?앺솢湲덉쑖 怨꾩궛怨??댁꽕 媛?대뱶瑜??④퍡 ?쒓났?섎뒗 ?뺣낫 ?ъ씠??">',
    'about og description'
  );
  html = replaceOrThrow(
    html,
    /<p>??쒕?援?吏곸옣?멸낵 ?ы뀒?ъ”???꾪븳<br>臾대즺 ?⑤씪??怨꾩궛湲?紐⑥쓬 ?ъ씠?몄엯?덈떎\.<\/p>/,
    '<p>吏곸옣??湲됱뿬쨌?멸툑쨌蹂댄뿕쨌?앺솢湲덉쑖 怨꾩궛怨?br>?ㅼ젣 ?먮떒???꾩슂???댁꽕 媛?대뱶瑜??④퍡 ?댁쁺?⑸땲??</p>',
    'about hero text'
  );

  if (!html.includes('怨꾩궛 湲곗?怨??몄쭛 ?먯튃')) {
    html = replaceOrThrow(
      html,
      /<div class="section">\s*<h2>?뱛 ?쒓났 怨꾩궛湲?移댄뀒怨좊━<\/h2>[\s\S]*?<\/div>/,
      `$&

  <div class="section">
    <h2>?㎛ 怨꾩궛 湲곗?怨??몄쭛 ?먯튃</h2>
    <p>怨꾩궛?뺤? 怨꾩궛湲??섎? ?섎━??寃껊낫?? ?ㅼ젣濡?留롮씠 ?곕뒗 怨꾩궛???뺥솗??湲곗?怨??④퍡 ?뺣━?섎뒗 諛⑺뼢???곗꽑?⑸땲?? ?곕큺, ?댁쭅湲? ?ㅼ뾽湲됱뿬, ?곗감, 嫄닿컯蹂댄뿕猷? ?곕쭚?뺤궛, ?異쒖씠?먯쿂??吏곸옣?몄쓽 ?꾧툑?먮쫫怨?諛붾줈 ?곌껐?섎뒗 二쇱젣瑜??듭떖 異뺤쑝濡??쇨퀬 ?덉뒿?덈떎.</p>
    <p>湲됱뿬쨌?멸툑쨌蹂댄뿕 愿??怨꾩궛湲곕뒗 援?꽭泥? 怨좎슜?몃룞遺, 援??嫄닿컯蹂댄뿕怨듬떒, 怨좎슜蹂댄뿕 ?쒕룄 ?덈궡 ??怨듭떇 湲곗????곗꽑 李멸퀬??諛섏쁺?⑸땲?? ?ㅻ쭔 ?뚯궗蹂?湲됱뿬 洹쒖젙, 鍮꾧낵????ぉ, 吏湲?諛⑹떇, ?좉퀬 ?쒖젏???곕씪 ?ㅼ젣 寃곌낵???щ씪吏????덉쑝誘濡?媛?怨꾩궛湲곗? 媛?대뱶?먮뒗 諛섎뱶??李멸퀬???덈궡瑜??④퍡 ?쒖떆?⑸땲??</p>
    <p>怨꾩궛湲??섏씠吏 ?꾨옒???댁꽕 ?뱀뀡怨?蹂꾨룄 媛?대뱶 臾몄꽌???⑥닚 湲????梨꾩슦湲곌? ?꾨땲?? ?ъ슜?먭? ?ㅼ젣濡??룰컝由щ뒗 吏덈Ц???듯븯???뺥깭濡??몄쭛?⑸땲?? ?덈? ?ㅼ뼱 ?댁쭅湲덉? ?됯퇏?꾧툑 ?ы븿 ??ぉ?? ?ㅼ뾽湲됱뿬???섍툒 議곌굔怨??먯쭊?댁궗 ?덉쇅瑜? ?곗감???낆궗 泥ロ빐? ?뚭퀎?곕룄 湲곗? 李⑥씠瑜?以묒떖?쇰줈 ?ㅻ９?덈떎.</p>
  </div>

  <div class="section">
    <h2>?뱴 ?④퍡 ?쎈뒗 媛?대뱶</h2>
    <p>怨꾩궛?뺤? 怨꾩궛湲곕쭔 ?섏뿴?섎뒗 援ъ“?먯꽌 踰쀬뼱?섍린 ?꾪빐 ?댁꽕??媛?대뱶 臾몄꽌瑜??④퍡 ?댁쁺?섍퀬 ?덉뒿?덈떎. ?곕큺 ?묒긽 ???ㅼ닔?뱀븸???대뼸寃?鍮꾧탳?댁빞 ?섎뒗吏, ?댁쭅湲?怨꾩궛?먯꽌 ?됯퇏?꾧툑???ы븿?섎뒗 ??ぉ??臾댁뾿?몄?, ?먯쭊?댁궗? ?ㅼ뾽湲됱뿬 ?섍툒 議곌굔? ?대뼸寃??ㅻⅨ吏泥섎읆 怨꾩궛湲????붾㈃留뚯쑝濡??ㅻ챸?섍린 ?대젮???댁슜???곕줈 ?뺣━?⑸땲??</p>
    <p><a href="/guides/" style="color:var(--accent);font-weight:700;text-decoration:none;">媛?대뱶 紐⑥븘蹂닿린 諛붾줈媛湲?/a></p>
  </div>`,
      'about insert editorial sections'
    );
  }

  write('about/index.html', html);
}

function patchCoreGuideLinks() {
  const guideBlocks = {
    'salary/index.html': `
  <div class="related">
    <h2>?④퍡 ?쎌쑝硫?醫뗭? 媛?대뱶</h2>
    <div class="related-grid">
      <a href="../guides/salary-negotiation/" class="related-btn">?뱲 ?ㅼ닔?뱀븸?쇰줈 ?곕큺 鍮꾧탳?섍린</a>
      <a href="../guides/health-insurance-paycheck/" class="related-btn">?룯 嫄닿컯蹂댄뿕猷뚯? ?붽툒 李⑥씠</a>
    </div>
  </div>`,
    'retire/index.html': `
  <div class="related">
    <h2>?④퍡 ?쎌쑝硫?醫뗭? 媛?대뱶</h2>
    <div class="related-grid">
      <a href="../guides/severance-average-wage/" class="related-btn">?뱲 ?됯퇏?꾧툑 ?ы븿 ??ぉ ?뺣━</a>
      <a href="../guides/unemployment-eligibility/" class="related-btn">?뱥 ?댁궗 ???섍툒 議곌굔 泥댄겕</a>
    </div>
  </div>`,
    'unemploy/index.html': `
  <div class="related">
    <h2>?④퍡 ?쎌쑝硫?醫뗭? 媛?대뱶</h2>
    <div class="related-grid">
      <a href="../guides/unemployment-eligibility/" class="related-btn">?뱲 ?먯쭊?댁궗 ?덉쇅? ?섍툒 議곌굔</a>
      <a href="../guides/severance-average-wage/" class="related-btn">?벀 ?댁쭅湲덇낵 ?ㅼ뾽湲됱뿬 以鍮??쒖꽌</a>
    </div>
  </div>`,
    'annual-leave/index.html': `
  <div class="related">
    <h2>?④퍡 ?쎌쑝硫?醫뗭? 媛?대뱶</h2>
    <div class="related-grid">
      <a href="../guides/annual-leave-rules/" class="related-btn">?뱲 ?낆궗 泥ロ빐 ?곗감 湲곗?</a>
      <a href="../guides/" class="related-btn">?뾺 怨꾩궛??媛?대뱶 紐⑥븘蹂닿린</a>
    </div>
  </div>`,
    'health-insurance/index.html': `
  <div class="related">
    <h2>?④퍡 ?쎌쑝硫?醫뗭? 媛?대뱶</h2>
    <div class="related-grid">
      <a href="../guides/health-insurance-paycheck/" class="related-btn">?뱲 嫄닿컯蹂댄뿕猷뚭? ?붽툒??誘몄튂???곹뼢</a>
      <a href="../guides/salary-negotiation/" class="related-btn">?뮳 ?ㅼ닔?뱀븸?쇰줈 議곌굔 鍮꾧탳?섍린</a>
    </div>
  </div>`,
    'yearend/index.html': `
  <div class="related">
    <h2>?④퍡 ?쎌쑝硫?醫뗭? 媛?대뱶</h2>
    <div class="related-grid">
      <a href="../guides/salary-negotiation/" class="related-btn">?뱲 ?ㅼ닔?뱀븸怨?怨듭젣 援ъ“ ?댄빐?섍린</a>
      <a href="../guides/" class="related-btn">?뾺 怨꾩궛??媛?대뱶 紐⑥븘蹂닿린</a>
    </div>
  </div>`,
    'parental-leave/index.html': `
  <div class="related">
    <h2>?④퍡 ?쎌쑝硫?醫뗭? 媛?대뱶</h2>
    <div class="related-grid">
      <a href="../guides/annual-leave-rules/" class="related-btn">?뱲 ?댁쭅 ???곗감 ?뺣━ ?ъ씤??/a>
      <a href="../guides/" class="related-btn">?뾺 怨꾩궛??媛?대뱶 紐⑥븘蹂닿린</a>
    </div>
  </div>`,
    'loan/index.html': `
  <div class="related">
    <h2>?④퍡 ?쎌쑝硫?醫뗭? 媛?대뱶</h2>
    <div class="related-grid">
      <a href="../guides/loan-repayment-methods/" class="related-btn">?뱲 ?곹솚 諛⑹떇蹂?李⑥씠 ?뺣━</a>
      <a href="../guides/" class="related-btn">?뾺 怨꾩궛??媛?대뱶 紐⑥븘蹂닿린</a>
    </div>
  </div>`,
    'salary-rank/index.html': `
  <div class="related">
    <h2>?④퍡 ?쎌쑝硫?醫뗭? 媛?대뱶</h2>
    <div class="related-grid">
      <a href="../guides/salary-negotiation/" class="related-btn">?뱲 ?곕큺 ?묒긽?먯꽌 ?レ옄 ?쎈뒗 踰?/a>
      <a href="../guides/" class="related-btn">?뾺 怨꾩궛??媛?대뱶 紐⑥븘蹂닿린</a>
    </div>
  </div>`,
    'payday/index.html': `
  <div class="related">
    <h2>?④퍡 ?쎌쑝硫?醫뗭? 媛?대뱶</h2>
    <div class="related-grid">
      <a href="../guides/loan-repayment-methods/" class="related-btn">?뱲 ???곹솚?↔낵 湲됱뿬??愿由?/a>
      <a href="../guides/" class="related-btn">?뾺 怨꾩궛??媛?대뱶 紐⑥븘蹂닿린</a>
    </div>
  </div>`,
  };

  for (const [file, block] of Object.entries(guideBlocks)) {
    let html = read(file);
    if (!html.includes('?④퍡 ?쎌쑝硫?醫뗭? 媛?대뱶')) {
      html = replaceOrThrow(
        html,
        /<div class="related">/,
        `${block}\n\n  <div class="related">`,
        `${file} guide links`
      );
      write(file, html);
    }
  }
}

function rebuildSitemap() {
  const urls = [
    ['/', 'weekly', '1.0'],
    ['/guides/', 'weekly', '0.9'],
    ['/guides/salary-negotiation/', 'monthly', '0.8'],
    ['/guides/severance-average-wage/', 'monthly', '0.8'],
    ['/guides/unemployment-eligibility/', 'monthly', '0.8'],
    ['/guides/annual-leave-rules/', 'monthly', '0.8'],
    ['/guides/health-insurance-paycheck/', 'monthly', '0.8'],
    ['/guides/loan-repayment-methods/', 'monthly', '0.8'],
    ['/salary/', 'monthly', '0.9'],
    ['/salary-rank/', 'monthly', '0.9'],
    ['/retire/', 'monthly', '0.9'],
    ['/unemploy/', 'monthly', '0.8'],
    ['/yearend/', 'monthly', '0.8'],
    ['/salary-raise/', 'monthly', '0.8'],
    ['/health-insurance/', 'monthly', '0.8'],
    ['/youth-savings/', 'monthly', '0.8'],
    ['/payday/', 'monthly', '0.8'],
    ['/income-tax/', 'monthly', '0.8'],
    ['/jeonse/', 'monthly', '0.8'],
    ['/jeonse-vs-wolse/', 'monthly', '0.8'],
    ['/cheongak/', 'monthly', '0.8'],
    ['/yangdo/', 'monthly', '0.8'],
    ['/gift-tax/', 'monthly', '0.8'],
    ['/stock/', 'monthly', '0.8'],
    ['/savings/', 'monthly', '0.8'],
    ['/deposit/', 'monthly', '0.8'],
    ['/loan/', 'monthly', '0.8'],
    ['/retirement-fund/', 'monthly', '0.7'],
    ['/freelancer/', 'monthly', '0.8'],
    ['/smartstore/', 'monthly', '0.8'],
    ['/coupang/', 'monthly', '0.8'],
    ['/baemin/', 'monthly', '0.8'],
    ['/halbu/', 'monthly', '0.7'],
    ['/cartax/', 'monthly', '0.7'],
    ['/vat/', 'monthly', '0.8'],
    ['/parental-leave/', 'monthly', '0.8'],
    ['/electricity/', 'monthly', '0.8'],
    ['/used-car-tax/', 'monthly', '0.7'],
    ['/annual-leave/', 'monthly', '0.8'],
    ['/about/', 'monthly', '0.5'],
    ['/contact/', 'monthly', '0.5'],
    ['/privacy/', 'yearly', '0.3'],
  ];

  const body = urls
    .map(
      ([loc, changefreq, priority]) =>
        `  <url><loc>https://calc.ssoxxl.com${loc}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
    )
    .join('\n');

  write(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
  );
}

function createGuides() {
  const guides = [
    {
      file: 'guides/salary-negotiation/index.html',
      title: '?곕큺 ?묒긽?????몄쟾蹂대떎 ?ㅼ닔?뱀븸??癒쇱? 遊먯빞 ?섎뒗 ?댁쑀',
      description: '?곕큺 ?묒긽怨??댁쭅 ?쒖븞?쒕? 蹂????몄쟾 湲덉븸蹂대떎 ?ㅼ닔?뱀븸??癒쇱? 鍮꾧탳?댁빞 ?섎뒗 ?댁쑀瑜??뺣━?덉뒿?덈떎.',
      slug: 'salary-negotiation',
      category: '湲됱뿬 媛?대뱶',
      updated: '2026-05-14',
      intro:
        '?곕큺 ?レ옄媛 而?蹂댁씤?ㅺ퀬 諛붾줈 醫뗭? 議곌굔? ?꾨땲?먯슂. ?ㅼ젣濡쒕뒗 鍮꾧낵???앸?, 遺?묎?議??? 蹂댄뿕猷? 怨듭젣 援ъ“???곕씪 ?듭옣???ㅼ뼱?ㅻ뒗 湲덉븸??苑??щ씪吏????덉뼱???몄쟾 ?곕큺蹂대떎 ?ㅼ닔?뱀븸 湲곗??쇰줈 鍮꾧탳?섎뒗 ?듦?????以묒슂?⑸땲??',
      sections: [
        {
          heading: '?몄쟾 ?곕큺留?蹂대㈃ ?볦튂湲??ъ슫 ?댁쑀',
          body: [
            '?댁쭅 ?쒖븞?쒕? 諛쏆쓣 ??媛??癒쇱? 蹂댁씠???レ옄??蹂댄넻 ?몄쟾 ?곕큺?낅땲?? 洹몃윴???앺솢鍮?怨꾪쉷? ?몄쟾???꾨땲???ㅼ젣 ?낃툑?섎뒗 ?붽툒??湲곗??쇰줈 ?뚯븘媛묐땲?? 媛숈? 5泥쒕쭔 ???곕큺?대씪??鍮꾧낵???앸?媛 ?덈뒓?? 遺?묎?議??섍? 紐?紐낆씠?? ?곸뿬湲덉씠 湲곕낯湲됱뿉 ?ы븿?섎뒓?먯뿉 ?곕씪 泥닿컧 ?붽툒? 遺꾨챸???щ씪吏묐땲??',
            '?뱁엳 ?湲곗뾽, ?ㅽ??몄뾽, 以묒냼湲곗뾽泥섎읆 蹂댁긽 援ъ“媛 ?ㅻⅨ ?뚯궗?쇰━ 鍮꾧탳???뚮뒗 ??洹몃젃?듬땲?? ?대뼡 ?뚯궗???곕큺? ?믪븘 蹂댁뿬???곸뿬 鍮꾩쨷??而ㅼ꽌 ??怨좎젙 ?섎졊?≪? ??쓣 ???덇퀬, ?ㅻⅨ ?뚯궗??蹂듭??ъ씤?????鍮꾧낵???섎떦??留롮븘 ?ㅼ닔?뱀븸???덉긽蹂대떎 ?믨쾶 ?섏삱 ???덉뒿?덈떎.',
          ],
          list: [
            '?몄쟾 湲덉븸??媛숈븘??鍮꾧낵????ぉ???ㅻⅤ硫????섎졊??李⑥씠媛 ?앷퉩?덈떎.',
            '?곸뿬? ?몄꽱?곕툕 鍮꾩쨷???믪쓣?섎줉 ?붾퀎 泥닿컧 ?섏엯? ?붾뱾由????덉뒿?덈떎.',
            '?곕큺 ?묒긽? ?レ옄 ?먯껜蹂대떎 ??怨좎젙 ?꾧툑?먮쫫 湲곗??쇰줈 蹂대뒗 ?몄씠 ?덉쟾?⑸땲??',
          ],
        },
        {
          heading: '?ㅼ닔?뱀븸 鍮꾧탳?먯꽌 瑗?媛숈씠 遊먯빞 ????ぉ',
          body: [
            '?ㅼ닔?뱀븸??鍮꾧탳???뚮뒗 4?蹂댄뿕 怨듭젣? ?뚮뱷?몃쭔 蹂대뒗 寃껋쑝濡??앸굹吏 ?딆뒿?덈떎. 鍮꾧낵???앸?, 媛議??? ?듦렐鍮꾩? 媛숈? 怨듭젣 ????ぉ, ?곸뿬 ?ы븿 ?щ?, ?곕큺??12媛쒖썡濡??섎늻?붿? 13遺꾩쓽 1 援ъ“?몄? 媛숈? 湲됱뿬 ?ㅺ퀎 諛⑹떇???④퍡 遊먯빞 ?⑸땲??',
            '??媛숈? ?곕큺?대씪???뚯궗媛 ?쒓났?섎뒗 蹂듭? 以??쇰????꾧툑 ?먮쫫??吏곸젒 ?곹뼢??以띾땲?? ?덈? ?ㅼ뼱 ?붿꽭 吏?? 援먰넻鍮? ?앸?泥섎읆 吏異쒖쓣 以꾩씠????ぉ? ?ㅼ쭏?곸씤 泥닿컧 ?뚮뱷???믪씠????븷???⑸땲?? ?곕씪??怨꾩궛?뺤쓽 ?곕큺 ?ㅼ닔?뱀븸 怨꾩궛湲?寃곌낵? ?④퍡 ?쒖븞?쒖쓽 湲됱뿬 援ъ꽦?쒕? ?섎???蹂대뒗 ?몄씠 醫뗭뒿?덈떎.',
          ],
        },
        {
          heading: '?묒긽 ?꾩뿉 泥댄겕?섎㈃ 醫뗭? 吏덈Ц',
          body: [
            '?곕큺???щ━???묒긽?먯꽌???⑥닚??珥앹븸留??щ젮?щ씪怨?留먰븯湲곕낫?? 湲곕낯湲됯낵 怨좎젙?섎떦, 鍮꾧낵??泥섎━ 媛????ぉ, ?곸뿬 吏湲?湲곗???媛숈씠 ?뺤씤?섎뒗 寃껋씠 ???ㅼ쭏?곸엯?덈떎. 媛숈? 珥앹븸 ?몄긽?대씪????怨좎젙 ?섎졊?≪씠 而ㅼ???諛⑺뼢???앺솢鍮?愿由ъ뿉?????꾩????섎뒗 寃쎌슦媛 留롮뒿?덈떎.',
            '?좉퇋 ?낆궗?쇰㈃ 泥?湲됱뿬 吏湲됱씪怨??섏뒿湲곌컙 湲됱뿬 湲곗????④퍡 臾쇱뼱蹂댁꽭?? ?낆궗 泥ル떖? ?쇳븷 怨꾩궛???곸슜?섍린 ?쎄퀬, ?섏뒿湲곌컙??湲곕낯湲?鍮꾩쑉???щ씪吏硫?泥?2~3媛쒖썡 泥닿컧 ?섏엯???щ씪吏????덉뒿?덈떎.',
          ],
        },
      ],
      related: [
        { href: '../../salary/', label: '?곕큺 ?ㅼ닔?뱀븸 怨꾩궛湲? },
        { href: '../../salary-rank/', label: '?곕큺 ?쒖쐞 怨꾩궛湲? },
        { href: '../../health-insurance/', label: '嫄닿컯蹂댄뿕猷?怨꾩궛湲? },
        { href: '../health-insurance-paycheck/', label: '嫄닿컯蹂댄뿕猷뚯? ?ㅼ닔?뱀븸 媛?대뱶' },
      ],
    },
    {
      file: 'guides/severance-average-wage/index.html',
      title: '?댁쭅湲?怨꾩궛?먯꽌 ?됯퇏?꾧툑???ы븿?섎뒗 ??ぉ? 臾댁뾿?멸???',
      description: '?댁쭅湲?怨꾩궛???듭떖???됯퇏?꾧툑???대뼡 ??ぉ???ы븿?섎뒗吏, ?곸뿬湲덇낵 ?곗감?섎떦? ?대뼸寃?蹂대뒗吏 ?뺣━?덉뒿?덈떎.',
      slug: 'severance-average-wage',
      category: '?댁쭅湲?媛?대뱶',
      updated: '2026-05-14',
      intro:
        '?댁쭅湲?怨꾩궛? 怨듭떇???⑥닚??蹂댁뿬?? ?ㅼ젣濡쒕뒗 ?됯퇏?꾧툑???대뼡 ??ぉ???ｋ뒓?먯뿉??李⑥씠媛 ?ш쾶 ?⑸땲?? ?댁궗 吏곸쟾 3媛쒖썡 湲됱뿬, ?곸뿬湲? 誘몄궗???곗감?섎떦泥섎읆 ?먯＜ ?룰컝由щ뒗 ?ъ씤?몃? 癒쇱? ?뺣━?대몢硫?怨꾩궛 寃곌낵瑜??⑥뵮 ?먯떊 ?덇쾶 ?쎌쓣 ???덉뼱??',
      sections: [
        {
          heading: '?됯퇏?꾧툑????以묒슂?쒓???',
          body: [
            '?댁쭅湲덉? ?됯퇏?꾧툑 횞 30??횞 洹쇱냽?쇱닔 첨 365 援ъ“濡?怨꾩궛?⑸땲?? 寃곌뎅 ?댁쭅湲?珥앹븸??醫뚯슦?섎뒗 ?듭떖? ?됯퇏?꾧툑?낅땲?? ?됯퇏?꾧툑? ?댁쭅???댁쟾 3媛쒖썡 ?숈븞 吏湲됰맂 ?꾧툑 珥앹븸??洹?湲곌컙??珥??쇱닔濡??섎늿 媛믪씠?쇱꽌, ?댁궗 吏곸쟾 湲됱뿬 蹂?숈씠 ?덉쑝硫?寃곌낵???④퍡 諛붾앸땲??',
            '???뚮Ц???댁궗 吏곸쟾 ?깃낵湲됱씠 ?ㅼ뼱?붾뒗吏, 吏곸콉?섎떦??蹂?덈뒗吏, 臾닿툒?댁쭅???덉뿀?붿? 媛숈? ?붿냼媛 ?ㅼ젣 怨꾩궛?먯꽌 以묒슂?섍쾶 ?묒슜?⑸땲?? ?⑥닚???꾩옱 ?붽툒留??ｌ뼱??蹂대뒗 怨꾩궛? 李멸퀬?⑹씪 肉먯씠怨? ?ㅼ젣 ?뺤궛 吏곸쟾?먮뒗 吏湲???ぉ???몃??곸쑝濡??ㅼ떆 ?뺤씤?댁빞 ?⑸땲??',
          ],
        },
        {
          heading: '?곸뿬湲덇낵 ?곗감?섎떦? ??긽 ?ㅼ뼱媛?섏슂?',
          body: [
            '?곸뿬湲덇낵 ?곗감?섎떦? 臾댁“嫄??먮룞 ?ы븿?대씪怨?蹂대㈃ ?꾪뿕?⑸땲?? ?뺢린?곸씠怨?怨꾩냽?곸쑝濡?吏湲됰맂 ?곸뿬?쇰㈃ ?됯퇏?꾧툑 ?곗젙??諛섏쁺?????덉?留? ?쇳쉶???ъ긽 ?깃꺽??湲덉븸? ?깃꺽???ㅻ? ???덉뒿?덈떎. 誘몄궗???곗감?섎떦???몄젣 諛쒖깮?덇퀬 ?몄젣 ?뺤궛?먮뒗吏???곕씪 ?먮떒 ?ъ씤?멸? ?щ씪吏????덉뒿?덈떎.',
            '洹몃옒???댁쭅湲덉씠 ?덉긽蹂대떎 ?묎쾶 ?섏솕???뚮뒗 媛??癒쇱? 理쒓렐 3媛쒖썡 湲됱뿬紐낆꽭?쒖? ?곌컙 ?곸뿬 吏湲??댁뿭??媛숈씠 遊먯빞 ?⑸땲?? ?됯퇏?꾧툑???ы븿?섏? ?딆? ??ぉ???덈뒗吏, 諛섎?濡??뚯궗媛 ?대? 蹂꾨룄 ?섎떦?쇰줈 泥섎━????ぉ? ?녿뒗吏 ?뺤씤?댁빞 ?ㅽ빐媛 以꾩뼱??땲??',
          ],
          list: [
            '?뺢린 ?곸뿬?몄?, ?쇳쉶???ъ긽?몄? 援щ텇?댁빞 ?⑸땲??',
            '誘몄궗???곗감?섎떦? ?뺤궛 ?쒖젏怨?諛쒖깮 援ъ“瑜?媛숈씠 遊먯빞 ?⑸땲??',
            '?댁궗 吏곸쟾 3媛쒖썡 湲됱뿬紐낆꽭?쒕? 瑗??뺣낫?대몢???몄씠 醫뗭뒿?덈떎.',
          ],
        },
        {
          heading: '?댁궗 ?꾩뿉 以鍮꾪븯硫?醫뗭? ?먮즺',
          body: [
            '?댁쭅湲??뺤궛 ?꾩뿉??理쒓렐 3媛쒖썡 湲됱뿬紐낆꽭?? ?곌컙 ?곸뿬 吏湲??댁뿭, 誘몄궗???곗감 ?댁뿭, 洹쇰줈怨꾩빟?쒖쓽 ?꾧툑 援ъ꽦???뺣룄??誘몃━ 梨숆꺼?먮뒗 寃껋씠 醫뗭뒿?덈떎. ?섏쨷??怨꾩궛??留욌뒗吏 ?뺤씤?????レ옄蹂대떎 ??ぉ紐낆씠 ??以묒슂???뚭? 留롪린 ?뚮Ц?낅땲??',
            '?뱁엳 ?뚯궗留덈떎 ?앸?, 吏곸콉?섎떦, ?깃낵湲? ?몄꽱?곕툕 ?대쫫???ㅻⅤ湲??뚮Ц??蹂몄씤???ㅼ젣濡??대뼡 ?깃꺽???덉쓣 諛쏆븯?붿? 誘몃━ ?뺣━?대몢硫??댁궗 ??臾몄쓽 怨쇱젙???⑥뵮 ?ъ썙吏묐땲??',
          ],
        },
      ],
      related: [
        { href: '../../retire/', label: '?댁쭅湲?怨꾩궛湲? },
        { href: '../../salary/', label: '?곕큺 ?ㅼ닔?뱀븸 怨꾩궛湲? },
        { href: '../../annual-leave/', label: '?곗감 怨꾩궛湲? },
        { href: '../unemployment-eligibility/', label: '?ㅼ뾽湲됱뿬 議곌굔 媛?대뱶' },
      ],
    },
    {
      file: 'guides/unemployment-eligibility/index.html',
      title: '?먯쭊?댁궗?몃뜲???ㅼ뾽湲됱뿬瑜?諛쏆쓣 ???덈뒗 ?덉쇅媛 ?덈굹??',
      description: '?ㅼ뾽湲됱뿬 ?섍툒 議곌굔怨??먯쭊?댁궗 ?덉쇅, ?댁궗 ??梨숆린硫?醫뗭? ?뺤씤 ?ы빆???쒕늿???뺣━?덉뒿?덈떎.',
      slug: 'unemployment-eligibility',
      category: '?ㅼ뾽湲됱뿬 媛?대뱶',
      updated: '2026-05-14',
      intro:
        '?ㅼ뾽湲됱뿬???⑥닚???댁궗?덈떎怨?諛붾줈 諛쏆쓣 ???덈뒗 ?쒕룄媛 ?꾨땲?먯슂. ?ㅻ쭔 ?먯쭊?댁궗?쇨퀬 ?댁꽌 ??긽 遺덇??ν븳 寃껊룄 ?꾨떃?덈떎. ?댁궗 ?ъ쑀? ?낆쬆 ?먮즺???곕씪 ?덉쇅媛 媛덈┫ ???덉뼱?? ?댁궗 ?꾩뿉 癒쇱? ?뺤씤????ぉ???뚭퀬 ?吏곸씠???몄씠 ?⑥뵮 ?좊━?⑸땲??',
      sections: [
        {
          heading: '湲곕낯 ?섍툒 議곌굔遺???ㅼ떆 ?뺣━',
          body: [
            '?ㅼ뾽湲됱뿬??怨좎슜蹂댄뿕 媛??湲곌컙, 鍮꾩옄諛쒖쟻 ?댁쭅 ?щ?, ?ъ랬???쒕룞 媛???곹깭 ???щ윭 ?붽굔???④퍡 留욎븘???⑸땲?? 留롮? ?щ엺??留덉?留??붽툒留뚯쑝濡?怨꾩궛?섎젮怨??섏?留? ?ㅼ젣濡쒕뒗 媛??湲곌컙怨??댁궗 ?ъ쑀媛 癒쇱? ?뺤씤?⑸땲?? 湲덉븸 怨꾩궛? 議곌굔 ?뺤씤 ?댄썑???④퀎?쇨퀬 蹂대뒗 ?몄씠 留욎뒿?덈떎.',
            '沅뚭퀬?ъ쭅, 怨꾩빟留뚮즺, ?뚯궗 ?ъ젙?쇰줈 ?명븳 ?댁쭅? ?쇰컲?곸쑝濡?留롮씠 ?멸툒?섎뒗 ?щ?吏留? 媛숈? 臾멸뎄媛 ?댁쭅?뺤씤?쒖뿉 ?대뼸寃??곹엳?먮깘???곕씪?쒕룄 泥섎━ ?먮쫫???щ씪吏????덉뒿?덈떎. 洹몃옒???댁궗 ???뚯궗? ?대뼡 ?ъ쑀濡??뺣━?좎? ?뺤씤?섎뒗 ?쇱씠 以묒슂?⑸땲??',
          ],
        },
        {
          heading: '?먯쭊?댁궗 ?덉쇅媛 臾몄젣 ?섎뒗 寃쎌슦',
          body: [
            '?먯쭊?댁궗 ?덉쇅??嫄닿컯 臾몄젣, ?꾧툑泥대텋, ?κ굅由?異쒗눜洹? ?≪븘? 媛議??뚮큵, 吏곸옣 ??愿대∼?섏씠??洹쇰줈議곌굔??以묐???蹂寃쎌쿂???ㅻТ?먯꽌 ?먯＜ 嫄곕줎?⑸땲?? ?ㅻ쭔 ?⑥닚??蹂몄씤???섎뱾?덈떎???ъ젙留뚯쑝濡쒕뒗 遺議깊븯怨? ?ㅼ젣濡??대? ?룸컺移⑦븷 ?먮즺媛 ?덈뒗吏媛 以묒슂?⑸땲??',
            '?덈? ?ㅼ뼱 ?꾧툑泥대텋?대씪硫?湲됱뿬 誘몄?湲??댁뿭怨?紐낆꽭?쒕?, 嫄닿컯 臾몄젣?쇰㈃ 吏꾨떒?쒖? 洹쇰Т 怨ㅻ? ?ъ쑀瑜? ?κ굅由?異쒗눜洹쇱씠?쇰㈃ ?댁쟾 二쇱냼? 蹂寃???嫄곕━ ?먮즺瑜?媛숈씠 以鍮꾪빐???⑸땲?? 寃곌뎅 ?덉쇅 ?몄젙 ?щ????곹솴 ?먯껜蹂대떎 ?먮즺 以鍮??뺣룄?????ш쾶 醫뚯슦?????덉뒿?덈떎.',
          ],
          list: [
            '?댁궗 ?꾩뿉 ?댁쭅?뺤씤???ъ쑀媛 ?대뼸寃??ㅼ뼱媛?붿? ?뺤씤?섏꽭??',
            '?덉쇅 ?ъ쑀??利앸튃 ?놁씠???ㅻ챸留뚯쑝濡??듦낵?섍린 ?대졄?듬땲??',
            '?ㅼ뾽湲됱뿬 怨꾩궛蹂대떎 癒쇱? ?섍툒 媛???щ?? 媛??湲곌컙???뺤씤?섎뒗 ?몄씠 醫뗭뒿?덈떎.',
          ],
        },
        {
          heading: '?댁궗 ?꾩뿉 梨숆린硫?醫뗭? ?쒖꽌',
          body: [
            '泥レ㎏, 怨좎슜蹂댄뿕 媛?낃린媛꾧낵 ?댁궗 ?ъ쑀瑜?癒쇱? ?뺤씤?⑸땲?? ?섏㎏, 湲됱뿬紐낆꽭?쒖? 洹쇰줈怨꾩빟?? ?댁쭅 愿??臾몄꽌, ?덉쇅 ?ъ쑀瑜??낆쬆???먮즺瑜??뺣━?⑸땲?? ?뗭㎏, 怨꾩궛???ㅼ뾽湲됱뿬 怨꾩궛湲곕줈 ??듭쟻??湲덉븸怨?湲곌컙??蹂????앺솢鍮?怨꾪쉷???〓뒗 ?먮쫫???⑥쑉?곸엯?덈떎.',
            '?ㅼ뾽湲됱뿬??湲덉븸蹂대떎 ?쒖젏 愿由ш? ??以묒슂??寃쎌슦??留롮뒿?덈떎. 留덉?留?湲됱뿬, ?댁쭅湲? ?ㅼ뾽湲됱뿬 泥??섍툒 ?쒖젏 ?ъ씠??怨듬갚???앷만 ???덉쑝????湲곌컙???꾧툑?먮쫫??誘몃━ 洹몃젮?먮뒗 寃껋씠 醫뗭뒿?덈떎.',
          ],
        },
      ],
      related: [
        { href: '../../unemploy/', label: '?ㅼ뾽湲됱뿬 怨꾩궛湲? },
        { href: '../../retire/', label: '?댁쭅湲?怨꾩궛湲? },
        { href: '../../salary/', label: '?곕큺 ?ㅼ닔?뱀븸 怨꾩궛湲? },
        { href: '../severance-average-wage/', label: '?됯퇏?꾧툑怨??댁쭅湲?媛?대뱶' },
      ],
    },
    {
      file: 'guides/annual-leave-rules/index.html',
      title: '?낆궗 泥ロ빐 ?곗감? ?뚭퀎?곕룄 湲곗? ?곗감???대뼸寃??ㅻⅨ媛??',
      description: '?낆궗 泥ロ빐 ?곗감, 1??誘몃쭔 ?붿감, ?뚭퀎?곕룄 湲곗? ?곗감 ?댁쁺?먯꽌 ?먯＜ ?룰컝由щ뒗 ?ъ씤?몃? ?뺣━?덉뒿?덈떎.',
      slug: 'annual-leave-rules',
      category: '?곗감 媛?대뱶',
      updated: '2026-05-14',
      intro:
        '?곗감???レ옄留?蹂대㈃ ?ъ썙 蹂댁뿬???뚯궗留덈떎 ?댁쁺 湲곗????щ씪??媛???먯＜ ?ㅽ빐媛 ?앷린???곸뿭 以??섎굹?덉슂. ?낆궗??湲곗??쇰줈 蹂대뒗吏, ?뚭퀎?곕룄濡?留욎텛?붿?, 泥ロ빐 ?붿감? 1???댁긽 洹쇰Т?먯쓽 ?곗감瑜??대뼸寃??곌껐?섎뒗吏???곕씪 泥닿컧 寃곌낵媛 ?щ씪吏묐땲??',
      sections: [
        {
          heading: '?낆궗 泥ロ빐??媛??留롮씠 ?룰컝由щ뒗 遺遺?,
          body: [
            '?낆궗 ??1??誘몃쭔 洹쇰줈?먮뒗 留ㅻ떖 媛쒓렐???뚮쭏???곗감媛 ?앷린??援ъ“瑜?癒쇱? ?댄빐?댁빞 ?⑸땲?? ?ш린???뚯궗媛 ?뚭퀎?곕룄 湲곗??쇰줈 ?닿?瑜??댁쁺?섎㈃, ?ㅼ젣 遺?ъ? ?ъ슜 諛⑹떇???낆궗??湲곗? 怨꾩궛怨??ㅻⅤ寃?蹂댁씪 ???덉뒿?덈떎. 洹몃옒??吏곸썝 ?낆옣?먯꽌???쒖솢 ???곗감媛 以꾩뼱??寃껋쿂??蹂댁씠吏??앸씪???ㅽ빐媛 ?앷린湲??쎌뒿?덈떎.',
            '?ㅼ젣濡쒕뒗 ?쒕룄 ?먯껜媛 諛붾?寃껋씠 ?꾨땲?? ?뚯궗媛 愿由??몄쓽瑜??꾪빐 ?뚭퀎?곕룄濡??뺤궛?섎㈃???좊??щ굹 議곗젙???ㅼ뼱媛??寃쎌슦媛 留롮뒿?덈떎. ?곕씪???곗감 媛쒖닔留?蹂?寃??꾨땲??遺??湲곗?怨??뺤궛 ?쒖젏??媛숈씠 ?뺤씤?댁빞 ?뺥솗?⑸땲??',
          ],
        },
        {
          heading: '?뚭퀎?곕룄 湲곗? ?댁쁺???λ떒??,
          body: [
            '?뚭퀎?곕룄 湲곗?? ?뚯궗 ?낆옣?먯꽌??愿由ш? ?명븯怨? 吏곸썝 ?낆옣?먯꽌??? ?꾩껜 ?쇱젙怨??닿? 怨꾪쉷??留욎텛湲??쎈떎???μ젏???덉뒿?덈떎. ?ㅻ쭔 ?낆궗 ?쒖젏???좊ℓ??寃쎌슦?먮뒗 珥덇린??遺?щ릺???곗감 ?섍? ?낆궗??湲곗? 怨꾩궛怨??щ씪 蹂댁뿬 ?쇰????앷린湲??쎌뒿?덈떎.',
            '洹몃옒???낆궗 泥ロ빐?먮뒗 湲됱뿬紐낆꽭?쒖? ?닿?愿由??쒖뒪?쒖뿉???쒖떆?섎뒗 ?곗감 ?붿뿬?쇱닔瑜?洹몃?濡?誘욧린蹂대떎, 怨꾩궛???곗감 怨꾩궛湲?寃곌낵? ?④퍡 ?뚯궗 ?닿퇋瑜?媛숈씠 ?뺤씤?섎뒗 ?몄씠 醫뗭뒿?덈떎. ?뱁엳 ?댁쭅 泥ロ빐? ?≪븘?댁쭅 ?꾪썑?먮뒗 ?곗감 ?뺤궛 諛⑹떇????誘쇨컧?섍쾶 ?묐룞?????덉뒿?덈떎.',
          ],
          list: [
            '?낆궗??湲곗?怨??뚭퀎?곕룄 湲곗?? 寃곌낵 ?レ옄媛 ?ㅻⅤ寃?蹂댁씪 ???덉뒿?덈떎.',
            '?곗감?섎떦 ?뺤궛? ?⑥? 媛쒖닔蹂대떎 ?뺤궛 湲곗? ?쒖젏????以묒슂?⑸땲??',
            '?낆궗 泥ロ빐, ?댁쭅 ?꾪썑, ?댁궗 吏곸쟾?먮뒗 瑗??뚯궗 湲곗????ㅼ떆 ?뺤씤?섏꽭??',
          ],
        },
        {
          heading: '?곗감?섎떦源뚯? 媛숈씠 遊먯빞 ?섎뒗 ?댁쑀',
          body: [
            '?곗감??寃곌뎅 ?닿?瑜??곕뒗 臾몄젣?닿린???섏?留? ?댁궗 吏곸쟾?대굹 ?뱀젙 ?쒖젏?먮뒗 ?곗감?섎떦怨?吏곸젒 ?곌껐?⑸땲?? 洹몃옒???⑥? ?곗감 媛쒖닔留?蹂대뒗 寃껊낫???ъ슜 怨꾪쉷怨??뺤궛 ?쒖젏??媛숈씠 蹂대뒗 ?몄씠 醫뗭뒿?덈떎. ?뱁엳 ?댁궗 ?덉젙?대씪硫?誘몄궗???곗감媛 ?대뼡 湲곗??쇰줈 ?섎떦 泥섎━?섎뒗吏 ?뺤씤?댁빞 ?ㅽ빐瑜?以꾩씪 ???덉뒿?덈떎.',
            '?곗감?섎떦???댁쭅湲??됯퇏?꾧툑 怨꾩궛怨??곌껐?????덈뒗 寃쎌슦???덇린 ?뚮Ц?? ?곗감??湲됱뿬 愿由??꾩껜 ?먮쫫 ?덉뿉??蹂대뒗 ?몄씠 ?⑥뵮 ?ㅼ슜?곸엯?덈떎.',
          ],
        },
      ],
      related: [
        { href: '../../annual-leave/', label: '?곗감 怨꾩궛湲? },
        { href: '../../retire/', label: '?댁쭅湲?怨꾩궛湲? },
        { href: '../../parental-leave/', label: '?≪븘?댁쭅 湲됱뿬 怨꾩궛湲? },
        { href: '../severance-average-wage/', label: '?댁쭅湲??됯퇏?꾧툑 媛?대뱶' },
      ],
    },
    {
      file: 'guides/health-insurance-paycheck/index.html',
      title: '嫄닿컯蹂댄뿕猷뚭? ?ㅻⅤ硫??ㅼ닔?뱀븸? ?쇰쭏??以꾩뼱?쒕굹??',
      description: '嫄닿컯蹂댄뿕猷뚯? ?κ린?붿뼇蹂댄뿕猷뚭? ???ㅼ닔?뱀븸???대뼡 ?곹뼢??二쇰뒗吏 湲됱뿬紐낆꽭??湲곗??쇰줈 ?뺣━?덉뒿?덈떎.',
      slug: 'health-insurance-paycheck',
      category: '蹂댄뿕 媛?대뱶',
      updated: '2026-05-14',
      intro:
        '嫄닿컯蹂댄뿕猷뚮뒗 湲됱뿬紐낆꽭?쒖뿉???뱀뿰?섍쾶 鍮좎?????ぉ泥섎읆 蹂댁씠吏留? ?곕큺??諛붾뚭굅??吏곸옣媛?낆옄? 吏????낆옄 ?곹깭媛 諛붾???泥닿컧 李⑥씠媛 ?ш쾶 ?⑸땲?? ?붽툒???щ옄?붾뜲 ?앷컖蹂대떎 ?먯뿉 ?⑤뒗 ?덉씠 ?곷떎硫?嫄닿컯蹂댄뿕猷뚯? ?κ린?붿뼇蹂댄뿕猷?援ъ“瑜?癒쇱? ?뺤씤?대낵 ?꾩슂媛 ?덉뼱??',
      sections: [
        {
          heading: '?ㅼ닔?뱀븸?먯꽌 嫄닿컯蹂댄뿕猷뚭? 泥닿컧?섎뒗 ?쒓컙',
          body: [
            '?곕큺 ?몄긽 吏곹썑, ?댁쭅 吏곹썑, ?≪븘?댁쭅 蹂듦? ?댄썑泥섎읆 蹂댁닔?붿븸??諛붾뚮뒗 援ш컙?먯꽌??嫄닿컯蹂댄뿕猷?李⑥씠媛 ???먮졆?섍쾶 ?먭뺨吏묐땲?? ?⑥닚??蹂댄뿕猷?????ぉ留??ㅻⅤ??寃껋씠 ?꾨땲???κ린?붿뼇蹂댄뿕猷뚮룄 ?④퍡 ?곌껐?섍린 ?뚮Ц?? ?ㅼ젣 湲됱뿬紐낆꽭?쒖뿉?쒕뒗 ?앷컖蹂대떎 怨듭젣?≪씠 鍮좊Ⅴ寃?而ㅼ????먮굦??諛쏆쓣 ???덉뒿?덈떎.',
            '?뱁엳 ?ㅼ닔?뱀븸 鍮꾧탳瑜????뚮뒗 ?뚮뱷?몃낫??嫄닿컯蹂댄뿕猷?李⑥씠媛 癒쇱? ?덉뿉 ?ㅼ뼱?ㅻ뒗 寃쎌슦??留롮뒿?덈떎. 怨좎젙鍮꾧? 留롮? 媛援щ씪硫???3留??? 5留??먯쓽 李⑥씠??泥닿컧???ш린 ?뚮Ц??怨꾩궛??嫄닿컯蹂댄뿕猷?怨꾩궛湲곗? ?곕큺 ?ㅼ닔?뱀븸 怨꾩궛湲곕? 媛숈씠 蹂대뒗 ?몄씠 醫뗭뒿?덈떎.',
          ],
        },
        {
          heading: '吏곸옣媛?낆옄? 吏????낆옄??愿?먯씠 ?ㅻⅨ ?댁쑀',
          body: [
            '吏곸옣媛?낆옄??二쇰줈 蹂댁닔?붿븸 以묒떖?쇰줈 蹂댄뿕猷뚮? 泥닿컧?섏?留? 吏????낆옄???뚮뱷 ?몄뿉 ?ъ궛怨??먮룞李??깅룄 ?④퍡 怨좊젮?????덉뼱 ?꾩쟾???ㅻⅨ 援ъ“濡??먭뺨吏묐땲?? ?댁궗 ??吏????낆쑝濡??꾪솚?섎뒗 ?쒖젏?먮뒗 湲됱뿬 怨꾩궛湲곗뿉??蹂대뜕 媛먭컖?쇰줈??泥닿컧???????≫옄 ???덉뒿?덈떎.',
            '洹몃옒??吏곸옣?몄씠 ?댁궗瑜??욌몢怨??덈떎硫??⑥닚???꾩옱 湲됱뿬紐낆꽭?쒕쭔 蹂대뒗 寃껊낫?? ?댁궗 ???대뼡 ?뺥깭濡?蹂댄뿕猷?遺?댁씠 ?щ씪吏????덈뒗吏源뚯? 媛숈씠 媛?좏빐???⑸땲?? ?ㅼ뾽湲됱뿬, ?댁쭅湲? 嫄닿컯蹂댄뿕猷뚮뒗 ?댁궗 吏곹썑 ?꾧툑?먮쫫?먯꽌 媛숈씠 ?吏곸씠??寃쎌슦媛 留롮뒿?덈떎.',
          ],
          list: [
            '?곕큺 ?몄긽 吏곹썑 ?ㅼ닔?뱀븸 李⑥씠媛 ?앷컖蹂대떎 ?묐떎硫?嫄닿컯蹂댄뿕猷?利앷?遺꾩쓣 癒쇱? 蹂댁꽭??',
            '?댁궗???댁쭅泥섎읆 ?먭꺽 ?곹깭媛 諛붾뚮뒗 ?쒖젏? 蹂꾨룄濡?怨꾩궛?섎뒗 ?몄씠 醫뗭뒿?덈떎.',
            '?κ린?붿뼇蹂댄뿕猷뚮뒗 嫄닿컯蹂댄뿕猷뚯? ?④퍡 ?吏곸뿬 泥닿컧 怨듭젣瑜????ㅼ슱 ???덉뒿?덈떎.',
          ],
        },
        {
          heading: '湲됱뿬紐낆꽭?쒕? ?쎌쓣 ???④퍡 蹂???ぉ',
          body: [
            '嫄닿컯蹂댄뿕猷뚮쭔 ?곕줈 蹂대뒗 寃껊낫??援???곌툑, 怨좎슜蹂댄뿕, ?뚮뱷?몄? 媛숈씠 蹂대㈃ ?곕큺 議곌굔?????뺥솗???쎌쓣 ???덉뒿?덈떎. ?뚯궗媛 ?쒖떆?섎뒗 ?몄쟾 ?곕큺蹂대떎 ???ㅼ닔?뱀븸??沅곴툑???댁쑀??寃곌뎅 ?щ윭 怨듭젣媛 ??踰덉뿉 鍮좎졇?섍?湲??뚮Ц?낅땲??',
            '?곕큺 ?묒긽, ?댁쭅, 蹂듦?, ?댁궗 媛숈? ?곹솴?먯꽌??嫄닿컯蹂댄뿕猷뚭? ?⑥닚 鍮꾩슜???꾨땲???꾩껜 ?꾧툑?먮쫫???쇰??쇰뒗 愿?먯쑝濡??쎌뼱?먮뒗 ?몄씠 醫뗭뒿?덈떎.',
          ],
        },
      ],
      related: [
        { href: '../../health-insurance/', label: '嫄닿컯蹂댄뿕猷?怨꾩궛湲? },
        { href: '../../salary/', label: '?곕큺 ?ㅼ닔?뱀븸 怨꾩궛湲? },
        { href: '../../salary-raise/', label: '?곕큺 ?몄긽瑜?怨꾩궛湲? },
        { href: '../salary-negotiation/', label: '?ㅼ닔?뱀븸 以묒떖 ?곕큺 鍮꾧탳 媛?대뱶' },
      ],
    },
    {
      file: 'guides/loan-repayment-methods/index.html',
      title: '?먮━湲덇퇏?? ?먭툑洹좊벑, 留뚭린?쇱떆?곹솚? ?대뼸寃??ㅻ?源뚯슂?',
      description: '?異??곹솚 諛⑹떇???곕씪 ???곹솚?↔낵 珥앹씠?먭? ?대뼸寃??щ씪吏?붿? ?ㅼ젣 ?앺솢鍮?愿?먯뿉???뺣━?덉뒿?덈떎.',
      slug: 'loan-repayment-methods',
      category: '?異?媛?대뱶',
      updated: '2026-05-14',
      intro:
        '?異?鍮꾧탳瑜?????湲덈━留?蹂대㈃ ?볦튂??寃?留롮븘?? 媛숈? 湲덈━?쇰룄 ?곹솚 諛⑹떇???곕씪 泥???遺?? 珥앹씠?? 以묐룄?곹솚 ?꾨왂???꾩쟾???щ씪吏묐땲?? 洹몃옒???異쒖? ?レ옄 ?섎굹蹂대떎 ???곹솚 援ъ“瑜?媛숈씠 ?쎈뒗 ?듦?????以묒슂?⑸땲??',
      sections: [
        {
          heading: '?먮━湲덇퇏?깆? ??媛??留롮씠 ?곗씪源뚯슂?',
          body: [
            '?먮━湲덇퇏?깆? 留ㅻ떖 ?대뒗 湲덉븸???쇱젙?댁꽌 ?앺솢鍮?怨꾪쉷???몄슦湲?媛???쎌뒿?덈떎. ?붽툒?좉낵 怨좎젙鍮꾨? 湲곗??쇰줈 ?덉쓣 愿由ы븯??吏곸옣?몄뿉寃뚮뒗 ?덉륫 媛?μ꽦?????μ젏?낅땲?? ?ㅻ쭔 珥덈컲?먮뒗 ?댁옄 鍮꾩쨷???곷??곸쑝濡??믪븘 珥앹씠?먮쭔 ?볤퀬 蹂대㈃ ?꾩돩?????덉뒿?덈떎.',
            '洹몃옒???異?湲곌컙??湲멸퀬 ?꾧툑?먮쫫 ?덉젙????以묒슂???щ엺?먭쾶???먮━湲덇퇏?깆씠 ?명븷 ???덉뒿?덈떎. 諛섎?濡??ъ쑀 ?먭툑???덇퀬 珥앹씠?먮? 議곌툑?대씪??以꾩씠怨??띕떎硫??ㅻⅨ 諛⑹떇????留욎쓣 ???덉뒿?덈떎.',
          ],
        },
        {
          heading: '?먭툑洹좊벑怨?留뚭린?쇱떆?곹솚? ?대뼡 ?щ엺??????留욎쓣源뚯슂?',
          body: [
            '?먭툑洹좊벑? 珥덈컲 ?곹솚?≪씠 ?ъ?留??쒓컙??媛덉닔濡?遺?댁씠 以꾩뼱?쒕뒗 援ъ“?낅땲?? ?붽툒 ?곸듅???덉긽?섍굅??珥덈컲 ?먭툑 ?щ젰???덈뒗 寃쎌슦?먮뒗 珥앹씠?먮? 以꾩씠?????꾩????????덉뒿?덈떎. ?ㅻ쭔 泥?1?꾩쓽 ?꾧툑?먮쫫 ?뺣컯??寃щ뵜 ???덈뒗吏媛 ??以묒슂?⑸땲??',
            '留뚭린?쇱떆?곹솚? ?뱀옣 ??遺?댁? ?묒븘 蹂댁뿬??留뚭린 ?쒖젏?????먭툑 ?곹솚???⑥뒿?덈떎. 洹몃옒???ㅼ젣濡쒕뒗 ?곹솚 怨꾪쉷??遺꾨챸???щ엺?먭쾶留?留욌뒗 寃쎌슦媛 留롪퀬, ?⑥닚?????⑹엯?≪씠 ?곷떎???댁쑀濡??좏깮?섎㈃ ?ㅽ엳???꾪뿕?????덉뒿?덈떎.',
          ],
          list: [
            '?먮━湲덇퇏?? ???⑹엯???덉젙???꾩슂??寃쎌슦',
            '?먭툑洹좊벑: 珥앹씠???덇컧??以묒슂?섍퀬 珥덈컲 遺?댁쓣 媛먮떦?????덈뒗 寃쎌슦',
            '留뚭린?쇱떆?곹솚: 留뚭린 ?쒖젏 ?곹솚 怨꾪쉷??紐낇솗??寃쎌슦',
          ],
        },
        {
          heading: '?異?怨꾩궛湲곕? 蹂???媛숈씠 ?먮떒???ъ씤??,
          body: [
            '?異??댁옄 怨꾩궛湲?寃곌낵???レ옄瑜?蹂댁뿬二쇱?留? ?ㅼ젣 ?섏궗寃곗젙? ?붽툒?? 怨좎젙吏異? 鍮꾩긽?먭툑, ?ν썑 ?뚮뱷 蹂?붿? ?④퍡 遊먯빞 ?⑸땲?? ???곹솚?≪씠 20留???李⑥씠 ?섎룄 ?앺솢鍮??ъ쑀媛 ?щ씪吏????덇린 ?뚮Ц?? ?ㅼ닔?뱀븸 怨꾩궛湲곗? ?④퍡 ?볤퀬 鍮꾧탳?섎뒗 ?몄씠 ?ㅼ슜?곸엯?덈떎.',
            '?뱁엳 移대뱶?湲? ?붿꽭, 蹂댁쑁鍮꾩쿂???좎쭨媛 怨좎젙??吏異쒖씠 ?덈떎硫??붽툒??怨꾩궛湲곗? ?④퍡 蹂대뒗 寃껊룄 醫뗭? 諛⑸쾿?낅땲?? 寃곌뎅 ?異쒖? 湲덈━ 鍮꾧탳蹂대떎 ?꾧툑?먮쫫 愿由?臾몄젣??媛源앹뒿?덈떎.',
          ],
        },
      ],
      related: [
        { href: '../../loan/', label: '?異??댁옄 怨꾩궛湲? },
        { href: '../../payday/', label: '?붽툒??怨꾩궛湲? },
        { href: '../../salary/', label: '?곕큺 ?ㅼ닔?뱀븸 怨꾩궛湲? },
        { href: '../../deposit/', label: '?덇툑 ?댁옄 怨꾩궛湲? },
      ],
    },
  ];

  for (const guide of guides) {
    write(guide.file, createGuidePage(guide));
  }

  const guidesIndex = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8390635644947402" crossorigin="anonymous"></script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>怨꾩궛??媛?대뱶 ??湲됱뿬쨌?멸툑쨌蹂댄뿕쨌?앺솢湲덉쑖 ?댁꽕 紐⑥쓬</title>
<meta name="description" content="?곕큺, ?댁쭅湲? ?ㅼ뾽湲됱뿬, ?곗감, 嫄닿컯蹂댄뿕猷? ?異??곹솚 諛⑹떇源뚯? 怨꾩궛???댁꽕 媛?대뱶瑜?紐⑥븘遊ㅼ뼱??">
<link rel="canonical" href="https://calc.ssoxxl.com/guides/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="怨꾩궛??>
<meta property="og:title" content="怨꾩궛??媛?대뱶 ??湲됱뿬쨌?멸툑쨌蹂댄뿕쨌?앺솢湲덉쑖 ?댁꽕 紐⑥쓬">
<meta property="og:description" content="怨꾩궛 寃곌낵瑜??쎈뒗 踰뺢퉴吏 ?④퍡 ?뺣━??怨꾩궛??媛?대뱶 紐⑥쓬?낅땲??">
<meta property="og:url" content="https://calc.ssoxxl.com/guides/">
<meta property="og:image" content="https://calc.ssoxxl.com/og-image.svg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="怨꾩궛??媛?대뱶 ??湲됱뿬쨌?멸툑쨌蹂댄뿕쨌?앺솢湲덉쑖 ?댁꽕 紐⑥쓬">
<meta name="twitter:description" content="?곕큺, ?댁쭅湲? ?ㅼ뾽湲됱뿬, ?곗감, 嫄닿컯蹂댄뿕猷? ?異??곹솚 諛⑹떇源뚯? 怨꾩궛???댁꽕 媛?대뱶瑜?紐⑥븘遊ㅼ뼱??">
<meta name="twitter:image" content="https://calc.ssoxxl.com/og-image.svg">
<meta name="daumoa-verification" content="52638bd43577858cdf80a388c3bf173be6b9be4914b8bde1a3b347cf6786f5b4:Xj5dg0WfAX454QfLeg8nBA==">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="shortcut icon" href="/favicon.svg">
<script>
(function(){
  var s=localStorage.getItem('gyesanwang_theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
  document.documentElement.setAttribute('data-theme',s);
})();
</script>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet">
<style>
:root{--bg:#f7f6f2;--surface:#fff;--surface2:#f0efe9;--border:#e2e0d8;--text:#1a1a18;--muted:#6e6d66;--accent:#2563eb;--accent-light:#eff6ff;}
[data-theme="dark"]{--bg:#0f0f14;--surface:#1a1a24;--surface2:#222230;--border:rgba(255,255,255,0.08);--text:#e8e8f0;--muted:#8b8ba0;--accent-light:rgba(37,99,235,0.15);}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--bg);color:var(--text);font-family:'Noto Sans KR',sans-serif;}
header{background:var(--surface);border-bottom:2px solid var(--border);padding:0 24px;height:56px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:100;}
.logo{font-size:18px;font-weight:900;letter-spacing:-1px;display:flex;align-items:center;gap:6px;text-decoration:none;color:var(--text);}
.logo-badge{background:#0a0a0f;color:#FFD700;font-size:11px;font-weight:700;padding:2px 7px;border-radius:4px;border:1px solid #D4A017;font-family:'Courier New',monospace;}
.back-btn{margin-left:auto;padding:6px 14px;border-radius:6px;border:1px solid var(--border);background:transparent;color:var(--muted);font-family:inherit;font-size:13px;text-decoration:none;}
.wrap{max-width:920px;margin:0 auto;padding:34px 24px 60px;}
.hero{background:var(--surface);border:1.5px solid var(--border);border-radius:16px;padding:28px;margin-bottom:20px;}
.hero h1{font-size:32px;letter-spacing:-1px;margin-bottom:10px;}
.hero p{font-size:15px;color:var(--muted);line-height:1.9;}
.guide-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;}
.guide-card{display:block;background:var(--surface);border:1.5px solid var(--border);border-radius:14px;padding:20px;text-decoration:none;color:var(--text);}
.guide-card:hover{border-color:var(--accent);}
.guide-tag{display:inline-block;padding:4px 8px;border-radius:999px;background:var(--accent-light);color:var(--accent);font-size:11px;font-weight:700;margin-bottom:10px;}
.guide-card strong{display:block;font-size:18px;line-height:1.5;margin-bottom:8px;}
.guide-card p{font-size:14px;color:var(--muted);line-height:1.8;}
.guide-card span.meta{display:block;font-size:12px;color:var(--muted);margin-top:10px;}
.note{background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:20px;margin-top:20px;font-size:14px;color:var(--muted);line-height:1.9;}
footer{background:#1a1a18;color:rgba(255,255,255,.5);text-align:center;padding:24px;font-size:12px;margin-top:40px;}
footer strong{color:#fff;}
@media(max-width:640px){.wrap{padding:18px 14px 48px;}.guide-grid{grid-template-columns:1fr;}.hero h1{font-size:26px;}}
</style>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-49J8CVJW33"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-49J8CVJW33');
</script>
</head>
<body>
<header>
  <a href="../" class="logo"><span>怨꾩궛??/span><span class="logo-badge">??/span></a>
  <a href="../" class="back-btn">???덉쑝濡?/a>
</header>
<div class="wrap">
  <div class="hero">
    <h1>怨꾩궛??媛?대뱶</h1>
    <p>怨꾩궛湲??レ옄留뚯쑝濡쒕뒗 ?ㅻ챸?섍린 ?대젮???댁슜???곕줈 ?뺣━?덉뒿?덈떎. 湲됱뿬, ?댁쭅湲? ?ㅼ뾽湲됱뿬, ?곗감, 嫄닿컯蹂댄뿕猷? ?異??곹솚 諛⑹떇泥섎읆 ?ㅼ젣濡?留롮씠 ?룰컝由щ뒗 二쇱젣瑜?吏곸옣??愿?먯뿉???쎄린 ?쎄쾶 ??대깄?덈떎.</p>
  </div>
  <div class="guide-grid">
    <a href="./salary-negotiation/" class="guide-card"><span class="guide-tag">湲됱뿬</span><strong>?곕큺 ?묒긽?????몄쟾蹂대떎 ?ㅼ닔?뱀븸??癒쇱? 遊먯빞 ?섎뒗 ?댁쑀</strong><p>鍮꾧낵???앸?, 媛議??? ?곸뿬 援ъ“源뚯? ?④퍡 ?쎌뼱???ㅼ젣 議곌굔 鍮꾧탳媛 ?ъ썙吏묐땲??</p><span class="meta">愿??怨꾩궛湲? ?곕큺 ?ㅼ닔?뱀븸 쨌 ?곕큺 ?쒖쐞</span></a>
    <a href="./severance-average-wage/" class="guide-card"><span class="guide-tag">?댁쭅湲?/span><strong>?댁쭅湲?怨꾩궛?먯꽌 ?됯퇏?꾧툑???ы븿?섎뒗 ??ぉ? 臾댁뾿?멸???</strong><p>?곸뿬湲? ?곗감?섎떦, 吏곸쟾 3媛쒖썡 湲됱뿬 蹂?숈씠 ?댁쭅湲덉뿉 誘몄튂???곹뼢???뺣━?덉뒿?덈떎.</p><span class="meta">愿??怨꾩궛湲? ?댁쭅湲?쨌 ?곗감</span></a>
    <a href="./unemployment-eligibility/" class="guide-card"><span class="guide-tag">?ㅼ뾽湲됱뿬</span><strong>?먯쭊?댁궗?몃뜲???ㅼ뾽湲됱뿬瑜?諛쏆쓣 ???덈뒗 ?덉쇅媛 ?덈굹??</strong><p>?섍툒 議곌굔怨??댁궗 ??梨숆꺼?????먮즺瑜?以묒떖?쇰줈 ?ㅻТ?뺤쑝濡??뺣━?덉뒿?덈떎.</p><span class="meta">愿??怨꾩궛湲? ?ㅼ뾽湲됱뿬 쨌 ?댁쭅湲?/span></a>
    <a href="./annual-leave-rules/" class="guide-card"><span class="guide-tag">?곗감</span><strong>?낆궗 泥ロ빐 ?곗감? ?뚭퀎?곕룄 湲곗? ?곗감???대뼸寃??ㅻⅨ媛??</strong><p>?낆궗 泥ロ빐 ?붿감, ?뚭퀎?곕룄 ?댁쁺, ?곗감?섎떦 ?뺤궛 ?ъ씤?몃? ?④퍡 ?ㅻ９?덈떎.</p><span class="meta">愿??怨꾩궛湲? ?곗감 쨌 ?≪븘?댁쭅</span></a>
    <a href="./health-insurance-paycheck/" class="guide-card"><span class="guide-tag">蹂댄뿕</span><strong>嫄닿컯蹂댄뿕猷뚭? ?ㅻⅤ硫??ㅼ닔?뱀븸? ?쇰쭏??以꾩뼱?쒕굹??</strong><p>湲됱뿬紐낆꽭?쒕? ?쎌쓣 ??嫄닿컯蹂댄뿕猷뚯? ?κ린?붿뼇蹂댄뿕猷뚮? ?대뼸寃?遊먯빞 ?섎뒗吏 ?ㅻ챸?⑸땲??</p><span class="meta">愿??怨꾩궛湲? 嫄닿컯蹂댄뿕猷?쨌 ?곕큺 ?ㅼ닔?뱀븸</span></a>
    <a href="./loan-repayment-methods/" class="guide-card"><span class="guide-tag">?異?/span><strong>?먮━湲덇퇏?? ?먭툑洹좊벑, 留뚭린?쇱떆?곹솚? ?대뼸寃??ㅻ?源뚯슂?</strong><p>湲덈━留뚯씠 ?꾨땲?????곹솚 援ъ“瑜?媛숈씠 遊먯빞 ?섎뒗 ?댁쑀瑜??ㅼ젣 ?앺솢鍮?愿?먯쑝濡??뺣━?덉뒿?덈떎.</p><span class="meta">愿??怨꾩궛湲? ?異??댁옄 쨌 ?붽툒??/span></a>
  </div>
  <div class="note">怨꾩궛?뺤? 怨꾩궛湲곕쭔 ?섏뿴?섎뒗 ??? ?ㅼ젣濡?寃?됰릺??吏덈Ц怨?怨듭떇 湲곗????④퍡 ?뺣━?섎뒗 諛⑺뼢?쇰줈 肄섑뀗痢좊? ?댁쁺?⑸땲?? ??媛?대뱶 臾몄꽌??怨꾩궛 寃곌낵 ?댁꽍???뺢린 ?꾪븳 李멸퀬 ?먮즺?대ŉ, ?뚯궗 洹쒖젙?대굹 ?쒕룄 媛쒗렪???곕씪 ?ㅼ젣 ?곸슜 寃곌낵媛 ?щ씪吏????덉뒿?덈떎.</div>
</div>
<footer><strong>怨꾩궛??/strong> ??怨꾩궛怨??댁꽕???④퍡 ?쒓났?섎뒗 吏곸옣???뺣낫 ?ъ씠??/footer>
</body>
</html>`;

  write('guides/index.html', guidesIndex);
}

function main() {
  patchIndex();
  patchAbout();
  patchCoreGuideLinks();
  createGuides();
  rebuildSitemap();

  [
    'lotto/index.html',
    'bmi/index.html',
    'bmr/index.html',
    'dday/index.html',
    'ovulation/index.html',
    'youtube/index.html',
    'coffee-savings/index.html',
  ].forEach(addNoindex);
}

main();
