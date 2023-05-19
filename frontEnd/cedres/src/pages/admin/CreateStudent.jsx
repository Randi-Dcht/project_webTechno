import {Input} from "../../components/form/Input";
import {Button, Container, Form, Row} from "react-bootstrap";
import React, {useCallback} from "react";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup.js";
import {useNavigate} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postNewStudent} from "../../utils/api.js";


const defaultValue = {
    name: "",
    surname: "",
    email: "",
    matricule: 1,
};

const validationSchema = yup.object().shape({
    name: yup.string()
        .required("Merci de donner le nom"),
    surname: yup.string()
        .required("Merci de donner le prénom"),
    email: yup.string()
        .required("Pour envoyer, il faut un mail"),
    matricule: yup.number()
        .required("Is required")
        .min(6, "La taille est incorrect"),
});


const CreateStudent = () =>
{
    const navigate = useNavigate()
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: postNewStudent,
        onSuccess: async data => {
            navigate("/cedres/students")
        }
    });

    const {handleSubmit, control} = useForm({
        mode: "onBlur",
        defaultValues: defaultValue,
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = useCallback(values => {
        mutation.mutate(values);
    }, [mutation]);

    return (
        <div>
            <Container>
                <h3 className="m-2">Ajouter un étudiant :</h3>
                <Row>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Input type="text" name="name" label="Nom étudiant" control={control}/>
                        <Input type="text" name="surname" label="Prénom étudiant" control={control}/>
                        <Input type="text" name="email" label="Email Université" control={control}/>
                        <Input type="number" name="matricule" label="Matricule étudiant" control={control}/>
                        <Button className="m-2" variant="primary" type="submit">Ajouter</Button>
                    </Form>
                </Row>
            </Container>
        </div>
    );

}
export default CreateStudent;