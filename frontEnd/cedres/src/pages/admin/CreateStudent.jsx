import {Input} from "../../components/form/Input";
import {Button, Container, Form, Row} from "react-bootstrap";
import React, {useCallback} from "react";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup.js";
import {Link, useNavigate} from "react-router-dom";
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
        .required("Is required"),
    surname: yup.string()
        .required("Is required"),
    email: yup.string()
        .required("Is required"),
    matricule: yup.number()
        .required("Is required"),
});


const CreateStudent = () =>
{
    const navigate = useNavigate()
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: postNewStudent,
        onSuccess: async data => {
            await client.invalidateQueries(['create-student']);
            navigate("/")
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
                <h1>Ajouter un étudiant :</h1>
                <Row>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Input type="text" name="name" label="Nom étudiant" control={control}/>
                        <Input type="text" name="surname" label="Prénom étudiant" control={control}/>
                        <Input type="text" name="email" label="Email Université" control={control}/>
                        <Input type="number" name="matricule" label="Matricule étudiant" control={control}/>
                        <Button className="m-2" variant="primary" type="submit">ajouter</Button>
                    </Form>
                </Row>
            </Container>
        </div>
    );

}
export default CreateStudent;