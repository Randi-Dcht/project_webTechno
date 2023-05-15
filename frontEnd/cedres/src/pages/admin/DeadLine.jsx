import {Container} from "react-bootstrap";
import {useQuery} from "@tanstack/react-query";
import {getListDeadLine} from "../../utils/api.js";
import React from "react";
import DeadLineForm from "../../components/forms/DeadLineForm.jsx";



const DeadLine = () =>
{
    const {data, isLoading} = useQuery(
        {
            queryKey: ['listOfDeadLine'],
            queryFn: getListDeadLine
        });

    return(
        <Container>
            {
                isLoading? <p>Chargement ...</p>:
                <>
                    <DeadLineForm name="development" default_data={data[0]} key={1}/>
                    <DeadLineForm name="course" default_data={data[1]} key={2}/>
                    <DeadLineForm name="session1" default_data={data[2]} key={3}/>
                    <DeadLineForm name="session2" default_data={data[3]} key={4}/>
                    <DeadLineForm name="session3" default_data={data[4]} key={5}/>
                </>
            }
        </Container>
    )
}
export default DeadLine;