import {Button, Card, CardGroup} from "react-bootstrap";

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
]

const HomeAdmin = () =>
{
    return(
        <div>
            <h2 className="m-4">Accueil administration</h2>
            <CardGroup>
                {
                    listLink.map((e, index)=>
                    {
                        return(
                            <Card key={index} className='m-2'>
                                <Card.Body>
                                    <Card.Title>{e.name}</Card.Title>
                                    <Card.Text>{e.text}</Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <Button  variant='warning'>consulter</Button>
                                </Card.Footer>
                            </Card>
                        )
                    })
                }
            </CardGroup>
        </div>
    )
}
export default HomeAdmin;