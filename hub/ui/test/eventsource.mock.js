import { enableMocks } from 'jest-fetch-mock';
import EventSource from 'eventsourcemock';

// Hide some depreciation warnings from the test output
global.console = {
  log: console.log, // console.log are ignored in tests
  error: jest.fn(),
  warn: jest.fn(),
  info: console.info,
  debug: console.debug,
};

// For popper based tests
global.window.document.createRange = function createRange() {
  return {
    setEnd: () => {},
    setStart: () => {},
    getBoundingClientRect: () => {
      return { right: 0 };
    },
    getClientRects: () => [],
    commonAncestorContainer: document.createElement('div'),
  };
};

// For push notifications
Object.defineProperty(window, 'EventSource', {
  value: EventSource,
});
enableMocks();
