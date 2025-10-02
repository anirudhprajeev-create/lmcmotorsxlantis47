import { NextRequest, NextResponse } from 'next/server';
import { createVehicle, updateVehicle, deleteVehicle, fetchVehicles } from '@/lib/data';
import type { ImagePlaceholder } from '@/lib/types';
import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';
import placeholderData from '@/lib/placeholder-images.json';


const secret = process.env.BOTGHOST_SECRET;

// This is not a great practice for production apps, but for this use case where we
// want to allow file modifications from an API route, this is a workaround.
// In a real-world scenario, you would use a database or a CMS for this.
const jsonFilePath = path.join(process.cwd(), 'src', 'lib', 'placeholder-images.json');


async function readImageData(): Promise<{ placeholderImages: ImagePlaceholder[] }> {
    noStore();
    try {
        const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading image data:", error);
        // Fallback to imported data if reading fails
        return placeholderData;
    }
}

async function writeImageData(data: { placeholderImages: ImagePlaceholder[] }): Promise<void> {
    await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function addGalleryImage(imageData: Omit<ImagePlaceholder, 'id'>): Promise<ImagePlaceholder> {
    const data = await readImageData();
    const newId = `culture-${data.placeholderImages.filter(p => p.id.startsWith('culture-')).length + 1}`;
    const newImage: ImagePlaceholder = { ...imageData, id: newId };
    data.placeholderImages.push(newImage);
    await writeImageData(data);
    return newImage;
}

async function deleteGalleryImage(id: string): Promise<void> {
    const data = await readImageData();
    const initialLength = data.placeholderImages.length;
    data.placeholderImages = data.placeholderImages.filter(img => img.id !== id);
    if (data.placeholderImages.length === initialLength) {
        throw new Error(`Image with ID ${id} not found.`);
    }
    await writeImageData(data);
}


export async function POST(req: NextRequest) {
  const providedSecret = req.headers.get('Authorization')?.split('Bearer ')[1];

  if (!providedSecret || providedSecret !== secret) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { command, data, vehicleId, imageId, imageData } = await req.json();

    switch (command) {
      // Vehicle Commands
      case 'add':
        if (!data) {
          return NextResponse.json({ message: 'Bad Request: Missing data for add command' }, { status: 400 });
        }
        const newVehicle = await createVehicle(data);
        return NextResponse.json({ message: 'Vehicle added successfully', vehicle: newVehicle }, { status: 201 });

      case 'edit':
        if (!vehicleId || !data) {
          return NextResponse.json({ message: 'Bad Request: Missing vehicleId or data for edit command' }, { status: 400 });
        }
        const updatedVehicle = await updateVehicle(vehicleId, data);
        return NextResponse.json({ message: 'Vehicle updated successfully', vehicle: updatedVehicle }, { status: 200 });

      case 'delete':
        if (!vehicleId) {
          return NextResponse.json({ message: 'Bad Request: Missing vehicleId for delete command' }, { status: 400 });
        }
        await deleteVehicle(vehicleId);
        return NextResponse.json({ message: 'Vehicle deleted successfully' }, { status: 200 });
      
      case 'list':
        const vehicles = await fetchVehicles();
        return NextResponse.json({ vehicles }, { status: 200 });

      // Gallery Commands
      case 'addGalleryImage':
        if (!imageData) {
            return NextResponse.json({ message: 'Bad Request: Missing imageData for addGalleryImage command' }, { status: 400 });
        }
        const newImage = await addGalleryImage(imageData);
        return NextResponse.json({ message: 'Gallery image added successfully', image: newImage }, { status: 201 });

      case 'deleteGalleryImage':
        if (!imageId) {
            return NextResponse.json({ message: 'Bad Request: Missing imageId for deleteGalleryImage command' }, { status: 400 });
        }
        await deleteGalleryImage(imageId);
        return NextResponse.json({ message: 'Gallery image deleted successfully' }, { status: 200 });

      default:
        return NextResponse.json({ message: 'Invalid command' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof Error) {
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
