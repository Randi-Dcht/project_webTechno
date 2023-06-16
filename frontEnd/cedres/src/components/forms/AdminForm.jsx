import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Button, Container, Form, Row} from "react-bootstrap";
import {Input} from "../form/Input.jsx";
import React, {useCallback} from "react";
import * as yup from "yup";
import InputList from "../form/InputList.jsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getMyExamList, getSelectFaculty, postStudentCourse} from "../../utils/api.js";
import {useNavigate} from "react-router-dom";
import ChooseList from "../form/ChooseList.jsx";

const validationSchema = yup.object().shape({
    name: yup.string()
        .required("Merci de donner le nom"),
    email: yup.string()
        .required("Pour envoyer, il faut un mail"),
});

const AdminForm = () =>
{
    const client = useQueryClient();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: null,
        onSuccess: async data => {
            await client.invalidateQueries(['listAdmin']);
        }
    });

    const {handleSubmit, control} = useForm({
        mode: "onBlur",
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = useCallback(values => {
        mutation.mutate(values);
    }, [mutation]);

    const data = [
        {
            'key' : 'Admin',
            'value' : 'admin'
        },
        {
            'key' : 'Grade1',
            'value' : 'Grade1'
        },
        {
            'key' : 'Grade2',
            'value' : 'Grade2'
        }
    ]

    return (
        <div>
            <Row>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Input type="text" name="name" label="Nom et prénom" control={control}/>
                    <Input type="text" name="email" label="Email de connexion" control={control}/>
                    <Input type="password" name="password" label="Mot de passe" control={control}/>
                    <InputList type="text" name="grade" label="Son grade" control={control} listData={data}/>

                    <Button className="m-2" variant="warning" type="submit">Ajouter</Button>
                </Form>
            </Row>
        </div>
    );
}

export default AdminForm;