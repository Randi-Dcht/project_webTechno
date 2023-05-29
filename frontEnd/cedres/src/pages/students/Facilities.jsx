import {Button, Container, Tab, Tabs} from "react-bootstrap";
import FacilitiesTab from "../../components/board/FacilitiesTab.jsx";
import {
    getActiveButton,
    getListFacilitiesCourse,
    getListFacilitiesExam,
    getListFacilitiesExample,
    getSelectList
} from "../../utils/api.js";
import {useState} from "react";
import FacilitiesForm from "../../components/forms/FacilitiesForm.jsx";
import {useQuery} from "@tanstack/react-query";
import NoButton from "../../components/NoButton.jsx";


const Facilities = () =>
{

    const {data, isLoading} = useQuery(
        {
            queryKey:['activeButton'],
            queryFn: getActiveButton,
        })

    const [visible, setVisible] = useState(false)

    return(
        <Container>
            <h3 className="m-3">Mes aménagements :</h3>
            {isLoading?<p>chargement ...</p>:
                data.active==="development"?<div className="container-fluid text-center m-2">
                {
                    visible? <FacilitiesForm cancel={setVisible}/> : <Button variant="warning" onClick={() => setVisible(!visible)}>Ajouter un aménagement</Button>
                }
                </div>:<NoButton/>
            }
            <Tabs defaultActiveKey="course" id="fill-tab-example" className="mb-3" fill>
                <Tab eventKey="course" title="Aménagements cours">
                    <FacilitiesTab getter={getListFacilitiesCourse(localStorage.getItem('id'))} name='course'/>
                </Tab>
                <Tab eventKey="exam" title="Aménagements examen">
                    <FacilitiesTab getter={getListFacilitiesExam(localStorage.getItem('id'))} name='exam'/>
                </Tab>
            </Tabs>
        </Container>
    )
}
export default Facilities;