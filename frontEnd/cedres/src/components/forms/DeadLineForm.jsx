import {useMutation} from "@tanstack/react-query";
import {postDeadLine} from "../../utils/api.js";
import {useForm} from "react-hook-form";
import React, {useCallback} from "react";
import {Form, Row} from "react-bootstrap";
import {Input} from "../form/Input.jsx";

const DeadLineForm = ({name, default_data}) =>
{
    const mutation = useMutation({
        mutationFn: postDeadLine,
        onSuccess: async data => {
            await client.invalidateQueries([name]);
        }
    });

    const {handleSubmit, control} = useForm({
        mode: "onBlur",
        defaultValues: default_data,
    });


    const onSubmit = useCallback(values => {
        mutation.mutate(values);
    }, [mutation]);

    return (
        <Row key={name}>
            <h4>Agenda pour {name}</h4>
            <Form onChange={handleSubmit(onSubmit)}>
                <Input type="hidden" name="id" label="" control={control}/>
                <Input type="date" name="date_start" label="Début" control={control}/>
                <Input type="date" name="date_end" label="Fin" control={control}/>
            </Form>
        </Row>
    );
}

export default DeadLineForm