import { ChangeEvent, FormEvent, useState } from "react";

function useForm<T>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
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

  const setValue = (name: string, value: string) => {
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  return {
    values,
    setValues,
    setValue,
    errors,
    handleSubmit,
    handleChange,
    setErrors,
    resetForm,
  };
}

export default useForm;
