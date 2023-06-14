import {Button, Container, Form, Row} from "react-bootstrap";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postResearch, postTeacher} from "../../utils/api.js";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import React, {useCallback, useState} from "react";
import {Input} from "../../components/form/Input.jsx";
import ResearchListTab from "../../components/board/ResearchListTab.jsx";

const Search = ({setVisible, setData, setLoad}) =>
{
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: postResearch,
        onSuccess: async data => {
            await client.invalidateQueries(['research']);
            setLoad(true)
            setVisible(true);
            setData(data)
            console.log(data)

        }
    });

    const {handleSubmit, control} = useForm({
        mode: "onBlur",
    });

    const onSubmit = useCallback(values => {
        mutation.mutate(values);
        setLoad(false)
    }, [mutation]);

    return (
        <div>
            <Row>
                <Form onChange={handleSubmit(onSubmit)}>
                    <Input type="text" name="data" label="Recherche :" control={control}/>
                </Form>
            </Row>
        </div>
    );
}

const Research = () =>
{
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});
    const [load, setLoad] = useState(true)

    return(
        <Container>
            <Search setVisible={setVisible} setData={setData} setLoad={setLoad}/>
            {
                visible? load && <ResearchListTab data={data}/> : <p>pas encore de donnée</p>
            }
        </Container>
    )
}
export default Research