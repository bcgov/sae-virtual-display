export const apps = [
  {
    name: 'notebook',
    logo: 'notebook',
    label: 'Jupyterlab',
    image: '/images/jupyter.png',
    container: 'vdi-session-notebook:develop',
  },
  {
    name: 'browser',
    logo: 'browser',
    label: 'Chrome Browser',
    image: '/images/chrome.png',
    container: 'vdi-session-browser:develop',
  },
  {
    name: 'rstudio',
    logo: 'rstudio',
    label: 'RStudio',
    container: 'vdi-session-rstudio:123',
  },
];

export const data = {
  servers: {
    notebook: {
      ready: true,
    },
    browser: {
      ready: false,
    },
    rstudio: {
      ready: true,
    },
  },
};
