import {Container} from "react-bootstrap";
import LogListTab from "../../components/board/LogListTab.jsx";

const ListLog = () =>
{
    return(
        <Container>
            <h3 className='m-3'> Logs du logiciel :</h3>
            <LogListTab/>
        </Container>
    )
}
export default ListLog;