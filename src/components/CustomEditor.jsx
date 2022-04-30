import React from "react";
import { Editor } from "primereact/editor";
export const CustomEditor = ({
  field, // { name, value, onChange, onBlur }
  form: { initialValues, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  isEdit,
  ...props
}) =>
  isEdit ? (
    <Editor
      style={{
        height: "120px"
      }}
      {...field}
      onTextChange={(e) => setFieldValue("ourSolution", e.htmlValue)}
    />
  ) : (
    <div dangerouslySetInnerHTML={{ __html: initialValues[field.name] }}></div>
  );
