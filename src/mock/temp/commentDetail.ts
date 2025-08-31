export interface Comment {
  id: number
  author: string
  content: string
  timestamp: string
  replies: Comment[]
}

export const commentList = ref<Comment[]>([
  {
    id: 1,
    author: 'WhiteNight',
    content:
      'The combat scenes in Black Myth: Wukong are absolutely thrilling! Can’t wait for release!',
    timestamp: '2024-09-04 09:00',
    replies: [
      {
        id: 101,
        author: 'Galaxy',
        content: 'Totally! Those skill effects are stunning!',
        timestamp: '2024-09-04 09:15',
        replies: [
          {
            id: 201,
            author: 'Radiance',
            content:
              'Hope optimization keeps up; such visuals would be a shame to waste if it stutters.',
            timestamp: '2024-09-04 09:30',
            replies: []
          }
        ]
      }
    ]
  },
  {
    id: 2,
    author: 'Drifter',
    content: 'Heard Black Myth: Wukong requires high specs—wonder if my PC can handle it.',
    timestamp: '2024-09-04 10:00',
    replies: [
      {
        id: 102,
        author: 'Dawn',
        content: 'Same concern. Rumor says at least an RTX 3070 for smooth performance.',
        timestamp: '2024-09-04 10:20',
        replies: [
          {
            id: 202,
            author: 'Streamlight',
            content: 'I plan to upgrade my rig—waiting for this game anyway.',
            timestamp: '2024-09-04 10:40',
            replies: []
          }
        ]
      }
    ]
  },
  {
    id: 3,
    author: 'Windchime',
    content: '130GB storage is a bit much, but fair given the visuals.',
    timestamp: '2024-09-04 11:00',
    replies: [
      {
        id: 103,
        author: 'Cloud',
        content: 'It’s high, but worth it for a game of this quality.',
        timestamp: '2024-09-04 11:15',
        replies: [
          {
            id: 203,
            author: 'Dream',
            content: 'Hope the install size gets optimized post-release.',
            timestamp: '2024-09-04 11:30',
            replies: []
          }
        ]
      }
    ]
  }
])
