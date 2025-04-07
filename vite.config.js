import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    modules: {
      localsConvention: 'camelCaseOnly', // Преобразует имена классов в camelCase (например, .my-class → styles.myClass)
      generateScopedName: '[name]__[local]___[hash:base64:5]' // Формат: App__button___2x9fr
    }
  }
});