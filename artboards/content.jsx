// Shared content for all artboards — so changes propagate.
const BRANCHES_CONTENT = {
  intro1: ['Branches', ' is a container for creative projects and consulting work by ', { href: 'https://linkedin.com/in/chrisneels', text: 'Chris Neels' }, '.'],
  intro2: 'An overarching interest is exploring alternative potentials from a place of slowness and deliberation.',
  current: [
    { name: 'Studio Akiya', href: 'https://akiya.studio', desc: 'A contemplative residency series for creative practice.' },
    { name: 'Fathom', desc: 'A tool for surfacing values in investment decisions.' },
    { name: 'Futures work', desc: 'An engagement with a financial services company.' },
  ],
  offerings: [
    {
      name: 'Freelance consulting & advising',
      body: 'Strategic foresight, design research, and product innovation support — often in collaboration with consultancies like Recipe for Tomorrow, The Meta, and Tangible. Recent work has explored the future of culinary culture, financial access, health quantification, and micro-credentials.',
    },
    {
      name: 'Ontological design',
      body: 'Designing environmental conditions that cultivate qualities of mind that support clearer seeing, deeper engagement, and more honest creative work. Projects have included organizing contemplative residencies in rural Japan and reshaping a co-working space in rural Spain.',
    },
  ],
  email: 'hello@branches.studio',
  past: [
    { project: 'The Future of Culinary Culture', partner: 'Global FoodCo', type: 'Strategic Foresight', year: '2026' },
    { project: 'Rethinking Executive Health', partner: 'TELUS Health', type: 'Experience Design', year: '2026' },
    { project: 'The Future of Access', partner: 'Financial Services Co.', type: 'Strategic Foresight', year: '2025' },
    { project: 'Benarrabá Co-Working Space Redesign', partner: 'Rooral', type: 'Ontological Design', year: '2025' },
    { project: 'Speculative Words: Dreams of Rural Revitalization', partner: 'Akiya Collective', type: 'Speculative Design', year: '2025' },
    { project: 'Micro-Credentials: Three Strategic Directions', partner: 'Canadian Standards Assn.', type: 'Strategic Foresight', year: '2024' },
    { project: 'Healthcare Macro Trends & Service Ideation', partner: 'Healthcare Org.', type: 'Strategic Foresight', year: '2021' },
  ],
};

window.BRANCHES_CONTENT = BRANCHES_CONTENT;
