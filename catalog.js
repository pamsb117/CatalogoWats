export const WHATSAPP_NUMBER = '529511817882';
export const categories = [
  ['todos', 'Todo el mercado'], ['antojitos', 'Antojitos'], ['regional', 'Regional'],
  ['abarrotes', 'Abarrotes'], ['bebidas', 'Bebidas'], ['dulces', 'Dulces y botanas'],
];

export const products = [
  { id: 'mole', category: 'regional', name: 'Mole Negro Artesanal', price: 120, unit: 'frasco 400 g', emoji: '🫙', description: 'Receta de la abuela, con chilhuacle negro, mulato y más de 30 ingredientes.', badge: 'De la casa', featured: true },
  { id: 'tlayuda', category: 'antojitos', name: 'Tlayuda con tasajo', price: 55, unit: 'pieza', emoji: '🫔', description: 'Tortilla grande con frijoles, quesillo y tasajo oaxaqueño.', badge: 'Nuevo' },
  { id: 'tamales', category: 'antojitos', name: 'Tamales oaxaqueños', price: 25, unit: 'pieza', emoji: '🌽', description: 'Envueltos en hoja de plátano, rellenos de mole negro o rajas.' },
  { id: 'atole', category: 'bebidas', name: 'Atole de guayaba', price: 20, unit: '', emoji: '🍵', description: 'Bebida caliente tradicional, hecha al momento.' },
  { id: 'quesillo', category: 'regional', name: 'Quesillo artesanal', price: 80, unit: '250 g', emoji: '🧀', description: 'Queso de hebra fresco, traído directo de Etla.', badge: 'Popular' },
  { id: 'aceite', category: 'abarrotes', name: 'Aceite vegetal 1L', price: 42, unit: '1 litro', emoji: '🫒', description: 'Marca popular, calidad garantizada para cocinar.' },
  { id: 'chapulines', category: 'dulces', name: 'Chapulines con chile', price: 30, unit: '', emoji: '🍬', description: 'Botana típica oaxaqueña, tostaditos y bien sazonados.', badge: 'Oferta' },
  { id: 'jamaica', category: 'bebidas', name: 'Agua de Jamaica', price: 18, unit: '', emoji: '🧃', description: 'Fresca, natural, preparada con jamaica de la región.' },
  { id: 'arroz', category: 'abarrotes', name: 'Arroz blanco 1kg', price: 28, unit: '1 kg', emoji: '🌾', description: 'Grano largo, perfecto para cualquier guiso del día.' },
  { id: 'salsa', category: 'regional', name: 'Salsa de chilhuacle', price: 65, unit: '', emoji: '🌶️', description: 'En tarro, hecha en casa, para todo tipo de platillos.', badge: 'Nuevo' },
  { id: 'chocolate', category: 'dulces', name: 'Chocolate Mayordomo', price: 45, unit: '', emoji: '🍫', description: 'Tablilla para chocolate caliente estilo oaxaqueño.' },
  { id: 'memelas', category: 'antojitos', name: 'Memelas con frijol', price: 22, unit: '', emoji: '🥣', description: 'Tortillas gruesas de maíz con frijoles negros y salsa.' },
  { id: 'huevos', category: 'abarrotes', name: 'Huevo blanco (12 pzas)', price: 38, unit: '12 piezas', emoji: '🥚', description: 'Cartón de huevo fresco, recolectado localmente.' },
];

export const money = amount => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(amount);
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export function findProducts(category, query = '') {
  const search = normalize(query);
  return products.filter(product => (category === 'todos' || category === product.category) && normalize(`${product.name} ${product.description}`).includes(search));
}

export function orderSummary(cart) {
  const items = products.flatMap(product => {
    const qty = cart[product.id];
    return Number.isInteger(qty) && qty > 0 && qty <= 99 ? [{ ...product, qty }] : [];
  });
  return { items, count: items.reduce((sum, item) => sum + item.qty, 0), total: items.reduce((sum, item) => sum + item.price * item.qty, 0) };
}

export function orderUrl(cart) {
  const { items, total } = orderSummary(cart);
  if (!items.length) return null;
  const lines = items.map(item => `${item.name}${item.unit ? ` (${item.unit})` : ''} × ${item.qty} = ${money(item.price * item.qty)}`);
  const message = `¡Hola Don Aurelio! Quisiera consultar este pedido:\n\n${lines.join('\n')}\n\nTotal de productos: ${money(total)} MXN\n\n¿Me confirmas disponibilidad y opciones de entrega o recolección?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
