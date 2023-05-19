import {useParams} from "react-router-dom";
import {Card, Tab, Tabs} from "react-bootstrap";
import Connect from "../components/forms/Connect.jsx";
import {ADMIN, STUDENT} from "../utils/routes.js";
import {adminUrl, studentUrl} from "../utils/nav_url.js";
import {postloginAdmin, postloginStudent} from "../utils/api.js";

const Connexion = ({setUrl}) =>
{
    const param = useParams();
    const id = param.user; 

    return(
        <Card style={{width: '30%', margin: "auto", marginTop: '5%'}}>
            <Card.Body>
                <Tabs defaultActiveKey={id} id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="student" title="Elève">
                        <Connect redirect={STUDENT} setUrl={setUrl} name={studentUrl} url={postloginStudent}/>
                    </Tab>
                    <Tab eventKey="admin" title="Cèdre">
                        <Connect redirect={ADMIN} setUrl={setUrl} name={adminUrl} url={postloginAdmin}/>
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    )
}

export default Connexion;