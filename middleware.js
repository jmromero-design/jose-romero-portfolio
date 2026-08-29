// Edge Middleware — markdown content negotiation for the homepage only.
//
// Scope is deliberately narrow (matcher: '/' only): this static site has
// no build step and no server, so this is the one piece of dynamic
// behaviour on the whole project. Keeping it to a single path limits the
// blast radius if something about the Edge runtime behaves differently
// than expected in production.
//
// When a client asks for text/markdown (AI agents following the
// acceptmarkdown.com convention), respond with a hand-written markdown
// summary of the homepage instead of the HTML page. Every response from
// this route — markdown or the normal HTML — carries Vary: Accept, so a
// CDN never serves the wrong cached variant to the next visitor
// regardless of which one it saw first.

export const config = {
  matcher: '/',
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

export default async function middleware(request) {
  const accept = request.headers.get('accept') || '';

  if (accept.includes('text/markdown')) {
    return new Response(HOMEPAGE_MARKDOWN, {
      status: 200,
      headers: {
        'content-type': 'text/markdown; charset=utf-8',
        'vary': 'Accept, Accept-Encoding',
      },
    });
  }

  // Not a markdown request — fetch the normal static homepage from origin
  // and pass it through, adding Vary so caches keyed on this URL don't mix
  // up the HTML and markdown variants.
  const originResponse = await fetch(request);
  const headers = new Headers(originResponse.headers);
  headers.set('vary', 'Accept, Accept-Encoding');
  return new Response(originResponse.body, {
    status: originResponse.status,
    statusText: originResponse.statusText,
    headers,
  });
}
