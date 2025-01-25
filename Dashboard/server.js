const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Statik dosyaları sunma
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// MySQL bağlantısı
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "yesil_harmoni",
});

// Bağlantıyı başlat
db.connect((err) => {
  if (err) {
    console.error("MySQL bağlantı hatası:", err);
  } else {
    console.log("MySQL veritabanına bağlanıldı.");
  }
});

// Login sayfasını ana rota yap
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Login.html")); // Login sayfasına yönlendir
});

app.get("/veriler", (req, res) => {
  const { alanID, zamanAraligi } = req.query;

  let tarihFiltre = "";
  switch (zamanAraligi) {
    case "yearly":
      tarihFiltre = "YEAR(zaman) = YEAR(CURDATE())";
      break;
    case "six_months":
      tarihFiltre = "zaman >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)";
      break;
    case "three_months":
      tarihFiltre = "zaman >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)";
      break;
    case "monthly":
      tarihFiltre = "zaman >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)";
      break;
    case "daily":
      tarihFiltre = "zaman = CURDATE()";
      break;
    default:
      tarihFiltre = "1"; 
  }

  const query = `
      SELECT * FROM veri
      WHERE alanID = ? AND ${tarihFiltre}
      Limit 50
  `;

  db.query(query, [alanID], (err, results) => {
    if (err) {
      console.error("Veri çekme hatası:", err);
      res.status(500).send("Hata oluştu.");
      return;
    }
    res.json(results);
  });
});

// API: Alanları listele
app.get("/alanlar", (req, res) => {
  const query = "SELECT DISTINCT alanID FROM veri";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Alanları çekme hatası:", err);
      res.status(500).send("Hata oluştu.");
      return;
    }
    res.json(results);
  });
});

// Dropdown verilerini almak için endpoint
app.get("/get-alanlar", (req, res) => {
  const query = "SELECT alan_adi FROM alanlar";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Veri çekme hatası: " + err.stack);
      res.status(500).send("Veri çekme hatası");
      return;
    }
    res.json(results);
  });
});

app.post("/getData", (req, res) => {
  const { alan_id } = req.body;
  const query = `SELECT ay, uzunluk_buyume, yeni_yaprak FROM bitki_buyume_verileri WHERE alan_id = ?`;

  db.query(query, [alan_id], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Database query failed");
    } else {
      res.json(results);
    }
  });
});

// Bitki uygunluk kontrolü ve önerisi
app.get("/optimize", (req, res) => {
  const { alanID } = req.query;

  if (!alanID) {
    return res.status(400).json({ message: "Alan ID belirtilmedi." });
  }

  // Alan bazlı bitki önerileri
  let message = "";
  switch (alanID) {
    case "1":
      message = "Bu bitki türü bu alan için uygun değildir. En yüksek verimi Lahana ile alabilirsiniz.";
      break;
    case "2":
      message = "Bu bitki türü bu alan için uygun değildir. En yüksek verimi Soğan ile alabilirsiniz.";
      break;
    case "3":
      message = "Bu bitki bu alan için uygundur. Bir sonraki yıl da aynı ekimle devam edilebilir.";
      break;
    default:
      message = "Seçilen alan için uygunluk bilgisi bulunamadı.";
      break;
  }

  res.json({ message });
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port}/Login.html adresinde çalışıyor`);
});
