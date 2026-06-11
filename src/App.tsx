import { FormEvent, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Clock3,
  Instagram,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  Sparkles,
} from "lucide-react";

type ProductType =
  | "Mini cookie tin"
  | "Brownies"
  | "Brookies"
  | "Banana cakes"
  | "Custom request";

type Enquiry = {
  name: string;
  occasion: string;
  productType: ProductType;
  quantity: string;
  date: string;
  flavours: string;
  details: string;
};

const brand = {
  name: "Cycy Bakes",
  handle: "@cycybakes",
  instagram: "https://www.instagram.com/cycybakes/",
  whatsappNumber: "96170276726",
  phoneDisplay: "+961 70 276 726",
  location: "Batroun",
  collectionNote: "Pick-up from Batroun",
  market: "Available at Deken Market",
  marketInstagram: "https://www.instagram.com/dekenmarket.lb/",
  mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Deken%20Market%20Batroun%20Lebanon",
};

const assets = {
  logo: `${import.meta.env.BASE_URL}favicon.webp`,
  hero: `${import.meta.env.BASE_URL}og-image.webp`,
  tinPair: new URL("../photoshoot/optimized/tin-pair.webp", import.meta.url).href,
  tinSpread: new URL("../photoshoot/optimized/tin-spread.webp", import.meta.url).href,
  bakeGrid: new URL("../photoshoot/optimized/bake-grid.webp", import.meta.url).href,
  cakeSet: new URL("../photoshoot/optimized/cake-set.webp", import.meta.url).href,
  fullCollection: new URL("../photoshoot/optimized/full-collection.webp", import.meta.url).href,
  cookiePlate: new URL("../photoshoot/optimized/cookie-plate.webp", import.meta.url).href,
  packedBox: new URL("../photoshoot/optimized/packed-box.webp", import.meta.url).href,
  detailBox: new URL("../photoshoot/optimized/detail-box.webp", import.meta.url).href,
};

const products = [
  {
    name: "Mini cookie tins",
    price: "Lotus · Kinder · Nutella",
    description: "Soft cookie bakes packed in branded tins with a clear lid and ivory belly band.",
    image: assets.tinPair,
    label: "Signature",
  },
  {
    name: "Brownies and brookies",
    price: "Small batch",
    description: "Chocolate-heavy bakes and cookie boxes for richer dessert orders.",
    image: assets.bakeGrid,
    label: "Chocolate",
  },
  {
    name: "Banana cakes and cookies",
    price: "Pre-order",
    description: "Soft cake-style specials, S'mores cookies, and rotating small-batch bakes.",
    image: assets.fullCollection,
    label: "Specials",
  },
];

const gallery = [
  {
    src: assets.tinSpread,
    title: "Branded mini cookie tins",
    className: "gallery-tall",
  },
  {
    src: assets.cookiePlate,
    title: "Chocolate and biscuit cookies",
    className: "gallery-wide",
  },
  {
    src: assets.cakeSet,
    title: "Banana cake and cookie specials",
    className: "gallery-portrait",
  },
  {
    src: assets.packedBox,
    title: "Packed gift box detail",
    className: "gallery-square",
  },
  {
    src: assets.detailBox,
    title: "Finished packaging",
    className: "gallery-wide gallery-lower",
  },
];

const orderSteps = [
  {
    title: "Choose the bake",
    text: "Start with Lotus, Kinder, or Nutella tins, or ask for brownies, brookies, banana cakes, and cookie specials.",
  },
  {
    title: "Share the date",
    text: "Send the occasion, quantity, flavours, and your preferred Batroun pickup window.",
  },
  {
    title: "Pick up finished",
    text: "Every order is packed cleanly, labelled for gifting, and confirmed through WhatsApp.",
  },
];

const tickerItems = [
  "Mini cookie tins",
  "Lotus · Kinder · Nutella",
  "Branded packaging",
  "Batroun pickup",
  "Available at Deken Market",
];

const initialEnquiry: Enquiry = {
  name: "",
  occasion: "",
  productType: "Mini cookie tin",
  quantity: "",
  date: "",
  flavours: "",
  details: "",
};

function buildWhatsAppMessage(enquiry: Enquiry) {
  return [
    `Hi ${brand.name}, I'd like to enquire about an order.`,
    `Name: ${enquiry.name}`,
    `Occasion: ${enquiry.occasion || "Not specified"}`,
    `Product: ${enquiry.productType}`,
    `Quantity or box size: ${enquiry.quantity || "Not specified"}`,
    `Preferred pickup date: ${enquiry.date || "Not specified"}`,
    `Flavours: ${enquiry.flavours || "Open to recommendations"}`,
    `Details: ${enquiry.details || "No extra details yet"}`,
  ].join("\n");
}

function App() {
  const shouldReduceMotion = useReducedMotion();
  const [enquiry, setEnquiry] = useState<Enquiry>(initialEnquiry);
  const [submissionStatus, setSubmissionStatus] = useState<"" | "opened" | "ready">("");
  const [error, setError] = useState("");

  const reveal = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 34 },
    show: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
  };

  const imageReveal = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 46, scale: 0.98 },
    show: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 },
  };

  const whatsappUrl = useMemo(() => {
    const message = encodeURIComponent(buildWhatsAppMessage(enquiry));
    return `https://wa.me/${brand.whatsappNumber}?text=${message}`;
  }, [enquiry]);

  function updateEnquiry<K extends keyof Enquiry>(key: K, value: Enquiry[K]) {
    setEnquiry((current) => ({ ...current, [key]: value }));
    if (error) setError("");
    if (submissionStatus) setSubmissionStatus("");
  }

  function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const missingFields = [
      ["name", enquiry.name],
      ["occasion", enquiry.occasion],
      ["quantity or box size", enquiry.quantity],
      ["pickup date", enquiry.date],
      ["flavour preferences", enquiry.flavours],
    ].filter(([, value]) => !value.trim());

    if (missingFields.length > 0) {
      setSubmissionStatus("");
      setError(`Add ${missingFields.map(([label]) => label).join(", ")} before opening WhatsApp.`);
      return;
    }

    const openedWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setSubmissionStatus(openedWindow ? "opened" : "ready");
  }

  return (
    <div className="site-shell">
      <header className="nav">
        <a className="brand-lockup" href="#top" aria-label="Cycy Bakes home">
          <img src={assets.logo} alt="" width="42" height="42" />
          <span>
            <strong>{brand.name}</strong>
            <small>{brand.location} · {brand.collectionNote}</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#story">Story</a>
          <a href="#gallery">Gallery</a>
          <a href="#order">Order</a>
        </nav>

        <a className="nav-cta" href="#order">
          <span>Enquire</span>
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-backdrop" aria-hidden="true">
            <motion.img
              src={assets.hero}
              alt=""
              loading="eager"
              decoding="async"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <motion.div
            className="hero-copy"
            initial={false}
            animate="show"
            variants={{
              show: {
                transition: {
                  staggerChildren: shouldReduceMotion ? 0 : 0.11,
                  delayChildren: shouldReduceMotion ? 0 : 0.2,
                },
              },
            }}
          >
            <motion.p className="eyebrow" variants={reveal}>
              <Sparkles size={16} aria-hidden="true" />
              <span>Small-batch bakes</span>
              <span>Gift-ready packaging</span>
            </motion.p>
            <motion.h1 id="hero-title" variants={reveal}>
              <span>Cycy Bakes</span>
              <span>Mini cookie tins</span>
            </motion.h1>
            <motion.p className="hero-intro" variants={reveal}>
              Rich mini cookie tins baked in Batroun for birthdays, table
              desserts, thank-you gifts, and the cravings that do not wait
              politely.
            </motion.p>
            <motion.div className="hero-actions" variants={reveal}>
              <a className="button primary" href="#order">
                Start an order
                <MessageCircle size={19} aria-hidden="true" />
              </a>
              <a className="button secondary" href="#gallery">
                View the shoot
                <ArrowDown size={18} aria-hidden="true" />
              </a>
            </motion.div>
            <motion.div className="hero-meta" variants={reveal} aria-label="Order details">
              <span>{brand.location}</span>
              <span>{brand.collectionNote}</span>
              <span>{brand.market}</span>
            </motion.div>
          </motion.div>

          <motion.a
            className="scroll-cue"
            href="#story"
            aria-label="Scroll to product story"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.55 }}
          >
            <ArrowDown size={18} aria-hidden="true" />
          </motion.a>
        </section>

        <section className="ticker" aria-label="Cycy Bakes highlights">
          <div>
            {Array.from({ length: 4 }, () => tickerItems).flat().map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </section>

        <section id="story" className="story-section" aria-labelledby="story-title">
          <motion.div
            className="section-heading"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-120px" }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 } },
            }}
          >
            <motion.p className="section-kicker" variants={reveal}>
              The signature order
            </motion.p>
            <motion.h2 id="story-title" variants={reveal}>
              Bakes that arrive already dressed for the table.
            </motion.h2>
          </motion.div>

          <div className="story-grid">
            <motion.figure
              className="story-image"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-120px" }}
              variants={imageReveal}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={assets.tinPair}
                alt="Two branded Cycy Bakes mini cookie tins on dark stone"
                loading="lazy"
                decoding="async"
              />
            </motion.figure>

            <motion.div
              className="story-copy"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-120px" }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 } },
              }}
            >
              <motion.p variants={reveal}>
                The new Cycy Bakes direction is darker, richer, and more deliberate:
                warm cookies, kraft paper, clear tins, chocolate detail, and a
                logo that feels printed into the experience.
              </motion.p>
              <motion.div className="story-points" variants={reveal}>
                <span>Soft centre</span>
                <span>Finished labels</span>
                <span>Batroun pickup</span>
              </motion.div>
              <motion.a className="text-link" href="#order" variants={reveal}>
                Build an enquiry
                <ArrowRight size={18} aria-hidden="true" />
              </motion.a>
            </motion.div>
          </div>
        </section>

        <section className="products-section" aria-labelledby="products-title">
          <div className="section-heading split">
            <div>
              <p className="section-kicker">What to order</p>
              <h2 id="products-title">Cookie tins first. Everything else follows.</h2>
            </div>
            <p>
              Keep the brief simple, or give Cycy a full occasion: flavours,
              quantity, pickup timing, and how the gift should land.
            </p>
          </div>

          <div className="product-layout">
            {products.map((product, index) => (
              <motion.article
                className={`product-card product-card-${index + 1}`}
                key={product.name}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-110px" }}
                variants={imageReveal}
                transition={{ duration: 0.7, delay: shouldReduceMotion ? 0 : index * 0.08 }}
              >
                <div className="product-image">
                  <img src={product.image} alt={`${product.name} by Cycy Bakes`} loading="lazy" decoding="async" />
                  <span>{product.label}</span>
                </div>
                <div className="product-content">
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                  </div>
                  <strong>{product.price}</strong>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="gallery" className="gallery-section" aria-labelledby="gallery-title">
          <div className="section-heading compact">
            <p className="section-kicker">Photoshoot</p>
            <h2 id="gallery-title">Dark stone, warm crumb, clean labels.</h2>
          </div>

          <div className="gallery-grid">
            {gallery.map((item, index) => (
              <motion.figure
                className={`gallery-item ${item.className}`}
                key={item.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={imageReveal}
                transition={{ duration: 0.75, delay: shouldReduceMotion ? 0 : index * 0.06 }}
              >
                <img src={item.src} alt={item.title} loading="lazy" decoding="async" />
                <figcaption>{item.title}</figcaption>
              </motion.figure>
            ))}
          </div>
        </section>

        <section className="order-steps" aria-labelledby="steps-title">
          <div className="section-heading split">
            <div>
              <p className="section-kicker">How it works</p>
              <h2 id="steps-title">The order process stays calm and direct.</h2>
            </div>
            <p>
              A few details are enough to start. Cycy can confirm availability,
              final quantities, flavours, and pickup timing in WhatsApp.
            </p>
          </div>

          <div className="steps-list">
            {orderSteps.map((step, index) => (
              <motion.article
                key={step.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={reveal}
                transition={{ duration: 0.55, delay: shouldReduceMotion ? 0 : index * 0.08 }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="order" className="order-section" aria-labelledby="order-title">
          <motion.div
            className="order-panel"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-120px" }}
            variants={imageReveal}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="order-copy">
              <p className="section-kicker">Start your order</p>
              <h2 id="order-title">Send the brief while it is fresh.</h2>
              <p>
                Fill in the essentials and the site will prepare a WhatsApp
                message with the right details for Cycy Bakes in Batroun.
              </p>
              <div className="contact-stack">
                <a href={`https://wa.me/${brand.whatsappNumber}`} target="_blank" rel="noreferrer">
                  <Phone size={18} aria-hidden="true" />
                  {brand.phoneDisplay}
                </a>
                <a href={brand.instagram} target="_blank" rel="noreferrer">
                  <Instagram size={18} aria-hidden="true" />
                  {brand.handle}
                </a>
                <a href={brand.marketInstagram} target="_blank" rel="noreferrer">
                  <PackageCheck size={18} aria-hidden="true" />
                  {brand.market}
                </a>
                <a href={brand.mapsUrl} target="_blank" rel="noreferrer">
                  <MapPin size={18} aria-hidden="true" />
                  Get directions
                </a>
              </div>
            </div>

            <form className="enquiry-form" onSubmit={submitEnquiry} noValidate>
              <label>
                <span>Name</span>
                <input
                  value={enquiry.name}
                  onChange={(event) => updateEnquiry("name", event.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </label>

              <label>
                <span>Occasion</span>
                <input
                  value={enquiry.occasion}
                  onChange={(event) => updateEnquiry("occasion", event.target.value)}
                  placeholder="Birthday, gift, dinner table, weekend order"
                  required
                />
              </label>

              <fieldset role="radiogroup" aria-required="true">
                <legend>Product type</legend>
                <div className="option-grid">
                  {(["Mini cookie tin", "Brownies", "Brookies", "Banana cakes", "Custom request"] as ProductType[]).map((type) => (
                    <button
                      className={enquiry.productType === type ? "selected" : ""}
                      aria-checked={enquiry.productType === type}
                      aria-pressed={enquiry.productType === type}
                      key={type}
                      role="radio"
                      type="button"
                      onClick={() => updateEnquiry("productType", type)}
                    >
                      {enquiry.productType === type && <Check size={15} aria-hidden="true" />}
                      {type}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="form-row">
                <label>
                  <span>Quantity or box size</span>
                  <input
                    value={enquiry.quantity}
                    onChange={(event) => updateEnquiry("quantity", event.target.value)}
                    placeholder="2 tins, 6 brownies, mixed box"
                    required
                  />
                </label>
                <label>
                  <span>Preferred pickup date</span>
                  <input
                    value={enquiry.date}
                    onChange={(event) => updateEnquiry("date", event.target.value)}
                    placeholder="Saturday 22 June"
                    required
                  />
                </label>
              </div>

              <label>
                <span>Flavour preferences</span>
                  <input
                    value={enquiry.flavours}
                    onChange={(event) => updateEnquiry("flavours", event.target.value)}
                    placeholder="Lotus, Kinder, Nutella, S'mores, mixed box"
                    required
                  />
                </label>

              <label>
                <span>Details</span>
                <textarea
                  value={enquiry.details}
                  onChange={(event) => updateEnquiry("details", event.target.value)}
                  placeholder="Packaging, message, colours, dietary notes, or pickup details"
                  rows={4}
                />
              </label>

              <div className="form-status" aria-live="polite">
                {error && <motion.p className="form-error" role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>{error}</motion.p>}
                {submissionStatus && (
                  <motion.div className="form-success" role="status" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                    <p>
                      {submissionStatus === "opened"
                        ? "Your WhatsApp message is ready. If WhatsApp did not open, use the link below."
                        : "Your WhatsApp message is ready. Use the link below to send it."}
                    </p>
                    <a href={whatsappUrl} target="_blank" rel="noreferrer">
                      Open WhatsApp message
                    </a>
                  </motion.div>
                )}
              </div>

              <button className="button primary submit-button" type="submit">
                Open WhatsApp enquiry
                <MessageCircle size={19} aria-hidden="true" />
              </button>
            </form>
          </motion.div>
        </section>
      </main>

      <footer id="footer" className="footer">
        <div>
          <strong className="footer-wordmark">{brand.name}</strong>
          <p>Desserts that make you smile.</p>
        </div>
        <div className="footer-links">
          <a href={brand.instagram} target="_blank" rel="noreferrer">Instagram</a>
          <a href={brand.marketInstagram} target="_blank" rel="noreferrer">Deken Market</a>
          <a href={`https://wa.me/${brand.whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
        <div className="footer-note">
          <Clock3 size={17} aria-hidden="true" />
          <span>Made to order · {brand.collectionNote}</span>
          <PackageCheck size={17} aria-hidden="true" />
        </div>
      </footer>
    </div>
  );
}

export default App;
