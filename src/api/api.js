import axios from 'axios'

const api = axios.create({
    baseURL:'https://pyramid.unitdtechnologies.com:2012',
//baseURL: 'http://43.228.126.245:3022',
//baseURL: 'http://192.168.43.143:3001',
//baseURL: 'http://192.168.43.143:2012',
});

export default api