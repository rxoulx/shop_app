import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://refactored-xylophone-xrppjwr77g46hvx6w-4000.app.github.dev/api',
  headers: { 'Content-Type': 'application/json' },
});

export default axiosClient;
