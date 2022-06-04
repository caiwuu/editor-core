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
              data: 'https://img2.baidu.com/it/u=3979034437,2878656671&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333',
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
        formats: { sup: true, del: true, color: 'green', fontSize: '12px' },
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
