import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    useMediaQuery,
    Typography,
    useTheme,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import FlexBetween from 'components/FlexBetween';
import { useSelector } from 'react-redux';
import PageTypes from 'components/PageTypes';

const pageSchema = yup.object().shape({
  pageName: yup.string().required("Page name is required"),
  pageType: yup.string().required("Page type is required"),
  pageDescription: yup.string().required("Page description is required"),
  pagePictureFile: yup.string().required("Page picture is required"),
});

const initialValues = {
  pageName: "",
  pageType: "",
  pageDescription: "",
  pagePictureFile: "",
};

const Form = () => {
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const token = useSelector((state) => state.token);

  const createPage = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let value in values) { //Loops through values and appends
      formData.append(value, values[value]);
    }
    formData.append("pagePicturePath", values.pagePictureFile.name);
    formData.append("userId", _id);
    
    const response = await fetch("http://localhost:5000/page/create", {
      method: "POST",
      body: formData,
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });
    const data = await response.json();
    onSubmitProps.resetForm();

    navigate(`/page/${data._id}`);
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    //Handles form submission
    try {
      await createPage(values, onSubmitProps);
      onSubmitProps.setSubmitting(false);
    } catch (error) {
      console.log(error);
      onSubmitProps.setSubmitting(false);
    }
  };

  return (
    <Formik
      //onSubmit={handleFormSubmit}
      onSubmit={(values, onSubmitProps) => {
        handleFormSubmit(values, onSubmitProps);
      }}
      initialValues={initialValues}
      validationSchema={pageSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              label="Page Name (75 characters)"
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.pageName) && Boolean(errors.pageName)}
              name="pageName"
              value={values.pageName}
              sx={{ gridColumn: "span 4" }}
              InputProps={{
                inputProps: { maxLength: 75 },
              }}
            />
            <Select
              labelId="page-type-label"
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.pageType) && Boolean(errors.pageType)}
              name="pageType"
              value={values.pageType}
              sx={{ gridColumn: "span 4" }}
            >
              {PageTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Page Description (200 characters)"
              onBlur={handleBlur}
              onChange={handleChange}
              error={
                Boolean(touched.pageDescription) &&
                Boolean(errors.pageDescription)
              }
              name="pageDescription"
              value={values.pageDescription}
              sx={{ gridColumn: "span 4" }}
              InputProps={{
                inputProps: { maxLength: 200 },
              }}
            />
            <Box
              gridColumn="span 4"
              border={`1px solid ${palette.neutral.medium}`}
              borderRadius="5px"
              p="1rem"
            >
              <Dropzone
                acceptedFiles=".jpg,.jpeg,.png"
                multiple={false}
                name="pagePictureFile"
                onDrop={(acceptedFiles) =>
                  setFieldValue("pagePictureFile", acceptedFiles[0])
                }
              >
                {({ getRootProps, getInputProps }) => (
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${palette.primary.main}`}
                    p="1rem"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!values.pagePictureFile ? (
                      <p>Add Picture Here</p>
                    ) : (
                      <FlexBetween>
                        <Typography>{values.pagePictureFile.name}</Typography>
                        <EditOutlinedIcon />
                      </FlexBetween>
                    )}
                  </Box>
                )}
              </Dropzone>
            </Box>
          </Box>

          {/* Buttons */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {"CREATE PAGE"}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
