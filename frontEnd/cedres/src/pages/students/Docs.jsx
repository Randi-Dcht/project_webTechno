import {Button, Col, Container, Nav, Row, Tab} from "react-bootstrap";
import DocsTab from "../../components/board/DocsTab.jsx";
import {useState} from "react";
import PushDocForm from "../../components/forms/PushDocForm.jsx";

const Docs = () =>
{

    const [push, setPush] = useState(false)

    return(
        <Container>
            <h3 className="m-3">Mes documents :</h3>
            <Tab.Container id="left-tabs-example" defaultActiveKey="actual">
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="actual">Charger documents</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="old">Télécharger documents</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="actual">
                                {
                                    push === false?
                                        <div className="container-fluid text-center"><Button className='m-4' variant="warning" onClick={()=>setPush(true)}>Ajouter un document</Button></div>:
                                        <PushDocForm cancel={setPush}/>
                                }
                                <DocsTab/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="old">
                                <DocsTab/>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    )
}
export default Docs