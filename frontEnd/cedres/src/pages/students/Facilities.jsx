import {Button, Container, Tab, Tabs} from "react-bootstrap";
import FacilitiesTab from "../../components/board/FacilitiesTab.jsx";
import {getListFacilitiesCourse, getListFacilitiesExam} from "../../utils/api.js";
import {useState} from "react";
import FacilitiesForm from "../../components/forms/FacilitiesForm.jsx";

const Facilities = () =>
{//TODO change here the matriculate !

    const [visible, setVisible] = useState(false)

    return(
        <Container>
            <h3 className="m-2">Mes aménagements :</h3>
            <div className="container-fluid text-center m-2">
                {
                    visible? <FacilitiesForm cancel={setVisible}/> : <Button variant="primary" onClick={() => setVisible(!visible)}>ajouter un aménagement</Button>
                }
            </div>
            <Tabs defaultActiveKey="course" id="fill-tab-example" className="mb-3" fill>
                <Tab eventKey="course" title="Aménagements cours">
                    <FacilitiesTab getter={getListFacilitiesCourse('191919')} name={'listFacilitiesCourse'}/>
                </Tab>
                <Tab eventKey="exam" title="Aménagements examen">
                    <FacilitiesTab getter={getListFacilitiesExam('191919')} name={'listFacilitiesExam'}/>
                </Tab>
            </Tabs>
        </Container>
    )
}
export default Facilities;