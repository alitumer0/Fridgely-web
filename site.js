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

function topbar({ compact = false } = {}) {
  return `
    <header class="topbar">
      <a class="brand-lockup" href="${pageHref('/')}">
        <span class="brand-mark" aria-hidden="true"></span>
        <span class="brand-text">
          <strong>Fridgely</strong>
          <span>Smart kitchen operating system</span>
        </span>
      </a>
      <nav class="nav-links" aria-label="Ana menü">
        <a href="${pageHref('/#how-it-works')}">Nasıl çalışır</a>
        <a href="${pageHref('/#kitchen-system')}">Mutfak sistemi</a>
        <a href="${pageHref('/#pricing')}">Premium</a>
        <a href="${pageHref('/#faq')}">SSS</a>
      </nav>
      <div class="nav-actions">
        ${compact ? '' : `<a class="secondary-link" href="${pageHref('/support')}">Destek</a>`}
        <button class="theme-toggle" type="button" data-theme-toggle aria-label="Temayı değiştir">Tema</button>
      </div>
    </header>
  `;
}

function footer() {
  return `
    <footer class="footer">
      <small>
        Fridgely, mutfak envanteri, yapay zeka tarif akışı ve paylaşılabilir davet/deep-link deneyimlerini tek yerde toplar.
      </small>
      <div class="footer-links">
        <a href="${pageHref('/privacy')}">Gizlilik</a>
        <a href="${pageHref('/terms')}">Koşullar</a>
        <a href="${pageHref('/support')}">Destek</a>
        <a href="mailto:${EMAIL_HELLO}">İletişim</a>
      </div>
    </footer>
  `;
}

function button({ label, appHref, fallbackHref, href, variant = 'primary' }) {
  if (href) {
    return `<a class="button button-${variant}" href="${href}">${label}</a>`;
  }
  return `<button class="button button-${variant}" type="button" data-open-app="${appHref}" data-fallback="${fallbackHref}">${label}</button>`;
}

function homePage() {
  setMeta({
    title: 'Fridgely | Akıllı mutfak akışını tek yerde topla',
    description:
      'Mutfak envanterini tara, elindekilerle tarif üret, premium akışları aileyle paylaş ve Fridgely ile günlük yemek operasyonunu sadeleştir.',
    canonicalPath: '/',
  });

  return `
    <div class="site-shell">
      ${topbar()}
      <main>
        <section class="hero">
          <article class="hero-copy">
            <div class="eyebrow">Kitchen OS for real kitchens</div>
            <h1 class="display">Mutfağın dağılmadan akmasını sağlar.</h1>
            <p class="lead">
              Fridgely; rafları tarar, envanteri toparlar, elindekilerle tarif üretir ve alışveriş, aile paylaşımı, beslenme ve tasarruf akışını tek sisteme bağlar.
            </p>
            <div class="hero-actions">
              ${button({
                label: 'Uygulamayı Aç',
                appHref: 'fridgely://inventory',
                fallbackHref: pageHref('/#download'),
                variant: 'primary',
              })}
              <a class="secondary-link" href="#pricing">Premium planları gör</a>
            </div>
            <div class="stat-rail">
              <div class="stat-pill"><strong>Tarama</strong><span>Fiş, raf ve ürünlerden hızlı giriş</span></div>
              <div class="stat-pill"><strong>AI Tarif</strong><span>Elindekilere göre üretim ve eksik kontrolü</span></div>
              <div class="stat-pill"><strong>Aile Akışı</strong><span>Davet, paylaşım ve alışveriş senkronu</span></div>
            </div>
          </article>
          <aside class="hero-visual" aria-label="Fridgely ürün önizlemesi">
            <div class="fridge-frame">
              <div class="ticket-stack">
                <div class="ticket ticket-a"><strong>Scanner ready</strong><small>Fiş, raf ve barkod girişi</small></div>
                <div class="ticket ticket-b"><strong>Recipe engine</strong><small>Eksik malzeme ve hızlı tarif akışı</small></div>
                <div class="ticket ticket-c"><strong>Family invite</strong><small>30 günlük paylaşılabilir premium deneyim</small></div>
              </div>
              <div class="shelf-line"></div>
              <div class="shelf-line"></div>
              <div class="visual-note">
                <strong>Bu bir landing page değil yalnızca.</strong>
                Tarif, alışveriş, envanter ve davet linkleri için branded fallback katmanı olarak da çalışır.
              </div>
            </div>
          </aside>
        </section>

        <section class="section" id="how-it-works">
          <div class="section-head">
            <div>
              <div class="eyebrow">Nasıl çalışır</div>
              <h2>Üç adımda mutfak operasyonu.</h2>
            </div>
            <p>
              Fridgely uygulamayı sadece özellikler listesi gibi değil, akışın tamamı gibi ele alır. Tarama, karar ve paylaşım aynı sistemde buluşur.
            </p>
          </div>
          <div class="journey-grid">
            <div class="journey-main">
              <article class="journey-step">
                <div class="step-no">01</div>
                <div>
                  <h3>Girdiyi topla</h3>
                  <p>Raf, fiş ve barkod kaynaklarını tek ekranda toplayıp manuel giriş yükünü azaltır.</p>
                </div>
              </article>
              <article class="journey-step">
                <div class="step-no">02</div>
                <div>
                  <h3>Kararı hızlandır</h3>
                  <p>AI tarif akışı, eksik malzemeleri gösterir; alışveriş ve beslenme kararını tek seferde netleştirir.</p>
                </div>
              </article>
              <article class="journey-step">
                <div class="step-no">03</div>
                <div>
                  <h3>Paylaş ve sürdür</h3>
                  <p>Aile daveti, premium deneme, deep-link ve paylaşım sayfaları akışın kopmadan devam etmesini sağlar.</p>
                </div>
              </article>
            </div>
            <aside class="aside-quote">
              <blockquote>
                “Fridgely, mutfakla ilgili dağınık küçük kararları tek bir ritme bağlar.”
              </blockquote>
              <ul class="pill-list">
                <li>Tarif üretimi Free ve Pro sınırlarıyla çalışır.</li>
                <li>Paylaşılan linkler uygulama yoksa bile boş sayfaya düşmez.</li>
                <li>Gizlilik, destek ve premium içerikleri tek domain altında toplanır.</li>
              </ul>
            </aside>
          </div>
        </section>

        <section class="section" id="kitchen-system">
          <div class="section-head">
            <div>
              <div class="eyebrow">Kitchen system</div>
              <h2>Yalnızca tarif üretmez.</h2>
            </div>
            <p>
              Fridgely’nin değeri, yapay zeka sonucu ile günlük mutfak operasyonu arasındaki kopukluğu kapatmasında.
            </p>
          </div>
          <div class="feature-grid">
            <article class="feature-card">
              <div class="feature-icon">01</div>
              <h3>Akıllı tarayıcı</h3>
              <p>Fiş, raf ve barkod girişleriyle envanteri daha hızlı kurar.</p>
            </article>
            <article class="feature-card">
              <div class="feature-icon">02</div>
              <h3>Recipe engine</h3>
              <p>Elindekilerle dünya mutfaklarına uzanan üretim, eksik kontrolü ve sonuç akışı sağlar.</p>
            </article>
            <article class="feature-card">
              <div class="feature-icon">03</div>
              <h3>Aile ve paylaşım</h3>
              <p>Davet linkleri, deep-link fallback’ları ve premium misafir akışıyla sosyal kullanımı güçlendirir.</p>
            </article>
          </div>
        </section>

        <section class="section" id="pricing">
          <div class="section-head">
            <div>
              <div class="eyebrow">Premium</div>
              <h2>İhtiyacın kadar sade, gerektiğinde güçlü.</h2>
            </div>
            <p>
              App içi satın alma uygulamada kalır; ama plan farkları, kullanım senaryoları ve karar destek içeriği bu yüzeyde daha net anlatılır.
            </p>
          </div>
          <div class="pricing-grid">
            <article class="pricing-card">
              <div class="pricing-tag">Free</div>
              <div class="price">₺0 <span>/ başlangıç</span></div>
              <ul class="pricing-list">
                <li>Temel akıllı tarama ve günlük kullanım</li>
                <li>Limitli AI tarif üretimi</li>
                <li>Alışveriş ve envanter takibi</li>
              </ul>
            </article>
            <article class="pricing-card pricing-card--accent">
              <div class="pricing-tag">Pro</div>
              <div class="price">Daha derin akış <span>/ aile ve ileri kullanım</span></div>
              <ul class="pricing-list">
                <li>Daha geniş tarif üretimi ve premium akışlar</li>
                <li>30 günlük aile daveti ve paylaşılabilir deneyim</li>
                <li>Beslenme, tasarruf ve ileri planlama yüzeyleri</li>
              </ul>
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
        </section>

        <section class="section" id="faq">
          <div class="section-head">
            <div>
              <div class="eyebrow">SSS</div>
              <h2>Sık sorulan kritik noktalar.</h2>
            </div>
          </div>
          <div class="support-grid">
            <article class="faq-card">
              <h3>Web site ne işe yarıyor?</h3>
              <p>Landing anlatısını taşır, uygulama içi dış linkleri toplar ve paylaşılan invite/recipe URL’leri için markalı fallback görevi görür.</p>
            </article>
            <article class="faq-card">
              <h3>Premium satın alma burada mı?</h3>
              <p>Hayır. Satın alma uygulama içinde kalır. Bu site plan farklarını, akışı ve destek içeriklerini açıklar.</p>
            </article>
            <article class="faq-card">
              <h3>Paylaşılan tarif linki ne olur?</h3>
              <p>Uygulama yüklüyse Fridgely açılır; değilse kullanıcı branded bir açıklama sayfasına düşer ve doğru aksiyona yönlendirilir.</p>
            </article>
            <article class="faq-card">
              <h3>Yardım veya iş birliği?</h3>
              <p><a href="mailto:${EMAIL_HELLO}">${EMAIL_HELLO}</a> üzerinden ekiple iletişime geçilebilir.</p>
            </article>
          </div>
        </section>

        <section class="section" id="download">
          <div class="section-head">
            <div>
              <div class="eyebrow">Açılış noktası</div>
              <h2>Uygulamayı aç, destek al veya ekiple konuş.</h2>
            </div>
          </div>
          <div class="support-grid">
            <article class="support-card">
              <h3>Fridgely’yi aç</h3>
              <p>Telefonundaysan doğrudan uygulamaya dönmeyi dene. Yüklü değilse destek ve bilgi akışı burada devam eder.</p>
              <div class="stack-actions">
                ${button({
                  label: 'Uygulamayı şimdi aç',
                  appHref: 'fridgely://inventory',
                  fallbackHref: pageHref('/support'),
                  variant: 'primary',
                })}
              </div>
            </article>
            <article class="support-card">
              <h3>Ekiple iletişime geç</h3>
              <p>Roadmap, iş birlikleri veya ürün soruları için doğrudan yaz.</p>
              <div class="stack-actions">
                <a class="button button-secondary" href="mailto:${EMAIL_HELLO}">E-posta gönder</a>
                <a class="secondary-link" href="${pageHref('/support')}">Destek merkezine git</a>
              </div>
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
    title: 'Fridgely Support | Destek ve sık sorulan sorular',
    description: 'Fridgely destek merkezi, iletişim yolları ve ürün akışıyla ilgili sık sorulan sorular.',
    canonicalPath: '/support',
  });

  return `
    <div class="site-shell">
      ${topbar({ compact: true })}
      <main class="section">
        <div class="section-head">
          <div>
            <div class="eyebrow">Support</div>
            <h2>Destek, yönlendirme ve ürün akışı.</h2>
          </div>
          <p>Uygulama içinden gelen yardım bağlantıları burada toplanır. Amaç, kullanıcıyı boş bir sayfada bırakmak değil, bir sonraki doğru aksiyona taşımaktır.</p>
        </div>
        <div class="support-grid">
          <article class="support-card">
            <h3>Uygulamayı tekrar aç</h3>
            <p>Davet, tarif veya alışveriş linkinden geldiysen uygulamayı doğrudan geri açmayı deneyebilirsin.</p>
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
            <h3>İletişim</h3>
            <p>Ürün, yol haritası, ortaklık veya teknik destek için doğrudan ekibe yaz.</p>
            <div class="stack-actions">
              <a class="button button-secondary" href="mailto:${EMAIL_HELLO}">${EMAIL_HELLO}</a>
              <a class="secondary-link" href="${pageHref('/privacy')}">Gizlilik</a>
            </div>
          </article>
        </div>
      </main>
      ${footer()}
    </div>
  `;
}

function premiumPage() {
  setMeta({
    title: 'Fridgely Premium | Plan farkları ve kullanım senaryoları',
    description: 'Fridgely Premium planı, aile daveti, gelişmiş tarif akışı ve ek mutfak yönetim yüzeyleriyle neler kazandırır görün.',
    canonicalPath: '/premium',
  });

  return `
    <div class="site-shell">
      ${topbar({ compact: true })}
      <main class="section">
        <div class="section-head">
          <div>
            <div class="eyebrow">Premium</div>
            <h2>Daha fazla üretim, daha temiz akış.</h2>
          </div>
          <p>Bu sayfa app içi satın alma yerine, karar vermeyi kolaylaştıran farkları ve kullanım senaryolarını özetler.</p>
        </div>
        <div class="pricing-grid">
          <article class="pricing-card">
            <h3>Free ile başla</h3>
            <ul class="pricing-list">
              <li>Temel tarama ve stok görünürlüğü</li>
              <li>Limitli AI tarif üretimi</li>
              <li>Alışveriş ve envanter akışı</li>
            </ul>
          </article>
          <article class="pricing-card pricing-card--accent">
            <h3>Pro ile derine in</h3>
            <ul class="pricing-list">
              <li>Daha geniş üretim limitleri</li>
              <li>Family guest invite ve paylaşılabilir akışlar</li>
              <li>Beslenme, tasarruf ve ileri akış kartları</li>
            </ul>
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
        <main class="section legal-layout">
          <article class="legal-card">
            <div class="eyebrow">Privacy</div>
            <h1>Gizlilik yaklaşımı açık ve izlenebilir kalmalı.</h1>
            <div class="legal-meta">Son güncelleme: 8 Mart 2026</div>
            <p>Fridgely; mutfak envanteri, tarif akışı ve kullanıcı tercihleri için minimum gerekli veriyi işlemeyi hedefler. Paylaşım akışlarında kullanıcıyı karanlık desene iten belirsiz yönlendirmeler yerine açık kontrol sunar.</p>
            <h2>Toplanan başlıca veri tipleri</h2>
            <ul class="legal-list">
              <li>Envanter, favori ve alışveriş listesi içerikleri</li>
              <li>Tarama ve kullanım geçmişine ait uygulama içi tercihler</li>
              <li>Paylaşım ve davet akışları için gerekli bağlantı metadatası</li>
            </ul>
            <h2>Kullanıcı kontrolleri</h2>
            <ul class="legal-list">
              <li>Uygulama içinden veri özeti ve dışa aktarma</li>
              <li>Anonim analiz ve kişiselleştirme tercihlerinin yönetimi</li>
              <li>Veri silme ve iletişim kanalları</li>
            </ul>
          </article>
          <aside class="support-card">
            <h3>İletişim</h3>
            <p>Gizlilik soruları ve veri talepleri için doğrudan ulaşılabilecek kanal:</p>
            <div class="stack-actions">
              <a class="button button-secondary" href="mailto:${EMAIL_PRIVACY}">${EMAIL_PRIVACY}</a>
              <a class="secondary-link" href="${pageHref('/terms')}">Kullanım koşulları</a>
            </div>
            <ul class="pill-list">
              <li>KVKK / GDPR farkındalığı uygulama ekranlarına da taşınır.</li>
              <li>Harici linkler mümkün olduğunca tek domain altında toplanır.</li>
            </ul>
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
      <main class="section legal-layout">
        <article class="legal-card">
          <div class="eyebrow">Terms</div>
          <h1>Kullanım koşulları sade olmalı.</h1>
          <div class="legal-meta">Son güncelleme: 8 Mart 2026</div>
          <p>Fridgely, mutfak organizasyonu ve tarif üretimi için sunulan bir yardımcı uygulamadır. Kullanıcı, uygulama içinde paylaştığı içeriklerden ve oluşturduğu davet linklerinden sorumludur.</p>
          <h2>Beklentiler</h2>
          <ul class="legal-list">
            <li>Paylaşım özellikleri kötüye kullanılmamalıdır.</li>
            <li>Premium hakları yalnızca izin verilen hesap akışlarıyla kullanılmalıdır.</li>
            <li>Ürün içeriği bilgilendirme amaçlıdır; tıbbi veya yasal tavsiye yerine geçmez.</li>
          </ul>
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

function deepLinkPage({ eyebrow, title, description, chips, appHref, fallbackHref, secondaryHref, secondaryLabel, canonicalPath }) {
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
      <main class="deep-link-panel">
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
    });
  }

  if (path === '/recipe' || path.startsWith('/recipe/')) {
    const recipeId =
      path === '/recipe' ? (query.get('id') || '') : (path.split('/')[2] || '');
    const recipeName = query.get('name') || 'Paylaşılan tarif';
    return deepLinkPage({
      eyebrow: 'Recipe Share',
      title: recipeName,
      description:
        'Bu bağlantı Fridgely içindeki tarif paylaşımı için oluşturuldu. Uygulamayı açarak ilgili akışa devam edebilir veya tarif üretim sistemini inceleyebilirsin.',
      chips: [
        `Tarif ID: ${recipeId || 'hazır'}`,
        'Paylaşım linki',
      ],
      appHref: `fridgely://recipe/${recipeId}`,
      fallbackHref: pageHref('/recipes'),
      secondaryHref: pageHref('/#how-it-works'),
      secondaryLabel: 'Sistemin nasıl çalıştığını gör',
      canonicalPath: recipeId ? `/recipe/${recipeId}` : '/recipe',
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
      secondaryHref: pageHref('/#kitchen-system'),
      secondaryLabel: 'Ürün sistemini gör',
      canonicalPath: '/inventory',
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
      <main class="deep-link-panel">
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
