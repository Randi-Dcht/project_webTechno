import {useNavigate} from "react-router-dom";
import {CONNEXION} from "../utils/routes.js";
import {Alert, Button, Card, Container, Image, Stack} from "react-bootstrap";
import image from "../assets/cedres.png"

const Home = () =>
{
    const navigate = useNavigate();


    return(
        <Container>
            <Image src={image} alt="cèdres" style={{maxHeight: '200px', marginLeft:'50%', transform:'translate(-50%,0)'}}/>

            <Card className="m-3">
                <Card.Header>C'est quoi les cèdres ?</Card.Header>
                <Card.Body>
                    <Card.Title>Cèdres Umons</Card.Title>
                    <Card.Text>
                        Si vous êtes porteur d'une déficience sensorielle ou motrice, de troubles de l'apprentissage, du développement ou d'une maladie, … l'UMONS s'appuie sur les compétences de son service d'accueil et d'accompagnement, Les Cèdres, pour l'accompagnement des étudiants à besoins spécifiques. L'asbl analyse les besoins matériels, pédagogiques, sociaux, culturels, médicaux et psychologiques de l'étudiant et établit, en concertation avec lui, un plan d'accompagnement individualisé.
                        L'UMONS propose également des dispositions spécifiques pour les étudiants sportifs de haut niveau et artistes ainsi que pour les étudiants-entrepreneurs.
                    </Card.Text>
                    <Button variant="light">Go to https://web.umons.ac.be/fr/vie-campus/etudiants-a-besoins-specifiques/</Button>
                </Card.Body>
            </Card>
            <Card className="m-3">
                <Card.Header>C'est quoi cette application cèdres ?</Card.Header>
                <Card.Body>
                    <Card.Title>App Cèdres Umons</Card.Title>
                    <Card.Text>
                        Cette application a été développée dans le but d'améliorer les services informatiques des cèdres. En outre, cette application permet de gérer votre dossier
                        depuis votre navigateur et ainsi pourvoir modifier vos données et vos demandes à tout instant en quelques cliques.
                    </Card.Text>
                    <Stack gap={2} className="col-md-5 mx-auto p-5">
                        <Button onClick={() => navigate(CONNEXION + "/admin")} variant="secondary">Je travaille au cèdre</Button>
                        <Button onClick={() => navigate(CONNEXION + "/student")} variant="outline-secondary">Je suis un étudiant</Button>
                    </Stack>
                </Card.Body>
            </Card>
            <Card className="m-3">
                <Card.Header>Comment s'incrire sur l'app cèdres Umons</Card.Header>
                <Card.Body>
                    <Card.Title>App Cèdres Umons</Card.Title>
                    <Card.Text>
                        Vous ne pouvez pas vous inscrire manuellement sur l'application. Vous devez prendre contact avec le sécrétariat des cèdres pour fixer un
                        rendez-vous et celui-ci, dans le cas d'une demande favorable, vous donnera accès à la plateforme.
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>

    )
}
export default Home;