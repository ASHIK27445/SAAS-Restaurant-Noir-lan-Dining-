export interface FloorNavLinkProps {
  icon: string;
  label: string;
  filled?: boolean;
}

export interface StaffBadgeProps {
  label: string;
}

export interface StaffIndicatorProps {
  label: string;
}

export interface TooltipProps {
  name: string;
  role: string;
  alignRight?: boolean;
}

export interface StaffListItemProps {
  img: string;
  name: string;
  zone: string;
}

export interface TableData {
  id: string;
  staffImg?: string;
  staffAlt?: string;
  staffPos?: string;
  indicator?: string;
  indicatorPos?: string;
}

export interface ImageAssets {
  logo: string;
  marcus: string;
  marcusList: string;
  elena: string;
  elenaList: string;
  laurent: string;
  laurentList: string;
  sarah: string;
  bgMap: string;
  [key: string]: string; // Index signature for dynamic access
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  zone: string;
  avatar: string;
  onDuty: boolean;
  position?: {
    x: number;
    y: number;
  };
}

export interface ZoneData {
  name: string;
  capacity: number;
  currentStaff: number;
  type: 'kitchen' | 'dining' | 'bar' | 'entrance';
}