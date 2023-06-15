import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {Table} from "react-bootstrap";
import {getStudentDocs} from "../../utils/api.js";

const DocsTab = ({student}) =>
{

    const {data, isLoading} = useQuery(
        {
            queryKey: ['listDocs'],
            queryFn: () => getStudentDocs(student)
        });

    const lineTab = useMemo(() =>
    {
        return data?.map(doc =>
        {
            return(
                <tr key={doc.id}>
                    <td>{doc.name}</td>
                    <td>{doc.pushBy}</td>
                    <td><a href="none.pdf">Télécharge</a></td>
                </tr>
            )
        })
    }, [data])


    return(
        <Table>
            <thead>
            <tr>
                <td>Document</td><td>Charger par</td><td>Téléchargements</td>
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
export default DocsTab