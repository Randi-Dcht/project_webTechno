import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css"
import {useQuery} from "@tanstack/react-query";
import {getListAction} from "../../utils/api.js";

const localizer = momentLocalizer(moment)

const Calend = () =>
{
    const {data, isLoading} = useQuery(
        {
            queryKey: ['action-list'],
            queryFn: getListAction,
        });

    return(
       <div className="container-fluid text-center align-content-center" style={{width: '100%', marginTop: '10px'}}>
           {
               isLoading? <p>chargement ...</p>:
               <Calendar
                   localizer={localizer}
                   startAccessor="start"
                   endAccessor="end"
                   events={data}
                   style={{ height: '500px' , width: '95%'}}
               />
           }
       </div>
    )
}
export default Calend;