import { products, categories, money, findProducts, orderSummary, orderUrl } from './catalog.js';

const cart = Object.create(null);
let activeCategory = 'todos';
let query = '';
let toastTimer;
const grid = document.querySelector('#productGrid');
const dialog = document.querySelector('#cartDialog');
const bagIcon = '<svg class="icon" aria-hidden="true"><use href="#icon-bag"/></svg>';
const arrowIcon = '<svg class="icon" aria-hidden="true"><use href="#icon-arrow"/></svg>';
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function quantityControl(product, qty, source) {
  return `<div class="qty-control" aria-label="Cantidad de ${escapeHtml(product.name)}">
    <button type="button" data-change="-1" data-id="${product.id}" data-source="${source}" aria-label="Quitar uno de ${escapeHtml(product.name)}">−</button>
    <output aria-label="Unidades">${qty}</output>
    <button type="button" data-change="1" data-id="${product.id}" data-source="${source}" aria-label="Agregar uno de ${escapeHtml(product.name)}" ${qty >= 99 ? 'disabled' : ''}>+</button>
  </div>`;
}

function renderProducts() {
  const visible = findProducts(activeCategory, query);
  document.querySelector('#resultCount').textContent = `${visible.length} ${visible.length === 1 ? 'producto' : 'productos'}`;
  grid.innerHTML = visible.length ? visible.map(product => {
    const qty = cart[product.id] || 0;
    const categoryLabel = categories.find(([id]) => id === product.category)[1];
    return `<article class="product-card ${product.featured ? 'featured-product' : ''} ${qty ? 'in-cart' : ''}" data-category="${product.category}">
      <div class="product-top"><span class="product-symbol" aria-hidden="true">${product.emoji}</span>${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}</div>
      <p class="product-category">${categoryLabel}</p><h3>${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-footer"><div class="price">${money(product.price)}<small>${product.unit ? `/ ${product.unit}` : 'MXN'}</small></div>
      ${qty ? quantityControl(product, qty, 'grid') : `<button type="button" class="add-button" data-add="${product.id}" aria-label="Agregar ${escapeHtml(product.name)}">+ Agregar</button>`}</div></article>`;
  }).join('') : '<div class="no-results"><h3>No encontramos ese antojo</h3><p>Prueba otro nombre o vuelve a ver todos los productos.</p><button class="reset-search" type="button" data-reset>Ver todo el mercado</button></div>';
}

function orderMarkup() {
  const { items, count, total } = orderSummary(cart);
  const contents = items.length ? `<div class="order-items">${items.map(item => `<div class="order-item"><div class="order-item-top"><h3>${item.name}</h3><span class="order-item-price">${money(item.price * item.qty)}</span></div><div class="order-item-controls"><span>${money(item.price)} ${item.unit ? `/ ${item.unit}` : 'por unidad'}</span>${quantityControl(item, item.qty, 'order')}</div></div>`).join('')}</div>` : `<div class="order-empty"><div class="empty-symbol">${bagIcon}</div><h3>Algo rico empieza aquí</h3><p>Agrega tus favoritos del catálogo.<br>Nosotros te ayudamos con el resto.</p></div>`;
  return `${contents}<div class="order-summary"><div class="total"><span>Total de productos</span><strong>${money(total)}</strong></div>
    ${count ? `<a class="checkout" href="${orderUrl(cart)}" target="_blank" rel="noopener noreferrer">Pedir por WhatsApp ${arrowIcon}</a>` : '<button class="checkout" type="button" disabled>Agrega productos para pedir</button>'}
    <p class="checkout-note">Precios en MXN. Confirma disponibilidad y entrega por WhatsApp. No se realiza ningún cobro aquí.</p></div>`;
}

function renderOrder() {
  const { count, total } = orderSummary(cart);
  document.querySelectorAll('[data-order-body]').forEach(body => { body.innerHTML = orderMarkup(); });
  document.querySelectorAll('[data-count]').forEach(element => { element.textContent = count; });
  document.querySelector('[data-mobile-total]').textContent = money(total);
  document.querySelector('#mobileOrder').setAttribute('aria-label', `Ver pedido, ${count} productos, ${money(total)}`);
}

function announce(message) {
  clearTimeout(toastTimer);
  document.querySelector('#cartStatus').textContent = message;
  toastTimer = setTimeout(() => { document.querySelector('#cartStatus').textContent = ''; }, 2400);
}

function changeQuantity(id, delta, source) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  const next = Math.max(0, Math.min(99, (cart[id] || 0) + delta));
  if (next) cart[id] = next;
  else delete cart[id];
  renderProducts();
  renderOrder();
  const root = source === 'grid' ? grid : dialog.open ? dialog : document.querySelector('#orderPanel');
  const focusTarget = root.querySelector(`[data-id="${id}"][data-change="${delta}"]:not(:disabled)`) || root.querySelector(`[data-id="${id}"][data-change="-1"]`) || root.querySelector(`[data-add="${id}"]`) || (dialog.open ? document.querySelector('#closeDialog') : document.querySelector('#orderTitle'));
  focusTarget?.focus({ preventScroll: true });
  announce(next ? `${product.name}: ${next} en tu pedido` : `${product.name} eliminado del pedido`);
}

document.querySelector('#categoryFilters').innerHTML = categories.map(([id, label]) => `<button class="filter" type="button" data-category-filter="${id}" aria-pressed="${id === 'todos'}">${label}</button>`).join('');
document.querySelector('#categoryFilters').addEventListener('click', event => {
  const button = event.target.closest('[data-category-filter]');
  if (!button) return;
  activeCategory = button.dataset.categoryFilter;
  document.querySelectorAll('[data-category-filter]').forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  renderProducts();
});

document.querySelector('#productSearch').addEventListener('input', event => { query = event.target.value; renderProducts(); });
document.addEventListener('click', event => {
  const add = event.target.closest('[data-add]');
  const change = event.target.closest('[data-change]');
  if (add) changeQuantity(add.dataset.add, 1, 'grid');
  if (change) changeQuantity(change.dataset.id, Number(change.dataset.change), change.dataset.source);
  if (event.target.closest('[data-reset]')) {
    activeCategory = 'todos'; query = ''; document.querySelector('#productSearch').value = '';
    document.querySelectorAll('[data-category-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.categoryFilter === 'todos')));
    renderProducts(); document.querySelector('#productSearch').focus();
  }
  if (event.target.closest('[data-open-order]') && !dialog.open) { dialog.showModal(); document.body.style.overflow = 'hidden'; }
});
document.querySelector('#closeDialog').addEventListener('click', () => dialog.close());
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && dialog.open) {
    event.preventDefault();
    dialog.close();
  }
});
dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
renderProducts();
renderOrder();
