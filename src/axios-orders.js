import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-builder-30e7a.firebaseio.com/'
});

export default instance;