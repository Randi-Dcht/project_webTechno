import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Button, Container, Form, Row} from "react-bootstrap";
import {Input} from "../form/Input.jsx";
import React, {useCallback} from "react";
import * as yup from "yup";
import {useNavigate} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postNewStudent, postTeacher} from "../../utils/api.js";

const validationSchema = yup.object().shape({
    name: yup.string()
        .required("Merci de donner le nom"),
    surname: yup.string()
        .required("Merci de donner le prénom"),
    email: yup.string()
        .required("Merci de donner un mail"),
});

const defaultValue = {
    name: "",
    surname: "",
    email: "",
};

const TeacherForm = ({cancel}) =>
{
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: postTeacher,
        onSuccess: async data => {
            await client.invalidateQueries(['listTeacher']);
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
            <Row>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Input type="text" name="name" label="Nom" control={control}/>
                    <Input type="text" name="surname" label="Prénom" control={control}/>
                    <Input type="text" name="email" label="Email Université" control={control}/>

                    <div className="container">
                        <Button className="m-2" variant="warning" type="submit">Ajouter</Button>
                        <Button className="m-2" variant="outline-secondary" onClick={()=>cancel(false)}>Annuler</Button>
                    </div>
                </Form>
            </Row>
        </div>
    );
}

export default TeacherForm;