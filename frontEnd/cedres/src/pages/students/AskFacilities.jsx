import {Container, Tab, Tabs} from "react-bootstrap";
import CourseFacilitiesTab from "../../components/board/CourseFacilitiesTab.jsx";

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
                    <p>vide examen janvier</p>
                </Tab>
                <Tab eventKey="exam-2" title="Examen juin">
                    <p>vide examen juin</p>
                </Tab>
                <Tab eventKey="exam-3" title="Examen aout">
                    <p>vide examen aout</p>
                </Tab>
            </Tabs>
        </Container>
    )
}
export default AskFacilities;