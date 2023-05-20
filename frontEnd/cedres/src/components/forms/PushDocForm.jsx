import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postDocuments} from "../../utils/api.js";
import {useForm} from "react-hook-form";
import React, {useCallback, useState} from "react";
import {Button, Container, Form, Row} from "react-bootstrap";
import InputList from "../form/InputList.jsx";
import {Input} from "../form/Input.jsx";
import {InputFile} from "../form/InputFile.jsx";
import data from "bootstrap/js/src/dom/data.js";

const listB =[
    {
        'key' : 'Choisir',
        'value' : ' '
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

    const [file, setFile] = useState(" ");

    const mutation = useMutation({
        mutationFn: postDocuments,
        onSuccess: async data => {
            await client.invalidateQueries(['listDocs']);
        }
    });

    const {handleSubmit, control, register} = useForm({
        mode: "onBlur",
    });

    const onSubmit = useCallback(values => {
        mutation.mutate({
            "name" : values.name,
            "student" : localStorage.getItem('id'),
            "pushBy" : "student",
            file: values.file
        });
        console.log(values.file)
    }, [mutation]);

    return (
        <div>
            <Container>
                <Row>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <InputFile control={control} />
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