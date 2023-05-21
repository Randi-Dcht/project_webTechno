import {Form} from "react-bootstrap";
import {Controller} from "react-hook-form";

export const InputFile = ({control, register}) =>
{
    return (
        <Controller
            name='file'
            control={control}
            render={({field, fieldState}) =>
            {
                return (<Form.Group>
                    <Form.Control {...register} type='file' name='file' onChange={field.onChange} value={field.value} accept=".pdf"/>
                    <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                </Form.Group>)
            }}
        />
    );
}