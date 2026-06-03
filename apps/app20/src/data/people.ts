export type Person = {
  id: string
  name: string
  title: string
  lifespan: string
  image: string
  quote: string
  bio: string
  achievements: string[]
  timeline: { year: string; event: string }[]
  gallery: { url: string; caption: string }[]
}

export const PEOPLE: Person[] = [
  {
    id: 'ada-lovelace',
    name: 'Ada Lovelace',
    title: 'First Computer Programmer',
    lifespan: '1815 - 1852',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Ada_Lovelace_portrait.jpg',
    quote: 'The Analytical Engine has no pretensions whatever to originate anything. It can do whatever we know how to order it to perform.',
    bio: `Augusta Ada King, Countess of Lovelace, was an English mathematician and writer chiefly known for her work on Charles Babbage's proposed mechanical general-purpose computer, the Analytical Engine. She was the first to recognize that the machine had applications beyond pure calculation.`,
    achievements: [
      'Published first algorithm intended for a computer',
      'Recognized potential for computers beyond math',
      'Pioneered concepts of looping and subroutines',
      'Daughter of poet Lord Byron'
    ],
    timeline: [
      { year: '1833', event: 'Met Charles Babbage' },
      { year: '1843', event: 'Published notes on Analytical Engine' },
      { year: '1843', event: 'Described algorithm for Bernoulli numbers' }
    ],
    gallery: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Ada_Lovelace.jpg', caption: 'Portrait c. 1840' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Diagram_for_the_computation_of_Bernoulli_numbers.jpg', caption: 'Note G - First algorithm' }
    ]
  },
  {
    id: 'alan-turing',
    name: 'Alan Turing',
    title: 'Father of Computer Science & AI',
    lifespan: '1912 - 1954',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Alan_Turing_Aged_16.jpg',
    quote: 'We can only see a short distance ahead, but we can see plenty there that needs to be done.',
    bio: `Alan Mathison Turing was an English mathematician, computer scientist, logician, cryptanalyst, philosopher and theoretical biologist. He formalized the concepts of algorithm and computation with the Turing machine. During WWII, he worked at Bletchley Park breaking German ciphers.`,
    achievements: [
      'Created Turing Machine concept - foundation of computing',
      'Led team that cracked Enigma code in WWII',
      'Proposed Turing Test for artificial intelligence',
      'Pioneered mathematical biology'
    ],
    timeline: [
      { year: '1936', event: 'Published "On Computable Numbers"' },
      { year: '1939-1945', event: 'Worked at Bletchley Park' },
      { year: '1950', event: 'Published "Computing Machinery and Intelligence"' }
    ],
    gallery: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Alan_Turing_photo.jpg', caption: 'Turing c. 1951' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Bombe-rebuild.jpg', caption: 'Bombe machine at Bletchley Park' }
    ]
  },
  {
    id: 'grace-hopper',
    name: 'Grace Hopper',
    title: 'Rear Admiral & Programming Pioneer',
    lifespan: '1906 - 1992',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Grace_Hopper_and_UNIVAC.jpg',
    quote: 'The most dangerous phrase in the language is "We\'ve always done it this way."',
    bio: `Grace Brewster Murray Hopper was an American computer scientist and United States Navy rear admiral. She was a pioneer of computer programming who invented one of the first linkers. She popularized the idea of machine-independent programming languages, leading to COBOL.`,
    achievements: [
      'Developed first compiler for computer programming',
      'Co-created COBOL programming language',
      'Popularized term "debugging" after finding a moth',
      'Achieved rank of Rear Admiral in US Navy'
    ],
    timeline: [
      { year: '1944', event: 'Joined Navy, worked on Mark I computer' },
      { year: '1952', event: 'Created first compiler, A-0 System' },
      { year: '1959', event: 'Helped develop COBOL' }
    ],
    gallery: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Commodore_Grace_M._Hopper%2C_USN_%28covered%29.jpg', caption: 'Rear Admiral Grace Hopper' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/H96566k.jpg', caption: 'First computer "bug" - 1947' }
    ]
  }
]