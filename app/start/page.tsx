import { Box } from '@mui/material'
import AuthForm from '@/components/auth-form'
import FirstRun from '@/components/first-run';

export default function StartPage() {
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
      <FirstRun />
    </Box>
  );
}
