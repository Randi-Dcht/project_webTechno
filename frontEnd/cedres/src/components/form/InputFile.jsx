import {Form} from "react-bootstrap";
import {Controller} from "react-hook-form";

export const InputFile = ({control}) =>
{
    return (
        <Controller
            name='file'
            control={control}
            render={({field, fieldState}) =>
            {
                return (<Form.Group>
                    <Form.Control type='file' name='file' onChange={field.onChange} value={field.value}/>
                    <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                </Form.Group>)
            }}
        />
    );
}