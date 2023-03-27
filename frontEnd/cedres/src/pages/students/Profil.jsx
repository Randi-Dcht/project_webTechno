import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getNewStudent, getStudent, postSignupStudent, updateStudent} from "../../utils/api.js";
import {CONNEXION} from "../../utils/routes.js";
import React, {useCallback} from "react";
import {Container} from "react-bootstrap";
import StudentForm from "../../components/forms/StudentForm.jsx";

const Profil = () =>
{
    const navigate = useNavigate()
    const client = useQueryClient();
    const param = useParams();

    const matriculate = "191919"

    const {data, isLoading} = useQuery(
        {
            queryKey: ['studentMe'],
            queryFn: () => getStudent(matriculate),
        });

    const mutation = useMutation({
        mutationFn: updateStudent,
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
            <h1>Mon profil :</h1>
            {
                isLoading? <p>Chargement ...</p>: <StudentForm onSubmit={onSubmit} name_button="mettre à jour" data_default={
                    {
                        name : data.name,
                        surname : data.surname,
                        email : data.email,
                        matricule : data.matricule,
                        phone : data.phone,
                        email_private : data.email_private,
                        faculty : data.faculty
                    }
                }/>
            }
        </Container>
    )
}

export default Profil