export const PIN_DATA = [
  {
    id: "lossiemouth",
    name: "RAF Lossiemouth",
    x: 57,
    y: 22,
    content: {
      title: "RAF Lossiemouth",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi unde saepe, assumenda totam excepturi, odio aut harum corrupti cumque at voluptate illo accusantium velit nobis error atque eum nemo quidem.",
      cta: {
        label: "Find out more",
        href: "/lossiemouth",
      },
      youtubeVideoId: "2-G2wxPf-LU",
    },
  },
  {
    id: "boulmer",
    name: "RAF Boulmer",
    x: 70,
    y: 44,
    content: {
      title: "RAF Boulmer",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi unde saepe, assumenda totam excepturi, odio aut harum corrupti cumque at voluptate illo accusantium velit nobis error atque eum nemo quidem.",
      cta: {
        label: "Find out more",
        href: "/boulmer",
      },
      youtubeVideoId: "T2ixkEIYTog",
    },
  },
  {
    id: "example",
    name: "Example Pin",
    x: 79,
    y: 68,
    content: {
      title: "Example Pin Content Title",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi unde saepe, assumenda totam excepturi, odio aut harum corrupti cumque at voluptate illo accusantium velit nobis error atque eum nemo quidem.",
      cta: {
        label: "Example CTA",
        href: "/example",
      },
    },
  },
];

export type PinData = (typeof PIN_DATA)[number];
