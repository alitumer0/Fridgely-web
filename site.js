const SITE_BASE = window.__FRIDGELY_SITE_BASE__ || '/';
const SITE_ORIGIN = window.__FRIDGELY_SITE_ORIGIN__ || 'https://fridgely.app';
const EMAIL_HELLO = 'hello@fridgely.app';
const EMAIL_PRIVACY = 'privacy@fridgely.app';
const SYSTEM_THEME_QUERY = window.matchMedia('(prefers-color-scheme: dark)');
const THEME_ORDER = ['system', 'light', 'dark'];
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

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    switch (character) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case '\'':
        return '&#39;';
      default:
        return character;
    }
  });
}

function currentThemePreference() {
  const saved = localStorage.getItem('fridgely-theme-preference');
  return THEME_ORDER.includes(saved) ? saved : 'system';
}

function resolvedTheme(preference) {
  if (preference === 'light' || preference === 'dark') return preference;
  return SYSTEM_THEME_QUERY.matches ? 'dark' : 'light';
}

function applyThemePreference(preference) {
  const nextPreference = THEME_ORDER.includes(preference) ? preference : 'system';
  document.documentElement.dataset.theme = resolvedTheme(nextPreference);
  document.documentElement.dataset.themePreference = nextPreference;
  localStorage.setItem('fridgely-theme-preference', nextPreference);
}

function nextThemePreference(preference) {
  const currentIndex = THEME_ORDER.indexOf(preference);
  return THEME_ORDER[(currentIndex + 1) % THEME_ORDER.length];
}

function themeButtonLabel(preference) {
  if (preference === 'light') return 'Tema: Açık';
  if (preference === 'dark') return 'Tema: Koyu';
  return 'Tema: Sistem';
}

function setMeta({ title, description, canonicalPath }) {
  const canonical = `${SITE_ORIGIN}${canonicalPath}`;
  const normalizedTitle = /fridgely/i.test(title) ? title : `${title} | Fridgely`;

  document.title = normalizedTitle;
  const descriptionNode = document.getElementById('meta-description');
  const canonicalNode = document.getElementById('canonical-link');
  const ogTitle = document.getElementById('og-title');
  const ogDescription = document.getElementById('og-description');
  const ogUrl = document.getElementById('og-url');
  const twitterTitle = document.getElementById('twitter-title');
  const twitterDescription = document.getElementById('twitter-description');

  if (descriptionNode) descriptionNode.setAttribute('content', description);
  if (canonicalNode) canonicalNode.setAttribute('href', canonical);
  if (ogTitle) ogTitle.setAttribute('content', normalizedTitle);
  if (ogDescription) ogDescription.setAttribute('content', description);
  if (ogUrl) ogUrl.setAttribute('content', canonical);
  if (twitterTitle) twitterTitle.setAttribute('content', normalizedTitle);
  if (twitterDescription) twitterDescription.setAttribute('content', description);
}

function button({ label, appHref, fallbackHref, href, variant = 'primary' }) {
  if (href) {
    return `<a class="button button-${variant}" href="${href}">${label}</a>`;
  }

  return `<button class="button button-${variant}" type="button" data-open-app="${appHref}" data-fallback="${fallbackHref}">${label}</button>`;
}

function topbar({ compact = false } = {}) {
  return `
    <header class="topbar" data-nav-shell data-nav-open="false">
      <a class="brand-lockup" href="${pageHref('/')}">
        <span class="brand-mark" aria-hidden="true"></span>
        <span class="brand-text">
          <strong>Fridgely</strong>
          <span>Kitchen operating system</span>
        </span>
      </a>
      <button
        class="nav-toggle"
        type="button"
        data-nav-toggle
        aria-expanded="false"
        aria-controls="site-nav"
      >
        Menü
      </button>
      <nav class="nav-links" id="site-nav" aria-label="Ana menü">
        <a href="${pageHref('/#workflow')}">Akış</a>
        <a href="${pageHref('/#surfaces')}">Yüzeyler</a>
        <a href="${pageHref('/#pricing')}">Premium</a>
        <a href="${pageHref('/#faq')}">SSS</a>
      </nav>
      <div class="nav-actions">
        ${compact ? '' : `<a class="secondary-link secondary-link-subtle" href="${pageHref('/support')}">Destek</a>`}
        <button class="theme-toggle" type="button" data-theme-toggle aria-label="Tema modunu değiştir"></button>
      </div>
    </header>
  `;
}

function footer() {
  return `
    <footer class="footer">
      <div class="footer-brand">
        <strong>Fridgely</strong>
        <p>
          Envanter, tarif, alışveriş ve paylaşım akışlarını tek bir daha temiz ürün katmanında toplar.
        </p>
      </div>
      <div class="footer-columns">
        <div class="footer-column">
          <span>Ürün</span>
          <a href="${pageHref('/#workflow')}">Nasıl çalışır</a>
          <a href="${pageHref('/premium')}">Premium</a>
          <a href="${pageHref('/support')}">Destek</a>
        </div>
        <div class="footer-column">
          <span>Güven</span>
          <a href="${pageHref('/privacy')}">Gizlilik</a>
          <a href="${pageHref('/terms')}">Koşullar</a>
          <a href="mailto:${EMAIL_HELLO}">İletişim</a>
        </div>
      </div>
    </footer>
  `;
}

function shell({ content, compact = false, shellClass = '', mainClass = '' }) {
  const shellClasses = ['site-shell', shellClass].filter(Boolean).join(' ');
  const mainClasses = [mainClass].filter(Boolean).join(' ');

  return `
    <a class="skip-link" href="#main-content">İçeriğe geç</a>
    <div class="${shellClasses}">
      ${topbar({ compact })}
      <main id="main-content" class="${mainClasses}">${content}</main>
      ${footer()}
    </div>
  `;
}

function sectionHeader({ eyebrow, title, body }) {
  return `
    <div class="section-head">
      <div>
        <div class="eyebrow">${eyebrow}</div>
        <h2>${title}</h2>
      </div>
      <p>${body}</p>
    </div>
  `;
}

function homePage() {
  setMeta({
    title: 'Fridgely | Mutfak operasyonunu tek akışta topla',
    description:
      'Fridgely, mutfak envanterini tarar, tarif kararlarını hızlandırır, alışveriş akışlarını toplar ve paylaşılabilir linkleri profesyonel bir marka yüzeyinde tamamlar.',
    canonicalPath: '/',
  });

  return shell({
    content: `
      <section class="hero">
        <article class="hero-copy">
          <div class="eyebrow">Kitchen operating system</div>
          <div class="hero-kicker">Inventory, recipes, shopping and family sync in one loop.</div>
          <h1 class="display">Mutfaktaki dağınık kararları tek bir net operasyona çevir.</h1>
          <p class="lead">
            Fridgely; fiş, raf ve barkod girdisini toplar, elindekilerle tarif akışını hızlandırır,
            eksikleri alışveriş listesine taşır ve paylaşılan linkleri boş sayfaya düşürmeyen
            markalı bir deneyimle kapatır.
          </p>
          <div class="hero-actions">
            ${button({
              label: 'Uygulamayı aç',
              appHref: 'fridgely://inventory',
              fallbackHref: pageHref('/support'),
              variant: 'primary',
            })}
            <a class="secondary-link" href="#workflow">Akışı incele</a>
            <a class="secondary-link secondary-link-subtle" href="${pageHref('/premium')}">Premium farkları</a>
          </div>
          <div class="trust-row" aria-label="Fridgely temel yüzeyleri">
            <article class="trust-chip">
              <strong>Tarama</strong>
              <span>Fiş, raf ve barkod verisini hızlı toplar.</span>
            </article>
            <article class="trust-chip">
              <strong>Karar</strong>
              <span>AI tarif ve eksik malzeme akışını tek yerde gösterir.</span>
            </article>
            <article class="trust-chip">
              <strong>Paylaşım</strong>
              <span>Davet ve share linkleri markalı fallback ile biter.</span>
            </article>
          </div>
        </article>
        <aside class="hero-board" aria-label="Fridgely operasyon panosu">
          <div class="board-header">
            <span class="board-label">Bugünün mutfak resmi</span>
            <strong>Tek panel, üç net karar</strong>
          </div>
          <article class="board-priority">
            <div>
              <span class="board-pill">Inventory pulse</span>
              <h3>3 ürün 48 saat içinde kritik.</h3>
            </div>
            <p>Stok görünürlüğü, tarif önerisi ve alışveriş etkisi aynı karar katmanına bağlanır.</p>
          </article>
          <div class="board-grid">
            <article class="mini-panel">
              <span>Scanner</span>
              <strong>Raf + fiş</strong>
              <p>Manuel giriş yükünü azaltan toplu veri başlangıcı.</p>
            </article>
            <article class="mini-panel">
              <span>Recipes</span>
              <strong>Eksik kontrolü</strong>
              <p>Üretilen tarifin maliyet ve alışveriş etkisi görünür kalır.</p>
            </article>
            <article class="mini-panel mini-panel-accent">
              <span>Family sync</span>
              <strong>Paylaşılabilir akışları koparmaz</strong>
              <p>Davet ve deep-link rotaları uygulama olsa da olmasa da anlamlı kalır.</p>
            </article>
          </div>
          <div class="timeline-list" aria-label="Fridgely iş akışı">
            <article class="timeline-item">
              <span>01</span>
              <div>
                <strong>Topla</strong>
                <small>Fiş, raf, barkod ve elle giriş aynı stok modeline akar.</small>
              </div>
            </article>
            <article class="timeline-item">
              <span>02</span>
              <div>
                <strong>Karar ver</strong>
                <small>Tarif, eksik malzeme ve planlama aynı panelde netleşir.</small>
              </div>
            </article>
            <article class="timeline-item">
              <span>03</span>
              <div>
                <strong>Paylaş</strong>
                <small>Aile ve share linkleri branded fallback sayfalarıyla tamamlanır.</small>
              </div>
            </article>
          </div>
        </aside>
      </section>

      <section class="section" id="workflow">
        ${sectionHeader({
          eyebrow: 'Operational clarity',
          title: 'Landing page gibi değil, ürünün uzantısı gibi çalışmalı.',
          body:
            'Profesyonel görünüm yalnızca güzel kartlar demek değil. Ürünün neyi çözdüğü, hangi akışları kapattığı ve neden güvenilir hissettirdiği ilk ekranda netleşmeli.',
        })}
        <div class="editorial-grid">
          <article class="manifesto-card">
            <span class="manifesto-tag">Neyi düzeltiyor</span>
            <h3>Mutfakta kaybolan karar hızı.</h3>
            <p>
              Fridgely; stok görünürlüğü, tarif kararı, alışveriş listesi ve aile senkronunu ayrık
              araçlar gibi değil, birbiriyle konuşan bir sistem gibi ele alır.
            </p>
            <ul class="signal-list">
              <li>Aynı ürün bir kez girilir, sonra tarif ve alışveriş tarafına akar.</li>
              <li>Share ve invite linkleri uygulama yoksa bile kullanıcıyı boşlukta bırakmaz.</li>
              <li>Premium anlatısı özellik listesi değil, sonuç anlatısı üzerinden kurulur.</li>
            </ul>
          </article>
          <div class="outcome-grid">
            <article class="outcome-card">
              <strong>Stok görünürlüğü</strong>
              <p>Hangi ürün bitiyor, ne eksik, ne öncelikli; tek bakışta netleşir.</p>
            </article>
            <article class="outcome-card">
              <strong>Tarif kararı</strong>
              <p>AI tarif akışı yalnızca tarif vermez, eksik ve alışveriş etkisini de gösterir.</p>
            </article>
            <article class="outcome-card outcome-card-warm">
              <strong>Paylaşılabilir deneyim</strong>
              <p>Davet, tarif ve alışveriş linkleri ayrı ayrı değil, aynı marka katmanında devam eder.</p>
            </article>
            <article class="outcome-card">
              <strong>Destek ve güven</strong>
              <p>Gizlilik, koşullar ve yardım linkleri dağınık değil; tek ve ciddi bir destek yüzeyinde toplanır.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="section" id="surfaces">
        ${sectionHeader({
          eyebrow: 'Product surfaces',
          title: 'Ürünün çekirdek yüzeyleri ne işe yaradığını göstermeli.',
          body:
            'UI profesyonel hissettirmek için özellikleri değil, kullanıcının hangi işi daha temiz yaptığını göstermeli. Bu yüzden landing akışında yüzeyler sonuç diliyle anlatılıyor.',
        })}
        <div class="showcase-grid">
          <article class="showcase-card showcase-card-primary">
            <span class="showcase-tag">Inventory layer</span>
            <h3>Scanner ve stok katmanı.</h3>
            <p>Fiş, raf ve barkod girişleri ilk veri toplama noktası olur; sonrasında aynı veri tarif ve alışveriş kararlarına taşınır.</p>
            <ul class="signal-list">
              <li>Manuel giriş yükünü azaltan hızlı başlangıç</li>
              <li>Son kullanma ve eksik ürün görünürlüğü</li>
              <li>Aynı stok modelinden beslenen tüm ekranlar</li>
            </ul>
          </article>
          <article class="showcase-card">
            <span class="showcase-tag">Recipe engine</span>
            <h3>Tarif kararını operasyonel hale getirir.</h3>
            <p>Tarif akışı yalnızca “ne pişirsem” değil, “ne eksik, ne alınacak, ne var” sorularını aynı anda kapatır.</p>
          </article>
          <article class="showcase-card">
            <span class="showcase-tag">Shopping</span>
            <h3>Eksik malzeme doğrudan alışverişe döner.</h3>
            <p>Tarif ve envanter sonucu oluşan eksikler ayrı bir not değil, takip edilebilir liste akışıdır.</p>
          </article>
          <article class="showcase-card showcase-card-wide">
            <span class="showcase-tag">Share & fallback</span>
            <h3>Bu site ürünün dış katmanı olarak da çalışır.</h3>
            <p>Paylaşılan tarif, invite ve shopping linkleri uygulama yüklü cihazlarda akışı açar; değilse kullanıcıyı bir sonraki doğru aksiyona taşıyan markalı fallback sayfalarına düşer.</p>
            <div class="route-grid">
              <article class="route-card">
                <strong>Invite family</strong>
                <span>30 günlük premium deneyim için net fallback</span>
              </article>
              <article class="route-card">
                <strong>Recipe share</strong>
                <span>Tarif bağlamını ve geri dönüş aksiyonunu korur</span>
              </article>
              <article class="route-card">
                <strong>Inventory & shopping</strong>
                <span>Destek veya premium akışına kontrollü yönlendirir</span>
              </article>
            </div>
          </article>
        </div>
      </section>

      <section class="section" id="pricing">
        ${sectionHeader({
          eyebrow: 'Premium clarity',
          title: 'Plan farklarını daha karar verilebilir anlat.',
          body:
            'Profesyonel bir premium sayfası yalnızca özellikleri dizmez. Hangi kullanıcı, hangi yoğunlukta, hangi faydayı alır; bunu açık dille gösterir.',
        })}
        <div class="comparison-grid">
          <article class="comparison-card">
            <div class="comparison-header">
              <span class="pricing-tag">Free</span>
              <h3>Giriş katmanı</h3>
            </div>
            <p>Günlük stok ve temel tarif akışı için yeterli başlangıç katmanı.</p>
            <ul class="comparison-list">
              <li>Temel tarama ve stok görünürlüğü</li>
              <li>Limitli AI tarif üretimi</li>
              <li>Alışveriş ve envanter takibi</li>
            </ul>
          </article>
          <article class="comparison-card comparison-card-accent">
            <div class="comparison-header">
              <span class="pricing-tag">Pro</span>
              <h3>Yoğun kullanım ve aile akışı</h3>
            </div>
            <p>Daha derin tarif, paylaşım ve planlama akışlarına ihtiyaç duyan kullanıcılar için.</p>
            <ul class="comparison-list">
              <li>Daha geniş tarif üretim limiti</li>
              <li>Family guest invite ve paylaşılabilir deneyim</li>
              <li>Beslenme, tasarruf ve ileri planlama yüzeyleri</li>
            </ul>
            <div class="stack-actions">
              ${button({
                label: 'Premium ekranını aç',
                appHref: 'fridgely://recipes',
                fallbackHref: pageHref('/premium'),
                variant: 'primary',
              })}
              <a class="secondary-link secondary-link-subtle" href="${pageHref('/support')}">Destek ve sorular</a>
            </div>
          </article>
          <article class="comparison-card">
            <div class="comparison-header">
              <span class="pricing-tag">Kimin için</span>
              <h3>Karar senaryoları</h3>
            </div>
            <ul class="comparison-list">
              <li>Tek kişi kullanım: Free ile hızlı başlangıç</li>
              <li>Tekrarlayan haftalık plan: Pro ile daha düzenli akış</li>
              <li>Paylaşımlı ev / aile: Invite ve senkron yüzeyleri daha anlamlı</li>
            </ul>
          </article>
        </div>
      </section>

      <section class="section" id="faq">
        ${sectionHeader({
          eyebrow: 'Frequently asked',
          title: 'Kritik sorular yanıtsız kalmasın.',
          body:
            'Kullanıcı ya uygulamaya dönmek, ya premium farklarını anlamak, ya da destek almak ister. Profesyonel bir site bu üç niyeti de süründürmeden karşılar.',
        })}
        <div class="faq-grid">
          <article class="faq-card">
            <h3>Bu site ne işe yarıyor?</h3>
            <p>Landing anlatısı taşır, uygulama içi linkleri toplar ve share / invite akışları için branded fallback görevi görür.</p>
          </article>
          <article class="faq-card">
            <h3>Satın alma burada mı?</h3>
            <p>Hayır. Satın alma uygulama içinde kalır. Bu site karar desteği, premium anlatısı ve destek yüzeyi olarak çalışır.</p>
          </article>
          <article class="faq-card">
            <h3>Paylaşılan linkte ne olur?</h3>
            <p>Uygulama yüklüyse ilgili Fridgely akışı açılır; değilse kullanıcı boş bir sayfaya düşmeden yönlendirilir.</p>
          </article>
          <article class="faq-card">
            <h3>Ekiple nasıl iletişime geçilir?</h3>
            <p><a href="mailto:${EMAIL_HELLO}">${EMAIL_HELLO}</a> üzerinden ürün, destek veya iş birliği için yazılabilir.</p>
          </article>
        </div>
      </section>

      <section class="cta-band" id="download">
        <div>
          <div class="eyebrow">Next step</div>
          <h2>Fridgely'yi aç, premium farklarını incele ya da destek al.</h2>
          <p>Bu yüzey tek başına bir pazarlama sayfası değil; ürünün dışa açılan, daha güvenilir ve daha kontrollü katmanı.</p>
        </div>
        <div class="stack-actions">
          ${button({
            label: 'Uygulamayı şimdi aç',
            appHref: 'fridgely://inventory',
            fallbackHref: pageHref('/support'),
            variant: 'primary',
          })}
          <a class="secondary-link" href="${pageHref('/premium')}">Premium farkları</a>
          <a class="secondary-link secondary-link-subtle" href="${pageHref('/support')}">Destek merkezi</a>
        </div>
      </section>
    `,
  });
}

function supportPage() {
  setMeta({
    title: 'Fridgely Support',
    description: 'Fridgely destek merkezi, yönlendirme aksiyonları ve ürün akışlarına dönüş noktası.',
    canonicalPath: '/support',
  });

  return shell({
    compact: true,
    content: `
      <section class="page-hero">
        <div class="page-copy">
          <div class="eyebrow">Support</div>
          <h1>Destek akışı net, ciddi ve yönlendirici olmalı.</h1>
          <p>
            Uygulama içinden gelen yardım linkleri burada toplanır. Kullanıcı ya Fridgely'ye geri döner,
            ya doğru bilgiye ulaşır, ya da ekiple hızlı şekilde iletişime geçer.
          </p>
          <div class="hero-actions">
            ${button({
              label: 'Fridgely'yi aç',
              appHref: 'fridgely://inventory',
              fallbackHref: pageHref('/'),
              variant: 'primary',
            })}
            <a class="secondary-link" href="mailto:${EMAIL_HELLO}">E-posta gönder</a>
          </div>
        </div>
        <aside class="page-rail">
          <span class="manifesto-tag">Buradan nereye gidersin</span>
          <ul class="signal-list">
            <li>Invite, tarif veya shopping linkinden geldiysen uygulamaya geri dönebilirsin.</li>
            <li>Premium kararını anlamaya çalışıyorsan plan farklarına geçebilirsin.</li>
            <li>Gizlilik ve koşullar aynı destek katmanında ulaşılabilir kalır.</li>
          </ul>
        </aside>
      </section>
      <section class="page-section">
        <div class="support-grid support-grid-expanded">
          <article class="support-card">
            <h3>Uygulamaya geri dön</h3>
            <p>Davet, tarif veya alışveriş linkinden geldiysen ilgili akışa geri dönmenin en hızlı yolu budur.</p>
            <div class="stack-actions">
              ${button({
                label: 'Uygulamayı aç',
                appHref: 'fridgely://inventory',
                fallbackHref: pageHref('/'),
                variant: 'primary',
              })}
            </div>
          </article>
          <article class="support-card">
            <h3>Premium soruları</h3>
            <p>Plan farkları, aile daveti ve ürün derinliğiyle ilgili net özet için premium yüzeyine geç.</p>
            <div class="stack-actions">
              <a class="button button-secondary" href="${pageHref('/premium')}">Premium sayfası</a>
            </div>
          </article>
          <article class="support-card">
            <h3>Güven ve yasal bilgiler</h3>
            <p>Gizlilik ve kullanım koşulları dağınık değil; aynı marka katmanında toplu halde ulaşılabilir.</p>
            <div class="stack-actions">
              <a class="button button-secondary" href="${pageHref('/privacy')}">Gizlilik</a>
              <a class="secondary-link secondary-link-subtle" href="${pageHref('/terms')}">Koşullar</a>
            </div>
          </article>
          <article class="support-card">
            <h3>Ekiple iletişim</h3>
            <p>Teknik destek, ürün soruları veya ortaklık konuları için doğrudan yaz.</p>
            <div class="stack-actions">
              <a class="button button-secondary" href="mailto:${EMAIL_HELLO}">${EMAIL_HELLO}</a>
            </div>
          </article>
        </div>
      </section>
    `,
  });
}

function premiumPage() {
  setMeta({
    title: 'Fridgely Premium',
    description: 'Fridgely Premium plan farkları, kullanım senaryoları ve uygulama içi premium akışına geçiş noktası.',
    canonicalPath: '/premium',
  });

  return shell({
    compact: true,
    content: `
      <section class="page-hero">
        <div class="page-copy">
          <div class="eyebrow">Premium</div>
          <h1>Daha çok özellik değil, daha temiz karar akışı.</h1>
          <p>
            Premium bu sayfada satın alınmaz. Burası; Free ile Pro arasındaki ürün farklarını, kimin
            hangi derinliğe ihtiyaç duyduğunu ve uygulama içi premium ekranına geçiş yolunu netleştirir.
          </p>
          <div class="hero-actions">
            ${button({
              label: 'Uygulamada premium ekranını aç',
              appHref: 'fridgely://recipes',
              fallbackHref: pageHref('/support'),
              variant: 'primary',
            })}
            <a class="secondary-link" href="${pageHref('/support')}">Destek ve sorular</a>
          </div>
        </div>
        <aside class="page-rail">
          <span class="manifesto-tag">Nerede güçleniyor</span>
          <ul class="signal-list">
            <li>Daha geniş tarif üretim derinliği</li>
            <li>Family guest invite ve paylaşılabilir premium deneyim</li>
            <li>Planlama, tasarruf ve daha yoğun kullanım senaryoları</li>
          </ul>
        </aside>
      </section>
      <section class="page-section">
        <div class="comparison-grid">
          <article class="comparison-card">
            <div class="comparison-header">
              <span class="pricing-tag">Free</span>
              <h3>Başlangıç ritmi</h3>
            </div>
            <ul class="comparison-list">
              <li>Temel tarama ve stok görünürlüğü</li>
              <li>Sınırlı AI tarif kullanımı</li>
              <li>Alışveriş ve envanter takibi</li>
            </ul>
          </article>
          <article class="comparison-card comparison-card-accent">
            <div class="comparison-header">
              <span class="pricing-tag">Pro</span>
              <h3>Yoğun kullanım</h3>
            </div>
            <ul class="comparison-list">
              <li>Daha geniş AI tarif üretim alanı</li>
              <li>Aile ve paylaşım akışlarında daha güçlü deneyim</li>
              <li>Daha ileri planlama ve premium yüzeyler</li>
            </ul>
          </article>
          <article class="comparison-card">
            <div class="comparison-header">
              <span class="pricing-tag">Karar yardımı</span>
              <h3>Ne zaman mantıklı</h3>
            </div>
            <ul class="comparison-list">
              <li>Tekrarlayan haftalık plan yapıyorsan</li>
              <li>Tarif sonucunu alışveriş ve aile akışıyla birlikte yönetiyorsan</li>
              <li>Share ve invite deneyimlerini aktif kullanıyorsan</li>
            </ul>
          </article>
        </div>
      </section>
    `,
  });
}

function legalPage(kind) {
  if (kind === 'privacy') {
    setMeta({
      title: 'Fridgely Privacy',
      description: 'Fridgely gizlilik yaklaşımı, veri kategorileri ve iletişim kanalları.',
      canonicalPath: '/privacy',
    });

    return shell({
      compact: true,
      content: `
        <section class="page-hero">
          <div class="page-copy">
            <div class="eyebrow">Privacy</div>
            <h1>Gizlilik, ürün güveninin parçasıdır.</h1>
            <p>
              Fridgely; mutfak envanteri, tarif akışı ve paylaşım deneyimleri için gereken minimum
              veri katmanını işlemeyi hedefler. Kullanıcı kontrolü açık, iletişim kanalı görünür
              ve yasal metinler ürün yüzeyinden kopuk kalmaz.
            </p>
            <div class="page-meta">Son güncelleme: 8 Mart 2026</div>
          </div>
          <aside class="page-rail">
            <span class="manifesto-tag">İletişim</span>
            <div class="stack-actions">
              <a class="button button-secondary" href="mailto:${EMAIL_PRIVACY}">${EMAIL_PRIVACY}</a>
            </div>
            <ul class="signal-list">
              <li>Harici bilgi sayfaları tek domain katmanında tutulur.</li>
              <li>Kullanıcı veri silme ve iletişim rotaları görünür kalır.</li>
            </ul>
          </aside>
        </section>
        <section class="page-section legal-layout">
          <article class="legal-card">
            <h2>Toplanan veri kategorileri</h2>
            <ul class="legal-list">
              <li>Envanter, favori ve alışveriş listesi içerikleri</li>
              <li>Tarama ve kullanım akışlarıyla ilgili uygulama tercihleri</li>
              <li>Paylaşım ve davet rotaları için gereken bağlantı metadatası</li>
            </ul>
            <h2>Kullanıcı kontrolleri</h2>
            <ul class="legal-list">
              <li>Uygulama içinden veri özeti ve dışa aktarma yüzeyleri</li>
              <li>Analiz ve kişiselleştirme tercihlerinin yönetimi</li>
              <li>Veri silme ve destek kanallarına açık erişim</li>
            </ul>
          </article>
          <aside class="support-card">
            <h3>Neden bu kadar açık?</h3>
            <p>Profesyonel ürün hissi yalnızca landing tasarımından gelmez; veri ve destek rotalarının ne kadar temiz olduğu da aynı derecede önemlidir.</p>
            <div class="stack-actions">
              <a class="secondary-link" href="${pageHref('/terms')}">Kullanım koşulları</a>
            </div>
          </aside>
        </section>
      `,
    });
  }

  setMeta({
    title: 'Fridgely Terms',
    description: 'Fridgely kullanım koşulları ve ürün kullanımı ile ilgili temel ilkeler.',
    canonicalPath: '/terms',
  });

  return shell({
    compact: true,
    content: `
      <section class="page-hero">
        <div class="page-copy">
          <div class="eyebrow">Terms</div>
          <h1>Kullanım koşulları sade ve izlenebilir kalmalı.</h1>
          <p>
            Fridgely, mutfak organizasyonu ve tarif üretimi için sunulan bir yardımcı üründür.
            Kullanıcı, uygulama içinde paylaştığı içeriklerden ve oluşturduğu davet linklerinden sorumludur.
          </p>
          <div class="page-meta">Son güncelleme: 8 Mart 2026</div>
        </div>
        <aside class="page-rail">
          <span class="manifesto-tag">Devam et</span>
          <div class="stack-actions">
            <a class="button button-secondary" href="${pageHref('/support')}">Destek merkezi</a>
            <a class="secondary-link secondary-link-subtle" href="${pageHref('/privacy')}">Gizlilik</a>
          </div>
        </aside>
      </section>
      <section class="page-section legal-layout">
        <article class="legal-card">
          <h2>Beklentiler</h2>
          <ul class="legal-list">
            <li>Paylaşım özellikleri kötüye kullanılmamalıdır.</li>
            <li>Premium hakları yalnızca izin verilen hesap akışlarında kullanılmalıdır.</li>
            <li>Ürün içeriği bilgilendirme amaçlıdır; tıbbi veya yasal tavsiye yerine geçmez.</li>
          </ul>
          <h2>Güncellemeler</h2>
          <p>Ürün akışı değiştikçe destek, yasal sayfalar ve fallback rotaları aynı domain katmanında güncellenebilir.</p>
        </article>
        <aside class="support-card">
          <h3>Ürün ve güven aynı katmanda kalır</h3>
          <p>Yasal sayfalar ayrı bir kopuk alan değil; kullanıcının ürün algısını güçlendiren destek katmanının parçasıdır.</p>
        </aside>
      </section>
    `,
  });
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
}) {
  setMeta({
    title,
    description,
    canonicalPath,
  });

  const chipHtml = (chips || [])
    .map((chip) => `<span class="meta-chip">${escapeHtml(chip)}</span>`)
    .join('');

  return shell({
    compact: true,
    shellClass: 'site-shell-centered',
    mainClass: 'main-centered',
    content: `
      <section class="deep-link-panel">
        <div class="eyebrow">${escapeHtml(eyebrow)}</div>
        <div class="deep-link-meta">${chipHtml}</div>
        <h1 class="deep-link-title">${escapeHtml(title)}</h1>
        <p class="lead">${escapeHtml(description)}</p>
        <div class="hero-actions">
          ${button({
            label: 'Fridgely uygulamasını aç',
            appHref,
            fallbackHref,
            variant: 'primary',
          })}
          <a class="secondary-link" href="${secondaryHref}">${secondaryLabel}</a>
        </div>
        <div class="support-grid">
          <article class="support-card">
            <h3>Ne olacak?</h3>
            <ul class="signal-list">
              <li>Uygulama yüklüyse doğrudan ilgili Fridgely akışı açılmaya çalışılır.</li>
              <li>Açık değilse kullanıcı destek veya ürün bağlamına düşecek şekilde yönlendirilir.</li>
              <li>Bu fallback sayfası linkin ne işe yaradığını her durumda görünür tutar.</li>
            </ul>
          </article>
          <article class="support-card">
            <h3>Alternatif rota</h3>
            <p>Bu linkten devam etmek istemiyorsan ürünün ana akışlarını veya premium farklarını inceleyebilirsin.</p>
            <div class="stack-actions">
              <a class="secondary-link secondary-link-subtle" href="${pageHref('/support')}">Destek merkezi</a>
            </div>
          </article>
        </div>
      </section>
    `,
  });
}

function routeDeepLink(path, query) {
  if (path === '/support') return supportPage();
  if (path === '/premium') return premiumPage();
  if (path === '/privacy') return legalPage('privacy');
  if (path === '/terms') return legalPage('terms');

  if (path === '/invite/family') {
    const code = (query.get('code') || 'HAZIR').trim();
    const owner = (query.get('owner') || '').trim();
    return deepLinkPage({
      eyebrow: 'Family Invite',
      title: 'Aile daveti hazır.',
      description:
        'Bu link, Fridgely içindeki 30 günlük aile daveti akışını açmak için üretildi. Uygulama yüklüyse devam doğrudan orada sürer.',
      chips: [
        `Kod: FRIDGELY-${code}`,
        owner ? `Sahip: ${owner.slice(0, 8)}...` : 'Paylaşılabilir davet',
      ],
      appHref: 'fridgely://inventory',
      fallbackHref: pageHref('/support'),
      secondaryHref: pageHref('/premium'),
      secondaryLabel: 'Premium farklarını gör',
      canonicalPath: '/invite/family',
    });
  }

  if (path === '/recipe' || path.startsWith('/recipe/')) {
    const rawRecipeId =
      path === '/recipe' ? (query.get('id') || '').trim() : (path.split('/')[2] || '').trim();
    const safeRecipeName = (query.get('name') || 'Paylaşılan tarif').trim();
    const recipeAppHref = rawRecipeId
      ? `fridgely://recipe/${encodeURIComponent(rawRecipeId)}`
      : 'fridgely://recipes';

    return deepLinkPage({
      eyebrow: 'Recipe Share',
      title: safeRecipeName,
      description:
        'Bu bağlantı Fridgely içindeki tarif paylaşımı için oluşturuldu. Uygulamayı açar, ilgili akışa geçer veya sistemin nasıl çalıştığını buradan incelersin.',
      chips: [`Tarif ID: ${rawRecipeId || 'hazır'}`, 'Paylaşım linki'],
      appHref: recipeAppHref,
      fallbackHref: pageHref('/recipes'),
      secondaryHref: pageHref('/#workflow'),
      secondaryLabel: 'Ürün akışına bak',
      canonicalPath: rawRecipeId ? `/recipe/${rawRecipeId}` : '/recipe',
    });
  }

  if (path === '/recipes') {
    return deepLinkPage({
      eyebrow: 'Recipes',
      title: 'Tarif akışına geri dön.',
      description:
        'Fridgely içindeki tarif üretimi ve sonuç akışları uygulamada çalışır. Buradan ilgili ürün akışına veya premium farklarına dönebilirsin.',
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
        'Buzdolabı, tarayıcı ve stok görünürlüğü Fridgely uygulaması içinde çalışır. Buradan uygulamayı yeniden açabilir veya sistemin mantığını inceleyebilirsin.',
      chips: ['Scanner', 'Inventory'],
      appHref: 'fridgely://inventory',
      fallbackHref: pageHref('/support'),
      secondaryHref: pageHref('/#surfaces'),
      secondaryLabel: 'Yüzeyleri gör',
      canonicalPath: '/inventory',
    });
  }

  if (path === '/shopping') {
    return deepLinkPage({
      eyebrow: 'Shopping',
      title: 'Alışveriş akışına devam et.',
      description:
        'Fridgely alışveriş listesi, AI önerileri ve eksik malzeme yönetimini aynı operasyon katmanında tutar.',
      chips: ['Shopping', 'AI suggestions'],
      appHref: 'fridgely://shopping',
      fallbackHref: pageHref('/support'),
      secondaryHref: pageHref('/premium'),
      secondaryLabel: 'Premium akışlarını incele',
      canonicalPath: '/shopping',
    });
  }

  return null;
}

function notFoundPage() {
  setMeta({
    title: 'Sayfa bulunamadı',
    description: 'Aradığınız Fridgely sayfası bulunamadı.',
    canonicalPath: '/',
  });

  return shell({
    compact: true,
    shellClass: 'site-shell-centered',
    mainClass: 'main-centered',
    content: `
      <section class="deep-link-panel">
        <div class="eyebrow">404</div>
        <h1 class="deep-link-title">Bu rota Fridgely'de boş kalmamalı.</h1>
        <p class="lead">Aradığın bağlantı taşınmış olabilir. Ana sayfaya dönerek doğru akışa geçebilirsin.</p>
        <div class="hero-actions">
          <a class="button button-primary" href="${pageHref('/')}">Ana sayfaya dön</a>
          <a class="secondary-link" href="${pageHref('/support')}">Destek merkezi</a>
        </div>
      </section>
    `,
  });
}

function bindInteractions() {
  const themeToggle = document.querySelector('[data-theme-toggle]');
  if (themeToggle) {
    const syncThemeLabel = () => {
      const preference = currentThemePreference();
      themeToggle.textContent = themeButtonLabel(preference);
      themeToggle.dataset.themePreference = preference;
    };

    syncThemeLabel();

    themeToggle.onclick = () => {
      const nextPreference = nextThemePreference(currentThemePreference());
      applyThemePreference(nextPreference);
      syncThemeLabel();
    };

    const onSystemThemeChange = () => {
      if (currentThemePreference() === 'system') {
        applyThemePreference('system');
        syncThemeLabel();
      }
    };

    if (typeof SYSTEM_THEME_QUERY.addEventListener === 'function') {
      SYSTEM_THEME_QUERY.addEventListener('change', onSystemThemeChange);
    }
  }

  const navShell = document.querySelector('[data-nav-shell]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  if (navShell && navToggle) {
    const syncMenuState = (isOpen) => {
      navShell.dataset.navOpen = String(isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.textContent = isOpen ? 'Kapat' : 'Menü';
    };

    syncMenuState(false);
    navToggle.onclick = () => {
      const isOpen = navShell.dataset.navOpen === 'true';
      syncMenuState(!isOpen);
    };

    navShell.querySelectorAll('.nav-links a').forEach((link) => {
      link.onclick = () => syncMenuState(false);
    });
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
  applyThemePreference(currentThemePreference());
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
