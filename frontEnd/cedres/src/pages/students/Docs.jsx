import {Button, Col, Container, Nav, Row, Tab} from "react-bootstrap";
import DocsTab from "../../components/board/DocsTab.jsx";

const Docs = () =>
{
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
                                <div className="container-fluid text-center"><Button className='m-4' variant="warning">ajouter un document</Button></div>
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