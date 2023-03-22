import axios from "axios";

const server = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});