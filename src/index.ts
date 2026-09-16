import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import siteSettingsRoutes from "./routes/siteSettings.routes.js";
import heroRoutes from "./routes/hero.routes.js";
import helpRoutes from "./routes/help.routes.js";
import aboutRoutes from "./routes/about.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import testimonialRoutes from "./routes/testimonial.routes.js";
import whyChooseUsRoutes from "./routes/whyChooseUs.routes.js";
import labTestsRoutes from "./routes/labTests.routes.js";
import doctorsRoutes from "./routes/doctors.routes.js";
import articlesRoutes from "./routes/articles.routes.js";
import footerRoutes from "./routes/footer.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminServiceRoutes from "./routes/adminServiceRoutes.js";
import adminDoctorRoutes from "./routes/adminDoctorRoutes.js";
import adminArticleRoutes from "./routes/adminArticleRoutes.js";
import adminHelpCardRoutes from "./routes/adminHelpCardRoutes.js";
import adminTestimonialRoutes from "./routes/adminTestimonialRoutes.js";
import adminWhyChooseUsRoutes from "./routes/adminWhyChooseUsRoutes.js";
import adminLabTestRoutes from "./routes/adminLabTestRoutes.js";
import adminSiteSettingsRoutes from "./routes/adminSiteSettingsRoutes.js";
import adminSocialMediaRoutes from "./routes/adminSocialMediaRoutes.js";
import adminFooterSettingsRoutes from "./routes/adminFooterSettingsRoutes.js";
import adminFooterColumnRoutes from "./routes/adminFooterColumnRoutes.js";
import adminFooterLinkRoutes from "./routes/adminFooterLinkRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5000",
];

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hospital-template-iota.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use("/api/uploads", uploadRoutes);
app.use("/api/site-settings", siteSettingsRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/help", helpRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/why-choose-us", whyChooseUsRoutes);
app.use("/api/lab-tests", labTestsRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/articles", articlesRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/services", adminServiceRoutes);
app.use("/api/admin/doctors", adminDoctorRoutes);
app.use("/api/admin/articles", adminArticleRoutes);
app.use("/api/admin/help-cards", adminHelpCardRoutes);
app.use("/api/admin/testimonials", adminTestimonialRoutes);
app.use("/api/admin/why-choose-us", adminWhyChooseUsRoutes);
app.use("/api/admin/lab-tests", adminLabTestRoutes);
app.use("/api/admin/site-settings", adminSiteSettingsRoutes);
app.use("/api/admin/social-media", adminSocialMediaRoutes);
app.use("/api/admin/footer-settings", adminFooterSettingsRoutes);
app.use("/api/admin/footer-columns", adminFooterColumnRoutes);
app.use("/api/admin/footer-links", adminFooterLinkRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.get("/", (_req, res) => {
  res.json({
    message: "Hospital Website API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
