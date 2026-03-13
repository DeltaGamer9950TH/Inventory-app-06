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

// POST: เพิ่มข้อมูลสินค้า
export async function POST(request: Request) {
  try {
    const body: any = await request.json();
    
    // บันทึกลงฐานข้อมูล
    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        price: Number(body.price),
        description: body.description,
        sku: body.sku || "NO-SKU", 
        
        brand: body.brand || null,
        color: body.color || null,
        
        // 🟢 หลังบ้านรับค่า Category และ Stock จากหน้าเว็บ (ถ้าไม่ส่งมาก็ตั้งค่า Default ให้)
        category: body.category || "General",
        stock: Number(body.stock) || 0,
      },
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    return NextResponse.json({ error: "เพิ่มข้อมูลไม่สำเร็จ" }, { status: 500 });
  }
}