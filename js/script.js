document.addEventListener("DOMContentLoaded", () => {
    const dialogBox = document.getElementById("dialog-box");

    function showLoader() {
        // Create a loader overlay element
        const loader = document.createElement('div');
        loader.id = 'loader-overlay';
        loader.innerHTML = `
            <div class="loader-container">
                <img src="assets/loader.gif" alt="Loading..." class="loader-image">
            </div>
        `;
        document.body.appendChild(loader);
    }

    function hideLoader() {
        const loader = document.getElementById('loader-overlay');
        if (loader) {
            loader.remove();
        }
    }

    async function handleQuery(data) {
        try {
            // Show loader
            showLoader();

            const response = await fetch("http://localhost:5000/process-query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            // Hide loader
            hideLoader();

            if (response.ok) {
                const internships = await response.json();
                displayResults(internships);
            } else {
                const errorText = await response.text();
                console.error("Error:", errorText);
                alert("Failed to process query. Please check the console for details.");
            }
        } catch (error) {
            // Hide loader
            hideLoader();

            console.error("Error:", error);
            alert("An error occurred while processing your query. Please try again.");
        }
    }

    function displayResults(internships) {
        if (!internships || internships.length === 0) {
            dialogBox.innerHTML = `
                <h2>No Results Found</h2>
                <button id="go-back">Go Back</button>
            `;
            attachGoBackListener();
            return;
        }

        try {
            let formattedResults = internships
                .map(
                    (internship) => `
                    <div class="result-card">
                        <h3 class="result-title">${internship.title}</h3>
                        <div class="result-content">
                            <p><strong>URL:</strong></p>
                            <a class="result-link" href="${internship.url}" target="_blank">${internship.url}</a>
                        </div>
                        <div class="result-section">
                            <p><strong>Skills:</strong></p>
                            <ul class="result-list">
                                ${internship.skills.map((skill) => `<li>${skill}</li>`).join("")}
                            </ul>
                        </div>
                        <div class="result-section">
                            <p><strong>Free Resources:</strong></p>
                            <ul class="result-list">
                                ${internship.free_resources
                                    .map(
                                        (resource) => `
                                        <li>
                                            <a class="resource-link" href="${resource}" target="_blank">${resource}</a>
                                        </li>
                                    `
                                    )
                                    .join("")}
                            </ul>
                        </div>
                    </div>
                `
                )
                .join("");

            dialogBox.innerHTML = `
                <h2>Results</h2>
                <div class="result-container">
                    ${formattedResults}
                </div>
                <button id="go-back">Go Back</button>
            `;
            attachGoBackListener();
        } catch (error) {
            console.error("Error displaying results:", error);
            dialogBox.innerHTML = `
                <h2>Error Displaying Results</h2>
                <p>Please check the console for more details.</p>
                <button id="go-back">Go Back</button>
            `;
            attachGoBackListener();
        }
    }

    function attachGoBackListener() {
        const goBackButton = document.getElementById("go-back");
        goBackButton?.addEventListener("click", () => {
            window.location.reload();
        });
    }

    function attachListeners() {
        const dontKnowButton = document.getElementById("dont-know");
        const submitInterestButton = document.getElementById("submit-interest");

        dontKnowButton?.addEventListener("click", () => {
            dialogBox.innerHTML = `
                <h2>Tell us more about yourself!</h2>
                <input type="text" id="skills-input" placeholder="Enter your current skills" />
                <input type="text" id="hobbies-input" placeholder="Enter your interests or hobbies" />
                <button id="submit-details">Submit</button>
            `;

            const submitDetailsButton = document.getElementById("submit-details");
            submitDetailsButton?.addEventListener("click", () => {
                const skills = document.getElementById("skills-input").value.trim();
                const hobbies = document.getElementById("hobbies-input").value.trim();

                if (skills && hobbies) {
                    handleQuery({ type: "skills_and_hobbies", skills, hobbies });
                } else {
                    alert("Please fill out both fields before submitting!");
                }
            });
        });

        submitInterestButton?.addEventListener("click", () => {
            const careerInterest = document.getElementById("career-input").value.trim();
            if (careerInterest) {
                handleQuery({ type: "career_interest", careerInterest });
            } else {
                alert("Please enter a career interest before submitting!");
            }
        });
    }

    attachListeners();
});
