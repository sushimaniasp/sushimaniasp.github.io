(function(){
  const DATA = window.CARDAPIO_DATA || { config:{}, promoProducts:[], menuProducts:[] };

  // ===== Helpers =====
  const $ = (id) => document.getElementById(id);
  const money = (v) => "R$ " + Number(v || 0).toFixed(2).replace(".", ",");
  const TRANSPARENT_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
  let imageObserver = null;

  // ===== Selection (localStorage) =====
  const SELECTION_KEY = "cardapio_selection_v1";
  let selection = safeParse(localStorage.getItem(SELECTION_KEY)) || null; // {productId, drink, barcaItems}

  function safeParse(s){ try { return JSON.parse(s); } catch { return null; } }
  function saveSelection(){ localStorage.setItem(SELECTION_KEY, JSON.stringify(selection)); }
  function setSelection(next){
    selection = next;
    saveSelection();
  }
  function clearSelection(){
    selection = null;
    saveSelection();
  }

  function findProduct(id){
    return [...(DATA.promoProducts || []), ...(DATA.menuProducts || [])].find(p=>p.id === id);
  }

  // Expor para Finalizar.html
  window.Cardapio = { money, getSelection: () => selection, setSelection, clearSelection, findProduct, data: DATA };

  // ===== Render base (index.html) =====
  function applyConfig(){
    if(!$("storeName")) return; // se não for index.html, ignora
    const c = DATA.config || {};

    document.title = `Cardápio • ${c.storeName || "Loja"}`;
    $("storeName").textContent = c.storeName || "Loja";
    const logo = $("logo");
    const logoImage = c.logoImage || "";
    logo.textContent = "";
    logo.classList.toggle("has-image", Boolean(logoImage));
    if(logoImage){
      const img = document.createElement("img");
      img.src = logoImage;
      img.alt = c.storeName || "Logo";
      img.loading = "eager";
      img.decoding = "async";
      img.fetchPriority = "high";
      logo.appendChild(img);
    } else {
      logo.textContent = c.logoText || "🍣";
    }
    $("storeLine").textContent = c.line || "";
    $("headline").textContent = c.headline || "Faça seu pedido!";
    $("subtitle").textContent = c.subtitle || "";

    $("instagram").href = c.instagramUrl || "#";
    $("location").textContent = c.location || "";
    $("distance").textContent = c.distance || "";
    $("rating").textContent = c.rating || "";
    $("reviewsCount").textContent = c.reviewsCount || "";

    $("promoTitle").textContent = c.promo?.title || "Promoção";
    $("promoDesc").textContent = c.promo?.desc || "";

    $("deliveryTypes").textContent = c.info?.deliveryTypes || "";
    $("payments").textContent = c.info?.payments || "";
    $("address").textContent = c.info?.address || "";
    $("areas").textContent = c.info?.areas || "";

    const badge = $("openBadge");
    if(c.open?.isOpen === false){
      badge.querySelector(".dot").style.background = "var(--danger)";
      $("openText").textContent = "FECHADO";
      $("openUntil").textContent = "";
    } else {
      $("openText").textContent = c.open?.message || "Aberto";
      $("openUntil").textContent = c.open?.message ? "" : " " + (c.open?.until || "");
    }

    // chips categorias
    const cats = c.categories || [];
    $("chips").innerHTML = cats.map(cat => `<span class="chip" data-cat="${cat}">${cat}</span>`).join("");
  }

  function productCard(prod){
    const old = prod.oldPrice ? `<div class="old">${money(prod.oldPrice)}</div>` : "";
    const tag = prod.tag ? `<span class="tag">${prod.tag}</span>` : `<span style="height:26px"></span>`;
    const thumb = prod.image
      ? `<img src="${TRANSPARENT_PIXEL}" data-src="${prod.image}" alt="${prod.title}" loading="lazy" decoding="async" width="110" height="110" />`
      : `${(prod.tag || prod.cat || "🍣").slice(0,2)}`;
    return `
      <div class="item" data-id="${prod.id}">
        <div class="thumb">${thumb}</div>
        <div class="itxt">
          <div class="t">${prod.title}</div>
          <p class="d">${prod.desc || ""}</p>
        </div>
        <div class="price">
          ${tag}
          <div style="text-align:right">
            ${old}
            <div class="new">${money(prod.price)}</div>
          </div>
          <div class="itemActions">
            <button class="iconBtn primary" data-select="${prod.id}">Selecionar</button>
          </div>
        </div>
      </div>
    `;
  }

  function setupLazyImages(){
    const images = document.querySelectorAll("img[data-src]");
    if(!images.length) return;

    if(!("IntersectionObserver" in window)){
      images.forEach(img => {
        img.src = img.dataset.src || img.src;
        img.removeAttribute("data-src");
      });
      return;
    }

    if(!imageObserver){
      imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if(!entry.isIntersecting) return;
          const img = entry.target;
          const src = img.dataset.src;
          if(src){
            img.src = src;
            img.removeAttribute("data-src");
          }
          observer.unobserve(img);
        });
      }, { rootMargin: "200px 0px" });
    }

    images.forEach(img => imageObserver.observe(img));
  }

  function renderLists(filterText = "", filterCat = ""){
    if(!$("promoList")) return;

    const text = (filterText || "").toLowerCase();

    const promo = DATA.promoProducts || [];
    const menu = DATA.menuProducts || [];

    $("promoList").innerHTML = promo
      .filter(p => matches(p, text, filterCat))
      .map(productCard).join("") || `<div class="empty">Nada encontrado nas promoções.</div>`;

    $("menuList").innerHTML = menu
      .filter(p => matches(p, text, filterCat))
      .map(productCard).join("") || `<div class="empty">Nada encontrado no cardápio.</div>`;

    setupLazyImages();

    // bind select buttons
    document.querySelectorAll("[data-select]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const id = btn.getAttribute("data-select");
        const prod = findProduct(id);
        if(prod) openSelectionModal(prod);
      });
    });
  }

  function matches(p, text, cat){
    const inText = !text || [p.title,p.desc,p.cat,p.tag].join(" ").toLowerCase().includes(text);
    const inCat = !cat || p.cat === cat;
    return inText && inCat;
  }

  function renderReviews(){
    if(!$("reviews")) return;
    const list = (DATA.config?.reviews || []).map(r => `
      <div class="rev">
        ${r.image ? `<div class="revImage"><img src="${TRANSPARENT_PIXEL}" data-src="${r.image}" alt="Avaliação de ${r.name}" loading="lazy" decoding="async" width="64" height="64" /></div>` : ""}
        <div class="revContent">
          <div class="revTop">
            <div class="name">${r.name}</div>
            <div class="stars">${"★".repeat(r.stars)}${"☆".repeat(5-r.stars)}</div>
          </div>
          <p>${r.text}</p>
        </div>
      </div>
    `).join("");
    $("reviews").innerHTML = list || `<div class="empty">Sem avaliações por enquanto.</div>`;
    setupLazyImages();
  }

  // ===== Modal de seleção =====
  function getBarcaMaxSelections(prod){
    const title = prod.title || "";
    const match = title.match(/(\d+)\s*peças?/i);
    if(!match) return null;
    const totalPieces = Number(match[1]);
    if(!Number.isFinite(totalPieces) || totalPieces <= 0) return null;
    return Math.floor(totalPieces / 20);
  }

  function updateBarcaSelectionState(){
    const barcaList = $("barcaList");
    const maxSelections = Number(barcaList?.dataset.maxSelections || 0);
    if(!barcaList || !maxSelections) return;
    const checked = barcaList.querySelectorAll("input:checked").length;
    barcaList.querySelectorAll("input:not(:checked)").forEach(input => {
      input.disabled = checked >= maxSelections;
    });
  }

  function openSelectionModal(prod){
    const modal = $("selectionModal");
    if(!modal) return;

    const drinks = DATA.config?.drinks || [];
    const barcaItems = DATA.config?.barcaItems || [];

    modal.hidden = false;
    modal.dataset.productId = prod.id;

    $("modalTitle").textContent = prod.title;
    $("modalDesc").textContent = prod.desc || "Escolha as opções e finalize.";

    const drinkSelect = $("modalDrink");
    drinkSelect.innerHTML = ["Sem bebida", ...drinks].map(drink => `<option>${drink}</option>`).join("");

    const barcaBox = $("barcaOptions");
    const barcaList = $("barcaList");
    const isBarca = prod.cat === "Barcas" || /barca/i.test(prod.title);
    const maxSelections = isBarca ? getBarcaMaxSelections(prod) : null;
    modal.dataset.isBarca = String(Boolean(isBarca && maxSelections));
    modal.dataset.maxBarcaSelections = maxSelections ? String(maxSelections) : "";
    if(isBarca && maxSelections){
      barcaBox.hidden = false;
      barcaList.dataset.maxSelections = String(maxSelections);
      barcaList.innerHTML = barcaItems.map(item => `
        <label class="pillOption">
          <input type="checkbox" value="${item}" />${item}
        </label>
      `).join("");
      barcaList.querySelectorAll("input").forEach(input => {
        input.addEventListener("change", updateBarcaSelectionState);
      });
      updateBarcaSelectionState();
    } else {
      barcaBox.hidden = true;
      barcaList.dataset.maxSelections = "";
      barcaList.innerHTML = "";
    }
  }

  function closeSelectionModal(){
    const modal = $("selectionModal");
    if(!modal) return;
    modal.hidden = true;
    modal.dataset.productId = "";
  }

  function bindModalEvents(){
    const modal = $("selectionModal");
    if(!modal) return;

    $("closeModal")?.addEventListener("click", closeSelectionModal);
    $("cancelModal")?.addEventListener("click", closeSelectionModal);

    $("confirmSelection")?.addEventListener("click", ()=>{
      const productId = modal.dataset.productId;
      if(!productId) return;

      const drink = $("modalDrink")?.value || "Sem bebida";
      const barcaItems = Array.from($("barcaList")?.querySelectorAll("input:checked") || [])
        .map(input => input.value);

      const mustSelectBarca = modal.dataset.isBarca === "true";
      const maxBarcaSelections = Number(modal.dataset.maxBarcaSelections || 0);
      if(mustSelectBarca && maxBarcaSelections && barcaItems.length !== maxBarcaSelections){
        alert(`Selecione ${maxBarcaSelections} itens da barca.`);
        return;
      }

      setSelection({ productId, drink, barcaItems });
      location.href = "./Finalizar.html";
    });
  }

  // ===== Countdown =====
  function startCountdown(){
    if(!$("mLeft")) return;
    let left = Number(DATA.config?.promo?.countdownSeconds || 0);

    function tick(){
      left = Math.max(0, left - 1);
      const m = Math.floor(left / 60);
      const s = left % 60;
      $("mLeft").textContent = String(m).padStart(2,"0");
      $("sLeft").textContent = String(s).padStart(2,"0");
      if(left === 0 && $("promoHint")){
        $("promoHint").textContent = "Promoção encerrada (edite o timer no data.js).";
      }
    }
    tick();
    setInterval(tick, 1000);
  }

  // ===== Events =====
  function bindEvents(){
    $("btnOrder")?.addEventListener("click", ()=> location.href = "./Finalizar.html");
    $("btnPromo")?.addEventListener("click", ()=> $("secPromo")?.scrollIntoView({behavior:"smooth"}));

    // busca
    $("search")?.addEventListener("input", (e)=>{
      const text = e.target.value || "";
      const active = document.querySelector(".chip.active");
      renderLists(text, active?.getAttribute("data-cat") || "");
    });

    // chips
    document.querySelectorAll(".chip").forEach(ch=>{
      ch.addEventListener("click", ()=>{
        const isActive = ch.classList.contains("active");
        document.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));
        if(!isActive) ch.classList.add("active");

        const cat = ch.classList.contains("active") ? ch.getAttribute("data-cat") : "";
        const text = $("search")?.value || "";
        renderLists(text, cat);
      });
    });
  }

  // ===== init =====
  applyConfig();
  renderReviews();
  renderLists();
  bindEvents();
  bindModalEvents();
  startCountdown();
})();
