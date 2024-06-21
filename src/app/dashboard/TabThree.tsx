import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  Fab,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  addCrossSell,
  deleteCrossSell,
  getCrossSells,
  getProductTypes,
  getProducts,
  updateCrossSell,
} from "../api";
import { Add as AddIcon } from "@mui/icons-material";
import { getError } from "../utils";
import { AxiosError } from "axios";
import CloseIcon from "@mui/icons-material/Close";
import toast, { Toaster } from "react-hot-toast";

interface ErrorResponse {
  message: string;
}
interface Product {
  product: string;
  _id: string;
  name: string;
  optimizeDescription: string;
  renewalCostDescription: string;
  bonusPeriod: string;
  salePrice: number;
  basePrice: number;
  pricePerMonth: number;
  period: number;
  discount: number;
  bestChoice: boolean;
  popular: boolean;
  information: {
    featureTooltip: string;
    features: {
      description: string;
      tooltip: string;
    }[];
    securities: {
      description: string;
      tooltip: string;
    }[];
    services: {
      description: string;
      tooltip: string;
    }[];
    specifications: {
      description: string;
      tooltip: string;
    }[];
  };
}
interface CrossSell {
  _id: string;
  option: Product[];
  crossSellOption: Product[];
}

export default function TabThree() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [crossSells, setCrossSells] = useState<CrossSell[]>([]);
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<CrossSell | null>(null);
  const [data, setData] = useState({
    option: [""],
    crossSellOption: [""],
  });
  const handleAddOption = () => {
    setData((prevData) => ({
      ...prevData,
      option: [...prevData.option, ""],
    }));
  };
  const handleRemoveOption = (index: number) => {
    setData((prevData) => {
      const newOption = [...prevData.option];
      newOption.splice(index, 1);
      return { ...prevData, option: newOption };
    });
  };
  const handleOpen = (item?: CrossSell) => {
    if (item) {
      setEditingProduct(item);
      setData({
        option: item.option.map((i) => i._id),
        crossSellOption: item.crossSellOption.map((i) => i._id),
      });
    } else {
      setEditingProduct(null);
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
        const { data } = await getCrossSells();
        setCrossSells(data.crossSells);
        setLoading(false);
      } catch (error) {
        console.log(getError(error as AxiosError<ErrorResponse>));
      }
    };
    fetchData();
  }, [reload]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getProducts();
        setProducts(data);
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
    width: 1000,
    bgcolor: "background.paper",
    border: "2px solid #000",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const updateData = async () => {
    try {
      setLoading(true);
      if (editingProduct) {
        await updateCrossSell(
          editingProduct._id,
          data.option,
          data.crossSellOption
        );
        toast.success("Updated data successfully");
      } else {
        await addCrossSell(data.option, data.crossSellOption);
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
        await deleteCrossSell(id);
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
  console.log(data);
  return (
    <Box style={{ position: "relative", width: "80%", margin: "10px auto" }}>
      <Toaster />
      <TableContainer style={{ borderRadius: "8px" }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Option</StyledTableCell>
              <StyledTableCell>Cross Sell Option</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {crossSells.map((item: CrossSell, index) => (
              <StyledTableRow key={index + 1}>
                <StyledTableCell component="th" scope="row">
                  {index + 1}
                </StyledTableCell>
                <StyledTableCell>
                  {item.option.map((opt: Product) => (
                    <div key={opt._id}>
                      {opt.name} - {opt.period} Months
                    </div>
                  ))}
                </StyledTableCell>
                <StyledTableCell>
                  {item.crossSellOption.map((cross: Product) => (
                    <div key={cross._id}>
                      {cross.name} - {cross.period} Months
                    </div>
                  ))}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Button onClick={() => handleOpen(item)}>Edit</Button>
                  <Button onClick={() => deleteData(item._id)}>Delete</Button>
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
          <h1 style={{ color: "#000", width: "100%" }}>
            {editingProduct ? "Edit Cross Sell" : "Create Cross Sell"}
          </h1>
          <Box style={{ display: "flex", gap: 10 }}>
            <Box style={{ width: "50%" }}>
              {data.option.map((opt, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      width: "100%",
                      mb: 2,
                      alignItems: "center",
                    }}
                  >
                    <FormControl style={{ width: "90%" }}>
                      <InputLabel id="demo-simple-select-autowidth-label">
                        Option
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={opt}
                        onChange={(e) => {
                          const updatedOption = [...data.option];
                          updatedOption[index] = e.target.value;
                          setData({
                            ...data,
                            option: updatedOption,
                          });
                        }}
                        fullWidth
                        label="Option"
                      >
                        {products.map((product: Product, index: number) => (
                          <MenuItem key={index} value={product._id}>
                            {product.name} - {product.period} Months
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <IconButton
                      style={{ width: "10%" }}
                      onClick={() => handleRemoveOption(index)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                );
              })}

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddOption}
                sx={{ mb: 2 }}
              >
                Add Option
              </Button>
            </Box>
            <Box style={{ width: "50%" }}>
              {data.crossSellOption.map((opt, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      width: "100%",
                      mb: 2,
                      alignItems: "center",
                    }}
                  >
                    <FormControl style={{ width: "90%" }}>
                      <InputLabel id="demo-simple-select-autowidth-label">
                        Cross Sell
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={opt}
                        onChange={(e) => {
                          const updatedOption = [...data.crossSellOption];
                          updatedOption[index] = e.target.value;
                          setData({
                            ...data,
                            crossSellOption: updatedOption,
                          });
                        }}
                        fullWidth
                        label="Cross Sell"
                      >
                        {products.map((product: Product, index: number) => (
                          <MenuItem key={index} value={product._id}>
                            {product.name} - {product.period} Months
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                );
              })}
            </Box>
          </Box>
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
