document.addEventListener('DOMContentLoaded', () => {
    loadConcernTags();
});

async function loadConcernTags() {
    try {
        const response = await fetch('/api/concerns');
        if (!response.ok) throw new Error('Failed to load concerns');
        const concerns = await response.json();

        const container = document.getElementById('concerns-tags-container');
        const searchInput = document.getElementById('query-input');
        const searchForm = document.getElementById('search-form'); 

        concerns.forEach(concern => {
            const tag = document.createElement('button');
            tag.className = 'concern-tag';
            tag.textContent = concern.name;
            tag.type = 'button';

            tag.addEventListener('click', () => {

                searchInput.value = concern.name;

            });

            container.appendChild(tag);
        });
    } catch (error) {
        console.error('Error loading concern tags:', error);
    }
}

document.getElementById('search-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const query = document.getElementById('query-input').value;
    const resultsContainer = document.getElementById('results-container');
    const cardsContainer = document.querySelector('.cards-container');
    const mappedConcernSpan = document.getElementById('mapped-concern');
    const errorMessageDiv = document.getElementById('error-message');

    cardsContainer.innerHTML = '';
    resultsContainer.classList.add('hidden');
    errorMessageDiv.classList.add('hidden');

    try {
        const response = await fetch('/api/counsel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: query, invasiveness: 'any' })
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Something went wrong');
        }
        const data = await response.json();
        if (data.curated && data.curated.length > 0) {
            mappedConcernSpan.textContent = data.mapped_concern;
            displayResults(data.curated);
            resultsContainer.classList.remove('hidden');
        } else {
            errorMessageDiv.textContent = 'No suitable packages found for your concern.';
            errorMessageDiv.classList.remove('hidden');
        }
    } catch (error) {
        errorMessageDiv.textContent = `Error: ${error.message}`;
        errorMessageDiv.classList.remove('hidden');
    }
});

function displayResults(curated) {
    const cardsContainer = document.querySelector('.cards-container');
    const topChoice = [...curated].sort((a, b) => b.score - a.score)[0];
    const fasterRecovery = [...curated].sort((a, b) => a.package.typical_downtime_days - b.package.typical_downtime_days)[0];
    const budgetFriendly = [...curated].sort((a, b) => a.package.price - b.package.price)[0];

    const uniquePackages = new Map();
    uniquePackages.set(topChoice.package.id, { pkg: topChoice, label: 'Top Choice' });
    uniquePackages.set(fasterRecovery.package.id, { pkg: fasterRecovery, label: 'Faster Recovery' });
    uniquePackages.set(budgetFriendly.package.id, { pkg: budgetFriendly, label: 'Budget-Friendly' });

    uniquePackages.forEach(({ pkg, label }) => {
        const cardHTML = `
            <div class="card">
                <div class="label">${label}</div>
                <h3>${pkg.package.package_name}</h3>
                <div class="clinic">${pkg.package.clinic_name}</div>
                <div class="price">₹${pkg.package.price.toLocaleString('en-IN')}</div>
                <div class="highlights">Highlights: ${pkg.package.highlights}</div>

                <div class="breakdown">
                    <div class="score-container">
                        Score: ${pkg.score}
                        <div class="tooltip">
                            <b>Score Breakdown:</b><br>
                            Efficacy Score: ${pkg.breakdown.efficacy}<br>
                            Downtime Penalty: ${pkg.breakdown.downtime_penalty}<br>
                            Price Penalty: ${pkg.breakdown.price_penalty}
                        </div>
                    </div>
                </div>

                <button onclick="enquireNow()">Enquire</button>
            </div>`;
        cardsContainer.innerHTML += cardHTML;
    });
}

function enquireNow() {
    alert('Enquiry submitted (stub)!');
    fetch('/api/enquiries', { method: 'POST' });
}