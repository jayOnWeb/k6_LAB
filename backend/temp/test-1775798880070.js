
import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 5,
  duration: '5s',
};

export default function () {
  http.get('https://test.k6.io');
  sleep(1);
}
