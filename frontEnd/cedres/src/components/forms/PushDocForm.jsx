import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postDocuments} from "../../utils/api.js";
import {useForm} from "react-hook-form";
import React, {useCallback, useEffect, useState} from "react";
import {Button, Container, Form, Row} from "react-bootstrap";
import InputList from "../form/InputList.jsx";
import {Input} from "../form/Input.jsx";
import {InputFile} from "../form/InputFile.jsx";
import data from "bootstrap/js/src/dom/data.js";

const listB =[
    {
        'key' : '',
        'value' : 'Choisir'
    },
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

    const initialFileValue = ""

    const mutation = useMutation({
        mutationFn: postDocuments,
        onSuccess: async data => {
            await client.invalidateQueries(['listDocs']);
        }
    });

    const {handleSubmit, control, register, setValue} = useForm({
        mode: "onBlur",
    });

    useEffect(() =>
    {
        setValue('file', initialFileValue);
    }, [setValue, initialFileValue]);

    const onSubmit = useCallback(values => {
        console.log(values.file)
        const formData = new FormData();
        formData.append('file', values.file);
        formData.append('name', values.name)
        formData.append('student', localStorage.getItem('id'))
        formData.append('pushBy', "student")
        mutation.mutate(formData);
    }, [mutation]);

    return (
        <div>
            <Container>
                <Row>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <InputFile control={control} register={()=>register('file')}/>
                        <InputList type="text" name="name" label="Nom du fichier" control={control} listData={listB}/>
                        <div className="container">
                            <Button className="m-2" variant="warning" type="submit">Ajouter</Button>
                            <Button className="m-2" variant="outline-secondary" onClick={()=>cancel(false)}>Annuler</Button>
                        </div>
                    </Form>
                </Row>
            </Container>
        </div>)
}
export default PushDocForm