'use client'
import { useState } from 'react';
import { auth, googleProvider } from '@/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import Image from 'next/image';

const theme = createTheme({
  palette: {
    primary: {
      main: '#684835',
    },
    secondary: {
      main: '#f1faee',
    },
    background: {
      default: '#F2D09F',
      paper: '#ffd3b6',
    },
    text: {
      primary: '#5E6738',
    },
  },
});

export default function SignIn() {
  const [error, setError] = useState(null);
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:600px)');

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const name = user.displayName || user.email.split('@')[0];
      localStorage.setItem('userName', name);
      localStorage.setItem('userPhotoURL', user.photoURL || '');
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
        width="100%"
        overflow="hidden"
      >
        <Image src="/illustration.svg" alt="Sign In Illustration" width={250} height={250} />

        <Typography variant="h4" color="text.primary" fontWeight="bold" gutterBottom mt={4} mb={2} textTransform="uppercase">
          Pantry Tracker
        </Typography>

        <Typography variant={isMobile ? 'h6' : 'h5'} color="text.primary" mb={4}>
        Save your ingredients, and discover delicious recipes in seconds
        </Typography>

        <Button
          variant="contained"
          onClick={signInWithGoogle}
          sx={{
            mt: 2,
            bgcolor: 'primary.main',
            color: 'secondary.main',
            fontSize: isMobile ? '1.2rem' : '1.4rem',
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