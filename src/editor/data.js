export const mark = {
  data: {
    marks: [
      {
        data: 'hello',
        formats: { del: true, color: 'red' },
      },
      {
        data: {
          marks: [
            {
              data: 'https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg',
              alt: 'test image',
              width: '50px',
              height: '50px',
            },
          ],
        },
        formats: { image: true },
      },
      {
        data: {
          marks: [
            {
              data: 'this is Paragraph',
              formats: { color: 'green' },
            },
          ],
        },
        formats: { paragraph: true },
      },
      {
        data: 'world',
        formats: { del: true, color: 'red' },
      },
      {
        data: 'hhhha',
        formats: { sup: true, del: true, color: 'green', 'font-size': '12px' },
      },
      {
        data: {
          marks: [{ data: 'table title', formats: {} }],
        },
        formats: { paragraph: true },
      },
      {
        data: {
          marks: [
            {
              data: {
                marks: [
                  {
                    data: {
                      marks: [
                        {
                          data: '1111',
                          formats: { color: 'red' },
                        },
                      ],
                    },
                    formats: { col: true },
                  },
                  {
                    data: {
                      marks: [
                        {
                          data: '1111',
                          formats: { color: 'green' },
                        },
                      ],
                    },
                    formats: { col: true },
                  },
                ],
              },
              formats: { row: true },
            },
          ],
        },
        formats: {
          table: true,
        },
      },
    ],
  },
}

console.log(mark)
