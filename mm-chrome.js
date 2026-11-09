/* Mimulys 共用頁首頁尾：形象站與 1shop 載入同一份。改這裡，兩邊一起更新。 */
(function(){
  var SHOP='https://joselect.app1shop.net/';
  var onShop=/(^|\.)(app1shop\.net|my1shop\.com)$/.test(location.hostname);
  var src=document.currentScript&&document.currentScript.src||'';
  var BASE=src.replace(/mm-chrome\.js.*$/,'');

  var BRANDS=[['mimulys','Mimulys'],['riverbank','河岸金工'],['stillstone','靜石工作室']];
  /* 示意資料：商品屬於哪個品牌。正式上線改用 1shop 的「加強文字」欄位，不用寫在這裡。 */
  var PRODUCT_BRAND={'白水晶原石':'stillstone','粉晶方柱':'stillstone','粉晶原石三件組':'mimulys','鈦晶手珠':'mimulys','綠石金箔耳環':'mimulys','三色石金箔項鍊':'mimulys','銀色波紋項鍊':'riverbank','方框藍石項鍊':'riverbank'};
  var brandName=function(k){var b=BRANDS.filter(function(x){return x[0]===k})[0];return b?b[1]:''};

  /* 1shop 的根網址沒有內容，一律回形象站首頁 */
  if(onShop&&(location.pathname==='/'||location.pathname==='')){location.replace(BASE);return}

  var ICONS={search:'<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.500 4.500"/>',user:'<circle cx="12" cy="8.500" r="3.500"/><path d="M5 20c.8-3.800 3.500-5.500 7-5.500s6.200 1.700 7 5.500"/>',bag:'<path d="M5.500 8.500h13l1 11.500h-15z"/><path d="M9 11V7a3 3 0 0 1 6 0v4"/>',menu:'<path d="M4 7.500h16M4 12.500h16M4 17.500h16"/>',x:'<path d="m6 6 12 12M18 6 6 18"/>',chev:'<path d="m6 9.500 6 6 6-6"/>'};
  var ic=function(n){return '<svg class="mm-icon" viewBox="0 0 24 24" aria-hidden="true">'+ICONS[n]+'</svg>'};

  /* 連結：形象站頁面用 hash；從 1shop 回形象站時順便帶購物車數量 */
  var count=0;
  var b=function(r){return (onShop?BASE:'')+'#'+r};
  var s=function(p){return SHOP+p};
  var A=function(r,t,extra){return '<a data-b="'+r+'" href="'+b(r)+'"'+(extra||'')+'>'+t+'</a>'};
  var CAT={all:'categories/all',crystal:'categories/'+encodeURIComponent('水晶'),jewelry:'categories/'+encodeURIComponent('飾品')};

  function current(){
    if(onShop){
      var p=decodeURIComponent(location.pathname);
      if(p.indexOf('/categories/all')===0)return 'all';
      if(p.indexOf('/categories/水晶')===0)return 'crystal';
      if(p.indexOf('/categories/飾品')===0)return 'jewelry';
      var crumb=[].slice.call(document.querySelectorAll('.breadcrumb-item')).map(function(e){return e.textContent.trim()});
      if(crumb.indexOf('水晶')>-1)return 'crystal';
      if(crumb.indexOf('飾品')>-1)return 'jewelry';
      return '';
    }
    var r=(location.hash||'#home').slice(1);
    if(/^brand/.test(r))return 'brands';
    if(r==='about')return 'about';
    if(/^(journal|post-)/.test(r))return 'journal';
    if(/^guide/.test(r))return 'guide';
    return r==='home'||!r?'home':'';
  }

  var el=function(html){var t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstChild};
  var proto=el('<div class="mm-proto mm-wrap">提案原型：商品與價格皆為示意，請勿下單</div>');
  var head=el('<header class="mm-head mm-wrap"><div class="mm-inner mm-head-in">'
    +'<button class="mm-tool mm-menu-btn" data-mm-open aria-label="開啟選單">'+ic('menu')+'</button>'
    +'<a class="mm-logo" data-b="home" href="'+b('home')+'" aria-label="Mimulys 首頁"><img src="'+BASE+'img/mark.png" alt=""><img src="'+BASE+'img/wordmark.png" alt="Mimulys"></a>'
    +'<nav class="mm-nav" aria-label="主選單">'
    +'<a class="mm-navlink" data-nav="all" href="'+s(CAT.all)+'">全部選物</a>'
    +'<a class="mm-navlink" data-nav="crystal" href="'+s(CAT.crystal)+'">水晶</a>'
    +'<a class="mm-navlink" data-nav="jewelry" href="'+s(CAT.jewelry)+'">飾品</a>'
    +'<span class="mm-dd">'+A('brands','品牌',' class="mm-navlink" data-nav="brands"')+ic('chev')+'<span class="mm-dd-menu"><div>'+BRANDS.map(function(x){return A('brand-'+x[0],x[1])}).join('')+'</div></span></span>'
    +A('about','關於',' class="mm-navlink" data-nav="about"')
    +A('journal','札記',' class="mm-navlink" data-nav="journal"')
    +'</nav>'
    +'<div class="mm-tools">'
    +'<button class="mm-tool" data-mm-search aria-label="搜尋" aria-expanded="false">'+ic('search')+'</button>'
    +'<a class="mm-tool mm-tool-member" href="'+s('login')+'" aria-label="會員">'+ic('user')+'</a>'
    +'<a class="mm-tool" href="'+s('cart')+'" aria-label="購物車">'+ic('bag')+'<span class="mm-count" data-mm-count hidden>0</span></a>'
    +'</div></div></header>');
  var search=el('<div class="mm-search mm-wrap" hidden><form action="'+s('search/')+'" method="get" role="search"><input type="search" name="query" placeholder="搜尋品名" aria-label="搜尋商品"><button>搜尋</button></form></div>');
  var scrim=el('<div class="mm-scrim"></div>');
  var drawer=el('<aside class="mm-drawer" role="dialog" aria-modal="true" aria-label="選單" tabindex="-1">'
    +'<button class="mm-tool mm-drawer-close" data-mm-close aria-label="關閉選單">'+ic('x')+'</button>'
    +'<nav class="mm-mobile-nav" aria-label="選單">'
    +A('home','首頁',' data-nav="home"')
    +'<a data-nav="all" href="'+s(CAT.all)+'">全部選物</a>'
    +'<a data-nav="crystal" href="'+s(CAT.crystal)+'">水晶</a>'
    +'<a data-nav="jewelry" href="'+s(CAT.jewelry)+'">飾品</a>'
    +A('brands','品牌',' data-nav="brands"')
    +'<div class="mm-sub">'+BRANDS.map(function(x){return A('brand-'+x[0],x[1])}).join('')+'</div>'
    +A('about','關於',' data-nav="about"')
    +A('journal','札記',' data-nav="journal"')
    +A('guide','購物說明',' data-nav="guide"')
    +'<a href="'+s('login')+'">會員登入</a>'
    +'<div class="mm-nav-contact">聯絡我們<br>contact@tonitrusillustris.com</div>'
    +'</nav></aside>');
  var foot=el('<footer class="mm-foot mm-wrap"><div class="mm-inner"><div class="mm-foot-grid">'
    +'<div><img class="mm-foot-mark" src="'+BASE+'img/mark.png" alt=""><p class="mm-foot-line">寧靜的美，能夠給予內心力量。</p></div>'
    +'<div><h3>選物</h3><ul><li><a href="'+s(CAT.all)+'">全部商品</a></li><li><a href="'+s(CAT.crystal)+'">水晶</a></li><li><a href="'+s(CAT.jewelry)+'">飾品</a></li></ul></div>'
    +'<div><h3>認識</h3><ul><li>'+A('brands','品牌')+'</li><li>'+A('about','關於 Mimulys')+'</li><li>'+A('journal','札記')+'</li></ul></div>'
    +'<div><h3>協助</h3><ul><li>'+A('guide','購物說明')+'</li><li>'+A('guide-contact','聯絡我們')+'</li><li><a href="'+s('login')+'">會員登入</a></li></ul></div>'
    +'</div><p class="mm-foot-note">大雷禹有限公司 Tonitrus Illustris Ltd.｜contact@tonitrusillustris.com｜Instagram @jennchiang_<br>世界觀插畫：鄭宜芳。部分商品與情境照片來自 Pexels，正式上線會換成 Mimulys 自己拍攝的影像。</p></div></footer>');

  /* 分頁小圖示與標題：兩站一致 */
  [].forEach.call(document.querySelectorAll('link[rel~="icon"],link[rel="apple-touch-icon"]'),function(l){l.parentNode.removeChild(l)});
  [['icon','img/favicon.png'],['apple-touch-icon','img/apple-touch-icon.png']].forEach(function(x){var l=document.createElement('link');l.rel=x[0];l.href=BASE+x[1];document.head.appendChild(l)});
  if(onShop){
    var fixTitle=function(){var t=document.title.split(/ - |｜/)[0].trim();var want=(t&&!/^(Mimulys|Joseph選品店)$/.test(t)?t+'｜':'')+'Mimulys';if(document.title!==want)document.title=want};
    fixTitle();
    var tt=document.querySelector('title');if(tt)new MutationObserver(fixTitle).observe(tt,{childList:true});
  }

  /* 掛到頁面 */
  var body=document.body;
  body.insertBefore(search,body.firstChild);
  body.insertBefore(head,search);
  body.insertBefore(proto,head);
  body.appendChild(scrim);
  body.appendChild(drawer);
  var shopFoot=onShop&&document.querySelector('.footer');
  if(shopFoot)shopFoot.parentNode.insertBefore(foot,shopFoot);else body.appendChild(foot);
  body.classList.add('mm-ready');

  /* 目前頁面底線 */
  function setActive(){
    var c=current();
    [].forEach.call(document.querySelectorAll('[data-nav]'),function(a){
      if(a.getAttribute('data-nav')===c)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });
  }

  /* 購物車數量：1shop 讀真實數字；形象站顯示 1shop 帶過來的數字 */
  function setCount(n){
    count=Number(n)||0;
    [].forEach.call(document.querySelectorAll('[data-mm-count]'),function(e){e.textContent=count;e.hidden=count===0});
    if(onShop)[].forEach.call(document.querySelectorAll('[data-b]'),function(a){
      a.href=BASE+(count?'?c='+count:'')+'#'+a.getAttribute('data-b');
    });
  }
  if(onShop){
    var badge=document.querySelector('.head-tool .cart-badge');
    if(badge){setCount(badge.textContent.trim());new MutationObserver(function(){setCount(badge.textContent.trim())}).observe(badge,{childList:true,characterData:true,subtree:true})}
  }else{
    var q=new URLSearchParams(location.search),c=q.get('c');
    try{
      if(c!==null){localStorage.setItem('mm-cart-count',c);history.replaceState(null,'',location.pathname+location.hash)}
      setCount(localStorage.getItem('mm-cart-count')||0);
    }catch(e){setCount(c||0)}
    window.addEventListener('hashchange',function(){setActive();closeNav();closeSearch()});
  }

  /* 開合 */
  var last=null;
  function openNav(){last=document.activeElement;scrim.classList.add('on');drawer.classList.add('on');body.style.overflow='hidden';setTimeout(function(){drawer.focus()},30)}
  function closeNav(){if(!drawer.classList.contains('on'))return;scrim.classList.remove('on');drawer.classList.remove('on');body.style.overflow='';if(last&&document.contains(last))last.focus()}
  function closeSearch(){search.hidden=true;var t=head.querySelector('[data-mm-search]');t.setAttribute('aria-expanded','false')}
  document.addEventListener('click',function(ev){
    var t=ev.target.closest?ev.target.closest('[data-mm-open],[data-mm-close],[data-mm-search],.mm-drawer a'):null;
    if(ev.target===scrim){closeNav();return}
    if(!t)return;
    if(t.hasAttribute('data-mm-open'))openNav();
    else if(t.hasAttribute('data-mm-close'))closeNav();
    else if(t.hasAttribute('data-mm-search')){search.hidden=!search.hidden;t.setAttribute('aria-expanded',String(!search.hidden));if(!search.hidden)search.querySelector('input').focus()}
    else closeNav();
  });
  document.addEventListener('keydown',function(ev){if(ev.key==='Escape'){closeNav();closeSearch()}});

  /* 1shop 頁面內容：分類頁頭、商品品牌、價格格式，對齊形象站 */
  function money(){
    [].forEach.call(document.querySelectorAll('.amount'),function(a){
      var n=a.textContent.replace(/[^\d]/g,'');if(n)a.textContent=Number(n).toLocaleString('en-US');
    });
  }
  function shopPage(){
    var page=current(),isCat=/^\/categories\//.test(location.pathname);
    if(isCat){
      var title={all:'全部選物',crystal:'水晶',jewelry:'飾品'}[page]||'';
      var cur=function(k){return k===page?' aria-current="page"':''};
      var html=el('<div class="mm-shop-head">'
        +'<div class="mm-page-head">'+(page!=='all'?'<nav class="mm-crumb" aria-label="導覽路徑"><a href="'+s(CAT.all)+'">選物</a><span>/</span><span>'+title+'</span></nav>':'')+'<h1>'+title+'</h1></div>'
        +'<div class="mm-shopbar"><a class="mm-pill" href="'+s(CAT.all)+'"'+cur('all')+'>全部</a><a class="mm-pill" href="'+s(CAT.crystal)+'"'+cur('crystal')+'>水晶</a><a class="mm-pill" href="'+s(CAT.jewelry)+'"'+cur('jewelry')+'>飾品</a></div></div>');
      var side=document.querySelector('.page-archive .clearfix');
      if(side)side.parentNode.insertBefore(html,side);
    }
    [].forEach.call(document.querySelectorAll('.single-product'),function(card){
      var t=card.querySelector('.single-product-text .title');if(!t)return;
      var k=PRODUCT_BRAND[t.textContent.trim()];
      if(k)t.parentNode.insertBefore(el('<span class="mm-card-brand">'+brandName(k)+'</span>'),t);
    });
    var h1=document.querySelector('.product-data h1.title');
    if(h1){
      var k=PRODUCT_BRAND[h1.textContent.trim()];
      if(k)h1.parentNode.insertBefore(el('<a class="mm-buy-brand" data-b="brand-'+k+'" href="'+b('brand-'+k)+'">'+brandName(k)+'</a>'),h1);
    }
    var home=document.querySelector('.breadcrumb-item a');
    if(home){home.setAttribute('data-b','home');home.href=b('home')}
    money();
    if(badge)setCount(badge.textContent.trim());
  }
  if(onShop)shopPage();
  setActive();
  window.MM={SHOP:SHOP,CAT:CAT,BRANDS:BRANDS,setActive:setActive};
})();
