"use client";

import { useEffect, useState } from "react";

// กำหนดโครงสร้างข้อมูลสินค้า
type Product = {
  id: number;
  name: string;
  price: number;
  description: string | null;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  // ฟังก์ชันดึงข้อมูลสินค้าทั้งหมด (GET)
  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อเปิดหน้าเว็บครั้งแรก
  useEffect(() => {
    fetchProducts();
  }, []);

  // ฟังก์ชันเพิ่มข้อมูล (POST)
  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, description }),
    });
    // ล้างค่าในฟอร์มและดึงข้อมูลใหม่
    setName("");
    setPrice("");
    setDescription("");
    fetchProducts();
  };

  // ฟังก์ชันลบข้อมูล (DELETE)
  const deleteProduct = async (id: number) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?")) {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">ระบบจัดการคลังสินค้า</h1>

      {/* ฟอร์มเพิ่มสินค้า */}
      <form onSubmit={addProduct} className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-black">เพิ่มสินค้าใหม่</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-black">
          <input
            type="text"
            placeholder="ชื่อสินค้า *"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="ราคา *"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="รายละเอียด (ใส่หรือไม่ใส่ก็ได้)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded md:col-span-2"
          />
        </div>
        <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full">
          บันทึกสินค้า
        </button>
      </form>

      {/* ตารางแสดงสินค้า */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse text-black">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3">ID</th>
              <th className="p-3">ชื่อสินค้า</th>
              <th className="p-3">ราคา</th>
              <th className="p-3">รายละเอียด</th>
              <th className="p-3 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">ยังไม่มีข้อมูลสินค้า</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{product.id}</td>
                  <td className="p-3 font-semibold">{product.name}</td>
                  <td className="p-3">{product.price.toLocaleString()} ฿</td>
                  <td className="p-3 text-gray-600">{product.description || "-"}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
