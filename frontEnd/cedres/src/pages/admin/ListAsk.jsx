import {Container, Tab, Tabs} from "react-bootstrap";

const ListAsk = () =>
{
    return(
        <Container>
            <h3 className='m-3'>Les demandes :</h3>
            <Tabs defaultActiveKey="todo" id="fill-tab-example" className="mb-3" fill>
                <Tab eventKey="todo" title="Demande à valider">

                </Tab>
                <Tab eventKey="valid" title="Demander en attente (revalider)">

                </Tab>
                <Tab eventKey="old" title="Demander valider (ancienne)">

                </Tab>
            </Tabs>
        </Container>
    )
}
export default ListAsk;