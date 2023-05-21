import {useNavigate} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postFacilities} from "../../utils/api.js";
import {useForm} from "react-hook-form";
import React, {useCallback} from "react";
import {Button, Container, Form, Row} from "react-bootstrap";
import {Input} from "../form/Input.jsx";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import InputList from "../form/InputList.jsx";
import ChooseList from "../form/ChooseList.jsx";

const defaultValue = {
    name: "",
    description: " ",
    type: "course",
};

const validationSchema = yup.object().shape({
    name: yup.string()
        .required("Un titre est obligatoire !"),
});

const FacilitiesForm = ({cancel, example}) =>
{
    const client = useQueryClient();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: postFacilities,
        onSuccess: async data => {
            await client.invalidateQueries(['listFacilities-exam','listFacilities-course']);
        }
    });

    const {handleSubmit, control} = useForm({
        mode: "onBlur",
        defaultValues: defaultValue,
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = useCallback(values => {
        mutation.mutate({
            "name" : values.name,
            "description" : values.description,
            "type": values.type,
            "student" : localStorage.getItem('id')
        });
    }, [mutation]);

    const list_Type = [
        {
            'key' : 'course',
            'value' : 'Cours'
        },
        {
            'key' : 'exam',
            'value' : 'Examen'
        }
    ]

    return (
        <div>
            <Container>
                <Row>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <ChooseList type="text" name="name" label="Titre aménagement" control={control} listData={example} listName='listExample'/>
                        <Input type="text" name="description" label="Description aménagement" control={control}/>
                        <InputList type="text" name="type" label="Aménagements pour" control={control} listData={list_Type}/>
                        <div className="container">
                            <Button className="m-2" variant="warning" type="submit">Ajouter</Button>
                            <Button className="m-2" variant="outline-secondary" onClick={()=>cancel(false)}>Annuler</Button>
                        </div>
                    </Form>
                </Row>
            </Container>
        </div>
    );

}
export default FacilitiesForm