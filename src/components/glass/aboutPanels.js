// Content for the personal About scene (the 3D bust + 4 surrounding panels).
// Data only, so both the desktop 3D scene and the mobile card fallback read it.
// Voice: plain and direct, first person. Images are optional; a panel degrades
// to text if its image is missing.

export const ABOUT_PANELS = [
  {
    id: 'gaming',
    label: 'Gaming',
    pos: 'top', // screen placement + the direction the model looks
    heading: 'Games',
    body: [
      'Zelda is my favorite series. I keep coming back to Ocarina of Time and Majora’s Mask, and Ocarina was my first real game as a kid.',
      'I love Witcher 3 and Red Dead Redemption 2 too. Narratively I think they are top notch.',
      'I also play Super Smash Bros. Melee for fun every now and then, though I am nowhere near good enough to compete.',
    ],
    image: '/about/gaming.gif', // Fox waveshine (Melee), retro low-res on purpose
    pixel: true, // render nearest-neighbour so the old-game look stays crisp
  },
  {
    id: 'outdoors',
    label: 'Outdoors',
    pos: 'right',
    heading: 'Outside',
    body: [
      'I camp and backpack whenever I can get out.',
      'My last trip was a four-day backpacking trail in Iceland.',
    ],
    image: '/about/outdoors.jpg',
  },
  {
    id: 'building',
    label: 'Building',
    pos: 'bottom',
    heading: 'Building & tinkering',
    body: [
      'I build PCs and keyboards, and I like taking things apart to see how they work.',
      'I’ve modded my Wii and set up emulation handhelds for games on the go.',
    ],
    image: '/about/building.jpg',
  },
  {
    id: 'fitness',
    label: 'Fitness',
    pos: 'left',
    heading: 'Staying active',
    body: [
      'Lifting is a daily thing for me. It keeps me consistent and accountable.',
      'I play tennis for fun, and pickleball when I want something quick.',
    ],
    image: '/about/fitness.jpg',
  },
];

// Lottie, the black cat. A small easter egg tucked into the scene, not a panel.
export const LOTTIE = {
  name: 'Lottie',
  body: 'My black cat. She supervises most of the work on this site.',
  image: '/about/lottie.jpg',
};
