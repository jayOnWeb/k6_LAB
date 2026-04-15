
import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 50,
  duration: '10s',
};

export default function () {
  http.get('https://jsonplaceholder.typicode.com/');
  sleep(1);
}
