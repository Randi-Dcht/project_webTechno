import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Button, Container, Form, Row} from "react-bootstrap";
import {Input} from "../form/Input.jsx";
import React from "react";
import * as yup from "yup";
import InputList from "../form/InputList.jsx";
import {useQuery} from "@tanstack/react-query";
import {getMyExamList, getSelectFaculty} from "../../utils/api.js";

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
});

const StudentForm = ({data_default, onSubmit, name_button}) =>
{
    const {handleSubmit, control} = useForm({
        mode: "onBlur",
        defaultValues: data_default,
        resolver: yupResolver(validationSchema)
    });

    const {data, isLoading} = useQuery(
        {
            queryKey: ['listFaculty'],
            queryFn: getSelectFaculty
        });

    return (
        <div>
            <Row>
                {
                    isLoading? <p>Chargement ...</p>:
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Input type="text" name="name" label="Nom" control={control}/>
                            <Input type="text" name="surname" label="Prénom" control={control}/>
                            <Input type="text" name="email" label="Email Université" control={control}/>
                            <Input type="number" name="matricule" label="Matricule" control={control}/>

                            <Input type="text" name="phone" label="Téléphone (Gsm)" control={control}/>
                            <Input type="text" name="email_private" label="Mail privé" control={control}/>
                            <InputList type="text" name="faculty" label="Facultée" control={control} listData={data}/>

                            <Button className="m-2" variant="primary" type="submit">{name_button}</Button>
                        </Form>
                }
            </Row>
        </div>
    );
}

export default StudentForm;