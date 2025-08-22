# Counsel Assistant

This is a mini-search engine and recommendation service for cosmetic treatments. It maps a user's free-text concern (including synonyms) to canonical database entries, finds relevant treatment packages, and returns a curated list based on an explainable scoring algorithm.

---

## Features

* **Dynamic Concern Mapping:** Maps free-text user queries to known medical concerns.
* **Synonym-Aware Search:** Understands user queries even when they use synonyms (e.g., "pimples" maps to "acne scars").
* **Explainable Scoring:** Ranks each treatment package using a clear formula based on Efficacy, a Downtime Penalty, and a normalized Price Penalty.
* **Curated Recommendations:** Presents the top 3 results as "Top Choice," "Faster Recovery," and "Budget-Friendly."
* **Interactive UI:** Includes clickable tags for all concerns to guide users.
* **Score Breakdown Tooltip:** Provides a detailed breakdown of the score components on hover for full transparency.

---

## Tech Stack

* **Frontend:** HTML, CSS, Vanilla JavaScript
* **Backend:** Node.js, Express.js
* **Database:** SQLite
* **Deployment:**
    * Frontend deployed on **Netlify**.
    * Backend & Database deployed on **Render** (using a persistent disk).

---

## Local Development Setup

To run this project on your local machine, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Seed the database:** This command creates the `data.db` file and populates it with the sample data and synonyms.
    ```bash
    npm run seed
    ```

3.  **Start the server:**
    ```bash
    npm start
    ```
    The application will be running at `http://localhost:3000`.

4.  **Run tests:** This will run the Jest unit tests to verify the API logic.
    ```bash
    npm test
    ```

---

## Scoring Formula Explanation

The package ranking is determined by a final score calculated from three components: efficacy, downtime penalty, and price penalty. The **Efficacy Score** is a constant positive base value (60) assigned to any package that matches the user's concern, representing its relevance. The **Downtime Penalty** is a negative score that increases with longer recovery times; it is amplified if a user prefers a 'non-invasive' option but the package is invasive. The **Price Penalty** is a normalized negative score that positions each package on a scale from the cheapest to the most expensive option among the candidates, ensuring that price is penalized fairly regardless of the absolute cost. The sum of these three values provides a balanced, explainable score used to curate the top recommendations.