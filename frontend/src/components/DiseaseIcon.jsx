import {
  Activity,
  Brain,
  Bug,
  Droplet,
  Heart,
  Leaf,
  Stethoscope,
  Thermometer,
  Wind,
} from 'lucide-react'

const ICONS = {
  thermometer: Thermometer,
  virus: Bug,
  bacteria: Bug,
  mosquito: Bug,
  lungs: Wind,
  brain: Brain,
  stomach: Activity,
  drop: Droplet,
  heart: Heart,
  liver: Leaf,
  rash: Leaf,
  allergy: Leaf,
  stethoscope: Stethoscope,
}

export default function DiseaseIcon({ name, size = 22, className = '' }) {
  const Icon = ICONS[name] || Stethoscope
  return <Icon size={size} className={className} />
}
