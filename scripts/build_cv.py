#!/usr/bin/env python3
"""The CV, in English and Spanish, in the site's type.

The copy lives here, in CV below, and follows the site's facts (keep them
identical to the pages and llms.txt: see CLAUDE.md, "Content consistency").
Renders an HTML page with the self-hosted Bitter and Outfit through headless
Chrome to A4 PDF, with real, selectable text and live links.

    python3 scripts/build_cv.py
"""
import html
import datetime
import pathlib
import subprocess
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "cv"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Years of practice, counted the same way the site does (site.careerStart).
CAREER_START = 2014
YEARS = datetime.date.today().year - CAREER_START

CV = {
    "en": {
        "title": "Senior Product Designer",
        "place": "Zaragoza, Spain",
        "summary": (
            f"Senior product designer with {YEARS} years in enterprise digital products, conversion optimisation (CRO), "
            "behavioural science and design operations. Embedded in IKEA’s New Business Platform, where AI now runs "
            "through most of my work: agentic reporting, multi-agent design workflows, and facilitation that turns AI "
            "output into material teams can act on. I do my best work inside complexity: multi-market products, "
            "regulated testing, and processes that keep working when the team changes."
        ),
        "h": {"exp": "Experience", "research": "Research and writing", "skills": "Skills, tools and background",
              "edu": "Education", "lang": "Languages"},
        "jobs": [
            ("Senior Product Designer (Implant)", "Garaje de Ideas / Groupe EDG",
             "2025–Present · Embedded in IKEA’s New Business Platform (Ingka Group) · Zaragoza, Spain, English-speaking team",
             [
                 "<b>IKEA Home Services:</b> peer-to-peer marketplace for home improvement services, the product I joined for. "
                 "Live in seven Spanish regions; 500,000+ downloads, 21,000 completed service requests and 4.9/5 satisfaction, per Ingka Group.",
                 "<b>IKEA Second-hand Marketplace:</b> peer-to-peer resale of IKEA products, live in five European countries. "
                 "One platform team now runs both products, and most of my work goes here.",
                 "<b>Ways of working:</b> a design operations system across Figma, Jira, Confluence and Phrase, with a five-phase "
                 "content workflow, explicit handoffs and localisation that can be checked in QA.",
                 "<b>AI in the workflow:</b> reports, decks and dashboards built by agents in VS Code with GitHub Copilot, connected "
                 "to Jira, Confluence and Microsoft 365; a multi-agent design workflow with human checkpoints, built on Shape Up; "
                 "AI literacy sessions for senior designers at Garaje de Ideas.",
             ]),
            ("Senior UX/CRO Designer", "Flat 101",
             "2022–2025 · Four to eight enterprise accounts at a time · Spain",
             [
                 "<b>Santander Nordics:</b> lead UX/CRO designer on a conversion programme for loans, cards and deposits in Denmark, "
                 "Sweden, Finland and Norway. The redesigned application form became the default in all four markets.",
                 "<b>Meliá Hotels International:</b> a campaign management platform designed from scratch over three years, running "
                 "dozens of live campaigns across Meliá’s international markets.",
                 "<b>Mapfre:</b> UX for AFIN, the self-service app for investments, savings and pensions; Verti Italy and Germany on "
                 "one design system; an agents directory live in Brazil, Peru and Nicaragua.",
                 "<b>IQOS Club Spain:</b> project lead for ongoing CRO on Philip Morris’s loyalty platform, applying behavioural economics.",
                 "<b>XTI Store:</b> full e-commerce redesign within a Magento migration, designed in one month; the brand’s main "
                 "online store for about three years.",
                 "<b>Also:</b> Mutua Madrileña +41% leads and AXA Spain +18% insurance contracts (published by Flat 101); "
                 "experience, CRO and behavioural audits for Bankinter, Subaru Spain and Affinity Petcare.",
             ]),
            ("Co-founder & Design Lead", "Factor Común",
             "2016–2021 · Havana, Cuba",
             [
                 "Co-founded a design and communications studio with two colleagues: 120+ projects across branding, editorial, "
                 "digital interfaces, video and campaigns for institutional clients across Cuba, with clients, planning, "
                 "suppliers and new business run on tight resources.",
             ]),
            ("UI Design Professor", "ISDi / University of Havana",
             "2018–2021 · Havana, Cuba / Remote",
             [
                 "Taught UI design: curriculum, studio sessions, and explaining complex ideas to students at very different levels.",
             ]),
        ],
        "research": [
            '<b><a href="https://www.joseromerodesign.com/thinking/beco-explorer/">BECO</a>:</b> a knowledge graph of behavioural '
            'science that grades its own evidence: 420 DOI-verified sources and 243 concepts, explorable online.',
            '<b><a href="https://www.joseromerodesign.com/thinking/ai-workflow-framework/">Designing with AI</a>:</b> an essay on '
            'human-led, agent-assisted product design.',
        ],
        "skills": [
            ("AI practice", "AI facilitation · AI workflow design · Context and skill building · Agentic reporting · Designing in code · Knowledge systems"),
            ("Design and research", "Product design · UX research · CRO and experimentation · Behavioural economics · Design systems · Design operations · Stakeholder work across product, engineering and business"),
            ("Tools", "GitHub Copilot · VS Code · Claude · Figma · FigJam · Miro · Notion · Jira · Confluence · Phrase · Microsoft 365 · Optimizely · ContentSquare · Hotjar · Google Analytics · AB Tasty · VWO · Optimal Workshop · Neo4j · Python"),
        ],
        "edu": "Five-year degree in Visual Communication Design · Havana, Cuba",
        "lang": "Spanish, native · English, fluent and my professional working language",
    },
    "es": {
        "title": "Senior Product Designer",
        "place": "Zaragoza, España",
        "summary": (
            f"Senior product designer con {YEARS} años en productos digitales enterprise, optimización de la conversión (CRO), "
            "ciencia del comportamiento y operaciones de diseño. Integrado en la New Business Platform de IKEA, donde la IA "
            "atraviesa ya casi todo mi trabajo: informes con agentes, flujos de diseño multiagente y una facilitación que "
            "convierte lo que produce la IA en material con el que un equipo puede actuar. Trabajo mejor dentro de la "
            "complejidad: productos multimercado, testing regulado y procesos que aguantan los cambios de equipo."
        ),
        "h": {"exp": "Experiencia", "research": "Investigación y escritura", "skills": "Habilidades, herramientas y formación",
              "edu": "Formación", "lang": "Idiomas"},
        "jobs": [
            ("Senior Product Designer (Implant)", "Garaje de Ideas / Groupe EDG",
             "2025–Actualidad · Integrado en la New Business Platform de IKEA (Ingka Group) · Zaragoza, España, equipo en inglés",
             [
                 "<b>IKEA Home Services:</b> marketplace P2P de servicios para el hogar, el producto con el que empecé. Activo en "
                 "siete regiones españolas; más de 500.000 descargas, 21.000 servicios completados y 4.9/5 de satisfacción, según Ingka Group.",
                 "<b>IKEA Second-hand Marketplace:</b> reventa P2P de productos IKEA, activa en cinco países europeos. Hoy un mismo "
                 "equipo lleva los dos productos, y aquí va la mayor parte de mi trabajo.",
                 "<b>Formas de trabajar:</b> un sistema de operaciones de diseño entre Figma, Jira, Confluence y Phrase, con un flujo "
                 "de contenido en cinco fases, traspasos explícitos y una localización que se puede comprobar en QA.",
                 "<b>IA en el flujo de trabajo:</b> informes, presentaciones y dashboards que construyen agentes en VS Code con GitHub "
                 "Copilot, conectados a Jira, Confluence y Microsoft 365; un flujo de diseño multiagente con puntos de control humanos, "
                 "sobre Shape Up; sesiones de alfabetización en IA para diseñadores senior de Garaje de Ideas.",
             ]),
            ("Senior UX/CRO Designer", "Flat 101",
             "2022–2025 · Entre cuatro y ocho cuentas enterprise a la vez · España",
             [
                 "<b>Santander Nordics:</b> lead UX/CRO designer en un programa de conversión para préstamos, tarjetas y depósitos en "
                 "Dinamarca, Suecia, Finlandia y Noruega. El formulario de solicitud rediseñado pasó a ser el estándar en los cuatro mercados.",
                 "<b>Meliá Hotels International:</b> una plataforma de gestión de campañas diseñada desde cero durante tres años, con "
                 "decenas de campañas activas en los mercados internacionales de Meliá.",
                 "<b>Mapfre:</b> UX de AFIN, la app de autogestión para inversiones, ahorro y pensiones; Verti Italia y Alemania en un "
                 "mismo sistema de diseño; un directorio de oficinas activo en Brasil, Perú y Nicaragua.",
                 "<b>IQOS Club España:</b> líder de proyecto del CRO continuo de la plataforma de fidelización de Philip Morris.",
                 "<b>XTI Store:</b> rediseño completo del e-commerce dentro de una migración a Magento, diseñado en un mes; la tienda "
                 "online principal de la marca durante unos tres años.",
                 "<b>Además:</b> Mutua Madrileña +41% de leads y AXA España +18% de contratos de seguros (publicado por Flat 101); "
                 "auditorías de experiencia, CRO y comportamiento para Bankinter, Subaru España y Affinity Petcare.",
             ]),
            ("Cofundador y Design Lead", "Factor Común",
             "2016–2021 · La Habana, Cuba",
             [
                 "Cofundé con dos compañeros un estudio de diseño y comunicación: más de 120 proyectos de branding, diseño editorial, "
                 "interfaces digitales, vídeo y campañas para clientes institucionales de toda Cuba, llevando clientes, planificación, "
                 "proveedores y captación con recursos muy ajustados.",
             ]),
            ("Profesor de Diseño UI", "ISDi / Universidad de La Habana",
             "2018–2021 · La Habana, Cuba / Remoto",
             [
                 "Enseñé diseño UI: plan de estudios, sesiones de taller y explicar ideas complejas a estudiantes de niveles muy distintos.",
             ]),
        ],
        "research": [
            '<b><a href="https://www.joseromerodesign.com/es/thinking/beco-explorer/">BECO</a>:</b> un grafo de conocimiento sobre '
            'ciencia del comportamiento que califica su propia evidencia: 420 fuentes verificadas por DOI y 243 conceptos, explorable online.',
            '<b><a href="https://www.joseromerodesign.com/es/thinking/ai-workflow-framework/">Diseñar con IA</a>:</b> un ensayo sobre '
            'diseño de producto liderado por personas y asistido por agentes.',
        ],
        "skills": [
            ("Práctica con IA", "Facilitación con IA · Diseño de flujos con IA · Contexto y skills · Informes con agentes · Diseñar en código · Sistemas de conocimiento"),
            ("Diseño e investigación", "Diseño de producto · Investigación UX · CRO y experimentación · Economía conductual · Sistemas de diseño · Operaciones de diseño · Trabajo con stakeholders de producto, ingeniería y negocio"),
            ("Herramientas", "GitHub Copilot · VS Code · Claude · Figma · FigJam · Miro · Notion · Jira · Confluence · Phrase · Microsoft 365 · Optimizely · ContentSquare · Hotjar · Google Analytics · AB Tasty · VWO · Optimal Workshop · Neo4j · Python"),
        ],
        "edu": "Título superior (cinco años) en Diseño de Comunicación Visual · La Habana, Cuba",
        "lang": "Español, nativo · Inglés, fluido y mi idioma de trabajo profesional",
    },
}

LINKS = [
    ("joseromero.next@gmail.com", "mailto:joseromero.next@gmail.com"),
    ("linkedin.com/in/joseromerodesign", "https://www.linkedin.com/in/joseromerodesign/"),
    ("joseromerodesign.com", "https://www.joseromerodesign.com/"),
]

PAGE = """<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><title>Jose Romero · CV</title><style>
@font-face {{ font-family: Bitter; font-weight: 100 900; src: url('{fonts}/bitter-latin-normal.woff2'); }}
@font-face {{ font-family: Bitter; font-style: italic; font-weight: 100 900; src: url('{fonts}/bitter-latin-italic.woff2'); }}
@font-face {{ font-family: Outfit; font-weight: 100 900; src: url('{fonts}/outfit-latin.woff2'); }}
@font-face {{ font-family: Outfit; font-weight: 100 900; src: url('{fonts}/outfit-latin-ext.woff2');
  unicode-range: U+0100-02BA, U+1E00-1E9F; }}
@page {{ size: A4; margin: 10mm 14mm 9mm; }}
:root {{ --ink: #0E1A23; --ink-2: #2B3A44; --ink-3: #5B6B76; --rule: #D4DDE2; --teal: #0B4E48; --crimson: #B4233F; }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font: 400 8.8pt/1.34 Outfit, sans-serif; color: var(--ink-2); }}
a {{ color: inherit; text-decoration: none; }}
header {{ display: flex; justify-content: space-between; align-items: flex-end; gap: 12mm;
          padding-bottom: 3.6mm; border-bottom: 1.4pt solid var(--crimson); margin-bottom: 3.6mm; }}
h1 {{ font: 400 23pt/1 Bitter, serif; color: var(--ink); letter-spacing: -0.01em; }}
.role {{ font: italic 400 12.5pt/1.2 Bitter, serif; color: var(--crimson); margin-top: 1.6mm; }}
.contact {{ text-align: right; font-size: 8.6pt; line-height: 1.55; color: var(--ink-3); }}
.contact a {{ color: var(--ink-2); }}
.summary {{ font-size: 9.3pt; line-height: 1.45; color: var(--ink); margin-bottom: 1mm; }}
h2 {{ font: 600 7.6pt/1 Outfit; letter-spacing: 0.16em; text-transform: uppercase; color: var(--teal);
      display: flex; align-items: center; gap: 3mm; margin: 3mm 0 1.7mm; }}
h2::after {{ content: ''; flex: 1; height: 0.6pt; background: var(--rule); }}
.job {{ margin-bottom: 2mm; break-inside: avoid; }}
.job-head {{ display: flex; justify-content: space-between; align-items: baseline; gap: 4mm; }}
.job-title {{ font: 500 10pt/1.25 Bitter, serif; color: var(--ink); }}
.job-org {{ font-weight: 600; font-size: 9.2pt; color: var(--ink); white-space: nowrap; }}
.meta {{ font-size: 8pt; color: var(--ink-3); margin: 0.4mm 0 1.1mm; }}
ul {{ list-style: none; }}
li {{ position: relative; padding-left: 3.6mm; margin-bottom: 0.8mm; }}
li::before {{ content: ''; position: absolute; left: 0; top: 0.62em; width: 1.8mm; height: 0.6pt; background: var(--teal); }}
b {{ font-weight: 600; color: var(--ink); }}
.grid {{ display: grid; grid-template-columns: 30mm 1fr; gap: 1.1mm 4mm; }}
.grid dt {{ font-weight: 600; color: var(--ink); }}
</style></head><body>
<header>
  <div><h1>Jose Romero</h1><div class="role">{title}</div></div>
  <div class="contact">{place}<br>{links}</div>
</header>
<p class="summary">{summary}</p>
<h2>{h_exp}</h2>
{jobs}
<h2>{h_research}</h2>
<ul>{research}</ul>
<h2>{h_skills}</h2>
<dl class="grid">{skills}<dt>{h_edu}</dt><dd>{edu}</dd><dt>{h_lang}</dt><dd>{lang_line}</dd></dl>
</body></html>"""


def build(lang):
    c = CV[lang]
    jobs = "\n".join(
        f'<div class="job"><div class="job-head"><span class="job-title">{t}</span><span class="job-org">{html.escape(o)}</span></div>'
        f'<div class="meta">{m}</div><ul>{"".join(f"<li>{b}</li>" for b in bullets)}</ul></div>'
        for t, o, m, bullets in c["jobs"])
    page = PAGE.format(
        lang=lang, fonts=(ROOT / "assets" / "fonts").as_uri(), title=c["title"], place=c["place"],
        links="<br>".join(f'<a href="{u}">{t}</a>' for t, u in LINKS), summary=c["summary"],
        h_exp=c["h"]["exp"], h_research=c["h"]["research"], h_skills=c["h"]["skills"],
        h_edu=c["h"]["edu"], h_lang=c["h"]["lang"], jobs=jobs,
        research="".join(f"<li>{r}</li>" for r in c["research"]),
        skills="".join(f"<dt>{k}</dt><dd>{v}</dd>" for k, v in c["skills"]),
        edu=c["edu"], lang_line=c["lang"])
    with tempfile.TemporaryDirectory() as tmp:
        src = pathlib.Path(tmp) / "cv.html"
        src.write_text(page, encoding="utf-8")
        out = OUT / f"jose-romero-cv-{lang}.pdf"
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                        "--allow-file-access-from-files", "--virtual-time-budget=3000",
                        f"--print-to-pdf={out}", src.as_uri()], check=True, capture_output=True)
        print(out.relative_to(ROOT))


if __name__ == "__main__":
    for lang in CV:
        build(lang)
