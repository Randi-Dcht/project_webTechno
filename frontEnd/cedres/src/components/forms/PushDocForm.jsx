import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {postDocuments, postStudentCourse} from "../../utils/api.js";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import React, {useCallback} from "react";
import {Button, Container, Form, Row} from "react-bootstrap";
import InputList from "../form/InputList.jsx";
import {Input} from "../form/Input.jsx";
import * as yup from "yup";

const listB =[
    {
        'key' : 'pae',
        'value' : 'P.A.E.'
    },
    {
        'key' : 'pai',
        'value' : 'P.A.I.'
    },
    {
        'key' : 'demande',
        'value' : 'Demande introduction'
    },
]

const PushDocForm = ({cancel}) =>
{
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: postDocuments,
        onSuccess: async data => {
            await client.invalidateQueries(['listDocs']);
        }
    });

    const {handleSubmit, control} = useForm({
        mode: "onBlur",
    });

    const onSubmit = useCallback(values => {
        mutation.mutate({
            "name" : values.name,
            "file" : values.file,
            "student" : localStorage.getItem('id'),
            "pushBy" : "student"
        });
    }, [mutation]);

    return (
        <div>
            <Container>
                <Row>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Input type="file" name="file" label="Fichier :" control={control}/>
                        <InputList type="text" name="name" label="Nom du fichier" control={control} listData={listB}/>
                        <div className="container">
                            <Button className="m-2" variant="primary" type="submit">Ajouter</Button>
                            <Button className="m-2" variant="dark" onClick={()=>cancel(false)}>Annuler</Button>
                        </div>
                    </Form>
                </Row>
            </Container>
        </div>)
}
export default PushDocForm