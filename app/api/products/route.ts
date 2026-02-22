import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET: ดึงข้อมูลสินค้าทั้งหมด
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' } // เรียงจากใหม่ไปเก่า
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'ดึงข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}

// POST: เพิ่มข้อมูลสินค้าใหม่
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const name = String(body.name);
    const price = Number(body.price);
    const description = body.description ? String(body.description) : null;

    const newProduct = await prisma.product.create({
      data: {
        name: name,
        price: price,
        description: description,
      } as any, 
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.log("🔥 เจอ Error จ้า:", error); 
    return NextResponse.json({ error: 'เพิ่มข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}