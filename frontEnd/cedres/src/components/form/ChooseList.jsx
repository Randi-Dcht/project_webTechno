import {Form} from "react-bootstrap";
import {Controller} from "react-hook-form";

const ChooseList = ({name, label, control, listData, listName}) =>
{
    return(
        <Controller
            name={name}
            control={control}
            render={({field, fieldState}) => {
                return <Form.Group>
                    <datalist id={listName}>
                        {
                            listData.map(e => {
                                return <option key={e.key} name={e.value} value={e.key} title={e.value}>{e.value}</option>
                            })
                        }
                    </datalist>
                    <Form.Label>{label}</Form.Label>
                    <Form.Control type='text' value={field.value} onChange={field.onChange} placeholder={label} list={listName}/>
                    <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                </Form.Group>
            }}
        />
    )
}
export default ChooseList