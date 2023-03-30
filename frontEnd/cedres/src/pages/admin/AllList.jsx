import {Container, Tab, Tabs} from "react-bootstrap";

const AllList = () =>
{
    return(
        <Container>
            <h3 className='m-3'>Annuaires :</h3>
            <Tabs defaultActiveKey="course" id="fill-tab-example" className="mb-3" fill>
                <Tab eventKey="teacher" title="Liste professeurs">

                </Tab>
                <Tab eventKey="secretary" title="Liste de secrétariats">

                </Tab>
                <Tab eventKey="course" title="Liste de cours">

                </Tab>
            </Tabs>
        </Container>
    )
}
export default AllList;