// Single source of truth for path strings, shared by the desktop cube shell
// (CubeConsole.js) and the mobile/accessible fallback (GlassPortfolio.js +
// WorkSection.js) so the two independent view layers can never disagree
// about what a URL means.
export const ROUTES = {
  home: '/',
  work: '/work',
  play: '/play',
  about: '/about',
  contact: '/contact',
  project: (id) => `/project/${id}`,
  caseStudy: (id) => `/project/${id}/case-study`,
  game: (slug) => `/play/${slug}`,
};

// Translates a URL into the shape CubeConsole's `active`/`page` state (and
// GlassPortfolio's scroll-spy `section`) already expect — reproducing the
// same three-level semantics (root -> menu(active) -> page) the cube had
// before it was route-driven, so a project/game page keeps its parent face
// "active" behind it (matches the existing Back behavior).
export function deriveRoute(pathname, params) {
  const caseStudy = pathname.endsWith('/case-study');

  if (pathname === ROUTES.work) {
    return { face: 'work', page: null, caseStudy: false, section: 'work' };
  }
  if (pathname === ROUTES.play) {
    return { face: 'play', page: null, caseStudy: false, section: 'play' };
  }
  if (pathname === ROUTES.contact) {
    return { face: 'contact', page: null, caseStudy: false, section: 'contact' };
  }
  if (pathname === ROUTES.about) {
    return { face: null, page: { kind: 'about' }, caseStudy: false, section: 'about' };
  }
  if (params.id) {
    return { face: 'work', page: { kind: 'project', id: params.id }, caseStudy, section: 'work' };
  }
  if (params.slug) {
    return { face: 'play', page: { kind: 'game', slug: params.slug }, caseStudy: false, section: 'play' };
  }
  return { face: null, page: null, caseStudy: false, section: 'home' };
}
