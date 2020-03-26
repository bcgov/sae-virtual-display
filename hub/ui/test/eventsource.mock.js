import { enableMocks } from 'jest-fetch-mock';
import EventSource from 'eventsourcemock';

global.console = {
  log: console.log, // console.log are ignored in tests
  error: console.error,
  warn: jest.fn(),
  info: console.info,
  debug: console.debug,
};

enableMocks();
Object.defineProperty(window, 'EventSource', {
  value: EventSource,
});
