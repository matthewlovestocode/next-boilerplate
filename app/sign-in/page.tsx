import { Box } from '@mui/material'
import AuthForm from '@/components/auth-form'

export default function SignInPage() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 65px)",
        width: "100vw"
      }}
    >
      <AuthForm />
    </Box>
  );
}
