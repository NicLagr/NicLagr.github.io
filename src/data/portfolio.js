// Liquid Glass portfolio — concise, presentation-ready content model.
// Source of truth: Resume_Final_Reviewed (kept in sync).
import { getImagePath } from '../utils/imagePath';

export const profile = {
  name: 'Nicolò Lagravinese',
  role: 'Frontend Developer & UX Designer',
  tagline:
    'I build interfaces that feel good to use and design the experience around them. The backend, infrastructure, and hardware are things I reach for when a project needs them, not where I live.',
  location: 'Boston, MA',
  availability: 'Open to full-time, available January 2027',
  email: 'nlagravinese@gmail.com',
  links: {
    github: 'https://github.com/NicLagr',
    linkedin: 'https://www.linkedin.com/in/nicolo-lagravinese/',
    resume: process.env.PUBLIC_URL + '/Resume_Final_Reviewed.pdf',
  },
};

export const education = {
  school: 'Northeastern University · Khoury College of Computer Sciences',
  degree: 'B.S. Computer Science & Interaction Design · Minor in History',
  dates: 'Expected Dec 2026',
  detail: 'Dean’s List · GPA 3.6 · Boston, MA',
};

export const about = {
  bio: [
    'I work in software and user experience, focused on the side people actually touch. I came up modding my games and hardware to do more than they shipped with, and I still build that way. Right now I’m studying CS and Interaction Design at Northeastern and doing frontend and UX at GE Aerospace.',
  ],
  // Frontend & UX is where I live. Everything else I pick up in service of a
  // project's core vision, not as a headline skill.
  skills: {
    core: ['React', 'Vue 3', 'TypeScript', 'Tailwind', 'Framer Motion', 'Figma', 'Accessibility', 'Data Viz', 'AI-Assisted Dev'],
    adapts: ['Node.js', 'SQL', 'Docker', 'Python', 'C#', 'IoT'],
  },
  adaptNote: 'When a project needs more, I pick up whatever the core vision calls for.',
};

export const experience = [
  {
    company: 'GE Aerospace',
    role: 'Frontend Developer & UX Design Co-op',
    type: '',
    dates: 'Jan 2026 – Present',
    location: 'Boston, MA',
    points: [
      'Building a scenario-exploration web app in Vue 3 + TypeScript for data-driven decision-making.',
      'Translating Figma designs into production UI and shipping features each sprint with a UK-based team.',
      'Built a real-time 3D geospatial app (Vue 3 + CesiumJS) with live weather, flight, and risk data in a week-long hackathon.',
    ],
  },
  {
    company: 'Tulip Interfaces',
    role: 'Product Support Engineer',
    type: 'Part-Time',
    dates: 'Jul 2025 – Jan 2026',
    location: 'Boston, MA',
    points: [
      'Delivered support across 10+ domains for 15–20 users weekly; cut resolution times 40% debugging distributed systems.',
      'Built automation tools and AI documentation, saving 10+ hours monthly; authored 20+ public KB articles.',
    ],
  },
  {
    company: 'Tulip Interfaces',
    role: 'TEC Hardware/Software Engineer',
    type: 'Co-op',
    dates: 'Jan 2025 – Jun 2025',
    location: 'Boston, MA',
    points: [
      'Led Mission Control 3.0 (React) for live TEC tours; built KPI widgets and 15+ demos for 1,000+ professionals.',
      'Deployed to Kubernetes via Helm/Argo CD; GitHub Actions CI/CD cut deploy time 60% at 99.5% uptime.',
      'Built Node-RED flows and Tulip connectors and trained LandingAI models for pick-to-lights and visual guidance.',
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
    id: 'mission-control',
    title: 'Mission Control 3.0',
    org: 'Tulip Interfaces',
    year: '2025',
    role: 'Primary Developer',
    summary:
      'Real-time monitoring and visualization app built to complement live tours of the Tulip Experience Center for 200+ guests and executives.',
    highlights: [
      'React + Node/Express front to back, backed by AWS Redshift.',
      'Helm + Argo CD on Kubernetes; GitHub Actions CI/CD cut deploy time 60% at 99.5% uptime.',
      'Vault-managed secrets and TLS via cert-manager; Cursor-driven development to accelerate builds.',
    ],
    tags: ['React', 'Node.js', 'Redshift', 'Kubernetes', 'Argo CD', 'AWS'],
    image: getImagePath('/projects/mission-control/hero-globe.png'),
    accent: 'linear-gradient(135deg, #7aa2ff, #5ee7c6)',
    video: {
      src: getImagePath('/projects/mission-control/hannover-messe.mp4'),
      end: 67, // relevant showcase runs to ~1:07
      caption: 'Running in the background as Tulip CEO Natan Linder speaks with Bain & Company’s Jörg Gnamm at Hannover Messe.',
      href: 'https://www.linkedin.com/feed/update/urn:li:activity:7452619781264007168/',
    },
    caseStudy: {
      hero: getImagePath('/projects/mission-control/hero-globe.png'),
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
          src: getImagePath('/projects/mission-control/dev-broken.png'),
          caption: 'A rendering bug in development, event beams streaking off the globe',
        },
        {
          src: getImagePath('/projects/mission-control/design-1.png'),
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
    role: 'Hardware/Software Engineer',
    summary:
      'Live industrial demos (conveyors, pick-to-light, Andon, and machine vision) built and supported for executive tours and global tradeshows like IMTS and Automate.',
    highlights: [
      'Integrated hardware via Node-RED, MQTT, and OPC-UA connectors.',
      'Trained LandingAI / Cognex models for OCR and defect detection.',
      'Built reusable KPI widgets and documented demo UX components.',
    ],
    tags: ['Node-RED', 'MQTT', 'OPC-UA', 'Cognex', 'LandingAI', 'IoT'],
    image: getImagePath('/projects/tec-demos/automate-demo.jpg'),
    accent: 'linear-gradient(135deg, #5ee7c6, #7aa2ff)',
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
          src: getImagePath('/projects/tec-demos/hardware-wall.png'),
          caption: 'The Composable HMI wall, a mobile rack of stacked Tulip interfaces',
        },
        {
          src: getImagePath('/projects/tec-demos/pharma-kit.png'),
          caption: 'A life sciences travel kit at a pharma tradeshow, built around a Wave Bioreactor workflow',
        },
      ],
    },
    links: { live: 'https://tulip.co/tec-virtual-tour/' },
    featured: true,
  },
  {
    id: 'newvegas',
    title: 'New Vegas Web Monitor',
    org: 'Personal',
    year: '2026',
    role: 'Solo · Plugin + Web App',
    summary:
      'A Pip-Boy-style second screen for Fallout: New Vegas. A native game plugin streams live player state to a web app over WebSocket, so you can read status, inventory, and the Mojave map on a second display while you play.',
    highlights: [
      'Wrote a C++ NVSE plugin that runs inside the game and serves player data over a local WebSocket.',
      'Vue 3 + Vite + Capacitor client, shipped as an installable PWA and an Android APK, with a CRT Pip-Boy theme.',
      'Built for dual-screen handhelds. Started from the open-source SkyrimWebMonitor (MIT) and rebuilt it for New Vegas with a new plugin, data models, UI, and map.',
    ],
    tags: ['Vue 3', 'TypeScript', 'C++', 'WebSocket', 'PWA', 'Capacitor'],
    image: getImagePath('/projects/newvegas/pipboy-status.png'),
    accent: 'linear-gradient(135deg, #e7b15e, #b06a2c)',
    caseStudy: {
      sections: [
        {
          heading: 'The idea',
          body: 'Fallout: New Vegas has a wrist computer called the Pip-Boy that holds your stats, inventory, and map. New Vegas Web Monitor takes that out of the game and puts it on a second screen. You play on your main display, and your phone or a second monitor becomes a live Pip-Boy: status, inventory, and the Mojave map, updating as you play. I built it mostly for dual-screen handhelds, where there is a second panel sitting right there doing nothing.',
        },
        {
          heading: 'How it works',
          body: 'The catch is that a game from 2010 does not hand you its live state. So there are two halves. A plugin written in C++ runs inside the game through NVSE and serves the player’s data over a local WebSocket. A web client reads that stream and renders the interface. When your health drops or you pick something up, the plugin sees it and the second screen updates in near real time. Most of the interesting work was on that seam: what data to pull, how often, and how to keep the two in sync without hitching the game.',
        },
        {
          heading: 'Built for two screens',
          body: 'The client is Vue 3 and Vite, wrapped with Capacitor so it ships as both an installable web app (PWA) and an Android APK. I gave it a CRT Pip-Boy look, the green phosphor glow and scanlines, so it reads as part of the game rather than a dashboard bolted on the side. On a handheld with a second display, you open it and it is just there.',
        },
        {
          heading: 'Built on SkyrimWebMonitor',
          body: 'I did not start from nothing. There is an open-source project, SkyrimWebMonitor (MIT licensed), that does this for Skyrim. I started from it and rebuilt it for New Vegas: a new game plugin, new data models for New Vegas’s stats and items, a new UI, and the Mojave map in place of Skyrim’s. Building on good open work is a legitimate way to ship, as long as you are honest about what you kept and what you made. Here the core idea was theirs, and the New Vegas version is mine.',
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
          src: getImagePath('/projects/newvegas/mojave-map.png'),
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
    id: 'geospatial',
    title: '3D Geospatial Visualization',
    org: 'GE Aerospace',
    year: '2026',
    role: 'Frontend & UX',
    summary:
      'A 3D geospatial web app that renders live operational data on an interactive globe. It began as a week-long hackathon build, and I have continued developing it since, iterating with an internal engineering team and gathering feedback from domain scientists and product stakeholders. It is internal GE Aerospace work, so details here are intentionally light.',
    highlights: [
      'Vue 3 and CesiumJS for an interactive 3D globe with layered, real-time data overlays.',
      'Own the frontend and UX, turning stakeholder needs into a usable interface.',
      'Carried it past the initial hackathon into ongoing development with engineers, scientists, and sales.',
    ],
    tags: ['Vue 3', 'CesiumJS', 'TypeScript', 'Data Viz', 'UX'],
    image: null,
    accent: 'linear-gradient(135deg, #b69dff, #7aa2ff)',
    links: {},
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
      'In daily use at a real store, with the workflow and features shaped by owner feedback and on-site user testing.',
      'Kanban board from intake to pickup, a quick multi-step ticket flow, customer directory, and global search.',
      'Next.js 15 and React 19 in TypeScript, Tailwind v4, and Prisma, with role-based logins.',
    ],
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Prisma'],
    image: getImagePath('/projects/jewelry-crm/repair-board.png'),
    accent: 'linear-gradient(135deg, #7aa2ff, #b69dff)',
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
          body: 'I designed it iPad-first, since that is where it lives, with big targets and short flows meant for someone standing at a counter, not sitting at a desk. Under that it is Next.js 15 and React 19 in TypeScript, Tailwind v4 for the interface, and Prisma for the data, with role-based logins so staff and owner each see the right things. I owned the UX, the interface, the data model, and the backend.',
        },
        {
          heading: 'In daily use',
          body: 'It is not a mockup. It runs the store day to day, and the features came from that. I shaped the workflow around the owner’s feedback and watched staff use it on site, then cut and changed the things that got in the way. Building something people rely on every day, and having to fix it when it annoys them, taught me more than any spec would have.',
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
    id: 'nurture-nest',
    title: 'Nurture Nest',
    org: 'Maternal Health',
    year: '2025',
    role: 'UX & Frontend',
    summary:
      'Mobile-first maternal-health app with flows for tracking, alerts, and education, designed for accessibility in rural communities.',
    highlights: [
      'Collaborated on UX design in Figma and React frontend.',
      'Accessibility-first, mobile-first patterns for low-bandwidth contexts.',
      'Focused on reducing care barriers and increasing awareness.',
    ],
    tags: ['Figma', 'React', 'UX', 'Accessibility', 'Healthcare'],
    image: getImagePath('/projects/nurture-nest/app-screens.png'),
    accent: 'linear-gradient(135deg, #5ee7c6, #b69dff)',
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
          src: getImagePath('/projects/nurture-nest/app-screens.png'),
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
    id: 'portfolio',
    title: 'This Portfolio',
    org: 'Personal',
    year: '2026',
    role: 'Design & Engineering',
    summary:
      'I wanted my portfolio to feel like something you pick up and play with, not a page you scroll past. I grew up on game consoles, and what stayed with me was how their menus made moving around feel alive and worth exploring. So I built everything around a single glass object you can turn and open, and tuned the whole thing to feel calm, tactile, and a little curious. It is me trying to show, not just tell, how I think software should feel to use.',
    highlights: [
      'Hand-built glass design system (tokens + primitives), no UI kit.',
      'React, Tailwind, and Framer Motion with an animated SVG backdrop.',
      'Accessibility and performance focused; high Lighthouse scores.',
    ],
    tags: ['React', 'Three.js', 'Tailwind', 'Framer Motion', 'Design System'],
    image: getImagePath('/projects/portfolio/hero.png'),
    accent: 'linear-gradient(135deg, #5ee7c6, #7aa2ff)',
    links: { repo: 'https://github.com/NicLagr/NicLagr.github.io' },
  },
];
