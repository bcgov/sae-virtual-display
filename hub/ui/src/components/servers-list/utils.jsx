import React from 'react';

export const head = {
  cells: [
    {
      isSortable: true,
      width: 50,
      content: 'App Name',
      key: 'name',
    },
    {
      width: 5,
      content: 'Actions',
      key: 'url',
    },
  ],
};

export const emptyView = <h2>You have not created any servers yet</h2>;
