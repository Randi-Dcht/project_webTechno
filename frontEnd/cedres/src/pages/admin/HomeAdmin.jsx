import {Button, Card, CardGroup, Col, Row} from "react-bootstrap";

const listLink =[
    {
        name : "Etudiants",
        link: "",
        text: "Liste des étudiants et consulter les profiles"
    },
    {
        name : "Demandes",
        link: "",
        text: "Liste des demandes (accepter, modifier, consulter)"
    },
    {
        name : "Logger",
        link: "",
        text: "Log de l'application"
    },
    {
        name : "Annuaires",
        link: "",
        text: "Liste de secrétariat, professeurs, cours, ..."
    },
]

const HomeAdmin = () =>
{
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
                                       <Button  variant='warning'>consulter</Button>
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