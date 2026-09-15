// data/games.js
import { getImagePath } from '../utils/imagePath';

export const games = [
  {
    slug: 'wota',
    title: 'Whispers of the Abyss',
    status: 'LIVE',
    year: '2024',
    roles: ['Gameplay', 'Systems', 'AI', 'Level Design', 'VFX/SFX Integration'],
    engines: ['Unity 3D'],
    stack: ['C#', 'Java', 'URP', 'NavMesh', 'FSM'],
    genres: ['Action-Adventure', 'Dark Fantasy', 'Retro Horror/Thriller', 'Puzzle'],
    summary:
      'Dark fantasy dungeon crawler: explore haunted ruins, solve puzzles, and fight skeletons and an eldritch guardian using torch, sword, and a teleport orb.',
    description: [
      'Journey through a fog-covered forest and ancient castle labyrinth.',
      'Use a teleport orb (RC release, R teleport) to outplay enemies.',
      'Two dungeon levels must be beaten before the final boss chamber.'
    ],
    features: [
      'Fragile health + checkpoints to heighten tension',
      'Torch-lit exploration, warp nodes, and secrets',
      'Sword combat with projectile deflect',
      'Playtest updates: UI repositioning, added tougher enemies + boss'
    ],
    mechanics: {
      players: [
        'Move, sprint, jump, sneak',
        'Attack with sword; deflect projectiles',
        'Torch for light + trap detection',
        'Teleport orb for traversal + evasion'
      ],
      enemies: [
        'Skeleton patrols with detection cones',
        'Dungeon Skeletons with shields',
        'Maze Guardian chase AI',
        'Boss with health bar + portal spawn'
      ],
      items: ['Sword', 'Torch', 'Teleport orb', 'Collectibles']
    },
    links: {
      play: 'https://play.unity.com/en/games/0729dadb-bf9a-4748-b78d-5cf84274b059/whispers-of-the-abyss',
      repo: 'https://github.com/NicLagr/CS_3540_Final/commits/main/'
    },
    media: {
      hero: getImagePath('/games/wota/hero.png'),
      gallery: [
        getImagePath('/games/wota/screen-1.png'),
        getImagePath('/games/wota/screen-2.png'),
        getImagePath('/games/wota/screen-3.png'),
        getImagePath('/games/wota/screen-4.png'),
        getImagePath('/games/wota/concept-1.png'),
        getImagePath('/games/wota/concept-2.png')
      ]
    }
  },
  {
    slug: 'hellfire',
    title: 'Hellfire at High Noon',
    status: 'LIVE',
    year: '2024',
    roles: ['Gameplay', 'Systems', 'Level Design', 'VFX/SFX Integration'],
    engines: ['Unity 3D'],
    stack: ['C#', 'URP'],
    genres: ['FPS', 'Western Horror', 'Arcade Shooter'],
    summary:
      'Western horror FPS: revolver combat, energy blasts, and bullet-time to fight demon hordes and a giant boss.',
    description: [
      'Score-based progression across 4 levels of a haunted frontier town.',
      'Ammo is scarce; find pickups to stay alive.',
      'Boss: a towering demon with heavy health and damage.'
    ],
    features: [
      'LMB revolver shooting for score',
      'RMB energy blast clears demons/props (no points, no ammo)',
      'Shift triggers bullet-time',
      'Levels advance by reaching target score'
    ],
    mechanics: {
      players: [
        'WASD move, Space jump',
        'Shoot (LMB) with ammo pickups',
        'Energy blast (RMB) to banish demons/knock props',
        'Bullet-time (Shift) slows combat',
        'HUD: reticle, health, score, ammo, bullet-time bar'
      ],
      enemies: [
        'Normal demons (early)',
        'Faster/smaller demons (later)',
        'Boss: giant demon with high HP'
      ],
      items: ['Ammo pickups', 'Potential future pickups for health/bullet-time']
    },
    links: {
      play: 'https://play.unity.com/en/games/bdbaa8c8-7d63-438d-b971-93efa7d4a774/hellfire-at-high-noon',
      repo: 'https://github.com/NicLagr/FPS-Game'
    },
    media: {
      hero: getImagePath('/games/hellfire/hero.png'),
      // pre-cropped wide band for the Work-style row backdrop — a plain cover
      // crop of the full screenshot cuts the demon off in a wide-short row
      rowMedia: getImagePath('/games/hellfire/hero-wide.jpg'),
      gallery: [
        getImagePath('/games/hellfire/screen-1.png'),
        getImagePath('/games/hellfire/screen-2.png'),
        getImagePath('/games/hellfire/screen-3.png'),
        getImagePath('/games/hellfire/screen-4.png')
      ]
    }
  },
  {
    slug: 'rolling-siege',
    title: 'Rolling Siege',
    status: 'LIVE',
    year: '2024',
    roles: ['Gameplay', 'Systems', 'Level Design', 'Game Mechanics'],
    engines: ['Unity 3D'],
    stack: ['C#', 'WebGL'],
    genres: ['Gauntlet-Style', 'Arcade', 'Gem Collection'],
    summary:
      'Gauntlet-style gem collection game with 10-point advancement system.',
    description: [
      'Fast-paced gem collection gameplay with round-based progression.',
      'Collect 10 points to advance to the next challenging round.',
      'Published on Unity Play platform for web browsers.'
    ],
    features: [
      'WASD movement controls for fluid navigation',
      'Space to jump over obstacles and enemies',
      'Shift to accelerate for quick escapes',
      '10-point scoring system for round advancement'
    ],
    mechanics: {
      players: [
        'WASD movement for directional control',
        'Space bar for jumping mechanics',
        'Shift key for speed acceleration',
        'Gem collection for scoring points'
      ],
      enemies: [
        'Various obstacles to avoid',
        'Environmental hazards',
        'Round-based difficulty scaling'
      ],
      items: ['Gems worth different point values', 'Power-ups for enhanced gameplay']
    },
    links: {
      play: 'https://play.unity.com/en/games/2cad469f-9ea1-4d20-9618-7161845eb935/rolling-siege'
    },
    media: {
      hero: getImagePath('/games/rolling-siege/hero.png'),
      // pre-cropped wide band centered on the player ring — the default crop
      // landed on an NPC instead, well above the actual player character
      rowMedia: getImagePath('/games/rolling-siege/hero-wide.jpg'),
      gallery: [
        getImagePath('/games/rolling-siege/screen-1.png'),
        getImagePath('/games/rolling-siege/screen-2.png')
      ]
    }
  }
];

export const getGameBySlug = (slug) => {
  return games.find(game => game.slug === slug);
};
