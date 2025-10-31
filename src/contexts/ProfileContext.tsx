import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ProfileContextType {
  activeProfileId: number | null;
  setActiveProfileId: (id: number | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  // Tenta carregar o perfil ativo do localStorage ao iniciar
  const [activeProfileId, _setActiveProfileId] = useState<number | null>(() => {
    const savedProfileId = localStorage.getItem('activeProfileId');
    return savedProfileId ? parseInt(savedProfileId, 10) : null;
  });

  // Envolve a função de set para também salvar no localStorage
  const setActiveProfileId = useCallback((id: number | null) => {
    if (id) {
      localStorage.setItem('activeProfileId', id.toString());
    } else {
      localStorage.removeItem('activeProfileId');
    }
    _setActiveProfileId(id);
  }, []);

  return (
    <ProfileContext.Provider value={{ activeProfileId, setActiveProfileId }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
