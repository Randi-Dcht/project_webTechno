import {Form} from "react-bootstrap";
import {Controller} from "react-hook-form";

const InputList = ({name, label, control, listData}) =>
{
    return(
        <Controller
            name={name}
            control={control}
            render={({field, fieldState}) => {
                return <Form.Group>
                    <Form.Label>{label}</Form.Label>
                    <Form.Select value={field.value} onChange={field.onChange} placeholder={label}>
                        {
                            listData.map(e => {
                                return <option key={e.key} value={e.key}>{e.value}</option>
                            })
                        }
                    </Form.Select>
                    <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                </Form.Group>
            }}
        />
    )
}
export default InputList