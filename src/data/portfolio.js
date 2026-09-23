// Liquid Glass portfolio — concise, presentation-ready content model.
// Source of truth: Nicolo_Lagravinese_Resume (kept in sync).
import { getImagePath } from '../utils/imagePath';

export const profile = {
  name: 'Nicolò Lagravinese',
  role: 'UX Designer & Frontend Developer',
  tagline:
    'I build interfaces that feel good to use and design the experience around them. The backend, infrastructure, and hardware are things I reach for when a project needs them, not where I live.',
  location: 'Boston, MA',
  availability: 'Open to full-time, available January 2027',
  email: 'nlagravinese@gmail.com',
  links: {
    github: 'https://github.com/NicLagr',
    linkedin: 'https://www.linkedin.com/in/nicolo-lagravinese/',
    behance: 'https://www.behance.net/nicololagravi2',
    resume: process.env.PUBLIC_URL + '/Nicolo_Lagravinese_Resume.pdf',
  },
};

export const education = {
  school: 'Northeastern University · Khoury College of Computer Sciences',
  degree: 'B.S. Computer Science & Interaction Design · Minor in History',
  dates: 'Expected Dec 2026',
};

export const about = {
  bio: [
    'Hey, I’m Nicolò. I design and build software. I focus on the experience layer and the frontend. Most recently that’s been two co-ops, at GE Aerospace and Tulip Interfaces, plus a CRM I built and still run for a local jewelry store.',
    'I’m looking for my next frontend or product design role. If that sounds like a fit, reach out.',
  ],
};

export const experience = [
  {
    company: 'GE Aerospace · Aerospace Carbon Solutions',
    role: 'UX Design & Frontend Developer Co-op',
    type: '',
    dates: 'Jan 2026 – Aug 2026',
    location: 'Boston, MA',
    points: [
      'Designed the UX and contributed to frontend for a weather and flight visualization platform (Vue 3, CesiumJS), plus Figma UI design and frontend features for SIGNPOST, an airline emissions-planning SaaS tool.',
      'Facilitated 12 iterative feedback sessions over 3 months with domain scientists and aviation partners. Their input directly shaped the layer color gradients and legends, the wind barbs, and a dedicated demo mode for executive presentations.',
      'Designed and implemented complex interactive features: layer controls (color ramp, opacity, thresholds), GPU-accelerated wind-particle animations, and flight-path and contrail-risk collision detection with time-synced playback. Authored 259 of 369 frontend commits (about 70%) across 26 merged pull requests.',
      'Designed and implemented 10 features end to end for SIGNPOST, a SaaS tool airlines use to evaluate emissions-reduction tradeoffs across fleet upgrades, sustainable aviation fuel, and carbon removals. Built half of its reusable components and all of its icon assets, and led a repo-wide domain refactor across 40+ files with zero regressions.',
      'Built Figma mockups for SIGNPOST’s user-facing pages and data visualizations, aligned to Phase, the SaaS team’s internal design system, and iterated directly with the product manager and lead UX designer. Introduced AI-assisted tools (Figma Make, Claude Code, GitHub Copilot) into the mockup-to-code workflow, cutting revision rounds from 3 to 4 down to 1 to 2 before features were dev-ready.',
    ],
  },
  {
    company: 'Tulip Interfaces',
    role: 'Platform Support Engineer',
    type: 'Part-Time',
    dates: 'Jul 2025 – Jan 2026',
    location: 'Remote',
    points: [
      'Supported 10+ product areas at about 15 to 20 tickets weekly, cutting resolution time about 40%.',
      'Identified recurring UX friction in Tulip’s data and table model across 30+ Community threads, and authored a camera-widget product-feedback proposal.',
      'Recommended a hardware fix that the customer tested and rolled out across their fleet.',
    ],
  },
  {
    company: 'Tulip Interfaces',
    role: 'UX Engineer',
    type: 'Co-op',
    dates: 'Jan 2025 – Jun 2025',
    location: 'Somerville, MA',
    points: [
      'Led UX design and prototyping for Mission Control 3.0, a React web app for executive factory tours.',
      'Built and supported 15+ interactive TEC demos for executive tours and trade shows (IMTS, Pharma MES USA, Automate) for 1,000+ professionals, iterating through near-daily CEO feedback loops on the factory floor, plus UX support for World Economic Forum and CEO/CTO tours.',
    ],
  },
  {
    company: 'Northeastern University · MIE',
    role: 'IT Specialist',
    type: '',
    dates: 'Sep 2024 – Dec 2024',
    location: 'Boston, MA',
    points: [
      'Maintained computing infrastructure and hardware/software troubleshooting for 50+ faculty and grad students.',
    ],
  },
  {
    company: 'Kinnaly Labs · UC Davis',
    role: 'Algorithm Developer Intern',
    type: '',
    dates: 'Feb 2024 – May 2024',
    location: 'Remote',
    points: [
      'Built algorithms to organize biobehavioral aging data and extract patterns, improving analysis throughput 3×.',
    ],
  },
];

// Work projects (games live separately in data/games.js, surfaced in "Play").
export const projects = [
  {
    id: 'nurture-nest',
    title: 'Nurture Nest',
    org: 'Innovators for Global Health',
    year: '2025 – 2026',
    role: 'UX & Frontend',
    summary:
      'Mobile-first maternal-health app with flows for tracking, alerts, and education, designed for accessibility in rural communities.',
    highlights: [
      'Collaborated on UX design in Figma and React frontend.',
      'Accessibility-first, mobile-first patterns for low-bandwidth contexts.',
      'Presented the working prototype at Northeastern’s RISE expo, funded by a PEAK Experience Award.',
    ],
    tags: ['Figma', 'React', 'UX', 'Accessibility', 'Healthcare'],
    image: getImagePath('/projects/nurture-nest/hero.jpg'),
    accent: 'var(--accent-grad)',
    caseStudy: {
      subtitle: 'Maternal mental health support for rural Ghana, designed around what people already believe rather than against it.',
      sections: [
        {
          heading: 'Mission',
          body: 'Give a pregnant or new mother in rural Ghana a way to notice how she is doing, and a reason to say it out loud to someone who can help.',
        },
        {
          heading: 'Context',
          body: [
            'Nurture Nest is a student project through Innovators for Global Health, in partnership with the Dwenase Health Centre in Ghana. Postpartum depression and anxiety are common there and care is thin. Stigma, distance and too few professionals keep most women from reaching any of it.',
            'I was on the tech team from the start: initial planning, the UX and UI flows, some of the Figma, and some of the React Native frontend. I also wrote the user research questions our club leaders carried to Ghana.',
          ],
          stat: {
            value: '3.8% \u2013 33.5%',
            label: 'The reported range for postpartum depression across Ghana, from thirteen years of studies. The spread is that wide because almost nobody is counting. In Dwenase nobody was.',
            source: 'Keku et al., Prevalence of postpartum depression in Ghana: a systematic review, Scientific Electronic Archives 17(1), 2024',
            href: 'https://scientificelectronicarchives.org/index.php/SEA/article/view/1826',
          },
        },
        {
          heading: 'Research',
          body: [
            'We built the first version to have something to ask questions about. A description of an app gets you politeness. A working app in someone\u2019s hand gets you corrections.',
            'Our club leaders took it to Dwenase and sat down with the six people who would be the ones recommending it: five midwives and a doctor, one of the midwives the clinic\u2019s mental health specialist.',
            'They told us what the literature cannot. Low mood after birth is common here, nobody screens for it, and a tool that caught it would get used.',
            'The United States reports 11.9% and screens for it routinely. Even there, only one mother in four with symptoms is ever diagnosed. Dwenase screens for none of it.',
            'The first design compared the baby\u2019s size to Western supermarket fruit. That came back from the trip, and we changed it in both the Figma and the app before the RISE expo a few weeks later: ziziphus, uapaca, agbalumo, guava, tangerine, jackfruit, papaya, pineapple, watermelon.',
            'It was a patch and we knew it. Nine entries, one a month, means the same picture for four weeks at a time. This redesign does the whole job: fifteen ranges covering weeks 1 to 40, built on what is at market in Dwenase. Ackee apple, dawadawa seed, hog plum, plantain, yam tuber.',
          ],
          image: {
            maxWidth: 680,
            src: getImagePath('/projects/nurture-nest/research-poster.jpg'),
            badge: { kind: 'built', label: 'Implementation \u00b7 MVP' },
            caption: 'The research poster for the first build, presented at Northeastern\u2019s RISE expo with funding from a PEAK Experience Award',
          },
        },
        {
          heading: 'Design Pillars',
          body: [
            'Ask for less. One question per screen, and never a question whose answer the app does not use.',
            'No word she has to learn. If a term only makes sense to a clinician, it does not appear.',
            'Work with the belief, not against it. Telling someone their family is wrong is a good way to lose them.',
          ],
          images: [
            { src: getImagePath('/projects/nurture-nest/dev-belief-down.png'), badge: 'figma', bare: true, maxWidth: 300, caption: 'One belief a month, face down. She turns it over when she is ready to' },
            { src: getImagePath('/projects/nurture-nest/dev-belief-up.png'), badge: 'figma', bare: true, maxWidth: 300, caption: 'Turned over. It names what people here say about sadness after birth before it says anything else' },
          ],
        },
        {
          heading: 'Features',
          body: 'The app is four things: a home screen for the week she is in, a symptom tracker she can fill in with one tap a day, three standard screenings, and a set of readings and contacts that change with how far along she is.',
          carouselAspect: '514 / 1085',
          carouselBare: true,
          carousel: [
            { src: getImagePath('/projects/nurture-nest/dev-home.png'), badge: 'figma', caption: 'Home, at week 28. The size pill is the tappable route into the week page' },
            { src: getImagePath('/projects/nurture-nest/dev-week-7.png'), badge: 'figma', caption: 'A week page. Fifteen entries cover weeks 1 to 40 as ranges, so there is no week without one' },
            { src: getImagePath('/projects/nurture-nest/dev-month.png'), badge: 'figma', caption: 'A month of symptoms, so she arrives at an antenatal visit with something to show' },
            { src: getImagePath('/projects/nurture-nest/dev-sources.png'), badge: 'figma', caption: 'Readings that change with the week she is in' },
            { src: getImagePath('/projects/nurture-nest/dev-danger.png'), badge: 'figma', caption: 'Danger signs: a flat list, nothing to open, and the call button at both ends' },
          ],
          prototype: {
            label: 'Click through the app',
            src: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FJlOxaR8O9w6ag8YqgslkGH%2FNurture-Nest-Redesign%3Fnode-id%3D156-236048%26starting-point-node-id%3D156%253A236048%26scaling%3Dscale-down-width%26content-scaling%3Dfixed%26hide-ui%3D1',
            link: 'https://www.figma.com/proto/JlOxaR8O9w6ag8YqgslkGH/Nurture-Nest-Redesign?node-id=156-236048&starting-point-node-id=156%3A236048',
            width: 320,
          },
        },
        {
          heading: 'Iteration',
          body: [
            'The shipped onboarding asked for name, age, email and a due date typed as YYYY-MM-DD, all on one screen, before anything else was visible.',
            'Most women here do not know a due date. So the app asks three ways: the date the health centre gave her, the date of her last period, or just how far along she feels. Whichever she can answer sets the week.',
            'Age and email are gone. Age was collected and never used, and an email field quietly contradicts the promise that nothing leaves the phone.',
          ],
          image: {
            src: getImagePath('/projects/nurture-nest/onboarding-row.png'),
            badge: 'figma',
            bare: true,
            maxWidth: 680,
            caption: 'The first run: her name, how far along she is, then a date she can actually give. Three screens, one question each',
          },
          prototype: {
            label: 'Run the first-time setup',
            src: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FJlOxaR8O9w6ag8YqgslkGH%2FNurture-Nest-Redesign%3Fnode-id%3D156-234591%26starting-point-node-id%3D156%253A234591%26scaling%3Dscale-down-width%26content-scaling%3Dfixed%26hide-ui%3D1',
            link: 'https://www.figma.com/proto/JlOxaR8O9w6ag8YqgslkGH/Nurture-Nest-Redesign?node-id=156-234591&starting-point-node-id=156%3A234591',
            width: 320,
          },
        },
        {
          heading: 'User Testing',
          body: [
            'I ran the past-results screen past a club leader who speaks English natively. She could not read it. Her words were \u201cseven of what? a mild what?\u201d',
            'PHQ-9 gives you a number and a severity band. The band is the problem: \u201cmild\u201d has no honest ending here, because the sentence it wants is \u201cmild depression\u201d and the app had promised it does not diagnose.',
            'So the score goes back into the thing she actually did, which was say how often she felt things. A 7 now reads \u201cA few of these feelings, some days. You scored 7 of 27, less than last time.\u201d Same information, no diagnosis, nothing to learn.',
          ],
          image: {
            src: getImagePath('/projects/nurture-nest/dev-past-results.png'),
            badge: 'figma',
            bare: true,
            maxWidth: 320,
            caption: 'Past results after the rewrite. The middle line is the whole change',
          },
        },
        {
          heading: 'Handoff',
          body: [
            'Another team builds this, so the deliverable is a kit rather than a set of pictures. Forty-seven screens, a component library, and a palette with every colour pair measured against WCAG AA instead of eyeballed.',
            'Body text starts at 16px, not the 14 a consumer app would use, and touch targets are 56px rather than 44. It is a modest phone, used outdoors, often one-handed.',
            'So a screen nobody has designed yet can still be built, and still look like the rest.',
          ],
          imagesStack: true,
          images: [
            { src: getImagePath('/projects/nurture-nest/sys-contrast.png'), badge: 'figma', maxWidth: 680, caption: 'Every pair measured. inkFaint is the one tone that misses AA for body text, so it is restricted to labels and decorative marks' },
            { src: getImagePath('/projects/nurture-nest/sys-colour.png'), badge: 'figma', maxWidth: 680, caption: 'The palette. A warm earth range replacing the Expo template blue the first build shipped with' },
            { src: getImagePath('/projects/nurture-nest/sys-type.png'), badge: 'figma', maxWidth: 620, caption: 'The type scale, floored at 16px for body' },
            { src: getImagePath('/projects/nurture-nest/sys-components-1.png'), badge: 'figma', maxWidth: 420, caption: 'Three of the nineteen variant sets. Every part is drawn once, then used everywhere' },
          ],
        },
        {
          heading: 'Learnings',
          body: [
            'The first build did its job. It was the instrument that got us real answers, and almost everything worth keeping in the redesign came from something it provoked.',
            'Designing for someone means letting them set the design language. Speaking to their concerns, in their words, was always the point of this app, and it is the part we could not reason our way to from Boston. We only got it by putting the thing in front of them.',
            'The part I did not expect was how much of that was literally language. The screens that failed were not the ones that looked wrong. They were the ones a fluent English speaker could not parse, and I only found that by watching one person try.',
          ],
        },
      ],
    },
    links: {
      proto: 'https://www.figma.com/proto/JlOxaR8O9w6ag8YqgslkGH/Nurture-Nest-Redesign?node-id=156-236048&starting-point-node-id=156%3A236048',
      deck: 'https://www.behance.net/gallery/256098785/Nurture-Nest-Maternal-Mental-Health-for-rural-Ghana',
    },
  },
  {
    id: 'jewelry-crm',
    title: 'Jewelry Store CRM',
    org: 'Independent',
    year: '2026',
    role: 'Solo · Design + Full-Stack',
    summary:
      'An iPad CRM and repair tracker running in a working jewelry store. Staff move each job across a Kanban board, snap photos of pieces at drop-off, and pull up customers right from the counter.',
    highlights: [
      'In daily use at a real store, with the workflow shaped by watching staff use it: a hover-only edit button became permanently visible, and a number input that fought against typing prices became plain text.',
      'Kanban board from intake to pickup, a single-page ticket flow rebuilt after the owner asked for something simpler than my original wizard, customer directory, and global search.',
      'Next.js 15 and React 19 in TypeScript, Tailwind v4, and Prisma, with role-based logins.',
    ],
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Prisma'],
    // A Figma mockup of the job board composited into a photorealistic
    // iPad-on-a-desk shot — how the product actually reads sitting on the
    // counter, not just as a screenshot.
    image: getImagePath('/projects/jewelry-crm/iPad Pro mockup.png'),
    accent: 'var(--accent-grad)',
    caseStudy: {
      hero: getImagePath('/projects/jewelry-crm/iPad Pro mockup.png'),
      subtitle: 'An iPad CRM and repair tracker, in daily use at a working jewelry store.',
      sections: [
        {
          heading: 'Mission',
          body: 'Get a repair from the counter to the customer\u2019s hand without anyone having to remember where it is.',
        },
        {
          heading: 'Context',
          body: [
            'A local jewelry store was running repairs and customers on paper and memory. A piece comes in and it needs a ticket, a photo, a customer attached to it, and a clear place in the queue.',
            'That is easy to lose on a busy counter. It had to be usable mid-conversation with a customer standing there, on an iPad, without slowing the conversation down.',
            'The store is run by my family, so I could scope it with the owner directly. I designed and built all of it: the UX, the interface, the data model and the backend.',
          ],
          image: { src: getImagePath('/projects/jewelry-crm/paper-ticket-redacted.jpg'), maxWidth: 400, caption: 'What it replaced. Their paper ticket, redacted' },
        },
        {
          heading: 'Scope',
          body: [
            'Before opening Figma I wrote out the three roles who would use it, the full status pipeline from intake to picked up, and the data behind a job.',
            'Then a plain list of what I would not build yet: a payment gateway, a customer portal, real analytics. Cutting those early kept the first version to what the counter actually needed.',
          ],
          image: { src: getImagePath('/projects/jewelry-crm/intake-flow.png'), badge: { kind: 'figma', label: 'Figma \u00b7 Flow' }, maxWidth: 680, caption: 'The intake flow, mapped before any interface existed' },
        },
        {
          heading: 'Pivot',
          body: [
            'My first wireframe split ticket creation into four steps: customer, item, services, promised date. The owner\u2019s feedback was direct. He wanted one page, because staff at the counter do not have time to click through steps.',
            'I checked two assumptions before rebuilding. One page instead of four, and landscape instead of portrait, since the iPad sits flat on the counter. Both confirmed, so intake became a single scrolling form.',
            'He also asked for the job number to be typed in rather than auto-generated. Their paper tickets already carry their own numbers, and two numbering systems on one job would confuse the counter more than it helped.',
          ],
          images: [
            { src: getImagePath('/projects/jewelry-crm/process-wireframe-wizard.jpg'), badge: { kind: 'figma', label: 'Figma \u00b7 Wireframe' }, caption: 'The wizard. Step 1 of 4, with three more before the job existed' },
            { src: getImagePath('/projects/jewelry-crm/figma-intake.png'), badge: 'figma', caption: 'What replaced it. One page, landscape, everything visible at once' },
          ],
        },
        {
          heading: 'Features',
          body: [
            'A Kanban board is the home screen. Every job moves across columns from intake to pickup, so anyone can read the state of the shop at a glance.',
            'Creating a ticket is one page: snap photos of the piece at drop-off, attach a customer, and it lands on the board. A directory and a global search let staff pull a customer up from the counter.',
            'A status change can also send a text. Staff pick a template or write their own, and Twilio delivers it. It checks the customer\u2019s opt-in and a store-wide toggle, and logs every attempt, sent, blocked or failed, to that job\u2019s activity trail.',
          ],
          carousel: [
            { src: getImagePath('/projects/jewelry-crm/repair-board.png'), badge: 'figma', caption: 'The board, from intake to picked up' },
            { src: getImagePath('/projects/jewelry-crm/customer-directory.png'), badge: 'figma', caption: 'Customer directory, searchable from the counter' },
            { src: getImagePath('/projects/jewelry-crm/figma-reports.png'), badge: 'figma', caption: 'Reports, built for the owner rather than the counter' },
          ],
          prototype: { label: 'Click through the intake flow', src: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FhCZGwMAKQABnoMgIh4LDDV%2FJewelry-CRM-Prototype%3Fnode-id%3D138-389%26starting-point-node-id%3D138%253A389%26t%3D6oBdWu1ihwyIhbz2-1%26hide-ui%3D1%26scaling%3Dscale-down-width', link: 'https://www.figma.com/proto/hCZGwMAKQABnoMgIh4LDDV/Jewelry-CRM-Prototype?node-id=138-389&starting-point-node-id=138%3A389', device: false, maxWidth: 960 },
        },
        {
          heading: 'User Testing',
          body: [
            'The Figma prototype set the direction, but the shipped product kept moving past it. Real hands on the screen in the store surfaced friction I had not predicted.',
            'The job number\u2019s edit button only appeared on hover. Fine with a mouse, invisible on a touchscreen, which has no hover state. Watching staff hunt for it, I made every edit control permanently visible.',
            'The price field was a number input with spinner arrows that reformatted on every keystroke, so typing a price felt like fighting the field. A plain text input that reformats only once you tap away types the way people actually type prices.',
          ],
          image: { src: getImagePath('/projects/jewelry-crm/process-job-detail-edit.jpg'), badge: 'built', maxWidth: 680, caption: 'Job detail in the shipped app, every edit control visible without hovering' },
        },
        {
          heading: 'Iteration',
          body: [
            'The promised pickup date started out required, which held until a piece needed assessment before anyone could promise a turnaround. Staff were entering placeholder dates to get past the form, so I made it optional.',
            'The first pass dropped the requirement without saying so. I added an explicit "(optional)" label, a way to clear the date, and a plain sentence about when it appears in a customer text, replacing an amber warning box.',
            'The completed-ticket label had its own loop. It read "Completed: [date] (was [date])", and "was" was ambiguous enough that I changed it to "Promised".',
          ],
          images: [
            { src: getImagePath('/projects/jewelry-crm/process-promised-date.jpg'), badge: 'built', caption: 'The promised date, optional and clearable, with the warning box gone' },
            { src: getImagePath('/projects/jewelry-crm/process-sms-modal.jpg'), badge: 'built', caption: 'Texting a customer, with the template picker and the activity trail behind it' },
          ],
        },
        {
          heading: 'Learnings',
          body: [
            'The board shipped with a note saying drag-and-drop was not built yet, click a card to change its status. Once the core flow was proven I added real drag-and-drop. Search shipped squeezed into the same four-column layout and got its own flat list once it turned out to be unreadable.',
            'None of those were rewrites. They are the kind of correction you only find by watching someone use the thing every day, which is the argument for putting something small into real use rather than designing until it feels finished.',
          ],
          image: { src: getImagePath('/projects/jewelry-crm/kanban-drag-drop.gif'), badge: 'built', maxWidth: 680, caption: 'Drag-and-drop on the board, added once the click-to-change flow had proven out' },
        },
      ],
    },
    links: { repo: 'https://github.com/NicLagr/Jewelry-RCM-App' },
  },
  {
    id: 'newvegas',
    title: 'New Vegas Web Monitor',
    org: 'Personal',
    year: '2026',
    role: 'Solo · Design + Engineering',
    summary:
      'A Pip-Boy-style second screen for Fallout: New Vegas. A native game plugin streams live player state to a web app over WebSocket, so you can read status, inventory, and the Mojave map on a second display while you play.',
    highlights: [
      'Ran a full design process before writing any code: a navigation flow map, low-fidelity wireframes with a running decisions log, a Figma design system (color, type, and spacing tokens, 15+ components), and every final screen, referenced through development rather than designed on the fly.',
      'Designed status as the default view, since HP and AP are what you check first mid-fight, with every screen auto-updating over WebSocket so it works as a glance, not an app you operate.',
      'Built a peripheral combat indicator, a soft glow at the screen edges when you’re in a fight, since your eyes are on the game, not this screen.',
      'Redesigned marker placement after the first version (long-press) fought with the map’s own pan gesture; replaced it with a fixed reticle you aim by panning underneath it.',
    ],
    tags: ['UX Design', 'Vue 3', 'TypeScript', 'C++', 'WebSocket', 'PWA', 'Capacitor'],
    // A custom-built device mockup (real vector illustration, not a stock
    // template: bezel, hinge, glass glare, every button, all built in Figma)
    // showing both screens at once reads as an actual shipped product, not
    // just a UI crop — a stronger first impression than a bare screenshot.
    // Card-shaped contexts (Work row, project hero, sheet header) cover-crop
    // this the same as any other project image; the shot is generously
    // padded and centered, so a center-crop still shows the whole device.
    image: getImagePath('/projects/newvegas/device-mockup-full.png'),
    // `imageFit: 'contain'` only changes how the *case study* hero renders
    // (see CaseStudyBody) — that one has no fixed card shape to match, so it
    // shows the product shot at its own natural size instead of forcing it
    // into a box it doesn't fit, which is what caused visible letterbox bars.
    imageFit: 'contain',
    accent: 'var(--accent-grad)',
    caseStudy: {
      // the array shot (all three color options together) for the case
      // study specifically, since it ties directly to the "amber, green,
      // blue" theme story later in the page
      hero: getImagePath('/projects/newvegas/device-mockup-array.png'),
      subtitle: 'A live Pip-Boy companion screen for Fallout: New Vegas.',
      sections: [
        {
          heading: 'An idle second screen',
          body: 'Dual-screen Android handhelds, like the AYN Thor I built this for, have a second panel sitting a few inches from whatever is on the main screen, and on most games it just sits there doing nothing. New Vegas Web Monitor turns that idle panel into a live companion display for Fallout: New Vegas, a 2010 PC game that was never built to support a second screen. It mirrors the Pip-Boy, the wrist computer every playable character wears in the series, a HUD that is actually an object your character wears instead of a floating overlay: status, inventory, and the Mojave map, updating in real time as you actually play. I also ran the project the way I would want to run a real design engagement, a full design system and every screen mapped out in Figma before a line of code, since this was as much a chance to practice that process properly as it was to build something I wanted to use.',
        },
        {
          heading: 'Two references, not one',
          body: 'I worked from two real references instead of a blank page. The first was New Vegas’s own in-game Pip-Boy, its actual HUD, and the color option buried in the game’s settings menu, amber by default with green and blue alternates, which is exactly the toggle this app’s theme system mirrors. The second was Bethesda’s own Fallout 4 Pip-Boy Companion App, a real Bluetooth-paired second-screen product they shipped in 2015 for a later game, and the closest thing to prior art for this exact idea. I borrowed its tab structure, STAT, INV, DATA, MAP, RADIO, since that is a genuinely solved information architecture, but kept the visual language New Vegas’s own instead of the green CRT look the FO4 app and most fan clones default to. New Vegas’s own Pip-Boy runs amber, and that mattered more to me than matching Bethesda’s later, different-looking app.',
        },
        {
          heading: 'Mapping the navigation first',
          body: 'Before any screen, I mapped the navigation itself: Connect, then an app shell with STATUS, INV, DATA, and MAP as the four top-level tabs, in the game’s own order, so arriving already knowing where things live costs no relearning. Settings and Fast Travel hang off that shell as modals rather than a fifth and sixth tab, since configuration is not content and fast travel needed the map still visible underneath it, not a separate screen that hides the geography you are deciding about. I marked the diagram itself with a small legend, solid box for a decided element, dashed for placement or content still unresolved, grey bars for text not yet written, a crossed box for an image or render placeholder, so at any point the file itself showed what was actually settled and what still wasn’t, not just what was drawn.',
          image: {
            src: getImagePath('/projects/newvegas/figma-flow.jpg'),
            badge: { kind: 'figma', label: 'Figma · Flow' },
            caption: 'Navigation mapped before any screen: four tabs in the game’s own order, Settings and Fast Travel as modals off the shell',
            maxWidth: 960,
          },
        },
        {
          heading: 'Wireframes, and what they committed to',
          body: [
            'From the flow I moved to low-fidelity wireframes for every screen, and next to each one I wrote down what that layout was actually committing to, in plain language, not just the boxes themselves. Inventory got list and detail side by side rather than stacked, because a stacked layout means a push-and-back trip for the single most repeated action in the app, just looking at an item. Map markers got anchored at their tip, not their center, so the point of the pin actually marks the place instead of floating above it by half the pin’s height. Icons were committed to single-color silhouettes, tinted at runtime, so one asset set covers every theme instead of shipping separate art per color.',
            'Not everything got settled at this stage. One open question in the wireframes was whether the app needed one fixed viewport or real breakpoints for phone and desktop browsers too, marked open rather than guessed at. That one got answered by building it: one fixed viewport, tuned specifically to the AYN Thor’s panel, the same fact that shows up later as the handheld-specific sizing in the shipped app.',
          ],
          images: [
            {
              src: getImagePath('/projects/newvegas/figma-wireframe-status.png'),
              badge: { kind: 'figma', label: 'Figma · Wireframe' },
              caption: 'Status, wireframed: the body figure as the anchor, per-limb condition, settings tucked behind the corner control',
            },
            {
              src: getImagePath('/projects/newvegas/figma-wireframe-inv.png'),
              badge: { kind: 'figma', label: 'Figma · Wireframe' },
              caption: 'Inventory, wireframed: list and detail side by side, actions under the detail rather than in the row',
            },
            {
              src: getImagePath('/projects/newvegas/figma-wireframe-map.png'),
              badge: { kind: 'figma', label: 'Figma · Wireframe' },
              caption: 'Map, wireframed: chrome floats over a full-frame map, controls bottom-right where a thumb actually reaches',
            },
            {
              src: getImagePath('/projects/newvegas/figma-wireframe-settings.png'),
              badge: { kind: 'figma', label: 'Figma · Wireframe' },
              caption: 'Settings, wireframed as a modal over Status: grouped rows, no nested navigation',
            },
          ],
        },
        {
          heading: 'A design system, then components, then screens',
          body: [
            'I mapped this out the way I would want to work on a real product: tokens first, then components, then screens, each step built on the last instead of designing screens directly. Color, state, type, and spacing all got defined as a real design system before a single screen existed, including all three theme palettes together, so amber, green, and blue were never an afterthought bolted onto one finished look.',
            'From there I built a full component sheet, tabs, buttons, badges, inventory rows, limb bars, map markers, and more, so every screen after that got assembled from pieces that already existed instead of one-off shapes. Only then did I design the actual screens, and that Figma file is what I built the app against, not a screenshot reference dug up after the fact.',
          ],
          images: [
            {
              src: getImagePath('/projects/newvegas/figma-foundations.png'),
              badge: 'figma',
              caption: 'All three theme palettes, amber, green, blue, built into the same token set from day one, so switching themes was never a coat of paint bolted onto one finished look',
            },
            {
              src: getImagePath('/projects/newvegas/figma-components.png'),
              badge: 'figma',
              caption: 'A real variant for every state, so when Inventory needed a row and Data needed one too, both came from the same piece instead of two one-off shapes',
            },
          ],
        },
        {
          heading: 'Every screen in the mockup',
          body: 'The Figma file covers the whole app: Connect, Status, both inventory tabs, both data tabs, both modals, and the map, which gets its own section below. All of it designed in full before any of it existed in code, and each screen carrying a reason rather than just a layout.',
          carousel: [
            { src: getImagePath('/projects/newvegas/hifi-connect.png'), badge: 'figma', caption: 'Connect, the app’s front door before any live data exists' },
            { src: getImagePath('/projects/newvegas/hifi-status.png'), badge: 'figma', caption: 'Status, the default view, since HP and AP are what you check first mid-fight' },
            { src: getImagePath('/projects/newvegas/hifi-inv-weapons.png'), badge: 'figma', caption: 'Inventory · Weapons, list and detail side by side, not stacked, so the single most repeated action never costs a push-and-back trip' },
            { src: getImagePath('/projects/newvegas/hifi-inv-aid.png'), badge: 'figma', caption: 'Inventory · Aid, the same row and detail components as Weapons, holding different data' },
            { src: getImagePath('/projects/newvegas/hifi-data-quests.png'), badge: 'figma', caption: 'Data · Quests, your active objectives, so the second screen can answer what to do next without pausing the game' },
            { src: getImagePath('/projects/newvegas/hifi-data-radio.png'), badge: 'figma', caption: 'Data · Radio, station list and now-playing, the one tab you can use without looking at it' },
            { src: getImagePath('/projects/newvegas/hifi-settings-modal.png'), badge: 'figma', caption: 'Settings, as a modal off the shell rather than a fifth tab, since configuration is not content' },
            { src: getImagePath('/projects/newvegas/hifi-fast-travel-modal.png'), badge: 'figma', caption: 'Fast Travel, also a modal, so the geography you are deciding about stays visible underneath it' },
          ],
        },
        {
          heading: 'Getting the map right',
          body: [
            'The map is where the Figma file and the shipped app line up most closely, and where they diverge most sharply. The Mojave background, the marker icon, and the overall layout all carried over directly from the design file. How you actually interact with the map did not.',
            'The first version let you drop a custom marker with a long press, which looked fine as a static screen in Figma but fought with the map’s own pan gesture the moment it was something you could actually touch, since the same finger motion that pans the map can register as a hold. I replaced it with a fixed reticle at the center of the screen, you pan the map under it and tap to drop a marker there, so placing a pin never competes with moving around. It also has a follow-mode that recenters on your live position, and turns itself off the moment you pan or zoom manually, so it never fights you for control of the view. Calibrating the map itself, matching real in-game coordinates to the static Mojave image, took several passes of nudging the offset and scale until named locations like Goodsprings and Novac landed where they should, that part was never going to happen in a design tool, only against real data.',
          ],
          images: [
            {
              src: getImagePath('/projects/newvegas/figma-map.jpg'),
              badge: 'figma',
              caption: 'The map as designed in Figma',
            },
            {
              // captured at the app's own 784x900 handheld viewport, the same
              // framing as the Figma screen beside it — the older wide capture
              // (mojave-map.jpg, still in /public) was a desktop-width browser
              // shot that letterboxed the app into the middle third, so the
              // pair read as two unrelated images and left a hole in the grid
              src: getImagePath('/projects/newvegas/mojave-map-handheld.jpg'),
              badge: 'built',
              caption: 'The map as shipped, discovered locations marked across the region',
            },
          ],
        },
        {
          heading: 'Designed to be glanced at, not used',
          body: 'The core constraint is that your attention is on the game, not this screen. So status loads first when you open it, since HP and AP are what you check mid-fight, not inventory or the map. Every screen updates on its own over the WebSocket, at whatever rate that data actually needs (player position every 50ms, inventory every 200ms), so there is nothing to pull or refresh. And when you’re in combat, a soft red glow builds at the screen edges instead of a stat you’d have to read, so you can catch it in your peripheral vision without looking away from the game.',
        },
        {
          heading: 'How it works',
          body: 'The catch is that a game from 2010 does not hand you its live state. So there are two halves. A plugin written in C++ runs inside the game through NVSE, the community-built scripting extender most New Vegas mods rely on, and serves the player’s data over a local WebSocket. A web client reads that stream and renders the interface. When your health drops or you pick something up, the plugin sees it and the second screen updates in near real time. Most of the interesting work was on that seam: what data to pull, how often, and how to keep the two in sync without hitching the game.',
        },
        {
          heading: 'Built for two screens',
          body: 'The client is Vue 3 and Vite, wrapped with Capacitor so it ships as both an installable web app (PWA) and an Android APK. I gave it a CRT Pip-Boy look, amber phosphor and scanlines by default, matching New Vegas’s actual in-game color rather than the green most Fallout Pip-Boy clones default to, with green and blue as selectable alternates. The layout is tuned to one fixed viewport, a specific handheld resolution like the AYN Thor, so the stats screen fits without cropping instead of just scaling generically, settling the breakpoints-or-not question the wireframes had left open.',
          images: [
            {
              src: getImagePath('/projects/newvegas/figma-status-amber.png'),
              badge: 'figma',
              caption: 'Amber, the default',
            },
            {
              src: getImagePath('/projects/newvegas/figma-status-green.png'),
              badge: 'figma',
              caption: 'Green, one tap away (blue is the third option)',
            },
          ],
        },
        {
          heading: 'On the actual hardware',
          body: 'This is not a screenshot resized to guess at a phone. It is the actual AYN Thor: New Vegas running on the top screen, the web monitor live on the bottom, both visible at once, tapped with a finger instead of a mouse. Inventory, fast travel, and switching radio stations, all filmed on the device it was built for.',
          videos: [
            {
              src: getImagePath('/projects/newvegas/device-inventory.mp4'),
              badge: 'device',
              poster: getImagePath('/projects/newvegas/poster-inventory.jpg'),
              caption: 'Browsing inventory live on the second screen',
            },
            {
              src: getImagePath('/projects/newvegas/device-map.mp4'),
              badge: 'device',
              poster: getImagePath('/projects/newvegas/poster-map.jpg'),
              caption: 'Fast travel, confirmed with a tap on the actual device',
            },
            {
              src: getImagePath('/projects/newvegas/device-radio.mp4'),
              badge: 'device',
              poster: getImagePath('/projects/newvegas/poster-radio.jpg'),
              hasAudio: true,
              caption: 'Switching radio stations, tap the speaker for sound',
            },
          ],
        },
        {
          heading: 'Looking back',
          body: 'Running the whole process solo, design system through shipped code, taught me how much of a real design-to-code handoff is just decisions staying legible over time. The flow diagram’s open-versus-decided legend is the only reason I could trust a six-week-old decision instead of re-litigating it. If I did this again, I would build the map calibration tooling first instead of last, eyeballing coordinate offsets by hand was the slowest part of the whole project by a wide margin. I would also want to test it with someone who has never played Fallout, since most of my own usability assumptions turned out to just be muscle memory from having played the game myself.',
        },
        {
          heading: 'Credits',
          body: [
            'Built on SkyrimWebMonitor (MIT licensed) by andreyvelsk, which does the same thing for Skyrim. I rebuilt it for New Vegas: a new game plugin, new data models for New Vegas’s stats and items, a new UI, and the Mojave map in place of Skyrim’s.',
            'Icons from game-icons.net, additional Pip-Boy icons from ItsMeJesusHChrist, and Vault Boy art from fluffgar.',
            'Fallout: New Vegas is Bethesda Softworks and Obsidian Entertainment’s. This is an unofficial fan project.',
          ],
        },
      ],
      gallery: [
        {
          src: getImagePath('/projects/newvegas/pipboy-status.png'),
          badge: 'built',
          caption: 'The Pip-Boy status screen: level, health, action points, and SPECIAL stats (the game’s seven core attributes), shown in the app’s demo mode',
        },
        {
          src: getImagePath('/projects/newvegas/inventory.png'),
          badge: 'built',
          caption: 'The inventory tab, listing weapons and ammo with per-item detail',
        },
      ],
    },
    links: {
      live: 'https://niclagr.github.io/NewVegasWebMonitor/',
      repo: 'https://github.com/NicLagr/NewVegasWebMonitor',
    },
  },
  {
    id: 'weather-viz',
    title: 'Weather & Flight Visualization Platform',
    org: 'GE Aerospace · Aerospace Carbon Solutions',
    year: '2026',
    role: 'UX Design & Frontend',
    summary:
      'A real-time 3D weather and flight visualization tool built in Vue 3 and CesiumJS, for domain scientists and aviation partners to read turbulence, wind, and contrail risk the way they actually need to. I owned both the UX and the frontend: running the research that shaped the interface, designing the view modes and layer system, and building the GPU-accelerated visualizations underneath. It started as a week-long hackathon build and grew into five months of ongoing development. It is internal GE Aerospace work, so this is a technical account without internal links or names.',
    highlights: [
      'Facilitated 12 user research sessions over 3 months with domain scientists and aviation partners, directly shaping color gradients and legends, wind barbs, and a dedicated demo mode.',
      'Designed the interaction model for comparing weather data: a 3D globe, a flat map, and a regional zoom view, plus a Compare mode that splits the screen into two independently controlled panels.',
      'Designed a two-tier layer system, a one-click quick bar for common layers and a deeper Layer Manager (opacity, palette, per-layer min/max, particle tuning) for domain-scientist power users.',
      'Adapted Phase, a sibling team’s Figma-only design system, into a working Vue component library, extending it to 11+ components, and built the GPU-accelerated wind-particle engineering underneath it.',
    ],
    tags: ['Vue 3', 'CesiumJS', 'WebGL/GLSL', 'UX Research', 'Design Systems', 'Figma'],
    image: null,
    // No real screenshots (internal/proprietary app) — an abstract wireframe
    // globe stands in instead, so it never reads as an actual screenshot.
    visual: 'globe',
    visualColors: ['#b69dff', '#7aa2ff'],
    accent: 'var(--accent-grad)',
    caseStudy: {
      subtitle: 'A real-time 3D weather and flight visualization tool for domain scientists and aviation partners.',
      sections: [
        {
          heading: 'Mission',
          body: 'Let someone see where a flight is going to hit weather, on a globe, while the weather is still happening.',
        },
        {
          heading: 'Context',
          body: [
            'This began as a week-long hackathon inside GE Aerospace: live weather model data on an interactive 3D globe next to real flight tracking, so people could see where a flight might meet turbulence or the conditions that form contrails.',
            'It got a good reception and turned into five months of development. I was a core developer on the UX and the frontend, and a smaller supporting role on the backend.',
            'Internal GE Aerospace work, so this is an account of the design and the engineering without screenshots or internal names.',
          ],
          stat: {
            value: '259 of 369',
            label: 'frontend commits, about 70 percent, across 26 merged pull requests. I owned the research, the interface and the rendering underneath it.',
          },
        },
        {
          heading: 'Research',
          body: [
            'Most of what shaped the interface came from twelve feedback sessions over about three months with domain scientists and aviation partners, walking them through the app and watching where they got stuck.',
            'Colour gradients and legends on layers like temperature and wind speed were reworked to match how scientists conventionally read that data. I cut the globe and map textures down to the ones that tested well.',
            'A dedicated demo mode came straight out of a session about what the tool needed for executive presentations.',
          ],
        },
        {
          heading: 'User Testing',
          body: [
            'The globe renders wind barbs, the small flagged arrows meteorologists use to read wind speed and direction at a glance, in a grid that thickens or thins as you zoom.',
            'A meteorologist testing the feature caught two things. The first was straightforward: the barbs were too small, and the colour and outline needed more contrast to read at a distance.',
            'The second was a gap in what I knew. Wind barbs flip which side the feathers sit on depending on hemisphere, clockwise in the north, counter-clockwise in the south, so they point toward the centre of a low-pressure system either way. It is how a forecaster spots a storm at a glance.',
            'I had not known the rule existed, so I had built one version for both hemispheres. That is what testing with a real meteorologist is for: catching a domain error I did not know to look for. Getting it wrong in front of one during a customer demo would have cost real credibility.',
          ],
        },
        {
          heading: 'Features',
          body: [
            'Scientists needed to see the data differently depending on the task, so there are three views on the same model: an interactive 3D globe, a flattened world map, and a zoomed regional view.',
            'Compare mode splits the screen into two independent panels, each with its own layer, palette and time control, so someone can put temperature beside wind speed, or one layer at two different times.',
            'The layer system is two tiers. A quick bar gives one-click access to what people reach for constantly. Underneath sits a full Layer Manager, where each active layer carries its own opacity, palette, range and legend chip so several stack and still read.',
          ],
        },
        {
          heading: 'Architecture',
          body: [
            'The particle system runs on the GPU: thousands of streamlines animated across the globe with custom WebGL and GLSL shaders, position and velocity carried in framebuffers rather than JavaScript arrays.',
            'It had to be that fast for a design reason rather than a performance flex. At continent-wide zoom, thousands of particles read as one coherent flow; the same count over a single airport looks sparse and broken. Density scales by the square of the zoom ratio so the visual density holds constant.',
            'The hardest bugs there never threw an error. A GPU resource would be destroyed on window resize while Cesium kept drawing with it every frame, crashing intermittently until I reproduced it by firing synthetic resize events.',
            'Another time a change that should have been free, a smaller intermediate texture, silently stopped rendering anything, because Cesium does not derive a draw command\u2019s viewport from the texture bound to it. Both taught me to trust browser reproduction over static analysis for GPU bugs.',
          ],
        },
        {
          heading: 'Design System',
          body: [
            'The visual design did not start from a blank page. A sibling team had built Phase, a design system in Figma, with colour, spacing and component patterns, but only as static mockups with nothing in code.',
            'I built it into a working Vue component library and extended it to more than eleven real components, drawers, legends, sliders, a flight panel, a vertical profile chart, so both apps shared one visual language.',
            'I also moved raster tile shading into the browser, decoding tiles to raw pixel data and painting them through a palette lookup table, so changing how a layer looks is instant with no extra network requests.',
          ],
        },
        {
          heading: 'Learnings',
          body: [
            'By the time I moved on it had three view modes, a compare mode and 63 renderable weather variables, and it ran in real demos for international airlines.',
            'It is the project that best shows research, design and engineering as one job rather than three. The meteorologist is the reason: no amount of care on my side would have found that bug, because I did not know the rule was there to break.',
          ],
          stat: {
            value: '6s to 13ms',
            label: 'A repeat wind query, after moving tile shading into the browser. Roughly 500 times faster, and the difference between a tool you demo and a tool you use.',
          },
        },
      ],
    },
    links: {},
  },
  {
    id: 'signpost',
    title: 'SIGNPOST',
    org: 'GE Aerospace · Aerospace Carbon Solutions',
    year: '2026',
    role: 'Design & Frontend',
    summary:
      'SIGNPOST is a SaaS tool airlines use to evaluate emissions-reduction tradeoffs across fleet upgrades, sustainable aviation fuel, and carbon removals, built in Vue 3 and TypeScript. I designed every primary page in Figma, from the home dashboard to the scenario-comparison view, working with the product manager and the SaaS team’s UX lead, then carried that design into production myself. It is internal GE Aerospace work, so this is a technical account without internal links or names.',
    highlights: [
      'Designed the Figma mockups for all of SIGNPOST’s primary pages (a home dashboard with a live emissions and regulation news feed and key metrics, the scenario-comparison view, and the rest of the core screens), revised against feedback from the product manager, a data scientist, and the SaaS team’s UX lead.',
      'Brought AI-assisted tools (Figma Make, Claude Code, GitHub Copilot) into that mockup-to-code workflow, cutting revision rounds from 3 to 4 down to 1 to 2 before a feature was dev-ready.',
      'Designed the scenario-comparison feature, emissions and cost outcomes across scenarios shown as both charts and a data table, and scoped its selection cap directly with the product stakeholder instead of guessing.',
      'Took the scenarios table from create-and-view-only to a full 5-action management surface (inspect, edit, duplicate, make-baseline, delete), enforcing baseline-protection rules in the state layer so they cannot be bypassed from any part of the interface.',
    ],
    tags: ['Figma', 'UX Research', 'Design Systems', 'Vue 3', 'TypeScript', 'Pinia'],
    image: null,
    // No real screenshots (internal/proprietary app) — an abstract bars-vs-
    // baseline visual stands in, the app's actual core mechanic.
    visual: 'compare',
    visualColors: ['#b69dff', '#5ee7c6'],
    accent: 'var(--accent-grad)',
    caseStudy: {
      subtitle: 'A SaaS tool airlines use to weigh emissions-reduction tradeoffs across their fleet.',
      sections: [
        {
          heading: 'Mission',
          body: 'Let an airline see what a decision about its fleet costs, in emissions and in money, before it makes it.',
        },
        {
          heading: 'Context',
          body: [
            'GE Aerospace wanted a way for airlines to weigh emissions-reduction tradeoffs: SAF fuel targets, carbon pricing under CORSIA, scope 3 emissions, how fast a fleet upgrades, all measured against a baseline plan.',
            'I designed the first prototype in Figma before any of it existed as code, then built it in Vue 3 and TypeScript with a UK-based engineering team.',
            'Internal GE Aerospace work, so this is an account of the decisions without screenshots or internal names.',
          ],
        },
        {
          heading: 'Design System',
          body: [
            'I designed the Figma mockups for every primary page: a home dashboard with a live emissions and regulation feed and key metrics, the scenario-comparison view, and the rest of the core screens.',
            'They had to align with Phase, the design system shared across GE Aerospace Carbon Solutions, so I revised them against feedback from the product manager, a data scientist and the SaaS team\u2019s UX lead before any of it became code.',
            'I brought Figma Make, Claude Code and GitHub Copilot into the handoff from mockup to working Vue components.',
          ],
          stat: {
            value: '3 or 4 rounds down to 1 or 2',
            label: 'Revision rounds between a Figma page and a working Vue component, after AI-assisted handoff. The design did not change; the distance between design and code did.',
          },
        },
        {
          heading: 'Iteration',
          body: [
            'Design here was not a solo pass. I ran regular sessions with the product manager and other stakeholders as the app took shape.',
            'Once we had a fast prototype we demoed it to a wider group beyond the core team. That wider round is where most of the rough edges got caught.',
          ],
        },
        {
          heading: 'Features',
          body: [
            'Compare puts scenarios against the baseline and shows emissions and cost outcomes side by side, as charts and as a data table, so the tradeoff reads at a glance or in exact numbers.',
            'How many scenarios you could compare at once was not answered anywhere in the ticket, so I raised it with the product stakeholder. We agreed a cap for the first release, a practical scope call rather than a user-tested one, with the baseline included automatically.',
            'Past the cap, checkboxes grey out but stay visible, so people can see what they cannot select instead of watching options disappear. I encoded the limits as named constants so the interface, the validation and the tests all read one source of truth.',
          ],
        },
        {
          heading: 'Architecture',
          body: [
            'Every comparison depends on exactly one baseline scenario existing. Once the table had row-level actions, inspect, edit, duplicate, delete, the baseline could never be deleted or duplicated away.',
            'Disabling those buttons in the interface only holds if every future entry point remembers to check, so I pushed the guard into the state layer and wrote tests that assert it fires.',
            'Partway through, the product direction renamed the app\u2019s core term across navigation, routes, components and types. I split that into two smaller pull requests rather than one rewrite, running the full suite between each, so breakage surfaced early instead of at the end.',
          ],
        },
        {
          heading: 'Learnings',
          body: [
            'This is the clearest example I have of owning something from a Figma file to a shipped product, and of knowing when to ask instead of guess.',
            'Design against real feedback, decide with input, and put the rules that matter where they cannot be bypassed. That is the approach I bring to anything mixing interface decisions with business rules.',
          ],
        },
      ],
    },
    links: {},
  },
  {
    id: 'mission-control',
    title: 'Mission Control 3.0',
    org: 'Tulip Interfaces',
    year: '2025',
    role: 'Primary Developer',
    summary:
      'Real-time monitoring and visualization app built to complement live tours of the Tulip Experience Center for 200+ guests and executives.',
    highlights: [
      'Owned the interface end to end (visual design, data wiring, and deployment) for a live global-activity dashboard, drawing on mission-control layouts and Shopify’s Black Friday globe for scale and feel.',
      'React + Node/Express front to back, backed by AWS Redshift; Helm + Argo CD on Kubernetes cut deploy time 60% at 99.5% uptime.',
      'Vault-managed secrets and TLS via cert-manager, running in production during live executive tours.',
    ],
    tags: ['React', 'Node.js', 'Redshift', 'Kubernetes', 'Argo CD', 'AWS'],
    image: getImagePath('/projects/mission-control/hero-globe.jpg'),
    // the globe sits left-of-center in the source frame; a plain center crop
    // shows the stats panel instead
    mediaPosition: '25% 45%',
    accent: 'var(--accent-grad)',
    video: {
      src: getImagePath('/projects/mission-control/hannover-messe.mp4'),
      end: 67, // relevant showcase runs to ~1:07
      caption: 'Running in the background as Tulip CEO Natan Linder speaks with Bain & Company’s Jörg Gnamm at Hannover Messe.',
      href: 'https://www.linkedin.com/feed/update/urn:li:activity:7452619781264007168/',
    },
    caseStudy: {
      hero: getImagePath('/projects/mission-control/hero-globe.jpg'),
      subtitle: 'A live global-activity dashboard built for executive tours of the Tulip Experience Center.',
      sections: [
        {
          heading: 'The brief',
          body: 'The Tulip Experience Center (TEC) team wanted a better way to show what Tulip is at a glance. Not a slide or a pitch, but something you could stand in front of on a tour, or put on a screen at a show like Hannover Messe, and immediately read the scale and reach of the platform. It landed on me as a co-op on the team, while I was in school for computer science and design. It was the first large project I was given to lead.',
        },
        {
          heading: 'Building the whole thing',
          body: 'I designed and built it. Front end, visual design, data wiring, and deployment all came back to me. I leaned on people in the company when I got stuck: in-house designers for feedback, engineers and product folks for advice, DevOps when I was in over my head. No one else built it. For the feel I looked at a couple of references: mission control dashboard layouts, and Shopify’s live Black Friday globe for a cinematic sense of scale.',
        },
        {
          heading: 'The hard part',
          body: 'The hard part was owning something end to end that I had never done before. The TEC team was small and still forming, so past a weekly check-in I was on my own. No one’s job was to unblock me. I taught myself the parts I had never touched: pulling data out of the company’s databases, and deploying the app inside their system, mostly from documentation. Deployment fought me the whole way. I kept getting held up on security and secrets and told to work it out myself. It took long enough that I carried the deployment past the end of my co-op and finished it while back at Northeastern, working part time as a support engineer.',
        },
        {
          heading: 'Seeing it in use',
          body: 'I always expected to reach an MVP. I did not expect to first see it running live in a LinkedIn post from Hannover Messe, on the screen behind Tulip’s CEO as he talked with Bain about the company’s reach. I built it mostly alone as a student, and that is where I first saw it in the wild. It is still one of the things I am most proud of.',
        },
      ],
      gallery: [
        {
          src: getImagePath('/projects/mission-control/live-globe.png'),
          caption: 'Live events and active interfaces plotted across the globe',
        },
        {
          src: getImagePath('/projects/mission-control/dev-broken.jpg'),
          caption: 'A rendering bug in development, event beams streaking off the globe',
        },
        {
          src: getImagePath('/projects/mission-control/design-1.jpg'),
          caption: 'Early layout in Figma',
        },
      ],
    },
    links: {},
    featured: true,
  },
  {
    id: 'tec-demos',
    title: 'TEC Demo Engineering',
    org: 'Tulip Interfaces',
    year: '2025',
    role: 'UX Engineer',
    summary:
      'Live industrial demos designed around who was touring and what was at stake for them, then engineered to run reliably in front of executives at global tradeshows like IMTS and Automate.',
    highlights: [
      'Read the user story for each tour with the TEC team and sales, then remapped the demo floor around it. For a Schneider Electric visit, that meant sequencing the floor toward a Composable HMI wall curated to put Schneider’s own software front and center.',
      'Designed and built the on-screen operator flow for Tulip’s flagship demo station, running live in front of 1,000+ visitors at IMTS, Pharma MES USA, and Automate.',
      'Integrated hardware (Node-RED, MQTT, OPC-UA) and trained LandingAI/Cognex vision models for real-time defect detection.',
      '“We would not be able to set ourselves apart at these events without you.” (Cailey Watson, Experiential Marketing Manager, Tulip)',
    ],
    tags: ['Experience Design', 'UX Research', 'Node-RED', 'MQTT', 'OPC-UA', 'Cognex', 'LandingAI'],
    image: getImagePath('/projects/tec-demos/automate-demo.jpg'),
    accent: 'var(--accent-grad)',
    caseStudy: {
      hero: getImagePath('/projects/tec-demos/popup-factory.jpg'),
      subtitle: 'Live industrial demos, designed around who was touring and engineered to run in front of executives.',
      sections: [
        {
          heading: 'The job',
          body: 'Tulip runs an Experience Center (TEC) near Boston: a floor of live, working manufacturing demos that customers walk through on tours. I joined the team as a co-op, in school for computer science and design, as the person who built and maintained those demos. I was the engineer and designer behind them, not the one giving the tour. When someone from a large manufacturer stood in front of a station, my job was that it worked, it made sense, and it showed the platform doing something real.',
        },
        {
          heading: 'Learning the stack on a coffee machine',
          body: 'My first build was a smart coffee station. I wired a scale, a smart plug, and a Node-RED flow into a Tulip app so it tracked a pot and posted to Slack when a fresh one was ready. It was small and a little silly, and that was the point. It was how I learned the whole toolchain end to end: hardware in, data through Node-RED, logic and interface in Tulip, output back out. Everything I built after that was the same idea at a larger scale.',
        },
        {
          heading: 'The demos',
          body: [
            'The center of the floor was a pop-up assembly factory. An operator builds a clock at a bench while the station guides every step. Pick-to-light bins show which part to grab, Andon lights show status, a foot pedal and scanner advance the work, and a camera checks the result. Tapping an RFID key switches the whole station between languages on the spot. I built the hardware and the software behind it, and designed the on-screen flow the operator follows.',
            'Around it were the others: a discrete manufacturing kit that counts parts in a bin with machine vision, a Composable HMI wall of stacked touchscreens, and portable travel kits for life sciences shows, including a Wave Bioreactor workflow. I trained the vision models, wired the hardware over Node-RED, MQTT, and OPC-UA, and built the interfaces on top. The bigger set-pieces, like the Automate 2025 hardware wall and the Composable HMI wall, were team builds I worked on. The pop-up factory and the pharma travel kits were mine to own.',
          ],
        },
        {
          heading: 'Reading the room before the tour',
          body: [
            'Every tour started with a user story that wasn’t just mine. The TEC team built it together with whoever inside Tulip had a stake in the visit, usually sales or marketing, who knew exactly who was walking in and what deal was on the line. Our job was turning that into an actual floor: what someone sees first, what convinces them, what proves it.',
            'For a Schneider Electric visit, the story we planned around read something like: "As a Schneider digital transformation lead touring with a small group of executives and engineers, I want to see whether Tulip can integrate with our existing HMI investment and optimize runtime on our factory floors, so I can build the case for a deal internally."',
            'That story is what put the Composable HMI wall at the center of the floor. I ran Tulip next to Schneider’s own software and its direct competitors there, partly to prove real interoperability, partly as a plain sales tactic: if the room saw peers already doing this, staying out felt like the bigger risk. We built the rest of the floor toward that wall, product first, then the floor in action, then the wall, and walked the layout past CEO Natan Linder during setup, who gave feedback before leading the tour himself.',
            'A similar tour ran for a visiting delegation from Mitsubishi Electric: senior executives who had flown in from Japan, along with engineers. The visit centered on strategic fit. Mitsubishi was evaluating Tulip’s composable, no-code platform as a way to accelerate their own digital transformation and bring AI-powered applications to frontline manufacturing at scale. We ran the floor the way we normally would, and leaned into the pieces that spoke directly to that: the composable app architecture, and how the same underlying platform scales from one line to a global footprint.',
            'Mitsubishi signed a strategic alliance and invested in Tulip a while after that visit, in a deal that helped push the company to unicorn status. That decision came from well above any single tour. It is the kind of account the Experience Center was built to support, and this was one of the visits I helped design and run.',
          ],
        },
        {
          heading: 'Making it hold up in front of people',
          body: 'A demo is only useful if it works the moment a customer is standing there. Most of the job was reliability: building stations that could be moved, set up fast, and run for days, then being on the floor at the center when they ran to fix anything on the spot. I did not travel with the demos. I built them to ship, and gave live help remotely when one was out at a show like Automate 2025 in Detroit or Pharma MES USA in Boston and something went wrong. Hardware demos fail in boring, physical ways, a loose cable, a camera in bad light, a device that drops off the network, and the work was catching those before a visitor did.',
        },
        {
          heading: 'What I took from it',
          body: 'It taught me to build things that survive contact with real users and messy conditions, not a clean demo running only on my own screen. It was also the first time I put hardware, data, and interface together into one thing someone could walk up to and understand, which is still how I like to work.',
        },
      ],
      quote: {
        text: 'We would not be able to set ourselves apart at these events without you.',
        author: 'Cailey Watson',
        role: 'Experiential Marketing Manager, Tulip',
      },
      gallery: [
        {
          src: getImagePath('/projects/tec-demos/automate-demo.jpg'),
          caption: 'Machine-vision part counting on the hardware wall, shown at Automate 2025 in Detroit',
        },
        {
          src: getImagePath('/projects/tec-demos/hardware-wall.jpg'),
          caption: 'The Composable HMI wall, a mobile rack of stacked Tulip interfaces',
        },
        {
          src: getImagePath('/projects/tec-demos/pharma-kit.jpg'),
          caption: 'A life sciences travel kit at a pharma tradeshow, built around a Wave Bioreactor workflow',
        },
      ],
    },
    links: { live: 'https://tulip.co/tec-virtual-tour/' },
    featured: true,
  },
  {
    id: 'portfolio',
    title: 'This Portfolio',
    org: 'Personal',
    year: '2026',
    role: 'Design & Engineering',
    summary:
      'I grew up in awe of console interfaces, and what stayed with me was how much a single object could hold. So this portfolio is one glass object you turn and open rather than a page you scroll, tuned to feel otherworldly but not cold. It is my attempt to show, not tell, how I think software should feel to use.',
    highlights: [
      'Designed a single interaction model, a glass cube whose faces map to the site’s sections, as an alternative to a typical scrolling homepage, with an accessible fallback for reduced motion and lower-powered devices.',
      'Rebuilt the information hierarchy after a critical self-review: cut a 3D avatar, a decorative color system, and a skills-chip list that read as generic, and rewrote case-study copy across the site for a reader skimming in under two minutes.',
      'Hand-built design system (tokens + primitives) in React, Tailwind, and Framer Motion, tuned to high Lighthouse scores.',
    ],
    tags: ['React', 'Three.js', 'Tailwind', 'Framer Motion', 'Design System'],
    image: getImagePath('/projects/portfolio/hero.jpg'),
    // pre-cropped wide band around the cube itself — the square source shows
    // mostly empty space above/below it once forced into the wide Work row
    rowMedia: getImagePath('/projects/portfolio/hero-wide.jpg'),
    accent: 'var(--accent-grad)',
    caseStudy: {
      subtitle: 'A portfolio built as a single glass object you can turn and open.',
      sections: [
        {
          heading: 'Mission',
          body: 'Make a portfolio you move through like an object, rather than a page you scroll.',
        },
        {
          heading: 'Context',
          body: [
            'I grew up in awe of console interfaces. The GameCube and PlayStation menus were ethereal and otherworldly. The Wii, 3DS and Wii U were welcoming and comfy, a second home to sit in.',
            'They had character, and they showed me what interface can do beyond working: what it can make you feel, what it can express, where it can make you feel you are.',
            'That is the part of this work I care about most, so I wanted the site to carry it rather than describe it. Screenshots argue that I can make things. An interface you move through argues it directly, and it can only do that if it moves, responds, and has a register of its own.',
            'So this is not a scrolling homepage. Everything routes through one glass object you turn and open, and each face is a section.',
          ],
        },
        {
          heading: 'References',
          body: [
            'The GameCube boot menu is a rotating cube you aim at. Everything lives on its faces and turning it is the navigation, which is the whole interaction this site is built on.',
            'The XMB gave the backdrop: a deep indigo field with a slow wave behind it, and the sense of space around the object.',
            'The Wii and 3DS menus gave the pace, the rounded shapes and the sound. I took the tempo from them without taking the warmth.',
          ],
          images: [
            { src: getImagePath('/projects/portfolio/ref-gamecube.gif'), maxWidth: 440, caption: 'Nintendo GameCube boot menu, 2001. Four options on the edges of a turning translucent cube, aimed by direction' },
          ],
        },
        {
          heading: 'Planning',
          body: [
            'The references are in the file with what each one is for, rather than as a wall of images. A moodboard records a feeling; this had to record a decision.',
            'From there: the interaction map, the five people the site is for, and the three levels the cube has to support.',
          ],
          image: { src: getImagePath('/projects/portfolio/plan-flow.png'), badge: { kind: 'figma', label: 'Figma \u00b7 Planning' }, maxWidth: 760, caption: 'References, the interaction map, and the five people the site is for' },
        },
        {
          heading: 'Design Pillars',
          body: [
            'Awe over comfort. A portfolio is not something anyone opens a thousand times the way they boot a home console, so it does not need to earn that kind of familiarity. It gets one good look, maybe a few, and awe does more for that than comfort would.',
            'Calm, so the strangeness does not turn cold. The tuning keeps the eerie side from tipping into hostile, so the site reads as considered rather than just odd. It is a different calm from the Wii\u2019s: the stillness of a room you are not at home in yet, rather than the comfort of one you know.',
            'Tactile. Everything answers when you touch it: the cube turns under a drag, a face ticks as you aim it, and picking something dives through the glass rather than cutting to it.',
          ],
        },
        {
          heading: 'Features',
          body: [
            'Three levels, and Back steps out one at a time. Aim a face on the cube. Open it, and a short menu renders inside the glass. Pick an item and it dives through the face into a full-res page.',
            'Work, About, Play and Contact are aimed by direction rather than picked off a list, because there is no nav bar anywhere on this site. About is the one face that skips the menu and goes straight to a page.',
            'A 3D console is a bad idea for anyone on a weak device, without WebGL, or with motion sensitivity on. The site checks all three before it ever loads the cube and falls back to a plain scrolling page with the same content in the same order. Nobody gets less information, just a different way through it.',
          ],
          imagesStack: true,
          images: [
            { src: getImagePath('/projects/portfolio/wire-level1.png'), badge: { kind: 'figma', label: 'Figma \u00b7 Wireframe' }, maxWidth: 760, caption: 'Level 1. Faces drawn unfolded for clarity, but on screen they are sides of the cube, aimed by direction' },
            { src: getImagePath('/projects/portfolio/wire-level2.png'), badge: { kind: 'figma', label: 'Figma \u00b7 Wireframe' }, maxWidth: 760, caption: 'Level 2. The menu renders inside the glass. There is no list screen between the cube and a page' },
            { src: getImagePath('/projects/portfolio/wire-level3.png'), badge: { kind: 'figma', label: 'Figma \u00b7 Wireframe' }, maxWidth: 760, caption: 'Level 3. Whatever the menu pointed at: a project, a game, or About' },
          ],
        },
        {
          heading: 'Design System',
          body: [
            'One ink at three opacities rather than three greys, so text recedes without changing colour. Glass is white over the backdrop rather than a flat fill, which is why it picks up whatever is behind it.',
            'A single mint accent, so the site has a colour instead of a palette. Radii and spacing sit on a 4px base, and body text has a floor.',
          ],
          image: { src: getImagePath('/projects/portfolio/plan-foundations.png'), badge: 'figma', maxWidth: 740, caption: 'The tokens the build works from, with the exact values rather than an impression of them' },
        },
        {
          heading: 'Components',
          body: [
            'The parts are specified rather than drawn as finished screens. That is deliberate: the front door is a moving object, and a flat frame of it would be a picture of something this site is not.',
            'So the file describes the pieces exactly and lets the wireframes carry the structure, which between them say more than a hi-fi mock of a cube could.',
          ],
          image: { src: getImagePath('/projects/portfolio/plan-components.png'), badge: 'figma', maxWidth: 740, caption: 'Buttons, chips, provenance badges, index rows, stat callouts and project cards, each a variant set' },
        },
        {
          heading: 'Iteration',
          body: [
            'The first pass reached for the warmer half of what I grew up with: soft shapes, a friendlier palette, more to poke at. It made the site pleasant and forgettable, and it fought the register I had already written down.',
            'More went than arrived. A floating 3D bust on About with orbiting caption panels, a cat mascot as an easter egg, and a five-colour gradient across every card and glow. Direct feedback that it read as generic, and a little AI-generated, settled it.',
            'All of it came out, down to one accent colour and the cube as the only flourish. Everything cut was a good idea on its own, which is what made them hard to lose and why writing the register down first mattered.',
            'The Toolkit chip list went too. In an age where picking up a new tool is expected, a row of technology names next to my own was doing less work than showing what I had built with them.',
          ],
        },
        {
          heading: 'Simulated Testing',
          body: [
            'There was nobody to test this on yet, so I tried an experiment: I had an AI play a hiring manager scanning 150 portfolios at 90 seconds each, scoring against criteria I set, like time to impact and whether the process behind a project was legible.',
            'I wanted to know whether that could do useful work in the stage before a real user, when the thing is too rough to put in front of anyone and you still want a reason to change it.',
            'It found two real problems. The desktop hero hid my name and role behind a blind click, and project highlights read as pure tech stack with no visible design judgment.',
            'The hero now says who I am before asking for a click, and the highlights on the two most engineering-heavy projects lead with decisions instead of tools.',
            'It catches the obvious things early, which is what I asked of it. Watching a real person struggle is a different instrument, and I would want that before anything important shipped.',
          ],
          image: { src: getImagePath('/projects/portfolio/wire-casestudy.png'), badge: { kind: 'figma', label: 'Figma \u00b7 Wireframe' }, maxWidth: 760, caption: 'The reading layout that came out of it: an index rail, one column, and inactive sections receding so the one you are on holds attention' },
        },
        {
          heading: 'Learnings',
          body: [
            'Naming the feeling first made every later decision easy. Once "otherworldly, but not cold" was written down, the bust and the mascot and the five-colour gradient were obviously wrong, and cutting them took an afternoon instead of an argument.',
            'The register I landed on is a quieter thing than the consoles that started it. Not the comfort of a room you know, more the stillness of one you are not fully at home in yet.',
          ],
        },
      ],
    },
    links: { repo: 'https://github.com/NicLagr/NicLagr.github.io' },
  },
];
