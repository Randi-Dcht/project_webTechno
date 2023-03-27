import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Button, Container, Form, Row} from "react-bootstrap";
import {Input} from "../form/Input.jsx";
import React from "react";
import * as yup from "yup";

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
    phone: yup.string()
        .required("Ajouter un téléphone"),
    faculty: yup.string()
        .required("Ajouter votre faculté"),
    password: yup.string()
        .required("un mot de passe !"),
});

const StudentForm = ({data_default, onSubmit}) =>
{
    const {handleSubmit, control} = useForm({
        mode: "onBlur",
        defaultValues: {
            name : data_default.name,
            surname : data_default.surname,
            email : data_default.email,
            matricule : data_default.matricule,
            phone : "",
            email_private : " ",
            faculty : "",
            password : ""
        },
        resolver: yupResolver(validationSchema)
    });

    return (
        <div>
            <Row>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Input type="text" name="name" label="Nom" control={control}/>
                    <Input type="text" name="surname" label="Prénom" control={control}/>
                    <Input type="text" name="email" label="Email Université" control={control}/>
                    <Input type="number" name="matricule" label="Matricule" control={control}/>

                    <Input type="text" name="phone" label="Téléphone (Gsm)" control={control}/>
                    <Input type="text" name="email_private" label="Mail privé" control={control}/>
                    <Input type="text" name="faculty" label="Facultée" control={control}/>
                    <Input type="text" name="password" label="Ton mot de passe" control={control}/>

                    <Button className="m-2" variant="primary" type="submit">ajouter</Button>
                </Form>
            </Row>
        </div>
    );
}

export default StudentForm;