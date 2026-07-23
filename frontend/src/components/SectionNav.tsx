import { useEffect, useRef, useState } from "react";

interface Section {
  id: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: "registro-oficial", label: "Registro oficial" },
  { id: "levantamento-campo", label: "Levantamento de campo" },
  { id: "diretorio", label: "Diretório de startups" },
];

export function SectionNav() {
  const [ativo, setAtivo] = useState<string>(SECTIONS[0].id);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elementos = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visivel = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visivel) {
          setAtivo(visivel.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    elementos.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  function irPara(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav className="section-nav" aria-label="Sumário">
      <p className="section-nav__title">Sumário</p>
      <ul>
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <button
              className={`section-nav__link ${
                ativo === s.id ? "section-nav__link--active" : ""
              }`}
              onClick={() => irPara(s.id)}
            >
              {s.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}