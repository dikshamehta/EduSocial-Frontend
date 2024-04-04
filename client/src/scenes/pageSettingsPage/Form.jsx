import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    useMediaQuery,
    Typography,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import { useSelector } from 'react-redux';
import FlexBetween from 'components/FlexBetween';
import { useState } from 'react';
import { red } from '@mui/material/colors';

const serverPort = process.env.REACT_APP_SERVER_PORT;

const pageSchema = yup.object().shape({
  pageName: yup.string().max(75, "Page name must be 75 characters or less"),
  pageType: yup.string(),
  pageDescription: yup.string().max(200, "Page description must be 200 characters or less"),
  pagePictureFile: yup.string(),
});

const initialValues = {
  pageName: "",
  pageType: "",
  pageDescription: "",
  pagePictureFile: "",
};

const Form = (paramPageId) => {
  const { pageId } = paramPageId;
  const { palette } = useTheme();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const token = useSelector((state) => state.token);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    await handleDeletePage(pageId);
    handleCloseDeleteDialog();
  };

  const updatePage = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let value in values) {
        formData.append(value, values[value]);
    }
    formData.append("pagePicturePath", values.pagePictureFile.name);

    const response = await fetch(`http://localhost:${serverPort}/page/${pageId}`, {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    onSubmitProps.resetForm();
    navigate(`/page/${data._id}`);
    };

  const handleFormSubmit = async (values, onSubmitProps) => {
    //Handles form submission
    try {
      await updatePage(values, onSubmitProps);
      onSubmitProps.setSubmitting(false);
    } catch (error) {
      console.log(error);
      onSubmitProps.setSubmitting(false);
    }
  };

  const handleDeletePage = async (pageId) => {
    //Handles page deletion
    try {
      const response = await fetch(`http://localhost:${serverPort}/page/${pageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/home");
    }
    catch (error) {
      console.log(error);
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
              <MenuItem value="school">School</MenuItem>
              <MenuItem value="class">Class</MenuItem>
              <MenuItem value="event">Event</MenuItem>
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
          <Box textAlign="center">
            <Button
              halfWidth
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: red[900],
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
              onClick={() => handleOpenDeleteDialog()}
            >
              {"DELETE PAGE"}
            </Button>
          </Box>
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
              {"UPDATE PAGE"}
            </Button>
          </Box>
          {/* Delete confirmation dialog */}
          <Dialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Delete Page"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this page?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
              <Button onClick={handleConfirmDelete} autoFocus>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      )}
    </Formik>
  );
};

export default Form;