const express = require("express");
const cors = require("cors");
const path = require("path");

const dataPath = path.join(__dirname, "data", "companies.json");
const allData = require(dataPath);

const app = express();
app.use(cors());
app.use(express.json());

const getCompaniesArray = () =>
  Array.isArray(allData.companies) ? [...allData.companies] : [];

app.get("/companies", (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 12);
  const search = (req.query.search || "").trim().toLowerCase();
  const location = (req.query.location || "").trim();
  const industry = (req.query.industry || "").trim();
  const sort = (req.query.sort || "name_asc").trim();

  let list = getCompaniesArray();

  if (search) {
    list = list.filter(
      (c) =>
        (c.name && c.name.toLowerCase().includes(search)) ||
        (c.description && c.description.toLowerCase().includes(search))
    );
  }

  if (location) {
    list = list.filter((c) => c.location === location);
  }

  if (industry) {
    list = list.filter((c) => c.industry === industry);
  }

  if (sort === "name_asc") {
    list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  } else if (sort === "name_desc") {
    list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
  } else if (sort === "employees_asc") {
    list.sort((a, b) => (a.employees || 0) - (b.employees || 0));
  } else if (sort === "employees_desc") {
    list.sort((a, b) => (b.employees || 0) - (a.employees || 0));
  }

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const items = list.slice(start, start + limit);

  res.json({
    data: items,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  });
});

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`);
});
