import {useContext} from "react";
import {Alert, Button, Container} from "react-bootstrap";

const home=
    [
        {
            title : "Encoder mes cours",
            explain : "Vous souhaitez ajouter, modifier, supprimer vos cours pour cette année académique.",
            link: "/",
        },
        {
            title : "Encoder mes aménagements",
            explain : "Vous souhaitez ajouter, modifier, supprimer vos aménagements spécfiques de votre dossier (cours et examen).",
            link: "/",
        },
        {
            title : "Demande d'aménagement",
            explain : "Vous souhaitez créer, modifier votre demande d'aménagment pour vos cours ou vos examens.",
            link: "/",
        },
        {
            title : "Modifier le profil",
            explain : "Vous souhaitez modifier vos informations personnelles (mot de passe, téléphone, mail, ...).",
            link: "/",
        },
        {
            title : "Mes documents",
            explain : "Vous souhaitez ajouter ou consulter un de vos documents.",
            link: "/",
        },
        {
            title : "Mon planning",
            explain : "Consulter les dates de remise de document, de cours ou des aménagements",
            link: "/",
        },
    ]

const HomeStudent = () =>
{
    return(
        <Container>
            <h3 className='m-3'>Accueil élève</h3>

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
                                <Button>
                                    voir plus
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