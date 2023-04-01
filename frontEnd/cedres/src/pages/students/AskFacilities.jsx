import {Container, Tab, Tabs} from "react-bootstrap";
import CourseFacilitiesTab from "../../components/board/CourseFacilitiesTab.jsx";
import ExamFacilitiesTab from "../../components/board/ExamFacilitiesTab.jsx";

const AskFacilities = () =>
{
    return(
        <Container>
            <h3 className="m-2">Mes aménagements demandés:</h3>
            <Tabs
                defaultActiveKey="course"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="course" title="Cours">
                    <CourseFacilitiesTab/>
                </Tab>
                <Tab eventKey="exam-1" title="Examen janvier">
                    <ExamFacilitiesTab session='1' Ukey='listExamFacilities1'/>
                </Tab>
                <Tab eventKey="exam-2" title="Examen juin">
                    <ExamFacilitiesTab session='2' Ukey='listExamFacilities2'/>
                </Tab>
                <Tab eventKey="exam-3" title="Examen aout">
                    <ExamFacilitiesTab session='3' Ukey='listExamFacilities3'/>
                </Tab>
            </Tabs>
        </Container>
    )
}
export default AskFacilities;