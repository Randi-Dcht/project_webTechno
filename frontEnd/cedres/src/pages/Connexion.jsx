import {useParams} from "react-router-dom";
import {Card, Tab, Tabs} from "react-bootstrap";
import Connect from "../components/forms/Connect.jsx";
import {ADMIN, STUDENT} from "../utils/routes.js";

const Connexion = () =>
{
    const param = useParams();
    const id = param.user;

    return(
        <Card style={{width: '30%', margin: "auto", marginTop: '5%'}}>
            <Card.Body>
                <Tabs defaultActiveKey={id} id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="student" title="Elève">
                        <Connect redirect={STUDENT}/>
                    </Tab>
                    <Tab eventKey="admin" title="Cèdre">
                        <Connect redirect={ADMIN}/>
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    )
}

export default Connexion;