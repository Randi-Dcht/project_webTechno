import {Button, Container, Tab, Tabs} from "react-bootstrap";
import FacilitiesTab from "../../components/board/FacilitiesTab.jsx";
import {
    getListFacilitiesCourse,
    getListFacilitiesExam,
    getListFacilitiesExample,
    getSelectList
} from "../../utils/api.js";
import {useState} from "react";
import FacilitiesForm from "../../components/forms/FacilitiesForm.jsx";
import {useQuery} from "@tanstack/react-query";

const Facilities = () =>
{

    const {data} = useQuery(
        {
            queryKey:['listExampleFacilities'],
            queryFn: getListFacilitiesExample,
        })

    const [visible, setVisible] = useState(false)

    return(
        <Container>
            <h3 className="m-3">Mes aménagements :</h3>
            <div className="container-fluid text-center m-2">
                {
                    visible? <FacilitiesForm cancel={setVisible} example={data}/> : <Button variant="warning" onClick={() => setVisible(!visible)}>ajouter un aménagement</Button>
                }
            </div>
            <Tabs defaultActiveKey="course" id="fill-tab-example" className="mb-3" fill>
                <Tab eventKey="course" title="Aménagements cours">
                    <FacilitiesTab getter={getListFacilitiesCourse(localStorage.getItem('id'))} name={['listFacilitiesCourse']}/>
                </Tab>
                <Tab eventKey="exam" title="Aménagements examen">
                    <FacilitiesTab getter={getListFacilitiesExam(localStorage.getItem('id'))} name={['listFacilitiesExam']}/>
                </Tab>
            </Tabs>
        </Container>
    )
}
export default Facilities;