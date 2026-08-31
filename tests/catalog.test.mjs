import test from 'node:test';
import assert from 'node:assert/strict';
import { products, findProducts, orderSummary, orderUrl, WHATSAPP_NUMBER } from '../catalog.js';

test('retains the original catalog prices and unique products', () => {
  assert.equal(new Set(products.map(product => product.id)).size, 13);
  assert.deepEqual(products.map(product => product.price), [120,55,25,20,80,42,30,18,28,65,45,22,38]);
});
test('search combines category and accent-insensitive text', () => {
  assert.deepEqual(findProducts('antojitos','OAXAQUENOS').map(product=>product.id), ['tamales']);
  assert.equal(findProducts('bebidas','tlayuda').length, 0);
  assert.equal(findProducts('todos','   ').length,13);
});
test('cart ignores invalid quantities and calculates correct totals', () => {
  const summary = orderSummary({mole:2,tlayuda:1,tamales:0,quesillo:-1,atole:1.5,aceite:100,unknown:4});
  assert.equal(summary.count,3);
  assert.equal(summary.total,295);
  assert.equal(orderUrl({}),null);
});
test('WhatsApp link preserves recipient and contains each ordered product and total', () => {
  const url = new URL(orderUrl({mole:2,tlayuda:1}));
  assert.equal(url.origin,'https://wa.me');
  assert.equal(url.pathname,`/${WHATSAPP_NUMBER}`);
  assert.equal(WHATSAPP_NUMBER,'529511817882');
  const text=url.searchParams.get('text');
  assert.match(text,/Mole Negro Artesanal \(frasco 400 g\) × 2 = \$240/);
  assert.match(text,/Tlayuda con tasajo \(pieza\) × 1 = \$55/);
  assert.match(text,/Total de productos: \$295 MXN/);
  assert.match(text,/disponibilidad/);
});
