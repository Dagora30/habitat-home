import assert from "node:assert/strict";
import test from "node:test";
import { filterProducts, formatPrice, products } from "../src/catalog.js";

const defaults = { category: "Todos", search: "", sort: "featured", onlyFavorites: false, favorites: [] };
const filter = (changes) => filterProducts({ ...defaults, ...changes });

test("search matches accented names and trims whitespace in any term order", () => {
  assert.deepEqual(filter({ search: "  NATURAL   sofa  " }).map(({ id }) => id), [1]);
  assert.deepEqual(filter({ search: "lampara" }).map(({ id }) => id), [5]);
});

test("category, search and favorites combine without modifying the catalog", () => {
  assert.deepEqual(filter({ category: "Sillas", search: "tejido", onlyFavorites: true, favorites: [1, 2] }).map(({ id }) => id), [2]);
  assert.deepEqual(filter({ onlyFavorites: true }), []);
  assert.deepEqual(filter({ category: "Sillas", search: "sofa" }), []);
});

test("price sorts both ways while preserving featured order", () => {
  const ascending = filter({ sort: "low" }).map(({ price }) => price);
  const descending = filter({ sort: "high" }).map(({ price }) => price);
  assert.equal(ascending[0], 380000);
  assert.equal(descending[0], 2890000);
  assert.deepEqual(ascending, descending.toReversed());
  assert.deepEqual(filter(), products);
});

test("prices display as whole Colombian pesos", () => {
  assert.match(formatPrice(2890000), /^COP\s2\.890\.000$/);
});
