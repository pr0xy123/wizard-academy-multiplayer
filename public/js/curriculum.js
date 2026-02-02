// curriculum.js - Educational content and question generation

const Curriculum = {
    math: {
        elementary: [
            { q: "What is 5 + 7?", a: "12", hints: ["Think of 5 fingers plus 7 more", "Count up from 5"] },
            { q: "What is 12 - 4?", a: "8", hints: ["Take 4 away from 12", "Count backwards"] },
            { q: "What is 3 × 4?", a: "12", hints: ["3 groups of 4", "Add 4+4+4"] },
            { q: "What is half of 20?", a: "10", hints: ["Divide 20 by 2", "Split 20 into two equal parts"] }
        ],
        middle: [
            { q: "What is 15 × 8?", a: "120", hints: ["Break it down: 15 × 8 = (10 × 8) + (5 × 8)", "Think 10 groups of 8, plus 5 more groups"] },
            { q: "What is 144 ÷ 12?", a: "12", hints: ["How many 12s fit into 144?", "Think of the times table for 12"] },
            { q: "What is 25% of 80?", a: "20", hints: ["25% means 1/4", "Divide 80 by 4"] },
            { q: "What is the square root of 64?", a: "8", hints: ["What number times itself equals 64?", "Think: ? × ? = 64"] }
        ],
        high: [
            { q: "Solve for x: 3x + 7 = 22", a: "5", hints: ["First subtract 7 from both sides", "Then divide by 3"] },
            { q: "What is the value of π (pi) to 2 decimal places?", a: "3.14", hints: ["The ratio of circumference to diameter", "Starts with 3.14..."] },
            { q: "If f(x) = 2x + 3, what is f(5)?", a: "13", hints: ["Substitute 5 for x", "Calculate 2(5) + 3"] }
        ]
    },
    science: {
        elementary: [
            { q: "What planet do we live on?", a: "earth", hints: ["It's the third planet from the sun", "The only planet with liquid water"] },
            { q: "How many legs does a spider have?", a: "8", hints: ["Insects have 6, spiders have more", "It's an even number"] },
            { q: "What do plants need to grow?", a: "water", hints: ["It falls from the sky", "You drink it too"], acceptMultiple: ["sunlight", "sun", "soil"] },
            { q: "What is the freezing point of water in Celsius?", a: "0", hints: ["When water turns to ice", "It's the lowest single digit"] }
        ],
        middle: [
            { q: "What is the chemical symbol for water?", a: "h2o", hints: ["Two hydrogen, one oxygen", "H₂O"] },
            { q: "What organ pumps blood through your body?", a: "heart", hints: ["It beats about 100,000 times a day", "Located in your chest"] },
            { q: "What is the speed of light in vacuum (in km/s)?", a: "300000", hints: ["About 300,000 km/s", "The fastest speed possible"], acceptMultiple: ["299792"] },
            { q: "What gas do plants absorb from the air?", a: "carbon dioxide", hints: ["CO₂", "It's what we breathe out"], acceptMultiple: ["co2"] }
        ],
        high: [
            { q: "What is Newton's second law of motion?", a: "f=ma", hints: ["Force equals...", "F = ma"], acceptMultiple: ["force equals mass times acceleration"] },
            { q: "What is the powerhouse of the cell?", a: "mitochondria", hints: ["Produces ATP", "Often called the cell's power plant"] },
            { q: "What is the atomic number of Carbon?", a: "6", hints: ["Carbon-12 is most common", "It's in group 14 of periodic table"] }
        ]
    },
    history: {
        elementary: [
            { q: "Who was the first President of the United States?", a: "george washington", hints: ["He's on the $1 bill", "His last name is a state capital"], acceptMultiple: ["washington"] },
            { q: "In what year did World War II end?", a: "1945", hints: ["Between 1940 and 1950", "Five years after 1940"] },
            { q: "What ancient civilization built the pyramids?", a: "egyptians", hints: ["They lived along the Nile River", "Known for pharaohs"], acceptMultiple: ["egypt", "egyptian"] }
        ],
        middle: [
            { q: "When did Christopher Columbus reach the Americas?", a: "1492", hints: ["In 14__ ", "The famous rhyme: '14-hundred and __-ty-two'"] },
            { q: "What was the name of the ship that brought the Pilgrims to America?", a: "mayflower", hints: ["Named after a flower", "Arrived in 1620"] },
            { q: "Who wrote the Declaration of Independence?", a: "thomas jefferson", hints: ["Third President of the US", "His first name is Thomas"], acceptMultiple: ["jefferson"] }
        ],
        high: [
            { q: "What year did the Berlin Wall fall?", a: "1989", hints: ["Late 1980s", "End of the Cold War era"] },
            { q: "Who was the British Prime Minister during most of WWII?", a: "winston churchill", hints: ["Famous for his speeches", "His first name is Winston"], acceptMultiple: ["churchill"] }
        ]
    },
    literature: {
        elementary: [
            { q: "Who wrote 'Romeo and Juliet'?", a: "shakespeare", hints: ["Famous English playwright", "The Bard"], acceptMultiple: ["william shakespeare"] },
            { q: "What type of animal is Charlotte in 'Charlotte's Web'?", a: "spider", hints: ["She spins words in her web", "Has 8 legs"] },
            { q: "Who wrote 'Harry Potter'?", a: "j.k. rowling", hints: ["British author", "Her initials are J.K."], acceptMultiple: ["jk rowling", "rowling"] }
        ],
        middle: [
            { q: "What is the name of the wizard in 'The Lord of the Rings'?", a: "gandalf", hints: ["He's grey, then white", "You shall not pass!"] },
            { q: "Who wrote '1984'?", a: "george orwell", hints: ["Also wrote 'Animal Farm'", "His last name is Orwell"], acceptMultiple: ["orwell"] },
            { q: "What is the first book in 'The Hunger Games' trilogy?", a: "the hunger games", hints: ["Same as the series name", "Katniss volunteers"], acceptMultiple: ["hunger games"] }
        ],
        high: [
            { q: "Who wrote 'To Kill a Mockingbird'?", a: "harper lee", hints: ["Published in 1960", "Her first name is Harper"], acceptMultiple: ["lee"] },
            { q: "What is the name of Jay Gatsby's love in 'The Great Gatsby'?", a: "daisy", hints: ["A flower name", "Married to Tom Buchanan"] }
        ]
    },
    geography: {
        elementary: [
            { q: "What is the largest ocean on Earth?", a: "pacific", hints: ["Borders Asia and Americas", "Starts with P"], acceptMultiple: ["pacific ocean"] },
            { q: "What is the capital of France?", a: "paris", hints: ["The Eiffel Tower is here", "City of Lights"] },
            { q: "How many continents are there?", a: "7", hints: ["Seven continents", "More than 5, less than 10"] }
        ],
        middle: [
            { q: "What is the longest river in the world?", a: "nile", hints: ["Flows through Egypt", "In Africa"], acceptMultiple: ["nile river"] },
            { q: "What is the capital of Japan?", a: "tokyo", hints: ["Largest city in Japan", "Formerly called Edo"] },
            { q: "What mountain range separates Europe and Asia?", a: "ural", hints: ["In Russia", "The ____ Mountains"], acceptMultiple: ["ural mountains", "urals"] }
        ],
        high: [
            { q: "What is the smallest country in the world?", a: "vatican city", hints: ["In the middle of Rome", "The Pope lives here"], acceptMultiple: ["vatican"] },
            { q: "What is the capital of Australia?", a: "canberra", hints: ["Not Sydney or Melbourne", "Starts with C"] }
        ]
    }
};

// Get random question based on grade and subject
function getRandomQuestion(grade, subject) {
    const gradeKey = grade <= 5 ? 'elementary' : grade <= 8 ? 'middle' : 'high';
    const questions = Curriculum[subject]?.[gradeKey];
    
    if (!questions || questions.length === 0) {
        return null;
    }
    
    return questions[Math.floor(Math.random() * questions.length)];
}

// Check if answer is correct (case insensitive, accepts alternatives)
function checkAnswer(userAnswer, correctAnswer, acceptMultiple = []) {
    const normalized = userAnswer.toLowerCase().trim();
    const correct = correctAnswer.toLowerCase().trim();
    
    if (normalized === correct) return true;
    
    // Check alternative answers
    if (acceptMultiple) {
        return acceptMultiple.some(alt => normalized === alt.toLowerCase().trim());
    }
    
    return false;
}

// Get subject for current room based on player position
function getCurrentRoomSubject(playerX, playerZ) {
    // Determine which room player is in based on position
    const roomRanges = [
        { x: [-4, 4], z: [-4, 4], subject: 'math' },
        { x: [6, 14], z: [-3, 3], subject: 'science' },
        { x: [-14, -6], z: [-3, 3], subject: 'history' },
        { x: [-3, 3], z: [6, 14], subject: 'literature' },
        { x: [-3, 3], z: [-14, -6], subject: 'geography' },
        { x: [6, 14], z: [6, 14], subject: 'art' },
        { x: [-14, -6], z: [-14, -6], subject: 'music' }
    ];

    for (let room of roomRanges) {
        if (playerX >= room.x[0] && playerX <= room.x[1] &&
            playerZ >= room.z[0] && playerZ <= room.z[1]) {
            return room.subject;
        }
    }

    // Default to random subject if in corridor
    const subjects = ['math', 'science', 'history', 'literature', 'geography'];
    return subjects[Math.floor(Math.random() * subjects.length)];
}

// Export functions to window for global access
window.getRandomQuestion = getRandomQuestion;
window.checkAnswer = checkAnswer;
window.getCurrentRoomSubject = getCurrentRoomSubject;
