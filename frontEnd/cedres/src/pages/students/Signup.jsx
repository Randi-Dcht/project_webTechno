import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getNewStudent, postSignupStudent, postUpdatePasswordStudent} from "../../utils/api.js";
import React, {useCallback, useState} from "react";
import {Button, Container, Form, Tab, Tabs} from "react-bootstrap";
import StudentForm from "../../components/forms/StudentForm.jsx";
import {CONNEXION, STUDENT} from "../../utils/routes.js";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {Input} from "../../components/form/Input.jsx";

const PasswordTab = ({matricule}) =>
{
    const client = useQueryClient();
    const navigate = useNavigate();

    const validationSchema = yup.object().shape({
        newPassword: yup.string()
            .required("Problème de mot de passe !"),
    });

    const mutation = useMutation({
        mutationFn: postUpdatePasswordStudent,
        onSuccess: async e => {
            navigate(CONNEXION + '/student')
        },
    });
    const {handleSubmit, control} = useForm({
        mode: "onBlur",
        defaultValues: {newPassword: ""},
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = useCallback(values => {
        mutation.mutate({
            "matricule" : matricule,
            "password" : 'admin123',
            "newPassword" : values.newPassword
        });
    }, [mutation]);

    return(
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Input type="text" name="newPassword" label="Ajouter un mot de passe" control={control}/>
                <Button className="m-2" variant="primary" type="submit">C'est bon</Button>
            </Form>
        </>
    )
}

const Signup = () =>
{
    const navigate = useNavigate()
    const client = useQueryClient();
    const param = useParams();
    const [tabActif, setTabActif] = useState('aboutMe');

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
            setTabActif('connectMe');
        }
    });


    const onSubmit = useCallback(values => {
        mutation.mutate(values);
    }, [mutation]);

    return(
        <Container>
            <h2 className="m-3">Première connexion :</h2>
            <Tabs
                defaultActiveKey={tabActif}
                activeKey={tabActif}
                id="tab-signup"
                className="mb-3"

                justify
            >
                <Tab eventKey="aboutMe" title="Données" disabled>
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
                </Tab>
                <Tab eventKey="connectMe" title="Connexion" disabled>
                    {
                        isLoading ? <p>Chargement ...</p> : <PasswordTab matricule={data.matricule}/>
                    }
                </Tab>
            </Tabs>
        </Container>
    )
}

export default Signup;