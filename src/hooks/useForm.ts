import { ChangeEvent, FormEvent, useState } from "react";

function useForm<T>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit =
    (callback: () => void) => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setErrors({});

      callback();
    };

  const resetForm = () => setValues(initialValues);

  return {
    values,
    errors,
    handleSubmit,
    handleChange,
    setErrors,
    resetForm,
  };
}

export default useForm;
