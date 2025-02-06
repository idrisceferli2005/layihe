import * as yup from "yup";

export const productSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  price: yup.number().required("Price is required").positive(),
  category: yup.string().required("Category is required"),
  image: yup.mixed().required("Image is required"),
});
