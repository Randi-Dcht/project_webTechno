import {Container, Tab, Tabs} from "react-bootstrap";
import CourseListTab from "../../components/board/CourseListTab.jsx";
import FacultyListTab from "../../components/board/FacultyListTab.jsx";
import TeacherListTab from "../../components/board/TeacherListTab.jsx";

const AllList = () =>
{
    return(
        <Container>
            <h3 className='m-3'>Annuaires :</h3>
            <Tabs defaultActiveKey="course" id="fill-tab-example" className="mb-3" fill>
                <Tab eventKey="teacher" title="Liste professeurs">
                    <TeacherListTab/>
                </Tab>
                <Tab eventKey="secretary" title="Liste de secrétariats">
                    <FacultyListTab/>
                </Tab>
                <Tab eventKey="course" title="Liste de cours">
                    <CourseListTab/>
                </Tab>
            </Tabs>
        </Container>
    )
}
export default AllList;