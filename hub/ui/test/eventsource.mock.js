import { enableMocks } from 'jest-fetch-mock';
import EventSource from 'eventsourcemock';

enableMocks();
Object.defineProperty(window, 'EventSource', {
  value: EventSource,
});
