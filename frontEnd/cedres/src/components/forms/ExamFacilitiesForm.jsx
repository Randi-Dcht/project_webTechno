import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Button, Container, Form, Row} from "react-bootstrap";
import {Input} from "../form/Input.jsx";
import React, {useCallback} from "react";
import * as yup from "yup";
import InputList from "../form/InputList.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getMyExam, postMyExam} from "../../utils/api.js";


const list_Type = [
    {
        'key' : '?',
        'value' : 'je ne sais pas !'
    },
    {
        'key' : 'ecrit',
        'value' : 'ecrit'
    },
    {
        'key' : 'oral',
        'value' : 'oral'
    },
    {
        'key' : 'oral/ecrit',
        'value' : 'oral/ecrit'
    }
]

const ExamFacilitiesForm = ({data_default}) =>
{
    const mutation = useMutation({
        mutationFn: postMyExam,
        onSuccess: async data => {
            await client.invalidateQueries(['examFacilitie']);
        }
    });

    const {handleSubmit, control} = useForm({
        mode: "onBlur",
        defaultValues: data_default,
    });


    const onSubmit = useCallback(values => {
        mutation.mutate(values);
    }, [mutation]);

    return (
        <div>
            <Row>
                <h4>Aménagement pour {data_default.course} ({data_default.aa})</h4>
                <Form onSubmit={handleSubmit(onSubmit)} onChange={handleSubmit(onSubmit)}>
                    <Input type="hidden" name="id" label="" control={control}/>
                    <Input type="date" name="date" label="Date de l'examen" control={control}/>
                    <Input type="time" name="hour" label="Heure de l'examen" control={control}/>
                    <Input type="text" name="local" label="Local de l'examen" control={control}/>
                    <InputList type="text" name="type" label="Type examen" control={control} listData={list_Type}/>


                </Form>
            </Row>
        </div>
    );
}

export default ExamFacilitiesForm;