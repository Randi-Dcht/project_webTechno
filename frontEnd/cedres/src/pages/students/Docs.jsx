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
            {
                push === false?
                    <div className="container-fluid text-center"><Button className='m-4' variant="warning" onClick={()=>setPush(true)}>Ajouter un document</Button></div>:
                    <PushDocForm cancel={setPush}/>
            }
            <DocsTab/>
        </Container>
    )
}
export default Docs