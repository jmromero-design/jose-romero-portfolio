// Edge Middleware — markdown content negotiation for agents.
//
// This is the one dynamic piece on an otherwise fully static site, so its
// scope is kept as narrow as the requirement allows:
//
//   - The matcher excludes every static asset path (CSS/JS/images/fonts),
//     favicons, robots.txt, sitemap.xml, and llms.txt — those are already
//     served correctly and don't need to flow through a function.
//   - For every request that DOES match (real pages + any nonexistent
//     path), the middleware only changes behaviour when the client asks
//     for text/markdown:
//       1. The homepage ('/') gets the hand-written agent summary below.
//       2. Any other page gets its generated markdown version, a static
//          file at /md/<path>/index.md built by scripts/build_markdown.py.
//       3. Any path that resolves to a real 404 gets a short markdown 404
//          body, with links back to the sitemap, llms.txt and the
//          homepage so an agent can recover.
//     Normal browser requests get the same bytes and status as before;
//     the only change is a Vary: Accept, Accept-Encoding header on pages,
//     so a CDN never serves the markdown variant to a browser or the
//     HTML variant to an agent.

export const config = {
  matcher: [
    '/((?!assets/|_vercel/|md/|favicon\\.ico|favicon\\.svg|apple-touch-icon\\.png|robots\\.txt|sitemap\\.xml|llms\\.txt|llms-full\\.txt).*)',
  ],
};

const HOMEPAGE_MARKDOWN = `# Jose Romero — Senior Product Designer

Senior product designer based in Zaragoza, Spain, with 12 years of
professional experience across digital product design, conversion rate
optimisation (CRO), behavioural economics, and design operations. Works in
English and Spanish at professional level.

## Currently

Embedded full-time within IKEA's New Business Platform (Garaje de Ideas /
Groupe EDG), working on two peer-to-peer marketplaces from early stages
through European expansion, plus a cross-tool design operations framework
and an AI workflow design framework for the design team.

## How I work

Every project arrives with pressure from four directions: the business, the
people using the product, the technology underneath, and the organisation
making the calls. Above that sit five layers of work, each with a few tools.
None of it runs in a fixed order, and no project needs all of it. What comes
in at the bottom decides which tools get picked up on the way to the top.

- Evidence: user research, behavioural analysis, analytics and session data, stakeholder interviews, process and service mapping, platform and constraint audits, checking claims against the research
- Framing: problem framing, behavioural diagnosis, hypotheses and success metrics, trade-off mapping, scoping and appetite
- Craft: information architecture, design systems, interface and interaction design, content and UX writing, choice architecture
- Validation: A/B and multivariate testing, usability testing, accessibility review, localisation QA, metrics and reporting
- Systems: ways of working, facilitation and workshops, mentoring, documentation and handoff, a shared insight library, AI-assisted workflows

Where it lands: a decision a team can build, covering what to make next, why
it matters, and how to tell if it worked.

## Selected work

- [IKEA Home Services](https://www.joseromerodesign.com/work/ikea-home-services/) — peer-to-peer marketplace, 500,000+ downloads
- [Mapfre · AFIN Financial App](https://www.joseromerodesign.com/work/mapfre-afin-digital-expansion/) — self-service financial app
- [Santander Nordics · CRO Programme](https://www.joseromerodesign.com/work/santander-nordics-cro/) — multi-market CRO under regulatory constraints
- [Meliá Hotels · Campaign Platform](https://www.joseromerodesign.com/work/melia-hotels-campaign-platform/) — zero-to-one internal tool
- [Mapfre · Digital Expansion](https://www.joseromerodesign.com/work/mapfre-digital-expansion/) — Verti platform redesign across Europe
- [IQOS Club Spain · CRO Programme](https://www.joseromerodesign.com/work/iqos-club-cro/) — loyalty and behavioural economics
- [XTI Store · E-commerce Redesign](https://www.joseromerodesign.com/work/xti-ecommerce-redesign/) — fashion retail within platform constraints
- [IKEA · Ways of Working System](https://www.joseromerodesign.com/work/ikea-ways-of-working/) — design operations framework
- [AI Workflow Design Framework](https://www.joseromerodesign.com/work/ai-workflow-framework/) — multi-agent process architecture

Full case-study list: https://www.joseromerodesign.com/work/

## More

- About: https://www.joseromerodesign.com/about/
- Thinking (long-form writing): https://www.joseromerodesign.com/thinking/
- Contact: https://www.joseromerodesign.com/contact/
- Structured agent summary: https://www.joseromerodesign.com/llms.txt

## Contact

Email: joseromero.next@gmail.com
LinkedIn: https://www.linkedin.com/in/joseromerodesign/
`;

const NOT_FOUND_MARKDOWN = `# 404 — Page not found

This URL doesn't correspond to any page on joseromerodesign.com. It may
have moved, been removed, or never existed.

## Where to look next

- [Sitemap](https://www.joseromerodesign.com/sitemap.xml) — every indexable URL on this site
- [llms.txt](https://www.joseromerodesign.com/llms.txt) — structured summary for agents
- [Homepage](https://www.joseromerodesign.com/)
- [Work index](https://www.joseromerodesign.com/work/) — all case studies
- [Thinking](https://www.joseromerodesign.com/thinking/) — long-form writing
`;

export default async function middleware(request) {
  const url = new URL(request.url);
  const accept = request.headers.get('accept') || '';
  const wantsMarkdown = accept.includes('text/markdown');

  if (url.pathname === '/' && wantsMarkdown) {
    return new Response(HOMEPAGE_MARKDOWN, {
      status: 200,
      headers: {
        'content-type': 'text/markdown; charset=utf-8',
        'vary': 'Accept, Accept-Encoding',
      },
    });
  }

  // any other page: its generated markdown version, when one exists
  if (wantsMarkdown && url.pathname.endsWith('/')) {
    const md = await fetch(new URL('/md' + url.pathname + 'index.md', url.origin));
    if (md.ok) {
      return new Response(md.body, {
        status: 200,
        headers: {
          'content-type': 'text/markdown; charset=utf-8',
          'vary': 'Accept, Accept-Encoding',
          'link': `<${url.origin}${url.pathname}>; rel="canonical"`,
        },
      });
    }
  }

  const originResponse = await fetch(request);

  if (originResponse.status === 404 && wantsMarkdown) {
    return new Response(NOT_FOUND_MARKDOWN, {
      status: 404,
      headers: {
        'content-type': 'text/markdown; charset=utf-8',
        'vary': 'Accept, Accept-Encoding',
      },
    });
  }

  const isPage = (originResponse.headers.get('content-type') || '').includes('text/html');
  if (isPage || originResponse.status === 404) {
    // pages (and 404s) vary by Accept now that each has a markdown twin
    const headers = new Headers(originResponse.headers);
    headers.set('vary', 'Accept, Accept-Encoding');
    return new Response(originResponse.body, {
      status: originResponse.status,
      statusText: originResponse.statusText,
      headers,
    });
  }

  return originResponse;
}
