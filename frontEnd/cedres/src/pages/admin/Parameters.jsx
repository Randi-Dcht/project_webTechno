import {Alert, Button, Container} from "react-bootstrap";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getQuadri, postUpdateQuadri} from "../../utils/api.js";
import {useCallback} from "react";
import AdminForm from "../../components/forms/AdminForm.jsx";
import UpdatePassForm from "../../components/forms/UpdatePassForm.jsx";

const ActionButton = ({id, name, color}) =>
{
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: postUpdateQuadri,
        onSuccess: async data => {
            window.location.reload();
        }
    });


    const onSubmit = useCallback(() => {
        mutation.mutate({
            'quadri': id,
        });
    }, [mutation]);

    return(
        <Button onClick={()=>onSubmit()} variant={color===id?'success':'danger'}>{name}</Button>
    )
}

const Parameters = () =>
{
    const {data, isLoading} = useQuery(
        {
            queryKey: ['quadri'],
            queryFn: getQuadri,
        });

    return(
        <Container>
            <h3 className='m-3'>Paramètres de l'App :</h3>
            <Alert variant='danger' className='m-3'>
                <h4>Envoyer des mails</h4>
                <div style={{display:'flex', justifyContent:'space-around'}}>
                    <Button variant='danger'>Mail professeurs</Button>
                    <Button variant='danger'>Mail secrétariats</Button>
                </div>
            </Alert>
            <Alert variant='danger' className='m-3'>
                <h4>Envoyer des mails aux étudiants</h4>
                <div style={{display:'flex', justifyContent:'space-around'}}>
                    <Button variant='danger'>Mail rappel aménagements</Button>
                    <Button variant='danger'>Mail rappel cours</Button>
                    <Button variant='danger'>Mail rappel demandes</Button>
                    <Button variant='danger'>Mail rappel documents</Button>
                </div>
            </Alert>
            <Alert variant='danger' className='m-3'>
                <h4>Choix quadrimestre</h4>
                {
                    isLoading? <p>chargement ...</p>:
                        <div style={{display:'flex', justifyContent:'space-around'}}>
                            {<ActionButton id={"1"} name="Quadrimestre 1" color={data.quadri}/>}
                            {<ActionButton id={"2"} name="Quadrimestre 2" color={data.quadri}/>}
                            {<ActionButton id={"3"} name="Quadrimestre 3" color={data.quadri}/>}
                        </div>
                }
            </Alert>
            <Alert variant='danger' className='m-3'>
                <h4>Réinitialisation App</h4>
                <center>
                    <Button variant='danger'>réinitialisation</Button>
                </center>
            </Alert>
            <Alert variant='danger' className='m-3'>
                <AdminForm/>
            </Alert>
            <Alert variant='danger' className='m-3'>
                <UpdatePassForm url={null}/>
            </Alert>
        </Container>
    )
}
export default Parameters