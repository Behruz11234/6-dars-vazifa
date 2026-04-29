const http = require('http');

// Ma'lumotlar bazasi (Vaqtincha xotirada)
let staff = [
    { id: 1, name: "Amir karimov", role: "Farmatsevt" },
    { id: 2, name: "Ruxsora", role: "Sotuvchi" }
];

let medicines = [
    { id: 1, name: "Paratsetamol", price: 5000, stock: 100 },
    { id: 2, name: "Analgin", price: 3000, stock: 50 }
];

// Helper funksiya: Request body'sini o'qish uchun
const getRequestBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => { body += chunk.toString(); });
        req.on("end", () => { resolve(JSON.parse(body || "{}")); });
        req.on("error", (err) => { reject(err); });
    });
};

const server = http.createServer(async (req, res) => {
    const { method, url } = req;
    res.setHeader("Content-Type", "application/json");

    // --- XODIMLAR RO'YXATI (Faqat ko'rish) ---
    if (url === "/staff" && method === "GET") {
        res.writeHead(200);
        res.end(JSON.stringify(staff));
    }

    // --- DORILAR CRUD ---

    // 1. READ: Barcha dorilarni ko'rish
    else if (url === "/medicines" && method === "GET") {
        res.writeHead(200);
        res.end(JSON.stringify(medicines));
    }

    // 2. CREATE: Yangi dori qo'shish
    else if (url === "/medicines" && method === "POST") {
        const data = await getRequestBody(req);
        const newMed = { id: Date.now(), ...data };
        medicines.push(newMed);
        res.writeHead(201);
        res.end(JSON.stringify({ message: "Dori qo'shildi", data: newMed }));
    }

    // 3. UPDATE: Dorini tahrirlash (/medicines?id=1)
    else if (url.startsWith("/medicines/") && method === "PUT") {
        const id = parseInt(url.split("/"));
        const data = await getRequestBody(req);
        const index = medicines.findIndex(m => m.id === id);

        if (index !== -1) {
            medicines[index] = { ...medicines[index], ...data };
            res.writeHead(200);
            res.end(JSON.stringify({ message: "Yangilandi", data: medicines[index] }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: "Topilmadi" }));
        }
    }

    // 4. DELETE: Dorini o'chirish
    else if (url.startsWith("/medicines/") && method === "DELETE") {
        const id = parseInt(url.split("/"));
        const initialLength = medicines.length;
        medicines = medicines.filter(m => m.id !== id);

        if (medicines.length < initialLength) {
            res.writeHead(200);
            res.end(JSON.stringify({ message: "Dori o'chirildi" }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: "Topilmadi" }));
        }
    }

    // Noto'g'ri yo'nalish bo'lsa
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Sahifa topilmadi" }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} portida ishga tushdi`);
});