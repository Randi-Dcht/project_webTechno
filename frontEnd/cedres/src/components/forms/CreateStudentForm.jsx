import {Form} from "react-router-dom";
import {yupResolver} from "@hookform/resolvers/yup";
import Inputs from "../form/Input";
import {Button, Container} from "react-bootstrap";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {useMutation} from "react-query";
import {postNewStudent} from "../../utils/api.js";
import {useCallback} from "react";

const validationSchema = yup.object().shape({
    name: yup.string()
        .required("Is required"),
    surname: yup.string()
        .required("Is required"),
    email: yup.number()
        .required("Is required"),
    matricule: yup.number()
        .required("Is required"),
});

const CreateStudentForm = () =>
{
    const mutation = useMutation({
        mutationFn: postNewStudent,
    })

    const onSubmit = useCallback(values => {
        mutation.mutate(values);
    }, [mutation]);

    const {control, handleSubmit} = useForm({
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return(
        <Container>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <h1>Ajouter un étudiant :</h1>
                <Inputs type="text" name="name" label="Nom étudiant" controls={control}/>
                <Inputs type="text" name="surname" label="Prénom étudiant" controls={control}/>
                <Inputs type="text" name="email" label="Email Université" controls={control}/>
                <Inputs type="text" name="matricule" label="Matricule étudiant" controls={control}/>
                <Button className="m-2" variant="primary" type="submit">ajouter</Button>
            </Form>
        </Container>
    )
}
export default CreateStudentForm();