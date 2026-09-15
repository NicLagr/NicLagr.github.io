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
      sections: [
        {
          heading: 'The job',
          body: 'This started as a week-long hackathon inside GE Aerospace: live weather model data on an interactive 3D globe next to real flight tracking, so people could see where a flight might hit turbulence or conditions that form contrails. It got a good reception and turned into five months of ongoing development. I was a core developer on both the UX and the frontend, writing 259 of 369 frontend commits (about 70%) across 26 merged pull requests, plus a smaller supporting role on the backend.',
        },
        {
          heading: 'Twelve conversations with the people who’d use it',
          body: 'Most of what shaped the interface came from twelve feedback sessions over about three months with domain scientists and aviation partners, walking them through the app and watching where they got stuck. The color gradients and legends on layers like temperature and wind speed got reworked to match how scientists conventionally read that data. I cut the globe and map textures down to whichever ones tested well, and a dedicated demo mode came out of a session about what the tool needed for executive presentations.',
        },
        {
          heading: 'What a meteorologist caught',
          body: 'The globe also renders wind barbs, the small flagged arrows meteorologists use to read wind speed and direction at a glance, arranged in a grid that gets denser or sparser as you zoom. A meteorologist testing the feature in one of those sessions caught two things. The first was straightforward: the barbs were too small, and the color and outline needed more contrast to read clearly at a distance, so I fixed the size, color, and outline weight. The second was a real gap in what I knew. Wind barbs are supposed to flip which side the feathers sit on depending on hemisphere, clockwise in the Northern Hemisphere, counter-clockwise in the Southern, because that convention makes them point toward the center of a low-pressure system either way. It is how a forecaster spots a storm system at a glance. My implementation did not do this. I had not known the rule existed, so I had built one version for both hemispheres. That is exactly what testing with a real meteorologist is for, catching a domain error I did not know to look for on my own. I fixed the orientation logic, and it mattered beyond just being correct: getting it wrong in front of an actual meteorologist during a customer demo would have cost real credibility.',
        },
        {
          heading: 'Multiple ways to look at the same data',
          body: 'Scientists needed to see the data differently depending on the task, so the app has three views on the same underlying model: an interactive 3D globe, a flattened world map, and a zoomed regional view. I also designed a Compare mode, a toggle in the layer manager that splits the screen into two independent panels, each with its own layer, palette, and time control, so someone can put temperature next to wind speed, or the same layer at two different times, side by side.',
        },
        {
          heading: 'A quick bar and a deep end',
          body: 'A domain scientist tuning a model needs different things than someone checking today’s turbulence forecast, so I split the layer system into two tiers. A quick bar gives one-click access to the layers people reach for constantly: temperature, winds, turbulence, contrails, aerosols, satellite. Underneath sits a full Layer Manager, where each active layer gets its own opacity, color palette, and min/max range, plus a legend chip so several layers stack and read at once. The wind particle layer also gets its own settings panel, speed, trail length, line width, density, color mode, response, for people who wanted to tune the animation instead of just switching it on.',
        },
        {
          heading: 'The wind particle system',
          body: [
            'The particle system runs on the GPU: thousands of streamlines animated across the globe with custom WebGL and GLSL shaders, particle position and velocity carried in GPU framebuffers instead of JavaScript arrays. It needed to be that fast for a UX reason, not a performance flex: at a continent-wide zoom, thousands of particles should read as one coherent flow, but the same count zoomed into a single airport looks sparse and broken. Zoom-adaptive density fixes that, scaling particle count by the square of the zoom ratio so the visual density stays constant.',
            'Some of the hardest bugs in that system never threw an error. A GPU resource would get destroyed on window resize, but Cesium kept drawing with it every frame, crashing intermittently until I reproduced it by firing synthetic resize events. Another time, a performance change that should have been free (a smaller intermediate texture) silently stopped rendering anything, because Cesium does not auto-derive a draw command’s viewport from the texture it is bound to. Both taught me to trust browser reproduction over static analysis for GPU bugs.',
          ],
        },
        {
          heading: 'A shared design system, and where it landed',
          body: [
            'The visual design didn’t start from a blank page. A sibling team had already built Phase, a design system in Figma, color and spacing decisions, component patterns, but only as static mockups, nothing in code. I built it into a working Vue component library, extending it to 11+ real components (drawers, legends, sliders, a flight panel, a vertical profile chart) so both apps shared one visual language. I also moved raster tile shading (color ramps, opacity, thresholds) into the browser, decoding tiles to raw pixel data and painting them through a palette lookup table, so changing how a layer looks is instant with no extra network requests.',
            'By the time I moved on, it had three view modes, a compare mode, 63 renderable weather variables, and a repeat wind query down from 6 seconds to 10 to 13 milliseconds. It ran in real demos for international airlines, and it’s the project that best shows research, design, and engineering working as one thing.',
          ],
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
      sections: [
        {
          heading: 'The brief',
          body: 'GE Aerospace wanted a way for airlines to evaluate emissions-reduction tradeoffs (SAF fuel targets, carbon pricing under CORSIA, scope 3 emissions, how fast a fleet upgrades) and see how they compare against a baseline plan. I designed the first prototype in Figma before any of it existed as code, then built it in Vue 3 and TypeScript with a UK-based engineering team.',
        },
        {
          heading: 'Designing every page before writing a line of code',
          body: 'I designed the Figma mockups for all of SIGNPOST’s primary pages myself: a home dashboard with a live emissions and regulation news feed and key metrics, the scenario-comparison view, and the rest of the core screens. They had to align with Phase, the design system shared across GE Aerospace Carbon Solutions’ apps, so I revised them against feedback from the product manager, a data scientist, and the SaaS team’s UX lead before any of it became code. I also brought AI-assisted tools, Figma Make, Claude Code, GitHub Copilot, into the handoff to working Vue components, cutting revision rounds from 3 or 4 down to 1 or 2.',
        },
        {
          heading: 'Regular check-ins, and a prototype demoed wide',
          body: 'Design here wasn’t a solo pass. I ran regular sessions with the product manager and other stakeholders as the app took shape, and once we had a fast prototype we demoed it to a wider group beyond the core team. That wider round of demos is where most of the rough edges got caught.',
        },
        {
          heading: 'Designing the comparison view',
          body: 'The compare feature let someone put scenarios up against the baseline and see emissions and cost outcomes side by side, as charts and a data table, so the tradeoffs read clearly at a glance or in exact numbers. How many scenarios you could compare at once wasn’t answered anywhere in the ticket, so I raised it with the product stakeholder. We agreed on a cap for the first release, a practical scope call rather than a user-tested one, with the baseline included automatically. Past the cap, checkboxes grayed out but stayed visible, so people could see what they couldn’t select instead of watching options disappear. I encoded the limits as named constants so the interface, validation, and tests all reference one source of truth.',
        },
        {
          heading: 'Two engineering guardrails',
          body: [
            'Every comparison depends on exactly one baseline scenario existing, so once the table had row-level actions (inspect, edit, duplicate, delete), the baseline could never be deleted or duplicated away. Disabling those buttons in the interface only holds if every future entry point remembers to check, so I pushed the guard into the state layer and wrote tests that assert it fires.',
            'Partway through, the product direction renamed the app’s core term across navigation, routes, components, and types. I split that into two smaller pull requests instead of one large rewrite, running the full test suite between each step, so I caught breakage early instead of at the end of a riskier single change.',
          ],
        },
        {
          heading: 'What it taught me',
          body: 'This is the clearest example I have of owning something from a Figma file to a shipped product, and of knowing when to ask instead of guess. Design against real feedback, decide with input, and put the rules that matter where they can’t be bypassed: that’s the approach I bring to anything mixing interface decisions with business rules.',
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
    id: 'jewelry-crm',
    title: 'Jewelry Store CRM',
    org: 'Independent',
    year: '2026',
    role: 'Solo · Design + Full-Stack',
    summary:
      'An iPad CRM and repair tracker running in a working jewelry store. Staff move each job across a Kanban board, snap photos of pieces at drop-off, and pull up customers right from the counter.',
    highlights: [
      'In daily use at a real store, with the workflow shaped by watching staff use it: a hover-only edit button became permanently visible, and a number input that fought against typing prices became plain text.',
      'Kanban board from intake to pickup, a quick multi-step ticket flow, customer directory, and global search.',
      'Next.js 15 and React 19 in TypeScript, Tailwind v4, and Prisma, with role-based logins.',
    ],
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Prisma'],
    image: getImagePath('/projects/jewelry-crm/repair-board.png'),
    accent: 'var(--accent-grad)',
    caseStudy: {
      sections: [
        {
          heading: 'The problem',
          body: 'A local jewelry store was running repairs and customers on paper and memory. A piece comes in for repair and it needs a ticket, a photo, a customer attached to it, and a clear place in the queue from drop-off to pickup. That is easy to lose track of on a busy counter. They needed something a staff member could actually use mid-conversation with a customer, on an iPad, without slowing the interaction down.',
        },
        {
          heading: 'What I built',
          body: 'I designed and built the whole thing myself, front to back. It is a CRM and repair tracker built around a Kanban board: every job moves across columns from intake to pickup, so anyone can see the state of the shop at a glance. Creating a ticket is a short multi-step flow, you snap photos of the piece at drop-off, attach a customer, and it lands on the board. There is a customer directory and a global search so staff can pull someone up right from the counter.',
        },
        {
          heading: 'Design and stack',
          body: 'I designed it iPad-first, since that is where it lives, on a counter with a customer standing in front of it. Under the hood it is Next.js 15 and React 19 in TypeScript, Tailwind v4 for the interface, and Prisma for the data, with role-based logins so staff and owner each see the right things. I owned the UX, the interface, the data model, and the backend.',
        },
        {
          heading: 'What iPad-first actually meant',
          body: 'Some of what that meant only became obvious once real hands were on the screen. The job number’s edit button only appeared on hover, fine with a mouse, invisible on a touchscreen with no hover state. Watching staff hunt for it, I made it permanently visible. The price field started as a number input with spinner arrows that reformatted the value on every keystroke, so typing a price felt like fighting the field. I replaced it with a plain text input that only reformats once you tap away, so it types the way someone actually types a price.',
        },
        {
          heading: 'A promise date that wasn’t always a promise',
          body: [
            'The promised pickup date started out required, which made sense until a piece needed assessment before anyone could promise a turnaround, and staff were stuck entering a placeholder date just to get past the form. The owner asked me to fix it, so I made it optional. The first pass just dropped the requirement without saying it was optional, so I added an explicit "(optional)" label, a way to clear the date, and a plain sentence on when it shows up in a customer text, replacing an amber warning box.',
            'The completed-ticket label went through its own loop. A finished ticket first showed just the completion date, but staff also needed to see it against the original promise, so I added that back in parentheses. The first version read "Completed: [date] (was [date])," and "was" read as ambiguous enough that I changed it to "Promised."',
          ],
        },
        {
          heading: 'In daily use',
          body: 'This runs in a real store, and it didn’t stay static after launch. The Kanban board shipped first with a note saying drag-and-drop wasn’t implemented yet, click a card to change its status. Once the core flow was proven, I added real drag-and-drop. Search had a similar arc: results first got squeezed into the same four-column layout, confusing to scan, so I gave search its own flat list view. None of these were big rewrites, they were the kind of small correction you only find by watching someone use the thing every day.',
        },
      ],
      gallery: [
        {
          src: getImagePath('/projects/jewelry-crm/repair-board.png'),
          caption: 'The repair board, tracking each job from intake to pickup',
        },
        {
          src: getImagePath('/projects/jewelry-crm/intake-flow.png'),
          caption: 'The multi-step flow for logging a new repair at drop-off',
        },
        {
          src: getImagePath('/projects/jewelry-crm/customer-directory.png'),
          caption: 'The customer directory, searchable from the counter',
        },
        {
          src: getImagePath('/projects/jewelry-crm/figma-intake.png'),
          caption: 'The intake screen from the Figma design, with a line-item service builder and quick promised-date presets',
        },
        {
          src: getImagePath('/projects/jewelry-crm/figma-reports.png'),
          caption: 'A reports and analytics view from the Figma design, planned beyond the current build',
        },
      ],
    },
    links: { repo: 'https://github.com/NicLagr/Jewelry-RCM-App' },
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
    id: 'nurture-nest',
    title: 'Nurture Nest',
    org: 'Innovators for Global Health',
    year: '2025',
    role: 'UX & Frontend',
    summary:
      'Mobile-first maternal-health app with flows for tracking, alerts, and education, designed for accessibility in rural communities.',
    highlights: [
      'Collaborated on UX design in Figma and React frontend.',
      'Accessibility-first, mobile-first patterns for low-bandwidth contexts.',
      'Presented the working prototype at Northeastern’s RISE expo, funded by a PEAK Experience Award.',
    ],
    tags: ['Figma', 'React', 'UX', 'Accessibility', 'Healthcare'],
    image: getImagePath('/projects/nurture-nest/app-screens.jpg'),
    accent: 'var(--accent-grad)',
    caseStudy: {
      sections: [
        {
          heading: 'The problem',
          body: 'Nurture Nest is a mobile app for maternal mental health in rural Ghana, where postpartum depression and anxiety are common and access to care is thin. Stigma, distance, and a shortage of professionals keep a lot of women from getting help. The idea was a phone app that could screen for risk, track how someone is doing, and point them to real local resources, built for that context rather than ported from a Western health app.',
        },
        {
          heading: 'The team and my part',
          body: 'It was a student project through Innovators for Global Health, in partnership with the Dwenase Health Centre in Ghana. We split into two teams: a clinical content team that owned the medical and cultural side, and a tech team that built the app. I was on the tech team, doing UX design and frontend. I built the user flows and wireframes in Figma and implemented the interface in React Native and Expo. The screening tools, translations, and clinical content came from the content team and our partners in Ghana. I designed and built around what they defined.',
        },
        {
          heading: 'Designing for the context',
          body: [
            'The constraints drove the design. It had to work on modest phones and hold up offline, since a connection is not a given. It had to read clearly for someone who may not use apps much, so I kept flows short and the language plain. And it had to fit the culture it was for, including Twi translations, not an English app with a different flag on it.',
            'The app came down to four things a user needs: a home screen with a due-date countdown and a mood and wellbeing tracker, a screening survey built on standard tools (PHQ-9, EPDS, GAD-7), a directory of medical, mental health, and emergency contacts, and a set of postpartum resources.',
          ],
        },
        {
          heading: 'Where it got to',
          body: 'We took it through research and design into a working prototype and presented it at Northeastern’s RISE expo, with funding from a PEAK Experience Award. The plan from there was on-site testing at the Dwenase Health Centre and a public release, so the next real test was always going to be whether it held up with the women it was actually for, not with us.',
        },
      ],
      gallery: [
        {
          src: getImagePath('/projects/nurture-nest/app-screens.jpg'),
          caption: 'The home screen and weekly wellness tracker, with symptom logging, appointment reminders, and a color-coded symptom key',
        },
        {
          src: getImagePath('/projects/nurture-nest/research-poster.jpg'),
          caption: 'Research poster presented at Northeastern’s RISE expo, covering the problem, process, and app design',
        },
      ],
    },
    links: {},
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
      'Designed status as the default view, since HP and AP are what you check first mid-fight, with every screen auto-updating over WebSocket so it works as a glance, not an app you operate.',
      'Built a peripheral combat indicator, a soft glow at the screen edges when you’re in a fight, since your eyes are on the game, not this screen.',
      'Redesigned marker placement after the first version (long-press) fought with the map’s own pan gesture; replaced it with a fixed reticle you aim by panning underneath it.',
      'Wrote a C++ NVSE plugin serving player data over a local WebSocket, and a Vue 3 + Capacitor client tuned to fit specific handheld resolutions without cropping.',
    ],
    tags: ['UX Design', 'Vue 3', 'TypeScript', 'C++', 'WebSocket', 'PWA', 'Capacitor'],
    image: getImagePath('/projects/newvegas/pipboy-status.png'),
    // the Work row is extremely wide-and-short, so a plain cover-crop of the
    // full screenshot only ever shows a thin sliver (just the forehead) —
    // this is a pre-cropped, already-framed band around the vault boy instead
    rowMedia: getImagePath('/projects/newvegas/pipboy-status-wide.jpg'),
    accent: 'var(--accent-grad)',
    caseStudy: {
      sections: [
        {
          heading: 'The idea',
          body: 'Fallout: New Vegas has a wrist computer called the Pip-Boy that holds your stats, inventory, and map. New Vegas Web Monitor takes that out of the game and puts it on a second screen. You play on your main display, and your phone or a second monitor becomes a live Pip-Boy: status, inventory, and the Mojave map, updating as you play. I built it mostly for dual-screen handhelds, where there is a second panel sitting right there doing nothing.',
        },
        {
          heading: 'Designed to be glanced at, not used',
          body: 'The core constraint is that your attention is on the game, not this screen. So status loads first when you open it, since HP and AP are what you check mid-fight, not inventory or the map. Every screen updates on its own over the WebSocket, at whatever rate that data actually needs (player position every 50ms, inventory every 200ms), so there is nothing to pull or refresh. And when you’re in combat, a soft red glow builds at the screen edges instead of a stat you’d have to read, so you can catch it in your peripheral vision without looking away from the game.',
        },
        {
          heading: 'How it works',
          body: 'The catch is that a game from 2010 does not hand you its live state. So there are two halves. A plugin written in C++ runs inside the game through NVSE and serves the player’s data over a local WebSocket. A web client reads that stream and renders the interface. When your health drops or you pick something up, the plugin sees it and the second screen updates in near real time. Most of the interesting work was on that seam: what data to pull, how often, and how to keep the two in sync without hitching the game.',
        },
        {
          heading: 'Getting the map right',
          body: 'The map went through a real redesign. The first version let you drop a custom marker with a long press, but that fought with the map’s own pan gesture, since the same finger motion that pans the map can register as a hold. I replaced it with a fixed reticle at the center of the screen: you pan the map under it and tap to drop a marker there, so placing a pin never competes with moving around. It also has a follow-mode that recenters on your live position, and turns itself off the moment you pan or zoom manually, so it never fights you for control of the view. Calibrating the map itself, matching real in-game coordinates to the static Mojave image, took several passes of nudging the offset and scale until named locations like Goodsprings and Novac landed where they should.',
        },
        {
          heading: 'Built for two screens',
          body: 'The client is Vue 3 and Vite, wrapped with Capacitor so it ships as both an installable web app (PWA) and an Android APK. I gave it a CRT Pip-Boy look, amber phosphor and scanlines by default, matching New Vegas’s actual in-game color rather than the green most Fallout Pip-Boy clones default to, with green and blue as selectable alternates. The layout is tuned to specific handheld resolutions, like the AYN Thor, so the stats screen fits without cropping instead of just scaling generically.',
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
          caption: 'The Pip-Boy status screen: level, health, action points, and SPECIAL stats, shown in the app’s demo mode',
        },
        {
          src: getImagePath('/projects/newvegas/inventory.png'),
          caption: 'The inventory tab, listing weapons and ammo with per-item detail',
        },
        {
          src: getImagePath('/projects/newvegas/mojave-map.jpg'),
          caption: 'The Mojave Wasteland map, with discovered locations marked across the region',
        },
      ],
    },
    links: {
      live: 'https://niclagr.github.io/NewVegasWebMonitor/',
      repo: 'https://github.com/NicLagr/NewVegasWebMonitor',
    },
  },
  {
    id: 'portfolio',
    title: 'This Portfolio',
    org: 'Personal',
    year: '2026',
    role: 'Design & Engineering',
    summary:
      'I wanted this portfolio to feel like something you pick up and play with. I grew up on game consoles, and what stayed with me was how their menus made moving around feel alive. So I built everything around a single glass object you can turn and open, tuned to feel calm, tactile, and a little curious. It’s my attempt to show, not tell, how I think software should feel to use.',
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
      sections: [
        {
          heading: 'The idea',
          body: 'I grew up on game console menus, and what stuck with me was how much a single object could hold. Turn a menu, and a whole different set of options appears, instead of paging through flat screens. I wanted this portfolio to work the same way, so instead of a typical scrolling homepage, everything routes through one glass object you can turn and open. Each face maps to a section, Work, About, Play, Contact, and clicking or dragging is the entire navigation model.',
        },
        {
          heading: 'Building it to work for everyone',
          body: 'A 3D cube console is delightful on a laptop with a GPU and full motion, and a bad idea for anyone on a low-powered device, without WebGL, or who has motion sensitivity turned on. So the site checks for prefers-reduced-motion and WebGL support before ever loading the cube, and falls back to a plain scrolling page with the same content and section order. Nobody gets a degraded version of the information, just a different way of moving through it.',
        },
        {
          heading: 'Cutting what didn’t earn its place',
          body: 'The first version had more going on: a floating 3D bust on the About page with orbiting caption panels, a cat mascot as an easter egg, and a five-color gradient aesthetic across every card and glow effect. After sitting on it for a while, and after direct feedback that it read as generic and a little AI-generated, I cut all of it, the bust, the mascot, most of the decorative gradients, down to one signature accent color and the cube itself as the one flourish. I also pulled an entire Toolkit chip list off the About page. In an age where picking up a new tool is expected, a list of technology names next to my name was doing less work than just showing what I’ve actually built with them.',
        },
        {
          heading: 'Treating the site as its own case study',
          body: 'Once the content was in place, I ran the site through a round of user research: a review simulating a hiring manager scanning 150 portfolios in 90 seconds each, checked against specific criteria like time-to-impact and process legibility. That surfaced real problems. A desktop hero hid my name and role behind a blind click, and project highlights read as pure tech stack with no visible design judgment. I rewrote both. The hero now shows who I am before asking for a click, and highlights across the two most engineering-heavy projects now lead with the design decisions I made, not just the tools I used to build them.',
        },
      ],
    },
    links: { repo: 'https://github.com/NicLagr/NicLagr.github.io' },
  },
];
