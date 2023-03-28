import * as yup from "yup";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import React, {useCallback, useState} from "react";
import {Button, Container, Form, Row} from "react-bootstrap";
import {Input} from "../form/Input.jsx";
import {yupResolver} from "@hookform/resolvers/yup";

const defaultValue = {
    password: "",
    newPassword: ""
};

const validationSchema = yup.object().shape({
    password: yup.string()
        .required("Merci de donner votre ancien mot de passe"),
    newPassword: yup.string()
        .required("Merci de donner le nouveau mot de passe"),
});

const UpdatePassForm = ({url}) =>
{
    const client = useQueryClient();
    const [ischange, setChange] = useState("");

    const mutation = useMutation({
        mutationFn: url,
        onSuccess: async e => {
            setChange("true")
        },
        onError: async i =>{
            setChange("false")
        }
    });

    const {handleSubmit, control} = useForm({
        mode: "onBlur",
        defaultValues: defaultValue,
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = useCallback(values => {
        mutation.mutate({
            "matricule" : localStorage.getItem('id'),
            "password" : values.password,
            "newPassword" : values.newPassword
        });
    }, [mutation]);

    return (
        <div>
            <Container>
                <Row>
                    {
                        ischange === "true" && <div className="container-fluid text-center" style={{color:'green'}}>Mot de passe est changé !</div>
                    }
                    {
                        ischange === "false" && <div className="container-fluid text-center" style={{color:'red'}}>Erreur lors du changement !</div>
                    }
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Input type="text" name="password" label="Ancien mot de passe" control={control}/>
                        <Input type="text" name="newPassword" label="Nouveau mot de passe" control={control}/>
                        <Button className="m-2" variant="primary" type="submit">changer</Button>
                    </Form>
                </Row>
            </Container>
        </div>)
}
export default UpdatePassForm