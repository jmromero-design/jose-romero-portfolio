// Edge Middleware — markdown content negotiation for agents.
//
// This is the one dynamic piece on an otherwise fully static site, so its
// scope is kept as narrow as the requirement allows:
//
//   - The matcher excludes every static asset path (CSS/JS/images/fonts),
//     favicons, robots.txt, sitemap.xml, and llms.txt — those are already
//     served correctly and don't need to flow through a function.
//   - For every request that DOES match (real pages + any nonexistent
//     path), the middleware only changes behaviour in two cases:
//       1. The homepage ('/'), when the client asks for text/markdown.
//       2. Any path that resolves to a real 404, when the client asks
//          for text/markdown — returns a short markdown 404 body instead
//          of the HTML error page, with links back to the sitemap,
//          llms.txt, and the homepage so an agent can recover.
//     Every other request (any normal page, any normal Accept header) is
//     returned completely untouched — same bytes, same headers, same
//     status — so existing product behaviour and visual design are
//     unaffected.
//   - Both special-cased responses set Vary: Accept, Accept-Encoding so a
//     CDN never serves the wrong cached variant to the next visitor.

export const config = {
  matcher: [
    '/((?!assets/|_vercel/|favicon\\.ico|favicon\\.svg|apple-touch-icon\\.png|robots\\.txt|sitemap\\.xml|llms\\.txt).*)',
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

## Selected work

- [IKEA Home Services](https://joseromerodesign.com/work/ikea-home-services/) — peer-to-peer marketplace, 500,000+ downloads
- [Mapfre · AFIN Financial App](https://joseromerodesign.com/work/mapfre-afin-digital-expansion/) — self-service financial app
- [Santander Nordics · CRO Programme](https://joseromerodesign.com/work/santander-nordics-cro/) — multi-market CRO under regulatory constraints
- [Meliá Hotels · Campaign Platform](https://joseromerodesign.com/work/melia-hotels-campaign-platform/) — zero-to-one internal tool
- [Mapfre · Digital Expansion](https://joseromerodesign.com/work/mapfre-digital-expansion/) — Verti platform redesign across Europe
- [IQOS Club Spain · CRO Programme](https://joseromerodesign.com/work/iqos-club-cro/) — loyalty and behavioural economics
- [XTI Store · E-commerce Redesign](https://joseromerodesign.com/work/xti-ecommerce-redesign/) — fashion retail within platform constraints
- [IKEA · Ways of Working System](https://joseromerodesign.com/work/ikea-ways-of-working/) — design operations framework
- [AI Workflow Design Framework](https://joseromerodesign.com/work/ai-workflow-framework/) — multi-agent process architecture

Full case-study list: https://joseromerodesign.com/work/

## More

- About: https://joseromerodesign.com/about/
- Thinking (long-form writing): https://joseromerodesign.com/thinking/
- Contact: https://joseromerodesign.com/contact/
- Structured agent summary: https://joseromerodesign.com/llms.txt

## Contact

Email: joseromero.next@gmail.com
LinkedIn: https://www.linkedin.com/in/joseromerodesign/
`;

const NOT_FOUND_MARKDOWN = `# 404 — Page not found

This URL doesn't correspond to any page on joseromerodesign.com. It may
have moved, been removed, or never existed.

## Where to look next

- [Sitemap](https://joseromerodesign.com/sitemap.xml) — every indexable URL on this site
- [llms.txt](https://joseromerodesign.com/llms.txt) — structured summary for agents
- [Homepage](https://joseromerodesign.com/)
- [Work index](https://joseromerodesign.com/work/) — all case studies
- [Thinking](https://joseromerodesign.com/thinking/) — long-form writing
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

  if (url.pathname === '/' || originResponse.status === 404) {
    // Only these two cases actually vary their response by Accept, so
    // only these two get Vary added — everything else is returned as-is
    // below, completely untouched.
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
