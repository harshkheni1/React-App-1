import React from "react";
import { getFieldValue } from "../_helpers/_helperFunctions";
export const CustomTextField = ({
  field, // { name, value, onChange, onBlur }
  form: { initialValues }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  isEdit,
  innerClassName,
  ...props
}) =>
  isEdit ? (
    <input type="text" {...field} {...props} />
  ) : (
    <b className={innerClassName ? "mx-1 " + innerClassName : "mx-1"}>
      {getFieldValue(initialValues, field.name)}
    </b>
  );
