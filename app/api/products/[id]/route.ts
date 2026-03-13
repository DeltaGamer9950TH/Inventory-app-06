import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';


export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    
    // ดึงข้อมูลทั้งหมดที่ส่งมา
    const { name, price, description, brand, color, category, stock } = body;

    const updatedProduct = await prisma.product.update({
      where: { id: Number(resolvedParams.id) },
      data: {
        // อัปเดตเฉพาะค่าที่มีการส่งมา
        name: name !== undefined ? name : undefined,
        price: price !== undefined ? Number(price) : undefined,
        description: description !== undefined ? description : undefined,
        brand: brand !== undefined ? brand : undefined,
        color: color !== undefined ? color : undefined,
        category: category !== undefined ? category : undefined,
        stock: stock !== undefined ? Number(stock) : undefined,
      },
    });
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.log("🔥 เจอ Error แก้ไขข้อมูล:", error);
    return NextResponse.json({ error: 'แก้ไขข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const resolvedParams = await params; 
    
    await prisma.product.delete({
      where: { id: Number(resolvedParams.id) },
    });
    
    return NextResponse.json({ message: 'ลบข้อมูลสำเร็จ' });
  } catch (error) {
    console.log("🔥 เจอ Error ลบข้อมูล:", error);
    return NextResponse.json({ error: 'ลบข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}