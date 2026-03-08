const SITE_BASE = window.__FRIDGELY_SITE_BASE__ || '/';
const SITE_ORIGIN = window.__FRIDGELY_SITE_ORIGIN__ || 'https://fridgely.app';
const EMAIL_HELLO = 'hello@fridgely.app';
const EMAIL_PRIVACY = 'privacy@fridgely.app';
const STATIC_PAGE_MAP = {
  '/': 'index.html',
  '/privacy': 'privacy-policy.html',
  '/terms': 'terms.html',
  '/premium': 'premium.html',
  '/support': 'support.html',
  '/recipes': 'recipes.html',
  '/inventory': 'inventory.html',
  '/shopping': 'shopping.html',
  '/recipe': 'recipe.html',
  '/invite/family': 'invite-family.html',
};

const app = document.getElementById('app');

function pageHref(route) {
  const normalized = route === '/' ? '/' : `/${String(route).replace(/^\/+/, '')}`;
  if (normalized.startsWith('/#')) {
    return `${SITE_BASE}${normalized.slice(1)}`;
  }

  const target = STATIC_PAGE_MAP[normalized];
  if (target) {
    return normalized === '/' ? SITE_BASE : `${SITE_BASE}${target}`;
  }

  return `${SITE_BASE}${normalized.replace(/^\//, '')}`;
}

function normalizePath(pathname) {
  let value = pathname || '/';
  const normalizedBase =
    SITE_BASE !== '/' && SITE_BASE.endsWith('/') ? SITE_BASE.slice(0, -1) : SITE_BASE;

  if (normalizedBase && normalizedBase !== '/' && value.startsWith(normalizedBase)) {
    value = value.slice(normalizedBase.length) || '/';
  }

  if (!value.startsWith('/')) value = `/${value}`;

  const aliases = new Map([
    ['/index.html', '/'],
    ['/privacy-policy.html', '/privacy'],
    ['/terms.html', '/terms'],
    ['/premium.html', '/premium'],
    ['/support.html', '/support'],
    ['/recipes.html', '/recipes'],
    ['/inventory.html', '/inventory'],
    ['/shopping.html', '/shopping'],
    ['/recipe.html', '/recipe'],
    ['/invite-family.html', '/invite/family'],
  ]);

  return aliases.get(value) || value;
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('fridgely-theme', theme);
}

function initialTheme() {
  const saved = localStorage.getItem('fridgely-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setMeta({ title, description, canonicalPath }) {
  const canonical = `${SITE_ORIGIN}${canonicalPath}`;
  document.title = title;
  const descriptionNode = document.getElementById('meta-description');
  const canonicalNode = document.getElementById('canonical-link');
  const ogTitle = document.getElementById('og-title');
  const ogDescription = document.getElementById('og-description');
  const ogUrl = document.getElementById('og-url');
  const twitterTitle = document.getElementById('twitter-title');
  const twitterDescription = document.getElementById('twitter-description');

  if (descriptionNode) descriptionNode.setAttribute('content', description);
  if (canonicalNode) canonicalNode.setAttribute('href', canonical);
  if (ogTitle) ogTitle.setAttribute('content', title);
  if (ogDescription) ogDescription.setAttribute('content', description);
  if (ogUrl) ogUrl.setAttribute('content', canonical);
  if (twitterTitle) twitterTitle.setAttribute('content', title);
  if (twitterDescription) twitterDescription.setAttribute('content', description);
}

function button({ label, appHref, fallbackHref, href, variant = 'primary' }) {
  if (href) {
    return `<a class="button button-${variant}" href="${href}">${label}</a>`;
  }
  return `<button class="button button-${variant}" type="button" data-open-app="${appHref}" data-fallback="${fallbackHref}">${label}</button>`;
}

function renderItems(items, className = 'legal-list') {
  return `<ul class="${className}">${(items || [])
    .map((item) => `<li>${item}</li>`)
    .join('')}</ul>`;
}

function topbar({ compact = false } = {}) {
  return `
    <header class="topbar">
      <a class="brand-lockup" href="${pageHref('/')}">
        <span class="brand-mark" aria-hidden="true"></span>
        <span class="brand-text">
          <strong>Fridgely</strong>
          <span>Mutfak operasyon sistemi</span>
        </span>
      </a>
      <nav class="nav-links" aria-label="Ana menü">
        <a href="${pageHref('/#system-map')}">Sistem</a>
        <a href="${pageHref('/#flows')}">Akışlar</a>
        <a href="${pageHref('/#pricing')}">Premium</a>
        <a href="${pageHref('/#support-hub')}">Destek</a>
      </nav>
      <div class="nav-actions">
        ${compact ? `<a class="secondary-link secondary-link-quiet" href="${pageHref('/')}">Ana sayfa</a>` : ''}
        ${button({
          label: 'Uygulamayı Aç',
          appHref: 'fridgely://inventory',
          fallbackHref: pageHref('/support'),
          variant: 'primary',
        })}
        <button class="theme-toggle" type="button" data-theme-toggle aria-label="Temayı değiştir">Tema</button>
      </div>
    </header>
  `;
}

function footer() {
  return `
    <footer class="footer">
      <div class="footer-copy">
        <strong>Fridgely</strong>
        <small>
          Tarayıcı, envanter, yapay zeka tarif akışı, alışveriş listesi ve paylaşılabilir link deneyimleri aynı sistemde buluşur.
        </small>
      </div>
      <div class="footer-links">
        <a href="${pageHref('/#pricing')}">Premium</a>
        <a href="${pageHref('/privacy')}">Gizlilik</a>
        <a href="${pageHref('/terms')}">Koşullar</a>
        <a href="${pageHref('/support')}">Destek</a>
        <a href="mailto:${EMAIL_HELLO}">İletişim</a>
      </div>
    </footer>
  `;
}

function homePage() {
  setMeta({
    title: 'Fridgely | Mutfak operasyonunu tek akışta topla',
    description:
      'Fridgely ile stok görünürlüğünü kur, AI tarif kararını hızlandır, alışveriş akışını temizle ve paylaşılabilir linkleri profesyonel şekilde yönet.',
    canonicalPath: '/',
  });

  return `
    <div class="site-shell">
      ${topbar()}
      <main id="main-content">
        <section class="hero">
          <article class="hero-copy">
            <div class="eyebrow">Fridgely Kitchen OS</div>
            <div class="hero-kicker">Mutfak operasyonu</div>
            <h1 class="display">Dağınık mutfak kararlarını tek akışta toplar.</h1>
            <p class="lead">
              Fridgely; tarama, stok görünürlüğü, AI tarif, alışveriş listesi ve aile paylaşımını aynı ritimde birleştirir. Kullanıcıyı özellikler arasında dolaştırmak yerine bir sonraki doğru kararı görünür kılar.
            </p>
            <div class="hero-actions">
              ${button({
                label: 'Uygulamayı Aç',
                appHref: 'fridgely://inventory',
                fallbackHref: pageHref('/support'),
                variant: 'primary',
              })}
              <a class="secondary-link" href="#pricing">Premium farklarını gör</a>
            </div>
            <div class="hero-highlights">
              <article>
                <strong>Görünürlük</strong>
                <span>Fiş, raf ve barkod kaynaklarını tek yüzeye toplar.</span>
              </article>
              <article>
                <strong>Karar</strong>
                <span>Elindekilerle ne pişeceğini ve neyin eksik kaldığını netleştirir.</span>
              </article>
              <article>
                <strong>Senkron</strong>
                <span>Aile, alışveriş ve paylaşılan linkleri aynı bağlamda tutar.</span>
              </article>
            </div>
          </article>
          <aside class="hero-visual" aria-label="Fridgely ürün önizlemesi">
            <div class="kitchen-brief">
              <div class="brief-header">
                <div>
                  <span class="brief-label">Canlı ürün katmanı</span>
                  <strong>Bugünün mutfak özeti</strong>
                </div>
                <span class="brief-pill">Preview</span>
              </div>
              <div class="brief-metrics">
                <article class="brief-metric">
                  <strong>Tarama</strong>
                  <span>Fiş, raf ve barkod girişleri tek ritimde.</span>
                </article>
                <article class="brief-metric">
                  <strong>Tarif</strong>
                  <span>Mevcut malzemeye göre üretim ve eksik kontrolü.</span>
                </article>
                <article class="brief-metric">
                  <strong>Paylaşım</strong>
                  <span>Liste, davet ve deep-link akışları aynı domain altında.</span>
                </article>
              </div>
              <div class="brief-grid">
                <article class="brief-card">
                  <h3>Şimdi önemli olanlar</h3>
                  ${renderItems([
                    'Kritik ürünleri önce görünür kıl.',
                    'Eksik malzemeyi alışveriş akışına taşı.',
                    'Tariften listeye, listeden aile paylaşımına geç.',
                  ], 'brief-list')}
                </article>
                <article class="brief-card brief-card-accent">
                  <h3>Fridgely neyi bağlar?</h3>
                  ${renderItems([
                    'Scanner -> Inventory',
                    'Inventory -> Recipe',
                    'Recipe -> Shopping',
                    'Invite -> Shared access',
                  ], 'brief-list')}
                </article>
              </div>
              <div class="brief-note">
                <strong>Landing tek başına kalmaz.</strong>
                Uygulama linki açılmazsa kullanıcı boş ekrana değil, markalı fallback akışına düşer.
              </div>
            </div>
          </aside>
        </section>

        <section class="proof-strip" aria-label="Ürün ilkeleri">
          <article class="proof-intro">
            <div class="eyebrow">Neden daha profesyonel hissettirir</div>
            <p>Fridgely yalnızca özellikleri listelemez; kullanıcıyı bir sonraki adıma taşıyan düzenli bir ürün dili kurar.</p>
          </article>
          <article class="proof-chip">
            <strong>Tek ürün anlatısı</strong>
            <span>Landing, support, premium ve share yüzeyleri aynı dili konuşur.</span>
          </article>
          <article class="proof-chip">
            <strong>Net karar anları</strong>
            <span>Her sayfa kullanıcıyı ya uygulamaya ya da doğru destek akışına taşır.</span>
          </article>
          <article class="proof-chip">
            <strong>Boşa düşmeyen linkler</strong>
            <span>Tarif, davet ve liste linkleri markalı fallback katmanıyla tamamlanır.</span>
          </article>
        </section>

        <section class="section" id="system-map">
          <div class="section-head">
            <div>
              <div class="eyebrow">Sistem haritası</div>
              <h2>Sistem, mutfaktaki üç temel işi netleştirir.</h2>
            </div>
            <p>
              Profesyonel his, daha fazla kart koymaktan değil; tarama, karar ve senkron anlarını kopmadan bağlamaktan gelir.
            </p>
          </div>
          <div class="journey-grid">
            <div class="journey-main">
              <article class="journey-step">
                <div class="step-no">01</div>
                <div>
                  <h3>Girdiyi topla</h3>
                  <p>Raf, fiş ve barkod kaynaklarını tek akışta toplayarak stok görünürlüğünü elde eder.</p>
                </div>
              </article>
              <article class="journey-step">
                <div class="step-no">02</div>
                <div>
                  <h3>Kararı hızlandır</h3>
                  <p>AI tarif sistemi, elindekilerden üretim çıkarır ve eksikleri liste akışına taşır.</p>
                </div>
              </article>
              <article class="journey-step">
                <div class="step-no">03</div>
                <div>
                  <h3>Paylaş ve sürdür</h3>
                  <p>Aile daveti, premium geçişleri ve share linkleri kullanıcıyı koparmadan doğru yüzeye yönlendirir.</p>
                </div>
              </article>
            </div>
            <aside class="aside-quote">
              <blockquote>“Bu site yalnızca pazarlama katmanı değil, ürünün dış dünyadaki operasyon yüzeyi.”</blockquote>
              ${renderItems([
                'Premium farkları karar vermeyi kolaylaştıracak kadar net anlatılır.',
                'Gizlilik, koşullar ve destek dağınık linkler yerine tek sistemde kalır.',
                'Share linkleri uygulama yüklü değilse bile profesyonel bir giriş ekranı sunar.',
              ], 'pill-list')}
            </aside>
          </div>
        </section>

        <section class="section" id="flows">
          <div class="section-head">
            <div>
              <div class="eyebrow">Ürün yüzeyleri</div>
              <h2>Yalnızca tarif üreten bir uygulama gibi davranmaz.</h2>
            </div>
            <p>
              Değer, tek bir özelliğin parlaklığından değil; farklı mutfak görevlerinin ortak bir dil ve akış altında toparlanmasından gelir.
            </p>
          </div>
          <div class="feature-grid feature-grid-wide">
            <article class="feature-card">
              <div class="feature-icon">01</div>
              <h3>Tarayıcı ve giriş</h3>
              <p>Manuel giriş yükünü düşürür; stok görünürlüğünü baştan daha güvenilir kurar.</p>
            </article>
            <article class="feature-card feature-card-spotlight">
              <div class="feature-icon">02</div>
              <h3>AI tarif motoru</h3>
              <p>Elindekilerden üretim çıkarır, eksik malzemeyi görünür kılar ve alışveriş kararını aynı bağlamda bırakır.</p>
            </article>
            <article class="feature-card">
              <div class="feature-icon">03</div>
              <h3>Liste ve planlama</h3>
              <p>Eksik ürünlerin alışverişe taşınması ve tekrar bulunması daha kısa bir karar döngüsü yaratır.</p>
            </article>
            <article class="feature-card">
              <div class="feature-icon">04</div>
              <h3>Davet ve fallback</h3>
              <p>Paylaşılan tarif, davet ve deep-link rotaları uygulama yüklü değilse bile markalı şekilde devam eder.</p>
            </article>
          </div>
        </section>

        <section class="section" id="pricing">
          <div class="section-head">
            <div>
              <div class="eyebrow">Premium</div>
              <h2>Free ile düzen kur, Pro ile ritmi büyüt.</h2>
            </div>
            <p>
              Satın alma uygulama içinde kalır; bu yüzey ise hangi kullanım anında neden yükseltme gerektiğini sakin ve anlaşılır biçimde açıklar.
            </p>
          </div>
          <div class="pricing-grid">
            <article class="pricing-card">
              <div class="pricing-tag">Free</div>
              <div class="price">Düzen kur <span>/ tek kullanıcı başlangıcı</span></div>
              ${renderItems([
                'Temel tarama ve stok görünürlüğü',
                'Günlük tarif kararları için limitli üretim',
                'Alışveriş ve envanter akışına giriş',
              ], 'pricing-list')}
            </article>
            <article class="pricing-card pricing-card--accent">
              <div class="pricing-tag">Pro</div>
              <div class="price">Akışı büyüt <span>/ aile ve yoğun kullanım</span></div>
              ${renderItems([
                'Daha geniş tarif üretimi ve karar desteği',
                '30 günlük aile daveti ve paylaşılabilir akışlar',
                'Beslenme, tasarruf ve daha ileri planlama yüzeyleri',
              ], 'pricing-list')}
              <div class="stack-actions">
                ${button({
                  label: 'Premium ekranını aç',
                  appHref: 'fridgely://recipes',
                  fallbackHref: pageHref('/premium'),
                  variant: 'primary',
                })}
                <a class="secondary-link" href="${pageHref('/support')}">SSS ve destek</a>
              </div>
            </article>
          </div>
          <article class="comparison-note">
            <div class="eyebrow">Satın alma notu</div>
            <p>Plan yönetimi ve satın alma uygulama içinde kalır. Web yüzeyi ise karar öncesi açıklama, destek ve güven katmanı olarak çalışır.</p>
          </article>
        </section>

        <section class="section" id="support-hub">
          <div class="section-head">
            <div>
              <div class="eyebrow">Destek ve yönlendirme</div>
              <h2>Bağlantı boşa düşmesin diye tasarlandı.</h2>
            </div>
            <p>Share linkleri, premium karar anı ve destek ihtiyaçları için her sayfanın net bir sonraki adımı vardır.</p>
          </div>
          <div class="support-grid support-grid-triage">
            <article class="support-card">
              <h3>Uygulamayı geri aç</h3>
              <p>Davet, tarif veya alışveriş rotasından geldiysen doğrudan uygulamaya dönmeyi dene.</p>
              <div class="stack-actions">
                ${button({
                  label: 'Fridgely’yi aç',
                  appHref: 'fridgely://inventory',
                  fallbackHref: pageHref('/support'),
                  variant: 'primary',
                })}
              </div>
            </article>
            <article class="support-card">
              <h3>Premium farklarını netleştir</h3>
              <p>Satın alma ekranı uygulamada kalsa da hangi akışların neden Pro'ya geçtiğini burada görebilirsin.</p>
              <div class="stack-actions">
                <a class="button button-secondary" href="${pageHref('/premium')}">Premium sayfası</a>
              </div>
            </article>
            <article class="support-card">
              <h3>Ekiple konuş</h3>
              <p>Ürün, roadmap, iş birlikleri veya teknik sorular için doğrudan yaz.</p>
              <div class="stack-actions">
                <a class="button button-secondary" href="mailto:${EMAIL_HELLO}">E-posta gönder</a>
              </div>
            </article>
          </div>
          <div class="support-grid support-grid-faq">
            <article class="faq-card">
              <h3>Bu web yüzeyi ne yapar?</h3>
              <p>Ürün anlatısını taşır, app dışı linkleri toplar ve paylaşılan rotalar için markalı fallback görevi görür.</p>
            </article>
            <article class="faq-card">
              <h3>Satın alma burada mı?</h3>
              <p>Hayır. Satın alma uygulamada kalır; bu site karar desteği, yönlendirme ve güven katmanı sağlar.</p>
            </article>
            <article class="faq-card">
              <h3>Paylaşılan link açılmazsa ne olur?</h3>
              <p>Kullanıcı boş bir ekrana düşmez; ilgili akışı açıklayan sayfaya ve doğru aksiyona yönlendirilir.</p>
            </article>
          </div>
        </section>
      </main>
      ${footer()}
    </div>
  `;
}

function supportPage() {
  setMeta({
    title: 'Fridgely Support | Destek ve yönlendirme merkezi',
    description: 'Fridgely destek yüzeyi, uygulamayı açma, ürün akışını anlama ve doğru yardım kanalına geçme için tasarlandı.',
    canonicalPath: '/support',
  });

  return `
    <div class="site-shell">
      ${topbar({ compact: true })}
      <main id="main-content" class="section">
        <div class="section-head">
          <div>
            <div class="eyebrow">Support Hub</div>
            <h2>Destek, yönlendirme ve sonraki adım aynı yerde.</h2>
          </div>
          <p>Bu yüzeyin amacı kullanıcıyı durdurmak değil; doğru aksiyona taşımak. Uygulamaya dön, ilgili sayfayı aç veya ekiple doğrudan iletişime geç.</p>
        </div>
        <div class="support-grid support-grid-triage">
          <article class="support-card">
            <h3>Uygulamayı tekrar aç</h3>
            <p>Davet, tarif veya alışveriş bağlantısından geldiysen doğrudan ilgili akışa geri dönmeyi dene.</p>
            <div class="stack-actions">
              ${button({
                label: 'Fridgely’yi aç',
                appHref: 'fridgely://inventory',
                fallbackHref: pageHref('/'),
                variant: 'primary',
              })}
            </div>
          </article>
          <article class="support-card">
            <h3>Doğru sayfaya git</h3>
            <p>Premium farkları, gizlilik veya kullanım koşulları için ilgili yüzeye temiz bir şekilde geçebilirsin.</p>
            <div class="stack-actions">
              <a class="button button-secondary" href="${pageHref('/premium')}">Premium</a>
              <a class="secondary-link" href="${pageHref('/privacy')}">Gizlilik</a>
            </div>
          </article>
          <article class="support-card">
            <h3>İletişim</h3>
            <p>Ürün, yol haritası, ortaklık veya teknik destek için doğrudan ekibe yaz.</p>
            <div class="stack-actions">
              <a class="button button-secondary" href="mailto:${EMAIL_HELLO}">${EMAIL_HELLO}</a>
            </div>
          </article>
        </div>
        <article class="comparison-note">
          <div class="eyebrow">Destek ilkesi</div>
          <p>Fridgely paylaşılan linkleri ve app dışı yönlendirmeleri yardım almadan anlaşılır hale getirmeyi hedefler; bu yüzden her destek sayfası açık bir sonraki adım içerir.</p>
        </article>
        <div class="support-grid support-grid-faq">
          <article class="faq-card">
            <h3>Web site neden gerekli?</h3>
            <p>Yalnızca tanıtım için değil; share linkleri, legal içerik ve app dışı yönlendirmeler için güvenilir bir ürün yüzeyi olduğu için.</p>
          </article>
          <article class="faq-card">
            <h3>Satın alma burada mı?</h3>
            <p>Hayır. Bu sayfalar bilgi ve yönlendirme katmanıdır; satın alma uygulama içinde kalır.</p>
          </article>
        </div>
      </main>
      ${footer()}
    </div>
  `;
}

function premiumPage() {
  setMeta({
    title: 'Fridgely Premium | Plan farkları ve kullanım ritmi',
    description: 'Fridgely Premium farklarını, hangi kullanım anında anlamlı hale geldiğini ve satın alma öncesi karar çerçevesini görün.',
    canonicalPath: '/premium',
  });

  return `
    <div class="site-shell">
      ${topbar({ compact: true })}
      <main id="main-content" class="section">
        <div class="section-head">
          <div>
            <div class="eyebrow">Premium</div>
            <h2>Daha fazla üretim, daha temiz bir kullanım ritmi.</h2>
          </div>
          <p>Bu sayfa satın alma ekranı değildir; karar öncesi farkları, kim için anlamlı olduğunu ve premium akışların neden var olduğunu netleştirir.</p>
        </div>
        <div class="pricing-grid">
          <article class="pricing-card">
            <div class="pricing-tag">Free</div>
            <h3>Önce düzen kur</h3>
            ${renderItems([
              'Temel tarama ve stok görünürlüğü',
              'Günlük kullanım için limitli tarif üretimi',
              'Alışveriş ve envanter akışına giriş',
            ], 'pricing-list')}
          </article>
          <article class="pricing-card pricing-card--accent">
            <div class="pricing-tag">Pro</div>
            <h3>Sonra ritmi büyüt</h3>
            ${renderItems([
              'Daha geniş üretim limitleri ve daha sık kullanım',
              'Family guest invite ve paylaşılabilir ürün akışları',
              'Beslenme, tasarruf ve daha ileri planlama kartları',
            ], 'pricing-list')}
            <div class="stack-actions">
              ${button({
                label: 'Uygulamada premium ekranını aç',
                appHref: 'fridgely://recipes',
                fallbackHref: pageHref('/#pricing'),
                variant: 'primary',
              })}
              <a class="secondary-link" href="${pageHref('/support')}">Destek sorularını gör</a>
            </div>
          </article>
        </div>
        <div class="support-grid support-grid-triage">
          <article class="support-card">
            <h3>Kim için doğru an?</h3>
            <p>Aynı mutfakta birden fazla kişi varsa, share linkleri aktif kullanılıyorsa veya tarif akışı günlük bir karar aracıysa Pro daha anlamlı hale gelir.</p>
          </article>
          <article class="support-card">
            <h3>Satın alma nerede?</h3>
            <p>Satın alma ve plan yönetimi uygulama içinde kalır. Web tarafı yalnızca açıklama, güven ve yönlendirme görevini üstlenir.</p>
          </article>
          <article class="support-card">
            <h3>Karar vermeden önce</h3>
            <p>Önce destek ve gizlilik sayfalarını, sonra premium akışını inceleyerek ürünün nasıl konumlandığını daha net görebilirsin.</p>
          </article>
        </div>
      </main>
      ${footer()}
    </div>
  `;
}

function legalPage(kind) {
  if (kind === 'privacy') {
    setMeta({
      title: 'Fridgely Privacy | Gizlilik politikası',
      description: 'Fridgely gizlilik yaklaşımı, veri kategorileri ve iletişim bilgileri.',
      canonicalPath: '/privacy',
    });

    return `
      <div class="site-shell">
        ${topbar({ compact: true })}
        <main id="main-content" class="section legal-layout">
          <article class="legal-card">
            <div class="eyebrow">Privacy</div>
            <h1>Gizlilik yaklaşımı açık ve izlenebilir kalmalı.</h1>
            <div class="legal-meta">Son güncelleme: 8 Mart 2026</div>
            <p>Fridgely; mutfak envanteri, tarif akışı ve kullanıcı tercihleri için minimum gerekli veriyi işlemeyi hedefler. Paylaşım akışlarında kullanıcıyı karanlık desene iten belirsiz yönlendirmeler yerine açık kontrol sunar.</p>
            <h2>Toplanan başlıca veri tipleri</h2>
            ${renderItems([
              'Envanter, favori ve alışveriş listesi içerikleri',
              'Tarama ve kullanım geçmişine ait uygulama içi tercihler',
              'Paylaşım ve davet akışları için gerekli bağlantı metadatası',
            ], 'legal-list')}
            <h2>Kullanıcı kontrolleri</h2>
            ${renderItems([
              'Uygulama içinden veri özeti ve dışa aktarma',
              'Anonim analiz ve kişiselleştirme tercihlerinin yönetimi',
              'Veri silme ve iletişim kanalları',
            ], 'legal-list')}
          </article>
          <aside class="support-card">
            <h3>İletişim</h3>
            <p>Gizlilik soruları ve veri talepleri için doğrudan ulaşılabilecek kanal:</p>
            <div class="stack-actions">
              <a class="button button-secondary" href="mailto:${EMAIL_PRIVACY}">${EMAIL_PRIVACY}</a>
              <a class="secondary-link" href="${pageHref('/terms')}">Kullanım koşulları</a>
            </div>
            ${renderItems([
              'KVKK / GDPR farkındalığı uygulama ekranlarına da taşınır.',
              'Harici linkler mümkün olduğunca tek domain altında toplanır.',
            ], 'pill-list')}
          </aside>
        </main>
        ${footer()}
      </div>
    `;
  }

  setMeta({
    title: 'Fridgely Terms | Kullanım koşulları',
    description: 'Fridgely kullanım koşulları ve kullanıcı sorumlulukları.',
    canonicalPath: '/terms',
  });

  return `
    <div class="site-shell">
      ${topbar({ compact: true })}
      <main id="main-content" class="section legal-layout">
        <article class="legal-card">
          <div class="eyebrow">Terms</div>
          <h1>Kullanım koşulları sade olmalı.</h1>
          <div class="legal-meta">Son güncelleme: 8 Mart 2026</div>
          <p>Fridgely, mutfak organizasyonu ve tarif üretimi için sunulan bir yardımcı uygulamadır. Kullanıcı, uygulama içinde paylaştığı içeriklerden ve oluşturduğu davet linklerinden sorumludur.</p>
          <h2>Beklentiler</h2>
          ${renderItems([
            'Paylaşım özellikleri kötüye kullanılmamalıdır.',
            'Premium hakları yalnızca izin verilen hesap akışlarıyla kullanılmalıdır.',
            'Ürün içeriği bilgilendirme amaçlıdır; tıbbi veya yasal tavsiye yerine geçmez.',
          ], 'legal-list')}
          <h2>Değişiklikler</h2>
          <p>Ürün akışı değiştikçe, koşullar ve destek sayfaları aynı domain altında güncellenebilir.</p>
        </article>
        <aside class="support-card">
          <h3>Devam et</h3>
          <div class="stack-actions">
            <a class="button button-secondary" href="${pageHref('/support')}">Destek merkezi</a>
            <a class="secondary-link" href="${pageHref('/privacy')}">Gizlilik</a>
          </div>
        </aside>
      </main>
      ${footer()}
    </div>
  `;
}

function deepLinkPage({
  eyebrow,
  title,
  description,
  chips,
  appHref,
  fallbackHref,
  secondaryHref,
  secondaryLabel,
  canonicalPath,
  guideTitle = 'Bu bağlantı ne yapar?',
  guideItems = [],
  nextTitle = 'Sonraki adım',
  nextItems = [],
}) {
  setMeta({
    title,
    description,
    canonicalPath,
  });

  const chipHtml = (chips || [])
    .map((chip) => `<span class="meta-chip">${chip}</span>`)
    .join('');

  return `
    <div class="site-shell deep-link-shell">
      ${topbar({ compact: true })}
      <main id="main-content" class="route-layout">
        <section class="deep-link-panel">
          <div class="eyebrow">${eyebrow}</div>
          <div class="deep-link-meta">${chipHtml}</div>
          <h1 class="deep-link-title">${title}</h1>
          <p>${description}</p>
          <div class="legal-actions">
            ${button({
              label: 'Fridgely uygulamasını aç',
              appHref,
              fallbackHref,
              variant: 'primary',
            })}
            <a class="secondary-link" href="${secondaryHref}">${secondaryLabel}</a>
          </div>
        </section>
        <aside class="route-side-stack">
          <article class="route-sidecard">
            <div class="eyebrow">Bağlantı rehberi</div>
            <h2>${guideTitle}</h2>
            ${renderItems(guideItems, 'legal-list')}
          </article>
          <article class="route-sidecard route-sidecard-muted">
            <div class="eyebrow">Sonraki adım</div>
            <h2>${nextTitle}</h2>
            ${renderItems(nextItems, 'legal-list')}
          </article>
        </aside>
      </main>
      ${footer()}
    </div>
  `;
}

function routeDeepLink(path, query) {
  if (path === '/support') return supportPage();
  if (path === '/premium') return premiumPage();
  if (path === '/privacy') return legalPage('privacy');
  if (path === '/terms') return legalPage('terms');

  if (path === '/invite/family') {
    const code = query.get('code') || 'Davet kodu hazır';
    const owner = query.get('owner');
    return deepLinkPage({
      eyebrow: 'Family Invite',
      title: 'Aile daveti hazır.',
      description:
        'Bu link, Fridgely içindeki 30 günlük aile daveti akışını açmak için hazırlandı. Uygulama yüklüyse doğrudan devam edebilirsin.',
      chips: [
        `Kod: FRIDGELY-${code}`,
        owner ? `Sahip: ${owner.slice(0, 8)}...` : 'Paylaşılabilir davet',
      ],
      appHref: 'fridgely://inventory',
      fallbackHref: pageHref('/support'),
      secondaryHref: pageHref('/premium'),
      secondaryLabel: 'Premium avantajlarını gör',
      canonicalPath: '/invite/family',
      guideTitle: 'Bu davet ne sağlar?',
      guideItems: [
        '30 günlük aile daveti akışına giriş sağlar.',
        'Uygulama yüklüyse ilgili iç akışı açmayı dener.',
        'Yüklü değilse premium ve destek yüzeylerine yönlendirir.',
      ],
      nextTitle: 'Sorunsuz devam için',
      nextItems: [
        'Önce uygulamayı açmayı dene.',
        'Daveti neden aldığını premium yüzeyinde görebilirsin.',
        'Sorun yaşarsan destek merkezine geç.',
      ],
    });
  }

  if (path === '/recipe' || path.startsWith('/recipe/')) {
    const recipeId =
      path === '/recipe' ? query.get('id') || '' : path.split('/')[2] || '';
    const recipeName = query.get('name') || 'Paylaşılan tarif';
    return deepLinkPage({
      eyebrow: 'Recipe Share',
      title: recipeName,
      description:
        'Bu bağlantı Fridgely içindeki tarif paylaşımı için oluşturuldu. Uygulamayı açarak ilgili akışa devam edebilir veya tarif üretim sistemini inceleyebilirsin.',
      chips: [`Tarif ID: ${recipeId || 'hazır'}`, 'Paylaşım linki'],
      appHref: `fridgely://recipe/${recipeId}`,
      fallbackHref: pageHref('/recipes'),
      secondaryHref: pageHref('/#system-map'),
      secondaryLabel: 'Sistemin nasıl çalıştığını gör',
      canonicalPath: recipeId ? `/recipe/${recipeId}` : '/recipe',
      guideTitle: 'Bu tarif linki ne yapar?',
      guideItems: [
        'Paylaşılan tarif kaydını uygulama içinde açmayı dener.',
        'Uygulama yoksa tarif akışını ve ilgili sistemi açıklar.',
        'Tariften alışveriş veya premium kararına geçişi destekler.',
      ],
      nextTitle: 'Devam seçenekleri',
      nextItems: [
        'Uygulamayı açarak tarif detayına dön.',
        'Tarif sistemini ana sayfadan incele.',
        'Daha geniş akış için premium farklarına bak.',
      ],
    });
  }

  if (path === '/recipes') {
    return deepLinkPage({
      eyebrow: 'Recipes',
      title: 'Tarif akışına geri dön.',
      description:
        'Fridgely içindeki tarif üretimi ve sonuç akışına dönmek için uygulamayı açabilir veya premium farklarını inceleyebilirsin.',
      chips: ['AI tarif akışı', 'Sonuç ekranı'],
      appHref: 'fridgely://recipes',
      fallbackHref: pageHref('/premium'),
      secondaryHref: pageHref('/premium'),
      secondaryLabel: 'Premium farklarını incele',
      canonicalPath: '/recipes',
      guideTitle: 'Tarif akışı nasıl devam eder?',
      guideItems: [
        'Üretim ve sonuç ekranı uygulama içinde açılır.',
        'Limitler ve premium farkları bu web yüzeyinde açıklanır.',
        'Eksik malzeme kontrolü alışveriş akışına bağlanır.',
      ],
      nextTitle: 'Buradan nereye gidilir?',
      nextItems: [
        'Uygulamada tarif akışını aç.',
        'Premium plan farklarını incele.',
        'Destek sayfasından doğru yönlendirmeyi al.',
      ],
    });
  }

  if (path === '/inventory') {
    return deepLinkPage({
      eyebrow: 'Inventory',
      title: 'Envanter akışına dön.',
      description:
        'Buzdolabı, tarayıcı ve stok görünürlüğü Fridgely uygulaması içinde çalışır. Buradan uygulamayı tekrar açabilirsin.',
      chips: ['Scanner', 'Inventory'],
      appHref: 'fridgely://inventory',
      fallbackHref: pageHref('/support'),
      secondaryHref: pageHref('/#flows'),
      secondaryLabel: 'Ürün sistemini gör',
      canonicalPath: '/inventory',
      guideTitle: 'Envanter linki ne için?',
      guideItems: [
        'Buzdolabı ve stok görünürlüğü akışına geri taşır.',
        'Tarama, giriş ve stok kontrolü bu yüzeyle ilişkilidir.',
        'Uygulama açılamazsa destek sayfası devreye girer.',
      ],
      nextTitle: 'İlerleme yolu',
      nextItems: [
        'Envanter ekranını aç.',
        'Sistem haritasını ana sayfadan incele.',
        'Sorun varsa destek merkezine git.',
      ],
    });
  }

  if (path === '/shopping') {
    return deepLinkPage({
      eyebrow: 'Shopping',
      title: 'Alışveriş akışına devam et.',
      description:
        'Fridgely’de alışveriş listesi, AI önerileri ve eksik malzeme yönetimi aynı akışta ilerler.',
      chips: ['Shopping', 'AI suggestions'],
      appHref: 'fridgely://shopping',
      fallbackHref: pageHref('/support'),
      secondaryHref: pageHref('/premium'),
      secondaryLabel: 'Premium akışını incele',
      canonicalPath: '/shopping',
      guideTitle: 'Alışveriş akışı nasıl çalışır?',
      guideItems: [
        'Eksik malzemeleri listeye taşımayı hedefler.',
        'Tarif akışından alışveriş kararına geçişi bağlar.',
        'Uygulama açılamazsa destek ve premium yüzeylerine yönlendirir.',
      ],
      nextTitle: 'Sonraki adımlar',
      nextItems: [
        'Uygulamada alışveriş listesini aç.',
        'Premium farklarının liste akışına etkisini incele.',
        'Sorun yaşarsan destek merkezini kullan.',
      ],
    });
  }

  return null;
}

function notFoundPage() {
  setMeta({
    title: 'Fridgely | Sayfa bulunamadı',
    description: 'Aradığınız Fridgely sayfası bulunamadı.',
    canonicalPath: '/',
  });

  return `
    <div class="site-shell deep-link-shell">
      ${topbar({ compact: true })}
      <main id="main-content" class="deep-link-panel">
        <div class="eyebrow">404</div>
        <h1 class="deep-link-title">Bu rota Fridgely’de boş kalmamalı.</h1>
        <p>Aradığın bağlantı taşınmış olabilir. Ana sayfaya dönerek doğru akışa geçebilirsin.</p>
        <div class="legal-actions">
          <a class="button button-primary" href="${pageHref('/')}">Ana sayfaya dön</a>
          <a class="secondary-link" href="${pageHref('/support')}">Destek merkezine git</a>
        </div>
      </main>
      ${footer()}
    </div>
  `;
}

function bindInteractions() {
  const toggle = document.querySelector('[data-theme-toggle]');
  if (toggle) {
    const syncThemeLabel = () => {
      toggle.textContent =
        document.documentElement.dataset.theme === 'dark'
          ? 'Açık tema'
          : 'Koyu tema';
    };

    syncThemeLabel();
    toggle.onclick = () => {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      syncThemeLabel();
    };
  }

  document.querySelectorAll('[data-open-app]').forEach((node) => {
    node.onclick = () => {
      const appHref = node.getAttribute('data-open-app');
      const fallbackHref = node.getAttribute('data-fallback') || pageHref('/support');
      const start = Date.now();
      window.location.href = appHref;
      window.setTimeout(() => {
        if (document.visibilityState === 'visible' && Date.now() - start > 700) {
          window.location.href = fallbackHref;
        }
      }, 900);
    };
  });
}

function render() {
  applyTheme(initialTheme());
  const path = normalizePath(window.location.pathname);
  const query = new URLSearchParams(window.location.search);

  let html = '';
  if (path === '/') {
    html = homePage();
  } else {
    html = routeDeepLink(path, query) || notFoundPage();
  }

  app.innerHTML = html;
  bindInteractions();
}

render();
