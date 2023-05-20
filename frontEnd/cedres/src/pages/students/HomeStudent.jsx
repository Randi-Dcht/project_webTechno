import {useContext} from "react";
import {Alert, Button, Container} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const home=
    [
        {
            title : "Encoder mes cours",
            explain : "Vous souhaitez ajouter, modifier, supprimer vos cours pour cette année académique.",
            link: "./courses",
        },
        {
            title : "Encoder mes aménagements",
            explain : "Vous souhaitez ajouter, modifier, supprimer vos aménagements spécfiques de votre dossier (cours et examens).",
            link: "./facilities",
        },
        {
            title : "Demande d'aménagement",
            explain : "Vous souhaitez créer, modifier votre demande d'aménagement pour vos cours ou vos examens.",
            link: "./ask",
        },
        {
            title : "Modifier le profil",
            explain : "Vous souhaitez modifier vos informations personnelles (mot de passe, téléphone, mail, ...).",
            link: "./aboutMe",
        },
        {
            title : "Mes documents",
            explain : "Vous souhaitez ajouter ou consulter un de vos documents.",
            link: "./docs",
        },
        {
            title : "Mon planning",
            explain : "Vous souhaitez consulter les dates de remise de documents, de cours ou des aménagements",
            link: "./calendar",
        },
    ]

const HomeStudent = () =>
{
    const navigate = useNavigate();

    return(
        <Container>
            <h3 className='m-3'>Accueil de l'élève</h3>

            {
                home.map((e, index)=>
                {
                    return(
                        <Alert key={index}  variant="secondary">
                            <Alert.Heading>{e.title}</Alert.Heading>
                            <p>
                                {e.explain}
                            </p>
                            <hr />
                            <div className="d-flex justify-content-end">
                                <Button variant="warning" onClick={()=>navigate(e.link)}>
                                    Voir plus
                                </Button>
                            </div>
                        </Alert>
                    )
                })
            }
        </Container>
    )
}
export default HomeStudent;