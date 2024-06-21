import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  Fab,
  FormControl,
  InputLabel,
  Modal,
  OutlinedInput,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  createProduct,
  createProductType,
  deleteProduct,
  deleteProductType,
  getProductTypes,
  getProducts,
  updateProduct,
  updateProductType,

} from "../api";
import AddIcon from "@mui/icons-material/Add";
import { getError } from "../utils";
import { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";

interface ProductTypes {
  _id: string;
  name: string;
}

interface ErrorResponse {
  message: string;
}

export default function TabOne() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [productTypes, setProductTypes] = useState<ProductTypes[]>([]);
  const [reload, setReload] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductTypes | null>(
    null
  );

  const handleOpen = (product?: ProductTypes) => {

    if (product) {
      setEditingProduct(product);
      setName(product.name);
    } else {
      setEditingProduct(null);
      setName("");
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
    setName("");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await getProductTypes();
        setProductTypes(data);

        setLoading(false);
      } catch (error) {
        console.log(getError(error as AxiosError<ErrorResponse>));
      }
    };
    fetchData();
  }, [reload]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
  };

  const updateData = async () => {
    try {
      setLoading(true);
      if (editingProduct) {
        await updateProductType(editingProduct._id, name);
        toast.success("Updated data successfully");
      } else {
        await createProductType(name);

        toast.success("Created data successfully");
      }
      setLoading(false);
      handleClose();
    } catch (error) {
      console.log(getError(error as AxiosError<ErrorResponse>));
      toast.error(getError(error as AxiosError<ErrorResponse>));
    } finally {
      setReload(!reload);
    }
  };

  const deleteData = async (id: string) => {
    try {
      setLoading(true);
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this data?"
      );
      if (confirmDelete) {
        await deleteProductType(id);
        setLoading(false);
        setReload(!reload);
        toast.success("Deleted data successfully");
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(getError(error as AxiosError<ErrorResponse>));
      toast.error(getError(error as AxiosError<ErrorResponse>));
      setLoading(false);
    }
  };

  return (
    <Box style={{ position: "relative", width: "80%", margin: "10px auto" }}>
      <Toaster />
      <TableContainer style={{ borderRadius: "8px" }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Product Name</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productTypes.map((product, index) => (

              <StyledTableRow key={index + 1}>
                <StyledTableCell component="th" scope="row">
                  {index + 1}
                </StyledTableCell>
                <StyledTableCell>{product.name}</StyledTableCell>
                <StyledTableCell align="right">
                  <Button onClick={() => handleOpen(product)}>Edit</Button>
                  <Button onClick={() => deleteData(product._id)}>
                    Delete
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab
        style={{ position: "fixed", right: "5%", bottom: "5%" }}
        color="primary"
        aria-label="add"
        onClick={() => handleOpen()}
      >
        <AddIcon />
      </Fab>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
        style={{ background: "transparent" }}
      >
        <Box sx={style}>
          <h1 style={{ color: "#000" }}>
            {editingProduct ? "Edit Product" : "Create Product"}
          </h1>
          <FormControl fullWidth sx={{ m: "10px 0" }}>
            <InputLabel htmlFor="outlined-adornment-amount">
              Product Name
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              label="Product Name"
            />
          </FormControl>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button variant="contained" onClick={updateData}>
              {editingProduct ? "Update" : "Create"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
