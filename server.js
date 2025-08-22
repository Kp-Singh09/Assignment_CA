const express = require('express');
const db = require('./database.js');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/api/concerns', async (req, res) => {
    try {
        const concerns = await new Promise((resolve, reject) => {
            db.all("SELECT name FROM concerns ORDER BY name ASC", [], (err, rows) => {
                if (err) reject(err); else resolve(rows);
            });
        });
        res.json(concerns);
    } catch (error) {
        console.error("Failed to fetch concerns:", error);
        res.status(500).json({ error: 'Failed to fetch concerns' });
    }
});

app.post('/api/counsel', async (req, res) => {
    const { q, invasiveness } = req.body;
    if (!q) return res.status(400).json({ error: 'Query "q" is required.' });

    try {
        const allConcernsWithSynonyms = await new Promise((resolve, reject) => {
            const sql = `
                SELECT c.id, c.name, GROUP_CONCAT(s.synonym) as synonyms
                FROM concerns c
                LEFT JOIN concern_synonyms s ON c.id = s.concern_id
                GROUP BY c.id, c.name
            `;
            db.all(sql, [], (err, rows) => {
                if (err) reject(err); else resolve(rows);
            });
        });

        const lowerCaseQuery = q.toLowerCase();
        let mappedConcern = null;
        for (const concern of allConcernsWithSynonyms) {
            if (lowerCaseQuery.includes(concern.name)) {
                mappedConcern = { id: concern.id, name: concern.name };
                break;
            }
            if (concern.synonyms) {
                const synonymList = concern.synonyms.split(',');
                if (synonymList.some(syn => lowerCaseQuery.includes(syn))) {
                    mappedConcern = { id: concern.id, name: concern.name };
                    break;
                }
            }
        }

        if (!mappedConcern) return res.status(404).json({ error: "Could not map query to a known concern." });

        const concernTreatments = await new Promise((resolve, reject) => {
            db.all("SELECT treatment_id FROM concern_treatments WHERE concern_id = ?", [mappedConcern.id], (err, rows) => err ? reject(err) : resolve(rows));
        });
        const treatmentIds = concernTreatments.map(ct => ct.treatment_id);
        if (treatmentIds.length === 0) return res.json({ query: q, mapped_concern: mappedConcern.name, treatments: [], curated: [], alternatives: [] });
        
        let query = `
            SELECT p.*, t.name as treatment_name, t.invasiveness, t.typical_downtime_days
            FROM packages p JOIN treatments t ON p.treatment_id = t.id
            WHERE p.treatment_id IN (${treatmentIds.map(() => '?').join(',')})`;
        const queryParams = [...treatmentIds];
        if (invasiveness && invasiveness !== 'any') {
            query += " AND t.invasiveness = ?";
            queryParams.push(invasiveness);
        }
        const candidatePackages = await new Promise((resolve, reject) => {
            db.all(query, queryParams, (err, rows) => err ? reject(err) : resolve(rows));
        });

        const scoredPackages = scorePackages(candidatePackages, req.body);
        scoredPackages.sort((a, b) => b.score - a.score);

        const response = {
            query: q,
            mapped_concern: mappedConcern.name,
            treatments: await getTreatmentsByIds(treatmentIds),
            curated: scoredPackages.slice(0, 3),
            alternatives: scoredPackages.slice(3, 11)
        };
        res.json(response);
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

app.post('/api/enquiries', (req, res) => {
    console.log("Enquiry received:", req.body);
    res.status(200).json({ message: "Enquiry successfully submitted." });
});

function scorePackages(packages, filters) {
    if (packages.length === 0) return [];
    const prices = packages.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return packages.map(pkg => {
        const efficacy = 60;
        let downtime_penalty = -pkg.typical_downtime_days * 2;
        if (filters.invasiveness === 'non-invasive' && pkg.invasiveness !== 'non-invasive') downtime_penalty *= 3;

        let price_penalty = 0;
        if (maxPrice > minPrice) price_penalty = -30 * ((pkg.price - minPrice) / (maxPrice - minPrice));

        const finalScore = efficacy + downtime_penalty + price_penalty;
        return {
            package: pkg,
            score: parseFloat(finalScore.toFixed(2)),
            breakdown: { efficacy, downtime_penalty: parseFloat(downtime_penalty.toFixed(2)), price_penalty: parseFloat(price_penalty.toFixed(2)) }
        };
    });
}

async function getTreatmentsByIds(ids) {
    return new Promise((resolve, reject) => {
        const query = `SELECT id, name FROM treatments WHERE id IN (${ids.map(() => '?').join(',')})`;
        db.all(query, ids, (err, rows) => err ? reject(err) : resolve(rows));
    });
}
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;