import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// PUT: แก้ไขข้อมูลสินค้า
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, price, description } = body;

    const updatedProduct = await prisma.product.update({
      where: { id: Number(params.id) },
      data: {
        name,
        price: Number(price),
        description,
      },
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'แก้ไขข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}

// DELETE: ลบข้อมูลสินค้า
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