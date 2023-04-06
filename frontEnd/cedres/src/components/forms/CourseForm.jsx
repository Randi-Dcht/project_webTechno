import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Button, Form, Row} from "react-bootstrap";
import {Input} from "../form/Input.jsx";
import React, {useCallback} from "react";
import * as yup from "yup";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postCourse} from "../../utils/api.js";
import InputList from "../form/InputList.jsx";

const validationSchema = yup.object().shape({
    id_aa: yup.string()
        .required("AA du cours ! (unique)"),
    name: yup.string()
        .required("Nom du cours"),
    quadrimester: yup.number()
        .required("Quadrimestre du cours")
        .min(1)
        .max(2),
    passExam: yup.number()
        .required("Sessions : 8 - 11 - 12")
        .min(8)
        .max(12)
});


const defaultValue = {
    id_aa: "",
    name: "",
    year: "none",
    quadrimester: 0,
    passExam: 0,
};

const TeacherForm = ({cancel}) =>
{
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: postCourse,
        onSuccess: async data => {
            await client.invalidateQueries(['listCourse']);
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

    const listToChoose = [
        {
            value: "Janvier et Aout",
            key: 8
        },
        {
            value: "Juin et Aout",
            key: 11
        },
        {
            value: "Janvier et Juin et Aout",
            key: 12
        },
    ]

    return (
        <div>
            <Row>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Input type="text" name="id_aa" label="AA du cours" control={control}/>
                    <Input type="text" name="name" label="Nom du cours" control={control}/>
                    <Input type="number" name="quadrimester" label="Quel quadrimestre" control={control}/>
                    <InputList type="number" listData={listToChoose} listName="list1" name="passExam" label="Session examen" control={control}/>

                    <div className="container">
                        <Button className="m-2" variant="primary" type="submit">ajouter</Button>
                        <Button className="m-2" variant="dark" onClick={()=>cancel(false)}>annuler</Button>
                    </div>
                </Form>
            </Row>
        </div>
    );
}

export default TeacherForm;