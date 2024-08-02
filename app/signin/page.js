'use client'
import { useState } from 'react';
import { auth, googleProvider } from '@/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, ThemeProvider, createTheme } from '@mui/material';
import Image from 'next/image';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6b9bd1',
    },
    secondary: {
      main: '#f1faee',
    },
    background: {
      default: '#e9f5db',
      paper: '#ffd3b6',
    },
    text: {
      primary: '#1d3557',
    },
  },
});

export default function SignIn() {
  const [error, setError] = useState(null);
  const router = useRouter();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/main');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bgcolor="background.default"
        textAlign="center"
        p={2}
        width="100%" // Ensure full width
        overflow="hidden" // Prevent overflow issues
      >
        <Image src="/illustration.svg" alt="Sign In Illustration" width={300} height={300} />
        
        <Typography variant="h4" color="text.primary" gutterBottom mt={4} mb={2}>
          Pantry Tracker
        </Typography>
        
        <Button 
          variant="contained" 
          onClick={signInWithGoogle}
          sx={{ 
            mt: 2, 
            color: 'white' // Set button text color to white
          }}
        >
          Sign In with Google
        </Button>
        
        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
      </Box>
    </ThemeProvider>
  );
}
