import React from 'react';
import { 
  Heart, Coffee, Apple, IceCream, Pizza, Sandwich, Cookie, Milk, Cake, Banana,
  Gamepad2, Car, Dices, Palette, Music, Book, Circle, Bike,
  Home, Bed, Sofa, Bath, Tv, Lamp, DoorOpen, Key,
  Smile, Frown, Angry, Moon, Thermometer, Battery, Sun, CloudRain,
  HandHeart, Users, UserCheck, Phone, Shield, PlusCircle
} from 'lucide-react';
import { InfinitySymbol } from '@/components/InfinitySymbol';

// Mapeia o nome do ícone (string) para o componente React
export const iconMap: { [key: string]: React.ElementType } = {
  Heart, Coffee, Apple, IceCream, Pizza, Sandwich, Cookie, Milk, Cake, Banana,
  Gamepad2, Car, Dices, Palette, Music, Book, Circle, Bike,
  Home, Bed, Sofa, Bath, Tv, Lamp, DoorOpen, Key,
  Smile, Frown, Angry, Moon, Thermometer, Battery, Sun, CloudRain,
  HandHeart, Users, UserCheck, Phone, Shield, PlusCircle,
  HeartHug: Heart, 
  InfinitySymbol,
};

interface IconProps {
  name: string;
  className?: string;
}

// Componente que renderiza um ícone dinamicamente a partir do nome ou de um data URL
export const DynamicIcon: React.FC<IconProps> = ({ name, className }) => {
  // Verifica se o nome é um data URL (imagem em Base64)
  if (name && name.startsWith('data:image')) {
    return <img src={name} alt="Símbolo Personalizado" className={className} />;
  }

  const IconComponent = iconMap[name];

  if (!IconComponent) {
    return <Circle className={className} />; // Ícone padrão
  }

  return <IconComponent className={className} />;
};
