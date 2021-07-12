import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

const dev = process.env.NODE_ENV === 'development'

// https://vitejs.dev/config/
const config = defineConfig({
  plugins: [reactRefresh()],
  base: dev === false ? '/r3f-experiments/' : undefined
})

export default config