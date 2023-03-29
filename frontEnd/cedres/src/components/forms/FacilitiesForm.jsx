import {useNavigate} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postFacilities} from "../../utils/api.js";
import {useForm} from "react-hook-form";
import React, {useCallback} from "react";
import {Button, Container, Form, Row} from "react-bootstrap";
import {Input} from "../form/Input.jsx";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";

const defaultValue = {
    name: "",
    description: " ",
    type: "course",
};

const validationSchema = yup.object().shape({
    name: yup.string()
        .required("un titre est obligatoire !"),
});

const FacilitiesForm = ({cancel}) =>
{
    const client = useQueryClient();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: postFacilities,
        onSuccess: async data => {
            await client.invalidateQueries(['listFacilitiesCourse', 'listFacilitiesExam']);
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

    return (
        <div>
            <Container>
                <Row>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Input type="text" name="name" label="Titre aménagement" control={control}/>
                        <Input type="text" name="description" label="Description aménagement" control={control}/>
                        <Input type="text" name="type" label="exam / course" control={control}/>
                        <div className="container">
                            <Button className="m-2" variant="primary" type="submit">ajouter</Button>
                            <Button className="m-2" variant="dark" onClick={()=>cancel(false)}>annuler</Button>
                        </div>
                    </Form>
                </Row>
            </Container>
        </div>
    );

}
export default FacilitiesForm