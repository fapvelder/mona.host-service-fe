import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  Checkbox,
  Fab,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  createProduct,
  deleteProduct,
  getProductTypes,
  getProducts,
  updateProduct,
} from "../api";
import { getError } from "../utils";
import { AxiosError } from "axios";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import toast, { Toaster } from "react-hot-toast";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Product {
  product: {
    _id: string;
    name: string;
  };
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

interface ErrorResponse {
  message: string;
}

export default function TabTwo() {
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productTypes, setProductTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);
  const [productData, setProductData] = useState({
    product: "",
    name: "",
    optimizeDescription: "",
    renewalCostDescription: "",
    bonusPeriod: "",
    salePrice: 0,
    basePrice: 0,
    pricePerMonth: 0,
    period: 0,
    discount: 0,
    bestChoice: false,
    popular: false,
    featureTooltip: "",
    features: [{ description: "", tooltip: "" }],
    securities: [{ description: "", tooltip: "" }],
    services: [{ description: "", tooltip: "" }],
    specifications: [{ description: "", tooltip: "" }],
  });

  const handleAddFeature = () => {
    setProductData((prevData) => ({
      ...prevData,
      features: [...prevData.features, { description: "", tooltip: "" }],
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setProductData((prevData) => {
      const newFeatures = [...prevData.features];
      newFeatures.splice(index, 1);
      return { ...prevData, features: newFeatures };
    });
  };

  const handleAddSecurity = () => {
    setProductData((prevData) => ({
      ...prevData,
      securities: [...prevData.securities, { description: "", tooltip: "" }],
    }));
  };

  const handleRemoveSecurity = (index: number) => {
    setProductData((prevData) => {
      const newSecurities = [...prevData.securities];
      newSecurities.splice(index, 1);
      return { ...prevData, securities: newSecurities };
    });
  };

  const handleAddService = () => {
    setProductData((prevData) => ({
      ...prevData,
      services: [...prevData.services, { description: "", tooltip: "" }],
    }));
  };

  const handleRemoveService = (index: number) => {
    setProductData((prevData) => {
      const newServices = [...prevData.services];
      newServices.splice(index, 1);
      return { ...prevData, services: newServices };
    });
  };

  const handleAddSpecification = () => {
    setProductData((prevData) => ({
      ...prevData,
      specifications: [
        ...prevData.specifications,
        { description: "", tooltip: "" },
      ],
    }));
  };

  const handleRemoveSpecification = (index: number) => {
    setProductData((prevData) => {
      const newSpecifications = [...prevData.specifications];
      newSpecifications.splice(index, 1);
      return { ...prevData, specifications: newSpecifications };
    });
  };

  const handleOpen = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductData({
        product: product.product._id,
        name: product.name,
        optimizeDescription: product.optimizeDescription,
        renewalCostDescription: product.renewalCostDescription,
        bonusPeriod: product.bonusPeriod,
        salePrice: product.salePrice,
        basePrice: product.basePrice,
        pricePerMonth: product.pricePerMonth,
        period: product.period,
        discount: product.discount,
        bestChoice: product.bestChoice,
        popular: product.popular,
        featureTooltip: product.information.featureTooltip,
        features: product.information.features,
        securities: product.information.securities,
        services: product.information.services,
        specifications: product.information.specifications,
      });
    } else {
      setEditingProduct(null);
      setProductData((prevData) => ({
        ...prevData,
        product: "",
        name: "",
        optimizeDescription: "",
        renewalCostDescription: "",
        bonusPeriod: "",
        salePrice: 0,
        basePrice: 0,
        pricePerMonth: 0,
        period: 0,
        discount: 0,
        bestChoice: false,
        popular: false,
        featureTooltip: "",
        features: [{ description: "", tooltip: "" }],
        securities: [{ description: "", tooltip: "" }],
        services: [{ description: "", tooltip: "" }],
        specifications: [{ description: "", tooltip: "" }],
      }));
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
    setProductData((prevData) => ({
      ...prevData,
      name: "",
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getProductTypes();
        setProductTypes(data);
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
      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
        toast.success("Updated data successfully");
      } else {
        await createProduct(productData);
        toast.success("Created data successfully");
      }
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
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this data?"
      );
      if (confirmDelete) {
        await deleteProduct(id);
        setReload(!reload);
        toast.success("Deleted data successfully");
      }
    } catch (error) {
      console.log(getError(error as AxiosError<ErrorResponse>));
      toast.error(getError(error as AxiosError<ErrorResponse>));
    }
  };
  console.log(products);
  return (
    <Box style={{ position: "relative", width: "80%", margin: "10px auto" }}>
      <Toaster />
      <TableContainer style={{ borderRadius: "8px" }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Product Type</StyledTableCell>
              <StyledTableCell>Product Name</StyledTableCell>
              <StyledTableCell>Period (Months)</StyledTableCell>
              <StyledTableCell>Sale Price (VNĐ)</StyledTableCell>
              <StyledTableCell>Base Price (VNĐ)</StyledTableCell>
              <StyledTableCell>Discount (%)</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product: Product, index) => (
              <StyledTableRow key={index + 1}>
                <StyledTableCell component="th" scope="row">
                  {index + 1}
                </StyledTableCell>
                <StyledTableCell>{product.product?.name}</StyledTableCell>
                <StyledTableCell>{product.name}</StyledTableCell>
                <StyledTableCell>{product.period}</StyledTableCell>
                <StyledTableCell>{product.salePrice}</StyledTableCell>
                <StyledTableCell>{product.basePrice}</StyledTableCell>
                <StyledTableCell>{product.discount}</StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    onClick={() => {
                      handleOpen(product);
                    }}
                  >
                    Edit
                  </Button>
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
            {editingProduct ? "Edit Product Type" : "Create Product Type"}
          </h1>

          <FormControl sx={{ width: "100%" }}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Product
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              defaultValue={"none"}
              value={productData.product}
              onChange={(e) =>
                setProductData({ ...productData, product: e.target.value })
              }
              fullWidth
              label="Product"
            >
              {productTypes.map((product: Product, index: number) => (
                <MenuItem key={index} value={product._id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ m: "10px 0" }}>
            <InputLabel htmlFor="product-name">Product Name</InputLabel>
            <OutlinedInput
              id="product-name"
              value={productData.name}
              onChange={(e) =>
                setProductData({ ...productData, name: e.target.value })
              }
              label="Product Name"
            />
          </FormControl>

          {/* Additional Fields */}
          <FormControl fullWidth sx={{ m: "10px 0" }}>
            <InputLabel htmlFor="renewal-cost-description">
              Renewal Cost Description
            </InputLabel>
            <OutlinedInput
              id="renewal-cost-description"
              value={productData.renewalCostDescription}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  renewalCostDescription: e.target.value,
                })
              }
              label="Renewal Cost Description"
            />
          </FormControl>

          <FormControl fullWidth sx={{ m: "10px 0" }}>
            <InputLabel htmlFor="bonus-period">Bonus Period</InputLabel>
            <OutlinedInput
              id="bonus-period"
              value={productData.bonusPeriod}
              onChange={(e) =>
                setProductData({ ...productData, bonusPeriod: e.target.value })
              }
              label="Bonus Period"
            />
          </FormControl>

          <FormControl fullWidth sx={{ m: "10px 0" }}>
            <InputLabel htmlFor="sale-price">Sale Price</InputLabel>
            <OutlinedInput
              id="sale-price"
              type="number"
              inputProps={{ min: 0 }}
              value={productData.salePrice}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  salePrice: Number(e.target.value),
                })
              }
              label="Sale Price"
            />
          </FormControl>

          <FormControl fullWidth sx={{ m: "10px 0" }}>
            <InputLabel htmlFor="base-price">Base Price</InputLabel>
            <OutlinedInput
              id="base-price"
              type="number"
              inputProps={{ min: 0 }}
              value={productData.basePrice}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  basePrice: Number(e.target.value),
                })
              }
              label="Base Price"
            />
          </FormControl>

          <FormControl fullWidth sx={{ m: "10px 0" }}>
            <InputLabel htmlFor="price-per-month">Price Per Month</InputLabel>
            <OutlinedInput
              id="price-per-month"
              type="number"
              inputProps={{ min: 0 }}
              value={productData.pricePerMonth}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  pricePerMonth: Number(e.target.value),
                })
              }
              label="Price Per Month"
            />
          </FormControl>

          <FormControl fullWidth sx={{ m: "10px 0" }}>
            <InputLabel htmlFor="period">Period</InputLabel>
            <OutlinedInput
              id="period"
              type="number"
              inputProps={{ min: 0 }}
              value={productData.period}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  period: Number(e.target.value),
                })
              }
              label="Period"
            />
          </FormControl>

          <FormControl fullWidth sx={{ m: "10px 0" }}>
            <InputLabel htmlFor="discount">Discount</InputLabel>
            <OutlinedInput
              id="discount"
              type="number"
              inputProps={{ min: 0 }}
              value={productData.discount}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  discount: Number(e.target.value),
                })
              }
              label="Discount"
            />
          </FormControl>
          {/* Other input fields for product properties */}

          <FormControl fullWidth sx={{ m: "10px 0" }}>
            <InputLabel htmlFor="optimize-description">
              Optimize Description
            </InputLabel>
            <OutlinedInput
              id="optimize-description"
              value={productData.optimizeDescription}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  optimizeDescription: e.target.value,
                })
              }
              label="Optimize Description"
            />
          </FormControl>

          {/* Nested fields for 'information' object */}
          <FormControl fullWidth sx={{ m: "10px 0" }}>
            <TextField
              id="feature-tooltip"
              label="Feature Tooltip"
              value={productData.featureTooltip}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  featureTooltip: e.target.value,
                })
              }
            />
          </FormControl>

          {/* Features */}
          {productData.features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "start",
                mb: 2,
                textAlign: "center",
              }}
            >
              <div style={{ width: "50%" }}>
                <label>Feature {index + 1} Description</label>
                <ReactQuill
                  id={`description-${index}`}
                  theme="snow"
                  value={feature.description}
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    const updatedFeatures = [...productData.features];
                    updatedFeatures[index].description = e;
                    setProductData({
                      ...productData,
                      features: updatedFeatures,
                    });
                  }}
                />
              </div>
              <div style={{ width: "50%" }}>
                <label>Feature {index + 1} Tooltip</label>
                <ReactQuill
                  id={`tooltip-${index}`}
                  theme="snow"
                  value={feature.tooltip}
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    const updatedFeatures = [...productData.features];
                    updatedFeatures[index].tooltip = e;
                    setProductData({
                      ...productData,
                      features: updatedFeatures,
                    });
                  }}
                />
              </div>

              <IconButton onClick={() => handleRemoveFeature(index)}>
                <RemoveIcon />
              </IconButton>
            </Box>
          ))}
          <Box>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddFeature}
              sx={{ mb: 2 }}
            >
              Add Feature
            </Button>
          </Box>
          {productData.securities.map((security, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "start",
                textAlign: "center",
                mb: 2,
              }}
            >
              {/* <TextField
                fullWidth
                label={`Security ${index + 1} Description`}
                value={security.description}
                onChange={(e) => {
                  const updatedSecurities = [...productData.securities];
                  updatedSecurities[index].description = e.target.value;
                  setProductData({
                    ...productData,
                    securities: updatedSecurities,
                  });
                }}
              />
              <TextField
                fullWidth
                label={`Security ${index + 1} Tooltip`}
                value={security.tooltip}
                onChange={(e) => {
                  const updatedSecurities = [...productData.securities];
                  updatedSecurities[index].tooltip = e.target.value;
                  setProductData({
                    ...productData,
                    securities: updatedSecurities,
                  });
                }}
              /> */}
              <div style={{ width: "50%" }}>
                <label>Security {index + 1} Description</label>
                <ReactQuill
                  id={`description-${index}`}
                  theme="snow"
                  style={{ width: "100%" }}
                  value={security.description}
                  onChange={(e) => {
                    const updatedSecurities = [...productData.securities];
                    updatedSecurities[index].description = e;
                    setProductData({
                      ...productData,
                      securities: updatedSecurities,
                    });
                  }}
                />
              </div>
              <div style={{ width: "50%" }}>
                <label>Security {index + 1} Tooltip</label>
                <ReactQuill
                  id={`tooltip-${index}`}
                  theme="snow"
                  style={{ width: "100%" }}
                  value={security.tooltip}
                  onChange={(e) => {
                    const updatedSecurities = [...productData.securities];
                    updatedSecurities[index].tooltip = e;
                    setProductData({
                      ...productData,
                      securities: updatedSecurities,
                    });
                  }}
                />
              </div>

              <IconButton onClick={() => handleRemoveSecurity(index)}>
                <RemoveIcon />
              </IconButton>
            </Box>
          ))}
          <Box>
            <Button
              variant="outlined"
              onClick={handleAddSecurity}
              startIcon={<AddIcon />}
              sx={{ mb: 2 }}
            >
              Add Security
            </Button>
          </Box>

          {/* Services */}
          {productData.services.map((service, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "start",
                textAlign: "center",
                mb: 2,
              }}
            >
              {/* <TextField
                fullWidth
                label={`Service ${index + 1} Description`}
                value={service.description}
                onChange={(e) => {
                  const updatedServices = [...productData.services];
                  updatedServices[index].description = e.target.value;
                  setProductData({ ...productData, services: updatedServices });
                }}
              />
              <TextField
                fullWidth
                label={`Service ${index + 1} Tooltip`}
                value={service.tooltip}
                onChange={(e) => {
                  const updatedServices = [...productData.services];
                  updatedServices[index].tooltip = e.target.value;
                  setProductData({ ...productData, services: updatedServices });
                }}
              /> */}
              <div style={{ width: "50%" }}>
                <label>Service {index + 1} Description</label>
                <ReactQuill
                  id={`description-${index}`}
                  theme="snow"
                  style={{ width: "100%" }}
                  value={service.description}
                  onChange={(e) => {
                    const updatedServices = [...productData.services];
                    updatedServices[index].description = e;
                    setProductData({
                      ...productData,
                      services: updatedServices,
                    });
                  }}
                />
              </div>
              <div style={{ width: "50%" }}>
                <label>Service {index + 1} Tooltip</label>
                <ReactQuill
                  id={`tooltip-${index}`}
                  theme="snow"
                  style={{ width: "100%" }}
                  value={service.tooltip}
                  onChange={(e) => {
                    const updatedServices = [...productData.services];
                    updatedServices[index].tooltip = e;
                    setProductData({
                      ...productData,
                      services: updatedServices,
                    });
                  }}
                />
              </div>

              <IconButton onClick={() => handleRemoveService(index)}>
                <RemoveIcon />
              </IconButton>
            </Box>
          ))}
          <Box>
            <Button
              variant="outlined"
              onClick={handleAddService}
              startIcon={<AddIcon />}
              sx={{ mb: 2 }}
            >
              Add Service
            </Button>
          </Box>

          {/* Specifications */}
          {productData.specifications.map((specification, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "start",
                textAlign: "center",
                mb: 2,
              }}
            >
              {/* <TextField
                fullWidth
                label={`Specification ${index + 1} Description`}
                value={specification.description}
                onChange={(e) => {
                  const updatedSpecifications = [...productData.specifications];
                  updatedSpecifications[index].description = e.target.value;
                  setProductData({
                    ...productData,
                    specifications: updatedSpecifications,
                  });
                }}
              />
              <TextField
                fullWidth
                label={`Specification ${index + 1} Tooltip`}
                value={specification.tooltip}
                onChange={(e) => {
                  const updatedSpecifications = [...productData.specifications];
                  updatedSpecifications[index].tooltip = e.target.value;
                  setProductData({
                    ...productData,
                    specifications: updatedSpecifications,
                  });
                }}
              /> */}
              <div style={{ width: "50%" }}>
                <label>Service {index + 1} Description</label>
                <ReactQuill
                  id={`description-${index}`}
                  theme="snow"
                  style={{ width: "100%" }}
                  value={specification.description}
                  onChange={(e) => {
                    const updatedSpecifications = [
                      ...productData.specifications,
                    ];
                    updatedSpecifications[index].description = e;
                    setProductData({
                      ...productData,
                      specifications: updatedSpecifications,
                    });
                  }}
                />
              </div>
              <div style={{ width: "50%" }}>
                <label>Service {index + 1} Tooltip</label>
                <ReactQuill
                  id={`tooltip-${index}`}
                  theme="snow"
                  style={{ width: "100%" }}
                  value={specification.tooltip}
                  onChange={(e) => {
                    const updatedSpecifications = [
                      ...productData.specifications,
                    ];
                    updatedSpecifications[index].tooltip = e;
                    setProductData({
                      ...productData,
                      specifications: updatedSpecifications,
                    });
                  }}
                />
              </div>
              <IconButton onClick={() => handleRemoveSpecification(index)}>
                <RemoveIcon />
              </IconButton>
            </Box>
          ))}
          <Box>
            <Button
              variant="outlined"
              onClick={handleAddSpecification}
              startIcon={<AddIcon />}
              sx={{ mb: 2 }}
            >
              Add Specification
            </Button>
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={productData.bestChoice}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      bestChoice: e.target.checked,
                    })
                  }
                />
              }
              label="Best Choice"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={productData.popular}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      popular: e.target.checked,
                    })
                  }
                />
              }
              label="Popular"
            />
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
