import { createContext, useContext, useState, ReactNode } from 'react';

// Definir el tipo para el contexto del tema
type ThemeContextType = {
  darkMode: boolean;
  toggleTheme: () => void;
};

// Crear el contexto con un valor predeterminado
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook personalizado para usar el contexto del tema
// Lo movemos fuera de la exportación principal para evitar problemas con Fast Refresh
function useThemeHook() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
}

// Exportamos el hook de manera compatible con Fast Refresh
export const useTheme = useThemeHook;

// Props para el proveedor del tema
type ThemeProviderProps = {
  children: ReactNode;
};

// Componente proveedor del tema
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [darkMode, setDarkMode] = useState(false);

  // Función para alternar entre modo claro y oscuro
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Valor del contexto que será proporcionado
  const value = {
    darkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
