import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // जेव्हा आपण '/api' ने सुरू होणारा कॉल करू, तेव्हा Vite तो आपोआप Render कडे वळवेल
      '/api': {
        target: 'https://bus-reservation-system-backend-j.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})