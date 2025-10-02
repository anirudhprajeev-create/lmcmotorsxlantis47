
export type Vehicle = {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    description: string;
    type: 'SUV' | 'Sedan' | 'Truck';
    images: string[];
    specifications: { name: string; value: string }[];
  };

export type VehicleDataInput = Partial<Omit<Vehicle, 'id'>>;

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};
