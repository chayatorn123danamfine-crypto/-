# ระบบปรับขนาดยา โรงพยาบาลสุโขทัย (Sukhothai Hospital Drug Dosing App)

แอปพลิเคชันสำหรับบุคลากรทางการแพทย์:
1. ปรับขนาดยาตามค่าการทำงานของไต (Cockcroft-Gault CrCl และ CKD-EPI eGFR)
2. ปรับขนาดยาตามน้ำหนัก (ยาเด็ก, Antibiotics, Antiviral, Warfarin TWD, TB)
3. ระบบจัดการและบันทึกประวัติการใช้งานจริง (Admin Dashboard: กดตาซ้ายมาสคอตกระต่าย รหัสผ่าน `ihabatdan67`)

---

## การนำขึ้นใช้งานบน Netlify (Deploy to Netlify)

### วิธีที่ 1: Deploy ผ่าน GitHub (แนะนำ)
1. นำโค้ดโปรเจกต์นี้ Push ขึ้น GitHub Repository ของท่าน
2. เข้าสู่ระบบ [Netlify](https://app.netlify.com/)
3. กดปุ่ม **"Add new site"** > **"Import an existing project"** > เลือก **GitHub**
4. เลือก Repository นี้
5. Netlify จะตรวจพบการตั้งค่าจากไฟล์ `netlify.toml` โดยอัตโนมัติ:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. กดปุ่ม **"Deploy Site"** รอประมาณ 1–2 นาที เว็บไซต์จะออนไลน์ทันที

---

### วิธีที่ 2: Deploy ผ่าน Netlify Drop (ลากและวางโฟลเดอร์ dist)
1. รันคำสั่งในเครื่องคอมพิวเตอร์ของท่าน:
   ```bash
   npm install
   npm run build
   ```
2. จะได้โฟลเดอร์ `dist`
3. เข้า [app.netlify.com/drop](https://app.netlify.com/drop)
4. ลากโฟลเดอร์ `dist` ไปวางในหน้าเว็บ Netlify ได้ทันที

---

## ข้อมูลการตั้งค่าระบบ (Configuration)
- **Framework**: React 19 + TypeScript + Vite + Tailwind CSS
- **SPA Redirects**: มีการตั้งค่าไฟล์ `netlify.toml` และ `public/_redirects` เรียบร้อยแล้ว (รองรับการ Refresh หน้าเว็บไม่ให้ขึ้น 404)
