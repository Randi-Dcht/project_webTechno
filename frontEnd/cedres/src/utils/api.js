import axios from "axios";

const server = axios.create({
    baseURL: 'http://127.0.0.1:8080',
    headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});

export async function getNewStudent(data)
{
    const resp = await server.get('/new-student-get',data);
    return resp.data
}

export async function postNewStudent(student)
{
    const resp = await server.post('/new-student-add', student);
    return resp.data
}