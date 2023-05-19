import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {Table} from "react-bootstrap";

const FacilitiesTab = ({getter, name}) =>
{

    const {data, isLoading} = useQuery(
        {
            queryKey: name,
            queryFn: () => getter
        });

    const lineTab = useMemo(() =>
    {
        return data?.map(facilitie =>
        {
            return(
                <tr key={facilitie.id}>
                    <td>{facilitie.name}</td>
                    <td>{facilitie.description}</td>
                </tr>
            )
        })
    }, [data])


    return(
        isLoading?
        <p>Chargement ...</p>:
                <Table key={name}>
                    <thead>
                    <tr>
                        <td>Nom</td><td>Description</td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        lineTab
                    }
                    </tbody>
                </Table>
    )
}
export default FacilitiesTab;