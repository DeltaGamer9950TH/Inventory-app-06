"use client";

import { useEffect, useState } from "react";

// กำหนดโครงสร้างข้อมูล (เพิ่ม category และ stock)
type Product = {
  id: number;
  name: string;
  price: number;
  description: string | null;
  brand: string | null;
  color: string | null;
  category: string;
  stock: number;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  
  // 🟢 1. เพิ่ม State มารอรับค่า หมวดหมู่ และ สต็อก
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");

  // ฟังก์ชันดึงข้อมูลสินค้าทั้งหมด (GET)
  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ฟังก์ชันเพิ่มข้อมูล (POST)
  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // 🟢 2. แนบ category และ stock ส่งไปให้หลังบ้าน
      body: JSON.stringify({ name, price, description, brand, color, category, stock }),
    });
    
    // ล้างค่าในฟอร์ม
    setName("");
    setPrice("");
    setDescription("");
    setBrand("");
    setColor("");
    setCategory(""); // ล้างค่าหมวดหมู่
    setStock("");    // ล้างค่าสต็อก
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
    <div className="max-w-6xl mx-auto p-6">
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
            placeholder="ยี่ห้อ (Brand)"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="สี (Color)"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="border p-2 rounded"
          />

          {/* 🟢 3. เพิ่มช่องกรอก หมวดหมู่ และ สต็อก */}
          <input
            type="text"
            placeholder="หมวดหมู่ (Category)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="จำนวนสต็อก (Stock)"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
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
        <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full font-bold">
          บันทึกสินค้า
        </button>
      </form>

      {/* ตารางแสดงสินค้า */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse text-black min-w-max">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3">ID</th>
              <th className="p-3">ชื่อสินค้า</th>
              <th className="p-3">หมวดหมู่</th>
              <th className="p-3">ยี่ห้อ</th>
              <th className="p-3">สี</th>
              <th className="p-3 text-center">ราคา</th>
              <th className="p-3 text-center">สต็อก</th>
              <th className="p-3">รายละเอียด</th>
              <th className="p-3 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                {/* 🟢 แก้ colSpan เป็น 9 เพราะตารางเรามี 9 คอลัมน์แล้ว! */}
                <td colSpan={9} className="p-4 text-center text-gray-500">ยังไม่มีข้อมูลสินค้า</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-gray-500">{product.id}</td>
                  <td className="p-3 font-semibold">{product.name}</td>
                  <td className="p-3 text-gray-600">{product.category || "General"}</td>
                  <td className="p-3 text-gray-600">{product.brand || "-"}</td>
                  <td className="p-3 text-gray-600">{product.color || "-"}</td>
                  <td className="p-3 text-center text-blue-600 font-semibold">{product.price.toLocaleString()} ฿</td>
                  <td className="p-3 text-center font-bold text-green-600">{product.stock || 0}</td>
                  <td className="p-3 text-gray-500 text-sm">{product.description || "-"}</td>
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