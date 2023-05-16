import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {getListCoure, getListTeacher, postFacilities, postStudentCourse} from "../../utils/api.js";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import React, {useCallback} from "react";
import {Button, Container, Form, Row} from "react-bootstrap";
import {Input} from "../form/Input.jsx";
import * as yup from "yup";
import InputList from "../form/InputList.jsx";
import ChooseList from "../form/ChooseList.jsx";

const defaultValue = {
    course: "",
    teacher: "",
};

const validationSchema = yup.object().shape({
    course: yup.string()
        .required("un code de cours est obligatoire !"),
    teacher: yup.string()
        .required("un professeur est obligatoire !"),
});

const CourseStudentForm = ({cancel, listA, listB}) =>
{
    const client = useQueryClient();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: postStudentCourse,
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
        mutation.mutate({
            "course" : values.course,
            "teacher" : values.teacher,
            "student" : localStorage.getItem('id')
        });
    }, [mutation]);

    return (
        <div>
            <Container>
                <Row>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <InputList type="text" name="course" label="Code du cours (AA) :" control={control} listData={listA}/>
                        <InputList type="text" name="teacher" label="Professeur principal" control={control} listData={listB}/>
                        <div className="container">
                            <Button className="m-2" variant="primary" type="submit">ajouter</Button>
                            <Button className="m-2" variant="dark" onClick={()=>cancel(false)}>annuler</Button>
                        </div>
                    </Form>
                </Row>
            </Container>
        </div>)
}
export default CourseStudentForm