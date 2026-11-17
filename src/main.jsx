import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Menu,
  MessageCircle,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  categories,
  filterProducts,
  formatPrice,
  readFavorites,
  storeFavorites,
} from "./catalog.js";
import "./style.css";

const sections = [
  ["inicio", "Inicio"],
  ["colecciones", "Colecciones"],
  ["catalogo", "Catálogo"],
  ["nosotros", "Nosotros"],
  ["contacto", "Contacto"],
];

const collections = [
  ["living", "Salas", "Salas & Sofás"],
  ["dining", "Comedores", "Comedores"],
  ["bed", "Dormitorios", "Dormitorios"],
];

const initialFilters = {
  search: "",
  category: "Todos",
  sort: "featured",
  onlyFavorites: false,
};
const productSizes = "(max-width: 650px) 45vw, (max-width: 950px) 30vw, 22vw";
const imagePath = (image, width) =>
  `${import.meta.env.BASE_URL}images/${image}-${width}.webp`;

function Photo({ image, alt = "", sizes, eager = false }) {
  const [small, large] = { hero: [720, 1440], living: [720, 1200] }[image] ?? [
    480, 900,
  ];
  return (
    <img
      src={imagePath(image, small)}
      srcSet={`${imagePath(image, small)} ${small}w, ${imagePath(image, large)} ${large}w`}
      sizes={sizes}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
    />
  );
}

function Logo({ onClick }) {
  return (
    <a
      href="#inicio"
      className="logo"
      aria-label="Habitat Home, inicio"
      onClick={onClick}
    >
      habitat<span>.</span>
      <small>HOME</small>
    </a>
  );
}

function Header({ favoriteCount, onlyFavorites, openSearch, toggleFavorites }) {
  const [menu, setMenu] = useState(false);
  const menuButton = useRef(null);
  const closeMenu = () => setMenu(false);

  return (
    <>
      <div className="announcement">
        Habitat Home <span>· Catálogo demostrativo</span>
      </div>
      <header
        className="header"
        onKeyDown={(event) => {
          if (event.key === "Escape" && menu) {
            closeMenu();
            menuButton.current.focus();
          }
        }}
      >
        <Logo onClick={closeMenu} />
        <div className="actions">
          <button
            aria-label="Buscar productos"
            onClick={() => {
              closeMenu();
              openSearch();
            }}
          >
            <Search size={21} />
          </button>
          <button
            aria-label={`Ver favoritos (${favoriteCount})`}
            aria-pressed={onlyFavorites}
            onClick={() => {
              closeMenu();
              toggleFavorites();
            }}
          >
            <Heart size={21} fill={onlyFavorites ? "currentColor" : "none"} />
            {favoriteCount > 0 && (
              <b aria-hidden="true" className="count">
                {favoriteCount}
              </b>
            )}
          </button>
          <button
            ref={menuButton}
            className="hamburger"
            aria-label={menu ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menu}
            aria-controls="primary-nav"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        <nav
          id="primary-nav"
          className={menu ? "nav open" : "nav"}
          aria-label="Navegación principal"
        >
          {sections.map(([id, name]) => (
            <a href={`#${id}`} key={id} onClick={closeMenu}>
              {name}
            </a>
          ))}
        </nav>
      </header>
    </>
  );
}

function ProductCard({ product, favorite, onFavorite, onOpen }) {
  return (
    <article className="product">
      <div className="product-img">
        <button
          className="image-button"
          onClick={onOpen}
          aria-label={`Ver ${product.name}`}
        >
          <Photo image={product.image} sizes={productSizes} />
        </button>
        {product.tag && <span className="tag">{product.tag}</span>}
        <button
          className={favorite ? "favorite selected" : "favorite"}
          aria-label={`${product.name}, favorito`}
          aria-pressed={favorite}
          onClick={onFavorite}
        >
          <Heart size={18} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="product-info">
        <span>{product.cat}</span>
        <h3>{product.name}</h3>
        <strong>{formatPrice(product.price)}</strong>
        <button
          className="text-link"
          aria-label={`Ver detalles de ${product.name}`}
          onClick={onOpen}
        >
          Ver detalles <ArrowUpRight size={15} />
        </button>
      </div>
    </article>
  );
}

function ProductDialog({ product, onClose }) {
  const dialog = useRef(null);
  const [quote, setQuote] = useState(false);

  useEffect(() => {
    dialog.current.showModal();
  }, []);

  return (
    <dialog
      className="modal"
      ref={dialog}
      aria-labelledby="product-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) dialog.current.close();
      }}
    >
      <div className="modal-layout">
        <button
          className="modal-close"
          onClick={() => dialog.current.close()}
          aria-label="Cerrar ficha"
          autoFocus
        >
          <X />
        </button>
        <Photo
          image={product.image}
          alt={product.name}
          sizes="(max-width: 650px) 90vw, 425px"
        />
        <div className="modal-content">
          <span className="eyebrow">{product.cat.toUpperCase()}</span>
          <h2 id="product-title">{product.name}</h2>
          <strong className="modal-price">{formatPrice(product.price)}</strong>
          <p>{product.desc}</p>
          <dl>
            <div>
              <dt>Dimensiones</dt>
              <dd>{product.size}</dd>
            </div>
            <div>
              <dt>Materiales</dt>
              <dd>{product.material}</dd>
            </div>
          </dl>
          <button
            className="btn dark-btn"
            aria-expanded={quote}
            aria-controls="quote-preview"
            onClick={() => setQuote(!quote)}
          >
            <MessageCircle size={18} />{" "}
            {quote ? "Ocultar cotización" : "Cotizar por WhatsApp (demo)"}
          </button>
          <small>Simulación local. Sin destinatario ni envío.</small>
          <div id="quote-preview" aria-live="polite">
            {quote && (
              <div className="quote-preview">
                <strong>Vista previa del mensaje</strong>
                <p>
                  Hola, me gustaría cotizar el producto {product.name}, con
                  precio de referencia de {formatPrice(product.price)}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}

function App() {
  const [filters, setFilters] = useState(initialFilters);
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState(readFavorites);
  const catalogHeading = useRef(null);
  const searchInput = useRef(null);
  const list = filterProducts({ ...filters, favorites });
  const setFilter = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));

  useEffect(() => storeFavorites(favorites), [favorites]);

  function focusCatalog(target = catalogHeading.current) {
    if (location.hash !== "#catalogo") history.pushState(null, "", "#catalogo");
    target.focus({ preventScroll: true });
    document.getElementById("catalogo").scrollIntoView();
  }

  function toggleFavorites() {
    setFilters({ ...initialFilters, onlyFavorites: !filters.onlyFavorites });
    focusCatalog();
  }

  function toggleFavorite(id) {
    if (filters.onlyFavorites)
      catalogHeading.current.focus({ preventScroll: true });
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Header
        favoriteCount={favorites.length}
        onlyFavorites={filters.onlyFavorites}
        openSearch={() => focusCatalog(searchInput.current)}
        toggleFavorites={toggleFavorites}
      />
      <main id="contenido" tabIndex={-1}>
        <section className="hero" id="inicio" tabIndex={-1}>
          <Photo image="hero" sizes="100vw" eager />
          <div className="hero-content">
            <span className="eyebrow light">HABITAT HOME · COLECCIÓN 2026</span>
            <h1>
              Espacios que
              <br />
              <em>se sienten hogar.</em>
            </h1>
            <p>
              Piezas cuidadosamente seleccionadas para crear ambientes cálidos,
              auténticos y llenos de vida.
            </p>
            <a className="btn light-btn" href="#catalogo">
              Explorar catálogo <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
        <ul className="perks" aria-label="Características de la colección">
          {[
            "Diseño atemporal",
            "Texturas naturales",
            "Tonos cálidos",
            "Piezas funcionales",
          ].map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
        <section className="section collections" id="colecciones" tabIndex={-1}>
          <div className="section-head">
            <div>
              <span className="eyebrow">INSPIRACIÓN PARA CADA RINCÓN</span>
              <h2>
                Encuentra tu <em>estilo.</em>
              </h2>
            </div>
            <p>
              Descubre muebles que combinan funcionalidad, comodidad y
              personalidad.
            </p>
          </div>
          <div className="collection-grid">
            {collections.map(([image, category, title], index) => (
              <button
                key={category}
                className={
                  index === 0 ? "collection-card large" : "collection-card"
                }
                onClick={() => {
                  setFilters({ ...initialFilters, category });
                  focusCatalog();
                }}
              >
                <Photo image={image} sizes="(max-width: 650px) 90vw, 45vw" />
                <strong>{title}</strong>
                <ArrowUpRight />
              </button>
            ))}
          </div>
        </section>
        <section className="section catalog" id="catalogo" tabIndex={-1}>
          <div className="section-head">
            <div>
              <span className="eyebrow">CATÁLOGO DEMOSTRATIVO</span>
              <h2 ref={catalogHeading} tabIndex={-1}>
                {filters.onlyFavorites ? (
                  <>
                    Tus <em>favoritos.</em>
                  </>
                ) : (
                  <>
                    Nuestra <em>selección.</em>
                  </>
                )}
              </h2>
            </div>
            <p>
              Precios de referencia en pesos colombianos (COP). Productos y
              especificaciones ficticios.
            </p>
          </div>
          <div className="catalog-tools">
            <div className="chips" role="group" aria-label="Categorías">
              {categories.map((category) => (
                <button
                  key={category}
                  className="chip"
                  aria-pressed={filters.category === category}
                  onClick={() => setFilter("category", category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="filters">
              <input
                ref={searchInput}
                type="search"
                aria-label="Buscar en el catálogo"
                placeholder="Buscar producto…"
                value={filters.search}
                onChange={(event) => setFilter("search", event.target.value)}
              />
              <label>
                <SlidersHorizontal size={17} aria-hidden="true" />
                <select
                  aria-label="Ordenar productos"
                  value={filters.sort}
                  onChange={(event) => setFilter("sort", event.target.value)}
                >
                  <option value="featured">Destacados</option>
                  <option value="low">Menor precio</option>
                  <option value="high">Mayor precio</option>
                </select>
              </label>
            </div>
          </div>
          <div className="result-summary">
            <p role="status">
              {list.length} {list.length === 1 ? "producto" : "productos"}
            </p>
            {filters.onlyFavorites && (
              <button className="text-link" onClick={toggleFavorites}>
                Volver al catálogo
              </button>
            )}
          </div>
          {list.length > 0 ? (
            <div className="product-grid">
              {list.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  favorite={favorites.includes(product.id)}
                  onOpen={() => setSelected(product)}
                  onFavorite={() => toggleFavorite(product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="empty">
              {filters.onlyFavorites && !favorites.length ? (
                <p>
                  Aún no tienes favoritos. Guarda productos desde el catálogo.
                </p>
              ) : (
                <>
                  <p>No encontramos productos con esos filtros.</p>
                  <button
                    className="text-link"
                    onClick={() => {
                      setFilters({
                        ...initialFilters,
                        onlyFavorites: filters.onlyFavorites,
                      });
                      searchInput.current.focus();
                    }}
                  >
                    Limpiar filtros
                  </button>
                </>
              )}
            </div>
          )}
        </section>
        <section className="story" id="nosotros" tabIndex={-1}>
          <div className="story-img">
            <Photo
              image="living"
              sizes="(max-width: 650px) 100vw, 50vw"
              alt="Sala luminosa con sofá claro y acabados de madera"
            />
          </div>
          <div className="story-copy">
            <span className="eyebrow">NUESTRA FILOSOFÍA</span>
            <h2>
              Tu hogar,
              <br />
              <em>tu historia.</em>
            </h2>
            <p>
              Creemos que cada espacio cuenta algo de quienes lo habitan. Por
              eso elegimos diseños que inspiran calma, invitan a compartir y
              acompañan cada etapa de la vida.
            </p>
            <p>
              Una colección pensada para vivir mejor, con belleza en los
              pequeños detalles.
            </p>
            <a className="btn dark-btn" href="#catalogo">
              Descubre la colección <ArrowRight size={18} />
            </a>
          </div>
        </section>
        <section className="contact" id="contacto" tabIndex={-1}>
          <span className="eyebrow">HABLEMOS DE TU ESPACIO</span>
          <h2>
            ¿Listo para darle vida
            <br />a tu <em>hogar?</em>
          </h2>
          <p>
            Abre una ficha de producto y prueba la cotización simulada por
            WhatsApp.
          </p>
          <a className="btn light-btn" href="#catalogo">
            Ver productos <ArrowUpRight size={18} />
          </a>
        </section>
      </main>
      <footer>
        <div>
          <Logo />
          <p>Diseño para espacios que se viven.</p>
        </div>
        <nav className="footer-links" aria-label="Navegación al pie">
          {sections.slice(1).map(([id, name]) => (
            <a key={id} href={`#${id}`}>
              {name}
            </a>
          ))}
        </nav>
        <div className="footer-bottom">
          © 2026 Habitat Home · Demo técnica con marca, productos y precios
          ficticios.
        </div>
      </footer>
      {selected && (
        <ProductDialog product={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
