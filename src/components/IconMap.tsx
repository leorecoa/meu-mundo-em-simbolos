import React from 'react';
import { 
  Heart, Coffee, Apple, IceCream, Pizza, Sandwich, Cookie, Milk, Cake, Banana,
  Gamepad2, Car, Dices, Palette, Music, Book, Circle, Bike,
  Home, Bed, Sofa, Bath, Tv, Lamp, DoorOpen, Key,
  Smile, Frown, Angry, Moon, Thermometer, Battery, Sun, CloudRain,
  HandHeart, Users, UserCheck, Phone, Shield
} from 'lucide-react';
import { InfinitySymbol } from '@/components/InfinitySymbol';

// Mapeia o nome do ícone (string) para o componente React
export const iconMap: { [key: string]: React.ElementType } = {
  Heart,
  Coffee,
  Apple,
  IceCream,
  Pizza,
  Sandwich,
  Cookie,
  Milk,
  Cake,
  Banana,
  Gamepad2,
  Car,
  Dices,
  Palette,
  Music,
  Book,
  Circle,
  Bike,
  Home,
  Bed,
  Sofa,
  Bath,
  Tv,
  Lamp,
  DoorOpen,
  Key,
  Smile,
  Frown,
  Angry,
  Moon,
  Thermometer,
  Battery,
  Sun,
  CloudRain,
  HandHeart,
  Users,
  UserCheck,
  Phone,
  Shield,
  HeartHug: Heart, // Mapeia HeartHug para o ícone Heart
  InfinitySymbol,
};

interface IconProps {
  name: string;
  className?: string;
}

// Componente que renderiza um ícone dinamicamente a partir do nome
export const DynamicIcon: React.FC<IconProps> = ({ name, className }) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    // Retorna um ícone padrão ou nulo se o nome não for encontrado
    return <Circle className={className} />; 
  }

  return <IconComponent className={className} />;
};
