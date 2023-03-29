import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {Table} from "react-bootstrap";

const DocsTab = ({url}) =>
{
    /*
    const {data, isLoading} = useQuery(
        {
            queryKey: ['listDocs'],
            queryFn: () => url
        });

    const lineTab = useMemo(() =>
    {
        return data?.map(doc =>
        {
            return(
                <tr key={doc.id}>
                    <td>{doc.name}</td>
                    <td>{doc.description}</td>
                </tr>
            )
        })
    }, [data])
*/

    return(
        /*isLoading?
            <p>en chargement ...</p>:*/
            <Table>
                <thead>
                <tr>
                    <td>Nom</td><td>Date</td><td>Téléchargement</td>
                </tr>
                </thead>
                <tbody>
                {
                   // lineTab
                }
                </tbody>
            </Table>
    )
}
export default DocsTab