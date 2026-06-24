import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Player3DViewer from "../components/Player3DViewer";

import playeraImg from "../assets/playera2D.png";
import gorraImg from "../assets/tshirt.png";
import hoodieImg from "../assets/hoddie.png";
import pantalonImg from "../assets/pants.png";
import pansImg from "../assets/pans.png";

const categories = [
  {
    id: "playeras", name: "Playeras", imageUrl: playeraImg,
    description: "Diseña tus playeras únicas",
    tag: "Popular", tagColor: "bg-violet-500/20 text-violet-300",
    modelPath: "/models/tshirt.glb", cameraDistance: 40, scale: 1,
  },
  {
    id: "gorras", name: "Gorras", imageUrl: gorraImg,
    description: "Personaliza tus gorras",
    tag: "Nuevo", tagColor: "bg-emerald-500/20 text-emerald-300",
    modelPath: "/models/cap.glb", cameraDistance: 3, scale: 3,
  },
  {
    id: "hoodies", name: "Sudaderas", imageUrl: hoodieImg,
    description: "Crea hoodies exclusivos",
    tag: "", tagColor: "",
    modelPath: "/models/hoddie.glb", cameraDistance: 3, scale: 1.2,
  },
  {
    id: "pantalones", name: "Pantalones", imageUrl: pantalonImg,
    description: "Diseña pantalones a tu estilo",
    tag: "", tagColor: "",
    modelPath: "/models/pants.glb", cameraDistance: 3, scale: 1,
  },
  {
    id: "pans", name: "Pans", imageUrl: pansImg,
    description: "Prendas de pans personalizadas",
    tag: "Premium", tagColor: "bg-amber-500/20 text-amber-300",
    modelPath: "/models/pans.glb", cameraDistance: 1000, scale: 0.3,
  },
];

const heroModels = [
  { label: "Playera",  path: "/models/tshirt.glb", color: "#f5f0ff", cameraDistance: 40,  scale: 1   },
  { label: "Gorra",    path: "/models/cap.glb",    color: "#e0f0ff", cameraDistance: 3,   scale: 3   },
  { label: "Sudadera", path: "/models/hoddie.glb", color: "#f0fff4", cameraDistance: 3,   scale: 1.2 },
  { label: "Pantalón", path: "/models/pants.glb",  color: "#fff7e0", cameraDistance: 3,   scale: 1   },
  { label: "Pans",     path: "/models/pans.glb",   color: "#ffe0f0", cameraDistance: 900, scale: 1   },
];

const features = [
  { icon: "🎨", title: "Totalmente personalizable", desc: "Sube tus imágenes, ajusta colores y posición", bg: "bg-violet-100 dark:bg-violet-900/30" },
  { icon: "🔄", title: "Vista 360°", desc: "Visualiza tus diseños en 3D con rotación automática", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  { icon: "💾", title: "Guarda tus diseños", desc: "Todos tus diseños se guardan en tu cuenta", bg: "bg-blue-100 dark:bg-blue-900/30" },
  { icon: "📥", title: "Descarga en alta calidad", desc: "Exporta tus creaciones en formato PNG", bg: "bg-amber-100 dark:bg-amber-900/30" },
];

const Catalog = ({ darkMode }) => {
  const [cardViews, setCardViews] = useState({});
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroModels.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const toggleCardView = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCardViews((prev) => ({
      ...prev,
      [id]: prev[id] === "3d" ? "2d" : "3d",
    }));
  };

  const activeHero = heroModels[heroIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-700 to-purple-800 dark:from-violet-900 dark:via-indigo-950 dark:to-gray-950 text-white">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-indigo-400/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-14">
          <div className="flex flex-col lg:flex-row items-center gap-10">

            <div className="lg:w-1/2 text-center lg:text-left">
              <span className="inline-block mb-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium tracking-widest uppercase text-violet-200 border border-white/10">
                ✦ Vista 3D disponible
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
                Crea tu<br />
                <span className="text-violet-200">estilo único</span>
              </h1>
              <p className="text-base md:text-lg text-white/75 mb-8 max-w-md mx-auto lg:mx-0">
                Diseña, personaliza y guarda tus propias prendas.<br />
                ¡Deja volar tu imaginación!
              </p>
              <div className="flex gap-6 justify-center lg:justify-start mb-8">
                {[["5", "Categorías"], ["120+", "Diseños"], ["360°", "Vista 3D"]].map(([n, l]) => (
                  <div key={l} className="text-center">
                    <div className="text-2xl font-extrabold text-white">{n}</div>
                    <div className="text-xs text-white/50 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 w-full">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                {/*
                  ✅ FIX HERO: Un solo Canvas siempre montado.
                  En lugar de key={activeHero.path} (que destruye/recrea el Canvas en cada cambio),
                  pasamos el modelPath como prop y dejamos que Player3DViewer cambie el modelo internamente.
                  El Canvas NUNCA se destruye — solo cambia el GLB cargado.
                */}
                <Player3DViewer
                  modelPath={activeHero.path}
                  color={activeHero.color}
                  cameraDistance={activeHero.cameraDistance}
                  scale={activeHero.scale}
                  autoRotate={true}
                  showControls={true}
                />
              </div>

              <div className="flex justify-center gap-2 mt-4 flex-wrap">
                {heroModels.map((m, i) => (
                  <button
                    key={m.path}
                    onClick={() => setHeroIndex(i)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 border ${
                      i === heroIndex
                        ? "bg-white text-violet-700 border-white shadow"
                        : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <p className="text-center text-xs text-white/40 mt-2">
                Arrastra para rotar · Scroll para zoom
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATÁLOGO ── */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Elige tu prenda
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Selecciona una categoría · Haz click en "3D ✦" para previsualizar en 3D
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {categories.map((cat) => {
            const isExplicit3d = cardViews[cat.id] === "3d";

            return (
              <Link
                key={cat.id}
                to={`/catalog/${cat.id}`}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${
                  cat.id === "playeras"   ? "from-violet-500 to-purple-600" :
                  cat.id === "gorras"     ? "from-emerald-500 to-teal-500" :
                  cat.id === "hoodies"    ? "from-blue-500 to-cyan-500" :
                  cat.id === "pantalones" ? "from-rose-500 to-pink-500" :
                  "from-amber-500 to-orange-500"
                }`} />

                <div className="relative h-44 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                  {cat.tag && (
                    <span className={`absolute top-3 left-3 z-10 text-xs font-semibold px-2 py-0.5 rounded-full ${cat.tagColor}`}>
                      {cat.tag}
                    </span>
                  )}

                  {/*
                    ✅ FIX CARDS: display:none en lugar de condicional JSX.
                    La imagen siempre está en el DOM pero oculta cuando está en 3D.
                    El Canvas 3D siempre está en el DOM pero oculto cuando está en 2D.
                    Esto evita destruir/recrear el Canvas al hacer toggle.
                    IMPORTANTE: el Canvas de cards se monta solo al primer toggle (lazy),
                    por eso no hay contextos en exceso al cargar la página.
                  */}
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    style={{ display: isExplicit3d ? "none" : "block" }}
                    className="w-28 h-28 object-contain group-hover:scale-110 transition-transform duration-300 select-none"
                  />

                  {/* Solo renderiza el Player3DViewer si el usuario alguna vez activó 3D en esta card */}
                  {(isExplicit3d || cardViews[cat.id] !== undefined) && (
                    <div
                      className="absolute inset-0"
                      style={{ display: isExplicit3d ? "block" : "none" }}
                    >
                      <Player3DViewer
                        modelPath={cat.modelPath}
                        cameraDistance={cat.cameraDistance}
                        scale={cat.scale}
                        color="#ffffff"
                        autoRotate={true}
                        showControls={false}
                        height="h-full"
                      />
                    </div>
                  )}

                  <button
                    onClick={(e) => toggleCardView(cat.id, e)}
                    className="absolute bottom-2 right-2 z-10 bg-white/90 dark:bg-gray-900/90 text-gray-600 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all shadow-sm backdrop-blur-sm"
                  >
                    {isExplicit3d ? "← 2D" : "3D ✦"}
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-3 leading-relaxed">
                    {cat.description}
                  </p>
                  <span className="inline-flex items-center text-sm font-semibold text-violet-600 dark:text-violet-400 group-hover:gap-1.5 gap-1 transition-all">
                    Comenzar
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-16 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-center text-gray-900 dark:text-white mb-2 tracking-tight">
            ¿Por qué diseñar con Auryx?
          </h2>
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 mb-10">
            Todo lo que necesitas para crear prendas únicas
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="text-center group">
                <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{f.icon}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Catalog;