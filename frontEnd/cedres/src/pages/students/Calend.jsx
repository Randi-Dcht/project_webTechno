import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = momentLocalizer(moment)

const Calend = () =>
{
    return(
       <div className="container-fluid text-center align-content-center" style={{width: '100%', marginTop: '10px'}}>
           <Calendar
               localizer={localizer}
               startAccessor="start"
               endAccessor="end"
               style={{ height: '500px' , width: '95%'}}
           />
       </div>
    )
}
export default Calend;