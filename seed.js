const db = require('./database.js');

const concernsWithSynonyms = [
    { id: 1, name: "acne scars", synonyms: ["pimples", "scarring", "blemishes"] },
    { id: 2, name: "dark circles", synonyms: ["under eye bags", "panda eyes"] },
    { id: 3, name: "tummy scar", synonyms: [] },
    { id: 4, name: "wrinkles", synonyms: ["aging lines"] },
    { id: 5, name: "sun damage", synonyms: ["sun spots", "photoaging"] },
    { id: 6, name: "loose skin", synonyms: ["saggy skin"] },
    { id: 7, name: "unwanted fat", synonyms: [] },
    { id: 8, name: "double chin", synonyms: ["chin fat", "submental fat"] },
    { id: 9, name: "fine lines & wrinkles", synonyms: ["crows feet"] },
    { id: 10, name: "dull skin", synonyms: ["lifeless skin", "tired skin"] },
    { id: 11, name: "uneven skin tone", synonyms: ["pigmentation", "dark spots"] },
    { id: 12, name: "hair loss", synonyms: ["hair fall", "thinning hair", "baldness"] },
    { id: 13, name: "large pores", synonyms: ["open pores"] },
    { id: 14, name: "unwanted hair", synonyms: ["hair removal"] }
];

const concerns = concernsWithSynonyms.map(c => ({id: c.id, name: c.name}));

const treatments = [
    { id: 1, name: "Laser Resurfacing", invasiveness: "non-invasive", typical_downtime_days: 3 },
    { id: 2, name: "Subcision + Fillers", invasiveness: "minimally-invasive", typical_downtime_days: 1 },
    { id: 3, name: "Scar revision surgery", invasiveness: "invasive", typical_downtime_days: 14 },
    { id: 4, name: "Under-eye Filler", invasiveness: "minimally-invasive", typical_downtime_days: 0 },
    { id: 5, name: "Botox", invasiveness: "minimally-invasive", typical_downtime_days: 0 },
    { id: 6, name: "Microneedling", invasiveness: "minimally-invasive", typical_downtime_days: 2 },
    { id: 7, name: "Chemical Peel", invasiveness: "non-invasive", typical_downtime_days: 5 },
    { id: 8, name: "IPL Photofacial", invasiveness: "non-invasive", typical_downtime_days: 1 },
    { id: 9, name: "Ultherapy", invasiveness: "non-invasive", typical_downtime_days: 0 },
    { id: 10, name: "Kybella", invasiveness: "minimally-invasive", typical_downtime_days: 4 },
    { id: 11, name: "PRP Under-eye", invasiveness: "minimally-invasive", typical_downtime_days: 1 },
    { id: 12, name: "HIFU", invasiveness: "non-invasive", typical_downtime_days: 0 },
    { id: 13, name: "Dermal Fillers", invasiveness: "minimally-invasive", typical_downtime_days: 1 },
    { id: 14, name: "HydraFacial", invasiveness: "non-invasive", typical_downtime_days: 0 },
    { id: 15, name: "Vampire Facial", invasiveness: "minimally-invasive", typical_downtime_days: 2 },
    { id: 16, name: "Laser Hair Removal", invasiveness: "non-invasive", typical_downtime_days: 0 },
    { id: 17, name: "PRP Hair Treatment", invasiveness: "minimally-invasive", typical_downtime_days: 1 },
    { id: 18, name: "Fractional CO2 Laser", invasiveness: "non-invasive", typical_downtime_days: 5 },
    { id: 19, name: "Q-Switch Laser", invasiveness: "non-invasive", typical_downtime_days: 0 }
];
const raw_concern_treatments = [
    { concern_id: 1, treatment_id: 1 }, { concern_id: 1, treatment_id: 2 }, { concern_id: 1, treatment_id: 3 },
    { concern_id: 2, treatment_id: 4 }, { concern_id: 3, treatment_id: 3 }, { concern_id: 4, treatment_id: 5 },
    { concern_id: 4, treatment_id: 6 }, { concern_id: 4, treatment_id: 7 }, { concern_id: 5, treatment_id: 7 },
    { concern_id: 5, treatment_id: 8 }, { concern_id: 6, treatment_id: 9 }, { concern_id: 7, treatment_id: 10 },
    { concern_id: 1, treatment_id: 6 }, { concern_id: 1, treatment_id: 7 }, { concern_id: 1, treatment_id: 18 },
    { concern_id: 2, treatment_id: 11 }, { concern_id: 2, treatment_id: 7 }, { concern_id: 8, treatment_id: 12 },
    { concern_id: 8, treatment_id: 10 }, { concern_id: 9, treatment_id: 5 }, { concern_id: 9, treatment_id: 13 },
    { concern_id: 9, treatment_id: 6 }, { concern_id: 9, treatment_id: 1 }, { concern_id: 10, treatment_id: 14 },
    { concern_id: 10, treatment_id: 7 }, { concern_id: 10, treatment_id: 15 }, { concern_id: 11, treatment_id: 8 },
    { concern_id: 11, treatment_id: 19 }, { concern_id: 11, treatment_id: 7 }, { concern_id: 12, treatment_id: 17 },
    { concern_id: 5, treatment_id: 1 }, { concern_id: 5, treatment_id: 7 }, { concern_id: 13, treatment_id: 6 },
    { concern_id: 13, treatment_id: 14 }, { concern_id: 13, treatment_id: 7 }, { concern_id: 14, treatment_id: 16 }
];
const packages = [
    { id: 1, clinic_name: "Aesthetic Clinic A", package_name: "Scar Laser Deluxe", treatment_id: 1, price: 15000, highlights: "3 sessions, topical numbing" },
    { id: 2, clinic_name: "SkinCare Pro", package_name: "Acne Scar Fix", treatment_id: 2, price: 10000, highlights: "1 session + followup" },
    { id: 3, clinic_name: "SurgicalCare", package_name: "Scar Revision Surgery", treatment_id: 3, price: 45000, highlights: "1 surgery, 2 weeks recovery" },
    { id: 4, clinic_name: "EyeClinic", package_name: "Under-eye Filler 1ml", treatment_id: 4, price: 7000, highlights: "0 downtime" },
    { id: 5, clinic_name: "Forever Young", package_name: "Timeless Botox (50 units)", treatment_id: 5, price: 12000, highlights: "Quick, no downtime" },
    { id: 6, clinic_name: "Rejuvenate Clinic", package_name: "Youthful Glow Microneedling", treatment_id: 6, price: 8000, highlights: "3 sessions for collagen boost" },
    { id: 7, clinic_name: "DermaCare", package_name: "Radiance Chemical Peel", treatment_id: 7, price: 6000, highlights: "Improves texture and tone" },
    { id: 8, clinic_name: "DermaCare", package_name: "Sun Spot Eraser (IPL)", treatment_id: 8, price: 9000, highlights: "Targets pigmentation" },
    { id: 9, clinic_name: "Uplift Aesthetics", package_name: "Ultherapy Brow Lift", treatment_id: 9, price: 25000, highlights: "Non-surgical lift" },
    { id: 10, clinic_name: "Contour Clinic", package_name: "Chin Sculpt (Kybella)", treatment_id: 10, price: 35000, highlights: "2 vials, targets double chin" },
    { id: 11, clinic_name: "The Glow Up Clinic", package_name: "Microneedling Starter Pack", treatment_id: 6, price: 6000, highlights: "Ideal for beginners" },
    { id: 12, clinic_name: "Aura Aesthetics", package_name: "Advanced Scar Revision (Microneedling)", treatment_id: 6, price: 7500, highlights: "Targets deep scars" },
    { id: 13, clinic_name: "Skin & Sculpt", package_name: "Deep Chemical Peel for Scars", treatment_id: 7, price: 5500, highlights: "Medical grade peel" },
    { id: 14, clinic_name: "Evolve Medispa", package_name: "Fractional CO2 Laser Session", treatment_id: 18, price: 15000, highlights: "High intensity resurfacing" },
    { id: 15, clinic_name: "Radiance Wellness", package_name: "Full Face Laser Resurfacing", treatment_id: 1, price: 12000, highlights: "Complete facial rejuvenation" },
    { id: 16, clinic_name: "Derma Revive", package_name: "Under-eye Filler Special", treatment_id: 4, price: 18000, highlights: "Premium hyaluronic acid filler" },
    { id: 17, clinic_name: "The Youth Fountain", package_name: "PRP Under-eye Rejuvenation", treatment_id: 11, price: 9000, highlights: "Uses your own plasma" },
    { id: 18, clinic_name: "The Glow Up Clinic", package_name: "Bright Eyes Peel", treatment_id: 7, price: 4000, highlights: "Gentle peel for eye area" },
    { id: 19, clinic_name: "Prestige Cosmetics", package_name: "HIFU Chin Sculpting", treatment_id: 12, price: 25000, highlights: "Non-invasive facelift alternative" },
    { id: 20, clinic_name: "City Skin Clinic", package_name: "Kybella Fat Dissolving Injections", treatment_id: 10, price: 40000, highlights: "Permanent fat reduction" },
    { id: 21, clinic_name: "Luxe Laser Lounge", package_name: "Forehead & Crows Feet Botox", treatment_id: 5, price: 16000, highlights: "Smooths dynamic wrinkles" },
    { id: 22, clinic_name: "Skin & Sculpt", package_name: "Full Face Dermal Fillers", treatment_id: 13, price: 35000, highlights: "Restores volume and contours" },
    { id: 23, clinic_name: "Evolve Medispa", package_name: "Signature HydraFacial Experience", treatment_id: 14, price: 7000, highlights: "Cleanse, extract, hydrate" },
    { id: 24, clinic_name: "Radiance Wellness", package_name: "Vampire Facial (PRP)", treatment_id: 15, price: 11000, highlights: "Microneedling with PRP" },
    { id: 25, clinic_name: "Derma Revive", package_name: "IPL Photofacial for Pigmentation", treatment_id: 8, price: 9500, highlights: "Evens out skin tone" },
    { id: 26, clinic_name: "The Youth Fountain", package_name: "Q-Switch Laser Toning", treatment_id: 19, price: 6500, highlights: "Reduces pores and blemishes" },
    { id: 27, clinic_name: "Prestige Cosmetics", package_name: "PRP Hair Growth Therapy (3 Sessions)", treatment_id: 17, price: 22000, highlights: "Stimulates hair follicles" },
    { id: 28, clinic_name: "Luxe Laser Lounge", package_name: "Full Body Laser Hair Removal", treatment_id: 16, price: 50000, highlights: "6-session package" }
];

const uniqueKeys = new Set();
const concern_treatments = raw_concern_treatments.filter(el => {
    const key = `${el.concern_id}-${el.treatment_id}`;
    const isNew = !uniqueKeys.has(key);
    if (isNew) uniqueKeys.add(key);
    return isNew;
});

db.serialize(() => {
    console.log("Deleting existing data...");
    db.run("DELETE FROM packages");
    db.run("DELETE FROM concern_treatments");
    db.run("DELETE FROM treatments");
    db.run("DELETE FROM concern_synonyms"); 
    db.run("DELETE FROM concerns");
    console.log("Existing data deleted.");

    console.log("Inserting new seed data...");

    const insertConcern = db.prepare("INSERT INTO concerns (id, name) VALUES (?, ?)");
    concerns.forEach(c => insertConcern.run(c.id, c.name));
    insertConcern.finalize();

    const insertSynonym = db.prepare("INSERT INTO concern_synonyms (concern_id, synonym) VALUES (?, ?)");
    concernsWithSynonyms.forEach(c => {
        c.synonyms.forEach(synonym => {
            insertSynonym.run(c.id, synonym);
        });
    });
    insertSynonym.finalize();

    const insertTreatment = db.prepare("INSERT INTO treatments (id, name, invasiveness, typical_downtime_days) VALUES (?, ?, ?, ?)");
    treatments.forEach(t => insertTreatment.run(t.id, t.name, t.invasiveness, t.typical_downtime_days));
    insertTreatment.finalize();
    const insertConcernTreatment = db.prepare("INSERT INTO concern_treatments (concern_id, treatment_id) VALUES (?, ?)");
    concern_treatments.forEach(ct => insertConcernTreatment.run(ct.concern_id, ct.treatment_id));
    insertConcernTreatment.finalize();
    const insertPackage = db.prepare("INSERT INTO packages (id, clinic_name, package_name, treatment_id, price, highlights) VALUES (?, ?, ?, ?, ?, ?)");
    packages.forEach(p => insertPackage.run(p.id, p.clinic_name, p.package_name, p.treatment_id, p.price, p.highlights));
    insertPackage.finalize();

    console.log("Database seeded successfully with synonyms!");
});

db.close();