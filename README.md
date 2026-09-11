# AuditFlow — ระบบสารสนเทศทางการบัญชี ตรวจสอบภาษี และการวิเคราะห์ข้อมูลงบการเงิน
> พัฒนาโดย: **MR.T — Software Developer** (ระบบบัญชี | ภาษี | ธุรกิจ)

แอปพลิเคชันนี้ถูกออกแบบมาเป็น **Static Single-Page Application (HTML, CSS, JavaScript)** 100% พร้อมใช้งานทันทีบน **GitHub Pages** โดยไม่ต้องติดตั้ง Node.js, Build tools หรือเซิร์ฟเวอร์ใดๆ

---

## 🚀 วิธีการนำไป Deploy บน GitHub Pages (ง่ายที่สุดใน 3 ขั้นตอน)

### วิธีที่ 1: Deploy ผ่าน GitHub Web (ไม่ต้องพิมพ์คำสั่ง)
1. **สร้าง Repository ใหม่บน GitHub** (เช่น ชื่อ `auditflow`)
2. **อัปโหลดไฟล์ทั้งหมดขึ้น GitHub:**
   - นำไฟล์ `index.html`, โฟลเดอร์ `assets/` และไฟล์ `.nojekyll` อัปโหลดขึ้นที่ Root (หน้าแรก) ของ Repository
3. **เปิดใช้งาน GitHub Pages:**
   - ไปที่แท็บ **Settings** ของ Repository
   - เมนูด้านซ้ายเลือก **Pages**
   - ในส่วน **Build and deployment**:
     - Source: เลือก **Deploy from a branch**
     - Branch: เลือก **main** (หรือ `master`) และเลือกโฟลเดอร์เป็น **`/ (root)`**
     - กดปุ่ม **Save**
4. **เสร็จสิ้น!** รอประมาณ 1-2 นาที คุณจะได้ลิงก์เว็บไซต์ เช่น `https://<username>.github.io/auditflow/` สามารถเปิดใช้งานได้ทันที ใช้งานได้ครบทุกฟังก์ชันทั้งบนคอมพิวเตอร์และมือถือ

---

### วิธีที่ 2: Deploy ผ่าน Git CLI (สำหรับนักพัฒนา)
```bash
# 1. โคลนหรือกำหนด remote ไปยัง repository ของคุณ
git init
git add .
git commit -m "Deploy AuditFlow to GitHub Pages"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```
จากนั้นเข้าไปเปิด **GitHub Pages** ใน Settings -> Pages เลือก branch `main` โฟลเดอร์ `/ (root)` ครับ

---

## 📂 โครงสร้างไฟล์ที่จำเป็นสำหรับ GitHub Pages
```
├── index.html        # ไฟล์หลักตัวเดียวที่รวม HTML, Tailwind CSS, และ JavaScript ทั้งหมด
├── .nojekyll         # ป้องกัน GitHub Pages ข้ามการโหลดไฟล์ assets
├── assets/
│   └── images/       # รูปภาพระบบและภาพประกอบ AI ทั้งหมด (Relative path: ./assets/images/...)
│       ├── audit_financial_review.jpg
│       ├── erp_systems_team.jpg
│       ├── tax_compliance_specialists.jpg
│       ├── financial_bi_analytics.jpg
│       ├── mrt_developer_portrait.jpg
│       ├── mrt_app_logo.jpg
│       └── mrt_line_qr.png
└── README.md
```

## 🌟 ฟังก์ชันการทำงานที่พร้อมใช้งาน 100% บน GitHub Pages (Client-Side)
- ✅ **งบการเงินอัตโนมัติ (Financial Statements & Ratios):** งบกำไรขาดทุน, งบแสดงฐานะการเงิน, งบกระแสเงินสด, และ DuPont 3-Step ROE
- ✅ **บันทึกสมุดรายวัน & ปรับปรุงงบทดลองสด (Trial Balance & Adjusting Entries)**
- ✅ **จำลองระบบ ERP & Accounting SQL (Express, SAP, SQL Sandbox)**
- ✅ **วิเคราะห์เปรียบเทียบมาตรฐานการสอบบัญชี (TSA 520 Analytical Procedures)** พร้อมระบบประเมินผลอัตโนมัติ
- ✅ **สแกนบิลเอกสารชุดใหญ่ (Batch OCR Invoice Audit):** คัดกรองบิลซ้ำ, ตรวจสอบภาษีซื้อ 7%, ตรวจสอบใบกำกับภาษีเต็มรูปแบบ
- ✅ **สร้างและส่งออกรายงานสรุปผลการตรวจสอบภายใน (Internal Audit Report) และส่งออก PDF A4 สวยงาม**
- ✅ **คลังความรู้ คลังข้อสอบ และคำถามสัมภาษณ์งานบัญชีพร้อมแบบประเมินผล**
- ✅ **รองรับ PWA, โหมดกลางวัน/กลางคืน (Dark Mode), และปุ่มคีย์ลัดเต็มรูปแบบ**
