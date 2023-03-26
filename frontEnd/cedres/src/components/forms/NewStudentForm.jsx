import {Form} from "react-router-dom";
import {yupResolver} from "@hookform/resolvers/yup";
import {Input} from "../form/Input";
import {Button} from "react-bootstrap";
import {useForm} from "react-hook-form";
import * as yup from "yup";

const defaultValue = {
    name: "",
    surname: "",
    email: "",
    matricule: 1,
};

const validationSchema = yup.object().shape({
    name: yup.string()
        .required("Is required"),
    surname: yup.string()
        .required("Is required"),
    email: yup.string()
        .required("Is required"),
    matricule: yup.number()
        .required("Is required"),
});

const NewStudentForm = ({onSubmit}) =>
{
    const {control, handleSubmit} = useForm({
        mode: "onBlur",
        defaultValues: defaultValue,
        resolver: yupResolver(validationSchema)
    });

    return(
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Input type="text" name="name" label="Nom étudiant" controls={control}/>
            <Input type="text" name="surname" label="Prénom étudiant" controls={control}/>
            <Input type="text" name="email" label="Email Université" controls={control}/>
            <Input type="number" name="matricule" label="Matricule étudiant" controls={control}/>
            <Button className="m-2" variant="primary" type="submit">ajouter</Button>
        </Form>
    )
}
export default NewStudentForm;