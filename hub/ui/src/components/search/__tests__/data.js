export default {
  success: true,
  result: {
    count: 1284,
    sort: 'score desc, metadata_modified desc',
    facets: {},
    results: [
      {
        sector: 'Service',
        id: '11',
        type: 'Dataset',
        resources: [
          {
            id: 'r1',
            size: 5959,
            format: 'csv',
            state: 'active',
            description: 'This is a description for a nested item',
            name: 'MOH_claims_metadata',
          },
          {
            id: 'r2',
            size: 3066,
            format: 'csv',
            state: 'active',
            description: 'This is a description for a nested item',
            name: 'MOH_dispensed_metadata',
          },
          {
            id: 'r3',
            size: 1569,
            format: 'csv',
            state: 'active',
            description: 'This is a description for a nested item',
            name: 'MOH_products_metadata',
          },
        ],
        num_resources: 3,
        tags: [
          {
            id: '1',
            name: 'DIP',
          },
          {
            id: '2',
            name: 'Pharmanet',
          },
          {
            id: '3',
            name: 'medication',
          },
          {
            id: '4',
            name: 'pharmacies',
          },
        ],
        purpose:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus gravida velit id libero laoreet, quis finibus sem ultricies. Mauris euismod sagittis porttitor. Quisque interdum eleifend pulvinar. ',
        groups: [
          {
            title: 'Data Innovation Program',
            name: 'data-innovation-program',
          },
        ],
        notes:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus gravida velit id libero laoreet, quis finibus sem ultricies. Mauris euismod sagittis porttitor. Quisque interdum eleifend pulvinar. ',
        title: 'Metadata for Health Program',
      },
      {
        sector: 'Health and Safety',
        id: '22',
        state: 'active',
        type: 'Dataset',
        resources: [
          {
            id: 'r1',
            size: null,
            format: 'csv',
            state: 'active',
            description: '',
            name: 'Table-2-4-2012.csv',
          },
          {
            id: 'r2',
            size: null,
            format: 'xls',
            state: 'active',
            name: 'Table-2-4-2012.xls',
            created: '2014-12-10T23:07:31.985331',
          },
        ],
        num_resources: 2,
        tags: [
          {
            id: '1',
            name: 'claim cost',
          },
          {
            id: '2',
            name: 'geographic region',
          },
          {
            id: '3',
            name: 'provincial regional district',
          },
          {
            id: '4',
            name: 'workplace injuries',
          },
        ],
        groups: [],
        notes:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus gravida velit id libero laoreet, quis finibus sem ultricies. Mauris euismod sagittis porttitor. Quisque interdum eleifend pulvinar. ',
        title: 'Data Set Does Not Match',
      },
    ],
  },
};
