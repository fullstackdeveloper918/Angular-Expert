import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { autoSaveForm } from "../../lib/features/formSlice";

export default function useAutoSaveForm(formValues, delay) {
  const dispatch = useDispatch();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(autoSaveForm(formValues));
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatch, formValues, delay]);
}
