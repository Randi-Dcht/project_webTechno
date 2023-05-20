import {Button, Card, CardGroup, Col, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const listLink =[
    {
        name : "Etudiants",
        link: './students',
        text: "Liste des étudiants et consulter les profils"
    },
    {
        name : "Demandes",
        link: './list-ask',
        text: "Liste des demandes (accepter, modifier, consulter)"
    },
    {
        name : "Logger",
        link: './log',
        text: "Logs de l'application"
    },
    {
        name : "Annuaires",
        link: './list',
        text: "Liste de secrétariat, professeurs, cours, ..."
    },
]

const HomeAdmin = () =>
{
    const navigate = useNavigate();


    return(
        <div>
            <h2 className="m-4">Accueil administration</h2>
            <Row xs={1} md={2} className="g-2">
                {
                    listLink.map((e, index)=>
                    {
                        return(
                           <Col>
                               <Card key={index} className='m-2'>
                                   <Card.Body>
                                       <Card.Title>{e.name}</Card.Title>
                                       <Card.Text>{e.text}</Card.Text>
                                   </Card.Body>
                                   <Card.Footer>
                                       <Button  variant='warning' onClick={()=>navigate(e.link)}>Consulter</Button>
                                   </Card.Footer>
                               </Card>
                           </Col>
                        )
                    })
                }
            </Row>
        </div>
    )
}
export default HomeAdmin;