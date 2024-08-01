'use client'
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { 
  Box, Stack, Modal, Typography, TextField, Button, 
  Paper, Fade, Grow, IconButton, ThemeProvider, createTheme
} from "@mui/material";
import { collection, getDocs, query, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import Image from 'next/image';

// Create a custom theme with pastel colors and increased contrast
const theme = createTheme({
  palette: {
    primary: {
      main: '#6b9bd1', // Darker blue for better contrast
    },
    secondary: {
      main: '#f1faee',
    },
    background: {
      default: '#e9f5db',
      paper: '#ffd3b6',
    },
    text: {
      primary: '#1d3557', // Darker text for better readability
    },
  },
});

export default function Home() {
  const [pantryProducts, setPantryProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const updatePantryProducts = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const productList = [];
    docs.forEach((doc) => {
      const data = doc.data();
      if (!isNaN(data.quantity)) {
        productList.push({
          name: doc.id,
          ...data
        });
      }
    });
    setPantryProducts(productList);
  };

  const addProduct = async (productName) => {
    const docRef = doc(collection(firestore, 'inventory'), productName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 }, { merge: true });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updatePantryProducts();
  };

  const removeProduct = async (productName) => {
    if (productName === 'boxes') {
      console.log("Cannot delete 'boxes' product");
      return;
    }

    const docRef = doc(collection(firestore, 'inventory'), productName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1 || isNaN(quantity)) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          quantity: quantity - 1
        }, { merge: true });
      }
    } else {
      console.log("Product doesn't exist");
    }
    await updatePantryProducts();
  };

  useEffect(() => {
    updatePantryProducts();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredProducts = pantryProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Box 
        width="100vw" 
         
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={4}
        bgcolor="background.default"
        overflow="auto"
        pt={4}
        suppressHydrationWarning
      >
        <Box mb={2}>
          <Image src="/illustration.svg" alt="Pantry Illustration" width={200} height={200} />
        </Box>
        
        <Typography variant="h2" color="text.primary" fontWeight="bold">
          Pantry Tracker
        </Typography>
        
        <Fade in={true} timeout={1000}>
          <Button 
            variant="contained" 
            onClick={handleOpen}
            size="large"
            sx={{ color: 'white' }}
          >
            Add New Pantry Product
          </Button>
        </Fade>

        <TextField
          variant='outlined'
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products"
          sx={{ 
            maxWidth: 800, 
            bgcolor: 'background.default', 
            borderRadius: 1, 
            p: 2, 
            width: '80%' 
          }}
        />

        <Modal open={open} onClose={handleClose}>
          <Fade in={open}>
            <Paper
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                p: 4,
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="h5" mb={2}>Add a Pantry Product</Typography>
              <Stack width="100%" direction="row" spacing={2}>
                <TextField
                  variant='outlined'
                  fullWidth
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter product name"
                />
                <Button 
                  variant="contained" 
                  disabled={productName.length === 0} 
                  onClick={() => {
                    addProduct(productName);
                    setProductName('');
                    handleClose();
                  }}
                >
                  Add
                </Button>
              </Stack>
            </Paper>
          </Fade>
        </Modal>

        <Paper elevation={3} 
              sx={{ width: '80%', 
                    maxWidth: 800, 
                    borderRadius: 2, 
                    overflow: 'auto', 
                    mb: 10,  
                    '& ::-webkit-scrollbar': {
                      width: '12px',
                    },
                    '& ::-webkit-scrollbar-track': {
                      background: '#f1faee',
                    },
                    '& ::-webkit-scrollbar-thumb': {
                      background: '#6b9bd1',
                      }, 
                  }}>
          <Box 
            p={2} 
            bgcolor="primary.main"
          >
            <Typography variant="h4" color="white" fontWeight="bold">Pantry Contents</Typography>
          </Box>

          <Stack spacing={2} p={2} sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {filteredProducts.map(({name, quantity}) => (
              <Grow in={true} key={name}>
                <Paper 
                  elevation={2}
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Typography variant="h6" color="text.primary">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" color="text.primary" mr={2}>
                      {quantity}
                    </Typography>
                    <IconButton 
                      onClick={() => addProduct(name)} 
                      color="primary"
                      sx={{ width: 30, height: 30, minWidth: 30 }}
                    >
                      +
                    </IconButton>
                    <IconButton 
                      onClick={() => removeProduct(name)}
                      disabled={name === 'boxes'}
                      color="primary"
                      sx={{ width: 30, height: 30, minWidth: 30 }}
                    >
                      -
                    </IconButton>
                  </Box>
                </Paper>
              </Grow>
            ))}
          </Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
