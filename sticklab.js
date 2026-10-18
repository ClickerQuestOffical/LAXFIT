// LAXFIT Stick Lab - Adaptive Lacrosse Stick Customizer
// Main application logic for stick customization

class StickLab {
    constructor() {
        this.currentStep = 0; // 0: welcome, 1: position, 2: budget, 3: equipment quiz, 4: tape quiz, 5: results
        this.playerProfile = {}; // imported or manually entered position profile
        this.budgetTier = null; // 'low', 'mid', 'high'
        this.budgetAmount = 0; // actual budget amount in dollars
        this.answers = {}; // stick quiz answers
        this.tapeAnswers = {}; // tape quiz answers
        this.questionBank = [];
        this.availableQuestions = new Set();
        this.askedQuestions = new Set();
        this.tapeQuestionBank = [];
        this.tapeAvailableQuestions = new Set();
        this.tapeAskedQuestions = new Set();
        this.recommendedBuild = null; // {shaft, head, mesh, tape, tapeRecommendation, totalPrice}
        this.positions = [
            { id: 'x_attack', name: 'X Attackman', category: 'Attack' },
            { id: 'wing_attack', name: 'Wing Attackman', category: 'Attack' },
            { id: 'crease_attack', name: 'Crease Attackman', category: 'Attack' },
            { id: 'offensive_midfield', name: 'Offensive Midfielder', category: 'Midfield' },
            { id: 'two_way_midfield', name: 'Two-Way Midfielder', category: 'Midfield' },
            { id: 'faceoff_specialist', name: 'Faceoff Specialist (FOGO)', category: 'Midfield' }
        ];
        this.budgetOptions = [
            { id: 'low', name: 'Low Budget', amount: 150, description: '$0-$150' },
            { id: 'mid', name: 'Mid Budget', amount: 250, description: '$150-$250' },
            { id: 'high', name: 'High Budget', amount: 400, description: '$250+' }
        ];
        this.initialize();
    }

    initialize() {
        this.loadStickQuestionBank();
        this.bindEvents();
        this.loadPositionOptions();
        this.loadBudgetOptions();
        this.showStep(0);
    }

    loadStickQuestionBank() {
        // Question bank for stick customization
        this.questionBank = [
            {
                id: 'sq1',
                text: "What matters most to you in a shaft?",
                answers: [
                    { text: "As light as reasonably possible", trait: 'weight_priority', value: 'light' },
                    { text: "A balance between weight and durability", trait: 'weight_durability_balance', value: 'balanced' },
                    { text: "Durability and toughness above everything else", trait: 'durability_priority', value: 'durable' },
                    { text: "The best option I can get within my budget", trait: 'budget_priority', value: 'budget' },
                    { text: "I'm not sure", trait: 'unsure', value: 'unsure' }
                ],
                importance: 1.0,
                tags: ['shaft_preference']
            },
            {
                id: 'sq2',
                text: "Which shaft material do you prefer?",
                answers: [
                    { text: "Aluminum or alloy", material: 'aluminum' },
                    { text: "Carbon fiber", material: 'carbon_fiber' },
                    { text: "Composite", material: 'composite' },
                    { text: "Scandium-titanium alloys (Sc-Ti)", material: 'scandium_titanium' },
                    { text: "No preference; recommend a suitable option", material: 'no_preference' }
                ],
                importance: 0.9,
                tags: ['shaft_material']
            },
            {
                id: 'sq3',
                text: "How important is grip texture on your shaft?",
                answers: [
                    { text: "I need extra grip for control", grip_need: 'high' },
                    { text: "I prefer some grip texture", grip_need: 'medium' },
                    { text: "I like a smooth feel for hand movement", grip_need: 'low' },
                    { text: "I'm not sure", grip_need: 'unsure' }
                ],
                importance: 0.8,
                tags: ['grip_preference']
            },
            {
                id: 'sq4',
                text: "What head characteristics are most important for your play?",
                answers: [
                    { text: "Secure catching and ball control", trait: 'catching_control' },
                    { text: "Quick release and shooting speed", trait: 'quick_release' },
                    { text: "Stiffness for ground balls and durability", trait: 'stiffness' },
                    { text: "Flexibility for feel and responsiveness", trait: 'flexibility' },
                    { text: "I'm not sure", trait: 'unsure' }
                ],
                importance: 1.0,
                tags: ['head_preference']
            },
            {
                id: 'sq5',
                text: "Do you prefer a pre-strung head or to string your own?",
                answers: [
                    { text: "Pre-strung head - ready to play", preference: 'pre_strung' },
                    { text: "Unstrung head - I'll string it myself", preference: 'unstrung' },
                    { text: "I'm not sure", preference: 'unsure' }
                ],
                importance: 0.9,
                tags: ['stringing_preference']
            },
            {
                id: 'sq6',
                text: "What mesh type suits your playing style?",
                answers: [
                    { text: "Semi-soft mesh - balanced hold and release", mesh_type: 'semi_soft' },
                    { text: "Performance mesh - consistent release", mesh_type: 'performance' },
                    { text: "Hard mesh - maximum hold", mesh_type: 'hard' },
                    { text: "I'm not sure", mesh_type: 'unsure' }
                ],
                importance: 0.8,
                tags: ['mesh_preference']
            }
        ];

        // Tape question bank
        this.tapeQuestionBank = [
            {
                id: 'tq1',
                text: "What do you value most in shaft grip?",
                answers: [
                    { text: "More grip and control", value: 'more_grip' },
                    { text: "A smoother feel for moving my hands", value: 'smoother_feel' },
                    { text: "A balance of both", value: 'balanced' },
                    { text: "I'm not sure", value: 'unsure' }
                ],
                importance: 1.0,
                tags: ['grip_preference']
            },
            {
                id: 'tq2',
                text: "Where do you prefer extra grip on your shaft?",
                answers: [
                    { text: "Near the top of the shaft (top hand area)", value: 'top' },
                    { text: "Near the bottom of the shaft (bottom hand area)", value: 'bottom' },
                    { text: "Across most of the shaft", value: 'full' },
                    { text: "I need help deciding", value: 'unsure' }
                ],
                importance: 1.0,
                tags: ['tape_placement']
            },
            {
                id: 'tq3',
                text: "How much experience do you have taping a lacrosse stick?",
                answers: [
                    { text: "This is my first time", value: 'beginner' },
                    { text: "I've done it a few times", value: 'some_experience' },
                    { text: "I already know what I like", value: 'experienced' },
                    { text: "I'm not sure", value: 'unsure' }
                ],
                importance: 0.8,
                tags: ['experience']
            }
        ];
    }

    bindEvents() {
        // Welcome step buttons
        document.getElementById('customize-stick-btn').addEventListener('click', () => {
            this.startCustomization();
        });

        document.getElementById('import-position-btn').addEventListener('click', () => {
            this.importPositionResults();
        });

        document.getElementById('recommend-setup-btn').addEventListener('click', () => {
            this.recommendFullSetup();
        });

        // Position navigation
        document.getElementById('pos-prev-btn').addEventListener('click', () => {
            this.goToPreviousStep();
        });
        document.getElementById('pos-next-btn').addEventListener('click', () => {
            this.goToNextStep();
        });

        // Budget navigation
        document.getElementById('budget-prev-btn').addEventListener('click', () => {
            this.goToPreviousStep();
        });
        document.getElementById('budget-next-btn').addEventListener('click', () => {
            this.goToNextStep();
        });

        // Equipment quiz navigation
        document.getElementById('stick-prev-btn').addEventListener('click', () => {
            this.goToPreviousQuestion();
        });
        document.getElementById('stick-next-btn').addEventListener('click', () => {
            this.goToNextQuestion();
        });

        // Tape quiz navigation
        document.getElementById('tape-prev-btn').addEventListener('click', () => {
            this.goToPreviousTapeQuestion();
        });
        document.getElementById('tape-next-btn').addEventListener('click', () => {
            this.goToNextTapeQuestion();
        });

        // Results navigation
        document.getElementById('stick-retake-btn').addEventListener('click', () => {
            this.resetQuiz();
        });
        document.getElementById('stick-edit-btn').addEventListener('click', () => {
            // Go back to step 1 to edit
            this.goToStep(1);
        });
        document.getElementById('stick-new-assessment-btn').addEventListener('click', () => {
            this.resetQuiz();
        });
    }

    startCustomization() {
        this.currentStep = 1; // position selection
        this.showStep(this.currentStep);
    }

    importPositionResults() {
        // Try to import from existing position quiz storage
        const savedProfile = this.getSavedPositionProfile();
        if (savedProfile) {
            // Check if this is a supported position for stick lab
            const supportedPositions = [
                'x_attack', 'wing_attack', 'crease_attack',
                'offensive_midfield', 'two_way_midfield', 'faceoff_specialist'
            ];

            if (savedProfile.position && supportedPositions.includes(savedProfile.position)) {
                this.playerProfile = savedProfile;
                this.showImportConfirmation(savedProfile);
                // Auto-advance to budget selection (step 2)
                setTimeout(() => {
                    this.currentStep = 2; // budget
                    this.showStep(this.currentStep);
                }, 1500);
            } else {
                // Unsupported position (defense, goalie, etc.)
                this.showUnsupportedPosition(savedProfile);
            }
        } else {
            this.showNoSavedResults();
        }
    }

    recommendFullSetup() {
        // Use imported profile or ask for position, then go through budget and quick recommendations
        if (Object.keys(this.playerProfile).length === 0) {
            // No imported profile, ask for position manually
            this.showPositionSelection();
        } else {
            // Have profile, go to budget
            this.currentStep = 2; // budget is step 2
            this.showStep(this.currentStep);
        }
    }

    getSavedPositionProfile() {
        // Attempt to retrieve saved position data from localStorage (where the position quiz might save)
        try {
            const saved = localStorage.getItem('laxfitPositionResult');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Could not parse saved position data', e);
        }
        return null;
    }

    showImportConfirmation(profile) {
        // Show temporary confirmation
        const importBtn = document.getElementById('import-position-btn');
        importBtn.textContent = 'Imported!';
        importBtn.disabled = true;
        setTimeout(() => {
            importBtn.textContent = 'Import My Position Results';
            importBtn.disabled = false;
        }, 1000);
    }

    showNoSavedResults() {
        alert('No saved position results found. Please take the position finder quiz first or select your position manually.');
    }

    showUnsupportedPosition(profile) {
        const positionName = profile.positionName || 'This position';
        alert(`${positionName} customized stick recommendations are coming soon!\n\nYou can still use the Stick Lab by selecting a supported position (Attack, Midfield, or Faceoff) manually, or we'll notify you when defensive and goalie-specific recommendations are available.`);

        // Still allow them to continue with manual position selection
        this.showPositionSelection();
    }

    showPositionSelection() {
        this.currentStep = 1;
        this.showStep(this.currentStep);
    }

    loadPositionOptions() {
        const container = document.getElementById('position-options');
        container.innerHTML = '';

        this.positions.forEach(position => {
            const btn = document.createElement('button');
            btn.className = 'position-btn';
            btn.dataset.positionId = position.id;
            btn.innerHTML = `
                <h3>${position.name}</h3>
                <p>${position.category}</p>
            `;
            btn.addEventListener('click', () => {
                // Select this position
                document.querySelectorAll('.position-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                btn.classList.add('selected');
                this.playerProfile = {
                    position: position.id,
                    positionName: position.name,
                    positionCategory: position.category
                };
                // Add any additional traits from the imported profile if available
                if (this.importedProfileData) {
                    Object.assign(this.playerProfile, this.importedProfileData);
                }
            });
            container.appendChild(btn);
        });
    }

    loadBudgetOptions() {
        const container = document.getElementById('budget-options');
        container.innerHTML = '';

        this.budgetOptions.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'budget-btn';
            btn.dataset.budgetId = option.id;
            btn.dataset.budgetAmount = option.amount;
            btn.innerHTML = `
                <h3>${option.name}</h3>
                <p>${option.description}</p>
                <div class="budget-amount">$${option.amount}</div>
            `;
            btn.addEventListener('click', () => {
                // Select this budget
                document.querySelectorAll('.budget-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                btn.classList.add('selected');
                this.budgetTier = option.id;
                this.budgetAmount = option.amount;
            });
            container.appendChild(btn);
        });
    }

    showStep(stepIndex) {
        // Hide all steps, show the requested step
        document.querySelectorAll('.stick-lab-step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById(`stick-lab-step-${stepIndex}`).classList.add('active');

        // Update progress indicators
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });

        this.currentStep = stepIndex;

        // Initialize step-specific content
        if (stepIndex === 3) { // Equipment quiz step
            this.startQuiz();
        } else if (stepIndex === 4) { // Tape quiz step
            this.startTapeQuiz();
        } else if (stepIndex === 5) { // Results step
            this.showResults();
        }
    }

    goToPreviousStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    goToNextStep() {
        if (this.currentStep < 5) {
            this.showStep(this.currentStep + 1);
        }
    }

    goToStep(stepIndex) {
        this.showStep(stepIndex);
    }

    // Quiz methods
    startQuiz() {
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.askedQuestions = new Set();
        this.availableQuestions = new Set(this.questionBank.map(q => q.id));
        this.loadStickQuestion();
    }

    // Tape Quiz methods
    startTapeQuiz() {
        this.currentTapeQuestionIndex = 0;
        this.tapeAnswers = {};
        this.tapeAskedQuestions = new Set();
        this.tapeAvailableQuestions = new Set(this.tapeQuestionBank.map(q => q.id));
        this.loadTapeQuestion();
    }

    loadStickQuestion() {
        // Filter questions based on availability
        const availableQuestionIds = [...this.availableQuestions].filter(id =>
            !this.askedQuestions.has(id)
        );

        if (availableQuestionIds.length === 0) {
            this.showResults();
            return;
        }

        // Select next question using adaptive algorithm
        const nextQuestionId = this.chooseNextStickQuestion(availableQuestionIds);
        const question = this.questionBank.find(q => q.id === nextQuestionId);

        if (!question) {
            this.showResults();
            return;
        }

        // Mark question as asked
        this.askedQuestions.add(nextQuestionId);
        this.availableQuestions.delete(nextQuestionId);

        // Display question
        this.displayStickQuestion(question);
    }

    chooseNextStickQuestion(availableQuestionIds) {
        // Simple adaptive algorithm: for now, just pick the first available
        // In a full implementation, this would use entropy-based selection
        // but considering we also have position profile and budget info
        return availableQuestionIds[0];
    }

    displayStickQuestion(question) {
        // Update progress
        const progress = ((this.currentQuestionIndex + 1) / Math.min(6, this.questionBank.length)) * 100;
        document.getElementById('stick-progress-fill').style.width = progress + '%';
        document.getElementById('stick-question-counter').textContent = `Question ${this.currentQuestionIndex + 1}`;

        // Display question text
        const questionContainer = document.getElementById('stick-question-container');
        questionContainer.innerHTML = `
            <div class="question-text">${question.text}</div>
            <div class="answer-options">
                ${question.answers.map((answer, index) => `
                    <button class="answer-btn" data-index="${index}">
                        ${answer.text}
                    </button>
                `).join('')}
            </div>
        `;

        // Add event listeners to answer buttons
        questionContainer.querySelectorAll('.answer-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.selectStickAnswer(button, question);
            });
        });
    }

    selectStickAnswer(button, question) {
        // Remove selection from all buttons
        button.parentElement.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Add selection to clicked button
        button.classList.add('selected');

        // Store answer
        const answerIndex = parseInt(button.dataset.index);
        const selectedAnswer = question.answers[answerIndex];
        this.answers[question.id] = {
            text: selectedAnswer.text,
            ...selectedAnswer
        };

        // Move to next question
        this.currentQuestionIndex++;
        this.loadStickQuestion();
    }

    goToPreviousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.loadStickQuestion();
        }
    }

    goToNextQuestion() {
        this.loadStickQuestion();
    }

    // Tape Quiz Methods
    loadTapeQuestion() {
        // Filter questions based on availability
        const availableQuestionIds = [...this.tapeAvailableQuestions].filter(id =>
            !this.tapeAskedQuestions.has(id)
        );

        if (availableQuestionIds.length === 0) {
            this.showTapeResults();
            return;
        }

        // Select next question using simple adaptive algorithm
        const nextQuestionId = this.chooseNextTapeQuestion(availableQuestionIds);
        const question = this.tapeQuestionBank.find(q => q.id === nextQuestionId);

        if (!question) {
            this.showTapeResults();
            return;
        }

        // Mark question as asked
        this.tapeAskedQuestions.add(nextQuestionId);
        this.tapeAvailableQuestions.delete(nextQuestionId);

        // Display question
        this.displayTapeQuestion(question);
    }

    chooseNextTapeQuestion(availableQuestionIds) {
        // Simple adaptive algorithm: for now, just pick the first available
        return availableQuestionIds[0];
    }

    displayTapeQuestion(question) {
        // Update progress
        const progress = ((this.currentTapeQuestionIndex + 1) / Math.min(3, this.tapeQuestionBank.length)) * 100;
        document.getElementById('tape-progress-fill').style.width = progress + '%';
        document.getElementById('tape-question-counter').textContent = `Question ${this.currentTapeQuestionIndex + 1}`;

        // Display question text
        const questionContainer = document.getElementById('tape-question-container');
        questionContainer.innerHTML = `
            <div class="question-text">${question.text}</div>
            <div class="answer-options">
                ${question.answers.map((answer, index) => `
                    <button class="answer-btn" data-index="${index}">
                        ${answer.text}
                    </button>
                `).join('')}
            </div>
        `;

        // Add event listeners to answer buttons
        questionContainer.querySelectorAll('.answer-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.selectTapeAnswer(button, question);
            });
        });
    }

    selectTapeAnswer(button, question) {
        // Remove selection from all buttons
        button.parentElement.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Add selection to clicked button
        button.classList.add('selected');

        // Store answer
        const answerIndex = parseInt(button.dataset.index);
        const selectedAnswer = question.answers[answerIndex];
        this.tapeAnswers[question.id] = {
            text: selectedAnswer.text,
            ...selectedAnswer
        };

        // Move to next question
        this.currentTapeQuestionIndex++;
        this.loadTapeQuestion();
    }

    goToPreviousTapeQuestion() {
        if (this.currentTapeQuestionIndex > 0) {
            this.currentTapeQuestionIndex--;
            this.loadTapeQuestion();
        }
    }

    goToNextTapeQuestion() {
        this.loadTapeQuestion();
    }

    // Tape Results Methods
    showTapeResults() {
        // We'll show tape results as part of the main results or in a modal
        // For now, we'll store them and include in the main results display
        this.showResults(); // This will now include tape recommendations
    }

    generateTapeRecommendation() {
        // Generate tape recommendation based on answers
        const gripPreference = this.tapeAnswers.tq1 ? this.tapeAnswers.tq1.value : 'balanced';
        const tapePlacement = this.tapeAnswers.tq2 ? this.tapeAnswers.tq2.value : 'bottom'; // default to bottom
        const experience = this.tapeAnswers.tq3 ? this.tapeAnswers.tq3.value : 'beginner';

        // Determine tape pattern
        let tapePattern = 'bottom'; // default
        let explanation = '';

        if (gripPreference === 'more_grip') {
            if (tapePlacement === 'top') {
                tapePattern = 'top';
                explanation = 'You prefer more grip control for your top hand.';
            } else if (tapePlacement === 'bottom') {
                tapePattern = 'bottom';
                explanation = 'You prefer more grip control for your bottom hand.';
            } else if (tapePlacement === 'full') {
                tapePattern = 'full';
                explanation = 'You want maximum grip control across the entire shaft.';
            }
        } else if (gripPreference === 'smoother_feel') {
            if (tapePlacement === 'top') {
                tapePattern = 'top';
                explanation = 'You prefer a smoother feel for your top hand to allow easy movement.';
            } else if (tapePlacement === 'bottom') {
                tapePattern = 'bottom';
                explanation = 'You prefer a smoother feel for your bottom hand.';
            } else if (tapePlacement === 'full') {
                tapePattern = 'none';
                explanation = 'You prefer minimal tape for maximum hand movement flexibility.';
            }
        } else { // balanced
            if (tapePlacement === 'top') {
                tapePattern = 'top';
                explanation = 'You want a balanced approach with grip control for your top hand.';
            } else if (tapePlacement === 'bottom') {
                tapePattern = 'bottom';
                explanation = 'You want a balanced approach with grip control for your bottom hand.';
            } else if (tapePlacement === 'full') {
                tapePattern = 'full';
                explanation = 'You want balanced grip control across the entire shaft.';
            } else {
                tapePattern = 'bottom'; // default
                explanation = 'You want a balanced grip setup.';
            }
        }

        // Adjust based on experience
        if (experience === 'beginner' && tapePattern === 'full') {
            explanation += ' For beginners, we recommend starting with less tape until you develop your preferred hand positioning.';
        }

        return {
            pattern: tapePattern,
            explanation: explanation,
            placement: tapePlacement,
            gripPreference: gripPreference,
            experience: experience
        };
    }

    // Results methods
    showResults() {
        this.showStep(5);
        this.calculateAndDisplayResults();
    }

    calculateAndDisplayResults() {
        // Calculate recommended build based on Profile + Answers + Budget
        this.recommendedBuild = this.generateRecommendedBuild();
        this.displayResults();
    }

    generateRecommendedBuild() {
        // This is where the recommendation algorithm would go
        // For now, we'll return a mock recommendation based on simple logic

        // Import products data
        const products = window.LACROSSE_PRODUCTS || {};

        // Simple recommendation logic based on position and budget
        let recommendedShaft = null;
        let recommendedHead = null;
        let recommendedMesh = null;
        let recommendedTape = null;

        // Filter shafts by budget and position suitability
        const suitableShafts = products.shafts ?
            products.shafts.filter(s =>
                s.price <= this.budgetAmount * 0.4 && // Shaft gets ~40% of budget
                (positionSuitabilityMatch(s.positionSuitability || [], this.playerProfile.position) ||
                 s.positionSuitability.includes('all'))
            ) : [];

        // Sort by weight preference if specified
        const weightPreference = this.answers.sq1 ? this.answers.sq1.value : 'balanced';
        if (weightPreference === 'light') {
            suitableShafts.sort((a, b) => parseFloat(a.weight) - parseFloat(b.weight));
        } else if (weightPreference === 'durable') {
            suitableShafts.sort((a, b) => {
                // Simple durability scoring - aluminum/alloy tend to be more durable
                const durabilityScore = (shaft) => {
                    if (shaft.material.includes('Aluminum') || shaft.material.includes('alloy') ||
                        shaft.material.includes('Scandium')) return 3;
                    if (shaft.material.includes('Carbon Fiber')) return 2;
                    return 1;
                };
                return durabilityScore(b) - durabilityScore(a);
            });
        }

        recommendedShaft = suitableShafts[0] || (products.shafts ? products.shafts[0] : null);

        // Similar logic for heads
        const suitableHeads = products.heads ?
            products.heads.filter(h =>
                h.price <= this.budgetAmount * 0.3 && // Head gets ~30% of budget
                (positionSuitabilityMatch(h.positionSuitability || [], this.playerProfile.position) ||
                 h.positionSuitability.includes('all'))
            ) : [];

        // Filter by head preference from answers
        const headPreference = this.answers.sq4 ? this.answers.sq4.trait : 'catching_control';
        if (headPreference === 'quick_release') {
            suitableHeads.sort((a, b) => {
                // Prefer heads described as having quick release
                const quickReleaseScore = (head) => {
                    const desc = head.description.toLowerCase();
                    if (desc.includes('quick release') || desc.includes('responsive')) return 2;
                    return 1;
                };
                return quickReleaseScore(b) - quickReleaseScore(a);
            });
        } else if (headPreference === 'stiffness') {
            suitableHeads.sort((a, b) => {
                const stiffnessScore = (head) => {
                    if (head.stiffness === 'Stiff') return 2;
                    if (head.stiffness === 'Medium-Flex') return 1.5;
                    return 1;
                };
                return stiffnessScore(b) - stiffnessScore(a);
            });
        }

        recommendedHead = suitableHeads[0] || (products.heads ? products.heads[0] : null);

        // Mesh selection
        const suitableMesh = products.mesh ?
            products.mesh.filter(m =>
                m.price <= this.budgetAmount * 0.15 // Mesh gets ~15% of budget
            ) : [];

        const meshPreference = this.answers.sq6 ? this.answers.sq6.mesh_type : 'semi_soft';
        if (meshPreference === 'semi_soft') {
            suitableMesh.sort((a, b) => {
                const semiSoftScore = (mesh) =>
                    mesh.material.includes('Semi-soft') ? 2 : 1;
                return semiSoftScore(b) - semiSoftScore(a);
            });
        } else if (meshPreference === 'performance') {
            suitableMesh.sort((a, b) => {
                const perfScore = (mesh) =>
                    mesh.material.includes('Performance') ? 2 : 1;
                return perfScore(b) - perfScore(a);
            });
        } else if (meshPreference === 'hard') {
            suitableMesh.sort((a, b) => {
                const hardScore = (mesh) =>
                    mesh.material.includes('Hard') ? 2 : 1;
                return hardScore(b) - hardScore(a);
            });
        }

        recommendedMesh = suitableMesh[0] || (products.mesh ? products.mesh[0] : null);

        // Tape selection - simpler
        const suitableTape = products.tape ?
            products.tape.filter(t =>
                t.price <= this.budgetAmount * 0.15 // Tape gets ~15% of budget
            ) : [];

        // For tape, we might want to consider grip preference from answers
        const gripNeed = this.answers.sq3 ? this.answers.sq3.grip_need : 'medium';
        if (gripNeed === 'high') {
            suitableTape.sort((a, b) => {
                const gripScore = (tape) =>
                    tape.traits.includes('grip') ? 2 : 1;
                return gripScore(b) - gripScore(a);
            });
        }

        recommendedTape = suitableTape[0] || (products.tape ? products.tape[0] : null);

        // Calculate total price
        const totalPrice = (recommendedShaft ? recommendedShaft.price : 0) +
                          (recommendedHead ? recommendedHead.price : 0) +
                          (recommendedMesh ? recommendedMesh.price : 0) +
                          (recommendedTape ? recommendedTape.price : 0);

        // Get tape recommendation
        const tapeRecommendation = this.generateTapeRecommendation();

        return {
            shaft: recommendedShaft,
            head: recommendedHead,
            mesh: recommendedMesh,
            tape: recommendedTape,
            tapeRecommendation: tapeRecommendation,
            totalPrice: totalPrice,
            budgetRemaining: this.budgetAmount - totalPrice
        };
    }

    displayResults() {
        if (!this.recommendedBuild) {
            document.getElementById('stick-results-content').innerHTML = '<p>Unable to generate recommendations. Please try again.</p>';
            return;
        }

        const build = this.recommendedBuild;
        const { shaft, head, mesh, tape, totalPrice, budgetRemaining, tapeRecommendation } = build;

        let resultsHTML = `<h2>Your Recommended Stick Build</h2>`;

        // Position and budget info
        resultsHTML += `
            <div class="results-summary">
                <p><strong>Position:</strong> ${this.playerProfile.positionName || 'Not selected'}</p>
                <p><strong>Budget:</strong> $${this.budgetAmount} (${this.budgetTier})</p>
                <p><strong>Estimated Total:</strong> $${totalPrice.toFixed(2)}</p>
                <p><strong>Remaining Budget:</strong> $${budgetRemaining.toFixed(2)}</p>
            </div>
        `;

        // Component cards
        resultsHTML += `<div class="component-cards">`;

        if (shaft) {
            resultsHTML += this.createComponentCard('Shaft', shaft, 'shaft');
        }
        if (head) {
            resultsHTML += this.createComponentCard('Head', head, 'head');
        }
        if (mesh) {
            resultsHTML += this.createComponentCard('Mesh & Pocket', mesh, 'mesh');
        }
        if (tape) {
            resultsHTML += this.createComponentCard('Tape & Grip', tape, 'tape');
        }

        resultsHTML += `</div>`;

        // Tape recommendation
        if (tapeRecommendation) {
            resultsHTML += `
                <div class="tape-recommendation">
                    <h3>Tape Recommendation</h3>
                    <p><strong>Pattern:</strong> ${this.formatTapePattern(tapeRecommendation.pattern)}</p>
                    <p><strong>Explanation:</strong> ${tapeRecommendation.explanation}</p>
                    ${this.createTapeDiagram(tapeRecommendation.pattern)}
                </div>
            `;
        }

        // Explanation
        resultsHTML += `
            <div class="explanation">
                <h3>Why This Build Works for You</h3>
                <p>Based on your position as a ${this.playerProfile.positionName || 'selected position'},
                   your budget of $${this.budgetAmount}, and your answers to our questions,
                   we've selected components that balance performance, durability, and value.</p>
                ${this.generateExplanation()}
            </div>
        `;

        document.getElementById('stick-results-content').innerHTML = resultsHTML;
    }

    createComponentCard(title, product, type) {
        return `
            <div class="component-card">
                <h3>${title}</h3>
                ${product.image ? `<img src="${product.image}" alt="${product.name}" class="component-image">` : ''}
                <div class="component-details">
                    <p><strong>${product.brand}</strong> ${product.name}</p>
                    <p>${product.description}</p>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    ${product.url ? `<a href="${product.url}" target="_blank" class="btn btn-sm">View Product</a>` : ''}
                    ${type === 'shaft' && product.material ? `<p><strong>Material:</strong> ${product.material}</p>` : ''}
                    ${type === 'head' && product.width ? `<p><strong>Width:</strong> ${product.width}</p>` : ''}
                    ${type === 'head' && product.stiffness ? `<p><strong>Stiffness:</strong> ${product.stiffness}</p>` : ''}
                </div>
            </div>
        `;
    }

    generateExplanation() {
        let explanation = '<ul>';

        if (this.playerProfile.position) {
            explanation += `<li>Position: Optimized for ${this.playerProfile.positionName}</li>`;
        }

        explanation += `<li>Budget: Within your $${this.budgetAmount} budget</li>`;

        // Add explanations based on answers
        if (this.answers.sq1) {
            const weightPref = this.answers.sq1.value;
            if (weightPref === 'light') explanation += `<li>Shaft: Prioritizing lightweight design for better maneuverability</li>`;
            else if (weightPref === 'durable') explanation += `<li>Shaft: Focusing on durability for long-lasting performance</li>`;
            else if (weightPref === 'budget') explanation += `<li>Shaft: Maximizing value within your budget constraints</li>`;
        }

        if (this.answers.sq4) {
            const headPref = this.answers.sq4.trait;
            if (headPref === 'quick_release') explanation += `<li>Head: Selected for quick release and shooting speed</li>`;
            else if (headPref === 'catching_control') explanation += `<li>Head: Optimized for secure catching and ball control</li>`;
            else if (headPref === 'stiffness') explanation += `<li>Head: Chosen for stiffness to improve ground ball play</li>`;
            else if (headPref === 'flexibility') explanation += `<li>Head: Selected for flexibility and feel</li>`;
        }

        explanation += '</ul>';
        return explanation;
    }

    formatTapePattern(pattern) {
        switch(pattern) {
            case 'top': return 'Top-only tape';
            case 'bottom': return 'Bottom-only tape';
            case 'full': return 'Full-shaft tape';
            case 'none': return 'Minimal/no tape';
            default: return pattern;
        }
    }

    createTapeDiagram(pattern) {
        // Simple SVG diagram showing tape placement
        const diagramMap = {
            'top': '<svg width="100" height="20"><rect x="0" y="0" width="100" height="5" fill="#00ff88"/><text x="50" y="15" text-anchor="middle" fill="#000" font-size="10">Top Tape Area</text></svg>',
            'bottom': '<svg width="100" height="20"><rect x="0" y="15" width="100" height="5" fill="#00ff88"/><text x="50" y="10" text-anchor="middle" fill="#000" font-size="10">Bottom Tape Area</text></svg>',
            'full': '<svg width="100" height="20"><rect x="0" y="0" width="100" height="20" fill="#00ff88"/><text x="50" y="12" text-anchor="middle" fill="#000" font-size="10">Full Shaft Tape</text></svg>',
            'none': '<svg width="100" height="20"><rect x="0" y="0" width="100" height="20" fill="none" stroke="#ffffff" stroke-width="1"/><text x="50" y="12" text-anchor="middle" fill="#ffffff" font-size="10">No Tape</text></svg>'
        };

        return `<div class="tape-diagram">${diagramMap[pattern] || ''}</div>`;
    }
}

// Helper function
function positionSuitabilityMatch(positionSuitabilityArray, playerPosition) {
    if (!Array.isArray(positionSuitabilityArray) || !playerPosition) return false;
    return positionSuitabilityArray.includes(playerPosition);
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Make sure products.js is loaded first
    window.stickLab = new StickLab();
});