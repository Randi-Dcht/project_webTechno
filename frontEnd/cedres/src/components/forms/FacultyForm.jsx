import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Button, Form, Row} from "react-bootstrap";
import {Input} from "../form/Input.jsx";
import React, {useCallback} from "react";
import * as yup from "yup";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postCourse, postFaculty} from "../../utils/api.js";

const validationSchema = yup.object().shape({
    mail: yup.string()
        .required("Mail du secrétariat"),
    name: yup.string()
        .required("Nom du secrétariat"),
    id: yup.string()
        .required("Abréviation du secrétariat"),
});


const defaultValue = {
    id:"",
    mail: "",
    name: "",
};

const FacultyForm = ({cancel}) =>
{
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: postFaculty,
        onSuccess: async data => {
            await client.invalidateQueries(['listFaculty']);
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
                    <Input type="text" name="id" label="Abréviation faculté (unique) :" control={control}/>
                    <Input type="text" name="name" label="Faculté de :" control={control}/>
                    <Input type="text" name="mail" label="Mail de la faculté :" control={control}/>

                    <div className="container">
                        <Button className="m-2" variant="primary" type="submit">Ajouter</Button>
                        <Button className="m-2" variant="dark" onClick={()=>cancel(false)}>Annuler</Button>
                    </div>
                </Form>
            </Row>
        </div>
    );
}

export default FacultyForm;