import {Button, Form} from "react-bootstrap";
import React, {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";
import * as yup from "yup";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postloginStudent, postNewStudent} from "../../utils/api.js";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Input} from "../form/Input.jsx";

const defaultValue = {
    mail: "",
    password: ""
};

const validationSchema = yup.object().shape({
    password: yup.string()
        .required("mot de passe est obligatoire"),
    mail: yup.string()
        .required("mail est obligatoire"),
});

const Connect = ({redirect, setUrl, name}) =>
{
    const [isVisible, setVisible] = useState(false);
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: postloginStudent,
        onSuccess: async data => {
            console.log(data[0].id) //TODO remove
            console.log(data[1].token) //TODO remove
            localStorage.setItem('id', data[0].id)
            localStorage.setItem('token', data[1].token)
            navigate(redirect)
            setUrl(name)
        },
        onError: async error =>{
            console.log()
            if (error.response.status === 401)
                setError("Problème mot de passe")
            else
                setError("Problème d'utilisateur")
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

    return(
        <Form onSubmit={handleSubmit(onSubmit)}>
            {error!== "" && <div className="container-fluid text-capitalize m-2" style={{color:'red', fontWeight: 'bolder'}}>{error}</div>}
            <Input type="mail" name="mail" label="Email Umons" control={control}/>
            <Input type={isVisible?"text":"password"} name="password" label="Mot de passe" control={control}/>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check onChange={() => setVisible(!isVisible)} type="checkbox" label="vérifier mot de passe" />
            </Form.Group>
            <Button className="m-2" variant="primary" type="submit">ajouter</Button>
        </Form>
    )
}
export default Connect;