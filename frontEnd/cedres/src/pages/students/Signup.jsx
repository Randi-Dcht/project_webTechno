import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getNewStudent, postSignupStudent} from "../../utils/api.js";
import React, {useCallback} from "react";
import {Container} from "react-bootstrap";
import StudentForm from "../../components/forms/StudentForm.jsx";
import {CONNEXION, STUDENT} from "../../utils/routes.js";



const Signup = () =>
{
    const navigate = useNavigate()
    const client = useQueryClient();
    const param = useParams();

    const matriculate = param.id

    if (matriculate == null)
        navigate('/')

    const {data, isLoading} = useQuery(
        {
            queryKey: ['studentSignup'],
            queryFn: () => getNewStudent(matriculate),
        });

    const mutation = useMutation({
        mutationFn: postSignupStudent,
        onSuccess: async data => {
            await client.invalidateQueries(['student']);
            navigate(CONNEXION + '/student')
        }
    });


    const onSubmit = useCallback(values => {
        mutation.mutate(values);
    }, [mutation]);

    return(
        <Container>
            <h1>Première connexion :</h1>
            {
                isLoading? <p>Chargement ...</p>: <StudentForm onSubmit={onSubmit} name_button="Créer le compte" data_default={
                    {
                        name : data.name,
                        surname : data.surname,
                        email : data.email,
                        matricule : data.matricule,
                        phone : "",
                        email_private : " ",
                        faculty : ""
                    }
                }/>
            }
        </Container>
    )
}

export default Signup;