export const products = [
  {
    id: 1,
    name: "Sofá Lino Natural",
    cat: "Salas",
    price: 2890000,
    image: "sofa",
    tag: "Destacado",
    desc: "Un sofá de líneas limpias, tapizado suave y comodidad para todos los días.",
    size: "220 × 88 × 80 cm",
    material: "Lino y madera maciza",
  },
  {
    id: 2,
    name: "Silla Nórdica Olmo",
    cat: "Sillas",
    price: 690000,
    image: "chair",
    tag: "Nuevo",
    desc: "Diseño orgánico y estructura sólida para cualquier rincón.",
    size: "55 × 55 × 78 cm",
    material: "Madera y tejido",
  },
  {
    id: 3,
    name: "Mesa Roble Esencial",
    cat: "Comedores",
    price: 1790000,
    image: "dining",
    tag: "",
    desc: "Mesa cálida para compartir momentos especiales.",
    size: "160 × 90 × 75 cm",
    material: "Roble natural",
  },
  {
    id: 4,
    name: "Cama Serena",
    cat: "Dormitorios",
    price: 2450000,
    image: "bed",
    tag: "",
    desc: "Un descanso que combina textura y calma.",
    size: "160 × 200 cm",
    material: "Madera y tapizado",
  },
  {
    id: 5,
    name: "Lámpara Ámbar",
    cat: "Decoración",
    price: 380000,
    image: "lamp",
    tag: "Nuevo",
    desc: "Iluminación acogedora para ambientes contemporáneos.",
    size: "38 × 58 cm",
    material: "Metal pintado",
  },
  {
    id: 6,
    name: "Escritorio Atelier",
    cat: "Oficina",
    price: 1290000,
    image: "table",
    tag: "",
    desc: "Un mueble versátil de diseño atemporal.",
    size: "120 × 60 × 75 cm",
    material: "Madera natural",
  },
  {
    id: 7,
    name: "Butaca Arena",
    cat: "Sillas",
    price: 990000,
    image: "accent",
    tag: "",
    desc: "Una pieza de acento para espacios con carácter.",
    size: "70 × 75 × 82 cm",
    material: "Tela y madera",
  },
];

export const categories = ["Todos", ...new Set(products.map(({ cat }) => cat))];
export const favoriteStorageKey = "habitat-home:favorites:v1";
const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  currencyDisplay: "code",
  maximumFractionDigits: 0,
});

export const formatPrice = (price) => currency.format(price);

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase("es-CO")
    .trim();
}

export function filterProducts({
  category,
  search,
  sort,
  onlyFavorites,
  favorites,
}) {
  const terms = normalize(search).split(/\s+/).filter(Boolean);
  const matches = products.filter((product) => {
    if (category !== "Todos" && product.cat !== category) return false;
    if (onlyFavorites && !favorites.includes(product.id)) return false;
    const text = normalize(
      `${product.name} ${product.cat} ${product.material}`,
    );
    return terms.every((term) => text.includes(term));
  });
  if (sort === "low") return matches.sort((a, b) => a.price - b.price);
  if (sort === "high") return matches.sort((a, b) => b.price - a.price);
  return matches;
}

export function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(favoriteStorageKey));
    return Array.isArray(saved)
      ? products.filter(({ id }) => saved.includes(id)).map(({ id }) => id)
      : [];
  } catch {
    return [];
  }
}

export function storeFavorites(favorites) {
  try {
    localStorage.setItem(favoriteStorageKey, JSON.stringify(favorites));
  } catch {
    // The catalog still works when browser storage is unavailable.
  }
}
