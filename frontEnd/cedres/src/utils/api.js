import axios from "axios";

const server = axios.create({
    baseURL: 'http://127.0.0.1:8080',
    headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
});

export async function getNewStudent(data)
{
    const resp = await server.get('/new-student-get/' + data);
    return resp.data
}

export async function postNewStudent(student)
{
    const resp = await server.post('/new-student-add', student);
    return resp.data
}

export async function getListStudent()
{
    const rep = await server.get('/student-list');
    return rep.data
}

export async function postSignupStudent(student)
{
    const resp = await server.post('/student-add', student);
    return resp.data
}

export async function getStudent(matriculate)
{
    const resp = await server.get('/student-get/' + matriculate);
    return resp.data
}

export async function updateStudent(student)
{
    const rep = await server.post('/studentInfo-update', student);
    return rep.data
}

export async function getListTeacher()
{
    const rep = await server.get('/teacher-list');
    return rep.data
}

export async function getListCoure()
{
    const rep = await server.get('/course-list');
    return rep.data
}

export async function getListFacilitiesCourse(matriculate)
{
    const rep = await server.get('/facilitiesCourse-list/' + matriculate);
    return rep.data
}

export async function getListFacilitiesExam(matriculate)
{
    const rep = await server.get('/facilitiesExam-list/' + matriculate);
    return rep.data
}

export async function postFacilities(data)
{
    const rep = await server.post('/facilities-add', data);
    return rep.data
}

export async function postloginStudent(data)
{
    const rep = await server.post('/student-login', data);
    return rep.data
}

export async function postUpdatePasswordStudent(data)
{
    const rep = await server.post('/studentPassword-update', data);
    return rep.data
}

export async function postloginAdmin(data)
{
    const rep = await server.post('/admin-login', data);
    return rep.data
}

export async function postUpdatePasswordAdmin(data)
{
    const rep = await server.post('/adminPassword-update', data);
    return rep.data
}

export async function postStudentCourse(course)
{
    const rep = await server.post('/courseStudent-add', course);
    return rep.data
}

export async function getListCourseStudent(matriculate)
{
    const rep = await server.get('/courseStudent-list/' + matriculate);
    return rep.data
}

export async function getSelectList(select)
{
    const rep = await server.get('/select-list/' + select);
    return rep.data
}

export async function postDocuments(doc)
{
    const rep = await server.post('/document-add', doc);
    return rep.data
}

export async function getListCourseFacilitiesStudent(matriculate)
{
    const rep = await server.get('/courseFacilities-list/' + matriculate);
    return rep.data
}

export async function getListExamFacilitiesStudent(matriculate, session)
{
    const rep = await server.get(`/examFacilities-list-${session}/${matriculate}`);
    return rep.data
}

export async function getListFaculty()
{
    const rep = await server.get('/faculty-list');
    return rep.data
}

export async function postTeacher(teacher)
{
    const rep = await server.post('/teacher-add', teacher);
    return rep.data
}

export async function postCourse(course)
{
    const rep = await server.post('/course-add', course);
    return rep.data
}

export async function postFaculty(faculty)
{
    const rep = await server.post('/faculty-add', faculty);
    return rep.data
}

export async function getListAction()
{
    const rep = await server.get('/actions-list');
    return rep.data
}

export async function postAskFacilitiesExamen(data)
{
    const rep = await server.post('/examFacilities-generate', data);
    return rep.data
}

export async function getListFacilitiesExample()
{
    const rep = await server.get('/exampleFacilities-list');
    return rep.data
}

export async function getMyExam(number)
{
    const rep = await server.get(`/myExam/${number}`);
    return rep.data
}

export async function postMyExam(data)
{
    const rep = await server.post('/myExam-update', data);
    return rep.data
}