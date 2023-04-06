import {Button, Container, Tab, Tabs} from "react-bootstrap";
import CourseListTab from "../../components/board/CourseListTab.jsx";
import FacultyListTab from "../../components/board/FacultyListTab.jsx";
import TeacherListTab from "../../components/board/TeacherListTab.jsx";
import {useState} from "react";
import TeacherForm from "../../components/forms/TeacherForm.jsx";
import CourseForm from "../../components/forms/CourseForm.jsx";
import FacultyForm from "../../components/forms/FacultyForm.jsx";

const AllList = () =>
{
    const [teacher, setTeacher] = useState(false)
    const [course, setCourse] = useState(false)
    const [faculty, setFaculty] = useState(false)

    return(
        <Container>
            <h3 className='m-3'>Annuaires :</h3>
            <Tabs defaultActiveKey="course" id="fill-tab-example" className="mb-3" fill>
                <Tab eventKey="teacher" title="Liste professeurs">
                    {teacher? <TeacherForm cancel={setTeacher}/> : <Button variant="dark" className='m-3' onClick={()=>setTeacher(true)}>ajouter</Button>}
                    <TeacherListTab/>
                </Tab>
                <Tab eventKey="secretary" title="Liste de secrétariats">
                    {faculty? <FacultyForm cancel={setFaculty}/> : <Button variant="dark" className='m-3' onClick={()=>setFaculty(true)}>ajouter</Button>}
                    <FacultyListTab/>
                </Tab>
                <Tab eventKey="course" title="Liste de cours">
                    {course? <CourseForm cancel={setCourse}/> : <Button variant="dark" className='m-3' onClick={()=>setCourse(true)}>ajouter</Button>}
                    <CourseListTab/>
                </Tab>
            </Tabs>
        </Container>
    )
}
export default AllList;